from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import get_db
from routes.auth  import router as auth_router
from routes.scans import router as scan_router
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="CodeSentinel API",
    description="AI-Powered Code Security Scanner",
    version="1.0.0"
)

# ── CORS ──────────────────────────────────────────────
client_url = os.getenv("CLIENT_URL")
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://codesentinelclient.vercel.app",
]

if client_url:
    for url in client_url.split(","):
        url = url.strip()
        if url and url != "*":
            origins.append(url)

origins = list(set(origins))

# Allow explicit origins plus any localhost or *.vercel.app subdomains (including branch/preview deployments)
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|.*\.vercel\.app)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# ── Health Check ──────────────────────────────────────
@app.get("/")
def root():
    return {"message": "✅ CodeSentinel API is running"}

# ── DB Test ───────────────────────────────────────────
@app.get("/test-db")
def test_db():
    try:
        db = get_db()
        db.command("ping")
        return {"message": "✅ MongoDB connected successfully"}
    except Exception as e:
        return {"message": f"❌ Connection failed: {str(e)}"}

# ── Routers ───────────────────────────────────────────
app.include_router(auth_router)
app.include_router(scan_router)