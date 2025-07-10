<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex items-center w-[50%]">
      <span>行：</span>
      <NSelect multiple v-model:value="rows" :options="options" />
    </div>
    <div class="flex items-center w-[50%]">
      <span>列：</span>
      <NSelect multiple v-model:value="columns" :options="options" />
    </div>
    <div>
      <div>
        标记：
        <div class="flex" v-for="mark in markList">
          <span>{{ mark.label }}</span>
          <NSelect class="max-w-[50%]" :options="markOptions" v-model:value="mark.markType" />
          <div v-for="encode in mark.encodes">
            {{ encodeLabelMap[encode.encode] }}
            <NSelect :options="options" v-model:value="encode.field" class="min-w-[100px]" clearable/>
          </div>

        </div>
      </div>
    </div>
    <NButton @click="renderChart">render</NButton>
    <div ref="vChart" class="w-full h-full"></div>
  </div>
</template>
<script setup lang="ts">
import { NButton, NSelect } from "naive-ui";
import { fieldList, getChartConfig } from "./data";
import { computed, ref, unref, useTemplateRef, watch, type ShallowRef } from "vue";
import { useRender } from "./render";
import type { ChartConfig, ChartParam, Encode, EncodeType, Mark, MarkType } from "./interface";

const options = computed(() =>
  fieldList.map((field) => ({
    label: field.name,
    value: field.name,
    type: field.type,
  }))
);
const rows = ref<string[]>([]);
const columns = ref<string[]>([]);
const vChartRef = useTemplateRef<HTMLElement>("vChart");
const { render } = useRender(vChartRef as ShallowRef<HTMLElement>);

const markOptions: { label: string, value: string }[] = [
  {
    label: "自动",
    value: "auto",
  },
  {
    label: "条形",
    value: "bar",
  },
  {
    label: "线",
    value: "line",
  },
  {
    label: "圆",
    value: "circle",
  },
  {
    label: "文本",
    value: "text",
  },
  {
    label: "饼图",
    value: "pie",
  }
]

const encodeLabelMap: {
  [key: string]: string;
} = {
  'color': '颜色',
  'size': '大小',
  'shape': '形状',
  'detail': '详情',
  'tooltip': '提示',
}
const markList = ref<{ label: string, value: string, type: string, markType: MarkType, encodes: Encode[] }[]>([]);


const meaFields = computed(() => fieldList
  .filter(
    (field) =>
      field.type === "number" &&
      [...unref(rows), ...unref(columns)].includes(field.name)
  ))

watch(() => meaFields.value.length, () => {
  markList.value = meaFields.value.map((field) => ({
    label: field.name,
    value: field.name,
    type: field.type,
    markType: 'auto',
    encodes: [
      {
        encode: 'color',
        field: "",
        type: field.type,
      }
    ]
  }))
})

const renderChart = () => {
  const params = getParams()
  const result: ChartConfig = getChartConfig(params);
  console.log(result);

  render(result);
}

const getParams = (): ChartParam => {
  return {
    rows: unref(rows).map(field => {
      return {
        field,
        type: fieldList.find(f => f.name === field)?.type || 'string'
      }
    }),
    columns: unref(columns).map(field => {
      return {
        field,
        type: fieldList.find(f => f.name === field)?.type || 'string'
      }
    }),
    marks: markList.value.map(mark => {
      const markConfig: Mark = {
        field: mark.value,
        type: mark.type,
        markType: mark.markType,
        encodes: mark.encodes
      }
      return markConfig
    })
  }
}
</script>
