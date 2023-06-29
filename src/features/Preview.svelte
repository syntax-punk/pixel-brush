<script lang="ts">
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { getData } from "../lib/firestore";

  let container;
  let canvas;
  let ctx;
  let gridData;
  let pixelSize = 2;
  let DIMENSION = 25;

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
        
        // const pixel = [parseInt(x) * 25 + parseInt(subX), parseInt(y) * 25 + parseInt(subY)];
        // fillPixel(pixel, color);
      }
      // gridData[parseInt(x)][parseInt(y)] = data[key];
    }
    console.log(gridData);
  });


  onMount(() => {
    container = document.querySelector('.container') as HTMLDivElement;
    canvas = document.getElementById("preview-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    let pixelPosition = [0, 0];

    const repeatSx = 20;
    const repeatSy = 15;
    let selectedBox;

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

    container.addEventListener('click', (e) => {
      selectBox(e)
    });

    canvas.addEventListener('mousemove', (e) => {
      let pixel = [Math.floor(e.offsetX / (pixelSize * DIMENSION)), Math.floor(e.offsetY / (pixelSize * DIMENSION))];
      pixelPosition = pixel;

      if (!selectedBox) { 
        selectedBox = document.createElement('div');
        selectedBox.id = 'selected-box';
        selectedBox.style.position = 'absolute';
        selectedBox.style.border = '1px solid red';
        selectedBox.style.width = `${DIMENSION * pixelSize - 2}px`;
        selectedBox.style.height = `${DIMENSION * pixelSize - 2}px`;
        selectedBox.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        selectedBox.style.top = 0;
        selectedBox.style.left = 0;
        container.appendChild(selectedBox);
      }

      selectedBox.style.left = `${pixel[0] * DIMENSION * pixelSize + 1}px`;
      selectedBox.style.top = `${pixel[1] * DIMENSION * pixelSize}px`;
    });

    function selectBox(e) {
      console.log(pixelPosition);

      navigate(`/draw/${pixelPosition[0]}/${pixelPosition[1]}`);
    }

    return () => {
      container.removeEventListener('click', selectBox);
    }
  });

</script>

<div class="container">
  <canvas id="preview-canvas" height="500" width="500"></canvas>
</div>


<style>
  .container {
    position: relative;
    border: 1px solid green;
  }

  canvas {
    border: 2px dashed azure;
  }
</style>