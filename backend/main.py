import os
import csv
import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="ASTRA Astronomy API",
    description="Explore astronomical anomaly candidates",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        *[
            origin.strip()
            for origin in os.getenv("ASTRA_FRONTEND_URL", "").split(",")
            if origin.strip()
        ],
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Use only the astronomy project on the Desktop.
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

NOTEBOOK_DIR = BASE_DIR / "notebooks"

FILES = {
    "candidates": DATA_DIR / "results" / "final_anomaly_catalog_20261017.csv",
    "validated": DATA_DIR / "results" / "candidates" / "validated_candidates.csv",
    "multimodal": DATA_DIR / "results" / "candidates" / "multimodal_candidates.csv",
    "features": DATA_DIR / "processed" / "feature_matrix.csv",
}

def read_csv_file(file_path):
    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"CSV file not found: {file_path.name}",
        )

    try:
        with file_path.open(
            "r", encoding="utf-8-sig", newline=""
        ) as file:
            return list(csv.DictReader(file))
    except (OSError, csv.Error) as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not read {file_path.name}: {error}",
        )

def find_by_source_id(file_path, source_id):
    rows = read_csv_file(file_path)

    for row in rows:
        if str(row.get("source_id", "")).strip() == str(source_id).strip():
            return row

    return None

@app.get("/")
def home():
    return {
        "project": "ASTRA",
        "message": "Astronomy API is running",
        "status": "online",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "ASTRA backend",
    }


@app.get("/api/data-status")
def data_status():
    return {
        name: {
            "available": path.is_file(),
            "file": path.name,
        }
        for name, path in FILES.items()
    }


@app.get("/api/candidates")
def get_candidates():
    rows = read_csv_file(FILES["candidates"])
    return {
        "count": len(rows),
        "candidates": rows,
    }

@app.get("/api/candidates/{source_id}")
def get_candidate_details(source_id: str):

    # Find the selected object in the final catalogue.
    candidate = find_by_source_id(
        FILES["candidates"], source_id
    )

    if candidate is None:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found in the final catalogue",
        )

    # Retrieve additional information from the other datasets.
    validated = find_by_source_id(
        FILES["validated"], source_id
    )

    multimodal = find_by_source_id(
        FILES["multimodal"], source_id
    )

    features = find_by_source_id(
        FILES["features"], source_id
    )

    return {
        "source_id": source_id,

        "identity": {
            "source_id": candidate.get("source_id"),
            "ra": candidate.get("ra"),
            "dec": candidate.get("dec"),
            "coordinates": candidate.get("RA_Dec_J2000"),
        },

        "anomaly": {
            "final_score": candidate.get("Anomaly_Score"),
            "astrometry_score": (
                validated.get("score_Astrometry")
                if validated else None
            ),
            "photometry_score": (
                validated.get("score_Photometry")
                if validated else None
            ),
            "temporal_score": (
                validated.get("score_Temporal")
                if validated else None
            ),
            "astro_photo_score": (
                validated.get("score_Astro_Photo")
                if validated else None
            ),
            "fused_score": (
                validated.get("score_All_Fused")
                if validated else None
            ),
        },

        "astrometry": {
            "proper_motion_total": (
                validated.get("proper_motion_total")
                if validated else None
            ),
            "tangential_velocity": (
                validated.get("tangential_velocity")
                if validated else None
            ),
            "parallax_snr": (
                validated.get("parallax_snr")
                if validated else None
            ),
        },

        "photometry": {
            "absolute_magnitude_g": (
                validated.get("absolute_magnitude_g")
                if validated else None
            ),
            "bp_rp": (
                validated.get("bp_rp")
                if validated else None
            ),
        },

        "temporal": {
            "data_type": "Simulated light curves",
            "lc_mean": validated.get("lc_mean") if validated else None,
            "lc_std": validated.get("lc_std") if validated else None,
            "lc_amplitude": validated.get("lc_amplitude") if validated else None,
            "lc_skew": validated.get("lc_skew") if validated else None,
            "lc_kurtosis": validated.get("lc_kurtosis") if validated else None,
            "lc_period": validated.get("lc_period") if validated else None,
            "lc_max_power": validated.get("lc_max_power") if validated else None,
        },

        "simbad": {
            "object_id": validated.get("simbad_id") if validated else None,
            "object_type": validated.get("object_type") if validated else None,
            "known_object": validated.get("known_object") if validated else None,
            "match_status": validated.get("match_status") if validated else None,
        },

        "dataset_records": {
            "validated": validated is not None,
            "multimodal": multimodal is not None,
            "feature_matrix": features is not None,
        },

        "raw_data": {
            "validated": validated,
            "multimodal": multimodal,
            "feature_matrix": features,
        },

        "interpretation_note": (
            "Temporal features are derived from simulated light curves, "
            "not actual Gaia time-series observations."
        ),
    }

@app.get("/api/validated")
def get_validated_candidates():
    rows = read_csv_file(FILES["validated"])
    return {
        "count": len(rows),
        "candidates": rows,
    }


@app.get("/api/multimodal")
def get_multimodal_candidates():
    rows = read_csv_file(FILES["multimodal"])
    return {
        "count": len(rows),
        "candidates": rows,
    }


@app.get("/api/features")
def get_features():
    rows = read_csv_file(FILES["features"])
    return {
        "count": len(rows),
        "features": rows,
    }
@app.get("/api/notebooks/{notebook_name}")
def get_notebook(notebook_name: str):
    if not notebook_name.endswith(".ipynb"):
        raise HTTPException(
            status_code=400,
            detail="Only Jupyter notebook files are allowed",
        )

    notebook_path = (
        NOTEBOOK_DIR / notebook_name
    ).resolve()

    if notebook_path.parent != NOTEBOOK_DIR.resolve():
        raise HTTPException(
            status_code=400,
            detail="Invalid notebook path",
        )

    if not notebook_path.is_file():
        raise HTTPException(
            status_code=404,
            detail=f"Notebook not found: {notebook_name}",
        )

    try:
        with notebook_path.open(
            "r", encoding="utf-8"
        ) as file:
            return json.load(file)

    except (OSError, json.JSONDecodeError) as error:
        raise HTTPException(
            status_code=500,
            detail=f"Could not read notebook: {error}",
        )