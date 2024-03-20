async function bubble(data, onChange, onIter, sleepOnIter, onDone){
    if(isRunning){
        return;
    }
    isRunning = true;
    let changed;
    const n = data.length;
    for(let i = 0; i < n - 1; ++i){
        changed = false;
        for(let j = 0; j < n - i - 1; ++j){
            if(data[j] > data[j + 1]){
                let temp = data[j];
                data[j] = data[j + 1];
                onChange(j);
                data[j + 1] = temp;
                c_index = j + 1
                onChange(j + 1);
                changed = true;
                await sleep(parseInt(document.getElementById('sortSpeed').value));
            }
        }
        if(!changed){
            onDone();
            return;
        }
        if(sleepOnIter != 0){
            await sleep(sleepOnIter);
        }
        onIter();
    }

    onDone();
    isRunning = false;
}