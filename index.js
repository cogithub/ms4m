<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consume CSV Service</title>
    <style>
        table {
            border-collapse: collapse;
            width: 100%;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>
    <h1>CSV Data</h1>
    <button onclick="fetchCSV()">Load CSV</button>
    <table id="dataTable">
        <thead id="tableHead"></thead>
        <tbody id="tableBody"></tbody>
    </table>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>
    <script>
        function fetchCSV() {
            // Replace with your CSV service URL
            const csvUrl = 'https://example.http://10.1.64.119:6060/api/v1/cube/get/zipfact/?d=2024/01&f=productioncom/data.csv';

            fetch(csvUrl)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(csvText => {
                    Papa.parse(csvText, {
                        header: true,
                        complete: function(results) {
                            displayData(results.data);
                        },
                        error: function(error) {
                            console.error('Error parsing CSV:', error);
                            alert('Failed to parse CSV');
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching CSV:', error);
                    alert('Failed to fetch CSV');
                });
        }

        function displayData(data) {
            const tableHead = document.getElementById('tableHead');
            const tableBody = document.getElementById('tableBody');
            
            // Clear previous content
            tableHead.innerHTML = '';
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="100">No data available</td></tr>';
                return;
            }

            // Create table headers
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            tableHead.appendChild(headerRow);

            // Create table rows
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header] || '';
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }
    </script>
</body>
</html>