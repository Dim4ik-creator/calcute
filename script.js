let display = document.getElementById('display');
let isFirstInput = true; // Флаг для отслеживания первого ввода
let isLastActionCalculate = false; // Флаг для отслеживания последнего действия
let operatorEntered = false; // Флаг для отслеживания ввода оператора

function appendValue(value) {
    // Проверяем, было ли последнее действие вычислением
    if (isLastActionCalculate) {
        // Очищаем дисплей, если последнее действие было вычислением и ввод - цифра или десятичная точка
        if (/[\d.]/.test(value)) {
            display.value = '';
            operatorEntered = false; // Сбрасываем флаг оператора
        }
        isLastActionCalculate = false;
    }

    // Проверяем, является ли ввод цифрой, оператором или десятичной точкой
    if (/[\d\/\*\-\+\^]/.test(value) || value === '.') {
        // Проверяем, является ли последний символ оператором, и текущий ввод также оператором
        let lastChar = display.value.slice(-1);

        if (/[\/*\-+\^]/.test(value)) {
            if (operatorEntered) {
                return; // Игнорируем ввод, если оператор уже введен
            } else {
                operatorEntered = true; // Устанавливаем флаг оператора
            }
        } else if (operatorEntered && /[\d.]/.test(lastChar) && /[\d.]/.test(value)) {
            // Разрешаем ввод, если это цифра или десятичная точка, и оператор уже введен
        } else if (operatorEntered) {
            return; // Игнорируем ввод, если оператор уже введен и вводится другой оператор
        }

        display.value += value; // Добавляем значение к дисплею
        isFirstInput = false; // Устанавливаем флаг, указывающий на то, что это не первый ввод
    }
}

function clearDisplay() {
    display.value = '';
    isFirstInput = true; // Устанавливаем флаг, указывающий на то, что это первый ввод после очистки
    operatorEntered = false; // Сбрасываем флаг оператора
}

function deleteChar() {
    // Если значение дисплея "Ошибка", очищаем дисплей одним нажатием Backspace
    if (display.value === 'Ошибка') {
        display.value = '';
    } else {
        let lastChar = display.value.slice(-1);
        if (/[\/*\-+\^]/.test(lastChar)) {
            operatorEntered = false; // Сбрасываем флаг оператора при удалении оператора
        }
        display.value = display.value.slice(0, -1);
    }

    if (display.value === '') {
        isFirstInput = true; // Устанавливаем флаг, указывающий на то, что это первый ввод после удаления
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
            display.value = 'Ошибка';
        }
    }
    isLastActionCalculate = true; // Устанавливаем флаг, указывающий на то, что последнее действие было вычислением
    operatorEntered = false; // Сбрасываем флаг оператора после вычисления
}

function handleKeyPress(event) {
    let key = event.key;

    // Проверяем, является ли нажатая клавиша цифрой, Backspace или Enter
    if (/^\d$/.test(key) || key === 'Backspace' || key === 'Enter') {
        // Игнорируем ввод, если это первый ввод и нажатая клавиша не является цифрой
        if (isFirstInput && !/^\d$/.test(key)) {
            event.preventDefault();
            return;
        }

        // Обрабатываем ввод в зависимости от нажатой клавиши
        if (key === 'Enter') {
            calculate(); // Вызываем функцию calculate при нажатии клавиши Enter
        } else if (key === 'Backspace') {
            deleteChar(); // Вызываем функцию deleteChar при нажатии клавиши Backspace
        } else {
            appendValue(key); // Добавляем значение к дисплею
        }
    } else if (!isFirstInput && /[\/\*\-\+\^]/.test(key)) {
        // Обрабатываем ввод оператора, если это не первый ввод
        let currentValue = display.value;
        let lastChar = currentValue[currentValue.length - 1];
        if (/[\/\*\-\+\^]/.test(lastChar)) {
            // Заменяем последний оператор новым оператором
            display.value = currentValue.slice(0, -1) + key;
        } else {
            appendValue(key); // Добавляем оператор к дисплею
        }
    } else if (isLastActionCalculate && /[\/\*\-\+\^]/.test(key)) {
        // Если последнее действие было вычислением и ввод - оператор
        isLastActionCalculate = false;
        appendValue(key); // Добавляем оператор к дисплею
    } else if (isLastActionCalculate && /[\d.]/.test(key)) {
        // Если последнее действие было вычислением и ввод - цифра или десятичная точка
        display.value = key; // Заменяем дисплей новым вводом
        isLastActionCalculate = false;
    } else {
        event.preventDefault(); // Предотвращаем ввод других символов
    }
}

document.addEventListener('keydown', handleKeyPress);
