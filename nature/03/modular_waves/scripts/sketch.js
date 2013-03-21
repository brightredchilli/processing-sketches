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
        this.drawPoint(x + xOffset, y + yOffset);
        startAngle += this.aVelocity;
      }
    };

    Wave.prototype.drawPoint = function(x, y) {
      p.ellipse(x, y, 50, 50);
    }

    Wave.prototype.getYPosition = function(a) {
      var y = p.sin(a) * this.amplitude;
      return y;
    }

    Wave.prototype.increment = function () {
      this.angle += 0.001;
    }

    function Raindrop (x, y) {
      this.amplitude = 30;
      this.aVelocity = 0.02;
      this.angle = 0;
      this.points = 1;
      this.xOffset = x;
      this.yOffset = y;
    }

    Raindrop.prototype = new Wave();

    Raindrop.prototype.drawPoint = function(x, y) {
      p.pushMatrix();
      p.translate(x, y);
      p.ellipse(0, 0, 50, 50);
      p.popMatrix();
    };

    Raindrop.prototype.increment = function () {
      this.angle += 0.01;
    };

    Raindrop.prototype.getYPosition = function (a) {
      var y = (p.tan(a)) * this.amplitude;
      return y;
    };

    Raindrop.prototype.display = function () {
      Wave.prototype.display.call(this, this.xOffset, this.yOffset);;
    };

    var xOffset = 100,
        yOffset = p.height/2;


    p.fill(125, 182, 255, 150);
    p.stroke(221, 100, 255, 150);
    p.strokeWeight(4);

    var raindrops = [];
    for (var i = 0; i < 50; i++) {
      var r = new Raindrop(p.random(30, p.width), p.random(50, p.height));
      r.angle = p.random(0, 5);
      raindrops.push(r);
    }

    p.draw = function() {
      p.background(255);
      for (var i = 0; i < raindrops.length; i++) {
        var r = raindrops[i];
        r.increment();
        r.display();
      }
    };
  };
  return module;
});
