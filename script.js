// ===== FINANCIAL MODEL ANALYZER =====

// Parse CSV/Excel file
document.getElementById('uploadArea').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('uploadArea').addEventListener('dragover', (e) => {
    e.preventDefault();
    document.getElementById('uploadArea').style.borderColor = '#764ba2';
    document.getElementById('uploadArea').style.background = '#f0f4ff';
});

document.getElementById('uploadArea').addEventListener('dragleave', (e) => {
    document.getElementById('uploadArea').style.borderColor = '#667eea';
    document.getElementById('uploadArea').style.background = 'white';
});

document.getElementById('uploadArea').addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFile(files[0]);
});

document.getElementById('fileInput').addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
});

function handleFile(file) {
    if (!file) return;
    
    const fileStatus = document.getElementById('fileStatus');
    
    if (file.type === 'text/csv') {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const csv = e.target.result;
                const data = parseCSV(csv);
                analyzeFinancialData(data);
                fileStatus.className = 'file-success';
                fileStatus.innerHTML = `✅ File "${file.name}" berhasil diupload!`;
            } catch (error) {
                fileStatus.className = 'file-error';
                fileStatus.innerHTML = `❌ Error: ${error.message}`;
            }
        };
        reader.readAsText(file);
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
               file.type === 'application/vnd.ms-excel') {
        fileStatus.innerHTML = '⏳ Memproses file Excel...';
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // For Excel parsing, we'll use a simple CSV fallback
                alert('Untuk file Excel, silakan convert ke CSV terlebih dahulu atau gunakan template');
                fileStatus.className = 'file-error';
                fileStatus.innerHTML = '❌ Silakan gunakan file CSV atau template';
            } catch (error) {
                fileStatus.className = 'file-error';
                fileStatus.innerHTML = `❌ Error: ${error.message}`;
            }
        };
        reader.readAsArrayBuffer(file);
    } else {
        fileStatus.className = 'file-error';
        fileStatus.innerHTML = '❌ Format file tidak didukung. Gunakan CSV atau Excel.';
    }
}

// Parse CSV data
function parseCSV(csv) {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(';').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim() === '') continue;
        const obj = {};
        const values = lines[i].split(';').map(v => v.trim());
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        data.push(obj);
    }
    
    return data;
}

// Analyze financial data
function analyzeFinancialData(data) {
    console.log('Analyzing data:', data);
    
    // Extract numeric values
    const values = data.map(row => {
        return Object.values(row).map(v => {
            const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
            return isNaN(num) ? 0 : num;
        });
    }).flat().filter(v => v > 0);
    
    // Calculate summary statistics
    const summary = calculateSummary(values);
    const metrics = calculateFinancialMetrics(values);
    
    // Display results
    displaySummary(summary);
    displayMetrics(metrics);
    displayAutoCalculators(values);
    displayHealthScore(metrics);
    displayRecommendations(metrics);
    displayDataPreview(data);
    
    // Show results section
    document.getElementById('analysisResults').style.display = 'block';
    document.getElementById('dataPreview').style.display = 'block';
}

// Calculate summary statistics
function calculateSummary(values) {
    if (values.length === 0) return {};
    
    const sorted = [...values].sort((a, b) => a - b);
    return {
        total: values.reduce((a, b) => a + b, 0),
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: sorted[0],
        max: sorted[sorted.length - 1],
        count: values.length,
        median: sorted[Math.floor(sorted.length / 2)]
    };
}

// Calculate financial metrics
function calculateFinancialMetrics(values) {
    const summary = calculateSummary(values);
    
    return {
        // Profitability Metrics
        profitMargin: (values[0] / values[1]) * 100 || 0,
        roe: (values[0] / values[2]) * 100 || 0, // Return on Equity
        roa: (values[0] / values[3]) * 100 || 0, // Return on Assets
        
        // Liquidity Metrics
        currentRatio: values[1] / values[2] || 0,
        quickRatio: (values[1] - values[4]) / values[2] || 0,
        
        // Leverage Metrics
        debtToEquity: values[2] / values[3] || 0,
        debtToAssets: values[2] / values[1] || 0,
        
        // Efficiency Metrics
        assetTurnover: values[5] / values[1] || 0,
        
        // Growth Metrics
        growthRate: ((values[values.length - 1] - values[0]) / values[0]) * 100 || 0,
        
        // Summary
        summary: summary
    };
}

// Display summary
function displaySummary(summary) {
    const summaryDiv = document.getElementById('summaryStat');
    summaryDiv.innerHTML = `
        <div class="stat-box">
            <div class="stat-label">Total</div>
            <div class="stat-value">${formatCurrency(summary.total)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Rata-rata</div>
            <div class="stat-value">${formatCurrency(summary.average)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Minimum</div>
            <div class="stat-value">${formatCurrency(summary.min)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Maximum</div>
            <div class="stat-value">${formatCurrency(summary.max)}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Jumlah Item</div>
            <div class="stat-value">${summary.count}</div>
        </div>
        <div class="stat-box">
            <div class="stat-label">Median</div>
            <div class="stat-value">${formatCurrency(summary.median)}</div>
        </div>
    `;
}

// Display metrics
function displayMetrics(metrics) {
    const metricsDiv = document.getElementById('keyMetrics');
    metricsDiv.innerHTML = `
        <div class="metric-item">
            <div class="metric-name">📊 Profit Margin</div>
            <div class="metric-value">${metrics.profitMargin.toFixed(2)}%</div>
            <div class="metric-description">Persentase keuntungan dari setiap penjualan</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">📈 ROE (Return on Equity)</div>
            <div class="metric-value">${metrics.roe.toFixed(2)}%</div>
            <div class="metric-description">Pengembalian atas investasi pemegang saham</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">💼 ROA (Return on Assets)</div>
            <div class="metric-value">${metrics.roa.toFixed(2)}%</div>
            <div class="metric-description">Efisiensi penggunaan aset</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">💧 Current Ratio</div>
            <div class="metric-value">${metrics.currentRatio.toFixed(2)}</div>
            <div class="metric-description">Kemampuan bayar utang jangka pendek</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">⚖️ Debt-to-Equity</div>
            <div class="metric-value">${metrics.debtToEquity.toFixed(2)}</div>
            <div class="metric-description">Proporsi utang terhadap ekuitas</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">🔄 Asset Turnover</div>
            <div class="metric-value">${metrics.assetTurnover.toFixed(2)}x</div>
            <div class="metric-description">Berapa kali aset berputar menghasilkan penjualan</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">📉 Growth Rate</div>
            <div class="metric-value">${metrics.growthRate.toFixed(2)}%</div>
            <div class="metric-description">Tingkat pertumbuhan keseluruhan</div>
        </div>
        <div class="metric-item">
            <div class="metric-name">📊 Debt-to-Assets</div>
            <div class="metric-value">${metrics.debtToAssets.toFixed(2)}</div>
            <div class="metric-description">Proporsi aset yang dibiayai utang</div>
        </div>
    `;
}

// Display auto calculators
function displayAutoCalculators(values) {
    const calcDiv = document.getElementById('autoCalculators');
    
    if (values.length < 2) {
        calcDiv.innerHTML = '<p>Data tidak cukup untuk menjalankan kalkulator otomatis</p>';
        return;
    }
    
    const revenue = values[0] || 0;
    const expenses = values[1] || 0;
    const profit = revenue - expenses;
    
    calcDiv.innerHTML = `
        <div class="auto-calc-card">
            <h5>💰 Profitabilitas</h5>
            <div class="auto-calc-result">
                <p><strong>Revenue:</strong> ${formatCurrency(revenue)}</p>
                <p><strong>Expenses:</strong> ${formatCurrency(expenses)}</p>
                <p><strong>Profit:</strong> ${formatCurrency(profit)}</p>
                <p><strong>Margin:</strong> ${((profit/revenue)*100).toFixed(2)}%</p>
            </div>
        </div>
        <div class="auto-calc-card">
            <h5>📊 Future Value (10 tahun, 7%)</h5>
            <div class="auto-calc-result">
                <p><strong>Nilai Sekarang:</strong> ${formatCurrency(revenue)}</p>
                <p><strong>Proyeksi 10 Tahun:</strong> ${formatCurrency(revenue * Math.pow(1.07, 10))}</p>
                <p><strong>Pertumbuhan:</strong> ${formatCurrency(revenue * Math.pow(1.07, 10) - revenue)}</p>
            </div>
        </div>
        <div class="auto-calc-card">
            <h5>💳 Break-even Analysis</h5>
            <div class="auto-calc-result">
                <p><strong>Fixed Cost (asumsi 30%):</strong> ${formatCurrency(expenses * 0.3)}</p>
                <p><strong>Variable Cost (asumsi 70%):</strong> ${formatCurrency(expenses * 0.7)}</p>
                <p><strong>BEP (unit, asumsi Rp100k/unit):</strong> ${Math.ceil((expenses * 0.3) / 40000)} unit</p>
            </div>
        </div>
    `;
}

// Display health score
function displayHealthScore(metrics) {
    const scoreDiv = document.getElementById('healthScore');
    
    let score = 0;
    let status = '';
    let color = '';
    
    // Calculate score (0-100)
    if (metrics.profitMargin > 20) score += 25; else if (metrics.profitMargin > 10) score += 15;
    if (metrics.roe > 15) score += 25; else if (metrics.roe > 5) score += 15;
    if (metrics.currentRatio >= 1.5) score += 25; else if (metrics.currentRatio >= 1) score += 15;
    if (metrics.debtToEquity < 1) score += 25; else if (metrics.debtToEquity < 2) score += 15;
    
    if (score >= 80) {
        status = 'Sangat Baik';
        color = 'score-excellent';
    } else if (score >= 60) {
        status = 'Baik';
        color = 'score-good';
    } else if (score >= 40) {
        status = 'Cukup';
        color = 'score-fair';
    } else {
        status = 'Perlu Perbaikan';
        color = 'score-poor';
    }
    
    scoreDiv.innerHTML = `
        <div class="score-circle ${color}">${Math.round(score)}</div>
        <p style="font-size: 1.1rem; color: #667eea;"><strong>${status}</strong></p>
        <p style="color: #666; margin-top: 0.5rem;">Kesehatan keuangan Anda berada di kategori <strong>${status}</strong> dengan skor <strong>${Math.round(score)}/100</strong></p>
    `;
}

// Display recommendations
function displayRecommendations(metrics) {
    const recDiv = document.getElementById('recommendations');
    const recommendations = [];
    
    if (metrics.profitMargin < 10) {
        recommendations.push({
            icon: '💡',
            title: 'Tingkatkan Profit Margin',
            desc: 'Margin keuntungan Anda masih rendah. Pertimbangkan mengurangi biaya atau meningkatkan harga.'
        });
    }
    
    if (metrics.currentRatio < 1) {
        recommendations.push({
            icon: '⚠️',
            title: 'Masalah Likuiditas',
            desc: 'Aset lancar Anda tidak cukup untuk menutupi kewajiban jangka pendek. Segera cari solusi.'
        });
    }
    
    if (metrics.debtToEquity > 2) {
        recommendations.push({
            icon: '🚨',
            title: 'Utang Terlalu Tinggi',
            desc: 'Rasio utang Anda sangat tinggi. Prioritaskan pengurangan beban utang.'
        });
    }
    
    if (metrics.roe < 5) {
        recommendations.push({
            icon: '📈',
            title: 'ROE Rendah',
            desc: 'Return on Equity rendah. Evaluasi strategi investasi dan profitabilitas.'
        });
    }
    
    if (metrics.growthRate < 0) {
        recommendations.push({
            icon: '📉',
            title: 'Pertumbuhan Negatif',
            desc: 'Bisnis mengalami penyusutan. Lakukan analisis mendalam dan strategi recovery.'
        });
    }
    
    if (recommendations.length === 0) {
        recommendations.push({
            icon: '✅',
            title: 'Keuangan Sehat',
            desc: 'Kondisi keuangan Anda sudah baik! Pertahankan dan terus tingkatkan.'
        });
    }
    
    recDiv.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-icon">${rec.icon}</div>
            <div class="recommendation-text">
                <div class="recommendation-title">${rec.title}</div>
                <div class="recommendation-desc">${rec.desc}</div>
            </div>
        </div>
    `).join('');
}

// Display data preview
function displayDataPreview(data) {
    const previewDiv = document.getElementById('previewTable');
    
    if (data.length === 0) {
        previewDiv.innerHTML = '<p>Tidak ada data untuk ditampilkan</p>';
        return;
    }
    
    let html = '<div class="preview-table-wrapper">';
    
    data.slice(0, 10).forEach((row, index) => {
        html += '<div class="preview-row">';
        Object.entries(row).forEach(([key, value]) => {
            html += `
                <div class="preview-cell-label">${key}</div>
                <div class="preview-cell-value">${value}</div>
            `;
        });
        html += '</div>';
    });
    
    html += '</div>';
    previewDiv.innerHTML = html;
}

// Load template data
function loadTemplate(type) {
    let templateData = {};
    
    switch(type) {
        case 'personal':
            templateData = {
                'Kategori': 'Personal Finance',
                'Pendapatan': '10000000',
                'Biaya Kebutuhan': '5000000',
                'Biaya Keinginan': '3000000',
                'Tabungan': '2000000',
                'Utang': '3000000',
                'Aset': '50000000'
            };
            break;
        case 'business':
            templateData = {
                'Periode': 'Q1 2024',
                'Revenue': '1000000000',
                'COGS': '400000000',
                'Operating Expense': '200000000',
                'Net Profit': '400000000',
                'Assets': '2000000000',
                'Liabilities': '800000000',
                'Equity': '1200000000'
            };
            break;
        case 'investment':
            templateData = {
                'Aset': 'Saham Emas',
                'Nilai Investasi': '100000000',
                'Nilai Saat Ini': '130000000',
                'Dividen': '5000000',
                'ROI': '35',
                'Waktu': '1'
            };
            break;
        case 'lambda':
            templateData = {
                'Year': '2021',
                'Revenue': '482845',
                'Expenses': '6200.43',
                'Operating Income': '476644.57',
                'Net Income': '476644.57',
                'Total Assets': '1000000',
                'Total Liabilities': '300000',
                'Total Equity': '700000'
            };
            break;
    }
    
    // Convert to CSV format and analyze
    const csv = Object.entries(templateData).map(([k, v]) => `${k};${v}`).join('\n');
    const data = parseCSV(csv);
    analyzeFinancialData(data);
    
    const fileStatus = document.getElementById('fileStatus');
    fileStatus.className = 'file-success';
    fileStatus.innerHTML = `✅ Template "${type.toUpperCase()}" berhasil dimuat!`;
}

// Export report as PDF/Text
function exportReport() {
    const resultsDiv = document.getElementById('analysisResults');
    const textContent = resultsDiv.innerText;
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textContent));
    element.setAttribute('download', 'Financial_Report_' + new Date().toISOString().split('T')[0] + '.txt');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    alert('Report berhasil diunduh!');
}
