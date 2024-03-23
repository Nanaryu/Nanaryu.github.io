async function merge(data, onChange, onIter, sleepOnIter, start = 0, end = null) {
	if (end == null) {
		if (isRunning) {
			return;
		}
		isRunning = true;
		end = data.length - 1;
	}

	if (start >= end) {
		return;
	}

	const mid = start + Math.floor((end - start) / 2);

	await merge(data, onChange, onIter, sleepOnIter, start, mid);
	await merge(data, onChange, onIter, sleepOnIter, mid + 1, end);

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

	while (i < n1 && j < n2) {
		if (left[i] <= right[j]) {
			data[k] = left[i];
			++i;
			c_index = k;
			onChange();
			await sleep(parseInt(document.getElementById("sortSpeed").value));
		} else {
			data[k] = right[j];
			++j;
			c_index = k;
			onChange();
			await sleep(parseInt(document.getElementById("sortSpeed").value));
		}
		++k;
	}

	while (i < n1) {
		data[k] = left[i];
		++k;
		++i;
		c_index = k;
		onChange();
		// await sleep(parseInt(document.getElementById('sortSpeed').value));
	}

	while (j < n2) {
		data[k] = right[j];
		++k;
		++j;
		c_index = k;
		onChange();
		// await sleep(parseInt(document.getElementById('sortSpeed').value));
	}
	isRunning = false;
}
