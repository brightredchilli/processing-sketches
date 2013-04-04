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

    function ParticleSystem (origin) {
      this.particles = new p.ArrayList();
      this.origin = origin;
    }

    ParticleSystem.prototype.addParticle = function () {
      var newParticle = new Particle();
      newParticle.location = this.origin;
      this.particles.add(newParticle);
    };

    ParticleSystem.prototype.run = function () {
      var it = this.particles.iterator();

      while (it.hasNext()) {
        var particle = it.next();
        particle.update();
        particle.display();

        if (particle.isDead()) {
          it.remove();
        }
        
      }
    };



    var a =  new ParticleSystem(new p.PVector(30,30));
    a.addParticle(new Particle());

    p.draw = function() {

      p.background(255);
      a.run();
    };
  };
  return module;
});
