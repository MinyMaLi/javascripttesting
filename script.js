class Ball {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = 0;
        this.vy = 0;
        this.gravity = 0.5;
        this.friction = 0.99;
        this.bounce = 0.8;
        this.isDragging = false;
    }

    update() {
        // Apply gravity
        this.vy += this.gravity;
        
        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply air friction
        this.vx *= this.friction;
        this.vy *= this.friction;
        
        // Bottom boundary bounce
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy = -this.vy * this.bounce;
        }
        
        // Top boundary bounce
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy = -this.vy * this.bounce;
        }
        
        // Side boundaries bounce
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx = -this.vx * this.bounce;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx = -this.vx * this.bounce;
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    collideWith(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.radius + other.radius) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            const moveX = (this.radius + other.radius - distance) * cos / 2;
            const moveY = (this.radius + other.radius - distance) * sin / 2;

            this.x -= moveX;
            this.y -= moveY;
            other.x += moveX;
            other.y += moveY;

            const tempVx = this.vx * this.bounce;
            const tempVy = this.vy * this.bounce;
            this.vx = other.vx * this.bounce;
            this.vy = other.vy * this.bounce;
            other.vx = tempVx;
            other.vy = tempVy;

            this.color = '#ff3333';
            other.color = '#3333ff';
            
            setTimeout(() => {
                this.color = '#ff0000';
                other.color = '#0000ff';
            }, 100);
        }
    }

    isPointInside(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
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

// Mouse control variables
let selectedBall = null;

// Mouse event listeners
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check both balls, prioritize the one on top (last drawn)
    if (mouseBall.isPointInside(mouseX, mouseY)) {
        selectedBall = mouseBall;
        mouseBall.color = '#3333ff'; // Brighter blue
    } else if (wasdBall.isPointInside(mouseX, mouseY)) {
        selectedBall = wasdBall;
        wasdBall.color = '#ff3333'; // Brighter red
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (selectedBall) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Move towards mouse position
        selectedBall.vx = (mouseX - selectedBall.x) * 0.1;
        selectedBall.vy = (mouseY - selectedBall.y) * 0.1;
    }
});

canvas.addEventListener('mouseup', () => {
    if (selectedBall) {
        if (selectedBall === wasdBall) {
            selectedBall.color = '#ff0000'; // Original red
        } else {
            selectedBall.color = '#0000ff'; // Original blue
        }
        selectedBall = null;
    }
});

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update ball physics
    wasdBall.update();
    mouseBall.update();
    
    // Check for collision
    wasdBall.collideWith(mouseBall);
    
    // Draw balls
    wasdBall.draw(ctx);
    mouseBall.draw(ctx);
    
    requestAnimationFrame(animate);
}

// Function to resize canvas
function resizeCanvas() {
    canvas.width = window.innerWidth - 4; // -4 to account for border
    canvas.height = 400;  // Keep height fixed
    
    // Ensure balls stay within new boundaries
    wasdBall.x = Math.max(wasdBall.radius, Math.min(canvas.width - wasdBall.radius, wasdBall.x));
    wasdBall.y = Math.max(wasdBall.radius, Math.min(canvas.height - wasdBall.radius, wasdBall.y));
    
    mouseBall.x = Math.max(mouseBall.radius, Math.min(canvas.width - mouseBall.radius, mouseBall.x));
    mouseBall.y = Math.max(mouseBall.radius, Math.min(canvas.height - mouseBall.radius, mouseBall.y));
}

// Initial setup
resizeCanvas();

// Add resize event listener
window.addEventListener('resize', resizeCanvas);

animate();