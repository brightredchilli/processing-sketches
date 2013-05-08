define(["processing", "particle", "particlesystem" , "toxi"], 
    function(Processing, Particle, ParticleSystem, toxi) {
      var module = {};

      var Vec2D = toxi.geom.Vec2D;
      var Rect = toxi.geom.Rect;
      var GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
      var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
      var VerletParticle2D = toxi.physics2d.VerletParticle2D;
      var VerletSpring2D = toxi.physics2d.VerletSpring2D;

      //processing setup
      module.initialize = function(canvas) {
        module.processing = new Processing(canvas, start);
      }


      function start(p) {
        //declare variables
        p.size(800,600);
        p.background(255);
        var nX = 0, nY = 100;
        //
        //declare classes
        function ToxiBox (loc, w) {
          VerletParticle2D.call(this, loc.x, loc.y, w);
        }
        ToxiBox.prototype = new VerletParticle2D();
        ToxiBox.prototype.draw = function () {
          p.rectMode(p.CENTER);
          p.rect(this.x, this.y, 10, 10);
        };

        var physics = new VerletPhysics2D();
        physics.setWorldBounds = new Rect(0, 0, p.width, p.height);
        //hphysics.addBehavior(new GravityBehavior(new Vec2D(0,00)));

        var t1 = new ToxiBox(new Vec2D(100, 100), 2);
        var t2 = new ToxiBox(new Vec2D(200, 100), 2);
        var spring = new VerletSpring2D(t1, t2, 200, 0.005);
        physics.addParticle(t1);
        physics.addParticle(t2);
        physics.addSpring(spring);

        p.mouseDragged = function () {
          t2.lock();
          t2.x = p.mouseX;
          t2.y = p.mouseY;
          t2.unlock();
        };

        p.draw = function() {
          p.background(255);
          physics.update();
          p.fill(201, 70, 255);
          p.line(t1.x, t1.y, t2.x, t2.y);
          t1.draw();
          t2.draw();
          if (p.__mousePressed) {
            p.mouseDragged();
          }
        };
      };
      return module;
    });
