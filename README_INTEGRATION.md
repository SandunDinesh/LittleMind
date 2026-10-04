# Child Art — integrated frontend and backend

## Requirements
- Node.js >= 20.9 (Next.js 16); Python 3.11–3.13 recommended.
- The included joblib files require a compatible scikit-learn version. If they fail to load, retrain using the included training script and dataset; do not assume the synthetic metrics establish clinical validity.

## Start backend
```bash
cd child_art_graph_analysis_toolkit
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# Linux/macOS: source .venv/bin/activate
pip install -r requirements-api.txt
uvicorn api:app --host 127.0.0.1 --port 8000
```
Verify http://127.0.0.1:8000/health and http://127.0.0.1:8000/docs.

## Start frontend (another terminal)
```bash
cd childarts-main/childarts-main
# copy .env.example to .env.local
npm install --legacy-peer-deps
npm run dev
```
Open http://localhost:3000/analyze. For production use `npm run build` then `npm run start`. Set BACKEND_URL in your server environment to the reachable Python backend address. Use a reverse proxy with HTTPS and access controls for public deployments.

## Request/response
The browser posts multipart image and child age to the Next.js `/api/analyze` route. Next.js forwards it to FastAPI. FastAPI validates JPEG/PNG and size, extracts OpenCV features, runs both bundled ML models, and returns JSON for the real results dashboard. The image is written to a temporary file and removed after analysis; no image database or user authentication is provided.

## Deployment limitations
This is a working integration package, **not a clinically validated or production-certified service**. Before processing real children's data, implement consent, authentication, rate limiting, logging controls, privacy/data-retention policy, security review, monitoring, and professional validation. Models were developed/evaluated on synthetic data; results must not be used to diagnose children.
