// Format currency to Indonesian Rupiah
function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Format percentage
function formatPercent(value) {
    return value.toFixed(2) + '%';
}

// Calculator 1: Compound Interest
function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('principal').value);
    const rate = parseFloat(document.getElementById('rate').value) / 100;
    const time = parseFloat(document.getElementById('time').value);
    const frequency = parseInt(document.getElementById('frequency').value);

    if (principal <= 0 || rate < 0 || time <= 0) {
        alert('Masukkan nilai yang valid!');
        return;
    }

    const amount = principal * Math.pow((1 + rate / frequency), frequency * time);
    const interest = amount - principal;

    const resultDiv = document.getElementById('resultCompound');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Jumlah Awal:</strong> ${formatCurrency(principal)}</p>
            <p><strong>Bunga Diperoleh:</strong> ${formatCurrency(interest)}</p>
            <p><strong>Jumlah Total Akhir:</strong> ${formatCurrency(amount)}</p>
            <p><strong>Penjelasan:</strong> Uang Anda akan berkembang menjadi ${formatCurrency(amount)} setelah ${time} tahun dengan bunga majemuk ${formatPercent(rate * 100)}.</p>
        </div>
    `;
}

// Calculator 2: ROI
function calculateROI() {
    const initial = parseFloat(document.getElementById('initialInvestment').value);
    const current = parseFloat(document.getElementById('currentValue').value);

    if (initial <= 0) {
        alert('Masukkan nilai investasi awal yang valid!');
        return;
    }

    const profit = current - initial;
    const roi = (profit / initial) * 100;

    const resultDiv = document.getElementById('resultROI');
    let status = roi > 0 ? '✅ Untung' : roi < 0 ? '❌ Rugi' : '⚪ Impas';

    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Investasi Awal:</strong> ${formatCurrency(initial)}</p>
            <p><strong>Nilai Sekarang:</strong> ${formatCurrency(current)}</p>
            <p><strong>Keuntungan/Kerugian:</strong> ${formatCurrency(profit)} (${status})</p>
            <p><strong>ROI:</strong> ${formatPercent(roi)}</p>
            <p><strong>Penjelasan:</strong> Investasi Anda menghasilkan return sebesar ${formatPercent(roi)}. ${roi > 0 ? 'Investasi Anda menguntungkan!' : roi < 0 ? 'Investasi Anda mengalami kerugian. Pertimbangkan strategi baru.' : 'Investasi Anda tidak untung dan tidak rugi.'}</p>
        </div>
    `;
}

// Calculator 3: EMI
function calculateEMI() {
    const principal = parseFloat(document.getElementById('loanAmount').value);
    const annualRate = parseFloat(document.getElementById('annualRate').value) / 100;
    const years = parseFloat(document.getElementById('loanTerm').value);

    if (principal <= 0 || annualRate < 0 || years <= 0) {
        alert('Masukkan nilai yang valid!');
        return;
    }

    const monthlyRate = annualRate / 12;
    const months = years * 12;

    // EMI Formula: P * [r(1+r)^n] / [(1+r)^n-1]
    const emi = principal * 
        (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emi * months;
    const totalInterest = totalPayment - principal;

    const resultDiv = document.getElementById('resultEMI');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Jumlah Pinjaman:</strong> ${formatCurrency(principal)}</p>
            <p><strong>Bunga per Tahun:</strong> ${formatPercent(annualRate * 100)}</p>
            <p><strong>Jangka Waktu:</strong> ${years} tahun (${months} bulan)</p>
            <p><strong>Cicilan Bulanan:</strong> ${formatCurrency(emi)}</p>
            <p><strong>Total Bunga:</strong> ${formatCurrency(totalInterest)}</p>
            <p><strong>Total Pembayaran:</strong> ${formatCurrency(totalPayment)}</p>
            <p><strong>Penjelasan:</strong> Anda harus membayar cicilan sebesar ${formatCurrency(emi)} setiap bulan selama ${years} tahun. Total bunga yang harus dibayarkan adalah ${formatCurrency(totalInterest)}.</p>
        </div>
    `;
}

// Calculator 4: DTI
function calculateDTI() {
    const income = parseFloat(document.getElementById('monthlyIncome').value);
    const debt = parseFloat(document.getElementById('monthlyDebt').value);

    if (income <= 0) {
        alert('Masukkan pendapatan bulanan yang valid!');
        return;
    }

    const dti = (debt / income) * 100;
    let status = '';

    if (dti < 20) {
        status = '✅ Sangat Sehat - Anda memiliki keuangan yang sangat baik!';
    } else if (dti < 36) {
        status = '✅ Sehat - Keuangan Anda dalam kondisi baik.';
    } else if (dti < 50) {
        status = '⚠️ Perhatian - Beban utang Anda cukup tinggi. Pertimbangkan untuk mengurangi pengeluaran atau meningkatkan penghasilan.';
    } else {
        status = '❌ Kritis - Beban utang Anda sangat tinggi! Segera ambil tindakan.';
    }

    const resultDiv = document.getElementById('resultDTI');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Pendapatan Bulanan:</strong> ${formatCurrency(income)}</p>
            <p><strong>Total Cicilan Utang:</strong> ${formatCurrency(debt)}</p>
            <p><strong>DTI Ratio:</strong> ${formatPercent(dti)}</p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Target Ideal:</strong> DTI di bawah 36% untuk keuangan yang sehat.</p>
        </div>
    `;
}

// Calculator 5: Savings Rate
function calculateSavingsRate() {
    const netIncome = parseFloat(document.getElementById('netIncome').value);
    const savings = parseFloat(document.getElementById('monthlysSavings').value);

    if (netIncome <= 0) {
        alert('Masukkan pendapatan bersih yang valid!');
        return;
    }

    const savingsRate = (savings / netIncome) * 100;
    let feedback = '';

    if (savingsRate < 10) {
        feedback = '⚠️ Tingkat menabung Anda sangat rendah. Coba tingkatkan untuk masa depan yang lebih baik.';
    } else if (savingsRate < 20) {
        feedback = '👍 Tingkat menabung Anda cukup baik, tapi masih bisa ditingkatkan.';
    } else if (savingsRate < 30) {
        feedback = '✅ Sangat baik! Anda adalah penabung yang konsisten.';
    } else {
        feedback = '🌟 Luar biasa! Anda menabung dengan sangat baik dan siap untuk investasi jangka panjang.';
    }

    const resultDiv = document.getElementById('resultSavings');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Pendapatan Bersih Bulanan:</strong> ${formatCurrency(netIncome)}</p>
            <p><strong>Tabungan Bulanan:</strong> ${formatCurrency(savings)}</p>
            <p><strong>Tingkat Penghematan:</strong> ${formatPercent(savingsRate)}</p>
            <p><strong>Pengeluaran Bulanan:</strong> ${formatCurrency(netIncome - savings)}</p>
            <p><strong>Feedback:</strong> ${feedback}</p>
            <p><strong>Target Ideal:</strong> Minimal 20% dari pendapatan untuk tabungan.</p>
        </div>
    `;
}

// Calculator 6: Break-even Point
function calculateBEP() {
    const fixedCost = parseFloat(document.getElementById('fixedCost').value);
    const sellingPrice = parseFloat(document.getElementById('sellingPrice').value);
    const variableCost = parseFloat(document.getElementById('variableCost').value);

    if (fixedCost < 0 || sellingPrice <= 0 || variableCost < 0) {
        alert('Masukkan nilai yang valid!');
        return;
    }

    if (sellingPrice <= variableCost) {
        alert('Harga jual harus lebih besar dari biaya variabel!');
        return;
    }

    const contribution = sellingPrice - variableCost;
    const bepUnits = fixedCost / contribution;
    const bepRupiah = bepUnits * sellingPrice;

    const resultDiv = document.getElementById('resultBEP');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Biaya Tetap Bulanan:</strong> ${formatCurrency(fixedCost)}</p>
            <p><strong>Harga Jual per Unit:</strong> ${formatCurrency(sellingPrice)}</p>
            <p><strong>Biaya Variabel per Unit:</strong> ${formatCurrency(variableCost)}</p>
            <p><strong>Margin Kontribusi per Unit:</strong> ${formatCurrency(contribution)}</p>
            <p><strong>BEP (Unit):</strong> ${Math.ceil(bepUnits)} unit</p>
            <p><strong>BEP (Rupiah):</strong> ${formatCurrency(bepRupiah)}</p>
            <p><strong>Penjelasan:</strong> Anda harus menjual minimal ${Math.ceil(bepUnits)} unit per bulan untuk mencapai titik impas (tidak untung dan tidak rugi). Setelah itu, setiap unit yang terjual adalah keuntungan.</p>
        </div>
    `;
}

// Calculator 7: Future Value
function calculateFutureValue() {
    const presentValue = parseFloat(document.getElementById('presentValueFV').value);
    const growthRate = parseFloat(document.getElementById('growthRate').value) / 100;
    const years = parseFloat(document.getElementById('years').value);

    if (presentValue <= 0 || growthRate < 0 || years <= 0) {
        alert('Masukkan nilai yang valid!');
        return;
    }

    const futureValue = presentValue * Math.pow((1 + growthRate), years);
    const totalGrowth = futureValue - presentValue;

    const resultDiv = document.getElementById('resultFutureValue');
    resultDiv.innerHTML = `
        <div class="result-content">
            <p><strong>Tabungan Saat Ini:</strong> ${formatCurrency(presentValue)}</p>
            <p><strong>Tingkat Pertumbuhan per Tahun:</strong> ${formatPercent(growthRate * 100)}</p>
            <p><strong>Jangka Waktu:</strong> ${years} tahun</p>
            <p><strong>Nilai di Masa Depan:</strong> ${formatCurrency(futureValue)}</p>
            <p><strong>Pertumbuhan Total:</strong> ${formatCurrency(totalGrowth)}</p>
            <p><strong>Penjelasan:</strong> Jika Anda menabung/menginvestasikan ${formatCurrency(presentValue)} hari ini dengan pertumbuhan ${formatPercent(growthRate * 100)} per tahun, dalam ${years} tahun uang Anda akan menjadi ${formatCurrency(futureValue)}. Itu berarti pertumbuhan sebesar ${formatCurrency(totalGrowth)}!</p>
        </div>
    `;
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});