var log = console.log.bind(console);

var bot = {

  VERSION: "Default JavaScript folding player",

  MIN_SUM: 20,

  bet_request: function(gs, makeBet) {
    this.GS = gs;

    try {
      bet = this.getBet();
    }
    catch(err) {
      log('ERRORe', err);
    }

    makeBet(makeBet);
  },

  high_card_value: 11,

  showdown: function(gs) {

  },

  getBet: function() {
    var bet = 0;
    var gs = this.GS;
    var min_raise = gs.minimum_raise + 2 * gs.small_blind;

    if (this.isPreFlop()) {
      // PRE FLOP
      if (this.isHandPair()) {
        bet = min_raise * 2;
      } else if (this.getOurCardSum() > this.MIN_SUM) {
        bet = min_raise;
      }
    } else {
      // POST FLOP
      if (this.isHandPair() || this.isTablePairOrMore()) {
        if (this.isSet() || this.isFlush()){
          bet = this.getOurPlayer().stack;
        } else {
          bet = min_raise * 2;
        }
      } else if (this.getOurCardSum() > 20) {
        bet = min_raise;
      }
    }

    return bet;
  },

  getOurPlayer: function() {
    var players = this.GS.players;

    for (var i = 0; i < players.length; i++) {
      if (players[i].hole_cards) {
        return players[i];
      }
    }
  },

  getOurCards: function() {
    return this.getOurPlayer().hole_cards;
  },

  getTableCards: function() {
    return this.GS.community_cards;
  },

  getOurCardSum: function() {
    var cards = this.getOurCards();

    return cards.reduce(function(memo, card) {
      return memo + this.getCardValue(card);
    }.bind(this), 0);
  },

  getCardValue: function(card) {
    var high = {
      'J': 11,
      'Q': 12,
      'K': 13,
      'A': 14
    };

    return card.rank in high
      ? high[card.rank]
      : +card.rank;
  },

  isHandPair: function() {
    var cards = this.getOurCards();

    return cards[0].rank === cards[1].rank;
  },

  isTablePairOrMore: function() {
    var hash = this.getCardsHash();
    for (var key in hash) {
      if (hash[key] > 1) {
        return true;
      }
    }

    return false;
  },
  isPairWorthPlaying: function() {
    var hash = this.gerCardsHash(),
        pairedCards = [],
        countOfStrongerCards = 0;
    for (var key in hash) {
      if (hash[key] == 2) {
        pairedCards.push(this.getCardValue(hash[key]));
      }
    }
    if (pairedCards.length > 1) {
      //two pairs worth playing
      return true;
    }
    if (pairedCards[0] >= this.high_card_value){
      //is a high pair
      return true;
    } else {
      for (var key in hash) {
        if (pairedCards.indexOf(this.getCardValue(key)) == -1) {
          if (this.getCardValue(key) > pairedCards[0]){
            countOfStrongerCards++;
          }
        }
      }
      return !(countOfStrongerCards > 1);
    }
  },
  isSet: function() {
    var hash = this.getCardsHash();
    for (var key in hash) {
      if (hash[key] == 3) {
        return true;
      }
      return false;
    }

  },

  isFlush: function() {
    var hash = this.getSuitsHash();
    for (var key in hash) {
      if (hash[key] === 5) {
        return true;
      }
    }
    return false;
  },

  isPreFlop: function() {
    return this.GS.community_cards.length === 0;
  },

  isFlop: function() {
    return this.GS.community_cards.length === 3;
  },

  getSuitsHash: function() {
    var table = this.getTableCards();
    var our = this.getOurCards();
    var allcards = table.concat(our);
    var hash = {};
    var suit;

    for (var i = 0; i < allcards.length; i++) {
      suit = allcards[i].suit;

      hash[suit] = hash[suit] ? hash[suit] + 1  : 1;
    }

    return hash;
  },

  getCardsHash: function() {
    var table = this.getTableCards();
    var our = this.getOurCards();
    var allcards = table.concat(our);
    var hash = {};
    var rank;

    for (var i = 0; i < allcards.length; i++) {
      rank = allcards[i].rank;

      hash[rank] = hash[rank] ? hash[rank] + 1  : 1;
    }

    return hash;
  }
};

module.exports = bot;
