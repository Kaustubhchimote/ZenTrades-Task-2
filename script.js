let globalProductsArray = []; // To hold the products array globally after file read

document.getElementById('fileInput').addEventListener('change', event => {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        const data = JSON.parse(e.target.result);
        if (data.products) {
            globalProductsArray = Object.values(data.products).sort((a, b) => b.popularity - a.popularity);
            displayAvailableFields(globalProductsArray);
        } else {
            console.error('The JSON structure is not supported');
        }
    };
    reader.onerror = e => console.error('Error reading file:', e);
    reader.readAsText(file);
});

function displayAvailableFields(productsArray) {
    // Assuming the structure is consistent across all products
    const fields = Object.keys(productsArray[0]);
    const availableFieldsContainer = document.getElementById('availableFields');
    availableFieldsContainer.innerHTML = ''; // Clear the container
    
    fields.forEach(field => {
        const fieldDiv = document.createElement('div');
        fieldDiv.textContent = field;
        fieldDiv.className = 'field';
        fieldDiv.onclick = function() {
            const fieldsToDisplayContainer = document.getElementById('fieldsToDisplay');
            fieldsToDisplayContainer.appendChild(fieldDiv);
        };
        availableFieldsContainer.appendChild(fieldDiv);
    });
}

document.getElementById('nextButton').addEventListener('click', () => {
    const selectedFields = Array.from(document.getElementById('fieldsToDisplay').getElementsByClassName('field')).map(field => field.textContent);
    if (selectedFields.length === 0) {
        alert('Please select at least one field to display.');
        return;
    }
    
    populateTable(globalProductsArray, selectedFields);
});

function populateTable(products, selectedColumns) {
    const table = document.getElementById('productTable');
    const headerRow = document.getElementById('tableHeader');
    const tbody = document.getElementById('tableBody');

    // Clear existing table rows and headers
    headerRow.innerHTML = '';
    tbody.innerHTML = '';

    // Create header cells for selected columns
    selectedColumns.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    // Populate the table rows with selected columns
    products.forEach(product => {
        const row = tbody.insertRow();
        selectedColumns.forEach(header => {
            const cell = row.insertCell();
            cell.textContent = product[header] || '';
        });
    });

    // Display the table
    table.style.display = 'table';
}

document.getElementById('cancelButton').addEventListener('click', () => {
    // Clear the file input
    document.getElementById('fileInput').value = '';
    // Hide the table and clear the fields to be displayed
    document.getElementById('productTable').style.display = 'none';
    document.getElementById('fieldsToDisplay').innerHTML = '';
    // Optionally, navigate the user away from the current view or refresh the page
});