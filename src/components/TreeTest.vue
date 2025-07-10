<template>
  <NSpace vertical>
    <NTree
      block-line
      checkable
      draggable
      :data="data"
      :checked-keys="checkedKeys"
      :on-load="handleLoad"
      :expanded-keys="expandedKeys"
      :check-strategy="checkStrategy"
      :allow-checking-not-loaded="cascade"
      :cascade="cascade"
      expand-on-click
      @drop="handleDrop"
      @update:checked-keys="handleCheckedKeysChange"
      @update:expanded-keys="handleExpandedKeysChange"
    />
    {{ JSON.stringify(checkedKeys) }}
  </NSpace>
</template>

<script lang="ts">
import { NSpace, NTree, type TreeDropInfo, type TreeOption } from "naive-ui";
import { defineComponent, ref } from "vue";

function createData() {
  return [
    {
      label: nextLabel(),
      key: 1,
      isLeaf: false,
    },
    {
      label: nextLabel(),
      key: 2,
      isLeaf: false,
    },
  ];
}

function nextLabel(currentLabel?: string): string {
  if (!currentLabel) return "Out of Tao, One is born";
  if (currentLabel === "Out of Tao, One is born") return "Out of One, Two";
  if (currentLabel === "Out of One, Two") return "Out of Two, Three";
  if (currentLabel === "Out of Two, Three") {
    return "Out of Three, the created universe";
  }
  if (currentLabel === "Out of Three, the created universe") {
    return "Out of Tao, One is born";
  }
  return "";
}

function findSiblingsAndIndex(
  node: TreeOption,
  nodes?: TreeOption[]
): [TreeOption[], number] | [null, null] {
  if (!nodes) return [null, null];
  for (let i = 0; i < nodes.length; ++i) {
    const siblingNode = nodes[i];
    if (siblingNode.key === node.key) return [nodes, i];
    const [siblings, index] = findSiblingsAndIndex(node, siblingNode.children);
    if (siblings && index !== null) return [siblings, index];
  }
  return [null, null];
}
let index = 0;
export default defineComponent({
  components: { NSpace, NTree },
  setup() {
    const expandedKeysRef = ref<string[]>([]);
    const checkedKeysRef = ref<string[]>([]);
    const dataRef = ref(createData());

    return {
      checkStrategy: ref<"all" | "parent" | "child">("all"),
      cascade: ref(true),
      data: dataRef,
      expandedKeys: expandedKeysRef,
      checkedKeys: checkedKeysRef,
      handleExpandedKeysChange(expandedKeys: string[]) {
        expandedKeysRef.value = expandedKeys;
      },
      handleCheckedKeysChange(checkedKeys: string[]) {
        checkedKeysRef.value = checkedKeys;
      },
      handleDrop({ node, dragNode, dropPosition }: TreeDropInfo) {
        const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
          dragNode,
          dataRef.value
        );
        if (dragNodeSiblings === null || dragNodeIndex === null) return;
        dragNodeSiblings.splice(dragNodeIndex, 1);
        if (dropPosition === "inside") {
          if (node.children) {
            node.children.unshift(dragNode);
          } else {
            node.children = [dragNode];
          }
        } else if (dropPosition === "before") {
          const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            dataRef.value
          );
          if (nodeSiblings === null || nodeIndex === null) return;
          nodeSiblings.splice(nodeIndex, 0, dragNode);
        } else if (dropPosition === "after") {
          const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
            node,
            dataRef.value
          );
          if (nodeSiblings === null || nodeIndex === null) return;
          nodeSiblings.splice(nodeIndex + 1, 0, dragNode);
        }

        dataRef.value = Array.from(dataRef.value);
      },
      handleLoad(node: TreeOption) {
        return new Promise<void>((resolve, reject) => {
          console.log(index);
          
          if (index === 0) {
            setTimeout(() => {
              node.children = [
                {
                  label: nextLabel(node.label),
                  key: node.key + nextLabel(node.label),
                  isLeaf: false,
                },
              ];
              resolve();
              index++;
            }, 1000);
          } else {
            console.error('1233213123');
            reject();
          }
        });
      },
    };
  },
});
</script>
