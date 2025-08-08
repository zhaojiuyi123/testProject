<template>
  <div class="w-full h-full">
    <NRadioGroup v-model:value="tableType">
      <NRadioButton value="vxe-table" >VxeTable</NRadioButton>
      <NRadioButton value="v-table" >VTable</NRadioButton>
    </NRadioGroup>
    <VxeTable v-if="tableType === 'v-table'" />
    <VTable v-if="tableType === 'vxe-table'" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import VTable from "./VTable.vue";
import VxeTable from "./VxeTable.vue";
import { NRadioGroup, NRadioButton } from "naive-ui";

const tableType = ref("vxe-table");
</script>
