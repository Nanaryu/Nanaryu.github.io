async function selection(data, onChange, onIter, sleepOnIter, onDone){
    const n = data.length;
    for(let i = 0; i < n - 1; ++i){
        min = i;
        for(let j = i + 1; j < n; ++j){
            if(data[min] > data[j]){
                min = j;
            }
        }

        if(min != i){
            let temp = data[i];
            data[i] = data[min];
            c_index = i;
            onChange();
            data[min] = temp;
            c_index = min;
            onChange();

            await sleep(parseInt(document.getElementById('sortSpeed').value));
        }

        onIter();
        await sleep(sleepOnIter);
    }

    onDone();

}