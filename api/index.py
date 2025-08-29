import fitz  # PyMuPDF
import io
import os
import json
import openai
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- Configuration and Initialization ---

# Load environment variables from .env file
dotenv_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

# Check for and load the API key
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError(
        "OPENAI_API_KEY not found. Make sure it is set in your .env file."
    )

# Initialize the async OpenAI client
client = openai.AsyncOpenAI(api_key=api_key)

# The user's detailed extraction prompt
extraction_prompt = """Extract invoice details, including customer and vendor information, totals, and line items, from all pages of the document, ensuring that all relevant information is captured, even if it spans multiple pages. Identify and extract data from tables, including those containing checkboxes.
If a checkbox is unchecked, return "Not checked"; otherwise, extract the information.
Respond only with the results in JSON format.
The JSON object should include the following fields: 'CustomerName', 'CustomerId', 'PurchaseOrder', 'InvoiceId', 'InvoiceDate', 'DueDate', 'VendorName', 'VendorAddress', 'VendorAddressRecipient', 'CustomerAddress', 'CustomerAddressRecipient', 'BillingAddress', 'BillingAddressRecipient', 'ShippingAddress', 'ShippingAddressRecipient', 'SubTotal', 'TotalDiscount', 'TotalTax', 'InvoiceTotal', 'AmountDue', 'PreviousUnpaidBalance', 'RemittanceAddress', 'RemittanceAddressRecipient', 'ServiceAddress', 'ServiceAddressRecipient', 'ServiceStartDate', 'ServiceEndDate', 'VendorTaxId', 'CustomerTaxId', 'PaymentTerm', 'KVKNumber', 'PaymentDetails', 'PaymentDetails(IBAN)', 'PaymentDetails(SWIFT)', 'PaymentDetails(BankAccountNumber)', 'PaymentDetails(BPayBillerCode)', 'PaymentDetails(BPayReference)', 'TaxDetails', 'TaxDetails(Amount)', 'TaxDetails(Rate)', 'PaidInFourInstallements', 'PaidInFourInstallements(Amount)', 'PaidInFourInstallements(DueDate)', 'Items', 'Items(Amount)', 'Items(Date)', 'Items(Description)', 'Items(Quantity)', 'Items(ProductCode)', 'Items(Tax)', 'Items(TaxRate)', 'Items(Unit)', and 'Items(UnitPrice)'."""

# Create the FastAPI app instance
app = FastAPI()


# --- Helper Functions ---

def extract_text_from_pdf(pdf_file: bytes) -> str:
    """Extracts all text from a PDF file."""
    try:
        doc = fitz.open(stream=pdf_file, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading PDF: {e}")

async def call_ai_model(prompt: str, text: str) -> dict:
    """Calls the OpenAI API to extract structured data from text."""
    try:
        response = await client.chat.completions.create(
            model="gpt-4o",
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Please extract the data from the following document text:\n\n{text}"}
            ]
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenAI API: {str(e)}")


# --- API Endpoints ---

@app.get("/")
async def root():
    """A simple health check endpoint."""
    return {"message": "Invoice extractor backend is running."}

@app.post("/api/extract")
async def extract_invoice_data(file: UploadFile = File(...)):
    """API endpoint to handle PDF invoice extraction."""
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a PDF.")

    try:
        pdf_content = await file.read()
        pdf_text = extract_text_from_pdf(pdf_content)
        extracted_data = await call_ai_model(extraction_prompt, pdf_text)
        return extracted_data
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")


# --- Middleware (add this after defining all routes) ---

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Server Entrypoint ---

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
