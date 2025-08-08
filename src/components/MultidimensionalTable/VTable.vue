<template>
  <div class="w-full h-full" ref="listTableRef"></div>
</template>
<script setup lang="ts">
import {
  ListTable,
  type ListTableConstructorOptions,
  register,
} from "@visactor/vtable";
import { onMounted, useTemplateRef } from "vue";
import {
  DateInputEditor,
  InputEditor,
  ListEditor,
  TextAreaEditor,
} from "@visactor/vtable-editors";
const listTableRef = useTemplateRef<HTMLElement>("listTableRef");
import data from "./data.json";

const input_editor = new InputEditor();
const date_input_editor = new DateInputEditor();
const list_editor = new ListEditor({ values: ["girl", "boy"] });
const textArea_editor = new TextAreaEditor({ readonly: false });
register.editor("input-editor", input_editor);
register.editor("date-input-editor", date_input_editor);
register.editor("list-editor", list_editor);
register.editor("textArea-editor", textArea_editor);
const columns = [
  {
    field: "Order ID",
    title: "Order ID",
    width: "auto",
  },
  {
    field: "Customer ID",
    title: "Customer ID",
    width: "auto",
  },
  {
    field: "Product Name",
    title: "Product Name",
    width: "auto",
    editor: "input-editor",
  },
  {
    field: "Category",
    title: "Category",
    width: "auto",
  },
  {
    field: "Sub-Category",
    title: "Sub-Category",
    width: "auto",
  },
  {
    field: "Region",
    title: "Region",
    width: "auto",
  },
  {
    field: "City",
    title: "City",
    width: "auto",
  },
  {
    field: "Order Date",
    title: "Order Date",
    width: "auto",
    editor: "date-input-editor",
  },
  {
    field: "Quantity",
    title: "Quantity",
    width: "auto",
    editor: "list-editor",
  },
  {
    field: "Sales",
    title: "Sales",
    width: "auto",
    editor: "textArea-editor",
  },
  {
    field: "Profit",
    title: "Profit",
    width: "auto",
  },
];

const options: ListTableConstructorOptions = {
  records: (data as any[]).slice(0, 100),
  columns,
  widthMode: "standard",
  groupConfig: {
    titleCheckbox: true,
    groupBy: ["Category", "Sub-Category", "Region"],
  },
  enableCheckboxCascade: true, // default is true
  dragOrder: {
    dragHeaderMode: "all",
  },
  rowSeriesNumber: {
    width: 50,
    format: () => {
      return "";
    },
    dragOrder: true,
    cellType: "checkbox",
  },
};
function init() {
  new ListTable(listTableRef.value!, options);
}

onMounted(init);
</script>
