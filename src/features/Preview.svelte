<script lang="ts">
  import { navigate } from "svelte-routing";
  import { onDestroy, onMount } from "svelte";
  import { getData } from "../lib/firestore";

  let container;
  let canvas;
  let ctx;
  let selectedBox;
  let pixelSize = 2;
  let DIMENSION = 25;
  let pixelPosition = [0, 0];

  function fillPixel(coords, subCoords, color) {
    const [x, y] = coords;
    const [subX, subY] = subCoords;

    ctx.fillStyle = color;
    let drawX = (x * DIMENSION + parseInt(subX)) *  pixelSize;
    let drawY = (y * DIMENSION + parseInt(subY)) *  pixelSize;
    ctx.fillRect(drawX, drawY, pixelSize, pixelSize);
  }


  onMount(async () => {
    const data: any = await getData();
    for (let key in data) {
      const coords = key.split(',');
      const pixelData = data[key];

      for (let subKey in pixelData) {
        const subCoords = subKey.split(',');
        const color = pixelData[subKey];
        fillPixel(coords, subCoords, color);        
      }
    }
  });


  onMount(() => {
    container = document.querySelector('.container') as HTMLDivElement;
    canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    const repeatSx = 20;
    const repeatSy = 15;

    let width = DIMENSION * repeatSx * pixelSize;
    let height = DIMENSION * repeatSy * pixelSize;
    canvas.width = width;
    canvas.height = height;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    
    for (let i = 0; i < DIMENSION * repeatSx; ++i) {
      if (i % DIMENSION !== 0) { continue; }
      
      const x = i * pixelSize;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const y = i * pixelSize;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    container.addEventListener('click', clickHandler);
    canvas.addEventListener('mousemove', mouseMoveHandler);
  });

  onDestroy(() => {
    container.removeEventListener('click', clickHandler);
    canvas.removeEventListener('mousemove', mouseMoveHandler);
  });

  function mouseMoveHandler(e) {
    let pixel = [Math.floor(e.offsetX / (pixelSize * DIMENSION)), Math.floor(e.offsetY / (pixelSize * DIMENSION))];
    pixelPosition = pixel;

    if (!selectedBox) { 
      createCursorBox();
    }

    selectedBox.style.left = `${pixel[0] * DIMENSION * pixelSize + 1}px`;
    selectedBox.style.top = `${pixel[1] * DIMENSION * pixelSize}px`;
  }

  function clickHandler(e) {
    selectBox(e);
  }

  function createCursorBox() {
    selectedBox = document.createElement('div');
    selectedBox.id = 'selected-box';
    selectedBox.style.position = 'absolute';
    selectedBox.style.width = `${DIMENSION * pixelSize}px`;
    selectedBox.style.height = `${DIMENSION * pixelSize}px`;
    selectedBox.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    selectedBox.style.top = 0;
    selectedBox.style.left = 0;
    container.appendChild(selectedBox);
  }

  function selectBox(e) {
      navigate(`/draw/${pixelPosition[0]}/${pixelPosition[1]}`);
  }

</script>

<div class="container">
  <canvas id="preview-canvas" height="500" width="500"></canvas>
</div>


<style>
  .container {
    position: relative;
    margin: auto;
  }
  canvas {
    border-radius: 4px;
    box-shadow: 0 0 16px 12px rgba(255, 255, 255, 0.1), 0 0 8px rgb(14, 245, 245, 0.4);
  }
</style>