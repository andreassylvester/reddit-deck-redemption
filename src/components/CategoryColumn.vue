<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import CategoryList from './CategoryList.vue'
import { getPosts } from '@/api'
import { PostList } from '@/types/PostList'
import SadRedditImage from "@svg/sad-reddit.svg?component"

const props = defineProps<{
  category: string
}>()

const afterHistory = ref<string[]>([])

const backQueue = ref<number>(0)
const forwardQueue = ref<number>(0)

const categoryField = ref<HTMLDivElement | undefined>()
const category = ref<string>(props.category)
const subredditNotFound = ref(false)
const loading = ref(false)
const posts = ref<PostList | undefined>()
const after = ref<string | undefined>()

const emit = defineEmits<{
  (e: "remove-column"): void
  (e: "update-category", category: string): void
}>()

onMounted(() => {
  if (category.value === "") {
    categoryField.value?.focus()
  }
})

watch(() => [props.category, after.value], () => {
  if (props.category.length <= 3) {
    return
  }

  subredditNotFound.value = false
  loading.value = true
  getPosts(props.category.replace(" ", "-"), after.value).then((p: PostList) => {
    posts.value = p
  }).catch((error) => {
    // TODO: actually check what type of error, not just assume it's an non-existant subreddit
    subredditNotFound.value = true
    categoryField.value?.focus()
  }).finally(() => {
    loading.value = false
    if (backQueue.value) {
      backQueue.value--
      back()
    } else if (forwardQueue.value) {
      forwardQueue.value--
      forward()
    }
  })
}, { immediate: true })

const back = () => {
  if (loading.value) {
    if (forwardQueue.value > 0) {
      forwardQueue.value--
    } else if (afterHistory.value.length - backQueue.value > 0) {
      backQueue.value++
    }
    return
  }

  afterHistory.value.splice(-1, 1)
  after.value = afterHistory.value.slice(-1)[0]
}

const forward = () => {
  if (loading.value) {
    if (backQueue.value > 0) {
      backQueue.value--
    } else {
      forwardQueue.value++
    }
    return
  }

  if (posts.value?.data.after) {
    after.value = posts.value.data.after
    afterHistory.value.push(posts.value.data.after)
  } else if (forwardQueue.value > 0) {
    // User has queued up more page loads than available, reset the queue
    forwardQueue.value = 0;
  }
}

const blur = (e: Event) => {
  const input = e.currentTarget as HTMLDivElement
  const value = input.innerHTML
  if (value === "") {
    if (!posts.value) {
      emit("remove-column")
    } else {
      input.innerText = props.category
    }
  } else {
    emit("update-category", value)
  }
}

const enterPress = (e: KeyboardEvent) => {
  (e.currentTarget as HTMLDivElement).blur()
}
</script>

<template>
  <div class="category-column">
    <div class="category-column--header">
      <div ref="categoryField" class="category-column--header__name" :title="category" contenteditable @blur="blur"
        @keydown.prevent.enter="enterPress">
        {{ category }}
      </div>

      <button class="category-column--header-button category-column--header-button__back"
        :disabled="afterHistory.length === 0" @click="back">
        <mdicon name="arrow-left-bold" width="20" />
      </button>

      <button class="category-column--header-button category-column--header-button__forward"
        :disabled="!posts?.data.after" @click="forward">
        <mdicon name="arrow-right-bold" width="20" />
      </button>

      <button class="category-column--header-button category-column--header-button__close"
        @click="$emit('remove-column')">
        <mdicon name="close-thick" width="20" />
      </button>
    </div>
    <div v-if="subredditNotFound" class="category-column--not-found">
      <SadRedditImage />
      Subreddit not found
    </div>
    <div v-else-if="loading" class="category-column--loader">
      <mdicon name="loading" width="40" height="40" />
      Loading page {{ afterHistory.length + 1 + forwardQueue - backQueue }}
    </div>
    <CategoryList v-else :posts="posts" />
  </div>
</template>

<style scoped lang="scss">
.category-column {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  &--header {
    display: flex;
    flex-direction: row;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #242424;
    padding-bottom: 4px;
    gap: 4px;

    &__name,
    &-button {
      background-color: rgb(38, 99, 127);
      border-radius: 4px;
    }

    &__name {
      display: flex;
      align-items: center;
      flex: 1;
      font-weight: 800;
      text-transform: uppercase;
      white-space: nowrap;
      overflow: hidden;
      outline: none;
      padding: 4px 8px;
    }

    &-button {
      cursor: pointer;
      transition: background-color 200ms ease-out, transform 100ms ease-out;
      padding: 4px 4px;
      margin: 0;
      color: rgb(225, 225, 255);

      &:disabled {
        cursor: default;
      }

      &:hover:not(:disabled) {
        background-color: rgb(49, 126, 162);
      }


      &__close:hover:not(:disabled) {
        background-color: rgb(162, 49, 49);
      }

      &:active {
        transform: translateY(2px);
      }

      &:disabled {
        .mdi {
          opacity: .25;
        }
      }
    }
  }

  &--not-found,
  &--loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;

    gap: 8px;
    font-size: 14px;
  }

  &--loader {

    .mdi {
      animation: rotating 500ms linear infinite;
    }
  }

  &--not-found {
    height: 100%;
    gap: 8px;

    svg {
      width: 100px;
      height: 100px;
    }
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>