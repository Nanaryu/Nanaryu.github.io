async function bogo(data, onChange, onIter, sleepOnIter, onDone){
    if(isRunning){
        return;
    }
    isRunning = true;
    const n = data.length;
    let sorted = false;
    while(!sorted){
        shuffle(data)
        onChange();
        if(sleepOnIter != 0){
            await sleep(sleepOnIter);
        }
        
        sorted = true;
        for(let i = 1; i < n; ++i){
            if(data[i - 1] > data[i]){
                sorted = false;
                break;
            }
        }
    }

    onDone();
    isRunning = false;
}