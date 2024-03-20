async function insertion(data, onChange, onIter, sleepOnIter){
    if(isRunning){
        return;
    }
    isRunning = true;
    const n = data.length;
    for(let i = 1; i < n; ++i){
        let j = i - 1;
        let temp = data[i]
        while(temp < data[j]){
            data[j + 1] = data[j];
            onChange(j + 1);
            c_index = j
            --j;
            await sleep(parseInt(document.getElementById('sortSpeed').value) / n);
        }

        data[j + 1] = temp;
        onChange(j);
        await sleep(parseInt(document.getElementById('sortSpeed').value) / n);


        if(onIter != 0){
            await sleep(onIter);
        }
    }

    isRunning = false;

}