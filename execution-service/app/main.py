from fastapi import FastAPI
from app.routes.submissions import router as submissions_router

app = FastAPI(
    title="Open edX Programming Assessment - Execution Service",
    description="Secure execution API for Python, Java and C++ submissions.",
    version="1.0.0",
)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "execution-service"}

app.include_router(submissions_router, prefix="/api/v1")
