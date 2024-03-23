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
