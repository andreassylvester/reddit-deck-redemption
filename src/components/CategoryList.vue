<script setup lang="ts">
import { PostList } from '@/types/PostList'
import CategoryItem from './CategoryItem.vue';

defineProps<{
  posts: PostList | undefined
}>()
</script>

<template>
  <div class="category-list">
    <CategoryItem v-for="post in posts?.data.children" :post="post" :key="post.data.id" />
  </div>
</template>

<style scoped lang="scss">
.category-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>