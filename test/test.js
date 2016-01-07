var chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var expect = require('chai').expect;
var sinon  = require('sinon');
var uuid   = require('node-uuid');
var rewire = require('rewire');

var currentUuid;
function generateUuid() {
  currentUuid = uuid.v4();
  return currentUuid;
}

function getUuid() {
  return currentUuid;
}

var PerformanceTracker = rewire('../index');
PerformanceTracker.__set__('uuid', { v4: getUuid });

describe('performance tracker', function() {
  var log;

  beforeEach(function() {
    generateUuid();

    log = {
      info: sinon.spy(),
      debug: sinon.spy()
    };
  });

  describe('#end', function() {
    it('logs the start, end and duration, defaulting to logging info level', function(done) {
      var tracker = new PerformanceTracker(log, 'token');

      setTimeout(function() {
        tracker.end();
        expect(log.info).to.have.been.calledOnce;
        expect(log.info).to.have.been.calledWith({
          start: sinon.match.number,
          duration: sinon.match(v => v >= 100),
          end: sinon.match.number,
          token: 'token',
          id: getUuid()
        });
        done();
      }, 100);
    });

    it('logs object given as options', function() {
      var tracker = new PerformanceTracker(log, 'token', {custom: 'option'});
      tracker.end();

      expect(log.info).to.have.been.calledWith(sinon.match({
        custom: 'option'
      }));
    });

    it('logs object given to end', function() {
      var tracker = new PerformanceTracker(log, 'token');
      tracker.end({customEnd: 'option'});

      expect(log.info).to.have.been.calledWith(sinon.match({
        customEnd: 'option'
      }));
    });
  });

  describe('#log', function() {
    it('logs without stopping the timer', function(done) {
      var tracker = new PerformanceTracker(log, 'token');

      setTimeout(function() {
        tracker.log();

        setTimeout(function() {
          tracker.end();
          expect(log.info).to.have.been.calledTwice;
          expect(log.info).to.have.been.calledWith(sinon.match({
            end: undefined,
            duration: sinon.match(v => v >= 100),
            id: getUuid()
          }));
          expect(log.info).to.have.been.calledWith(sinon.match({
            end: sinon.match.number,
            duration: sinon.match(v => v >= 200),
            id: getUuid()
          }));

          done();
        }, 100);
      }, 100);
    });

    it('returns the tracker', function() {
      var tracker = new PerformanceTracker(log, 'token');
      expect(tracker.log()).to.equal(tracker);
    });
  });
});
