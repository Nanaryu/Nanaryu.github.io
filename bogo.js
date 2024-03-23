async function bogo(data) {
	if (isRunning) {
		return;
	}

	isRunning = true;

	while (!isSorted(data) && isRunning) {
		shuffle(data);
		await sleep(sortSpeed);
	}

	isRunning = false;
}

const parent = document.getElementById("sort-animation-bogo");
parent;
