from fastapi.responses import Response
from services.report_service import generate_esg_report
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.esg_service import (
    get_company_esg,
    get_industry_peers,
    calculate_composite_score,
    INDUSTRY_PEERS,
)

app = FastAPI(
    title="ESG Analytics API",
    description="Live ESG data, peer benchmarking, and report generation",
    version="1.0.0"
)

# --- CORS: Allow React frontend to talk to this backend ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Request body model for composite score ---
class WeightInput(BaseModel):
    environmental: float = 0.4
    social: float = 0.35
    governance: float = 0.25


# ─────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "ESG Analytics API is running ✅"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/api/company/{ticker}")
def get_company(ticker: str):
    """
    Get ESG scores + company info for a ticker (e.g. AAPL, MSFT)
    """
    data = get_company_esg(ticker)
    if "error" in data and not data.get("esg_available"):
        raise HTTPException(status_code=404, detail=data["error"])
    return data


@app.get("/api/industry/{sector}")
def get_industry(sector: str):
    """
    Get ESG peer comparison for a sector.
    Valid sectors: Technology, Energy, Healthcare, Finance, Consumer
    """
    valid_sectors = list(INDUSTRY_PEERS.keys())
    if sector not in valid_sectors:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid sector. Choose from: {valid_sectors}"
        )
    peers = get_industry_peers(sector)
    return {"sector": sector, "peers": peers}


@app.get("/api/sectors")
def get_sectors():
    """Return list of available sectors"""
    return {"sectors": list(INDUSTRY_PEERS.keys())}


@app.post("/api/composite/{ticker}")
def get_composite(ticker: str, weights: WeightInput):
    """
    Calculate a custom weighted ESG composite score.
    Send weights in request body: { environmental, social, governance }
    """
    data = get_company_esg(ticker)
    if not data.get("esg_available"):
        raise HTTPException(status_code=404, detail="ESG data not available")

    scores = data["scores"]
    composite = calculate_composite_score(scores, weights.model_dump())

    return {
        "ticker": ticker.upper(),
        "company_name": data["company_name"],
        "composite_score": composite,
        "weights_used": weights.model_dump(),
        "raw_scores": scores,
    }


@app.get("/api/compare")
def compare_companies(tickers: str):
    """
    Compare multiple companies. Pass comma-separated tickers.
    Example: /api/compare?tickers=AAPL,MSFT,GOOGL
    """
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    if len(ticker_list) > 5:
        raise HTTPException(status_code=400, detail="Maximum 5 tickers at once")

    results = []
    for ticker in ticker_list:
        data = get_company_esg(ticker)
        if data.get("esg_available"):
            results.append({
                "ticker": data["ticker"],
                "company_name": data["company_name"],
                "scores": data["scores"],
            })

    return {"companies": results, "count": len(results)}

@app.post("/api/report/{ticker}")
def download_report(ticker: str):
    """Generate and return a PDF ESG report for a ticker"""
    data = get_company_esg(ticker)
    if not data.get("esg_available"):
        raise HTTPException(status_code=404, detail="ESG data not available")

    pdf_bytes = generate_esg_report(data)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=ESG_Report_{ticker}.pdf"
        }
    )