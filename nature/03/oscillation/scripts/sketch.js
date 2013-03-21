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
    p.noStroke();

    var amp = 100,
        period = 120,
        xOffset = p.width/2,
        yOffset = p.height/2;
    

    function Oscillator () {
      this.angle = new p.PVector();
      this.velocity = p.PVector.random2d();
      this.velocity.mult(0.05);
      this.amplitude = p.PVector.random2d();
      this.amplitude.mult(new p.PVector(p.width/2, p.height/2));
      this.color = p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255));
    }

    Oscillator.prototype.oscillate = function () {
      this.angle.add(this.velocity);
    };

    Oscillator.prototype.display = function () {
      var x = p.sin(this.angle.x) * this.amplitude.x,
          y = p.sin(this.angle.y) * this.amplitude.y;

      p.pushMatrix();
      p.translate(p.width/2, p.height/2);
      p.fill(this.color);
      p.ellipse(x, y, 25, 25);
      p.popMatrix();
    };


    var oscillators = [];
    for (var i = 0; i < 50; i++) {
      var o = new Oscillator();
      oscillators.push(o);
    }

    p.draw = function() {
      p.background(255);
      var time = p.frameCount;

      for (var i = 0; i < oscillators.length; i++) {
        var o = oscillators[i];
        o.display();
        o.oscillate();
      }
    };
  };
  return module;
});
