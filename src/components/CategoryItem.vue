<script setup lang="ts">
import { computed, ref } from 'vue'
import DOMPurify from 'dompurify'

import { Post } from '@/types/Post'
import { dateStringFromTimestamp } from '@/utils/date'
import { formatPossiblyLargeNumber } from '@/utils/numbers'

const props = defineProps<{
  post: Post
}>()

const open = ref<boolean>(false)

const thumbnail = computed(() => {
  const omitThumbUrls = ["self", "spoiler", "nsfw"]
  if (
    props.post.data.thumbnail.length > 0 && 
    omitThumbUrls.indexOf(props.post.data.thumbnail) === -1
  ) {
    return props.post.data.thumbnail
  }
})

const stopProp = (e: MouseEvent) => e.stopPropagation();
const dateString = computed(() => dateStringFromTimestamp(props.post.data.created * 1000))

const htmlContent = computed(() => {
  var txt = document.createElement("textarea");
  txt.innerHTML = DOMPurify.sanitize(props.post.data.selftext_html);
  return txt.value;
})
</script>

<template>
  <div class="category-item" :class="open && 'open'" @click="open = !open">
    <div class="category-item--background" />
    <div class="category-item--content">

      <div class="category-item--top">
        <div class="category-item--thumbnail" v-if="thumbnail">
          <img :src="thumbnail" width="70" />
        </div>
        <div class="category-item--top-texts">
          <div class="category-item--title">{{ post.data.title }}</div>
          <div v-if="open" class="category-item--fulltext">
            <div v-html="htmlContent" />
            <div>
              <a :href="`https://www.reddit.com/${post.data.permalink}`" nofollow noreferer target="_blank">
                Read post
                <mdicon name="open-in-new" width="14" height="14" />
              </a>

            </div>
          </div>
        </div>
      </div>
      <div class="category-item--meta">
        <div class="category-item--datetime" :title="dateString">
          {{ dateString }}
        </div>
        <div class="category-item--score">
          <mdicon :name="`arrow-${post.data.score >= 0 ? 'up' : 'down'}-bold`" width="14" height="14" /> 
          {{ formatPossiblyLargeNumber(post.data.score) }}
        </div>
        <div class="category-item--num_comments">
          <mdicon name="comment" width="14" height="14" /> {{ formatPossiblyLargeNumber(post.data.num_comments) }}
        </div>
        <div class="category-item--author">
          <a :href="`https://www.reddit.com/user/${post.data.author}`" nofollow noreferer target="_blank"
            @click="stopProp">
            <mdicon name="account" width="14" height="14" />{{ post.data.author }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$background-color: white;

.category-item {
  border-radius: 4px;
  padding: 10px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover:not(.open) {
    .category-item--background {
      opacity: .2;
    }
  }

  &--content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &--title {
    font-weight: 600;
  }

  &--author {
    opacity: .5;

    a {
      color: white;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  &--background {
    background: $background-color;
    opacity: .1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity ease-out 200ms;
    pointer-events: none;
  }

  &--thumbnail {
    width: 70px;

    img {
      display: block;
      border-radius: 4px;
    }
  }

  &--datetime {
    flex: 1;
    opacity: .5;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &--top {
    display: flex;
    flex-direction: row;
    flex: 1;
    gap: 8px;
    justify-content: space-between;

    &-texts {
      flex: 1;
    }
  }

  &--meta {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 8px;
    font-size: 12px;
  }

  &--fulltext {
    display: flex;
    flex-direction: column;
    word-break: break-word;
    border-top: 1px solid rgba(white, .2);
    padding-top: 4px;
    margin-top: 4px;

    /* pre tags, if left alone, breaks break-word (ironically) */
    &:deep(pre) {
      white-space: normal;
    }

      &:deep(code) {
      font-size: 12px;
    }
  }

  &.open {
    cursor: inherit;
  }
}</style>