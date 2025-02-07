document.addEventListener("mousemove", (e) => {
    const cursor = document.querySelector(".cursor");
    cursor.style.left = `${e.pageX}px`; // Use pageX for full page position
    cursor.style.top = `${e.pageY}px`; // Use pageY for full page position
});




const canvas = document.getElementById('dotsCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const dots = [];
const numDots = 100; // Number of dots
const maxDistance = 120; // Distance at which dots connect with each other
const mouseEffectDistance = 250; // Distance at which dots interact with the cursor
let mouse = { x: null, y: null };

// Track mouse movement
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Track when mouse leaves the screen
window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

// Dot class
class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1; // Random dot size
        this.speedX = (Math.random() - 0.5) * 3;
        this.speedY = (Math.random() - 0.5) * 3;
    }

    // Update dot position
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x <= 0 || this.x >= canvas.width) this.speedX *= -1;
        if (this.y <= 0 || this.y >= canvas.height) this.speedY *= -1;

        // Mouse attraction effect
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseEffectDistance) {
                this.x -= dx * 0.02;
                this.y -= dy * 0.02;
            }
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = "#00ffff"; // Neon cyan color
        ctx.fill();
    }
}

// Create dots
function init() {
    for (let i = 0; i < numDots; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        dots.push(new Dot(x, y));
    }
}

// Draw connecting lines between close dots
function drawLines() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / maxDistance})`; // Fades as distance increases
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }

        // Draw a line from the mouse to nearby dots
        if (mouse.x && mouse.y) {
            const dx = dots[i].x - mouse.x;
            const dy = dots[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouseEffectDistance) {
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / mouseEffectDistance})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        dot.update();
        dot.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
}

// Resize event listener
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

init();
animate();
