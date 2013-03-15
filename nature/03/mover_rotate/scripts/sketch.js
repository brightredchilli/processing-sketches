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
    p.rectMode(p.CENTER);

    var from = p.color(255, 30, 255);
    var to = p.color(100, 255, 30);

    var fromFill = p.color(20, 255, 100);
    var toFill = p.color(200, 30, 100);
    Mover.prototype.display = function() {
      p.pushStyle();
      p.translate(this.location.x, this.location.y);
      p.rotate(p.radians(this.angle));
      var a = p.map(this.aVelocity, -50, 50, 0, 1);;
      var b = p.map(this.velocity.mag(), -70, 70, 0, 1);
      var color = p.lerpColor(from, to, a);
      var fillColor = p.lerpColor(fromFill, toFill, b);
      p.stroke(color);
      p.fill(fillColor);
      p.strokeWeight(5);
      p.rect(0, 0, this.size*2, this.size*2);
      p.strokeWeight(2);
      p.ellipse(0, 40, this.size*2, this.size*2);
      p.popStyle();
    };

    Mover.prototype.applyGravity = function () {
      this.applyForce(new p.PVector(0, 0.3*this.mass));
    };

    function createMover() {
      var mover = new Mover();
      mover.acceleration = new p.PVector(5, -5);
      mover.location = new p.PVector(30, 500);
      mover.aAcceleration = 20;
      return mover;
    }

    function Gravity (G) {
      this.G = G;
    }

      

    var m = createMover();
    p.draw = function() {
      if (p.frameCount % 120 == 0) {
        //m = createMover();
      }

      m.applyForce(new p.PVector(p.random(-5, 5), p.random(-5, 5)));
      m.aVelocity = m.velocity.mag() ; 
      if (m.velocity.x < 0) {
        m.aVelocity *= -1;
      }
      //m.aAcceleration = p.constrain(m.aAcceleration, -100, 10);
      m.applyGravity();
      m.update();
      m.display();

    };
  };
  return module;
});
