# AI Invoice Extractor

This project is a web application that uses AI to extract structured data from PDF invoices. Users can upload an invoice, and the application will return a clean, formatted view of the extracted information, such as invoice ID, vendor/customer details, and line items.

## Features

- **PDF Upload:** Simple interface to upload PDF invoice files.
- **AI-Powered Extraction:** Leverages OpenAI's GPT-4o model to parse the document text and extract data based on a detailed prompt.
- **Clean Data Presentation:** Filters out empty fields and displays the extracted information in a user-friendly format with a clear hierarchy and a table for line items.

## Tech Stack

- **Frontend:** React (with TypeScript) and Pico.css for lightweight styling.
- **Backend:** Python with FastAPI, running as a serverless function.
- **Deployment:** Structured for easy deployment on Vercel.

---

## Local Development

To run this project on your local machine, follow these steps.

### Prerequisites

- Node.js & npm
- Python 3.9+
- Vercel CLI

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>
```

### 2. Install Dependencies

Install the required packages for both the frontend and backend.

```bash
# Install frontend packages
cd frontend
npm install

# Install backend packages (from the root directory)
cd ..
pip install -r requirements.txt
```

### 3. Set Up Environment Variables

You will need an API key from OpenAI to use the extraction feature.

1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Open the `.env` file and add your OpenAI API key:
    ```
    OPENAI_API_KEY="sk-..."
    ```

### 4. Run the Development Server

Run the Vercel development server from the **root directory**. This will start both the frontend and the backend API.

```bash
vercel dev
```

The application will be available at `http://localhost:3000`.