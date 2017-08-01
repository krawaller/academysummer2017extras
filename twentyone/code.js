
function generateDeck(){
  var suits = ["spades", "diamonds", "hearts", "clubs"];
  var names = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
  var values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

  /*var deck = [];
  for(var suitIdx = 0; suitIdx < suits.length; suitIdx++){
    for(var nameIdx = 0; nameIdx < names.length; nameIdx++){
      deck.push({
        suit: suits[suitIdx],
        name: names[nameIdx],
        value: values[nameIdx]
      });
    }
  }*/

  var deck = suits.reduce((mem, suit) => names.reduce((mem, name, nameIdx)=> mem.concat({
    suit: suit,
    name: name,
    value: values[nameIdx]
  }), mem), [] );

  deck = _.shuffle( deck ); // use Lodash shuffle method to shuffle deck

  return deck;
}

function generateStartingState(){
  return {
    deck: generateDeck(),
    player: [],
    dealer: [],
    happy: false
  }
}

var state = generateStartingState();

$("#hit").click(function(){
  state = dealToPlayer(state);
  showState(state);
});

$("#stand").click(function(){
  state.happy = true;
  showState(state);
});

$("#dealer").click(function(){
  state = dealToDealer(state);
  showState(state);
});

$("#restart").click(function(){
  state = generateStartingState();
  showState(state);
});

showState(state);

function dealToPlayer(state){
  var card = state.deck.pop();
  state.player.push(card);
  if (calculateScoreForHand(state.player) >= 21){
    state.happy = true;
  }
  return state;
}

function dealToDealer(state){
  var card = state.deck.pop();
  state.dealer.push(card);
  return state;
}

function calculatePhase(state){
  var dealer = calculateScoreForHand(state.dealer);
  var player = calculateScoreForHand(state.player);
  if (!state.happy){
    return "player";
  } else if (dealer < 17){
    return "dealer";
  } else if (player <= 21 && (dealer > 21 || player > dealer)){
    return "win";
  } else {
    return "lose";
  }
}

function showState(state){
  $("#board img").remove();
  state.dealer.forEach(function(card, n){
    var cardElem = $("<img>")
      .attr("src", "cards/" + card.name + "_of_" + card.suit + ".svg")
      .addClass("card")
      .addClass("dealer")
      .addClass("pos" + n);
    $("#board").append(cardElem);
  });
  $("#board #dealerscore").text(  calculateScoreForHand( state.dealer )  );
  state.player.forEach(function(card, n){
    var cardElem = $("<img>")
      .attr("src", "cards/" + card.name + "_of_" + card.suit + ".svg")
      .addClass("card")
      .addClass("player")
      .addClass("pos" + n);
    $("#board").append(cardElem);
    $("#board #playerscore").text(  calculateScoreForHand( state.player )  );
  });

  $("#hit, #stand, #dealer, #restart").hide();

  var phase = calculatePhase(state);

  if (phase === "player"){
    $("#hit").show();
    $("#instruction").text("Draw until you are happy!");
    if (state.player.length){
      $("#stand").show();
    }
  } else {
    if (phase === "dealer"){
      $("#dealer").show();
      $("#instruction").text("Give cards to the dealer!");
    } else {
      $("#restart").show();
      $("#instruction").text(phase === "win" ? "You WIN! OMG!" : "LOSER! You suck BAD.");
    }
  }

}

function calculateScoreForHand(hand){
  var score = 0;
  var ace = false;
  for(var cardIdx = 0; cardIdx < hand.length; cardIdx++){
    var value = hand[cardIdx].value;
    if (value === 1 && !ace){ // put the first ace aside
      ace = true;
    } else {
      score += value;
    }
  }

  if (ace){ // if we put an ace aside, decide the value
    /*if (score < 11){
      score += 11;
    } else {
      score += 1;
    }*/
    score += score < 11 ? 11 : 1;
  }

  return score;
}
