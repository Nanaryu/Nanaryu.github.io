async function partition(arr, low, high) { 
  let pivot = arr[high]; 
  let i = low - 1; 

  for (let j = low; j <= high - 1; j++) { 
      if (arr[j] < pivot) { 
          i++; 
          [arr[i], arr[j]] = [arr[j], arr[i]];
          c_index = [i, j]
          updateArray();
          await sleep(sortSpeed);
      } 
  }  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  c_index = [i+1, high]
  return i + 1;
} 

async function quicksort(arr, low, high) { 
  if (low >= high) return; 
  let pi = await partition(arr, low, high); 

  await quicksort(arr, low, pi - 1); 
  await quicksort(arr, pi + 1, high); 
} 
