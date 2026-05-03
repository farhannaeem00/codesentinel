# ── Risk Level from Score ─────────────────────────────
def get_risk_level(score: int) -> str:
    if score >= 90: return "secure"
    if score >= 70: return "low"
    if score >= 50: return "medium"
    if score >= 30: return "high"
    return "critical"

# ── Risk Color for Frontend ───────────────────────────
def get_risk_color(score: int) -> str:
    if score >= 90: return "green"
    if score >= 70: return "blue"
    if score >= 50: return "yellow"
    if score >= 30: return "orange"
    return "red"

# ── Score a Single File ───────────────────────────────
def score_file(analyzed_file: dict) -> dict:
    score = analyzed_file["security_score"]
    return {
        **analyzed_file,
        "risk_level": get_risk_level(score),
        "risk_color": get_risk_color(score),
    }

# ── Score All Files ───────────────────────────────────
def score_all_files(analyzed_files: list[dict]) -> list[dict]:
    scored = [score_file(f) for f in analyzed_files]

    # Sort: most vulnerable first
    scored.sort(key=lambda x: x["security_score"])
    return scored

# ── Get Top Vulnerable Files ──────────────────────────
def get_top_vulnerable_files(
    scored_files: list[dict],
    limit: int = 5
) -> list[dict]:
    return [
        {
            "path":           f["path"],
            "name":           f["name"],
            "language":       f["language"],
            "security_score": f["security_score"],
            "risk_level":     f["risk_level"],
            "issue_count":    f["issue_count"],
            "critical_count": f["critical_count"],
        }
        for f in scored_files[:limit]
    ]

# ── Get All Critical Issues Across Files ─────────────
def get_all_critical_issues(scored_files: list[dict]) -> list[dict]:
    critical_issues = []

    for f in scored_files:
        for issue in f.get("issues", []):
            if issue["severity"] in ["critical", "high"]:
                critical_issues.append({
                    "file":           f["path"],
                    "title":          issue["title"],
                    "severity":       issue["severity"],
                    "line_reference": issue.get("line_reference", ""),
                    "description":    issue["description"],
                    "fix":            issue["fix"],
                })

    # Sort: critical first then high
    critical_issues.sort(
        key=lambda x: 0 if x["severity"] == "critical" else 1
    )
    return critical_issues

# ── Build Final Scan Report ───────────────────────────
def build_scan_report(
    repo_info:      dict,
    analysis:       dict,
    file_stats:     dict,
) -> dict:
    scored_files     = score_all_files(analysis["files"])
    top_vulnerable   = get_top_vulnerable_files(scored_files)
    critical_issues  = get_all_critical_issues(scored_files)
    overall_score    = analysis["overall_score"]

    return {
        # ── Repo Info ──
        "repo_name":    repo_info["name"],
        "repo_url":     f"https://github.com/{repo_info['full_name']}",
        "language":     repo_info["language"],
        "description":  repo_info.get("description", ""),

        # ── Scores ──
        "overall_score":  overall_score,
        "risk_level":     get_risk_level(overall_score),
        "risk_color":     get_risk_color(overall_score),
        "summary":        analysis["summary"],

        # ── Issue Counts ──
        "total_issues":   analysis["total_issues"],
        "critical_count": analysis["critical_count"],
        "high_count":     analysis["high_count"],
        "medium_count":   analysis["medium_count"],
        "low_count":      analysis["low_count"],

        # ── File Stats ──
        "total_files":     file_stats["total_files"],
        "total_lines":     file_stats["total_lines"],
        "languages":       file_stats["languages"],

        # ── Detailed Data ──
        "top_vulnerable":  top_vulnerable,
        "critical_issues": critical_issues,
        "files":           scored_files,
    }