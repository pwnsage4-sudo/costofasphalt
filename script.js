const formatCurrency = (num) => {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
};

const formatWeight = (num) => {
    return num.toFixed(1) + " кг";
};

// Главная функция расчета, принимающая событие ввода
const calculate = (e) => {
    // 1. ОГРАНИЧИТЕЛЬ ВВОДА ДО 100%
    const mineralIds = ['perc-scheben', 'perc-otsev', 'perc-pgs', 'perc-minpor'];
    
    if (e && e.target && mineralIds.includes(e.target.id)) {
        let currentVal = parseFloat(e.target.value) || 0;
        let sumOthers = 0;
        
        mineralIds.forEach(otherId => {
            if (otherId !== e.target.id) {
                sumOthers += parseFloat(document.getElementById(otherId).value) || 0;
            }
        });
        
        let maxAllowed = 100 - sumOthers;
        maxAllowed = Math.round(maxAllowed * 10) / 10; 
        
        if (currentVal > maxAllowed) {
            e.target.value = maxAllowed;
        }
    }

    // 2. ПОЛУЧЕНИЕ АКТУАЛЬНЫХ ЗНАЧЕНИЙ
    const percScheben = parseFloat(document.getElementById('perc-scheben').value) || 0;
    const percOtsev = parseFloat(document.getElementById('perc-otsev').value) || 0;
    const percPgs = parseFloat(document.getElementById('perc-pgs').value) || 0;
    const percMinpor = parseFloat(document.getElementById('perc-minpor').value) || 0;
    const percBitum = parseFloat(document.getElementById('perc-bitum').value) || 0;

    // 3. ПРОВЕРКА СУММЫ И ПРЕДУПРЕЖДЕНИЯ
    const sumMineral = percScheben + percOtsev + percPgs + percMinpor;
    const warningEl = document.getElementById('warning-msg');
    
    if (sumMineral < 99.9) { 
        warningEl.style.display = 'block';
        let diff = (100 - sumMineral).toFixed(1);
        warningEl.innerText = `Сумма минералов: ${sumMineral.toFixed(1)}%. Добавьте еще ${diff}% для корректного рецепта.`;
    } else {
        warningEl.style.display = 'none';
    }

    const safeSumMineral = sumMineral === 0 ? 1 : sumMineral;

    // 4. РАСЧЕТ ВЕСОВ ДЛЯ 1 ТОННЫ
    const mineralTotalWeight = 1000 / (1 + (percBitum / 100));
    const bitumWeight = 1000 - mineralTotalWeight;

    const wScheben = mineralTotalWeight * (percScheben / safeSumMineral);
    const wOtsev = mineralTotalWeight * (percOtsev / safeSumMineral);
    const wPgs = mineralTotalWeight * (percPgs / safeSumMineral);
    const wMinpor = mineralTotalWeight * (percMinpor / safeSumMineral);

    // Обновляем UI веса
    document.getElementById('weight-scheben').innerText = formatWeight(wScheben);
    document.getElementById('weight-otsev').innerText = formatWeight(wOtsev);
    document.getElementById('weight-pgs').innerText = formatWeight(wPgs);
    document.getElementById('weight-minpor').innerText = formatWeight(wMinpor);
    document.getElementById('weight-bitum').innerText = formatWeight(bitumWeight);

    // Получаем цены
    const pScheben = parseFloat(document.getElementById('price-scheben').value) || 0;
    const pOtsev = parseFloat(document.getElementById('price-otsev').value) || 0;
    const pPgs = parseFloat(document.getElementById('price-pgs').value) || 0;
    const pMinpor = parseFloat(document.getElementById('price-minpor').value) || 0;
    const pBitum = parseFloat(document.getElementById('price-bitum').value) || 0;
    const pProd = parseFloat(document.getElementById('price-production').value) || 0;

    // Считаем стоимость
    const cScheben = (wScheben / 1000) * pScheben;
    const cOtsev = (wOtsev / 1000) * pOtsev;
    const cPgs = (wPgs / 1000) * pPgs;
    const cMinpor = (wMinpor / 1000) * pMinpor;
    const cBitum = (bitumWeight / 1000) * pBitum;

    // Обновляем UI стоимости
    document.getElementById('cost-scheben').innerText = formatCurrency(cScheben);
    document.getElementById('cost-otsev').innerText = formatCurrency(cOtsev);
    document.getElementById('cost-pgs').innerText = formatCurrency(cPgs);
    document.getElementById('cost-minpor').innerText = formatCurrency(cMinpor);
    document.getElementById('cost-bitum').innerText = formatCurrency(cBitum);

    // Итоги
    const totalMaterials = cScheben + cOtsev + cPgs + cMinpor + cBitum;
    const finalCost = totalMaterials + pProd;

    document.getElementById('total-materials').innerText = formatCurrency(totalMaterials);
    document.getElementById('total-final').innerText = formatCurrency(finalCost);
};

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', calculate);
    });

    // Первичный расчет
    calculate();
});
