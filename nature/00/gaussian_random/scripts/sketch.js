define(["scripts/lib/processing-1.4.1-api.js", "scripts/lib/gaussian_random.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start);
  }

  function start(processing) {
    //declare classes


    function Walker () {
      var width = 15, height = 15;
      var x = processing.width/2;
      var y = processing.height/2;
      var sd = 60, mean = processing.width/2;

      this.display = function () {
        processing.noStroke();
        processing.fill(255, 10);
        processing.ellipse(x,y, width, height);
      }

      this.step = function () {
        var num = Z.nextGaussian();
        x = sd * num + mean

      }
    }

    //declare variables
    processing.size(800,600);
    processing.background(0);
    var walker = new Walker();
    var Z = new Ziggurat();
    
    //functions

    function procDraw() {
      walker.step();
      walker.display();
    };

    processing.draw = procDraw;
  }
  return module;
});
