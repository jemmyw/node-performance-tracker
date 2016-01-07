# Node performance tracker

A really simple node performance / benchmark tool for production logging

## Install

```sh
npm install --save performance-tracker
```

## Usage

A logging mechanism is required, any object that responds to 'info' by default.
It works best with [bunyan](https://www.npmjs.com/package/bunyan), but console
will work.

```javascript
var PerformanceTracker = require('performance-tracker');
var tracker = new PerformanceTracker(console, 'identifying-token', { level: 'info' });

setTimeout(function() {
  tracker.log('how long it took to get here');

  setTimeout(function() {
    tracker.end('how long it took to complete');
  }, 1000);
}, 1000);
```

This should output something like the following:

```
{ duration: 1001.844023,
  start: 14.816937,
  end: undefined,
  token: 'token',
  id: '7a6aa295-794b-41ec-ac91-8e41d91790d7' } 'how long it took to get here'
{ duration: 2016.099632,
  start: 14.816937,
  end: 2030.916569,
  token: 'token',
  id: '7a6aa295-794b-41ec-ac91-8e41d91790d7' } 'how long it took to complete'
```
