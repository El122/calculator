document.addEventListener("DOMContentLoaded", () => {
	const lonelySigns = ["sin(", "cos(", "tg(", "ctg(", "sqrt(", "-"];

	const signsBtns = document.querySelectorAll(".btn-action");
	const numberBtns = document.querySelectorAll(".btn-number");

	const calculator = document.getElementById("calculator");
	const answer = document.getElementById("answer");
	const history = document.getElementById("historyContainer");

	const Calculator = {
		firstNum: null,
		secondNum: null,
		action: null,
		historyData: [],

		addHistory: () => {
			const div = document.createElement("div");
			div.innerHTML = calculator.value + " = " + answer.value;
			history.appendChild(div);
			Calculator.historyData = [
				Calculator.historyData,
				calculator.value + " = " + answer.value,
			];
			localStorage.setItem(
				"historyData",
				JSON.stringify(Calculator.historyData)
			);
		},

		"+": () =>
			parseFloat(Calculator.firstNum) + parseFloat(Calculator.secondNum),
		"-": () => Calculator.firstNum - Calculator.secondNum,
		"*": () => Calculator.firstNum * Calculator.secondNum,
		"/": () => Calculator.firstNum / Calculator.secondNum,
		"^": () => Calculator.firstNum ** Calculator.secondNum,

		"sqrt(": () => Math.sqrt(Calculator.secondNum),
		"sin(": () => Math.sin(Calculator.secondNum),
		"cos(": () => Math.cos(Calculator.secondNum),
		"tg(": () => Math.tan(Calculator.secondNum),
		"ctg(": () => 1 / Math.tan(Calculator.secondNum),

		"=": () => {
			if (Calculator.action) answer.value = Calculator[Calculator.action]();
			else answer.value = Calculator.firstNum;
			Calculator.addHistory();
			calculator.value = "";
			Calculator.firstNum = null;
			Calculator.secondNum = null;
			Calculator.action = null;
			setNumWrite("firstNum");
		},
	};

	if (localStorage.getItem("historyData")) {
		Calculator.historyData = JSON.parse(localStorage.getItem("historyData"));

		for (let item of Calculator.historyData) {
			const div = document.createElement("div");
			div.innerHTML = item;
			history.appendChild(div);
		}
	}

	setNumWrite = (numwrite) => {
		for (let btn of numberBtns) {
			btn.onclick = () => {
				calculator.value = calculator.value + btn.getAttribute("data-sign");
				if (numwrite == "firstNum")
					Calculator.firstNum = Calculator.firstNum
						? Calculator.firstNum + btn.getAttribute("data-sign")
						: btn.getAttribute("data-sign");
				else
					Calculator.secondNum = Calculator.secondNum
						? Calculator.secondNum + btn.getAttribute("data-sign")
						: btn.getAttribute("data-sign");
			};
		}
	};

	for (let btn of signsBtns) {
		btn.onclick = () => {
			const targetSign = btn.getAttribute("data-sign");

			if (targetSign == "=") {
				Calculator["="]();
				return;
			}

			if (targetSign == "-" && !Calculator.firstNum) {
				calculator.value = btn.getAttribute("data-sign");
				Calculator.firstNum = calculator.value;
				return;
			}

			if (lonelySigns.indexOf(targetSign) + 1 && !Calculator.firstNum) {
				Calculator.action = targetSign;
				calculator.value = Calculator.action;
				setNumWrite("secondNum");
			}

			if (Calculator.firstNum) {
				Calculator.action = targetSign;
				calculator.value = Calculator.firstNum + Calculator.action;
				setNumWrite("secondNum");
			}
		};
	}

	for (let btn of numberBtns) {
		btn.onclick = () => {
			calculator.value = calculator.value + btn.getAttribute("data-sign");
			Calculator.firstNum = calculator.value;
		};
	}

	document.onkeydown = (e) => {
		if (/[0-9\.]/.test(e.key)) {
			if (!Calculator.action) {
				Calculator.firstNum
					? (Calculator.firstNum += e.key)
					: (Calculator.firstNum = e.key);
				calculator.value = Calculator.firstNum;
			} else {
				Calculator.secondNum
					? (Calculator.secondNum += e.key)
					: (Calculator.secondNum = e.key);
				calculator.value =
					Calculator.firstNum + Calculator.action + Calculator.secondNum;
			}
		} else if (/[+-=\/*^]/.test(e.key)) {
			const targetSign = e.key;

			if (targetSign == "=") {
				Calculator["="]();
				return;
			}

			if (targetSign == "-" && !Calculator.firstNum) {
				calculator.value = targetSign;
				Calculator.firstNum = calculator.value;
				return;
			}

			if (lonelySigns.indexOf(targetSign) + 1 && !Calculator.firstNum) {
				Calculator.action = targetSign;
				calculator.value = Calculator.action;
				setNumWrite("secondNum");
			}

			if (Calculator.firstNum) {
				Calculator.action = targetSign;
				calculator.value = Calculator.firstNum + Calculator.action;
				setNumWrite("secondNum");
			}
		}
	};
});
