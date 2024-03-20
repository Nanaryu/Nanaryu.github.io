async function stalin(data, onChange, onDone){
    if(isRunning){
        return;
    }
    isRunning = true;
    let previous = data[0];
    let index = 1;
    while(index < data.length){
        c_index = [index];
        if(data[index] < previous){
            data.splice(index, 1)
            bar_width = canvas.width / data.length
            bar_height = canvas.height / max(data)
            onChange();
            await sleep(parseInt(document.getElementById('sortSpeed').value));
            continue;
        }
        previous = data[index];
        onChange();
        await sleep(parseInt(document.getElementById('sortSpeed').value));
        ++index;
    }

    onDone();
    isRunning = false;
}