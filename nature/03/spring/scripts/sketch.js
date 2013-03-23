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

    var xOffset = 100,
        yOffset = p.height/2,
        start = p.color(33, 106, 234),
        end = p.color(234, 36, 88);


    function Spring () {
      this.origin = new p.PVector();
      this.restLength = 300;
      this.k = 0.3;
    }

    Mover.prototype.checkEdges = function (){};//noop

    Spring.prototype.connect = function (mover) {
      var force = p.PVector.sub(mover.location, this.origin);
      var d = force.mag();
      var stretch = d - this.restLength;
      force.normalize();
      force.mult(-1 * this.k * stretch);
      force.mult(0.9); //try some dampening
      mover.applyForce(force);
    };

    Spring.prototype.displayLine = function (mover) {
      p.line(this.origin.x, this.origin.y, mover.location.x, mover.location.y);
    };


    var spring = new Spring();
    spring.origin.set(p.width/2, 100, 0);
    var mover = new Mover();
    mover.display = function () {
      p.ellipse(this.location.x, this.location.y, 40, 40);
    };

    p.draw = function() {
      p.background(255);

      spring.connect(mover);
      mover.applyForce(new p.PVector(0, 0.9 * mover.mass));
      mover.applyFriction(0.7);
      mover.update();

      spring.displayLine(mover);
      mover.display();


    };
  };
  return module;
});
