<template>
  <div class="content">
    <div id="container" />
    <div id="minimap" class="minimap" />
  </div>
</template>
<script setup>
import { Graph } from "@antv/x6";
import { Scroller } from "@antv/x6-plugin-scroller";
import { MiniMap } from "@antv/x6-plugin-minimap";
import { onMounted } from "vue";
import { data } from "./data";
onMounted(() => {
  const graph = new Graph({
    container: document.getElementById("container"),
    autoResize: true,
    grid: {
      visible: true,
    },
    background: {
      color: "#F2F7FA",
    },
    // mousewheel: {
    //   modifiers: "ctrl",
    //   enabled: true,
    //   minScale: 0.4,
    //   maxScale: 3,
    // },
  });

  graph.use(
    new Scroller({
      enabled: true,
      pageVisible: true,
      pageBreak: false,
      pannable: true,
    })
  );
  graph.use(
    new MiniMap({
      container: document.getElementById("minimap"),
      width: 200,
      height: 160,
      padding: 10,
    })
  );
  graph.fromJSON(data); // 渲染元素
  graph.centerContent(); // 居中显示
});
</script>
<style>
.content {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: aliceblue;
  position: relative;
}
.minimap {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background-color: azure;
  width: 200px;
  height: 160px;
}
</style>
