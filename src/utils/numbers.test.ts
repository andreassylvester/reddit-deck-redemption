import { expect, test } from 'vitest'
import { formatPossiblyLargeNumber } from './numbers'

test('Number 10 000 formats to 10k', () => {
  expect(formatPossiblyLargeNumber(10000)).toBe("10k")
})

test('Number 20 500 formats to 20.5k', () => {
  expect(formatPossiblyLargeNumber(20500)).toBe("20.5k")
})

test('Numbers below 1 000 formats to not be reformatted', () => {
  expect(formatPossiblyLargeNumber(999)).to.not.contain("k")
})
