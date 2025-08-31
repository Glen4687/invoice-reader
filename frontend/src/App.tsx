import React, { useState } from 'react';
import axios from 'axios';

// --- TYPE DEFINITIONS ---
interface Item {
  [key: string]: any;
}

interface ExtractedData {
  Items?: Item[];
  [key: string]: any;
}

// --- HELPER COMPONENTS ---

// Component to render a table for line items
const ItemsTable: React.FC<{ items: Item[] }> = ({ items }) => {
  if (!items || items.length === 0) return null;

  // Dynamically find all possible headers from the items
  const headers = Array.from(new Set(items.flatMap(item => Object.keys(item))));

  return (
    <figure>
      <table role="grid">
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header.replace('Items(', '').replace(')', '')}</th>)}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              {headers.map(header => <td key={header}>{item[header] || '-'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
};

// Component to render key-value pairs, excluding complex objects/arrays
const DetailsGrid: React.FC<{ data: ExtractedData }> = ({ data }) => {
  const simpleDetails = Object.entries(data).filter(([, value]) => 
    typeof value !== 'object' && value !== null
  );

  if (simpleDetails.length === 0) return null;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.5rem 1rem' }}>
      {simpleDetails.map(([key, value]) => (
        <React.Fragment key={key}>
          <strong style={{ justifySelf: 'end' }}>{key}:</strong>
          <span>{String(value)}</span>
        </React.Fragment>
      ))}
    </div>
  );
};


// --- MAIN APP COMPONENT ---

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setExtractedData(null);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setExtractedData(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post<ExtractedData>('/api/extract', formData);
      setExtractedData(response.data);
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || 'An unexpected error occurred.';
      setError(`Error: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container">
      <nav>
        <ul>
          <li><strong>Invoice Extractor AI</strong></li>
        </ul>
      </nav>
      
      <article>
        <hgroup>
          <h1>Upload Invoice</h1>
          <h2>Select a PDF to extract structured data using AI</h2>
        </hgroup>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleSubmit} disabled={!selectedFile || isLoading} aria-busy={isLoading}>
          {isLoading ? 'Extracting...' : 'Extract Data'}
        </button>
      </article>

      {error && <article><p style={{ color: 'var(--pico-color-red-500)' }}>{error}</p></article>}

      {extractedData && (
        <article>
          <h2>Extracted Details</h2>
          <DetailsGrid data={extractedData} />
          {extractedData.Items && <ItemsTable items={extractedData.Items} />}
        </article>
      )}
    </main>
  );
}

export default App;
