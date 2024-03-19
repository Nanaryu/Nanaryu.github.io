const canvas = document.createElement("canvas")
canvas.width = 1000
canvas.height = 500
document.querySelector("body").appendChild(canvas)

const c = canvas.getContext("2d")

const sortSpeedHandle = document.getElementById("sortSpeed")

var sortSpeed = sortSpeedHandle.value

let arr = []
for (let i = 1;i<100;i++)
{
    arr.push(i)
}

let bar_width = canvas.width / arr.length
let bar_height = canvas.height / max(arr)

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
    c.rect(x, y, w, h)
    c.stroke()
    c.closePath()
}

function sleep(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms))
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

function randint(min, max) 
{
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(array) 
{
  let currentIndex = array.length,  randomIndex

  while (currentIndex > 0) 
  {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    updateArray()
  }
  return array
}

function isSorted(arr)
{
    for (let i = 0; i < arr.length; i++)
    {
        if (arr[i] > arr[i+1])
        {
            return false
        }
    }
    return true
}

async function bubbleSort() 
{
    for (let i = 0; i < arr.length; i++) 
    {
        for (let j = 0; j < (arr.length - i - 1); j++) 
        {
            if (arr[j] > arr[j + 1]) 
            {
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
                c_index = j+1
                await sleep(sortSpeed)
            }
        }
    }
}

function updateArray(sorted=false)
{
    let i = 0
    arr.forEach(val =>
    {
        rectF(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "rgb(233, 233, 233)")
        if (sorted)
        {   
            rectF(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "rgb(0,233,0)")
        }
        else if (c_index != -1)
        {
            rectF(c_index*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "rgb(233,0,0)")
        }
        rect(i*bar_width, canvas.height - val*bar_height, bar_width, val*bar_height, "black")
        i++
    })
}

var c_index = -1
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
    c_index = -1
}

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  frame()
}

animate()

updateArray()

document.getElementById('sortSpeed').onchange = () => {
    document.getElementById("sortSpeedVal").innerHTML = document.getElementById("sortSpeed").value
    sortSpeed = sortSpeedHandle.value
}