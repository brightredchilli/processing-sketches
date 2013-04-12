define(["processing", "particle", "particlesystem"], function(Processing, Particle, ParticleSystem) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes


    //declare variables
    p.size(800,600);
    p.noStroke();

    var superIsDead = ParticleSystem.prototype.isDead;
    ParticleSystem.prototype.isDead = function () {
      if (this.particles.size() == 0 || superIsDead.call(this)) {
        return true;
      }
      return false;
    };

    Particle.prototype.checkEdges = function () {};
    Particle.prototype.run = function () {
      this.update();
      this.display();
    };

    function FireworkA(origin) {
      ParticleSystem.call(this);
      this.location = origin;
      //one particle flies out
      var a = new ParticleA();
      a.location = origin;
      this.addParticle(a);

    }

    FireworkA.prototype = new ParticleSystem();

    FireworkA.prototype.run = function() {

      var it = this.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();

        particle.run();

        if (particle instanceof ParticleA) {
          if (particle.isDead()) {
            //particle is gone, spawn particle b objects

            for (var i = 0; i < 5; i++) { 
              var c = new ParticleB();
              c.location = particle.location.get();
              c.acceleration = p.PVector.random2d()
              c.acceleration.mult(5);
              this.addParticle(c);
            }
          }
        }

        if (particle.isDead()) {
          it.remove();
        }

      }

    };


    function ParticleA() {
      Particle.call(this);
      this.lifespan = 50;
      this.size = 10;
    }
    ParticleA.prototype = new Particle();

    ParticleA.prototype.display = function () {
      p.pushStyle();
      var alpha = p.map(this.lifespan, 0, 100, 0, 1);
      alpha = Math.exp(7*alpha) - 1;
      alpha = p.constrain(alpha, 0, 1);
      alpha *= 255;

      p.fill(255, 17, 47, alpha);
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
      p.popStyle();
    };

    function ParticleB() {
      Particle.call(this);
      this.lifespan = 100;
    }

    ParticleB.prototype = new ParticleSystem();

    ParticleB.prototype.display = function () {
      p.pushStyle();
      var alpha = p.map(this.lifespan, 0, this.lifespan, 0, 1);
      alpha = Math.exp(3*alpha) - 1;
      alpha = p.constrain(alpha, 0, 1);
      alpha *= 255;

      p.fill(255, 235, 14, alpha);
      p.ellipse(this.location.x, this.location.y, 5, 5);
      p.popStyle();
    };


    var superRun = ParticleB.prototype.run;
    ParticleB.prototype.run = function () {
      this.update();
      this.display();
      superRun.call(this);

      if (Math.random() > 0.7) {
        var trail = new ParticleBTrail();
        trail.location = this.location.get();
        trail.velocity = this.velocity.get();
        trail.velocity.mult(0.01);
        this.addParticle(trail);
      }


    };



    function ParticleBTrail() {
      Particle.call(this);
      this.lifespan = 100;
      this.size = 5;
      this.mass = 50;
    }
    ParticleBTrail.prototype = new Particle();

    ParticleBTrail.prototype.display = function () {
      p.pushStyle();
      var alpha = p.map(this.lifespan, 0, this.lifespan, 0, 1);
      alpha = Math.exp(alpha) - 1;
      alpha = p.constrain(alpha, 0, 1);
      alpha *= 255;

      p.fill(255, 235, 14, alpha);
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
      p.popStyle();
    };

    var a =  new ParticleSystem ();
    p.mousePressed = function () {
      var firework = new FireworkA(new p.PVector(p.mouseX, p.mouseY));
      var acc = p.PVector.random2d();
      acc.mult(50);
      firework.applyForce(acc);
      a.addParticle(firework);
    };

    p.draw = function() {
      p.background(0);
      a.applyForce(new p.PVector(0, 0.1));
      a.run();
    };
  };
  return module;
});
