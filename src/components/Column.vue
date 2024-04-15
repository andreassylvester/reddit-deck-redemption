<script setup lang="ts">
import { ref } from "vue"

const props = defineProps<{
  width?: number | undefined
}>()

const emit = defineEmits<{
  (e: "update-width", width: number): void
}>()

const width = ref(props.width ?? 300)

const columnRef = ref<HTMLDivElement | undefined>()

const drag = (event: DragEvent) => {
  if (columnRef.value && event.clientX !== 0 && event.clientY !== 0) {
    const { x } = columnRef.value?.getBoundingClientRect()
    const newWidth = Math.round(event.clientX - x)
    width.value = newWidth
  }
}

const dragEnd = () => {
  emit("update-width", width.value)
}
</script>

<template>
  <div ref="columnRef" class=" column">
    <div class="column--content">
      <slot />
    </div>
    <div class="column--handle-wrapper">
      <div class="column--handle" draggable="true" @drag="drag" @dragend="dragEnd"/>
    </div>

  </div>
</template>

<style scoped lang="scss">
$column-handle-width: 4px;

.column {
  min-width: 200px;
  max-width: 600px;

  width: calc(v-bind(width) * 1px);
  display: flex;

  &--content {
    flex: 1;
    overflow-y: auto;
  }

  &--handle-wrapper {
    width: $column-handle-width;
    position: relative;
  }

  &--handle {
    cursor: col-resize;
    width: $column-handle-width;
    height: 100%;
    top: 0;
    position: absolute;
  }
}
</style>