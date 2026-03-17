# DataTalkAI

Working prototype for "Conversational AI for Instant Business Intelligence Dashboards".

## What It Does

- accepts plain-English business prompts
- converts them into SQL against a generated customer behavior dataset
- returns chart suggestions, insights, and tabular results
- renders a dashboard in the browser
- supports CSV upload for querying custom datasets

## Run Locally

1. Open a terminal in `DataTalkAI/backend`
2. Install dependencies:
   `py -3 -m pip install -r requirements.txt`
3. Optional: create `backend/.env` and add:
   `GEMINI_API_KEY=your_actual_key`
4. Start the app:
   `py -3 -m uvicorn main:app --reload`
5. Open:
   `http://127.0.0.1:8000`

## Demo Prompts

- `Compare average online spend by shopping preference`
- `Show the distribution of customers by city tier`
- `Compare average store visits by gender`
- `Show the relationship between tech savvy score and average online spend`

## Notes

- If `GEMINI_API_KEY` is set, the backend will try Gemini first.
- You can store the key in [backend/.env.example](c:\Users\Prachi Garg\OneDrive\Desktop\DataTalk_AI\DataTalkAI\backend\.env.example) by copying it to `backend/.env`.
- If Gemini is unavailable, the app falls back to a built-in rule-based query engine so the demo still works.
- The default generated dataset follows the customer-behavior schema from the provided data dictionary PDF.
