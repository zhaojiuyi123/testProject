import type { PivotChartConstructorOptions } from "@visactor/vtable";
import type { ChartConfig } from "../interface";
import { datasource } from "./datasource";

interface Field {
  name: string;
  type: string;
}
function getFields() {
  const result: Field[] = [];
  const dataItem: any = datasource[0];
  for (const key in dataItem) {
    result.push({
      name: key,
      type: typeof dataItem[key],
    });
  }
  return result;
}

export function getChartConfig(): ChartConfig {
    return {
        
    }
}

export const fieldList: Field[] = getFields();
