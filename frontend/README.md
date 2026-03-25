# sESG Analytics Platform

A full-stack ESG (Environmental, Social & Governance) analytics platform built with **React + FastAPI**. Search any publicly traded company to view interactive ESG dashboards, peer benchmarking, and generate branded PDF client reports.

## Features

- **Company Search** — Search any publicly traded company by ticker symbol
- **ESG Score Dashboard** — Environmental, Social & Governance scores with color-coded risk levels
- **Radar Chart** — Visual comparison of company vs industry average
- **Peer Benchmarking** — Ranked bar chart of top 10 industry peers
- **Custom Weighting** — Adjust E/S/G weight sliders to reflect client priorities
- **Compare Page** — Side-by-side comparison of up to 5 companies
- **PDF Report Generation** — Download a branded client-ready ESG report
- **Deployed** — Live on Vercel (frontend) + Render (backend)

---

## Tech Stack

| Layer           | Technology                |
| --------------- | ------------------------- |
| Frontend        | React 18 + Vite           |
| Styling         | Tailwind CSS              |
| Charts          | Plotly.js                 |
| Routing         | React Router v6           |
| Backend         | FastAPI (Python)          |
| Data            | yfinance + pandas + numpy |
| PDF Generation  | ReportLab                 |
| Frontend Deploy | Vercel                    |
| Backend Deploy  | Render                    |

---

## Running Locally

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`
API docs at: `http://127.0.0.1:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint                       | Description                |
| ------ | ------------------------------ | -------------------------- |
| GET    | `/api/company/{ticker}`      | ESG scores + company info  |
| GET    | `/api/industry/{sector}`     | Top 10 peer ESG scores     |
| GET    | `/api/sectors`               | List available sectors     |
| GET    | `/api/compare?tickers=A,B,C` | Compare multiple companies |
| POST   | `/api/composite/{ticker}`    | Custom weighted ESG score  |
| POST   | `/api/report/{ticker}`       | Generate PDF report        |

---

## Project Structure

```
esg-platform/
├── backend/
│   ├── main.py                 # FastAPI app + all routes
│   ├── requirements.txt
│   └── services/
│       ├── esg_service.py      # ESG data fetching + processing
│       └── report_service.py   # PDF generation
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx        # Search landing page
        │   ├── Dashboard.jsx   # ESG dashboard
        │   └── Compare.jsx     # Multi-company comparison
        ├── components/
        │   ├── ESGScoreCard.jsx
        │   ├── RadarChart.jsx
        │   ├── PeerBarChart.jsx
        │   ├── WeightSliders.jsx
        │   └── ReportButton.jsx
        └── api/
            └── esgApi.js       # All API calls
```

---

## Skills Demonstrated

`React` `FastAPI` `Python` `REST API Design` `pandas` `Data Visualization` `Plotly.js` `Tailwind CSS` `PDF Generation` `Cloud Deployment` `Git`

---

## License

MIT License — feel free to use this project as a portfolio piece.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
