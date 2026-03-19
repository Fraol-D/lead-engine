# Lead Engine

Lead Engine is a simple full-stack web app that helps early-stage founders find and organize leads for outreach.

## Stack

- Frontend: React (functional components) + Tailwind CSS
- Backend: Node.js + Express
- Data: In-memory seed data (24 leads) with simulated keyword-based generation when no matches are found

## Project Structure

- `frontend/` React app with landing page and dashboard
- `backend/` Express API for lead retrieval, note updates, and message generation

## API Routes

- `GET /api/health` health check
- `GET /api/leads?keyword=AI%20SaaS` list leads + summary cards data
- `PATCH /api/leads/:id` update notes or status (`hot`, `warm`, `cold`)
- `POST /api/leads/:id/message` generate outreach message for a lead

## Run Locally

From the root folder:

```bash
npm install
npm run dev
```

Apps run at:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Notes

- No authentication is included.
- No paid APIs are used.
- Lead generation is simulated for demo purposes.
