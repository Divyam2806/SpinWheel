let canvas, ctx;
let segments = []; // Will be updated via postMessage or fallback

const defaultSegments = [
  "10% OFF", "Free Shipping", "20% OFF", "Try Again", "5% OFF", "No Luck"
];

const colors = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#B983FF", "#FF9F1C"
];

let arcSize;
let currentRotation = 0;

// Listen for segments via postMessage
let segmentsReceived = false;
window.addEventListener("message", (event) => {
  if (event.data?.type === "WHEEL_SEGMENTS" && Array.isArray(event.data.segments)) {
    segments = event.data.segments;
    segmentsReceived = true;
    arcSize = (2 * Math.PI) / segments.length;
    console.log("Custom segments received. Segments: ", segments);
    
    setupObserver();
  }
});

// Fallback: If no message received in 500ms, use default segments
setTimeout(() => {
  if (!segmentsReceived) {
    segments = defaultSegments;
    arcSize = (2 * Math.PI) / segments.length;
    console.log("No segments received. Using default segments.");
    setupObserver();
  }
}, 500);

// ---- Wheel Drawing Logic ----
function drawWheel(rotation = 0) {
  if (!canvas || !ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(rotation);

  arcSize = (2 * Math.PI) / segments.length;

  for (let i = 0; i < segments.length; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(0, 0, centerX, i * arcSize, (i + 1) * arcSize);
    ctx.lineTo(0, 0);
    ctx.fill();

    // Text
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

// ---- Spin Logic ----
function spin() {
  const extraSpins = Math.floor(Math.random() * 3 + 5);
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

// ---- DOM Observer ----
function setupObserver(){
const observer = new MutationObserver(() => {
  canvas = document.getElementById("wheel");
  const btn = document.querySelector(".spin-btn");
  const closeBtn = document.querySelector(".close-btn");

  if (canvas && !ctx) {
    ctx = canvas.getContext("2d");
    const size = canvas.clientHeight || 600;
    canvas.width = size;
    canvas.height = size;

    arcSize = (2 * Math.PI) / segments.length;
    drawWheel();
  }

  if (btn && !btn.dataset.listenerAttached) {
    btn.addEventListener("click", spin);
    btn.dataset.listenerAttached = "true";
  }

  if (closeBtn && !closeBtn.dataset.listenerAttached) {
    closeBtn.addEventListener("click", () => {
      const wrapper = document.querySelector(".wheel-wrapper");
      if (wrapper) wrapper.style.display = "none";
    });
    closeBtn.dataset.listenerAttached = "true";
  }

  if (canvas && btn && closeBtn) {
    console.log("Wheel and buttons initialized");
    observer.disconnect();
  }
});

observer.observe(document.body, { childList: true, subtree: true });
}