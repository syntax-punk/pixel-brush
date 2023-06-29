<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Canvas from "./features/Canvas.svelte";
  import Preview from "./features/Preview.svelte";
</script>

<section>
  <Router>
    <Route path="/" component={Preview} />
    <Route path="/draw/:x/:y" component={Canvas} />
  </Router>
</section>

<style>
  section {
    display: grid;
    place-items: center;
    height: 100%;
    height: 100%;
    border: 1px solid red;
  }
</style>
