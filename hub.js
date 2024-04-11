const canvas = document.createElement("canvas")
const body = document.querySelector("body")
canvas.width = window.innerWidth
canvas.height = window.innerHeight
body.appendChild(canvas)

const ctx = canvas.getContext('2d')

const dots = []
const maxDistance = 100 // Maximum distance for connection
const maxSpeed = 2 // Maximum speed of dots
const connectionWidth = 2 // Initial width of connections
const maxAlpha = 0.5 // Maximum transparency of connections

function random(min, max) 
{
    return Math.random() * (max - min) + min
}

class Dot 
{
    constructor(x, y, vx, vy) 
    {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
    }

    draw() 
    {
        ctx.beginPath()
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
    }

    update() 
    {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0
    }
}

function connectDots() 
{
    for (let i = 0; i < dots.length; i++) 
    {
        for (let j = i + 1; j < dots.length; j++) 
        {
            const distance = Math.sqrt((dots[i].x - dots[j].x) ** 2 + (dots[i].y - dots[j].y) ** 2)
            if (distance < maxDistance) 
            {
                const alpha = 1 - distance / maxDistance
                ctx.beginPath()
                ctx.moveTo(dots[i].x, dots[i].y)
                ctx.lineTo(dots[j].x, dots[j].y)
                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * maxAlpha})`
                ctx.lineWidth = connectionWidth * alpha
                ctx.stroke()
            }
        }
    }
}

function animate() 
{
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  dots.forEach(dot => {
    dot.update()
    dot.draw()
  })

  connectDots()

  requestAnimationFrame(animate)
}

document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX
    const mouseY = event.clientY

    dots.forEach(dot => {
        const rect = canvas.getBoundingClientRect()
        const canvasX = mouseX - rect.left
        const canvasY = mouseY - rect.top

        const dx = dot.x - canvasX
        const dy = dot.y - canvasY
        const distance = Math.sqrt(dx ** 2 + dy ** 2)

        if (distance < 50) 
        {
            const angle = Math.atan2(dy, dx)
            dot.vx += Math.cos(angle) * 0.1
            dot.vy += Math.sin(angle) * 0.1
        }
    })
})

for (let i = 0; i < 150; i++) 
{
  const dot = new Dot(random(0, canvas.width), random(0, canvas.height), random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed))
  dots.push(dot)
}

animate()
