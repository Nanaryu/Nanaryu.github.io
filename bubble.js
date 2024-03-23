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
