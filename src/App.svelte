<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Canvas from "./features/Canvas.svelte";
  import Preview from "./features/Preview.svelte";
  import Footer from "./features/Footer.svelte";
</script>

<section>
  <Router>
    <Route path="/" component={Preview} />
    <Route path="/draw/:x/:y" component={Canvas} />
  </Router>
  <Footer />
</section>

<style>
  section {
    display: flex;
    flex-direction: column;
    height: 100%;
    height: 100%;
  }
</style>
