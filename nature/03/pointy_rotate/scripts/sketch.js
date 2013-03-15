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

    Mover.prototype.checkEdges = function(){};

    Mover.prototype.display = function() {
      p.pushStyle();
      p.translate(this.location.x, this.location.y);
      p.rotate(this.angle);
      p.fill(40, 255, 255);
      p.noStroke();
      p.ellipse(-30, 0, 30, 15);
      p.stroke(0);
      p.strokeWeight(3);
      p.fill(255, 0, 0);
      p.rect(0, 0, 40, 20);
      p.ellipse(-18, 7, 30, 15);
      p.ellipse(-18, -7, 30, 15);
      p.ellipse(-18, 0, 30, 15);
      p.popStyle();
    };

    Mover.prototype.attract = function(location, mass) {
      var force = p.PVector.sub(this.location, location);
      var distance = force.mag();
      distance = p.constrain(distance, 5, 25);
      force.normalize();

      var strength = (1 * this.mass * mass) / (distance * distance)
        force.mult(strength);
      return force;
    };


    function createMover() {
      var mover = new Mover();
      mover.acceleration = new p.PVector(1, -3);
      mover.location = new p.PVector(100, 500);
      return mover;
    }

    var big = new Mover();
    big.mass = 70;
    big.size = 200;
    big.display = function () {
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
    };
    big.location = new p.PVector(400, 300);

    var m = createMover();
    p.draw = function() {
      p.background(255);
      var force = m.attract(big.location, big.mass);
      force.mult(-1);
      m.applyForce(force);
      m.angle = m.velocity.heading2D();
      m.update();
      m.display();
      big.display();
    };
  };
  return module;
});
