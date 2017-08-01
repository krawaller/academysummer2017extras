
var gameState;

try {
  gameState = JSON.parse( localStorage.getItem("GAMESTATE") );
} catch(e) {
  // no state was saved, start from beginning
  gameState = {
    currentPage: 'beginning'
  };
}

var pages = {
  beginning: {
    title: "The beginning",
    imgUrl: "http://www.digitaldealer.com/wp-content/uploads/2014/03/crossroads.jpg",
    bread: "Now your <strong>adventure</strong> starts! Where do you want to go?",
    options: [{text:"Left", to: "left"}, {text:"Right", to:"right"}]
  },
  left: {
    title: "A cliff",
    imgUrl: "http://q.likesuccess.com/92/4555467-person-falling-off-cliff.jpg",
    bread: "Oh no, you fell off a cliff and died!",
    options: [{text:"Restart", to:"beginning"}]
  },
  right: {
    title: "Hedgehog attack",
    imgUrl: "https://i.ytimg.com/vi/u2fyiLSKAKE/maxresdefault.jpg",
    bread: "Ack, you were eaten by a hedgehog! :(",
    options: [{text:"Restart", to:"beginning"}]
  }
};

function drawPage(){
  var page = pages[ gameState.currentPage ];
  $("#page h2").text( page.title );
  $("#page img").attr("src", page.imgUrl);
  $("#bread").html(page.bread);
  $("#page ul").empty();
  page.options.forEach(function(link, n){
    var linkElem = $("<li></li>")
      .text(link.text)
      .attr("data-optNbr", n); // store link index for use in click handler
    $("#page ul").append(linkElem);
  });
}

// Event delegation, catch clicks on all future `li` inside `#page ul`
$("#page ul").on("click", "li", function(e){
  var optNbr = $(e.target).attr("data-optNbr"); // option index, was stored in drawPage
  var page = pages[gameState.currentPage];
  var optionData = page.options[optNbr];
  var target = optionData.to;
  gameState.currentPage = target;
  localStorage.setItem("GAMESTATE", JSON.stringify(gameState));
  drawPage();
});

drawPage();
