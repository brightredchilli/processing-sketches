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
    var globalColor, globalAngle = 0;
    var startColor = p.color(255, 44, 65),
        endColor = p.color(43, 154, 154);

    function Smoke(location) {
      ParticleSystem.call(this);
      this.location = location.get();
    }
    Smoke.prototype = new ParticleSystem();


    var displayRect = function () {
      p.pushMatrix();
      p.translate(this.location.x, this.location.y);
      p.rotate(this.angle);
      p.fill(globalColor, p.map(this.lifespan, 0, 60, 0, 255));
      p.rect(0, 0, 20, 20);
      p.popMatrix();
    };

    var displayTexture = function () {
        p.tint(globalColor, p.map(this.lifespan, 0, 60, 0, 255));
        p.image(img, this.location.x, this.location.y, 50, 50);
    };


    Particle.prototype.checkEdges = function (){};
    var superRun = Smoke.prototype.run;
    Smoke.prototype.run = function () {
      //add particles
      
      var s = new Particle();
      
      s.location = this.location.get();
      s.lifespan = 60;
      s.velocity = new p.PVector(gaussian.nextGaussian() * 0.3, gaussian.nextGaussian()*0.3 - 1);
      s.color = p.color(255, 44, 65);
      s.display = displayTexture;

      
      var particleRun = s.run;
      s.run = function () {
        s.aVelocity = (p.noise(t) - 0.5) / 2;
        particleRun.apply(this);
      };
      
      this.addParticle(s);
      superRun.call(this);
    };



    //declare variables
    p.size(800,600, "2D");
    p.noStroke();
    p.background(0);
    p.imageMode(p.CENTER);
    p.rectMode(p.CENTER);


    var smokeSystem = new ParticleSystem();
    var smokePoint;
    p.mousePressed = function () {
      var smokePoint = new Smoke(new p.PVector(p.mouseX, p.mouseY));
      smokePoint.lifespan = 300;
      smokeSystem.addParticle(smokePoint);
    };
    p.mouseDragged = function () {
      var last = smokeSystem.particles.get(smokeSystem.particles.size() - 1);
      last.location = new p.PVector(p.mouseX, p.mouseY);
      last.lifespan = 300; //extend life as long as mouse is dragged
    };


    p.draw = function() {
      p.background(0);
      globalColor = p.lerpColor(startColor, endColor, (p.sin(globalAngle) / 2) + 0.5);
      if (p.__mousePressed) {
        p.mouseDragged();
      }

      smokeSystem.run();
      var wind = new p.PVector(p.noise(t), 0);
      wind.mult(3);
      smokeSystem.applyForce(wind);

      globalAngle += 0.005;

      t += 0.003;
    };
  };
  return module;
});
