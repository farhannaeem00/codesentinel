import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Build Prompt Based on File Type ──────────────────
def build_prompt(file: dict) -> str:
    language = file["language"]
    path     = file["path"]
    content  = file["content"]

    # ── Extra checks based on file type ──────────────
    extra_checks = ""

    if language in ["JavaScript", "JavaScript (React)", "TypeScript", "TypeScript (React)"]:
        extra_checks = """
Extra checks for JavaScript/TypeScript:
- eval() or Function() usage
- dangerouslySetInnerHTML usage
- Unvalidated user inputs
- Missing CSRF protection
- Insecure use of localStorage for sensitive data
- Exposed API keys or tokens in code
- Prototype pollution vulnerabilities
"""

    elif language == "Python":
        extra_checks = """
Extra checks for Python:
- exec() or eval() usage
- Pickle deserialization
- Shell injection via subprocess
- SQL queries built with string concatenation
- Hardcoded credentials
- Insecure random number generation
- Path traversal vulnerabilities
"""

    elif language == "PHP":
        extra_checks = """
Extra checks for PHP:
- SQL injection via $_GET/$_POST
- eval() usage
- File inclusion vulnerabilities
- XSS via unescaped output
- Remote code execution risks
- Insecure file uploads
"""

    elif language in ["Environment File"]:
        extra_checks = """
Extra checks for .env files:
- Exposed production credentials
- Hardcoded API keys
- Database passwords visible
- Secret keys exposed
- Any sensitive values that should be rotated
"""

    elif language == "SQL":
        extra_checks = """
Extra checks for SQL:
- Missing parameterized queries
- Exposed sensitive table structures
- Missing access controls
- Unencrypted sensitive columns
"""

    elif language == "JSON":
        extra_checks = """
Extra checks for JSON:
- Exposed API keys or tokens
- Hardcoded credentials
- Sensitive configuration exposed
- Insecure dependency versions
"""

    return f"""
You are a senior security engineer performing a code security audit.
Analyze this file for security vulnerabilities, bad practices, and technical debt.
Respond ONLY with valid JSON. No explanation, no markdown, no extra text.

FILE PATH: {path}
LANGUAGE:  {language}

CODE:
\"\"\"
{content}
\"\"\"

General security checks:
- SQL injection vulnerabilities
- Cross-Site Scripting (XSS)
- Hardcoded secrets, passwords, API keys
- Insecure authentication or authorization
- Sensitive data exposure
- Insecure direct object references
- Security misconfigurations
- Using components with known vulnerabilities
{extra_checks}

Respond with EXACTLY this JSON structure:
{{
  "security_score": 75,
  "issues": [
    {{
      "title":          "SQL Injection Risk",
      "severity":       "critical",
      "line_reference": "Line 45-47",
      "description":    "Plain English description of the exact issue",
      "fix":            "Exact code fix or step-by-step recommendation"
    }}
  ],
  "summary": "One sentence summary of this file security status"
}}

Severity rules:
- "critical" → can lead to data breach, remote code execution, auth bypass
- "high"     → serious vulnerability that should be fixed immediately
- "medium"   → moderate risk, should be addressed soon
- "low"      → minor issue or best practice violation

Score rules:
- 90-100 → clean, secure code
- 70-89  → minor issues only
- 50-69  → moderate issues present
- 30-49  → serious vulnerabilities found
- 0-29   → critically vulnerable

Return ONLY the JSON object. Nothing else.
"""

# ── Analyze Single File ───────────────────────────────
async def analyze_file(file: dict) -> dict:
    prompt   = build_prompt(file)
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}],
    )

    content = response.choices[0].message.content.strip()
    cleaned = content \
        .replace("```json", "") \
        .replace("```", "") \
        .strip()

    try:
        parsed = json.loads(cleaned)
    except Exception as e:
        raise ValueError(f"AI returned invalid JSON: {e}")

    if (
        "security_score" not in parsed or
        "issues"         not in parsed or
        "summary"        not in parsed
    ):
        raise ValueError("AI response missing required fields")

    return {
        "path":           file["path"],
        "name":           file["name"],
        "language":       file["language"],
        "security_score": parsed["security_score"],
        "issues":         parsed["issues"],
        "summary":        parsed["summary"],
        "issue_count":    len(parsed["issues"]),
        "critical_count": sum(1 for i in parsed["issues"] if i["severity"] == "critical"),
        "high_count":     sum(1 for i in parsed["issues"] if i["severity"] == "high"),
        "medium_count":   sum(1 for i in parsed["issues"] if i["severity"] == "medium"),
        "low_count":      sum(1 for i in parsed["issues"] if i["severity"] == "low"),
    }

# ── Calculate Overall Score ───────────────────────────
def calculate_overall_score(analyzed_files: list[dict]) -> int:
    if not analyzed_files:
        return 100

    # Weight critical files more heavily
    total_weight = 0
    weighted_sum = 0

    for f in analyzed_files:
        # Files with critical issues count 3x
        # Files with high issues count 2x
        # Others count 1x
        weight = 1
        if f["critical_count"] > 0: weight = 3
        elif f["high_count"] > 0:   weight = 2

        weighted_sum += f["security_score"] * weight
        total_weight += weight

    return round(weighted_sum / total_weight)

# ── Get Issue Summary ─────────────────────────────────
def get_issue_summary(analyzed_files: list[dict]) -> dict:
    total    = sum(f["issue_count"]    for f in analyzed_files)
    critical = sum(f["critical_count"] for f in analyzed_files)
    high     = sum(f["high_count"]     for f in analyzed_files)
    medium   = sum(f["medium_count"]   for f in analyzed_files)
    low      = sum(f["low_count"]      for f in analyzed_files)

    return {
        "total_issues":   total,
        "critical_count": critical,
        "high_count":     high,
        "medium_count":   medium,
        "low_count":      low,
    }

# ── Generate Overall Summary ──────────────────────────
def generate_overall_summary(
    overall_score:  int,
    issue_summary:  dict,
    repo_name:      str,
) -> str:
    score = overall_score
    total = issue_summary["total_issues"]
    crit  = issue_summary["critical_count"]

    if score >= 90:
        return f"{repo_name} has excellent security with only {total} minor issues found."
    elif score >= 70:
        return f"{repo_name} has good security but {total} issues need attention including {crit} critical."
    elif score >= 50:
        return f"{repo_name} has moderate security risks with {total} issues found. Immediate attention recommended."
    else:
        return f"{repo_name} has serious security vulnerabilities. {crit} critical issues require urgent fixes."

# ── Analyze All Files ─────────────────────────────────
async def analyze_all_files(
    processed_files: list[dict],
    repo_name:       str = "Repository",
) -> dict:
    analyzed_files = []

    for file in processed_files:
        try:
            print(f"🔍 Analyzing: {file['path']}")
            result = await analyze_file(file)
            analyzed_files.append(result)
        except Exception as e:
            print(f"⚠️ Skipping {file['path']}: {e}")
            analyzed_files.append({
                "path":           file["path"],
                "name":           file["name"],
                "language":       file["language"],
                "security_score": 100,
                "issues":         [],
                "summary":        "Could not analyze this file.",
                "issue_count":    0,
                "critical_count": 0,
                "high_count":     0,
                "medium_count":   0,
                "low_count":      0,
            })

    overall_score = calculate_overall_score(analyzed_files)
    issue_summary = get_issue_summary(analyzed_files)
    summary       = generate_overall_summary(
        overall_score, issue_summary, repo_name
    )

    return {
        "overall_score": overall_score,
        "summary":       summary,
        "files":         analyzed_files,
        **issue_summary,
    }