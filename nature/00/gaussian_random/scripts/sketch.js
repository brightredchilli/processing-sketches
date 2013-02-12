define(["scripts/lib/processing-1.4.1-api.js", "scripts/lib/gaussian_random.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start);
  }

  function start(processing) {
    //declare classes


    function Walker (red, green, blue) {
      var width = 15, height = 15;
      var x = processing.width/2;
      var y = processing.height/2;
      var sd = 60, colorSd=30, meanX = x, meanY = y;

      var r = red, g = green , b = blue;

      this.display = function () {
        processing.noStroke();
        processing.ellipse(x,y, width, height);
      }

      this.step = function () {
        var numX = Z.nextGaussian();
        var numY = Z.nextGaussian();
        x = Z.nextGaussianValue(sd, meanX);
        y = Z.nextGaussianValue(sd, meanY);


        var randR = Z.nextGaussianValue(colorSd, r);
        var randG = Z.nextGaussianValue(colorSd, g);
        var randB = Z.nextGaussianValue(colorSd, b);

        processing.fill(randR, randG, randB);
      }
    }

    //declare variables
    processing.size(800,600);
    processing.background(0);
    var walker = new Walker(230, 50, 50);
    var Z = new Ziggurat();

    Ziggurat.prototype.nextGaussianValue = function(sd, mean) {
      var num = this.nextGaussian();
      return num * sd + mean;
    }
    
    //functions

    function procDraw() {
      walker.step();
      walker.display();
    };

    processing.draw = procDraw;
  }
  return module;
});
