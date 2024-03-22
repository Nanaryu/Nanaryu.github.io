const canvas = document.createElement("canvas")
canvas.width = 1000
canvas.height = 500
document.querySelector("body").insertBefore(canvas, document.getElementById("settings"))

const c = canvas.getContext("2d")

var c_index = []

var fastMode = false

const drawModeHandle = document.getElementById("draw-mode")

function updateDrawMode()
{
    fastMode = !fastMode
}

const sortSpeedHandle = document.getElementById("sortSpeed")

var sortSpeed = 30

function updateSortSpeed()
{
    sortSpeed = sortSpeedHandle.value
}

const arrLengthHandle = document.getElementById("arrayLength")

var arrLength = 30
let arr = []

function updateArrayLength()
{
    arrLength = parseInt(arrLengthHandle.value)
    arr = []
    for (let i = 1;i<arrLength+1;i++)
    {
        arr.push(i)
    }
    bar_width = canvas.width / arr.length
    bar_height = canvas.height / max(arr)
    updateArray()
}


for (let i = 1;i<arrLength;i++)
{
    arr.push(i)
}

let bar_width = canvas.width / arr.length
let bar_height = canvas.height / max(arr)

shuffle(arr)

function rectF(x, y, w, h, style="white")
{
    c.beginPath()
    c.fillStyle = style
    c.fillRect(x, y, w, h)
    c.closePath()
}

function rect(x, y, w, h, style="black")
{
    c.beginPath()
    c.strokeStyle = style
    c.lineWidth = 1
    c.rect(x, y, w, h)
    c.stroke()
    c.closePath()
}

function line(x,y,dx,dy,w,style="white")
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(dx, dy)
    c.strokeStyle = style
    c.lineWidth = w
    c.stroke()
    c.closePath()
}

function sleep(ms) 
{
    return new Promise(r => setTimeout(r, ms))
}    

function max(arr)
{
    if (arr.length)
    {
        let max = arr[0]
        arr.forEach(val =>
        {
            if (max < val)
            {
                max = val
            }
        })
        return max
    }
    else
    {
        console.error("Array length is zero.")
    }
}

function stop()
{
    
}

function randint(min, max) 
{
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function shuffle(array) 
{
    let currentIndex = array.length, randomIndex

    while (currentIndex > 0) 
    {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
        c_index = [currentIndex, randomIndex]

        if(Math.random() < 100 / array.length){
            updateArray()
            await sleep(0)
        }
    }

    return array
}

function isSorted(arr)
{
    for (let i = 0; i < arr.length - 2; i++)
    {
        if (arr[i] > arr[i+1])
        {
            return false
        }
    }
    return true
}

function updateArray(sorted=false)
{
    let i = 0
    arr.forEach(function(val)
    {
        if (fastMode)
        {
            line(i*bar_width + bar_width/2, canvas.height, i*bar_width + bar_width/2, canvas.height - val*bar_height, bar_width,"rgb(233, 233, 233)")
            if (sorted)
            {
                line(i*bar_width + bar_width/2, canvas.height, i*bar_width + bar_width/2, canvas.height - val*bar_height, bar_width,"rgb(0, 233, 0)")
            }
            else if (c_index.length)
            {
                c_index.forEach(c =>
                {
                    line(c*bar_width + bar_width/2, canvas.height, c*bar_width + bar_width/2, canvas.height - arr[c]*bar_height, bar_width,"rgb(233, 0, 0)")
                })
            }
        }
        else
        {
            rectF(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "rgb(233, 233, 233)")
            if (sorted)
            {   
                rectF(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "rgb(0,233,0)")
            }
            else if (c_index.length)
            {
                c_index.forEach(c =>
                {
                    rectF(c*bar_width, canvas.height - arr[c]*bar_height, bar_width, arr[c]*bar_height, "rgb(233,0,0)")
                    rect(c*bar_width, canvas.height - arr[c]*bar_height, bar_width, arr[c]*bar_height, "black")
                })
            }
            rect(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "black")
        }
        i++
    })
}


function frame()
{
    if (isSorted(arr))
    {
        updateArray(sorted=true)
    }
    else
    {
        updateArray()
    }
}

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  frame()
}

animate()

window.onload = function()
{
    drawModeHandle.checked = false
    arrLengthHandle.value = ""
    sortSpeedHandle.value = ""
}

var isRunning = false