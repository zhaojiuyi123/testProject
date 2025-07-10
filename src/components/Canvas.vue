<script setup lang="ts">
import draggable from "vuedraggable";
import { ref, reactive } from "vue";
/*
draggable 对CSS样式没有什么要求万物皆可拖拽
:list="state.list"         //需要绑定的数组
ghost-class="ghost"        //被替换元素的样式
chosen-class="chosenClass" //选中元素的样式
animation="300"            //动画效果
@start="onStart"           //拖拽开始的事件
@end="onEnd"               //拖拽结束的事件
*/
const state = reactive({
  //需要拖拽的数据，拖拽后数据的顺序也会变化
  list: [
    { name: "www.itxst.com", id: 0, itemKey: 1 },
    { name: "www.baidu.com", id: 1, itemKey: 2 },
    { name: "www.google.com", id: 2, itemKey: 3 },
  ],
});
const draggedItem = ref(null)
//拖拽开始的事件
const onStart = (e) => {
  draggedItem.value = e.item.__draggable_context.element
  console.log("开始拖拽");
};

//拖拽结束的事件
const onEnd = () => {
  console.log("结束拖拽");
};

const onDrop = (e) => {
  e.preventDefault()
  console.log('接收到:', draggedItem.value)
  // 处理放置逻辑
}
</script>
<template>
  <div style="width: 100vw; height: 100vh;position: relative;">
    <div 
      @dragover.prevent 
      @drop="onDrop"
      class="drop-zone"
    >
      放置区域
    </div>
    <div style="position: absolute;top: 10px;left:10px;padding: 4px;border-radius: 4px; background-color: aliceblue;">
      <draggable
      :sort="false"
        :list="state.list"
        ghost-class="ghost"
        chosen-class="chosenClass"
        animation="300"
        @start="onStart"
        @end="onEnd"
        itemKey="itemKey"
      >
        <template #item="{ element }">
          <div class="item">
            {{ element.name }}
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>
<style scoped>
.drop-zone{
  height: 100%;
  text-align: center;
  line-height: 100vh;
}
.drop-zone:-moz-drag-over {
  background-color: azure;
}
</style>
