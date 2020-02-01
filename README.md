# AB test selector

Consistently assigns ids to A or B group for A/B testing.
By convention, A should be old treatment, B should be the new treatment for simplicity and consistency. Not required though.
By default all users are included in the AB test and selected for B by (hash(id) % 2 ? 'B' : 'A')

## Requirements

Node 10+

## Performance

On 2019 HP x360 Spectre with Ubuntu 18.04.3 64 bit
Intel® Core™ i7-8565U CPU @ 1.80GHz × 8

~266K AB selections / second
~4 microseconds each

## Getting started

```console
npm i -S ab-test-selector
```

# Usage

## Configuration Options

Configuration allows excluding particular ids by passing an array of ids to exclude in idExcludes.
Only specific ids can be included in the A/B test by passing an array of ids to include in idIncludes.
Group/organization/etc. ids can be included/excluded with groupIncludes and groupExcludes repectively.
The idIncludes and groupIncludes are both set to ['ALL'] by default.

Configuration option with defaults that can be passed to the constructor:
```javascript
{
  enabled: true,
  idIncludes: ['ALL'],
  idExcludes: [],
  groupIncludes: ['ALL'],
  groupExcludes: [],
}
```
To change only some configuration parameters, pass only those configuration arguments to the constructor.

There are getEnabled() and setEnabled(boolean) methods.
There are getConfiguration() and setConfiguration(config) methods that allow setting all configuration.


## AB on user ID, for all users

```javascript
import ABTestSelector from 'ab-test-selector'

const ab = new ABTestSelector()

if (ab.getAB(userId) == 'B') {
  computeOrShowTreatmentB() // change this to call your application code
} else {
  computeOrShowTreatmentA() // change this to call your application code
}
```

## AB only some user IDs, others all get A

```javascript
import ABTestSelector from 'ab-test-selector'

const ab = new ABTestSelector({
  idIncludes: [7,12]
})

if (ab.getAB(userId) == 'B') {
  computeOrShowTreatmentB() // change this to call your application code
} else {
  computeOrShowTreatmentA() // change this to call your application code
}
```

## AB on user ID, exclude some groups/orgs/etc. which all get A
```javascript
import ABTestSelector from 'ab-test-selector'

const ab = new ABTestSelector({
  groupExcludes: [3,5] // exclude some group or org IDs, can be any scalar, like string or UUID, etc.
})

if (ab.getAB(userId, groupId) == 'B') {
  computeOrShowTreatmentB() // change this to call your application code
} else {
  computeOrShowTreatmentA() // change this to call your application code
}
```

## AB on user ID, include only some groups/orgs/etc., others all get A
```javascript
import ABTestSelector from 'ab-test-selector'

const ab = new ABTestSelector({
  groupIncludes: [3,5] // exclude some group or org IDs, can be any scalar, like string or UUID, etc.
})

if (ab.getAB(userId, groupId) == 'B') {
  computeOrShowTreatmentB() // change this to call your application code
} else {
  computeOrShowTreatmentA() // change this to call your application code
}
```

# More information

See the tests and implementation files.
