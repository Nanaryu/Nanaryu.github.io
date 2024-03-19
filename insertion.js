async function insertion(data, onChange, onIter, sleepOnIter){
    const n = data.length;
    for(let i = 1; i < n; ++i){
        let j = i - 1;
        let temp = data[i]
        while(temp < data[j]){
            data[j + 1] = data[j];
            onChange(j + 1);
            --j;
            await sleep(parseInt(document.getElementById('sortSpeed').value));
        }

        data[j + 1] = temp;
        onChange(j);
        await sleep(parseInt(document.getElementById('sortSpeed').value));


        await sleep(onIter);
    }
}