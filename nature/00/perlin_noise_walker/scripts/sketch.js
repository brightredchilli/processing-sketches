define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start); }

  function start(processing) {
    //declare classes
    console.log("log");


    function Walker (red, green, blue) {
      var width = 5, height = 5;
      var x = processing.width/2;
      var y = processing.height/2;
      var sd = 60, colorSd=30, meanX = x, meanY = y;

      var r = red, g = green , b = blue;
      var tx = 0, ty = 10000;

      this.display = function () {
        processing.noStroke();
        processing.fill(processing.color(255, 70));
        processing.ellipse(x,y, width, height);
      }

      this.step = function () {
        while (true) {
          var stepsize = processing.random(30);

          var stepX = processing.random(-stepsize, stepsize);
          var stepY = processing.random(-stepsize, stepsize);

          var prob = (stepsize*stepsize) / (30*30);
          var p2  = processing.random(1);
          if (prob > p2) {
            x += stepX;
            y += stepY;
            return;
          }
        }

      }

      this.perlinStep = function () {
        var stepX = processing.noise(tx);
        var stepY = processing.noise(ty);
        tx += 0.003;
        ty += 0.008;

        x = processing.map(stepX, 0, 1, 0, processing.width);
        y = processing.map(stepY, 0, 1, 0, processing.height);

      }
    }
    //declare variables
    processing.size(800,600);
    processing.background(0);
    var walker = new Walker(230, 50, 50);

    //functions

    function procDraw() {
      walker.perlinStep();
      walker.display();
    };

    processing.draw = procDraw;
  }
  return module;
});
