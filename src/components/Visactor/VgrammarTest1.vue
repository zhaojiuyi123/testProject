<template>
  <div class="v-render" id="vContainer"></div>
</template>
<script lang="ts" setup>
import { View } from "@visactor/vgrammar";
import type { ViewSpec } from "@visactor/vgrammar";
import { onMounted } from "vue";
import { data } from "./data.ts";

const spec: Partial<ViewSpec> = {
  padding: { top: 30, right: 30, bottom: 30, left: 30 },
  data: [
    {
      id: "table",
      values: data,
    },
  ],
  scales: [
    {
      id: "xscale",
      type: "band",
      domain: { data: "table", field: "细分" },
      dependency: ["viewBox"],
      range: (scale, params) => {
        return [0, params.viewBox.width()];
      },
      padding: 0.05,
      round: true,
    },
    {
      id: "xscale-1",
      type: "band",
      domain: { data: "table", field: "类别" },
      dependency: ["xscale", "viewBox"],
      range: (scale, params) => {
        return [0, params.viewBox.width() / 3];
      },
      padding: 0.05,
      round: true,
    },
    {
      id: "xscale-2",
      type: "band",
      domain: { data: "table", field: "类别" },
      dependency: ["xscale", "viewBox"],
      range: (scale, params) => {
        return [params.viewBox.width() / 3, params.viewBox.width() / 3 * 2];
      },
      padding: 0.05,
      round: true,
    },
    {
      id: "xscale-3",
      type: "band",
      domain: { data: "table", field: "类别" },
      dependency: ["xscale", "viewBox"],
      range: (scale, params) => {
        return [(params.viewBox.width() / 3) * 2, params.viewBox.width()];
      },
      padding: 0.05,
      round: true,
    },
    {
      id: "yscale-1",
      type: "linear",
      domain: { data: "table", field: "销售额" },
      dependency: ["viewBox"],
      range: (scale, params) => {
        return [params.viewBox.height() - 40, params.viewBox.height() / 2];
      },
      nice: true,
    },
    {
      id: "yscale-2",
      type: "linear",
      domain: { data: "table", field: "折扣" },
      dependency: ["viewBox"],
      range: (scale, params) => {
        return [params.viewBox.height() / 2 - 40, 0];
      },
      nice: true,
    },
  ],

  interactions: [
    {
      type: 'crosshair',
      scale: 'xscale',
      crosshairShape: 'rect',
      crosshairType: 'x',
      container: '#container'
    },
    {
      type: 'tooltip',
      selector: '#rect',
      title: { visible: true, value: '销售额' },
      content: [
        {
          key: { field: '细分' },
          value: { field: '销售额' },
          symbol: {
            symbolType: 'circle',
            fill: '#6690F2'
          }
        }
      ]
    }
  ],
  marks: [
    {
      type: "component",
      componentType: "axis",
      scale: "xscale",
      tickCount: -1,
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: params.viewBox.height(),
            start: { x: 40, y: 0 },
            end: { x: params.viewBox.width(), y: 0 },
          };
        },
      },
    },
    {
      type: "component",
      componentType: "axis",
      scale: "xscale-1",
      tickCount: -1,
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: params.viewBox.height() - 40,
            start: { x: 40, y: 0 },
            end: { x: params.viewBox.width() / 3, y: 0 },
          };
        },
      },
    },
    {
      type: "component",
      componentType: "axis",
      scale: "xscale-2",
      tickCount: -1,
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: params.viewBox.height() - 40,
            start: { x: params.viewBox.width() / 3, y: 0 },
            end: { x: (params.viewBox.width() / 3) * 2, y: 0 },
          };
        },
      },
    },
    {
      type: "component",
      componentType: "axis",
      scale: "xscale-3",
      tickCount: -1,
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: params.viewBox.height() - 40,
            start: { x: (params.viewBox.width() / 3) * 2, y: 0 },
            end: { x: params.viewBox.width(), y: 0 },
          };
        },
      },
    },
    {
      type: "component",
      componentType: "axis",
      scale: "yscale-1",
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: 0,
            start: { x: 40, y: params.viewBox.height() - 40 },
            end: { x: 40, y: params.viewBox.height() / 2 },
            verticalFactor: -1,
          };
        },
      },
    },
    {
      type: "component",
      componentType: "axis",
      scale: "yscale-2",
      dependency: ["viewBox"],
      encode: {
        update: (scale, elment, params) => {
          return {
            x: 40,
            y: 0,
            start: { x: 40, y: params.viewBox.height() / 2 - 40 },
            end: { x: 40, y: 10 },
            verticalFactor: -1,
          };
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-1", field: "类别", band: 0.5 },
          width: { scale: "xscale-1", band: 0.5 },
          y: { scale: "yscale-1", field: "销售额" },
          y1: (datum, element, params) => {
            return params["yscale-1"].scale(params["yscale-1"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-2", field: "类别", band: 0.5 },
          width: { scale: "xscale-2", band: 0.5 },
          y: { scale: "yscale-1", field: "销售额" },
          y1: (datum, element, params) => {
            return params["yscale-1"].scale(params["yscale-1"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-3", field: "类别", band: 0.5 },
          width: { scale: "xscale-3", band: 0.5 },
          y: { scale: "yscale-1", field: "销售额" },
          y1: (datum, element, params) => {
            return params["yscale-1"].scale(params["yscale-1"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-1", field: "类别", band: 0.5 },
          width: { scale: "xscale-1", band: 0.5 },
          y: { scale: "yscale-2", field: "折扣" },
          y1: (datum, element, params) => {
            return params["yscale-2"].scale(params["yscale-2"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-2", field: "类别", band: 0.5 },
          width: { scale: "xscale-2", band: 0.5 },
          y: { scale: "yscale-2", field: "折扣" },
          y1: (datum, element, params) => {
            return params["yscale-2"].scale(params["yscale-2"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
    {
      type: "rect",
      from: { data: "table" },
      encode: {
        update: {
          x: { scale: "xscale-3", field: "类别", band: 0.5 },
          width: { scale: "xscale-3", band: 0.5 },
          y: { scale: "yscale-2", field: "折扣" },
          y1: (datum, element, params) => {
            return params["yscale-2"].scale(params["yscale-2"].domain()[0]);
          },
          size: 10,
          fill: "#6690F2",
        },
        hover: {
          fill: "red",
        },
      },
    },
  ],
};
function render() {
  const vGrammarView = new View({
    autoFit: true,
    container: "vContainer",
  });
  vGrammarView.parseSpec(spec);
  vGrammarView.run();
}

onMounted(render);
</script>
<style>
.v-render {
  width: 100vw;
  height: 100vh;
}
</style>
