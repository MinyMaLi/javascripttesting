class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.isDragging = false;
        this.color = color;
        this.speed = 5;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Setup canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

// Create two balls
const wasdBall = new Ball(200, canvas.height / 2, 40, '#ff0000');
const mouseBall = new Ball(600, canvas.height / 2, 40, '#0000ff'); // New blue ball

// WASD controls (existing code)
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

window.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = true; break;
        case 'a': keys.a = true; break;
        case 's': keys.s = true; break;
        case 'd': keys.d = true; break;
    }
});

window.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'w': keys.w = false; break;
        case 'a': keys.a = false; break;
        case 's': keys.s = false; break;
        case 'd': keys.d = false; break;
    }
});

// Mouse controls for the second ball
let isMouseDown = false;

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const distance = Math.sqrt(
        Math.pow(mouseX - mouseBall.x, 2) + 
        Math.pow(mouseY - mouseBall.y, 2)
    );
    
    if (distance < mouseBall.radius) {
        isMouseDown = true;
        mouseBall.color = '#0066ff'; // Lighter blue when clicked
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isMouseDown) {
        const rect = canvas.getBoundingClientRect();
        mouseBall.x = e.clientX - rect.left;
        mouseBall.y = e.clientY - rect.top;
        
        mouseBall.x = Math.max(mouseBall.radius, Math.min(canvas.width - mouseBall.radius, mouseBall.x));
        mouseBall.y = Math.max(mouseBall.radius, Math.min(canvas.height - mouseBall.radius, mouseBall.y));
    }
});

canvas.addEventListener('mouseup', () => {
    isMouseDown = false;
    mouseBall.color = '#0000ff'; // Back to original blue
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update WASD ball position
    if (keys.w) wasdBall.y -= wasdBall.speed;
    if (keys.s) wasdBall.y += wasdBall.speed;
    if (keys.a) wasdBall.x -= wasdBall.speed;
    if (keys.d) wasdBall.x += wasdBall.speed;
    
    // Keep WASD ball within bounds
    wasdBall.x = Math.max(wasdBall.radius, Math.min(canvas.width - wasdBall.radius, wasdBall.x));
    wasdBall.y = Math.max(wasdBall.radius, Math.min(canvas.height - wasdBall.radius, wasdBall.y));
    
    // Draw both balls
    wasdBall.draw(ctx);
    mouseBall.draw(ctx);
    
    requestAnimationFrame(animate);
}

animate();