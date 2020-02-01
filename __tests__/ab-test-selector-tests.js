import { serial as test } from 'ava'

import ABTestSelector from '../index'

const defaultConfig = {
  enabled: true,
  idIncludes: ['ALL'],
  idExcludes: [],
  groupIncludes: ['ALL'],
  groupExcludes: [],
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
    idIncludes: [1,2],
    idExcludes: [3,4],
    groupIncludes: [5,6],
    groupExcludes: [7,8],
  }
  t.deepEqual(abSelector.setConfiguration(testConfig), testConfig)
  t.deepEqual(abSelector.getConfiguration(), testConfig)
})

test('disable always returns A', (t) => {
  abSelector = new ABTestSelector({enabled: false})
  t.is(abSelector.getAB(1), 'A')
  t.is(abSelector.getAB(2), 'A')
  t.is(abSelector.getAB(3), 'A')
  t.is(abSelector.getAB(4), 'A')
})

test('default config, id ALL, no group provided', (t) => {
  t.is(abSelector.getAB(1), 'B')
  t.is(abSelector.getAB(3), 'A')
})

test('default config, id included, no group provided', (t) => {
  abSelector = new ABTestSelector({
    idIncludes: [1],
  })
  t.is(abSelector.getAB(1), 'B')
  t.is(abSelector.getAB(2), 'A')
})

test('default config, id included and excluded no group provided', (t) => {
  abSelector = new ABTestSelector({
    idIncludes: [1],
    idExcludes: [1],
  })
  t.is(abSelector.getAB(1), 'A')
  t.is(abSelector.getAB(2), 'A')
})

test('default config, id excluded no group provided', (t) => {
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

test('default config, id, group included', (t) => {
  abSelector = new ABTestSelector({
    groupIncludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'B')
  t.is(abSelector.getAB(1, 2), 'A')
})

test('default config, id, group excluded', (t) => {
  abSelector = new ABTestSelector({
    groupExcludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'B')
})

test('default config, id, group included and excluded', (t) => {
  abSelector = new ABTestSelector({
    groupIncludes: [1,2],
    groupExcludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'B')
})

test('full settings', (t) => {
  abSelector = new ABTestSelector({
    enabled: true,
    idIncludes: ['ALL'],
    idExcludes: [1],
    groupIncludes: ['ALL'],
    groupExcludes: [1],
  })
  t.is(abSelector.getAB(1, 1), 'A')
  t.is(abSelector.getAB(2, 1), 'A')
  t.is(abSelector.getAB(3, 1), 'A')
  t.is(abSelector.getAB(4, 1), 'A')
  t.is(abSelector.getAB(1, 2), 'A')
  t.is(abSelector.getAB(2, 2), 'B')
  t.is(abSelector.getAB(3, 2), 'A')
  t.is(abSelector.getAB(4, 2), 'A')
  t.is(abSelector.getAB(5, 2), 'B')
})

// 266,344 / second
// 4 microseconds each
test.skip('perf', () => {
  let cnt = 0
  let ab = 'a'
  for (let i=0;i<1000000000;i++) {
    ++cnt
    ab = abSelector.getAB(i, 2)
    if (Date.now() % 1000 == 0) console.log(cnt, ab)
  }
  console.log(cnt, ab)
})
