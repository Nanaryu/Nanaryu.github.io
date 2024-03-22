async function selection(data)
{
    if(isRunning)
    {
        return;
    }
    
    isRunning = true;
    const n = data.length;
    
    for(let i = 0; i < n - 1; ++i)
    {
        min = i;
        for(let j = i + 1; j < n; ++j)
        {
            if(!isRunning){
                c_index = [];
                return;
            }
            c_index = [i, j, min];
            updateArray()
            await sleep(sortSpeed);
            
            if(data[min] > data[j])
            {
                min = j;
            }
        }

        if(min != i)
        {
            let temp = data[i];
            data[i] = data[min];
            c_index = [i, min];

            updateArray()

            data[min] = temp;
            c_index = [i, min]

            updateArray()
            await sleep(sortSpeed)
        }
    }
    isRunning = false;
}