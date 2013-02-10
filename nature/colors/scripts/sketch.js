define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start);
  }

  function start(processing) {
    //declare variables
    var randomColor, currentColor;
    var prevDate = Date.now();
    var nowDate; 
    var r,g,b;
    var DELAY = 1000;

    //functions
    function changeColor() {
      //change only channel at a time.
      var channel = Math.floor(processing.random(3));
      r = channel == 0 ? processing.random(255) : r;
      g = channel == 1 ? processing.random(255) : g;
      b = channel == 2 ? processing.random(255) : b;

      currentColor = randomColor;
      randomColor = processing.color(r,g,b);
    }

    function procDraw() {
      nowDate = Date.now();
      if (nowDate - prevDate > DELAY) {
        changeColor();
        prevDate = nowDate;
      }
      processing.background(processing.lerpColor(currentColor, randomColor, (nowDate - prevDate) / DELAY));

    };

    function setup() {
      this.size(800,600);
      this.background(200,255,255);
    }
    processing.setup = setup;
    processing.draw = procDraw;
  }



/*
  function setup() {
  }
*/


  return module;
});
