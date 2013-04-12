define(["processing", "particle"], function(Processing, Particle) {

    function ParticleSystem (origin) {
      Particle.call(this);
      this.particles = new Processing.prototype.ArrayList();
      this.location = origin;
    }

    ParticleSystem.prototype = new Particle();

    ParticleSystem.prototype.addParticle = function (part) {
      this.particles.add(part);
    };

    ParticleSystem.prototype.run = function () {
      var it = this.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();
        particle.run();

        if (particle.isDead()) {
          it.remove();
        }

      }
    };

    ParticleSystem.prototype.applyForce =  function(f) {
      var it = this.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();
        particle.applyForce(f);
      }
    }
    return ParticleSystem;
});
