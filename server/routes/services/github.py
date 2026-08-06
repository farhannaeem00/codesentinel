import httpx
import os
import base64
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# ── Supported Code File Extensions ───────────────────
CODE_EXTENSIONS = [
    ".js", ".jsx", ".ts", ".tsx",
    ".py", ".php", ".java", ".cs",
    ".cpp", ".c", ".go", ".rb",
    ".env", ".json", ".yml", ".yaml",
    ".sql", ".html", ".css"
]

# ── Headers ───────────────────────────────────────────
def get_headers():
    headers = {"Accept": "application/vnd.github.v3+json"}
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    return headers

# ── Parse Repo URL ────────────────────────────────────
def parse_repo_url(url: str) -> tuple[str, str]:
    """
    Extract owner and repo name from GitHub URL
    e.g. https://github.com/farhannaeem00/contractsense
    → ("farhannaeem00", "contractsense")
    """
    url   = url.rstrip("/")
    parts = url.replace("https://github.com/", "").split("/")

    if len(parts) < 2:
        raise ValueError("Invalid GitHub URL. Format: https://github.com/owner/repo")

    return parts[0], parts[1]

# ── Get Repo Info ─────────────────────────────────────
async def get_repo_info(owner: str, repo: str) -> dict:
    url = f"https://api.github.com/repos/{owner}/{repo}"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_headers())

    if response.status_code == 404:
        raise ValueError(f"Repository not found: {owner}/{repo}")
    if response.status_code == 403:
        raise ValueError("GitHub API rate limit exceeded. Try again later.")
    if response.status_code != 200:
        raise ValueError(f"GitHub API error: {response.status_code}")

    data = response.json()
    return {
        "name":        data["name"],
        "full_name":   data["full_name"],
        "description": data.get("description", ""),
        "language":    data.get("language", "Unknown"),
        "stars":       data["stargazers_count"],
        "forks":       data["forks_count"],
        "private":     data["private"],
    }

# ── Get All Files Recursively ─────────────────────────
async def get_repo_files(owner: str, repo: str) -> list[dict]:
    url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/HEAD?recursive=1"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_headers())

    if response.status_code != 200:
        raise ValueError(f"Could not fetch repo files: {response.status_code}")

    tree  = response.json().get("tree", [])
    files = []

    for item in tree:
        if item["type"] != "blob":
            continue

        path = item["path"]
        ext  = "." + path.split(".")[-1] if "." in path else ""

        if ext.lower() in CODE_EXTENSIONS:
            files.append({
                "path": path,
                "size": item.get("size", 0),
                "url":  item.get("url", ""),
            })

    # Sort by size — smaller files first
    # Skip files larger than 50KB to avoid token limits
    files = [f for f in files if f["size"] < 50000]

    # Limit to 20 files max
    return files[:20]

# ── Get File Content ──────────────────────────────────
async def get_file_content(file_url: str) -> str:
    async with httpx.AsyncClient() as client:
        response = await client.get(file_url, headers=get_headers())

    if response.status_code != 200:
        return ""

    data    = response.json()
    content = data.get("content", "")
    encoding = data.get("encoding", "")

    if encoding == "base64":
        try:
            return base64.b64decode(content).decode("utf-8", errors="ignore")
        except Exception:
            return ""

    return content

# ── Fetch Full Repo Data ──────────────────────────────
async def fetch_repo_data(repo_url: str) -> dict:
    owner, repo = parse_repo_url(repo_url)

    # Get repo info
    repo_info = await get_repo_info(owner, repo)

    # Get all code files
    files = await get_repo_files(owner, repo)

    # Fetch content for each file
    files_with_content = []
    for file in files:
        content = await get_file_content(file["url"])
        if content:
            files_with_content.append({
                "path":    file["path"],
                "size":    file["size"],
                "content": content[:3000], # limit to 3000 chars per file
            })

    return {
        "repo_info": repo_info,
        "files":     files_with_content,
    }
