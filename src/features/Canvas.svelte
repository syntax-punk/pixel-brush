<script lang="ts">
  export let x: string;
  export let y: string;

  import { onMount } from "svelte";
  import { addData, getData, getFirestuff } from "../lib/firestore";
    import { navigate } from "svelte-routing";
  
  const dataFilled = {};
  let DIMENSION;
  let WIDTH;
  let HEIGHT;
  let pixelSize;
  let brushColor = "#000000";

  onMount(() => {

    console.log('-----> ', x, y);

    const canvas = document.getElementById("lg-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    
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

    canvas.addEventListener('mousemove', mouseFill);
    canvas.addEventListener('touchmove', mouseFill);
    canvas.addEventListener('touchstart', mouseFill);
    canvas.addEventListener('mousedown', mouseFill);

    return () => {
      canvas.removeEventListener('mousemove', mouseFill);
      canvas.removeEventListener('touchmove', mouseFill);
      canvas.removeEventListener('touchstart', mouseFill);
      canvas.removeEventListener('mousedown', mouseFill);
    }
  });


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

<div>
  <input type="color" id="head" name="head" value={brushColor} on:change={handleColorChange}>
  <label for="head">color</label>
</div>
<canvas id="lg-canvas" height="500" width="500"></canvas>
<button on:click|preventDefault={() => saveDrawing()}>Save</button>

<style>
  canvas {
    margin: 2rem;
    border: 2px dashed hotpink;
  }
</style>