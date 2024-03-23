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
			c_index = [j, j + 1];
			--j;
		}

		data[j + 1] = temp;
		updateArray();
	}
	isRunning = false;
}
