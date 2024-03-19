async function partition(arr, startIndex, endIndex) {
  const pivotVal = arr[endIndex]; // the pivot element
  let index = startIndex;
  // begin iterate and swap
  for (let i = index; i < endIndex; i++) {
    if (arr[i] < pivotVal) {
      [arr[i], arr[index]] = [arr[index], arr[i]];
      updateArray()
      await sleep(parseInt(document.getElementById('sortSpeed').value));
      index += 1;
      c_index = index
    }
  }

  // move `pivotVal` to the middle index and return middle index
  [arr[index], arr[endIndex]] = [arr[endIndex], arr[index]];
  return index;
}

async function quicksort(arr, startIndex, endIndex) {
  // Base case or terminating case
  if (startIndex >= endIndex) {
    return;
  }

  // Returns midIndex / pivot index
  let midIndex = await partition(arr, startIndex, endIndex);

  // Recursively apply the same logic to the left and right subarrays
  await quicksort(arr, startIndex, midIndex - 1);
  await quicksort(arr, midIndex + 1, endIndex);
}
