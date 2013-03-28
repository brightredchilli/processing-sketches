define(["processing", "particle"], function(Processing, Particle) {
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

    Particle.prototype.display = function () {
      p.ellipse(this.location.x, this.location.y, this.size, this.size);

    };
    var a =  new Particle();
    a.velocity = p.PVector.random2d();

    p.draw = function() {
      a.run();
    };
  };
  return module;
});
