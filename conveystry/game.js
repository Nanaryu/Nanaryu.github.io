const canvas = document.createElement("canvas")
const G_SIZE = 768
const C_SIZE = 48

canvas.width = G_SIZE
canvas.height = G_SIZE

document.body.insertBefore(canvas, document.body.firstChild)

const c = canvas.getContext("2d")

// ─── Asset loading ────────────────────────────────────────────────────────────

function loadImage(src) {
    const img = new Image()
    img.src = src
    return img
}

const IMG = {
    titanium: loadImage("assets/img/item-titanium.png"),
    conveyor: loadImage("assets/img/conv1.png"),
    grass:    loadImage("assets/img/grass.png"),
    collector:loadImage("assets/img/collector.png"),
    spawner:  loadImage("assets/img/spawner.png"),
}

// ─── Block definitions ────────────────────────────────────────────────────────

const blocks = {
    freeblock: {
        cost: 0,
        name: "freeblock",
        desc: "Grass block commonly found on the map",
        src: null,          // null = terrain slot (renders IMG.grass)
        img: IMG.grass,
    },
    spawner: {
        cost: 80,
        name: "spawner",
        desc: "Basic drill used for material mining",
        src: "spawner",
        img: IMG.spawner,
    },
    conveyor: {
        cost: 10,
        name: "conveyor",
        desc: "Basic conveyor used for material transportation",
        src: "conveyor",
        img: IMG.conveyor,
    },
    collector: {
        cost: 10,
        name: "collector",
        desc: "The core holds all materials transported to it",
        src: "collector",
        img: IMG.collector,
    },
}

// ─── Stats & UI refs ──────────────────────────────────────────────────────────

const stats = {
    titanium: 99999,
    power: 8543,
}

const ui = {
    titanium:  document.getElementById("score"),
    power:     document.getElementById("power"),
    itemDesc:  document.getElementById("item-desc"),
    costSpan:  document.getElementById("item_requirements"),
    selectBox: document.getElementById("select"),
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawImageRotated(img, x, y, angle, w, h) {
    const radians = (Math.PI / 2) * angle
    c.save()
    c.translate(x + w / 2, y + h / 2)
    c.rotate(radians)
    c.drawImage(img, -w / 2, -h / 2, w, h)
    c.restore()
}

function drawLine(x0, y0, x1, y1, style = "black") {
    c.beginPath()
    c.moveTo(x0, y0)
    c.lineTo(x1, y1)
    c.strokeStyle = style
    c.stroke()
    c.closePath()
}

function drawText(txt, x, y, fsize = 32, fstyle = "white") {
    const prev = c.fillStyle
    c.font = `${fsize}px Arial`
    c.fillStyle = fstyle
    c.textAlign = "center"
    c.fillText(txt, x, y + 7)
    c.fillStyle = prev
}

function drawCircleOutline(x, y, radius, style = "white") {
    c.beginPath()
    c.arc(x, y, radius, 0, Math.PI * 2)
    c.strokeStyle = style
    c.stroke()
    c.closePath()
}

function drawRect(x, y, w, h, style = "white") {
    c.fillStyle = style
    c.fillRect(x, y, w, h)
}

// ─── Tiles ────────────────────────────────────────────────────────────────────

const tiles = []

class Tile {
    constructor(x, y, angle, blockKey) {
        this.x = x
        this.y = y
        this.angle = angle
        this.blockKey = blockKey        // key into `blocks`, e.g. "freeblock"
        this.tile_x = Math.floor(x / C_SIZE)
        this.tile_y = Math.floor(y / C_SIZE)
    }

    get block() { return blocks[this.blockKey] }

    draw() {
        const img = this.block.img
        drawImageRotated(img, this.x - cameraX, this.y - cameraY, this.angle, C_SIZE, C_SIZE)
        drawText(
            `${this.tile_x},${this.tile_y}`,
            this.x + C_SIZE / 2 - cameraX,
            this.y + C_SIZE / 2 - cameraY,
            16,
            "rgba(233,233,233,0.3)"
        )
    }
}

// Build a fast lookup: "tx,ty" → Tile
const tileMap = new Map()

function tileKey(tx, ty) { return `${tx},${ty}` }

function getTile(tx, ty) { return tileMap.get(tileKey(tx, ty)) ?? null }

function setTileBlock(tile, blockKey) {
    tile.blockKey = blockKey
    tile.angle = rotation
}

function updateTiles() {
    tiles.forEach(t => t.draw())
}

// ─── Materials ────────────────────────────────────────────────────────────────

const materials = []

// Returns the world-space velocity vector for a conveyor with the given angle.
function conveyorDelta(angle) {
    switch (angle) {
        case 0: return [0, -C_SIZE]
        case 1: return [C_SIZE, 0]
        case 2: return [0,  C_SIZE]
        case 3: return [-C_SIZE, 0]
    }
    return [0, 0]
}

class Material {
    constructor(x, y, dx, dy, moving = false) {
        this.x = x
        this.y = y
        this.dx = dx
        this.dy = dy
        this.moving = moving
        this.dead = false
    }

    get tile_x() { return Math.floor(this.x / C_SIZE) }
    get tile_y() { return Math.floor(this.y / C_SIZE) }

    update() {
        if (this.dead) return

        if (!this.moving) {
            const t = getTile(this.tile_x, this.tile_y)
            if (t) {
                if (t.blockKey === "conveyor") {
                    const [ddx, ddy] = conveyorDelta(t.angle)
                    this.dx = this.x + ddx
                    this.dy = this.y + ddy
                    this.moving = true
                } else if (t.blockKey === "collector") {
                    stats.titanium += 100
                    this.dead = true
                    return
                }
            }
        } else {
            // Move one pixel per frame toward destination
            const SPEED = 2
            if (this.x < this.dx) this.x = Math.min(this.x + SPEED, this.dx)
            else if (this.x > this.dx) this.x = Math.max(this.x - SPEED, this.dx)

            if (this.y < this.dy) this.y = Math.min(this.y + SPEED, this.dy)
            else if (this.y > this.dy) this.y = Math.max(this.y - SPEED, this.dy)

            if (this.x === this.dx && this.y === this.dy) {
                this.moving = false
            }
        }

        const hw = IMG.titanium.width  / 2 || 15
        const hh = IMG.titanium.height / 2 || 15
        c.drawImage(IMG.titanium, this.x - hw - cameraX, this.y - hh - cameraY, 30, 30)
    }
}

function spawnMaterial() {
    tiles.forEach(spawnerTile => {
        if (spawnerTile.blockKey !== "spawner") return

        // Only spawn onto a single adjacent conveyor (prefer right → down → left → up)
        const neighbors = [
            getTile(spawnerTile.tile_x + 1, spawnerTile.tile_y),
            getTile(spawnerTile.tile_x, spawnerTile.tile_y + 1),
            getTile(spawnerTile.tile_x - 1, spawnerTile.tile_y),
            getTile(spawnerTile.tile_x, spawnerTile.tile_y - 1),
        ]

        for (const neighbor of neighbors) {
            if (neighbor && neighbor.blockKey === "conveyor") {
                const sx = spawnerTile.x + C_SIZE / 2
                const sy = spawnerTile.y + C_SIZE / 2
                const dx = neighbor.x  + C_SIZE / 2
                const dy = neighbor.y  + C_SIZE / 2
                materials.push(new Material(sx, sy, dx, dy, true))
                break   // one material per spawner per tick
            }
        }
    })
}

function updateMaterials() {
    // Remove dead materials in-place
    for (let i = materials.length - 1; i >= 0; i--) {
        if (materials[i].dead) {
            materials.splice(i, 1)
        }
    }
    materials.forEach(m => m.update())
}

// ─── Player & camera ──────────────────────────────────────────────────────────

const player = {
    x: G_SIZE / 2,
    y: G_SIZE / 2,
    radius: 15,
    speed: 5,
}

const keys = {}
window.addEventListener("keydown", e => { keys[e.key] = true })
window.addEventListener("keyup",   e => { keys[e.key] = false })

let cameraX = player.x - G_SIZE / 2
let cameraY = player.y - G_SIZE / 2

function updatePlayer() {
    if (keys["w"] || keys["W"]) player.y -= player.speed
    if (keys["s"] || keys["S"]) player.y += player.speed
    if (keys["a"] || keys["A"]) player.x -= player.speed
    if (keys["d"] || keys["D"]) player.x += player.speed

    cameraX = player.x - G_SIZE / 2
    cameraY = player.y - G_SIZE / 2
}

// ─── Block selector UI ────────────────────────────────────────────────────────

let currentBlockKey = "freeblock"
let rotation = 0

function getCurrentBlock() { return blocks[currentBlockKey] }

Object.keys(blocks).forEach(key => {
    const img = document.createElement("img")
    img.src = blocks[key].img.src
    img.id = key
    img.draggable = false
    img.onclick = () => { currentBlockKey = key }
    ui.selectBox.appendChild(img)
})

function updateSelectedOutline() {
    Array.from(ui.selectBox.children).forEach(el => {
        const active = el.id === currentBlockKey
        el.style.outline   = active ? "2px white solid" : "none"
        el.style.boxShadow = active ? "0 0 10px white"  : "none"
    })
}

// ─── Stats display ────────────────────────────────────────────────────────────

function kFormat(value) {
    if (value < 1000)    return String(value)
    if (value < 10000)   return `${(value / 1000).toFixed(1)}k`
    if (value < 1000000) return `${Math.floor(value / 1000)}k`
    return `${(value / 1000000).toFixed(1)}M`
}

function updateStats() {
    ui.titanium.innerHTML = `<img src='assets/img/item-titanium.png' class='mat_icon'>${kFormat(stats.titanium)}`
    ui.power.innerHTML    = `<img src='assets/img/power.png' class='mat_icon'>${kFormat(stats.power)}`

    const block = getCurrentBlock()
    ui.costSpan.textContent = block.cost
    ui.costSpan.style.color = block.cost <= stats.titanium ? "lightgreen" : "rgb(237,84,84)"
    ui.itemDesc.textContent = block.desc
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

function drawGrid() {
    const startX = -cameraX % C_SIZE - C_SIZE
    const endX   = G_SIZE - cameraX % C_SIZE + C_SIZE
    const startY = -cameraY % C_SIZE - C_SIZE
    const endY   = G_SIZE - cameraY % C_SIZE + C_SIZE

    for (let y = startY; y <= endY; y += C_SIZE) drawLine(startX, y, endX, y, "rgba(233,233,233,0.3)")
    for (let x = startX; x <= endX; x += C_SIZE) drawLine(x, startY, x, endY, "rgba(233,233,233,0.3)")
}

// ─── Mouse interaction ────────────────────────────────────────────────────────

const mouse = { x: 0, y: 0 }
let mouseheld   = false
let rmouseheld  = false
let justPlaced  = false   // prevent holding LMB from spending cost every frame
const startcoords = { x: 0, y: 0 }

canvas.addEventListener("mousedown", e => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    if (e.button === 0) {
        mouseheld  = true
        justPlaced = false
    } else if (e.button === 2) {
        rmouseheld = true
        startcoords.x = e.offsetX
        startcoords.y = e.offsetY
    }
})

canvas.addEventListener("mouseup", e => {
    if (e.button === 0) { mouseheld  = false; justPlaced = false }
    if (e.button === 2)   rmouseheld = false
})

canvas.addEventListener("mousemove", e => {
    mouse.x = e.offsetX
    mouse.y = e.offsetY
    // Allow placing on new cells while dragging
    justPlaced = false
})

window.addEventListener("keydown", e => {
    const key = e.key.toLowerCase()
    if (key === "r") {
        rotation = (rotation + 1) % 4
    } else if (key === "e") {
        spawnToggle = !spawnToggle
    }
})

function mouseEvents() {
    const mtile_x = Math.floor((mouse.x + cameraX) / C_SIZE)
    const mtile_y = Math.floor((mouse.y + cameraY) / C_SIZE)
    const block = getCurrentBlock()

    if (mouseheld && !justPlaced && block.cost <= stats.titanium) {
        const cell = getTile(mtile_x, mtile_y)
        if (cell) {
            // Refund cost of existing block if it's not a freeblock
            const existing = blocks[cell.blockKey]
            if (existing && cell.blockKey !== "freeblock") {
                stats.titanium += existing.cost
            }

            // Only spend + place if it's a different block
            if (cell.blockKey !== currentBlockKey) {
                stats.titanium -= block.cost
                setTileBlock(cell, currentBlockKey)
            }
            justPlaced = true
        }
    } else if (rmouseheld) {
        const stx = startcoords.x - cameraX
        const sty = startcoords.y - cameraY
        const etx = mouse.x - cameraX
        const ety = mouse.y - cameraY
        drawRect(
            Math.min(stx, etx), Math.min(sty, ety),
            Math.abs(etx - stx), Math.abs(ety - sty),
            "rgba(233,0,0,0.3)"
        )
    } else {
        // Ghost preview of selected block
        c.save()
        c.globalAlpha = 0.5
        drawImageRotated(block.img, mtile_x * C_SIZE - cameraX, mtile_y * C_SIZE - cameraY, rotation, C_SIZE, C_SIZE)
        c.restore()
    }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
    // World spans from tile (-15,-15) to (15,15) — 31×31 grid
    for (let tx = -15; tx <= 15; tx++) {
        for (let ty = -15; ty <= 15; ty++) {
            const x = tx * C_SIZE
            const y = ty * C_SIZE
            const t = new Tile(x, y, 0, "freeblock")
            tiles.push(t)
            tileMap.set(tileKey(tx, ty), t)
        }
    }
}

// ─── Main loop ────────────────────────────────────────────────────────────────

let spawnToggle = false

function frame() {
    updatePlayer()
    updateStats()
    updateSelectedOutline()

    updateTiles()
    updateMaterials()
    mouseEvents()
    drawGrid()

    drawCircleOutline(G_SIZE / 2, G_SIZE / 2, player.radius, "white")
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    frame()
}

init()
animate()

setInterval(() => {
    if (stats.power > 0 && spawnToggle) {
        spawnMaterial()
    }
    stats.power += 1
}, 500)
