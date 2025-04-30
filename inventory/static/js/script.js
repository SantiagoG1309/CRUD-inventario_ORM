// Funciones de utilidad
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

// Validación de formularios
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showError(input, 'Este campo es requerido');
        } else {
            clearError(input);
        }
    });

    // Validación específica para números
    const numberInputs = form.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (isNaN(value) || value < 0) {
            isValid = false;
            showError(input, 'Por favor, ingrese un número válido mayor o igual a 0');
        }
    });

    return isValid;
};

const showError = (input, message) => {
    const formGroup = input.closest('.mb-3');
    let errorDiv = formGroup.querySelector('.invalid-feedback');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        formGroup.appendChild(errorDiv);
    }
    
    input.classList.add('is-invalid');
    errorDiv.textContent = message;
};

const clearError = (input) => {
    input.classList.remove('is-invalid');
    const formGroup = input.closest('.mb-3');
    const errorDiv = formGroup.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
};

// Ordenamiento de tablas
const setupTableSorting = () => {
    const tables = document.querySelectorAll('.table');
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (!header.classList.contains('no-sort')) {
                header.style.cursor = 'pointer';
                header.addEventListener('click', () => sortTable(table, index));
            }
        });
    });
};

const sortTable = (table, column) => {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isNumeric = rows.every(row => {
        const cell = row.cells[column].textContent;
        return !isNaN(parseFloat(cell)) && isFinite(cell);
    });

    const sortOrder = table.getAttribute('data-sort-order') === 'asc' ? -1 : 1;
    table.setAttribute('data-sort-order', sortOrder === 1 ? 'asc' : 'desc');

    rows.sort((a, b) => {
        let aVal = a.cells[column].textContent.trim();
        let bVal = b.cells[column].textContent.trim();

        if (isNumeric) {
            return sortOrder * (parseFloat(aVal) - parseFloat(bVal));
        } else {
            return sortOrder * aVal.localeCompare(bVal, 'es', { sensitivity: 'base' });
        }
    });

    rows.forEach(row => tbody.appendChild(row));
};

// Filtrado de productos
const setupProductFilter = () => {
    const filterInput = document.getElementById('productFilter');
    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.table tbody tr');

            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
};

// Animaciones y efectos visuales
const setupAnimations = () => {
    // Efecto hover en las filas de la tabla
    const tableRows = document.querySelectorAll('.table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transition = 'background-color 0.3s ease';
        });
    });

    // Animación para mensajes de alerta
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.transition = 'opacity 0.5s ease';
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    });
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    // Configurar validación de formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
    });

    // Inicializar funcionalidades
    setupTableSorting();
    setupProductFilter();
    setupAnimations();

    // Formatear precios
    const priceElements = document.querySelectorAll('.price-format');
    priceElements.forEach(element => {
        const price = parseFloat(element.textContent);
        if (!isNaN(price)) {
            element.textContent = formatCurrency(price);
        }
    });
});