// Employee data storage
let employees = [
    { name: 'Arun', sales: 60000, commission: 6000 },
    { name: 'Priya', sales: 40000, commission: 0 }
];

// Chart instance
let chart = null;

// Commission calculation function
function calculateCommission(salesAmount) {
    return salesAmount > 50000 ? salesAmount * 0.1 : 0;
}

// Add new employee
function addEmployee(name, sales) {
    const commission = calculateCommission(sales);
    employees.push({ name, sales, commission });
    updateDisplay();
}

// Update all display components
function updateDisplay() {
    updateStats();
    updateTable();
    updateChart();
}

// Update statistics cards
function updateStats() {
    const totalEmployees = employees.length;
    const totalSales = employees.reduce((sum, emp) => sum + emp.sales, 0);
    const totalCommission = employees.reduce((sum, emp) => sum + emp.commission, 0);
    const qualifiedEmployees = employees.filter(emp => emp.commission > 0).length;

    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalSales').textContent = `₹${totalSales.toLocaleString()}`;
    document.getElementById('totalCommission').textContent = `₹${totalCommission.toLocaleString()}`;
    document.getElementById('qualifiedEmployees').textContent = qualifiedEmployees;
}

// Update employee table
function updateTable() {
    const tbody = document.querySelector('#employeeTable tbody');
    
    if (employees.length === 0) {
        tbody.innerHTML = '<tr class="empty-state"><td colspan="5">No employee data available. Add employees to see the report.</td></tr>';
        return;
    }

    // Sort employees by sales amount (descending)
    const sortedEmployees = [...employees].sort((a, b) => b.sales - a.sales);
    
    tbody.innerHTML = sortedEmployees.map((emp, index) => {
        let rowClass = '';
        let status = 'No Commission';
        
        if (index === 0 && emp.commission > 0) {
            rowClass = 'top-performer';
            status = '🏆 Top Performer';
        } else if (index === 1 && emp.commission > 0) {
            rowClass = 'high-performer';
            status = '🥈 High Performer';
        } else if (index === 2 && emp.commission > 0) {
            rowClass = 'good-performer';
            status = '🥉 Good Performer';
        } else if (emp.commission > 0) {
            status = '✅ Qualified';
        }

        return `
            <tr class="${rowClass}">
                <td>${index + 1}</td>
                <td>${emp.name}</td>
                <td>₹${emp.sales.toLocaleString()}</td>
                <td>₹${emp.commission.toLocaleString()}</td>
                <td>${status}</td>
            </tr>
        `;
    }).join('');
}

// Update performance chart
function updateChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }

    if (employees.length === 0) {
        return;
    }

    const sortedEmployees = [...employees].sort((a, b) => b.sales - a.sales);
    const labels = sortedEmployees.map(emp => emp.name);
    const salesData = sortedEmployees.map(emp => emp.sales);
    const commissionData = sortedEmployees.map(emp => emp.commission);

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Sales Amount (₹)',
                data: salesData,
                backgroundColor: 'rgba(52, 152, 219, 0.8)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                yAxisID: 'y'
            }, {
                label: 'Commission (₹)',
                data: commissionData,
                backgroundColor: 'rgba(46, 204, 113, 0.8)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 2,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ₹' + context.parsed.y.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Sales Amount (₹)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Commission (₹)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

// Clear all employee data
function clearAllData() {
    if (confirm('Are you sure you want to clear all employee data?')) {
        employees = [];
        updateDisplay();
    }
}

// Form submission event listener
document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('employeeName').value.trim();
    const sales = parseFloat(document.getElementById('salesAmount').value);
    
    if (name && sales >= 0) {
        addEmployee(name, sales);
        this.reset();
    }
});

// Initialize display with sample data when page loads
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
});