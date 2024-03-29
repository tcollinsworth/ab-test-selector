# AB test selector

This library consistently assigns ids/keys to A or B test pool group for A/B testing. An id may be any valid number or string, i.e., userId, orgId/tenantId, etc.  

This library is simple to integrate and fast. It has very low latency and prevents users from randomly changing test pool groups which would pollute test results.

Tenant or org ids can be utilized for A/B selection in multi-tenant systems. This is useful where testing a subset of tenants is desired. Groups are also useful for monotonically increasing the size of population under test. Best practice is to initially start with a small subset to validate no significant negative effects and then increasing to full population.

This implementation does not need any remote request to select A/B. Remote requests will increase latency to end users. Remote requests might (will occasionally) fail. When failure, the user might (will 50% of the time) change groups which pollutes/skews the test results unpredictably.

By convention and for simplicity/consistency, the A group should be the existing behavior, B should be the new behavior (treatment). Not required though.

By default, all users are included in the AB test. The assignment algorithm is (hash(id) % 2 ? 'B' : 'A').

"Data Trumps Intuition" "significant learning and return-on-investment (ROI) are seen when development teams listen to their customers, not to the Highest Paid Person’s Opinion (HiPPO)", [Practical Guide to Controlled Experiments on the Web: Listen to Your Customers not to the HiPPO by Ronny Kohavi, PhD](http://videolectures.net/cikm08_kohavi_pgtce/)

## Requirements

Node 10+
ECMAScript module

### ECMAScript module

This library uses ECMAScript module features. It must be used with one of the following:

- package.json with
   ```
   type: module
   ```

- or loaded from a javascript file with .mjs extension

- or loaded after an esm shim, i.e., [esm](ttps://www.npmjs.com/package/esm) or [esm-wallaby](https://www.npmjs.com/package/esm-wallaby) which supports optional-chaining (elvis)

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

Ideally, expose/integrate configuration via environment variables following [12 Factor App](https://12factor.net/). Alternatively expose via central Service Discovery/configuration (etcd, consul, zookeeper, RDBMS, etc.) or REST endpoints. This will allow dynamically changing configuring while the system is running.

If statistical significance is achieved and B wins. So all users will then see B, set the idBonly or groupBonly to ['ALL']. This will route all users to the B treatment until the implementation is updated to remove the A/B test selector.

Partial configuration will use defaults for unspecified properties.  

There are getEnabled() and setEnabled(boolean) methods.  
The getConfiguration() and setConfiguration(config) methods allow setting full or partial configuration dynamically while executing.  

Listed above in order of evaluation precedence, first definitive resolution is returned.  
The precedence is hard-coded, changing the order here does not change the precedence.  

The arrays are converted to Sets internally for performance in case large lists are needed.  

## AB on user ID, for all users

```javascript
import AbTestSelector from 'ab-test-selector'

const ab = new AbTestSelector()

if (ab.getAB(userId) == 'B') {
  computeOrShowTreatmentB() // change this to call your application code
} else {
  computeOrShowTreatmentA() // change this to call your application code
}
```

## Switch to B for all users if/when B wins

Dynamically switch all users to B treatment

```javascript
ab.setConfiguration({
  idBonly: ['ALL'], // either this line or the other line
  groupBonly: ['ALL'], // either this line or the other line
})
```


## AB only some user IDs, others all get A

```javascript
import AbTestSelector from 'ab-test-selector'

const ab = new AbTestSelector({
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
import AbTestSelector from 'ab-test-selector'

const ab = new AbTestSelector({
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
import AbTestSelector from 'ab-test-selector'

const ab = new AbTestSelector({
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
