const canvas = document.createElement("canvas")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.id = "triangles"
document.querySelector("body").appendChild(canvas)

const c = canvas.getContext("2d")

function random(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function circle(x, y, r, s="white")
{
    c.beginPath()
    c.arc(x, y, r, 0, 2*Math.PI)
    c.fillStyle = s
    c.fill()
    c.closePath()
}

function line(x, y, dx, dy, w=1, s="white")
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(dx, dy)
    c.strokeStyle = s
    c.lineWidth = w
    c.stroke()
    c.closePath()
}

function triangle(x, y, dx, dy, ddx, ddy, s="white")
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(dx, dy)
    c.lineTo(ddx, ddy)
    c.fillStyle = s
    c.fill()
    c.closePath()
}

const anchors = []

const anchor_num = 75
const incVal = 25
const speed = 0.03

const maxAnchorDistance = canvas.height/2 + incVal
const minAnchorDistance = canvas.height/2 - incVal

function easeInOutQuint(x)
{
    return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2
}

function easeInOutSine(x)
{
    return 1 - Math.pow(1 - x, 4)
}

function newPos(x, dx, s, easeFunc) 
{
    const progressRatio = x / dx
    
    const easedProgressRatio = easeFunc(progressRatio)
    
    const newX = x + (dx - x) * easedProgressRatio * s
    
    return newX
}

class anchor
{
    constructor (x, y, dy, s = 1)
    {
        this.x = x
        this.y = y
        this.dy = dy
        this.jx = this.x + (canvas.width/anchor_num)/2
        this.jy = y
        this.jdy = y
        this.s = s
    }

    update()
    {
        let diffY = Math.abs(this.y - this.dy)
        if (diffY < 1)
        {
            this.dy = random(minAnchorDistance, maxAnchorDistance)
        }

        this.y = newPos(this.y, this.dy, speed, easeInOutSine)

        let diffYj = Math.abs(this.jy - this.jdy)

        if (diffYj < 1)
        {
            if (this.jy < this.jdy) {this.jdy = this.y + Math.abs(this.y - this.dy)}
            else if (this.jy > this.jdy) {this.jdy = this.y - Math.abs(this.y - this.dy)}
            else {this.jdy = this.y + Math.abs(this.y - this.dy)}
        }

        this.jy = newPos(this.jy, this.jdy, speed, easeInOutSine)

        this.jx = this.x + (canvas.width/anchor_num)/2

        //circle(this.jx, this.jy, 5, "red")
        //circle(this.x, this.y, 10, "green")
        
        //line(this.x, this.y, this.jx, this.jy)
    }
}

class joiner 
{
    constructor (x, y)
    {
        this.x = x
        this.y = y
    }
}

// anchors init
for (let i = 0; i < canvas.width + canvas.width/anchor_num; i+=canvas.width/anchor_num)
{
    anchors.push(new anchor(i, random(minAnchorDistance, maxAnchorDistance), random(minAnchorDistance, maxAnchorDistance), 0.2))
}

function update_anchors()
{
    anchors.forEach(anchor1 =>
    {
        anchor1.update()
    })
}

function draw_joins()
{
    for (let i = 0; i < anchors.length; i++)
    {
        if (i != anchors.length - 1)
        {
            let x = anchors[i].x
            let y = anchors[i].y
            let dx = anchors[i+1].x
            let dy = anchors[i+1].y

            //line(x, y, dx, dy)
        }

        if (i != 0)
        {
            let x = anchors[i].x
            let y = anchors[i].y
            let dx = anchors[i-1].jx
            let dy = anchors[i-1].jy
            if (i != anchors.length - 1)
            {
                let jdx = anchors[i].jx
                let jdy = anchors[i].jy
                let jjx = anchors[i+1].x
                let jjy = anchors[i+1].y
                //line(dx, dy, jdx, jdy)

                triangle(x, y, dx, dy, jdx, jdy, "white")
                triangle(x, y, jdx, jdy, jjx, jjy, "black")
            }

            //line(x, y, dx, dy)
        }
        if (i == 0)
        {
            let x = anchors[i].x
            let y = anchors[i].y
            let dx = anchors[i].jx
            let dy = anchors[i].jy
            let ddx = anchors[i+1].x
            let ddy = anchors[i+1].y

            triangle(x, y, dx, dy, ddx, ddy, "black")
        }
    }
}

function frame()
{
    update_anchors()
    draw_joins()
}


const animate = () =>
{
    c.clearRect(0, 0, canvas.width, canvas.height)

    frame()

    requestAnimationFrame(animate)
}

animate()