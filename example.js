var tracker = require('./').create(console, 'token');

setTimeout(function() {
  tracker.log('how long it took to get here');

  setTimeout(function() {
    tracker.end('how long it took to complete');
  }, 1000);
}, 1000);
