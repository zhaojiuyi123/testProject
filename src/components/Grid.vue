<script setup lang="ts">
import { reactive, ref } from "vue";
import { GridItem, GridLayout } from "grid-layout-plus";
const isGrid = ref(false);
const layout = reactive([
  { x: 0, y: 0, w: 2, h: 2, i: "0", static: true },
  { x: 2, y: 0, w: 2, h: 4, i: "1", static: true },
  { x: 4, y: 0, w: 2, h: 5, i: "2", static: true },
  { x: 6, y: 0, w: 2, h: 3, i: "3", static: true },
  { x: 8, y: 0, w: 2, h: 3, i: "4", static: true },
  { x: 10, y: 0, w: 2, h: 3, i: "5", static: true },
  { x: 0, y: 1, w: 2, h: 5, i: "6", static: true },
  { x: 2, y: 5, w: 2, h: 5, i: "7", static: true },
  { x: 4, y: 5, w: 2, h: 5, i: "8", static: true },
  { x: 6, y: 3, w: 2, h: 4, i: "9", static: true },
  { x: 8, y: 4, w: 2, h: 4, i: "10", static: true },
  { x: 10, y: 4, w: 2, h: 4, i: "11", static: true },
  { x: 0, y: 10, w: 2, h: 5, i: "12", static: true },
  { x: 2, y: 10, w: 2, h: 5, i: "13", static: true },
  { x: 4, y: 8, w: 2, h: 4, i: "14", static: true },
  { x: 6, y: 8, w: 2, h: 4, i: "15", static: true },
  { x: 8, y: 10, w: 2, h: 5, i: "16", static: true },
  { x: 10, y: 4, w: 2, h: 2, i: "17", static: true },
  { x: 0, y: 9, w: 2, h: 3, i: "18", static: true },
  { x: 2, y: 6, w: 2, h: 2, i: "19", static: true },
]);
</script>

<template>
    <label for="checkbox">
        <input id="checkbox" type="checkbox" v-model="isGrid">
        123213213
    </label>
  <GridLayout
    v-model:layout="layout"
    :row-height="30"
    :prevent-collision="true"
    :margin="[1, 1]"
  >
    <GridItem
      v-for="item in layout"
      :x="item.x"
      :y="item.y"
      :w="item.w"
      :h="item.h"
      :i="item.i"
      :key="item.i"
      :static="false"
      @move="(...args) => {
        item.x = args[1]
        item.y= args[2]
      }"
    >
      {{ item.i }}
    </GridItem>
  </GridLayout>
</template>

<style scoped>
.vgl-layout {
  background-color: #eee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}
</style>
