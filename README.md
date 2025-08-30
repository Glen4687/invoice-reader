# Invoice Extractor AI

This project is a web application that uses AI to extract structured data from PDF invoices. Users can upload an invoice, and the application will parse the document to return a clean JSON object containing the invoice details.

## Technology Stack

- **Frontend:** HTML, JavaScript, [Pico.css](https://picocss.com/)
- **Backend:** Python with [FastAPI](https://fastapi.tiangolo.com/)
- **AI Integration:** [OpenAI API (GPT-4o)](https://openai.com/)
- **PDF Parsing:** [PyMuPDF](https://pymupdf.readthedocs.io/en/latest/)

## Project Structure

This project is structured for easy deployment on [Vercel](https://vercel.com/).

- `/frontend`: Contains the static HTML, CSS, and JavaScript for the user interface.
- `/api`: Contains the Python FastAPI backend, structured as a Vercel serverless function.
- `requirements.txt`: Lists the Python dependencies for the backend.

## Local Development Setup

To run this application on your local machine, follow these steps.

### Prerequisites

- Python 3.8+
- Node.js (for `vercel dev`)
- An OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/Glen4687/invoice-reader.git
cd invoice-reader
```

### 2. Configure Backend

- **Install Dependencies:** Install the required Python packages.
  ```bash
  pip install -r requirements.txt
  ```
- **Set API Key:** Create a `.env` file in the `/api` directory by copying the example file.
  ```bash
  cp api/.env.example api/.env
  ```
- **Add Your Key:** Open `api/.env` and add your OpenAI API key.
  ```
  OPENAI_API_KEY="sk-..."
  ```

### 3. Run the Application

The easiest way to run the full application (both frontend and backend) is to use the Vercel CLI.

- **Install Vercel CLI:**
  ```bash
  npm install -g vercel
  ```
- **Run the Development Server:**
  ```bash
  vercel dev
  ```

Your application will be available at `http://localhost:3000`.

## Deployment

This repository is ready to be deployed directly to Vercel. Connect your Git repository to a new Vercel project, and it will be deployed automatically.
