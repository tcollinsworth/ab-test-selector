import ava from 'ava'

import { ABTestSelector } from '../index.mjs'

const test = ava.serial

const defaultConfig = {
  enabled: true,
  idBonly: [],
  groupBonly: [],
  idExcludes: [],
  idIncludes: ['ALL'],
  groupExcludes: [],
  groupIncludes: ['ALL'],
}

let abSelector

test.beforeEach(() => {
  abSelector = new ABTestSelector()
})

test('enable/disable', (t) => {
  t.truthy(abSelector.setEnabled(true))
  t.truthy(abSelector.getEnabled())
  t.falsy(abSelector.setEnabled(false))
  t.falsy(abSelector.getEnabled())
  t.truthy(abSelector.setEnabled(true))
  t.truthy(abSelector.getEnabled())
})

test('configuration', (t) => {
  t.deepEqual(abSelector.getConfiguration(), defaultConfig)
  const testConfig = {
    enabled: false,
    idBonly: [0, 1],
    groupBonly: [1, 2],
    idExcludes: [2, 3],
    idIncludes: [3, 4],
    groupExcludes: [4, 5],
    groupIncludes: [5, 6],
  }
  t.deepEqual(abSelector.setConfiguration(testConfig), testConfig)
  t.deepEqual(abSelector.getConfiguration(), testConfig)
})

test('disable always returns A', (t) => {
  abSelector = new ABTestSelector({ enabled: false })
  t.is(abSelector.getAB(1), 'A')
  t.is(abSelector.getAB(2), 'A')
  t.is(abSelector.getAB(3), 'A')
  t.is(abSelector.getAB(4), 'A')
})

test('default config, id ALL, no group provided', (t) => {
  t.is(abSelector.getAB(1), 'B')
  t.is(abSelector.getAB(3), 'A')
})

test('idIncludes, no group provided', (t) => {
  abSelector = new ABTestSelector({
    idIncludes: [1],
  })
  t.is(abSelector.getAB(1), 'B')
  t.is(abSelector.getAB(2), 'A')
})

test('idIncludes and idExcludes no group provided', (t) => {
  abSelector = new ABTestSelector({
    idIncludes: [1],
    idExcludes: [1],
  })
  t.is(abSelector.getAB(1), 'A')
  t.is(abSelector.getAB(2), 'A')
})

test('idIncludes no group provided', (t) => {
  abSelector = new ABTestSelector({
    idExcludes: [1],
  })
  t.is(abSelector.getAB(1), 'A')
  t.is(abSelector.getAB(2), 'B')
})

test('default config, id, group ALL', (t) => {
  t.is(abSelector.getAB(1, 1), 'B')
  t.is(abSelector.getAB(3, 2), 'A')
})

test('groupIncludes, id and group provided', (t) => {
  abSelector = new ABTestSelector({
    groupIncludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'B')
  t.is(abSelector.getAB(1, 2), 'A')
})

test('groupExcludes, id and group provided', (t) => {
  abSelector = new ABTestSelector({
    groupExcludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'B')
})

test('groupIncludes and groupExcludes, id and group provided', (t) => {
  abSelector = new ABTestSelector({
    groupIncludes: [1, 2],
    groupExcludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'B')
})

test('full settings', (t) => {
  abSelector = new ABTestSelector({
    // precedence order
    enabled: true,
    idBonly: [2],
    groupBonly: [3],
    idExcludes: [1],
    idIncludes: ['ALL'],
    groupExcludes: [1],
    groupIncludes: ['ALL'],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(2, 1), 'B')
  t.is(abSelector.getAB(3, 1), 'A')
  t.is(abSelector.getAB(4, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'A')
  t.is(abSelector.getAB(2, 2), 'B')
  t.is(abSelector.getAB(3, 2), 'A')
  t.is(abSelector.getAB(4, 2), 'A')
  t.is(abSelector.getAB(5, 2), 'B')
  t.is(abSelector.getAB(1, 3), 'B')
})

// ~275,037 / second
// ~3.6 microseconds each
test.skip('perf', () => {
  let cnt = 0
  let ab = 'a'
  for (let i = 0; i < 1000000000; i++) {
    ++cnt
    ab = abSelector.getAB(i, 2)
    // eslint-disable-next-line no-console
    if (Date.now() % 1000 === 0) console.log(cnt, ab)
  }
  // eslint-disable-next-line no-console
  console.log(cnt, ab)
})
