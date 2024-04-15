import { mount } from "@vue/test-utils"
import { expect, it } from "vitest"
import Column from "./Column.vue"

const wrapper = mount(Column)

it("Column component has draggable handles", async () => {
  const columnHandle = wrapper.find(".column--handle")
  expect(columnHandle.exists()).toBe(true)
})

it("Dragging Column handles triggers emit", async () => {
  const columnHandle = wrapper.find(".column--handle")
  await columnHandle.trigger("dragend")
  expect(wrapper.emitted()).toHaveProperty('update-width')
})