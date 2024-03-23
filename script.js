function updateDrawMode() {
	fastMode = !fastMode;
}

function updateSortSpeed() {
	sortSpeed = sortSpeedHandle.value;
}

function updateArrayLength() {
	arrLength = parseInt(arrLengthHandle.value);
	arr = [];
	for (let i = 1; i < arrLength + 1; i++) {
		arr.push(i);
	}
	bar_width = canvas.width / arr.length;
	bar_height = canvas.height / max(arr);
	updateArray();
}

function rectF(x, y, w, h, style = "white") {
	c.beginPath();
	c.fillStyle = style;
	c.fillRect(x, y, w, h);
	c.closePath();
}

function rect(x, y, w, h, style = "black") {
	c.beginPath();
	c.strokeStyle = style;
	c.lineWidth = 1;
	c.rect(x, y, w, h);
	c.stroke();
	c.closePath();
}

function line(x, y, dx, dy, w, style = "white") {
	c.beginPath();
	c.moveTo(x, y);
	c.lineTo(dx, dy);
	c.strokeStyle = style;
	c.lineWidth = w;
	c.stroke();
	c.closePath();
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function max(arr) {
	if (arr.length) {
		let max = arr[0];
		arr.forEach((val) => {
			if (max < val) {
				max = val;
			}
		});
		return max;
	} else {
		console.error("Array length is zero.");
	}
}

function stop() {}

function randint(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function shuffle(array) {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex > 0) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		c_index = [currentIndex, randomIndex];

		if (Math.random() < 100 / array.length) {
			updateArray();
			await sleep(0);
		}
	}

	return array;
}

function isSorted(arr) {
	for (let i = 0; i < arr.length - 2; i++) {
		if (arr[i] > arr[i + 1]) {
			return false;
		}
	}
	return true;
}

function updateArray(sorted = false) {
	let i = 0;
	arr.forEach(function (val) {
		if (fastMode) {
			line(i * bar_width + bar_width / 2, canvas.height, i * bar_width + bar_width / 2, canvas.height - val * bar_height, bar_width, "rgb(233, 233, 233)");
			if (sorted) {
				line(i * bar_width + bar_width / 2, canvas.height, i * bar_width + bar_width / 2, canvas.height - val * bar_height, bar_width, "rgb(0, 233, 0)");
			} else if (c_index.length) {
				c_index.forEach((c) => {
					line(c * bar_width + bar_width / 2, canvas.height, c * bar_width + bar_width / 2, canvas.height - arr[c] * bar_height, bar_width, "rgb(233, 0, 0)");
				});
			}
		} else {
			rectF(i * bar_width, canvas.height - val * bar_height, bar_width, val * bar_height, "rgb(233, 233, 233)");
			if (sorted) {
				rectF(i * bar_width, canvas.height - val * bar_height, bar_width, val * bar_height, "rgb(0,233,0)");
			} else if (c_index.length) {
				c_index.forEach((c) => {
					rectF(c * bar_width, canvas.height - arr[c] * bar_height, bar_width, arr[c] * bar_height, "rgb(233,0,0)");
					rect(c * bar_width, canvas.height - arr[c] * bar_height, bar_width, arr[c] * bar_height, "black");
				});
			}
			rect(i * bar_width, canvas.height - val * bar_height, bar_width, val * bar_height, "black");
		}
		i++;
	});
}

function frame() {
	if (isSorted(arr)) {
		updateArray((sorted = true));
	} else {
		updateArray();
	}
}

//INIT FUNCTIONS

/**
 * initialises canvas for sorting visualizers
 * @param {HTMLElement} parent - parent for the canvas and settings
 */
function initCanvas(parent) {
	canvas = document.createElement("canvas");
	canvas.width = 1000;
	canvas.height = 500;
	parent.appendChild(canvas);
	parent.insertBefore(canvas, document.getElementById("settings"));

	parent.style["display"] = "flex";
	parent.style["justify-content"] = "center";
	parent.style["align-items"] = "center";
	parent.style["background-color"] = "rgb(28, 28, 28)";

	c = canvas.getContext("2d");

	arrLength = 30;
	arr = [];

	for (let i = 1; i < arrLength; i++) {
		arr.push(i);
	}

	bar_width = canvas.width / arr.length;
	bar_height = canvas.height / max(arr);

	shuffle(arr);

	c_index = [];
}

/**
 * initializes settings
 * Possible algorithms:
 * - bogo
 * - bubble
 * - selection
 * - insertion
 * - merge
 * - quick
 * - radix
 * - stalin
 * @param {object} sort_list - list of sorting algorithms to be there e.g.
 */
function initSettings(parent, sort_list) {
	settings = document.createElement("div");
	settings.id = "settings";
	settings.innerHTML = `<input id="sortSpeed" class="text" placeholder="ms delay" oninput="updateSortSpeed()" />
		<input id="arrayLength" class="text" placeholder="arr length" oninput="updateArrayLength()" />

		<div class="button">
			<label for="draw-mode" class="text">Fast-Draw</label>
			<input id="draw-mode" type="checkbox" checked="false" onchange="updateDrawMode()" />
		</div>

		<button onclick="if(isRunning){isRunning = false;}" class="button" id="stop">BRAKE</button>

		${sort_list.length == 0 || sort_list.includes("bogo") ? '<button onclick="bogo(arr)" class="button">bogo</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("bubble") ? '<button onclick="bubble(arr)" class="button">bubble</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("selection") ? '<button onclick="selection(arr, updateArray, () => {}, 0, updateArray)" class="button">selection</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("insertion") ? '<button onclick="insertion(arr)" class="button">insertion</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("merge") ? '<button onclick="merge(arr, updateArray, () => {}, 0)" class="button">merge</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("quick") ? '<button onclick="isRunning = true; quicksort(arr, 0, arr.length - 1)" class="button">qsort</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("radix") ? '<button onclick="radixsort(arr)" class="button">radix</button>' : ""}
		${sort_list.length == 0 || sort_list.includes("stalin") ? '<button onclick="stalin(arr, updateArray, updateArray)" class="button">stalin</button>' : ""}

		<button onclick="if(!isRunning){isRunning = true; shuffle(arr); isRunning = false;}" class="button" id="shuffle">shuffle</button>

		<a id="github-link" href="https://github.com/nanaryu/nanaryu.github.io" target="_blank">github.com/Nanaryu</a>
		<a id="github-link" href="https://github.com/Evgen4X" target="_blank">github.com/Evgen4X</a>
	`;

	parent.appendChild(settings);

	fastMode = false;

	drawModeHandle = document.getElementById("draw-mode");

	sortSpeedHandle = document.getElementById("sortSpeed");

	sortSpeed = 30;

	arrLengthHandle = document.getElementById("arrayLength");

	animate = () => {
		requestAnimationFrame(animate);

		c.clearRect(0, 0, canvas.width, canvas.height);

		frame();
	};

	animate();

	window.onload = () => {
		drawModeHandle.checked = false;
		arrLengthHandle.value = "";
		sortSpeedHandle.value = "";
	};

	isRunning = false;
}

var canvas, v, arrLength, arr, bar_width, bar_height, c_index, fastMode, sortSpeed, drawModeHandle, sortSpeedHandle, arrLengthHandle, animate, isRunning, settings;
