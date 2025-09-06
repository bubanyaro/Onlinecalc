class Calculator {
    constructor() {
        this.input = document.getElementById('input');
        this.result = document.getElementById('result');
        this.currentInput = '0';
        this.shouldResetInput = false;
        this.lastResult = null;
        
        // Add keyboard support
        this.addKeyboardSupport();
    }

    updateDisplay() {
        this.input.textContent = this.currentInput;
        this.input.style.animation = 'none';
        this.input.offsetHeight; // Trigger reflow
        this.input.style.animation = 'fadeIn 0.3s ease-in';
    }

    updateResult(value) {
        this.result.textContent = value;
        if (value) {
            this.result.style.animation = 'fadeIn 0.3s ease-in';
        }
    }

    appendToInput(value) {
        if (this.shouldResetInput) {
            this.currentInput = '';
            this.shouldResetInput = false;
            this.updateResult('');
        }

        if (this.currentInput === '0' && value !== '.') {
            if (this.isOperator(value)) {
                this.currentInput += value;
            } else {
                this.currentInput = value;
            }
        } else {
            // Prevent multiple decimal points in a number
            if (value === '.') {
                const lastNumber = this.getLastNumber();
                if (lastNumber.includes('.')) {
                    return;
                }
            }
            
            // Prevent multiple operators
            if (this.isOperator(value) && this.isOperator(this.currentInput.slice(-1))) {
                this.currentInput = this.currentInput.slice(0, -1) + value;
            } else {
                this.currentInput += value;
            }
        }

        this.updateDisplay();
        this.calculatePreview();
    }

    getLastNumber() {
        const operators = ['+', '-', '*', '/'];
        let lastNumber = '';
        
        for (let i = this.currentInput.length - 1; i >= 0; i--) {
            const char = this.currentInput[i];
            if (operators.includes(char)) {
                break;
            }
            lastNumber = char + lastNumber;
        }
        
        return lastNumber;
    }

    isOperator(char) {
        return ['+', '-', '*', '/'].includes(char);
    }

    calculatePreview() {
        if (this.currentInput === '0' || this.currentInput === '') return;
        
        try {
            // Don't show preview if input ends with operator
            if (this.isOperator(this.currentInput.slice(-1))) {
                this.updateResult('');
                return;
            }

            const sanitizedInput = this.currentInput.replace(/×/g, '*');
            const previewResult = eval(sanitizedInput);
            
            if (isFinite(previewResult) && previewResult.toString() !== this.currentInput) {
                this.updateResult(`= ${this.formatNumber(previewResult)}`);
            } else {
                this.updateResult('');
            }
        } catch (error) {
            this.updateResult('');
        }
    }

    calculate() {
        if (this.currentInput === '0' || this.currentInput === '') return;

        try {
            const sanitizedInput = this.currentInput.replace(/×/g, '*');
            const result = eval(sanitizedInput);
            
            if (!isFinite(result)) {
                this.updateResult('Error');
                return;
            }

            const formattedResult = this.formatNumber(result);
            this.updateResult('');
            this.currentInput = formattedResult;
            this.lastResult = result;
            this.shouldResetInput = true;
            this.updateDisplay();
            
            // Add calculation animation
            this.animateCalculation();
        } catch (error) {
            this.updateResult('Error');
            this.shouldResetInput = true;
        }
    }

    formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        
        // Round to 10 decimal places to avoid floating point errors
        const rounded = Math.round(num * 10000000000) / 10000000000;
        return rounded.toString();
    }

    clearAll() {
        this.currentInput = '0';
        this.shouldResetInput = false;
        this.lastResult = null;
        this.updateDisplay();
        this.updateResult('');
        
        // Add clear animation
        this.animateClear();
    }

    deleteLast() {
        if (this.shouldResetInput) {
            this.clearAll();
            return;
        }

        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        
        this.updateDisplay();
        this.calculatePreview();
    }

    animateCalculation() {
        const calculator = document.querySelector('.calculator');
        calculator.style.animation = 'none';
        calculator.offsetHeight; // Trigger reflow
        calculator.style.animation = 'pulse 0.3s ease-in-out';
        
        setTimeout(() => {
            calculator.style.animation = '';
        }, 300);
    }

    animateClear() {
        const display = document.querySelector('.display');
        display.style.animation = 'shake 0.3s ease-in-out';
        
        setTimeout(() => {
            display.style.animation = '';
        }, 300);
    }

    addKeyboardSupport() {
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            
            // Numbers and decimal point
            if ((key >= '0' && key <= '9') || key === '.') {
                this.appendToInput(key);
            }
            // Operators
            else if (key === '+' || key === '-') {
                this.appendToInput(key);
            }
            else if (key === '*') {
                this.appendToInput('*');
            }
            else if (key === '/') {
                event.preventDefault(); // Prevent browser search
                this.appendToInput('/');
            }
            // Calculate
            else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                this.calculate();
            }
            // Clear
            else if (key === 'Escape' || key.toLowerCase() === 'c') {
                this.clearAll();
            }
            // Backspace
            else if (key === 'Backspace') {
                event.preventDefault();
                this.deleteLast();
            }
        });
    }
}

// Add additional CSS animations via JavaScript
const additionalStyles = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize calculator when DOM is loaded
let calculator;

document.addEventListener('DOMContentLoaded', () => {
    calculator = new Calculator();
});

// Global functions for button onclick events
function appendToInput(value) {
    calculator.appendToInput(value);
}

function calculate() {
    calculator.calculate();
}

function clearAll() {
    calculator.clearAll();
}

function deleteLast() {
    calculator.deleteLast();
}