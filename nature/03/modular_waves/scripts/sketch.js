define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes

    //declare variables
    p.size(800,600);
    p.background(255);
    p.smooth();

    function Wave() {
      this.amplitude = 30;
      this.aVelocity = 0.5;
      this.angle = 0;
      this.points = 50;
    }

    Wave.prototype.xDistance = 20;
    Wave.prototype.points = 50;
    
    Wave.prototype.display = function (xOffset, yOffset) {
      var startAngle = this.angle;
      for (var i = 0; i < this.points; i++) {
        var x = i * this.xDistance;
        var y = this.getYPosition(startAngle);
        p.ellipse(x + xOffset, y + yOffset, 50, 50);
        startAngle += this.aVelocity;
      }
    };

    Wave.prototype.getYPosition = function(a) {
      var y = p.sin(a) * this.amplitude;
      return y;
    }

    Wave.prototype.increment = function () {
      this.angle += 0.001;
    }

    var xOffset = 100,
        yOffset = p.height/2;


    p.fill(125, 182, 255, 150);
    p.stroke(221, 100, 255, 150);
    p.strokeWeight(4);

    var wave = new Wave();
    wave.getYPosition = function (a) {
      var y = (p.tan(a)) * this.amplitude;
      return y;
    };

    p.draw = function() {
      p.background(255);
      wave.increment();
      wave.display(xOffset, yOffset);
    };
  };
  return module;
});
