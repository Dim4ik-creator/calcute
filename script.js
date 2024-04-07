let display = document.getElementById('display');
let isFirstInput = true;

function appendValue(value) {
    // Проверяем, если это первый ввод после очистки
    if (display.value === '' && value === '0') {
        return; // Игнорируем ввод 0 в начале строки
    }

    // Добавляем значение только если это цифра или оператор
    if (/[\d\/\*\-\+\^]/.test(value) || value === '.') {
        display.value += value;
        isFirstInput = false; // Устанавливаем флаг, что это не первый ввод
    }
}

function clearDisplay() {
    display.value = '';
    isFirstInput = true; // Устанавливаем флаг, что это первый ввод после очистки
}

function deleteChar() {
    display.value = display.value.slice(0, -1);
    if (display.value === '') {
        isFirstInput = true; // Если после удаления последнего символа строка ввода пуста, устанавливаем флаг, что это первый ввод
    }
}

function calculate() {
    let input = display.value;
    if (input.includes('^')) {
        let nums = input.split('^');
        let base = parseFloat(nums[0]);
        let exponent = parseFloat(nums[1]);
        display.value = Math.pow(base, exponent);
    } else {
        try {
            display.value = eval(input);
        } catch (error) {
            display.value = 'Error';
        }
    }
}

function handleKeyPress(event) {
    let key = event.key;

    // Если введенный символ - цифра, Backspace или Enter
    if (/^\d$/.test(key) || key === 'Backspace' || key === 'Enter') {
        // Если это первый ввод и введенный символ не цифра, игнорируем его
        if (isFirstInput && !/^\d$/.test(key)) {
            event.preventDefault();
            return;
        }

        // Обрабатываем ввод в зависимости от нажатой клавиши
        if (key === 'Enter') {
            calculate(); // Вызываем функцию calculate при нажатии Enter
        } else if (key === 'Backspace') {
            deleteChar(); // Вызываем функцию deleteChar при нажатии Backspace
        } else {
            // Добавляем значение на дисплей
            appendValue(key);
        }
    } else if (!isFirstInput && /[\/\*\-\+]/.test(key)) {
        // Если введенный символ - оператор и перед ним уже не стоит оператор
        let currentValue = display.value;
        let lastChar = currentValue[currentValue.length - 1];
        if (/[\/\*\-\+\^]/.test(lastChar)) {
            // Если последний символ - оператор, заменяем его на введенный
            display.value = currentValue.slice(0, -1) + key;
        } else {
            // Если последний символ не оператор, добавляем введенный оператор
            appendValue(key);
        }
    } else {
        event.preventDefault(); // Предотвращаем ввод других символов
    }
}

document.addEventListener('keydown', handleKeyPress);
