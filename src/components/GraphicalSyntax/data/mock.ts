import type { PivotChartConstructorOptions } from "@visactor/vtable";
import type { ChartConfig, ChartParam } from "../interface";
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

export function getChartConfig(params: ChartParam): ChartConfig {
  const allFields = [...params.rows, ...params.columns];
  const rowsLength = params.rows.length;
  const columnsLength = params.columns.length;
  const markList = params.marks;
  const totalFields = allFields.length;

  // 当字段总数为1时
  if (totalFields === 1) {
    const field = allFields[0];
    const fieldName = field.field;

    if (field.type === "number") {
      return {
        type: "indicatorCard",
        data: datasource.reduce((a: any, b: any) => a + (b[fieldName] || 0), 0),
      };
    } else {
      return {
        type: "table",
        records: datasource,
        columns: allFields.map((field) => {
          return {
            field: field.field,
            title: field.field,
            width: 150,
          };
        }),
      };
    }
  }
  if (rowsLength === 0 || columnsLength === 0) {
    return {
      type: "table",
      records: datasource,
      columns: allFields.map((field) => {
        return {
          field: field.field,
          title: field.field,
          width: 150,
        };
      }),
    };
  }

  // 当rows和columns各有一个字段时
  if (params.rows.length === 1 && params.columns.length === 1) {
    const numericField = allFields.find((f) => f.type === "number");
    const stringField = allFields.find((f) => f.type === "string");
    const seriesField = markList[0]?.encodes.find(
      (encode) => encode.encode === "color"
    )?.field;
    console.log(seriesField);

    if (numericField && stringField && params.marks.length > 0) {
      const mark = params.marks[0];
      const chartType = mark.markType === "auto" ? "bar" : mark.markType;
      const valueMap = {};
      const dimName = stringField.field;
      const meaName = numericField.field;
      datasource.forEach((item) => {
        const dim = item[dimName];
        const key = dim + (item[seriesField] || "");
        if (valueMap[key]) {
          return (valueMap[key] = {
            [dimName]: dim,
            [seriesField]: item[seriesField],
            [meaName]: valueMap[key][meaName] + (item[meaName] || 0),
          });
        }
        valueMap[key] = {
          [dimName]: dim,
          [seriesField]: item[seriesField],
          [meaName]: item[meaName] || 0,
        };
      });

      return {
        type: chartType,
        data: {
          values: Object.values(valueMap),
        },
        xField: stringField.field,
        yField: numericField.field,
        seriesField: seriesField || undefined,
        renderType: undefined,
      };
    }
  }

  // 当字段数量超过2个时，返回分面图
  if (totalFields > 2) {
    const rows = params.rows.filter((field) => field.type !== "number");
    const columns = params.columns.filter((field) => field.type !== "number");
    const masks = params.marks;
    const series = rows.length > columns.length ? rows.pop() : columns.pop();

    const indicators = masks.map((field) => {
      return {
        indicatorKey: field.field,
        width: "auto",
        cellType: "chart",
        title: field.field,
        chartModule: "vchart",
        chartSpec: {
          color: ["#669FF0", "#7166F0", "#FFB6C1"],
          type: field.markType === 'auto' ? 'bar' : field.markType,
          data: [
            {
              id: "data",
            },
          ],
          xField: series?.field,
          yField: field.field,
          seriesField:
            field.encodes.find((i) => i.encode === "color")?.field || undefined,
        },
        style: {
          padding: 1,
        },
      };
    });
    return {
      type: "",
      renderType: "facetedPlot",
      rows: rows.map((field) => field.field),
      columns: columns.map((field) => field.field),
      indicators,
      indicatorsAsCol: false,
      records: datasource,
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
  }

  // 默认返回空配置
  return {
    type: "",
    renderType: undefined,
  };
}

export const fieldList: Field[] = getFields();
