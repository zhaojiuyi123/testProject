import type { ISpec } from "@visactor/vchart";
import type { PivotChartConstructorOptions } from "@visactor/vtable";

export interface ChartParam {
    rows: string[];
    columns: string[];
    marks: {
        type: MarkType;
    }[]
}

export type MarkType = "bar" | "line" | "area" | "pie"

export type ChartConfig = Partial<ISpec | PivotChartConstructorOptions> & {
  // 图表类型
  type: string;

  // 渲染类型： facetedPlot表示渲染分面图
  renderType: "facetedPlot" | undefined;
};
