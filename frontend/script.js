document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const submitBtn = document.getElementById('submit-btn');
    const fileInput = document.getElementById('file');
    const resultsContainer = document.getElementById('results-container');
    const jsonOutput = document.getElementById('json-output');
    const errorContainer = document.getElementById('error-container');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        resultsContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        submitBtn.setAttribute('aria-busy', 'true');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Extracting...';

        const file = fileInput.files[0];
        if (!file) {
            showError('Please select a file.');
            resetButton();
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'An unknown error occurred.');
            }

            renderData(data, jsonOutput);
            resultsContainer.style.display = 'block';

        } catch (err) {
            showError(err.message);
        } finally {
            resetButton();
        }
    });

    function renderData(data, parentElement) {
        parentElement.innerHTML = ''; // Clear previous results
        const dl = document.createElement('dl');
        
        for (const key in data) {
            const value = data[key];

            if (value === null || value === '') {
                continue; // Skip null or empty values
            }

            const dt = document.createElement('dt');
            dt.textContent = key.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before caps for readability

            const dd = document.createElement('dd');

            if (typeof value === 'object' && value !== null) {
                // If the value is an object or array, recurse
                renderData(value, dd);
            } else {
                dd.textContent = value;
            }
            
            dl.appendChild(dt);
            dl.appendChild(dd);
        }
        parentElement.appendChild(dl);
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorContainer.style.display = 'block';
    }

    function resetButton() {
        submitBtn.removeAttribute('aria-busy');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Extract Data';
    }
});