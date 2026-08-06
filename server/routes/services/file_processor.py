import os

# ── Language Detection ────────────────────────────────
EXTENSION_MAP = {
    ".js":   "JavaScript",
    ".jsx":  "JavaScript (React)",
    ".ts":   "TypeScript",
    ".tsx":  "TypeScript (React)",
    ".py":   "Python",
    ".php":  "PHP",
    ".java": "Java",
    ".cs":   "C#",
    ".cpp":  "C++",
    ".c":    "C",
    ".go":   "Go",
    ".rb":   "Ruby",
    ".env":  "Environment File",
    ".json": "JSON",
    ".yml":  "YAML",
    ".yaml": "YAML",
    ".sql":  "SQL",
    ".html": "HTML",
    ".css":  "CSS",
}

# ── High Risk File Types ──────────────────────────────
HIGH_RISK_EXTENSIONS = [".env", ".sql", ".json"]

# ── Get Language from Extension ───────────────────────
def get_language(file_path: str) -> str:
    ext = "." + file_path.split(".")[-1].lower() if "." in file_path else ""
    return EXTENSION_MAP.get(ext, "Unknown")

# ── Get File Extension ────────────────────────────────
def get_extension(file_path: str) -> str:
    return "." + file_path.split(".")[-1].lower() if "." in file_path else ""

# ── Check if High Risk File ───────────────────────────
def is_high_risk_file(file_path: str) -> bool:
    ext = get_extension(file_path)
    return ext in HIGH_RISK_EXTENSIONS

# ── Get File Name from Path ───────────────────────────
def get_file_name(file_path: str) -> str:
    return file_path.split("/")[-1]

# ── Chunk Content for AI ──────────────────────────────
def chunk_content(content: str, max_chars: int = 2500) -> str:
    """
    Limit content to max_chars for AI token limits
    Keep the most important parts (start + end)
    """
    if len(content) <= max_chars:
        return content

    half     = max_chars // 2
    start    = content[:half]
    end      = content[-half:]
    return f"{start}\n\n... [truncated] ...\n\n{end}"

# ── Process Single File ───────────────────────────────
def process_file(file: dict) -> dict:
    path     = file["path"]
    content  = file["content"]
    language = get_language(path)
    ext      = get_extension(path)

    return {
        "path":         path,
        "name":         get_file_name(path),
        "language":     language,
        "extension":    ext,
        "size":         file.get("size", 0),
        "is_high_risk": is_high_risk_file(path),
        "content":      chunk_content(content),
        "line_count":   len(content.splitlines()),
    }

# ── Process All Files ─────────────────────────────────
def process_files(files: list[dict]) -> list[dict]:
    processed = []

    for file in files:
        try:
            processed_file = process_file(file)
            processed.append(processed_file)
        except Exception as e:
            print(f"Error processing {file.get('path', 'unknown')}: {e}")
            continue

    # Sort: high risk files first
    processed.sort(key=lambda x: (not x["is_high_risk"], x["path"]))

    return processed

# ── Get Summary Stats ─────────────────────────────────
def get_file_stats(processed_files: list[dict]) -> dict:
    languages = {}
    for f in processed_files:
        lang = f["language"]
        languages[lang] = languages.get(lang, 0) + 1

    return {
        "total_files":      len(processed_files),
        "high_risk_files":  sum(1 for f in processed_files if f["is_high_risk"]),
        "total_lines":      sum(f["line_count"] for f in processed_files),
        "languages":        languages,
    }