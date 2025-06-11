const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const observer = new MutationObserver(() => {
  const btn = document.querySelector(".spin-btn");
  const canvas = document.getElementById("wheel");
  
  if (btn && canvas) {
    btn.addEventListener("click", spin);

    // Initialize canvas only once
    const size = canvas.clientHeight || 600;
    canvas.width = size;
    canvas.height = size;
    drawWheel();

    console.log("spin-btn found and listener attached");
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

const segments = [
  "10% OFF",
  "Free Shipping",
  "20% OFF",
  "Try Again",
  "5% OFF",
  "No Luck"
];

const colors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#B983FF",
  "#FF9F1C"
];

const arcSize = (2 * Math.PI) / segments.length;
let currentRotation = 0;

function drawWheel(rotation = 0) {
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = colors[i];
    ctx.arc(0, 0, centerX, i * arcSize, (i + 1) * arcSize);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Draw label
    ctx.save();
    ctx.fillStyle = "#000";
    ctx.rotate((i + 0.5) * arcSize);
    ctx.translate(centerX * 0.65, 0);
    ctx.rotate(Math.PI / 2);
    ctx.font = "14px Arial";
    ctx.fillText(segments[i], -ctx.measureText(segments[i]).width / 2, 0);
    ctx.restore();
  }

  ctx.restore();
}

function spin() {
  const extraSpins = Math.floor(Math.random() * 3 + 5); // 5-7 spins
  const randomOffset = Math.random() * 2 * Math.PI;
  const totalRotation = extraSpins * 2 * Math.PI + randomOffset;

  let start = null;
  const duration = 4000;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const easing = 1 - Math.pow(1 - progress, 3);

    currentRotation = totalRotation * easing;
    drawWheel(currentRotation);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      const angle = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
      const segmentIndex = Math.floor(angle / arcSize);
      alert("Result: " + segments[segmentIndex]);
    }
  }

  requestAnimationFrame(animate);
}

// function initializeCanvas() {
//   // Wait until canvas is visible and has height
//   const checkReady = setInterval(() => {
//     const size = canvas.clientHeight;
//     if (size > 0) {
//       canvas.width = size;
//       canvas.height = size;
//       drawWheel();
//       clearInterval(checkReady);
//     }
//   }, 50);
// }

// initializeCanvas(); // Call immediately after declaring

document.querySelector(".close-btn").addEventListener("click", () => {
  document.querySelector(".wheel-wrapper").style.display = "none";
});