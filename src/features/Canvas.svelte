<script lang="ts">
  export let x: string;
  export let y: string;

  import { onDestroy, onMount } from "svelte";
  import { addData } from "../lib/firestore";
  import { navigate } from "svelte-routing";
  
  let canvas;
  let ctx;
  const dataFilled = {};
  let DIMENSION;
  let WIDTH;
  let HEIGHT;
  let pixelSize;
  let brushColor = "#000000";

  onMount(() => {
    canvas = document.getElementById("lg-canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
    DIMENSION = 25;
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    pixelSize = WIDTH / DIMENSION;

  
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  
    for (let i=0; i < DIMENSION; i++) {
  
      const x = Math.floor(i * WIDTH / DIMENSION);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, HEIGHT);
      ctx.stroke();
  
      const y = Math.floor(i * HEIGHT / DIMENSION);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(WIDTH, y);
      ctx.stroke();
    }

    canvas.addEventListener('mousemove', mouseFill);
    canvas.addEventListener('touchmove', mouseFill);
    canvas.addEventListener('touchstart', mouseFill);
    canvas.addEventListener('mousedown', mouseFill);
  });

  onDestroy(() => {
    canvas.removeEventListener('mousemove', mouseFill);
    canvas.removeEventListener('touchmove', mouseFill);
    canvas.removeEventListener('touchstart', mouseFill);
    canvas.removeEventListener('mousedown', mouseFill);
  });

  function mouseFill(e: any) {
    if (e.which !== 1) return;

    let offsetX = e.offsetX;
    let offsetY = e.offsetY;
    const pixel = [Math.floor(offsetX / pixelSize), Math.floor(offsetY / pixelSize)];
    fillPixel(pixel);
  }

  function fillPixel(pixel) {
    const key = `${pixel[0]},${pixel[1]}`;
    dataFilled[key] = brushColor
    ctx.fillStyle = brushColor;
    ctx.fillRect(pixel[0] * pixelSize, pixel[1] * pixelSize, pixelSize - 1, pixelSize - 1);
  }

  function handleColorChange(e) {
    brushColor = e.target.value;
  }

  async function saveDrawing() {
    const payload = {
      [`${x},${y}`]: dataFilled
    }

    await addData(payload);
    navigate('/');
  }

</script>

<div class="container">
  <div class="color-picker">
    <label for="head">Pick a color: </label>
    <input type="color" id="head" name="head" value={brushColor} on:change={handleColorChange}>
  </div>
  <canvas id="lg-canvas" height="500" width="500"></canvas>
  <button on:click|preventDefault={() => saveDrawing()}>Save</button>
</div>

<style>
  .container {
    display: grid;
    grid-template-rows: max-content max-content max-content;
    grid-template-columns: max-content;
    place-content: center;
    gap: 1.25rem;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 2rem;
  }

  .color-picker {
    height: 3rem;
    align-items: center;
    display: flex;
  }

  .color-picker > label {
    font-size: 1rem;
    line-height: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-right: 0.8rem;
  }

  .color-picker > input {
    height: 2.2rem;
    width: 4rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    background-color: #cacaca;
    border-radius: 2px;
    border: none;
  }

  button {
    height: 2.2rem;
    line-height: 1.4rem;
    font-size: 1.4rem;
    width: 12rem;
    justify-self: center;
    cursor: pointer;
    background-color: rgba(5, 191, 141, 0.569);
    box-shadow: 2px 0 6px 2px rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 6px;
  }

  canvas {
    border-radius: 4px;
    box-shadow: 0 0 16px 12px rgba(255, 255, 255, 0.1), 0 0 4px 2px rgba(25, 252, 0, 0.1);
  }
</style>