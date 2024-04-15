<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { v4 as uuid } from 'uuid'
import ColumnsWrapper from '@/components/ColumnsWrapper.vue'
import Column from '@/components/Column.vue'
import CategoryColumn from '@/components/CategoryColumn.vue'
import { ColumnData } from '@/types/ColumnData'

const columns = ref<ColumnData[]>([])

onMounted(() => {
  const savedState = localStorage.getItem("view-state")

  if (savedState) {
    columns.value = JSON.parse(savedState) as ColumnData[]
  } else {
    columns.value = [
      { id: uuid(), category: "javascript" },
      { id: uuid(), category: "photoshop" }
    ]
  }
})

const newColumn = () => {
  columns.value.push({
    id: uuid(),
    category: "",
  })
}

const updateCategory = (id: string, category: string) => {
  columns.value = columns.value?.map((c) => { return (c.id === id) ? { ...c, category } : c })
}

const updateWidth = (id: string, width: number) => {
  columns.value = columns.value?.map((c) => { return (c.id === id) ? { ...c, width } : c })
}

const removeColumn = (id: string) => {
  columns.value = columns.value?.filter((c) => c.id !== id)
} 

watch(
  () => columns.value,
  (newValue) => {
    localStorage.setItem("view-state", JSON.stringify(newValue))
  }
)
</script>

<template>
  <ColumnsWrapper>
    <Column
      v-for="column in columns"
      :width="column.width" 
      :key="column.id"
      @update-width="$width => updateWidth(column.id, $width)" 
    >
      <CategoryColumn
        :category="column.category"
        @update-category="$category => updateCategory(column.id, $category)" 
        @remove-column="removeColumn(column.id)"
      />
    </Column>
    <button type="button" class="add-column-button" @click="newColumn" title="Add column">
      <mdicon name="plus-circle" width="16" />
    </button>
  </ColumnsWrapper>
</template>

<style scoped lang="scss">
$add-button-color: white;

.add-column-button {
  background-color: rgba($add-button-color, .1);
  border-radius: 4px;
  cursor: pointer;
  height: 100%;
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 100ms ease-out;
  color: rgb(225,225,255);

  &:hover {
    background-color: rgba($add-button-color, .2);
  }
}
</style>
