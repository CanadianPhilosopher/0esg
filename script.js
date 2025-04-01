document.addEventListener('DOMContentLoaded', () => {

    // --- Configuration ---
    // !!! REPLACE WITH YOUR ACTUAL PUBLISHED GOOGLE SHEET CSV URL !!!
    const googleSheetPublishedCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQw438ZKd6BpMMD7KRjyQI9xTjS467yFxecgkQOE3SOaTJx60w-TZnSxfbIuypkfLX1LjZcwf3xcU_/pub?gid=0&single=true&output=csv';
    // Example (replace this): const googleSheetPublishedCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1v.../pub?output=csv';

    // --- Data Fetching and Processing ---
    async function fetchDataAndRender() {
        // Display a loading message or spinner (optional)
        const tableBody = document.getElementById('dataTable').querySelector('tbody');
        tableBody.innerHTML = '<tr><td colspan="7">Loading data...</td></tr>';
        // Clear existing charts if necessary (or create placeholder message)

        if (!googleSheetPublishedCsvUrl || googleSheetPublishedCsvUrl === 'YOUR_PUBLISHED_GOOGLE_SHEET_CSV_URL_HERE') {
             console.error("Google Sheet URL is not set. Please update `googleSheetPublishedCsvUrl` in script.js.");
             tableBody.innerHTML = '<tr><td colspan="7">Error: Google Sheet URL not configured.</td></tr>';
             // Optionally display an error message in chart areas too
             displayErrorMessage("Error: Data source not configured.");
             return; // Stop execution
        }


        try {
            const response = await fetch(googleSheetPublishedCsvUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvData = await response.text();
            const lossData = parseCsvData(csvData);

            // --- Clear Loading/Error Message ---
             tableBody.innerHTML = ''; // Clear loading message
             clearErrorMessages(); // Clear any previous error messages


            // --- Render Charts and Table ---
            renderCharts(lossData);
            populateTable(lossData);

        } catch (error) {
            console.error("Error fetching or parsing data:", error);
             tableBody.innerHTML = `<tr><td colspan="7">Error loading data: ${error.message}. Check console for details.</td></tr>`;
             // Display error message prominently
             displayErrorMessage(`Failed to load data. Please ensure the Google Sheet is published correctly and the URL is valid. Error: ${error.message}`);
        }
    }

    function parseCsvData(csvText) {
        const rows = csvText.trim().split('\n'); // Split into lines
        const headers = rows[0].split(',').map(header => header.trim()); // Get headers from first row
        const data = [];

        for (let i = 1; i < rows.length; i++) { // Start from 1 to skip header row
            const values = rows[i].split(','); // Split data row into values

            // Basic CSV parsing (doesn't handle commas within quoted fields)
            // More robust parsing might be needed for complex CSVs
            if (values.length === headers.length) {
                 const entry = {};
                 let hasError = false;
                 for (let j = 0; j < headers.length; j++) {
                    let value = values[j].trim();
                     // Basic type conversion (adjust as needed based on your columns)
                    if (headers[j] === 'year') {
                         entry[headers[j]] = parseInt(value, 10);
                         if (isNaN(entry[headers[j]])) {
                             console.warn(`Skipping row ${i+1}: Invalid year value "${value}"`);
                             hasError = true;
                             break;
                         }
                    } else if (headers[j] === 'estimatedLoss') {
                         entry[headers[j]] = parseFloat(value);
                          if (isNaN(entry[headers[j]])) {
                             console.warn(`Skipping row ${i+1}: Invalid estimatedLoss value "${value}"`);
                             hasError = true;
                             break;
                         }
                    } else if (headers[j] === 'id') {
                         // Make ID optional or handle potential non-numeric IDs if needed
                         entry[headers[j]] = value ? parseInt(value, 10) : i; // Use row index as fallback ID
                         if (value && isNaN(entry[headers[j]])) {
                            console.warn(`Row ${i+1}: Invalid ID value "${value}", using row index ${i} as fallback.`);
                            entry[headers[j]] = i;
                         }
                    }
                     else {
                        // Remove surrounding quotes if present (simple approach)
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.substring(1, value.length - 1);
                        }
                         entry[headers[j]] = value;
                    }
                 }
                  if (!hasError) {
                    data.push(entry);
                }
            } else {
                console.warn(`Skipping row ${i+1}: Incorrect number of columns. Expected ${headers.length}, got ${values.length}. Row content: "${rows[i]}"`);
            }
        }
        return data;
    }

     // --- Chart Rendering (Encapsulated) ---
    let lossesByProjectChartInstance = null;
    let lossesOverTimeChartInstance = null;
    let lossesByIndustryChartInstance = null;

    function destroyExistingCharts() {
        if (lossesByProjectChartInstance) lossesByProjectChartInstance.destroy();
        if (lossesOverTimeChartInstance) lossesOverTimeChartInstance.destroy();
        if (lossesByIndustryChartInstance) lossesByIndustryChartInstance.destroy();
        lossesByProjectChartInstance = null;
        lossesOverTimeChartInstance = null;
        lossesByIndustryChartInstance = null;
    }


    function renderCharts(lossData) {
        destroyExistingCharts(); // Destroy previous charts before rendering new ones

         if (!lossData || lossData.length === 0) {
            console.log("No data available to render charts.");
            // Optionally display message in chart areas
             displayErrorMessage("No data available to display.", true); // true indicates it's an info message in chart areas
            return;
        }


        // 1. Losses by Project (Bar Chart)
        const lossesByProjectCtx = document.getElementById('lossesByProjectChart').getContext('2d');
        lossesByProjectChartInstance = new Chart(lossesByProjectCtx, {
            type: 'bar',
            data: {
                labels: lossData.map(item => `${item.title || 'Untitled'} (${item.year || 'N/A'})`), // Added fallback
                datasets: [{
                    label: 'Estimated Loss (Millions USD)',
                    data: lossData.map(item => item.estimatedLoss || 0), // Added fallback
                    backgroundColor: 'rgba(211, 78, 78, 0.6)',
                    borderColor: 'rgba(211, 78, 78, 1)',
                    borderWidth: 1
                }]
            },
            options: { /* ... keep original options ... */
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                 scales: { x: { beginAtZero: true, title: { display: true, text: 'Estimated Loss (Millions USD)' } } },
                 plugins: {
                     legend: { display: false },
                     tooltip: { callbacks: { label: function(context) { /* ... keep original tooltip formatter ... */
                        let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed.x !== null) { label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.x) + ' Million'; } return label;
                     } } }
                 }
            }
        });

        // 2. Losses Over Time (Line Chart)
        const lossesOverTimeCtx = document.getElementById('lossesOverTimeChart').getContext('2d');
        const lossesByYear = lossData.reduce((acc, item) => {
             if (item.year && item.estimatedLoss != null) { // Ensure year and loss are valid
                acc[item.year] = (acc[item.year] || 0) + item.estimatedLoss;
            }
            return acc;
        }, {});
        const sortedYears = Object.keys(lossesByYear).sort((a, b) => a - b); // Ensure numeric sort

       lossesOverTimeChartInstance = new Chart(lossesOverTimeCtx, {
            type: 'line',
            data: {
                labels: sortedYears,
                datasets: [{
                    label: 'Total Estimated Losses per Year (Millions USD)',
                    data: sortedYears.map(year => lossesByYear[year]),
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: { /* ... keep original options ... */
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Total Estimated Loss (Millions USD)' } }, x: { title: { display: true, text: 'Year' } } },
                 plugins: {
                     tooltip: { callbacks: { label: function(context) { /* ... keep original tooltip formatter ... */
                        let label = context.dataset.label || ''; if (label) { label += ': '; } if (context.parsed.y !== null) { label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(context.parsed.y) + ' Million'; } return label;
                     } } }
                 }
            }
        });

        // 3. Losses by Industry (Pie Chart)
        const lossesByIndustryCtx = document.getElementById('lossesByIndustryChart').getContext('2d');
        const lossesByIndustry = lossData.reduce((acc, item) => {
            if (item.industry && item.estimatedLoss != null) { // Ensure industry and loss are valid
                const industryKey = item.industry || 'Unknown'; // Handle missing industry
                acc[industryKey] = (acc[industryKey] || 0) + item.estimatedLoss;
            }
            return acc;
        }, {});

        lossesByIndustryChartInstance = new Chart(lossesByIndustryCtx, {
            type: 'pie',
            data: {
                labels: Object.keys(lossesByIndustry),
                datasets: [{
                    label: 'Loss Distribution by Industry',
                    data: Object.values(lossesByIndustry),
                    backgroundColor: [ /* ... keep original colors ... */
                        'rgba(255, 159, 64, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)', 'rgba(255, 205, 86, 0.7)'
                    ],
                     borderColor: [ /* ... keep original border colors ... */
                        'rgba(255, 159, 64, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 205, 86, 1)'
                     ],
                    borderWidth: 1
                }]
            },
            options: { /* ... keep original options ... */
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                     legend: { position: 'top' },
                     tooltip: { callbacks: { label: function(context) { /* ... keep original tooltip formatter ... */
                        let label = context.label || ''; let value = context.parsed || 0; let total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0); let percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0; let valueStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value) + ' Million'; return `${label}: ${valueStr} (${percentage}%)`;
                     } } }
                }
            }
        });
    }


    // --- Populate Data Table (Encapsulated) ---
    function populateTable(lossData) {
        const tableBody = document.getElementById('dataTable').querySelector('tbody');
        tableBody.innerHTML = ''; // Clear previous data or loading message

        if (!lossData || lossData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No data available.</td></tr>';
            return;
        }

        lossData.forEach(item => {
            const row = tableBody.insertRow();
            // Use fallback values for potentially missing data
            row.innerHTML = `
                <td>${item.title || 'N/A'}</td>
                <td>${item.industry || 'N/A'}</td>
                <td>${item.year || 'N/A'}</td>
                <td>${item.type || 'N/A'}</td>
                <td>${item.estimatedLoss != null ? '$' + item.estimatedLoss.toLocaleString() + ' M' : 'N/A'}</td>
                <td>${item.relatedInitiativeFocus || 'N/A'}</td>
                <td>${item.description || 'N/A'}</td>
            `;
        });
    }

     // --- Error Display Functions ---
     function displayErrorMessage(message, isChartPlaceholder = false) {
        const chartContainers = document.querySelectorAll('.chart-wrapper');
        const dataTableSection = document.getElementById('data-details');

        if (isChartPlaceholder) {
             chartContainers.forEach(container => {
                // Add a simple text message inside chart containers
                // Ensure canvas isn't blocking it completely
                container.innerHTML = `<p class="chart-error-message" style="text-align: center; padding: 20px; color: #555;">${message}</p>`;
            });
        } else {
             // Display a more prominent error, perhaps above the table or charts
            let errorDiv = document.getElementById('global-error-message');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.id = 'global-error-message';
                errorDiv.style.color = 'red';
                errorDiv.style.backgroundColor = '#ffebee';
                errorDiv.style.border = '1px solid red';
                errorDiv.style.padding = '10px';
                errorDiv.style.marginBottom = '1rem';
                errorDiv.style.textAlign = 'center';
                // Insert before the first section or main content
                 document.querySelector('main').prepend(errorDiv);
            }
            errorDiv.textContent = message;
            // Clear charts if a major error occurs
            destroyExistingCharts();
            chartContainers.forEach(container => { container.innerHTML = ''; }); // Clear chart containers too
        }
    }

     function clearErrorMessages() {
         const errorDiv = document.getElementById('global-error-message');
         if (errorDiv) {
             errorDiv.remove();
         }
         // Clear chart placeholder messages if they exist
        document.querySelectorAll('.chart-error-message').forEach(el => el.remove());
         // Ensure canvas elements are back if they were removed (or recreate them if necessary)
         // For simplicity, we assume the canvas elements exist in the HTML and were just hidden or had content replaced
          if (!document.getElementById('lossesByProjectChart')) {
            document.querySelector('.chart-wrapper:nth-of-type(1)').innerHTML = '<canvas id="lossesByProjectChart"></canvas>';
          }
           if (!document.getElementById('lossesOverTimeChart')) {
            document.querySelector('.chart-wrapper:nth-of-type(2)').innerHTML = '<canvas id="lossesOverTimeChart"></canvas>';
          }
          if (!document.getElementById('lossesByIndustryChart')) {
            document.querySelector('.chart-wrapper-pie').innerHTML = '<canvas id="lossesByIndustryChart"></canvas>';
          }

     }


    // --- Initial Load ---
    fetchDataAndRender();

}); // End DOMContentLoaded
