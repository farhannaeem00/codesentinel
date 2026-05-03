from fastapi import HTTPException, status
from pydantic import BaseModel
from bson import ObjectId
from config.database import get_db
from models.scan import scan_schema, create_scan_document
from services.github import fetch_repo_data
from services.file_processor import process_files, get_file_stats
from services.analyzer import analyze_all_files
from services.risk_scorer import build_scan_report
import asyncio

# ── Request Schema ────────────────────────────────────
class StartScanRequest(BaseModel):
    repo_url: str

# ── Start Scan ────────────────────────────────────────
def start_scan(data: StartScanRequest, current_user: dict):
    if not data.repo_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a GitHub repository URL"
        )

    if "github.com" not in data.repo_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only GitHub repositories are supported"
        )

    db  = get_db()
    doc = create_scan_document(current_user["_id"], data.repo_url)
    result = db["scans"].insert_one(doc)
    doc["_id"] = result.inserted_id

    # Start background processing
    asyncio.create_task(process_scan(str(result.inserted_id), data.repo_url))

    return {
        "success": True,
        "scan_id": str(result.inserted_id),
        "status":  "scanning",
        "message": "Scan started. This takes 1-2 minutes.",
    }

# ── Background Scan Processing ────────────────────────
async def process_scan(scan_id: str, repo_url: str):
    db = get_db()
    try:
        print(f"⏳ Processing scan {scan_id}...")

        # Step 1: Fetch repo
        print("📦 Fetching repo...")
        data = await fetch_repo_data(repo_url)

        # Update repo name
        db["scans"].update_one(
            {"_id": ObjectId(scan_id)},
            {"$set": {"repo_name": data["repo_info"]["name"]}}
        )

        # Step 2: Process files
        print("📄 Processing files...")
        processed = process_files(data["files"])
        stats     = get_file_stats(processed)

        # Step 3: AI Analysis
        print("🤖 Running AI analysis...")
        analysis = await analyze_all_files(
            processed,
            data["repo_info"]["name"]
        )

        # Step 4: Build report
        print("📊 Building report...")
        report = build_scan_report(
            data["repo_info"],
            analysis,
            stats,
        )

        # Step 5: Save to MongoDB
        db["scans"].update_one(
            {"_id": ObjectId(scan_id)},
            {"$set": {
                "status":          "done",
                "repo_name":       report["repo_name"],
                "overall_score":   report["overall_score"],
                "risk_level":      report["risk_level"],
                "summary":         report["summary"],
                "total_issues":    report["total_issues"],
                "critical_count":  report["critical_count"],
                "high_count":      report["high_count"],
                "medium_count":    report["medium_count"],
                "low_count":       report["low_count"],
                "total_files":     report["total_files"],
                "total_lines":     report["total_lines"],
                "languages":       report["languages"],
                "files":           report["files"],
                "top_vulnerable":  report["top_vulnerable"],
                "critical_issues": report["critical_issues"],
            }}
        )

        print(f"✅ Scan {scan_id} completed successfully")

    except Exception as e:
        db["scans"].update_one(
            {"_id": ObjectId(scan_id)},
            {"$set": {
                "status":        "error",
                "error_message": str(e),
            }}
        )
        print(f"❌ Scan {scan_id} failed: {e}")

# ── Get All Scans ─────────────────────────────────────
def get_scans(current_user: dict):
    db    = get_db()
    scans = db["scans"].find(
        {"user_id": current_user["_id"]}
    ).sort("created_at", -1)

    return {
        "success": True,
        "count":   db["scans"].count_documents(
            {"user_id": current_user["_id"]}
        ),
        "data": [
            {
                "id":             str(s["_id"]),
                "repo_url":       s["repo_url"],
                "repo_name":      s.get("repo_name", ""),
                "status":         s["status"],
                "overall_score":  s.get("overall_score"),
                "risk_level":     s.get("risk_level", ""),
                "total_issues":   s.get("total_issues", 0),
                "critical_count": s.get("critical_count", 0),
                "created_at":     str(s.get("created_at", "")),
            }
            for s in scans
        ],
    }

# ── Get Single Scan ───────────────────────────────────
def get_scan(scan_id: str, current_user: dict):
    db = get_db()

    try:
        obj_id = ObjectId(scan_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid scan ID"
        )

    scan = db["scans"].find_one({
        "_id":     obj_id,
        "user_id": current_user["_id"],
    })

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )

    return {"success": True, "data": scan_schema(scan)}

# ── Delete Scan ───────────────────────────────────────
def delete_scan(scan_id: str, current_user: dict):
    db = get_db()

    try:
        obj_id = ObjectId(scan_id)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid scan ID"
        )

    scan = db["scans"].find_one_and_delete({
        "_id":     obj_id,
        "user_id": current_user["_id"],
    })

    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found"
        )

    return {"success": True, "message": "Scan deleted successfully"}
