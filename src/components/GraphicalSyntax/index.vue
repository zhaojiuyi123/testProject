<template>
  <div class="flex flex-col gap-4 h-full">
    <div class="flex items-center w-[50%]">
      <span>行：</span
      ><NSelect multiple v-model:value="rows" :options="options" />
    </div>
    <div class="flex items-center w-[50%]">
      <span>列：</span
      ><NSelect multiple v-model:value="columns" :options="options" />
    </div>
    <div>
      <div>
        标记：
        <div v-for="mark in markOptions">
          <span>{{ mark.label }}</span>
          <NSelect />
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
import { computed, ref, unref, useTemplateRef, type ShallowRef } from "vue";
import { useRender } from "./render";
import type { ChartConfig } from "./interface";

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
const markOptions = computed(() => {
  return fieldList
    .filter(
      (field) =>
        field.type === "number" &&
        [...unref(rows), ...unref(columns)].includes(field.name)
    )
    .map((field) => ({
      label: field.name,
      value: field.name,
    }));
});

const renderChart = () => {
    const result: ChartConfig = getChartConfig();
    render(result);
}
</script>
