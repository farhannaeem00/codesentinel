from fastapi import APIRouter, Depends
from controllers.scan import (
    StartScanRequest,
    start_scan,
    get_scans,
    get_scan,
    delete_scan,
)
from middleware.auth import get_current_user

router = APIRouter(prefix="/api/scans", tags=["Scans"])

@router.post("/")
async def create_scan(
    data:         StartScanRequest,
    current_user: dict = Depends(get_current_user)
):
    return await start_scan(data, current_user)

@router.get("/")
def list_scans(current_user: dict = Depends(get_current_user)):
    return get_scans(current_user)

@router.get("/{scan_id}")
def retrieve_scan(
    scan_id:      str,
    current_user: dict = Depends(get_current_user)
):
    return get_scan(scan_id, current_user)

@router.delete("/{scan_id}")
def remove_scan(
    scan_id:      str,
    current_user: dict = Depends(get_current_user)
):
    return delete_scan(scan_id, current_user)
