const canvas = document.createElement("canvas")
const g_size = 768
const c_size = 48

canvas.width = g_size
canvas.height = g_size

document.querySelector("body").insertBefore(canvas, document.querySelector("body").firstChild)

const c = canvas.getContext("2d")

const tit = new Image()
tit.src = "assets/img/item-titanium.png"
tit.height = 30
tit.width = 30

const conv = new Image()
conv.src = "assets/img/conv1.png"

const grass = new Image()
grass.src = "assets/img/grass.png"

const coll = new Image()
coll.src = "assets/img/collector.png"

const spawn = new Image()
spawn.src = "assets/img/spawner.png"

const stats = 
{
    titanium: 99999,
    power: 8543,
}

const titanium = document.getElementById("score")
const power = document.getElementById("power")
const item_desc =  document.getElementById("item-desc")

const blocks =
{
    conveyor: {
        cost: 10,
        name: "conveyor",
        desc: "Basic conveyor used for material transportation",
        src: conv,
    },
    freeblock: {
        cost: 0,
        name: "freeblock",
        desc: "Grass block commonly found on the map",
        src: grass,
    },
    spawner: {
        cost: 80,
        name: "spawner",
        desc: "Basic drill used for material mining",
        src: spawn,
    },
    collector: {
        cost: 10,
        name: "collector",
        desc: "The core holds all materials that are transported to it",
        src: coll,
    }
}

var rotation = 0

function drawImageR(image, x, y, angle, width, height) 
{
    let radians = 90 * angle * Math.PI / 180
    c.save()
    c.translate(x + width / 2, y + height / 2)
    c.rotate(radians)
    c.drawImage(image, (-width / 2), (-height / 2), width, height)
    c.restore()
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const tiles = []

class tile 
{
    constructor (x, y, angle, tile, terrain)
    {
        this.x = x
        this.y = y
        this.tile = tile
        this.terrain = terrain
        this.angle = angle
        this.tile_x = Math.floor(this.x/c_size)
        this.tile_y = Math.floor(this.y/c_size)
    }

    update()
    {
        if(this.tile != null)
        {
            drawImageR(this.tile, this.x - cameraX, this.y - cameraY, this.angle, c_size, c_size)
        }
        else
        {
            drawImageR(this.terrain, this.x - cameraX, this.y - cameraY, this.angle, c_size, c_size)
        }
        text(`${this.tile_x},${this.tile_y}`, this.x + c_size/2 - cameraX, this.y + c_size/2 - cameraY, 16, "rgba(233,233,233,0.3)")
    }
}

function velocity(x, y, rot)
{
    switch(rot)
    {
        case 0:
            return [x, y-c_size]
        case 1:
            return [x+c_size, y]
        case 2:
            return [x, y+c_size]
        case 3:
            return [x-c_size, y]
    }
}

const materials = []

class material 
{
    constructor (x, y, dx=x, dy=y, moving=false)
    {
        this.x = x
        this.y = y
        this.moving = moving
        this.dx = dx
        this.dy = dy
        this.tile_x = null
        this.tile_y = null
    }

    update() 
    {   
        if (!this.moving) 
        {
            this.tile_x = Math.floor(this.x/c_size)
            this.tile_y = Math.floor(this.y/c_size)
            tiles.forEach(tile1 =>
            {
                if ((this.tile_x == tile1.tile_x && this.tile_y == tile1.tile_y) && tile1.tile == conv)
                {
                    let dxdy = velocity(this.x, this.y, tile1.angle)
                    this.dx = dxdy[0]
                    this.dy = dxdy[1]
                    this.moving = true
                }
                else if ((this.tile_x == tile1.tile_x && this.tile_y == tile1.tile_y) && tile1.tile == coll)
                {
                    stats.titanium += 100
                    delete this.x
                    delete this.y
                    delete this.moving
                    delete this.dx
                    delete this.dy
                    delete this.tile_x
                    delete this.tile_y
                }
            })
            c.drawImage(tit, this.x-tit.width/2-cameraX, this.y-tit.height/2-cameraY, tit.width, tit.height)
        }
        else
        {
            if (this.x < this.dx)
            {
                this.x += 1
            }
            else if (this.x > this.dx)
            {
                this.x -= 1
            }
            if (this.y < this.dy)
            {
                this.y += 1
            }
            else if (this.y > this.dy)
            {
                this.y -= 1
            }

            c.drawImage(tit, this.x-tit.width/2-cameraX, this.y-tit.height/2-cameraY, tit.width, tit.height)

            if (this.x == this.dx && this.y == this.dy)
            {
                this.moving = false
            }
        }
    }
}

function spawnMaterial()
{
    tiles.forEach(tile1 =>
    {
        if (tile1.tile == spawn)
        {
            tiles.forEach(tile2 =>
            {
                if(tile2.tile == conv)
                {
                    let x = tile1.x + (c_size/2)
                    let y = tile1.y + (c_size/2)
                    let dx = tile2.x + (c_size/2)
                    let dy = tile2.y + (c_size/2)

                    if(tile1.tile_x + 1 == tile2.tile_x && tile1.tile_y == tile2.tile_y) // right
                    {
                        materials.push(new material(x, y, dx, dy, true))
                    }
                    if (tile1.tile_x - 1 == tile2.tile_x && tile1.tile_y == tile2.tile_y) // left
                    {
                        materials.push(new material(x, y, dx, dy, true))
                    }
                    if (tile1.tile_x == tile2.tile_x && tile1.tile_y - 1 == tile2.tile_y) // top
                    {
                        materials.push(new material(x, y, dx, dy, true))
                    }
                    if (tile1.tile_x == tile2.tile_x && tile1.tile_y + 1 == tile2.tile_y) // bottom
                    {
                        materials.push(new material(x, y, dx, dy, true))
                    }
                }
            })
        }
    })
}

function updateMatPos()
{
    materials.forEach(mat => 
    {
        mat.update()
    })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const player = {
    x: g_size/2,
    y: g_size/2,
    radius: 15,
    speed: 5,
}

const keys = {}

window.addEventListener("keydown", e => 
{
    keys[e.key] = true
})

window.addEventListener("keyup", e => 
{
    keys[e.key] = false
})

var cameraX = player.x - g_size / 2
var cameraY = player.y - g_size / 2

function updatePlayer() {
    if (keys["w"] || keys["W"]) 
    {
        player.y -= player.speed
    }
    if (keys["s"] || keys["S"]) 
    {
        player.y += player.speed
    }
    if (keys["a"] || keys["A"]) 
    {
        player.x -= player.speed
    }
    if (keys["d"] || keys["D"]) 
    {
        player.x += player.speed
    }
    cameraX = player.x - g_size / 2
    cameraY = player.y - g_size / 2
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var current_block = blocks.freeblock

const select = document.getElementById("select")

function createBlock(src, id, onclick) {
    const block = document.createElement("img")
    block.src = src
    block.id = id
    block.onclick = onclick
    block.setAttribute("draggable", false)
    select.appendChild(block)
}

createBlock(grass.src, "freeblock", function() {current_block = blocks.freeblock})
createBlock(spawn.src, "spawner", function() {current_block = blocks.spawner})
createBlock(conv.src, "conveyor", function() {current_block = blocks.conveyor})
createBlock(coll.src, "collector", function() {current_block = blocks.collector})

const cost_span = document.getElementById("item_requirements")

/* const audio = new Audio('assets/audio/game3.mp3')
audio.loop = true
audio.volume = 0.2

const speaker = document.getElementById("speaker")
let music_on = false
speaker.onclick = function ()
{
    if(!music_on) 
    {
        audio.play()
        music_on = true
        speaker.src = "assets/img/speakerON.png"
    } 
    else 
    {
        audio.pause()
        music_on = false
        speaker.src = "assets/img/speaker.png"
    }
} */

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function line(x, y, x1, x2, fstyle="black") 
{
    c.beginPath()
    c.moveTo(x, y)
    c.lineTo(x1, x2)
    c.strokeStyle = fstyle
    c.stroke()
    c.closePath()
}

function text(txt, x, y, fsize=32, fstyle="white")
{
    let lastStyle = c.fillStyle
    c.font = `${fsize}px Arial`
    c.fillStyle = fstyle
    c.textAlign = "center"
    c.fillText(txt, x, y + 7)
    c.fillStyle = lastStyle
}

function circle(x, y, radius, style="white")
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.fillStyle = style
    c.fill()
    c.closePath()
}

function circleE(x, y, radius, style="white")
{
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI*2, false)
    c.strokeStyle = style
    c.stroke()
    c.closePath()
}

function rect(x, y, w, h, style="white")
{
    c.beginPath()
    c.fillStyle = style
    c.fillRect(x, y, w, h)
    c.fill()
    c.closePath()
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawGrid() {
    const expanded_size = g_size + 2 * c_size

    const startX = -cameraX % c_size - c_size
    const endX = expanded_size - cameraX % c_size + c_size
    const startY = -cameraY % c_size - c_size
    const endY = expanded_size - cameraY % c_size + c_size

    // horizontal lines
    for (let i = startY; i <= endY; i += c_size) 
    {
        line(startX, i, endX, i, "rgba(233,233,233,0.3)")
    }

    // vertical lines
    for (let j = startX; j <= endX; j += c_size) 
    {
        line(j, startY, j, endY, "rgba(233,233,233,0.3)")
    }
}

function updateTiles()
{
    tiles.forEach(tile1 =>
    {
        tile1.update()
    })
}

function selectedBlockOutline()
{
    let block = select.children
    for (let i = 0; i < block.length; i++)
    {
        if (block[i].id == current_block.name) {
            block[i].style.outline =  "2px white solid"
            block[i].style.boxShadow = "0 0 10px white"
        }
        else
        {
            block[i].style.outline = "none"
            block[i].style.boxShadow = "none"
        }
    }
}

function kFormat(value)
{
    let svalue = String(value)
    if (value < 1000)
    {
        return svalue
    }
    else if (1000 <= value && value < 10000)
    {
        return `${svalue[0]}.${svalue[1]}k`
    }
    else if (10000 <= value && value < 100000)
    {
        return `${svalue[0]}${svalue[1]}.${svalue[2]}k`
    }
}

function updateStats()
{
    if (stats.titanium < 1000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    else if (1000 <= stats.titanium && stats.titanium < 10000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    else if (10000 <= stats.titanium && stats.titanium < 100000)
    {
        titanium.innerHTML = "<img src='assets/img/item-titanium.png' class='mat_icon'>" + kFormat(stats.titanium)
    }
    
    power.innerHTML = "<img src='assets/img/power.png' class='mat_icon'>" + kFormat(stats.power)

    cost_span.innerHTML = current_block.cost
    if (current_block.cost <= stats.titanium) {cost_span.style.color = "lightgreen"}
    else {cost_span.style.color = "rgb(237, 84, 84)"}

    item_desc.innerHTML = current_block.desc
}

function mouseEvents()
{
    let mtile_x = Math.floor((mouse.x+cameraX)/c_size)
    let mtile_y = Math.floor((mouse.y+cameraY)/c_size)

    var stx
    var sty

    var etx
    var ety

    if(mouseheld && current_block.cost <= stats.titanium)
    {
        let cell = null
        tiles.forEach(tile1 =>
        {
            if (tile1.tile_x == mtile_x && tile1.tile_y == mtile_y)
            {
                cell = tile1
            }
        })

        stats.titanium -= current_block.cost
            
        Object.keys(blocks).forEach(key => {
            if (cell.tile == blocks[key].src)
            {
                stats.titanium += blocks[key].cost
            }
        })

        cell.tile = current_block.src
        cell.angle = rotation
    }
    
    else if (rmouseheld)
    {
        stx = startcoords.x - cameraX
        sty = startcoords.y - cameraY

        etx = mouse.x - cameraX
        ety = mouse.y - cameraY

        /* line(stx, sty, stx, ety, "red")
        line(stx, sty, etx, sty, "red")
        line(etx, sty, etx, ety, "red")
        line(stx, ety, etx, ety, "red") */
       
        rect(Math.min(stx, etx), Math.min(sty, ety), Math.abs(etx - stx), Math.abs(ety - sty), "rgba(233, 0, 0, 0.3)")
    }

    else
    {
        c.save()
        c.globalAlpha = 0.5
        drawImageR(current_block.src, mtile_x*c_size-cameraX, mtile_y*c_size-cameraY, rotation, c_size, c_size)
        c.restore()
    }
}

function init()
{
    for (let i = -(c_size*15); i < c_size*16; i += c_size) 
    {
        for (let j = -(c_size*15); j < c_size*16; j += c_size) 
        {
            tiles.push(new tile(i, j, 0, null, grass))
        }
    }
}

function frame() 
{   
    updatePlayer()
    updateStats()
    selectedBlockOutline()

    updateTiles()
    updateMatPos()
    mouseEvents()
    drawGrid()

    circleE(g_size / 2, g_size / 2, player.radius, "white")
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var mouseheld = false
var rmouseheld = false

var startcoords = 
{
    x: null,
    y: null,
}

var mouse =
{
    x: null,
    y: null,
}

canvas.addEventListener("mousedown", function(e)
{
    if (e.button === 0) // left click
    {
        mouse.x = e.offsetX
        mouse.y = e.offsetY
        mouseheld = true
    }
    else if (e.button === 2) // right click
    {
        mouse.x = e.offsetX
        mouse.y = e.offsetY
        startcoords.x = e.offsetX
        startcoords.y = e.offsetY
        rmouseheld = true
    }
})

var rmouseup = false
canvas.addEventListener("mouseup", function(e)
{
    if (e.button === 0)
    {
        mouseheld = false
    }
    else if (e.button === 2)
    {
        rmouseup = true
        rmouseheld = false
    }
})

canvas.addEventListener("mousemove", function(e)
{
    mouse.x = e.offsetX
    mouse.y = e.offsetY
})

var spawnToggle = false
window.addEventListener("keydown", function (e)
{
    if (e.key == "r" || e.key == "R")
    {
        if (rotation < 3) 
        {
            rotation++
        } 
        else 
        {
            rotation = 0
        }
    }
    else if (e.key == "e" || e.key == "E")
    {
        spawnToggle = spawnToggle ? false : true
    }
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const animate = () => {
  requestAnimationFrame(animate)

  c.clearRect(0, 0, canvas.width, canvas.height)

  frame()
}

init()
animate()
setInterval(() => {
    if (stats.power > 0 && spawnToggle)
    {
        spawnMaterial()
    }
    stats.power += 1
}, 500)

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////