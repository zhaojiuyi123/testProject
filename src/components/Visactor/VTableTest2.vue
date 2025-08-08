<template>
  <div class="v-render" id="vContainer"></div>
</template>
<script lang="ts" setup>
import type { PivotChartConstructorOptions } from "@visactor/vtable";
import VChart from "@visactor/vchart";
import { PivotChart, register } from "@visactor/vtable";
import { onMounted } from "vue";
import { data } from "./data.ts";
register.chartModule("vchart", VChart);

const columns = [
  {
    dimensionKey: "类别",
    title: "类别",
  },
];
const rows = [
  {
    dimensionKey: "子类别",
    title: "子类别",
  },
];
const indicators: any = [
  {
    indicatorKey: "销售额",
    width: "auto",
    cellType: "chart",
    title: "销售额",
    chartModule: "vchart",
    chartSpec: {
      color: ["#669FF0", "#7166F0", "#FFB6C1"],
      type: "histogram",
      data: [
        {
          id: "data",
        },
      ],
      xField: "start",
      x2Field: "数量",
      seriesField: "细分",
      yField: "销售额",
    },
    style: {
      padding: 1,
    },
  },
  {
    indicatorKey: "数量",
    title: "数量",
    width: "auto",
    cellType: "chart",
    chartModule: "vchart",
    chartSpec: {
      color: ["#669FF0", "#7166F0", "#FFB6C1"],
      invalidType: "ignore",
      type: "histogram",
      xField: "start",
      x2Field: "数量",
      yField: "销售额",
      seriesField: "细分",
      data: {
        id: "data",
      },
    },
    style: {
      padding: 1,
    },
  },
];
const option: PivotChartConstructorOptions = {
  rows,
  // type: "bar",
  // renderType: "facetedPlot",
  columns,
  indicators,
  indicatorsAsCol: false,
  records: data,
  defaultRowHeight: 200,
  defaultHeaderRowHeight: 50,
  defaultColWidth: 280,
  defaultHeaderColWidth: 100,
  theme: {
    bodyStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 0, 0, 1],
    },
    headerStyle: {
      borderColor: "gray",
      borderLineWidth: [0, 0, 1, 1],
    },
    rowHeaderStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 1, 0, 0],
    },
    cornerHeaderStyle: {
      borderColor: "gray",
      borderLineWidth: [0, 1, 1, 0],
    },
    cornerRightTopCellStyle: {
      borderColor: "gray",
      borderLineWidth: [0, 0, 1, 1],
    },
    cornerLeftBottomCellStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 1, 0, 0],
    },
    cornerRightBottomCellStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 0, 0, 1],
    },
    rightFrozenStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 0, 1, 1],
    },
    bottomFrozenStyle: {
      borderColor: "gray",
      borderLineWidth: [1, 1, 0, 1],
    },
    selectionStyle: {
      cellBgColor: "",
      cellBorderColor: "",
    },
    frameStyle: {
      borderLineWidth: 0,
    },
  },
};

function render() {
  const vGrammarView = new PivotChart(
    document.querySelector("#vContainer") as HTMLElement,
    option
  );
}

onMounted(render);
</script>
<style>
.v-render {
  width: 100vw;
  height: 100vh;
}
</style>
