define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start);
  }

  function start(processing) {
    //declare variables
    
    //functions

    function procDraw() {
    };

    function setup() {
      this.size(800,600);
      this.background(200,255,255);
    }
    processing.setup = setup;
    processing.draw = procDraw;
  }
  return module;
});
