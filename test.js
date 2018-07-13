var no
var expect = require('chai').expect;
var sinon = require('sinon');
var bot;
var betCb;

describe('leanpoker bot', function() {

  beforeEach(function() {
    bot = require('./player');
    state = require('./game_state');
    betCb = sinon.spy();
  });

  it('should be an object', function() {
    expect(bot).to.be.an('object');
  });

  it('should have a "bet_request" method', function() {
    expect(bot.bet_request).to.be.a('function');
  });

  it('should call our "bet" callback', function() {
    var betDone = bot.bet_request(state, betCb);
    expect(betCb.called).to.be.true;
  });
});
