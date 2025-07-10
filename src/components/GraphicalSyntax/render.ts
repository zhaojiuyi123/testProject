import VChart, { type ISpec } from "@visactor/vchart";
import { PivotChart, type PivotChartConstructorOptions, register } from "@visactor/vtable";
import type { ShallowRef } from "vue";
import type { ChartConfig } from "./interface";

register.chartModule('vchart', VChart);
function getRenderer(node: HTMLElement, config: ChartConfig) {
  if (config.renderType === "facetedPlot") {
    return new PivotChart(node, config as PivotChartConstructorOptions);
  } else {
    return new VChart(config as ISpec, {
      dom: node,
    });
  }
}

export const useRender = (node: ShallowRef<HTMLElement>) => {
  let renderer: VChart | PivotChart | null = null;
  function render(config: ChartConfig) {
    
    renderer && renderer.release();
    renderer = getRenderer(node.value, config);
    renderer.renderAsync();
  }
  return {
    render,
  };
};
