/* @pjs preload="smoke.png"; */
define(["processing", "particlesystem", "particle", "gaussian"], function(Processing, ParticleSystem, Particle, Gaussian) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes
    var gaussian = new Gaussian();
    var t = 100;
    var img = new p.loadImage("smoke.png");

    function Smoke(location) {
      ParticleSystem.call(this);
      this.location = location.get();
    }
    Smoke.prototype = new ParticleSystem();

    Particle.prototype.checkEdges = function (){};
    var superRun = Smoke.prototype.run;
    Smoke.prototype.run = function () {
      //add particles
      
      var s = new Particle();
      
      s.location = this.location.get();
      s.lifespan = 60;
      s.velocity = new p.PVector(gaussian.nextGaussian() * 0.3, gaussian.nextGaussian()*0.3 - 1);
      s.display = function () {
        p.fill(255);
        //p.ellipse(this.location.x, this.location.y, 10, 10);
        p.tint(255, p.map(this.lifespan, 0, 60, 0, 255));
        p.image(img, this.location.x, this.location.y, 50, 50);
      };
      this.addParticle(s);
      superRun.call(this);
    };



    //declare variables
    p.size(800,600, "2D");
    p.noStroke();
    p.background(0);


    var smokePoint;
    p.mousePressed = function () {
      var smokePoint = new Smoke(new p.PVector(p.mouseX, p.mouseY));
      smokeSystem.addParticle(smokePoint);
      var it = smokeSystem.particles.iterator();
      while (it.hasNext()) {
        var particle = it.next();
        particle.lifespan = 100;
      };
    };
    p.mouseDragged = function () {
      var last = smokeSystem.particles.get(smokeSystem.particles.size() - 1);
      last.location = new p.PVector(p.mouseX, p.mouseY);
      last.lifespan = 100; //extend life as long as mouse is dragged
    };

    var smokeSystem = new ParticleSystem();

    p.draw = function() {
      p.background(0);
      smokeSystem.run();
      var wind = new p.PVector(p.noise(t), 0);
      wind.mult(3);
      smokeSystem.applyForce(wind);

      t += 0.003;
    };
  };
  return module;
});
