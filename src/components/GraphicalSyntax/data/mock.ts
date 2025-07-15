import type { PivotChartConstructorOptions } from "@visactor/vtable";
import type { ChartConfig, ChartParam } from "../interface";
import { datasource } from "./datasource";

interface Field {
  name: string;
  type: string;
}

// 策略接口，增加优先级和匹配度
interface ChartStrategy {
  readonly priority: number; // 优先级，数字越大优先级越高
  canHandle(params: ChartParam): boolean;
  getMatchScore(params: ChartParam): number; // 匹配度评分，0-100
  createConfig(params: ChartParam): ChartConfig;
  readonly name: string; // 策略名称，便于调试和日志
}

// 抽象基类，提供默认实现
abstract class BaseChartStrategy implements ChartStrategy {
  abstract readonly priority: number;
  abstract readonly name: string;
  abstract canHandle(params: ChartParam): boolean;
  abstract createConfig(params: ChartParam): ChartConfig;

  getMatchScore(params: ChartParam): number {
    return this.canHandle(params) ? this.priority : 0;
  }
}

// 表格策略
class TableStrategy extends BaseChartStrategy {
  readonly priority = 90; // 高优先级
  readonly name = "TableStrategy";

  canHandle(params: ChartParam): boolean {
    const allFields = [...params.rows, ...params.columns];
    const totalFields = allFields.length;
    const rowsLength = params.rows.length;
    const columnsLength = params.columns.length;

    return (
      totalFields >= 1 && // 只要有字段就可以用表格显示
      (rowsLength === 0 || columnsLength === 0 || totalFields === 1)
    );
  }

  getMatchScore(params: ChartParam): number {
    if (!this.canHandle(params)) return 0;

    const allFields = [...params.rows, ...params.columns];
    const totalFields = allFields.length;
    const rowsLength = params.rows.length;
    const columnsLength = params.columns.length;

    // 根据不同情况给出不同的匹配度
    if (rowsLength === 0 || columnsLength === 0) {
      return this.priority + 10; // 最适合表格的场景
    }
    if (totalFields === 1 && allFields[0].type !== "number") {
      return this.priority + 5; // 单个非数值字段适合表格
    }
    return this.priority; // 基础匹配度
  }

  createConfig(params: ChartParam): ChartConfig {
    const allFields = [...params.rows, ...params.columns];
    return {
      type: "table",
      records: datasource,
      columns: allFields.map((field) => ({
        field: field.field,
        title: field.field,
        width: 150,
      })),
    };
  }
}

// 基础图表策略
class BasicChartStrategy extends BaseChartStrategy {
  readonly priority = 70;
  readonly name = "BasicChartStrategy";

  canHandle(params: ChartParam): boolean {
    return params.rows.length === 1 && params.columns.length === 1;
  }

  getMatchScore(params: ChartParam): number {
    if (!this.canHandle(params)) return 0;
    const allFields = [...params.rows, ...params.columns];
    const numericField = allFields.find((f) => f.type === "number");
    const stringField = allFields.find((f) => f.type === "string");

    // 有数值字段和字符串字段，且有标记时，图表是最佳选择
    if (numericField && stringField && params.marks.length > 0) {
      return this.priority + 20;
    }
    return this.priority;
  }

  createConfig(params: ChartParam): ChartConfig {
    const allFields = [...params.rows, ...params.columns];
    const numericField = allFields.find((f) => f.type === "number");
    const stringField = allFields.find((f) => f.type === "string");
    const seriesField = params.marks[0]?.encodes.find(
      (encode) => encode.encode === "color"
    )?.field;

    if (numericField && stringField && params.marks.length > 0) {
      const mark = params.marks[0];
      const chartType = mark.markType === "auto" ? "bar" : mark.markType;
      const valueMap = this.aggregateData(
        stringField.field,
        numericField.field,
        seriesField
      );

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

    return { type: "", renderType: undefined };
  }

  private aggregateData(
    dimName: string,
    meaName: string,
    seriesField?: string
  ) {
    const valueMap = {};
    datasource.forEach((item) => {
      const dim = item[dimName];
      const key = dim + (item[seriesField] || "");
      if (valueMap[key]) {
        valueMap[key] = {
          [dimName]: dim,
          [seriesField]: item[seriesField],
          [meaName]: valueMap[key][meaName] + (item[meaName] || 0),
        };
      } else {
        valueMap[key] = {
          [dimName]: dim,
          [seriesField]: item[seriesField],
          [meaName]: item[meaName] || 0,
        };
      }
    });
    return valueMap;
  }
}

// 指标卡策略 更精确的匹配条件
class IndicatorCardStrategy extends BaseChartStrategy {
  readonly priority = 80; 
  readonly name = "IndicatorCardStrategy";

  canHandle(params: ChartParam): boolean {
    const allFields = [...params.rows, ...params.columns];
    return allFields.length === 1 && allFields[0].type === "number";
  }

  getMatchScore(params: ChartParam): number {
    if (!this.canHandle(params)) return 0;

    const allFields = [...params.rows, ...params.columns];
    const field = allFields[0];

    // 只有单个数值字段时，指标卡是最佳选择
    if (allFields.length === 1 && field.type === "number") {
      return this.priority + 150; // 给予更高的匹配度
    }
    return this.priority;
  }

  createConfig(params: ChartParam): ChartConfig {
    const field = [...params.rows, ...params.columns][0];
    const fieldName = field.field;
    return {
      type: "indicatorCard",
      data: datasource.reduce((a: any, b: any) => a + (b[fieldName] || 0), 0),
    };
  }
}

// 分面图策略
class FacetedPlotStrategy extends BaseChartStrategy {
  readonly priority = 60;
  readonly name = "FacetedPlotStrategy";

  canHandle(params: ChartParam): boolean {
    const allFields = [...params.rows, ...params.columns];
    return allFields.length > 2;
  }

  getMatchScore(params: ChartParam): number {
    if (!this.canHandle(params)) return 0;

    const allFields = [...params.rows, ...params.columns];
    // 字段越多，分面图的匹配度越高
    return this.priority + (allFields.length - 2) * 5;
  }

  createConfig(params: ChartParam): ChartConfig {
    const rows = params.rows.filter((field) => field.type !== "number");
    const columns = params.columns.filter((field) => field.type !== "number");
    const masks = params.marks;
    const series = rows.length > columns.length ? rows.pop() : columns.pop();

    const indicators = masks.map((field) => ({
      indicatorKey: field.field,
      width: "auto",
      cellType: "chart",
      title: field.field,
      chartModule: "vchart",
      chartSpec: {
        color: ["#669FF0", "#7166F0", "#FFB6C1"],
        type: field.markType === "auto" ? "bar" : field.markType,
        data: [{ id: "data" }],
        xField: series?.field,
        yField: field.field,
        seriesField:
          field.encodes.find((i) => i.encode === "color")?.field || undefined,
      },
      style: { padding: 1 },
    }));

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
      theme: this.getThemeConfig(),
    };
  }

  private getThemeConfig() {
    return {
      bodyStyle: { borderColor: "gray", borderLineWidth: [1, 0, 0, 1] },
      headerStyle: { borderColor: "gray", borderLineWidth: [0, 0, 1, 1] },
      rowHeaderStyle: { borderColor: "gray", borderLineWidth: [1, 1, 0, 0] },
      cornerHeaderStyle: { borderColor: "gray", borderLineWidth: [0, 1, 1, 0] },
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
      rightFrozenStyle: { borderColor: "gray", borderLineWidth: [1, 0, 1, 1] },
      bottomFrozenStyle: { borderColor: "gray", borderLineWidth: [1, 1, 0, 1] },
      selectionStyle: { cellBgColor: "", cellBorderColor: "" },
      frameStyle: { borderLineWidth: 0 },
    };
  }
}

// 策略选择器接口
interface StrategySelector {
  selectStrategy(
    strategies: ChartStrategy[],
    params: ChartParam
  ): ChartStrategy;
}

// 策略选择器：基于匹配度选择
class ScoreBasedSelector implements StrategySelector {
  selectStrategy(
    strategies: ChartStrategy[],
    params: ChartParam
  ): ChartStrategy {
    let bestStrategy = strategies[strategies.length - 1]; // 默认策略
    let bestScore = 0;

    for (const strategy of strategies) {
      const score = strategy.getMatchScore(params);
      if (score > bestScore) {
        bestScore = score;
        bestStrategy = strategy;
      }
    }

    return bestStrategy;
  }
}

// 策略工厂
class ChartStrategyFactory {
  private static strategies: ChartStrategy[] = [
    new TableStrategy(),
    new IndicatorCardStrategy(),
    new BasicChartStrategy(),
    new FacetedPlotStrategy(),
  ];

  private static selector: StrategySelector = new ScoreBasedSelector();

  static getStrategy(params: ChartParam): ChartStrategy {
    return this.selector.selectStrategy(this.strategies, params);
  }

  // 设置策略选择器
  static setSelector(selector: StrategySelector): void {
    this.selector = selector;
  }

  // 注册新策略
  static registerStrategy(strategy: ChartStrategy, index?: number): void {
    if (index !== undefined) {
      this.strategies.splice(index, 0, strategy);
    } else {
      // 按优先级插入
      const insertIndex = this.strategies.findIndex(
        (s) => s.priority < strategy.priority
      );
      if (insertIndex === -1) {
        this.strategies.splice(-1, 0, strategy); // 插入到默认策略之前
      } else {
        this.strategies.splice(insertIndex, 0, strategy);
      }
    }
  }

  // 获取所有可用策略（调试用）
  static getAvailableStrategies(
    params: ChartParam
  ): Array<{ name: string; score: number }> {
    return this.strategies
      .map((strategy) => ({
        name: strategy.name,
        score: strategy.getMatchScore(params),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }
}

// 图表配置上下文
class ChartConfigContext {
  private strategy: ChartStrategy;

  constructor(params: ChartParam) {
    this.strategy = ChartStrategyFactory.getStrategy(params);
  }

  generateConfig(params: ChartParam): ChartConfig {
    return this.strategy.createConfig(params);
  }

  getSelectedStrategy(): string {
    return this.strategy.name;
  }
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

// 重构后的主函数
export function getChartConfig(params: ChartParam): ChartConfig {
  const context = new ChartConfigContext(params);
  return context.generateConfig(params);
}

// 工具函数：获取可用策略列表
export function getAvailableStrategies(
  params: ChartParam
): Array<{ name: string; score: number }> {
  return ChartStrategyFactory.getAvailableStrategies(params);
}

export const fieldList: Field[] = getFields();
