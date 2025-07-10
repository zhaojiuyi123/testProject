<template>
    <div
      class="drop-zone"
      @dragenter.prevent="handleDragEnter"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop.prevent="handleDrop"
      :class="{ 'drag-over': isDragOver }"
    >
      <slot></slot>
      <div v-if="isDragOver" class="drop-mask">
        <div class="drop-hint">释放以放置</div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    acceptedTypes: {
      type: Array,
      default: () => ['text/plain']
    }
  });
  
  const emit = defineEmits(['drop']);
  
  const isDragOver = ref(false);
  const dragCounter = ref(0);
  
  const handleDragEnter = (e) => {
    dragCounter.value++;
    updateDragState(e);
    e.preventDefault();
  };
  
  const handleDragOver = (e) => {
    updateDragState(e);
    e.preventDefault();
  };
  
  const handleDragLeave = (e) => {
    dragCounter.value--;
    if (dragCounter.value <= 0) {
      isDragOver.value = false;
      dragCounter.value = 0;
    }
  };
  
  const handleDrop = (e) => {
    dragCounter.value = 0;
    isDragOver.value = false;
    
    if (!hasAcceptedType(e) && e.dataTransfer.files.length === 0) {
      return;
    }
  
    const dropData = {};
    props.acceptedTypes.forEach(type => {
      if (e.dataTransfer.types.includes(type)) {
        dropData[type] = e.dataTransfer.getData(type);
      }
    });
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      dropData.files = Array.from(e.dataTransfer.files);
    }
    
    emit('drop', {
      event: e,
      data: dropData,
      nativeEvent: e
    });
  };
  
  const hasAcceptedType = (e) => {
    return props.acceptedTypes.some(type => 
      Array.from(e.dataTransfer.types).includes(type)
    );
  };
  
  const updateDragState = (e) => {
    const accepted = hasAcceptedType(e);
    isDragOver.value = accepted;
    e.dataTransfer.dropEffect = accepted ? 'copy' : 'none';
    
    // 强制设置光标样式
    // if (accepted) {
    //   e.target.style.cursor = 'copy';
    // } else {
    //   e.target.style.cursor = 'no-drop';
    // }
  };
  </script>
  
  <style scoped>
  .drop-zone {
    position: relative;
    min-height: 100px;
  }
  
  .drag-over {
    position: relative;
  }
  
  .drop-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 123, 255, 0.1);
    border: 2px dashed #007bff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    pointer-events: none;
  }
  
  .drop-hint {
    background-color: white;
    padding: 8px 16px;
    border-radius: 4px;
    color: #007bff;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* 设置拖放区域默认光标 */
  .drop-mask {
    cursor: default;
  }
  </style>