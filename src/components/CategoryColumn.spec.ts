import { mount } from "@vue/test-utils"
import { expect, it } from "vitest"
import CategoryColumn from "./CategoryColumn.vue"

const TEST_CATEGORY = 'javascript'

const wrapper = mount(CategoryColumn, { props: { category: TEST_CATEGORY }})

it("Supplied subreddit name is applied to title of column", async () => {
  const titleDiv = wrapper.find(".category-column--header__name")
  expect(titleDiv.text()).toBe(TEST_CATEGORY)
})

it("Close button press triggers close emit", async () => {
  const closeButton = wrapper.find(".category-column--header-button__close")
  await closeButton.trigger("click")
  expect(wrapper.emitted()).toHaveProperty("remove-column")
})

