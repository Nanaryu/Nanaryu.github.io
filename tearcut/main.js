const body = document.querySelector("body")
const display = document.createElement("canvas")
display.width = 768
display.height = 768
display.id = "display"
body.appendChild(display)

const editor = document.createElement("canvas")
editor.width = 1024
editor.height = 1024
editor.id = "editor"
body.appendChild(editor)

const cd = display.getContext("2d")
const ce = editor.getContext("2d")

function line(c, x, y, x1, x2, fstyle="black", width=1) 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.lineWidth = width
    c.strokeStyle = fstyle
    c.stroke()
    c.closePath()
}

function grid(c, size)
{
    let w = c.canvas.width
    let h = c.canvas.height

    for (let i = 0; i < w; i += w/size)
    {
        line(c, 0, i, w, i, "rgba(233,233,233,1)")
    }

    for (let i = 0; i < h; i += h/size)
    {
        line(c, i, 0, i, h, "rgba(233,233,233,1)")
    }
}

const animateDisplay = () => 
{
  cd.clearRect(0, 0, display.width, display.height)

  requestAnimationFrame(animateDisplay)
}
var cell_size = 128

const animateEditor = () => 
{
    ce.clearRect(0, 0, editor.width, editor.height)

    grid(ce, cell_size)

    requestAnimationFrame(animateEditor)
}

animateDisplay()
animateEditor()

