var now    = require('performance-now');
var extend = require('object-extend');
var uuid   = require('node-uuid');

/**
* @param {*} logger Object that responds to info or given level
* @param {string} token
* @param {Object} [options]
* @param {string} [options.level=info] The logger level, defaults to info
*/
function PerformanceTracker(logger, token, options) {
  this.logger = logger;
  this.token = token;
  this.options = options || {};
  this.level = this.options.level || 'info';
  this.startAt = now();
  this.id = uuid.v4();

  if(typeof this.logger[this.level] !== 'function') { throw new Error('Given logger object must have ' + this.level + ' function'); }
  if(!this.token) { throw new Error('Token must be provided'); }
}

/**
* End the tracking and logs the duration.
* @param {...object} args arguments to pass to the logger function.
* @returns {PerformanceTracker} this
*/
PerformanceTracker.prototype.end = function() {
  var args = Array.prototype.slice.call(arguments);

  this.endAt = now();
  this.log.apply(this, args);
  return this;
};
/**
* Get the current duration in ms since the tracker was created.
* @returns {number} ms
*/
PerformanceTracker.prototype.duration = function() {
  if(this.endAt) {
    return this.endAt - this.startAt;
  } else {
    return now() - this.startAt;
  }
};
/**
* Log the current duration since the tracker was created.
* @param {...object} args arugments to pass to the logger function.
* @returns {PerformanceTracker} this
*/
PerformanceTracker.prototype.log = function() {
  var args = Array.prototype.slice.call(arguments);

  var payload = {
    duration: this.duration(),
    start: this.startAt,
    end: this.endAt,
    token: this.token,
    id: this.id
  };

  payload = extend(payload, this.options);

  if(typeof args[0] === 'object') {
    payload = extend(payload, args.shift());
  }

  args.unshift(payload);

  this.logger[this.level].apply(this.logger, args);
  return this;
};

module.exports = PerformanceTracker;

/**
* Create a tracker.
* @param {*} logger Object that responds to info or given level
* @param {string} token
* @param {Object} [options]
* @param {string} [options.level=info] The logger level, defaults to info
* @returns {PerformanceTracker}
*/
module.exports.create = function(logger, token, options) {
  return new PerformanceTracker(logger, token, options);
};
