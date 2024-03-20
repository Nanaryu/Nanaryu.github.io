async function selection(data, onChange, onIter, sleepOnIter, onDone){
    if(isRunning){
        return;
    }
    isRunning = true;
    const n = data.length;
    for(let i = 0; i < n - 1; ++i){
        min = i;
        for(let j = i + 1; j < n; ++j){
            c_index = [i, j];
            await onChange()
            await sleep(sortSpeed);
            
            if(data[min] > data[j]){
                min = j;
            }
        }

        if(min != i){
            let temp = data[i];
            data[i] = data[min];
            c_index = [i, min];
            await onChange();
            data[min] = temp;
            c_index = [i, min]
            await onChange();
            await sleep(sortSpeed)
        }

        onIter();
    }

    onDone();

    isRunning = false;
}