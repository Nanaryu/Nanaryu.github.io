function updateDrawMode() {
	fastMode = !fastMode;
	if (fastMode) {
		document.getElementById("fast-mode-span").innerHTML = "LDM ON";
		document.getElementById("fast-mode-span").style.color = "rgb(139, 187, 255)";
	} else {
		document.getElementById("fast-mode-span").innerHTML = "LDM OFF";
		document.getElementById("fast-mode-span").style.color = "rgb(233, 202, 202)";
	}
}

function updateSortSpeed() {
	let input = document.getElementById("sortSpeed");
	if (!"0123456789".includes(input.value[input.value.length - 1])) {
		input.value = input.value.slice(0, input.value.length - 1);
	}
	sortSpeed = sortSpeedHandle.value;
}

function updateArrayLength() {
	let input = document.getElementById("arrayLength");
	if (!"0123456789".includes(input.value[input.value.length - 1])) {
		input.value = input.value.slice(0, input.value.length - 1);
	}
	arrLength = parseInt(arrLengthHandle.value);
	arr = [];
	for (let i = 1; i < arrLength + 1; i++) {
		arr.push(i);
	}
	// accounts for bar scaling
	bar_width = canvas.width / arr.length;
	bar_height = canvas.height / max(arr);
	updateArray();

	if (arrLength >= 150) {
		// Low Detail Mode for 150+ bars because canvas may not handle bar borders that thin
		if (!fastMode) {
			updateDrawMode();
		}
	} else {
		if (fastMode) {
			updateDrawMode();
		}
	}
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
	return new Promise((r) => setTimeout(r, ms)); // i hate you
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
	}
}

function randint(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function shuffle(array, changeIsRunning = true) {
	let currentIndex = array.length,
		randomIndex;

	while (currentIndex > 0 && isRunning) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		c_index = [currentIndex, randomIndex];

		if (Math.random() < 100 / array.length) {
			// it should probably work
			updateArray();
			await sleep(sortSpeed);
		}
	}

	if (changeIsRunning) isRunning = false;
	c_index = [];
	return array;
}

// im not proud of this but it works
function isSorted(arr) {
	for (let i = 0; i < arr.length - 1; i++) {
		if (arr[i] > arr[i + 1]) {
			return false;
		}
	}
	return true;
}

// crazy maths
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

// accounts for every frame, as name may lightly suggest
function frame() {
	if (isSorted(arr)) {
		updateArray((sorted = true));
	} else {
		updateArray();
	}
}

// starts selected sorting animation and replaces 'start' button with 'stop'
async function start() {
	let type = document.getElementById("sortType").value;
	if (!type) {
		type = document.getElementById("sortType").innerHTML;
	}
	console.log(type);
	document.getElementById("stop").onclick = () => {
		isRunning = false;
		document.getElementById("stop").onclick = start;
		document.getElementById("stop").innerHTML = "start";
		document.getElementById("stop").style.color = "rgb(0, 255, 0)";
	};
	document.getElementById("stop").innerHTML = "stop";
	document.getElementById("stop").style.color = "rgb(255, 0, 0)";
	if (type == "bogo") {
		await bogo(arr);
	} else if (type == "bubble") {
		await bubble(arr);
	} else if (type == "selection") {
		await selection(arr);
	} else if (type == "insertion") {
		await insertion(arr);
	} else if (type == "merge") {
		await merge(arr);
	} else if (type == "qsort") {
		await quicksort(arr);
	} else if (type == "radix") {
		await radixsort(arr);
	} else if (type == "stalin") {
		await stalin(arr);
	}
	document.getElementById("stop").onclick = start;
	document.getElementById("stop").innerHTML = "start";
	document.getElementById("stop").style.color = "rgb(0, 255, 0)";
}

var ALT_MOTIVE = false;

var motive_1_p1 = `<input id="sortSpeed" class="text" placeholder="ms delay" oninput="updateSortSpeed()" />
		<input id="arrayLength" class="text" placeholder="arr length" oninput="updateArrayLength()" />

		<button class="text button" onclick="document.getElementById('draw-mode').checked = !document.getElementById('draw-mode').checked; updateDrawMode();">
			<span id='fast-mode-span'>LDM OFF</span>
			<input id="draw-mode" type="checkbox" checked="false" />
		</button>
`;

var motive_1_p2 = `		
		
		<button onclick="start();" class="button" id="stop">start</button>

		<button onclick="if(!isRunning){isRunning = true; shuffle(arr);}" class="button" id="shuffle">shuffle</button>


		<div id="github">
			<a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
			<a id="github-link" href="https://github.com/evgen4x" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Evgen4X</a>
		</div>
`;

//INIT FUNCTIONS

/**
 * initializes canvas for sorting visualizers
 *  * initializes settings
 * Possible algorithms:
 * - bogo
 * - bubble
 * - selection
 * - insertion
 * - merge
 * - quick
 * - radix
 * - stalin
 * @param {HTMLElement} parent - parent for the canvas and settings
 * @param {Array} sort_list - list of sorting algorithms to be there e.g.
 */
function initSortAnim(parent, sort_list) {
	parent = document.getElementById(parent);
	canvas = document.createElement("canvas");
	canvas.id = document.querySelectorAll("canavs").length + 1;
	canvas.width = 1000;
	canvas.height = 500;
	parent.appendChild(canvas);

	if (!ALT_MOTIVE) {
		parent.style["display"] = "flex";
		parent.style["justify-content"] = "center";
		parent.style["align-items"] = "center";
		parent.style["background-color"] = "rgb(28, 28, 28)";

		let select = `
		<select class="button" id="sortType">
			${sort_list.length == 0 || sort_list.includes("bogo") ? '<option onclick="bogo(arr)">bogo</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("bubble") ? '<option onclick="bubble(arr)">bubble</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("selection") ? '<option onclick="selection(arr)">selection</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("insertion") ? '<option onclick="insertion(arr)">insertion</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("merge") ? '<option onclick="isRunning = true; merge(arr, 0, null, true);">merge</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("quicksort") ? '<option onclick="isRunning = true; quicksort(arr, 0, arr.length - 1, true);">qsort</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("radix") ? '<option onclick="radixsort(arr)">radix</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("stalin") ? '<option onclick="stalin(arr)">stalin</option>' : ""}
		</select>`;

		if (sort_list.length == 1) {
			select = `<div class="button" id="sortType" style="user-select: none; cursor: default;">${sort_list[0]}</div>`;
		}

		settings = document.createElement("div");
		settings.id = "settings";
		settings.innerHTML = motive_1_p1 + select + motive_1_p2;

		//parent.style.padding = "25px"
		//parent.style.border = "3px rgba(233,233,233,0.7) solid"
		//parent.style.boxShadow = "0 0 5px rgba(233,233,233,0.7)"

		canvas.width = settings.offsetWidth * 4;
		canvas.height = settings.offsetHeight - 6; // literally unscalable

		parent.appendChild(settings);
	} else {
		parent.style["display"] = "flex";
		parent.style["flex-direction"] = "column";
		parent.style["justify-content"] = "center";
		parent.style["align-items"] = "center";
		parent.style["background-color"] = "rgb(28, 28, 28)";

		let select = `
		<select class="button" id="sortType">
			${sort_list.length == 0 || sort_list.includes("bogo") ? '<option onclick="bogo(arr)">bogo</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("bubble") ? '<option onclick="bubble(arr)">bubble</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("selection") ? '<option onclick="selection(arr)">selection</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("insertion") ? '<option onclick="insertion(arr)">insertion</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("merge") ? '<option onclick="isRunning = true; merge(arr, 0, null, true);">merge</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("quicksort") ? '<option onclick="isRunning = true; quicksort(arr, 0, arr.length - 1, true);">qsort</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("radix") ? '<option onclick="radixsort(arr)">radix</option>' : ""}
			${sort_list.length == 0 || sort_list.includes("stalin") ? '<option onclick="stalin(arr)">stalin</option>' : ""}
		</select>`;

		if (sort_list.length == 1) {
			select = `<div class="button" id="sortType" style="user-select: none; cursor: default;">${sort_list[0]}</div>`;
		}

		settings = document.createElement("div");
		settings.id = "settings";

		settings.innerHTML = `
		<input id="sortSpeed" class="text" placeholder="ms delay" oninput="updateSortSpeed()" />
		<input id="arrayLength" class="text" placeholder="arr length" oninput="updateArrayLength()" />

		<button class="text button" onclick="document.getElementById('draw-mode').checked = !document.getElementById('draw-mode').checked; updateDrawMode();">
			<span id='fast-mode-span'>LDM OFF</span>
			<input id="draw-mode" type="checkbox" checked="false" />
		</button>

		${select}

		<button onclick="start();" class="button" id="stop">start</button>

		<button onclick="if(!isRunning){isRunning = true; shuffle(arr);}" class="button" id="shuffle">shuffle</button>

		<div id="github">
			<a id="github-link" href="https://github.com/nanaryu" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Nanaryu</a>
			<a id="github-link" href="https://github.com/evgen4x" target="_blank"><svg class="github-img" viewBox="0 0 16 16"><path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path></svg>&nbsp;Evgen4X</a>
		</div>
		`;

		settings.style["flex-direction"] = "row";
		settings.style["border-radius"] = "0px";
		settings.style["border"] = "0.1875em rgba(233,233,233,0.3) solid";
		settings.style["border-top"] = "none";
		settings.style["border-bottom-left-radius"] = "10px";
		settings.style["border-bottom-right-radius"] = "10px";

		canvas.style["border"] = "0.1875em rgba(233,233,233,0.3) solid";
		canvas.style["border-bottom"] = "none";
		canvas.style["border-radius"] = "0px";
		canvas.style["border-top-left-radius"] = "10px";
		canvas.style["border-top-right-radius"] = "10px";

		canvas.width = settings.offsetWidth - 6;
		canvas.height = settings.offsetHeight * 10;

		parent.appendChild(settings);

		document.getElementById("sortSpeed").style["margin-top"] = "3px";
		document.getElementById("sortSpeed").style["margin-left"] = "10px";
		document.getElementById("github").style["margin-bottom"] = "0px";
		document.getElementById("github").style["margin-right"] = "10px";
	}

	c = canvas.getContext("2d");

	arrLength = 30; // default array length
	arr = [];

	for (let i = 1; i < arrLength; i++) {
		arr.push(i);
	}

	bar_width = canvas.width / arr.length;
	bar_height = canvas.height / max(arr);

	shuffle(arr);

	c_index = [];

	sort_list.forEach((val, i) => {
		sort_list[i] = val.toLowerCase();
	});

	if (!ALT_MOTIVE) {
		canvas.width = settings.offsetWidth * 4;
		canvas.height = settings.offsetHeight - 6; // literally unscalable
	} else {
		canvas.width = settings.offsetWidth - 6;
		canvas.height = settings.offsetHeight * 10;
	}

	bar_width = canvas.width / arr.length;
	bar_height = canvas.height / max(arr);

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

	window.onresize = () => {
		if (!ALT_MOTIVE) {
			canvas.width = settings.offsetWidth * 4;
			canvas.height = settings.offsetHeight - 6;
		} else {
			canvas.width = settings.offsetWidth - 6;
			canvas.height = settings.offsetHeight * 10;
		}
	};

	isRunning = false;
}

var canvas, v, arrLength, arr, bar_width, bar_height, c_index, fastMode, sortSpeed, drawModeHandle, sortSpeedHandle, arrLengthHandle, animate, isRunning, settings;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*********************************************************
 *                  SORTING ALGORITHMS	 				 *
 *********************************************************/

async function bogo(data) {
	if (isRunning) {
		return;
	}

	isRunning = true;

	while (!isSorted(data) && isRunning) {
		await shuffle(data, false);
		await sleep(sortSpeed);
		console.log(data);
	}

	isRunning = false;
}

async function bubble(data) {
	if (isRunning) {
		return;
	}

	isRunning = true;
	let changed;
	const n = data.length;

	for (let i = 0; i < n - 1; ++i) {
		changed = false;
		for (let j = 0; j < n - i - 1; ++j) {
			if (!isRunning) {
				c_index = [];
				return;
			}
			c_index = [j + 1, j + 2];
			if (data[j] > data[j + 1]) {
				let temp = data[j];
				data[j] = data[j + 1];
				updateArray();
				data[j + 1] = temp;
				updateArray();
				changed = true;
			}
			await sleep(sortSpeed);
		}

		if (!changed) {
			updateArray();
			isRunning = false;
			return;
		}
	}
	updateArray();
	isRunning = false;
}

async function insertion(data) {
	if (isRunning) {
		c_index = [];
		return;
	}

	isRunning = true;
	const n = data.length;

	for (let i = 1; i < n; ++i) {
		let j = i - 1;
		let temp = data[i];

		while (temp < data[j]) {
			if (!isRunning) {
				c_index = [];
				return;
			}

			await sleep(sortSpeed);
			data[j + 1] = data[j];
			updateArray();
			c_index = [i, j];
			--j;
		}

		data[j + 1] = temp;
		c_index = [i, j];
		updateArray();
	}
	isRunning = false;
}

async function merge(data, start = 0, end = null, firstCall = true) {
	if (isRunning && firstCall) {
		return;
	}

	if (end == null) {
		end = data.length - 1;
	}

	if (start >= end) {
		return;
	}

	isRunning = true;

	const mid = start + Math.floor((end - start) / 2);

	await merge(data, start, mid, false);
	await merge(data, mid + 1, end, false);

	let left = [];
	let right = [];

	let n1 = mid - start + 1,
		n2 = end - mid;

	for (let i = 0; i < n1; ++i) {
		left.push(data[start + i]);
	}
	for (let i = 0; i < n2; ++i) {
		right.push(data[mid + 1 + i]);
	}

	let i = 0,
		j = 0,
		k = start;

	if (!isRunning) {
		c_index = [];
		return;
	}

	while (i < n1 && j < n2) {
		if (left[i] <= right[j]) {
			data[k] = left[i];
			++i;
			c_index = [i, n1, n2, j, k];
			updateArray();
			await sleep(sortSpeed);
		} else {
			data[k] = right[j];
			++j;
			c_index = [i, n1, n2, j, k];
			updateArray();
			await sleep(sortSpeed);
		}
		++k;
	}

	while (i < n1) {
		data[k] = left[i];
		++k;
		++i;
		c_index = [i, n1, n2, j, k];
		updateArray();
	}

	while (j < n2) {
		data[k] = right[j];
		++k;
		++j;
		c_index = [i, n1, n2, j, k];
		updateArray();
	}

	if (firstCall) {
		isRunning = false;
	}
}

async function QSortPartition(arr, low, high) {
	let pivot = arr[high];
	let i = low - 1;

	for (let j = low; j <= high - 1; j++) {
		if (arr[j] < pivot) {
			if (!isRunning) {
				c_index = [];
				updateArray();
				return;
			}
			i++;
			[arr[i], arr[j]] = [arr[j], arr[i]];
			if (isRunning) {
				c_index = [i, j];
			} else {
				c_index = [];
			}
			updateArray();
			await sleep(sortSpeed);
		}
	}
	[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
	c_index = [i + 1, high];
	return i + 1;
}

async function quicksort(arr, low = 0, high = null, firstCall = true) {
	if (high == null) {
		high = arr.length - 1;
	}
	if (low >= high) return;

	if (isRunning && firstCall) {
		return;
	}

	isRunning = true;

	let pi = await QSortPartition(arr, low, high);

	await quicksort(arr, low, pi - 1, false);
	await quicksort(arr, pi + 1, high, false);

	if (firstCall) {
		isRunning = false;
	}
}

async function radixsort(arr) {
	if (isRunning) {
		return;
	}
	isRunning = true;
	var idx1, idx2, idx3, len1, len2, radix, radixKey;
	var radices = {},
		buckets = {},
		num,
		curr;
	var currLen, radixStr, currBucket;

	len1 = arr.length;
	len2 = 10;

	for (idx1 = 0; idx1 < len1; idx1++) {
		radices[arr[idx1].toString().length] = 0;
	}

	for (radix in radices) {
		len1 = arr.length;
		for (idx1 = 0; idx1 < len1; idx1++) {
			curr = arr[idx1];
			currLen = curr.toString().length;
			if (currLen >= radix) {
				radixKey = curr.toString()[currLen - radix];
				if (!buckets.hasOwnProperty(radixKey)) {
					buckets[radixKey] = [];
				}
				buckets[radixKey].push(curr);
			} else {
				if (!buckets.hasOwnProperty("0")) {
					buckets["0"] = [];
				}
				buckets["0"].push(curr);
			}
		}
		idx1 = 0;
		for (idx2 = 0; idx2 < len2; idx2++) {
			if (buckets[idx2] != null) {
				currBucket = buckets[idx2];
				len1 = currBucket.length;
				for (idx3 = 0; idx3 < len1; idx3++) {
					arr[idx1++] = currBucket[idx3];
					c_index = [idx1, idx2, idx3];
					updateArray();
					await sleep(sortSpeed);
				}
			}
		}
		buckets = {};
	}
	isRunning = false;
}

async function selection(data) {
	if (isRunning) {
		return;
	}

	isRunning = true;
	const n = data.length;

	for (let i = 0; i < n - 1; ++i) {
		min = i;
		for (let j = i + 1; j < n; ++j) {
			if (!isRunning) {
				c_index = [];
				return;
			}
			c_index = [i, j, min];
			updateArray();
			await sleep(sortSpeed);

			if (data[min] > data[j]) {
				min = j;
			}
		}

		if (min != i) {
			let temp = data[i];
			data[i] = data[min];
			c_index = [i, min];

			updateArray();

			data[min] = temp;
			c_index = [i, min];

			updateArray();
			await sleep(sortSpeed);
		}
	}
	isRunning = false;
}

async function stalin(data) {
	if (isRunning) {
		return;
	}

	isRunning = true;
	let previous = data[0];
	let index = 1;

	while (index < data.length && isRunning) {
		c_index = [index];
		if (data[index] < previous) {
			data.splice(index, 1);
			bar_width = canvas.width / data.length;
			bar_height = canvas.height / max(data);
			updateArray();
			await sleep(sortSpeed);
			continue;
		}
		previous = data[index];
		updateArray();
		await sleep(sortSpeed);
		++index;
	}

	c_index = [];
	updateArray();
	isRunning = false;
}
