async function bogo(data, onChange, onIter, sleepOnIter, onDone, isRunning){
    if(isRunning){
        return;
    }

    isRunning = true;   

    while (!isSorted(data))
    {
        shuffle(data)
        await sleep(sortSpeed);
    }

    onDone();
    isRunning = false;
   
}