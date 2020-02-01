# AB test selector

Consistently assigns ids/keys to A or B group for A/B testing. An id may be user, session, request, etc.

Groups ids/keys can be utilized for A/B selection in multi-tenant system where testing to a subset of tenants is desired. Groups are also useful for monotonically increasing the A/B test treatment population size, i.e., start with a small subset to validate, then increase over time.

By convention, A should be old treatment, B should be the new treatment for simplicity and consistency. Not required though.

By default all users are included in the AB test and selected for B by (hash(id) % 2 ? 'B' : 'A')

"Data Trumps Intuition" "significant learning and return-on-investment (ROI) are seen when development teams listen to their customers, not to the Highest Paid Person’s Opinion (HiPPO)​", [ACM video presentation](http://videolectures.net/kdd07_kohavi_pctce/) (Flash) referencing Amazon and Microsoft controlled experiments - startling results that were very surprising.​ Political and economic environment can affect results, necessary to use A/B testing to determine causality. Amazon observed approximately a 1% drop in revenue per 100mS increase in page load times.

## Requirements

Node 10+

## Performance

On 2019 HP x360 Spectre with Ubuntu 18.04.3 64 bit  
Intel® Core™ i7-8565U CPU @ 1.80GHz × 8

~275K AB selections / second  
~3.6 microseconds each selection

## Getting started

```console
npm i -S ab-test-selector
```

# Usage

## Configuration Options

Configuration options with defaults that can be passed to the constructor.  

```javascript
{
  enabled: true, // enable/disable A/B selection, false always returns A
  idBonly: [], // ALL or specific ids/keys to always get B
  groupBonly: [], // ALL or specific group ids/keys to always get B
  idExcludes: [], // specific ids/keys to exclude from A/B, get A only
  idIncludes: ['ALL'], // ALL or specific ids/keys to include in A/B
  groupExcludes: [], // specific group ids/keys to exclude from A/B, get A only
  groupIncludes: ['ALL'], // ALL or specific groups ids/keys to include in A/B
}
```

If statistical significance is achieved and B wins, set the idBonly or groupBonly to ['ALL'] to route all users to the B treatment until the implementation is updated to remove the A/B test selector.

Partial configuration will use defaults for unspecified properties.  

There are getEnabled() and setEnabled(boolean) methods.
The getConfiguration() and setConfiguration(config) methods allow setting full or partial configuration dynamically while executing.

Listed above in order of evaluation precedence, first definitive resolution is returned.  
The precedence is hard-coded, changing the order here does not change the precedence.  

The arrays are converted to Sets internally for performance in case large lists are needed.  

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
