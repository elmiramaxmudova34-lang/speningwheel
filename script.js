const participants = [
    "Akbarov Kamronbek", "Axrorova Madina", "Azizqulova Shaydo", 
    "Hamidova Gavhar", "Hasanov Istam", "Ismatullayev Ismoil", 
    "Izzatullayev Mirziyo", "Ishmurodov Oybekjon", "Keldiyorov Kamronbek", 
    "Mansurov Umidjon", "Manyapova Dinara", "Namozova Asal", 
    "Ne'matullayeva Durdona", "Noridinov Murodbek", "Normurotov Jur'at", 
    "Norqulova Begoyim", "Orolov Sobidjon", "Ochilova Munisa", 
    "Radjabov Muslimbek", "Rozimurodov Quvonchbek", "Safarova Dilnura", 
    "Samadova Saodat", "Sobirova Barchinoy", "Temirova Umida", 
    "Toshpulatova Malika", "Turdiyev Ulug’Bek", "Xakimova Xonzodabegim", 
    "Xasanov Temurbek", "Yo'ldoshev Firdavs", "Shavkatov Behruz", "Shokirova Kumush"
];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const modal = document.getElementById("winnerModal");
const fullWinnerName = document.getElementById("fullWinnerName");
const closeBtn = document.getElementById("closeBtn");

let currentAngle = 0;
let isSpinning = false;
const count = participants.length;
const arc = Math.PI * 2 / count;
const colors = participants.map((_, i) => `hsl(${(i * 360 / count)}, 75%, 50%)`);

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < count; i++) {
        const angle = currentAngle + i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.fill();
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 13px Arial";
        let firstName = participants[i].split(' ')[1] || participants[i].split(' ')[0];
        ctx.fillText(firstName, 240, 5);
        ctx.restore();
    }
}

function startSpin() {
    if (isSpinning) return;
    isSpinning = true;
    const duration = 5000;
    const extraSpins = Math.PI * 2 * (Math.random() * 5 + 7);
    const startAngle = currentAngle;
    const startTime = performance.now();

    function animate(time) {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        currentAngle = startAngle + (extraSpins * easeOut);
        drawWheel();
        if (progress < 1) requestAnimationFrame(animate);
        else {
            isSpinning = false;
            showResult();
        }
    }
    requestAnimationFrame(animate);
}

function showResult() {
    const normalized = currentAngle % (Math.PI * 2);
    const pointer = Math.PI * 1.5;
    let idx = Math.floor((pointer - normalized) / arc) % count;
    if (idx < 0) idx += count;

    fullWinnerName.innerHTML = `Savol mana shu o'quvchiga: <br><br> <span style="color:white; font-size: 50px;">${participants[idx]}</span>`;
    modal.style.display = "flex";

    // Konfetti otish
    confetti({
        particleCount: 250,
        spread: 120,
        origin: { y: 0.5 }
    });
}

closeBtn.onclick = () => modal.style.display = "none";
spinBtn.onclick = startSpin;

// Social tugmalarni animatsiya qilish
const socialBtns = document.querySelectorAll('.social-btn');
socialBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Klik animatsiyasi
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)';
        ripple.style.width = ripple.style.height = '60px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple-animation 0.6s ease-out';
        
        // Animation qo'shish
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple-animation {
                0% { width: 60px; height: 60px; opacity: 1; }
                100% { width: 300px; height: 300px; opacity: 0; }
            }
        `;
        if (!document.querySelector('#ripple-style')) {
            style.id = 'ripple-style';
            document.head.appendChild(style);
        }
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

drawWheel();