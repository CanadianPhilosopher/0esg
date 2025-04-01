document.addEventListener('DOMContentLoaded', () => {
    const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQw438ZKd6BpMMD7KRjyQI9xTjS467yFxecgkQOE3SOaTJx60w-TZnSxfbIuypkfLX1LjZcwf3xcU_/pub?gid=0&single=true&output=csv';

    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    const content = document.getElementById('content');
    const yearSpan = document.getElementById('year');

    yearSpan.textContent = new Date().getFullYear(); // Update footer year

    // Chart instances (global scope within this script to allow destruction if needed)
    let lossesByEntityChartInstance = null;
    let lossesByYearChartInstance = null;

    function fetchData() {
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        content.style.display = 'none';

        fetch(googleSheetURL)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.text();
            })
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true, // Use the first row as headers
                    skipEmptyLines: true,
                    complete: (results) => {
                        if (results.errors.length > 0) {
                            console.error("CSV Parsing Errors:", results.errors);
                            throw new Error("Error parsing CSV data. Check console for details.");
                        }
                        processData(results.data);
                        loadingState.style.display = 'none';
                        content.style.display = 'block';
                    },
                    error: (error) => {
                        throw new Error(`CSV Parsing Failed: ${error.message}`);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching or processing data:', error);
                errorMessage.textContent = error.message;
                loadingState.style.display = 'none';
                errorState.style.display = 'block';
            });
    }

    function processData(data) {
        console.log("Raw Data:", data); // Log raw data for debugging

        // --- Data Cleaning and Preparation ---
        const cleanedData = data.map(row => {
            // Standardize column names (handle potential variations if needed)
            const entity = row['Entity/Product Name']?.trim() || 'Unknown Entity';
            const industry = row['Industry (Entertainment/Video Game)']?.trim() || 'Unknown Industry';
            const lossStr = row['Estimated Financial Loss (USD)'] || '0';
            const yearStr = row['Year of Impact/Release'] || 'Unknown Year';
            const description = row['Brief Description/Reason'] || '';
            const source = row['Source URL(s)'] || '';
            const notes = row['Notes'] || '';

            // Clean and convert loss to a number (remove $, commas, handle ranges/text)
            let loss = 0;
            try {
                // Very basic cleaning: remove $, commas. More robust cleaning might be needed.
                const cleanedLossStr = lossStr.replace(/[$,]/g, '').trim();
                // Take the first number if it's a range like "100-200 million"
                 const potentialNumber = parseFloat(cleanedLossStr.split('-')[0]);
                 if (!isNaN(potentialNumber)) {
                    loss = potentialNumber;
                     // Basic check for 'million' or 'billion' - crude but better than nothing
                    if (/million/i.test(lossStr)) loss *= 1e6;
                    if (/billion/i.test(lossStr)) loss *= 1e9;
                 } else {
                    // console.warn(`Could not parse loss value: "${lossStr}" for entity: ${entity}`);
                 }
            } catch (e) {
                console.warn(`Error parsing loss value: "${lossStr}" for entity: ${entity}`, e);
            }

            // Clean year (take the first 4-digit number found)
             let year = yearStr; // Keep original string if no number found
             const yearMatch = yearStr.match(/\b\d{4}\b/);
             if (yearMatch) {
                 year = parseInt(yearMatch[0], 10);
             } else {
                // console.warn(`Could not parse year: "${yearStr}" for entity: ${entity}`)
             }


            return {
                entity,
                industry,
                loss, // Store as number
                year, // Store cleaned year (might be number or string)
                description,
                source,
                notes,
                originalLossStr: lossStr, // Keep original string for table display
                 originalYearStr: yearStr // Keep original string
            };
        }).filter(row => row.entity !== 'Unknown Entity'); // Filter out rows with no entity name

        console.log("Cleaned Data:", cleanedData);

        // --- Populate Charts ---
        createLossesByEntityChart(cleanedData);
        createLossesByYearChart(cleanedData);

        // --- Populate Table ---
        populateTable(cleanedData);
    }

     function formatCurrency(value) {
        if (typeof value !== 'number' || isNaN(value)) {
            return 'N/A';
        }
         if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
         if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
         if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
        return `$${value.toFixed(0)}`;
    }

    // --- Chart Creation Functions ---
    function createLossesByEntityChart(data) {
        const ctx = document.getElementById('lossesByEntityChart').getContext('2d');

        // Aggregate losses by entity
        const lossesByEntity = data.reduce((acc, row) => {
            acc[row.entity] = (acc[row.entity] || 0) + row.loss;
            return acc;
        }, {});

        // Sort entities by loss (descending) and take top N (e.g., top 20)
        const sortedEntities = Object.entries(lossesByEntity)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20); // Limit to top 20 entities for readability

        const labels = sortedEntities.map(([entity]) => entity);
        const lossData = sortedEntities.map(([, loss]) => loss);

        if (lossesByEntityChartInstance) {
            lossesByEntityChartInstance.destroy(); // Destroy previous chart if exists
        }

        lossesByEntityChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Estimated Financial Loss (USD)',
                    data: lossData,
                    backgroundColor: 'rgba(220, 53, 69, 0.6)', // Reddish color
                    borderColor: 'rgba(220, 53, 69, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bars might be better for long labels
                responsive: true,
                maintainAspectRatio: false, // Allow chart height to adjust
                 aspectRatio: 1.5, // Adjust aspect ratio (width/height)
                plugins: {
                    title: {
                        display: true,
                        text: 'Top 20 Entities by Estimated Financial Loss',
                        font: { size: 16 }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.x !== null) {
                                     // Use custom formatter for tooltip
                                     label += formatCurrency(context.parsed.x);
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: false // Hide legend if only one dataset
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Estimated Loss (USD)'
                        },
                         ticks: {
                             callback: function(value, index, values) {
                                 // Use custom formatter for axis ticks
                                 return formatCurrency(value);
                            }
                         }
                    },
                    y: {
                         ticks: {
                             autoSkip: false // Show all labels if possible
                         }
                    }
                }
            }
        });
         // Dynamically adjust container height based on number of labels
        const chartContainer = document.getElementById('lossesByEntityChart').parentElement;
        const labelCount = labels.length;
        const baseHeight = 150; // Minimum height
        const heightPerLabel = 25; // Pixels per label
        chartContainer.style.height = `${Math.max(baseHeight, labelCount * heightPerLabel)}px`;
        lossesByEntityChartInstance.resize(); // Ensure chart resizes to new container height
    }


    function createLossesByYearChart(data) {
         const ctx = document.getElementById('lossesByYearChart').getContext('2d');

         // Aggregate losses by year
         const lossesByYear = data.reduce((acc, row) => {
             // Only include rows where year is a number and loss > 0
             if (typeof row.year === 'number' && row.loss > 0) {
                acc[row.year] = (acc[row.year] || 0) + row.loss;
             } else if (row.year === 'Unknown Year' && row.loss > 0) {
                 // Optionally accumulate 'Unknown Year' separately
                 acc['Unknown'] = (acc['Unknown'] || 0) + row.loss;
             }
             return acc;
         }, {});

          // Separate known years from 'Unknown'
         const knownYearsData = Object.entries(lossesByYear)
            .filter(([year]) => year !== 'Unknown')
            .map(([year, loss]) => ({ year: parseInt(year), loss }))
            .sort((a, b) => a.year - b.year); // Sort by year ascending

        const labels = knownYearsData.map(item => item.year);
        const lossData = knownYearsData.map(item => item.loss);

         // Handle 'Unknown' year data if needed (e.g., add as a separate bar or note)
         const unknownLoss = lossesByYear['Unknown'] || 0;
         // You could add 'Unknown' to labels and data if you want it on the chart
         // labels.push('Unknown');
         // lossData.push(unknownLoss);

        if (lossesByYearChartInstance) {
            lossesByYearChartInstance.destroy(); // Destroy previous chart if exists
        }

        lossesByYearChartInstance = new Chart(ctx, {
            type: 'line', // Line chart is good for time series
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Estimated Loss per Year (USD)',
                    data: lossData,
                    borderColor: 'rgba(0, 123, 255, 1)', // Blue color
                    backgroundColor: 'rgba(0, 123, 255, 0.1)',
                    fill: true, // Fill area under the line
                    tension: 0.1 // Slight curve to the line
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Maintain default aspect ratio
                plugins: {
                    title: {
                        display: true,
                        text: 'Estimated Financial Loss Trend Over Years',
                        font: { size: 16 }
                    },
                     tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += formatCurrency(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Estimated Loss (USD)'
                        },
                         ticks: {
                             callback: function(value, index, values) {
                                 return formatCurrency(value);
                             }
                         }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                }
            }
        });
          // Add a note about 'Unknown' year data if significant
        const chartContainer = document.getElementById('lossesByYearChart').parentElement;
        let noteElement = chartContainer.querySelector('.chart-note');
        if (!noteElement) {
            noteElement = document.createElement('p');
            noteElement.className = 'chart-note';
            noteElement.style.fontSize = '0.8rem';
            noteElement.style.textAlign = 'center';
            noteElement.style.marginTop = '10px';
            chartContainer.appendChild(noteElement);
        }
         if (unknownLoss > 0) {
            noteElement.textContent = `Note: An additional ${formatCurrency(unknownLoss)} in losses could not be assigned to a specific year.`;
        } else {
            noteElement.textContent = ''; // Clear note if no unknown loss
        }
    }


    // --- Table Population Function ---
    function populateTable(data) {
        const tableHead = document.querySelector('#dataTable thead tr');
        const tableBody = document.querySelector('#dataTable tbody');

        // Clear previous content
        tableHead.innerHTML = '';
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7">No data available to display.</td></tr>';
            return;
        }

        // Define table headers (adjust order/names as needed)
        const headers = [
            'Entity/Product', 'Industry', 'Est. Loss (USD)', 'Year', 'Description', 'Source(s)', 'Notes'
        ];
        const dataKeys = [ // Corresponding keys in the cleanedData objects
            'entity', 'industry', 'originalLossStr', 'originalYearStr', 'description', 'source', 'notes'
        ];


        // Create header row
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            tableHead.appendChild(th);
        });

        // Create data rows
        data.forEach(row => {
            const tr = document.createElement('tr');
            dataKeys.forEach(key => {
                const td = document.createElement('td');
                 let cellContent = row[key] || ''; // Get content, default to empty string

                 // Make URLs clickable
                 if (key === 'source' && cellContent) {
                      // Basic split by common delimiters (space, comma, newline) and filter empty
                     const urls = cellContent.split(/[\s,;\n]+/).filter(Boolean);
                     urls.forEach((url, index) => {
                         try {
                              // Basic URL validation
                             if (url.startsWith('http://') || url.startsWith('https://')) {
                                 const link = document.createElement('a');
                                 link.href = url;
                                 link.textContent = `Source ${index + 1}`; // Or use hostname: new URL(url).hostname;
                                 link.target = '_blank'; // Open in new tab
                                 link.rel = 'noopener noreferrer';
                                 td.appendChild(link);
                                 // Add a separator if more than one URL
                                 if (index < urls.length - 1) {
                                    td.appendChild(document.createTextNode(' ')); // Or <br> if needed
                                }
                             } else {
                                 // If not a valid URL, just append as text
                                 td.appendChild(document.createTextNode(url + (index < urls.length - 1 ? ' ' : '')));
                             }
                         } catch (e) {
                             // Handle cases where URL parsing might fail
                             td.appendChild(document.createTextNode(url + (index < urls.length - 1 ? ' ' : '')));
                             console.warn(`Invalid URL encountered: ${url}`);
                         }
                     });
                 } else {
                    td.textContent = cellContent;
                 }
                 tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    }

    // --- Initial Fetch ---
    fetchData();
});