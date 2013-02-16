define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start); }

  function start(processing) {
    //declare classes

    //declare variables
    processing.size(800,600);
    processing.background(0);

    var counter = 0;
    var t = 1;

    //functions
    function procDraw() {
      var n = processing.noise(t);
      var yVal = processing.map(n, 0, 1, 0, processing.height);
      processing.noStroke();
      processing.fill(processing.color(255, 70));
      processing.ellipse(counter, yVal, 5, 5);
      counter++;
      t += 0.005;
    };

    processing.draw = procDraw;
  }
  return module;
});
