<template>
  <div class="v-render" id="container"></div>
</template>
<script lang="ts" setup>
import { Facet } from "@antv/g2plot";
import { onMounted } from "vue";
import { data } from "./data";
function render() {
  const plot = new Facet("container", {
    type: "rect",
    fields: ["细分", "类别"],
    padding: [0, 10, 10],
    appendPadding: 30,
    data,
    axes: {},

    eachView: (view, facet) => {
      console.log(facet);

      return {
        type: "column",
        options: {
          data: facet.data,
          xField: "子类别",
          yField: "销售额",
          colorField: "cut",
          shape: "circle",
          pointStyle: { fillOpacity: 0.3, stroke: null },
        },
      };
    },
  });
  plot.render();
}

onMounted(render);
</script>
<style>
.v-render {
  width: 100vw;
  height: 100vh;
}
</style>
