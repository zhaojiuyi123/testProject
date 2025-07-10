import type { ISpec } from "@visactor/vchart";
import type { PivotChartConstructorOptions, ListTable } from "@visactor/vtable";

export type MarkType =
  | "auto"
  | "bar"
  | "line"
  | "area"
  | "pie"
  | "indicatorCard";

export type EncodeType =
  | "color"
  | "size"
  | "shape"
  | "position"
  | "detail"
  | "tooltip"
  | "link"
  | "filter";

export interface Field {
  field: string;
  type: string;
}
export interface Encode {
  encode: EncodeType;
  field: string;
  type: string;
}
export interface Mark {
  field: string;
  type: string;
  markType: MarkType;
  encodes: Encode[];
}
export interface ChartParam {
  rows: Field[];
  columns: Field[];
  marks: Mark[];
}

export type ChartConfig = Partial<
  ISpec | PivotChartConstructorOptions | ListTable
> & {
  // 图表类型
  type: string;

  // 渲染类型： facetedPlot表示渲染分面图
  renderType: "facetedPlot" | undefined;
};
