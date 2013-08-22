define(["processing", "particle"], function(Processing, Particle) {

    function ParticleSystem (origin) {
      Particle.call(this);
      this.particles = new Processing.prototype.ArrayList();
      if (origin !== undefined) this.location = origin;
    }

    ParticleSystem.prototype = new Particle();

    ParticleSystem.prototype.addParticle = function (part) {
      this.particles.add(part);
    };

    var superRun = ParticleSystem.prototype.run;
    ParticleSystem.prototype.run = function () {
      var it = this.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();
        particle.run();

        if (particle.isDead()) {
          it.remove();
        }
      }
      superRun.call(this);
    };

    ParticleSystem.prototype.applyForce =  function(f) {
      var it = this.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();
        particle.applyForce(f);
      }
    }

    var superIsDead = ParticleSystem.prototype.isDead;
    ParticleSystem.prototype.isDead = function () {
      if (this.particles.size() == 0 || superIsDead.call(this)) {
        return true;
      }
      return false;
    };

    return ParticleSystem;
});
