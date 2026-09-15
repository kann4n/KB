const bubbleSortCanvas = document.getElementById("bubble-sort-canvas");
const ctx = bubbleSortCanvas.getContext("2d");

bubbleSortCanvas.width = 600;
bubbleSortCanvas.height = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const padding = 10;
const arrlen = document.getElementById("bubbleSortSize").value;

const COLORS = {
  default: "#4422FF",
  compare1: "#00FF0C",
  compare2: "#F00C12",
  sorted: "#2ECC71"   
};

let audioCtx = null;

function playNote(val, maxVal) {
  if (audioCtx == null) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  // Map the array value to a frequency between 200Hz and 800Hz
  const minFreq = 200;
  const maxFreq = 800;
  const freq = minFreq + (val / maxVal) * (maxFreq - minFreq);

  const duration = 0.1; // 100ms
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = "square"; // You can try "triangle" or "square" for retro sounds
  oscillator.frequency.value = freq;
  
  // Fade out the sound quickly to avoid clicking noises
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}

async function bubbleSort(arr) {
  let n = arr.length;
  const maxVal = Math.max(...arr);
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      
      drawBubbleSort(arr, j, j + 1, n - i);
      
      playNote(arr[j], maxVal);
      
      let delay = arr.length < 10 ? 400 : (arr.length < 20 ? 200 : (arr.length < 40 ? 100 : 50));
      await sleep(delay);

      if (arr[j] > arr[j + 1]) {
        await animateSwap(arr, j, j + 1, 300, n - i);
        
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
    playNote(arr[n - i - 1], maxVal);
  }
  drawBubbleSort(arr, -1, -1, 0);
}

function animateSwap(arr, idx1, idx2, duration, sortedBoundary) {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const barWidth = bubbleSortCanvas.width / arr.length;
    const barHeight = bubbleSortCanvas.height;
    const max = Math.max(...arr);

    function step(currentTime) {
      let progress = (currentTime - startTime) / duration;
      if (progress > 1) progress = 1;

      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      ctx.clearRect(0, 0, bubbleSortCanvas.width, bubbleSortCanvas.height);

      for (let i = 0; i < arr.length; i++) {
        if (i === idx1 || i === idx2) continue;

        let color = i >= sortedBoundary ? COLORS.sorted : COLORS.default;
        ctx.fillStyle = color;
        
        ctx.beginPath();
        ctx.rect(
          i * barWidth, 
          (1 - arr[i] / max) * barHeight + padding, 
          barWidth - 2, 
          (arr[i] / max) * barHeight - padding, 
        );
        ctx.fill();
      }

      const startX1 = idx1 * barWidth;
      const endX1 = idx2 * barWidth;
      const currentX1 = startX1 + (endX1 - startX1) * ease;

      const startX2 = idx2 * barWidth;
      const endX2 = idx1 * barWidth;
      const currentX2 = startX2 + (endX2 - startX2) * ease;

      ctx.fillStyle = COLORS.compare1;
      ctx.beginPath();
      ctx.rect(currentX1, (1 - arr[idx1] / max) * barHeight + padding, barWidth - 2, (arr[idx1] / max) * barHeight - padding);
      ctx.fill();

      ctx.fillStyle = COLORS.compare2;
      ctx.beginPath();
      ctx.rect(currentX2, (1 - arr[idx2] / max) * barHeight + padding, barWidth - 2, (arr[idx2] / max) * barHeight - padding);
      ctx.fill();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

function drawBubbleSort(arr, activeIndex1, activeIndex2, sortedBoundary = arr.length) {
  const barWidth = bubbleSortCanvas.width / arr.length;
  const barHeight = bubbleSortCanvas.height;
  const max = Math.max(...arr); // Replaced undefined getMax(arr) with Math.max

  ctx.clearRect(0, 0, bubbleSortCanvas.width, bubbleSortCanvas.height);

  for (let i = 0; i < arr.length; i++) {
    if (i === activeIndex1) {
      ctx.fillStyle = COLORS.compare1;
    } else if (i === activeIndex2) {
      ctx.fillStyle = COLORS.compare2;
    } else if (i >= sortedBoundary) {
      ctx.fillStyle = COLORS.sorted; 
    } else {
      ctx.fillStyle = COLORS.default;
    }

    ctx.beginPath();
    ctx.rect(
      i * barWidth,
      (1 - arr[i] / max) * barHeight + padding,
      barWidth - 2, 
      (arr[i] / max) * barHeight - padding
    );
    ctx.fill();
  }
}

function bubbleSortStart() {
  let arr = Array.from({ length: arrlen }, () => Math.floor(Math.random() * 100) + 20);
  bubbleSort(arr);
}