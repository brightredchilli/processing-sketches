define(["processing", "particle", "particlesystem" , "toxi"], 
    function(Processing, Particle, ParticleSystem, toxi) {
      var module = {};

      var Vec2D = toxi.geom.Vec2D;
      var Rect = toxi.geom.Rect;
      var GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
      var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
      var VerletParticle2D = toxi.physics2d.VerletParticle2D;
      var VerletSpring2D = toxi.physics2d.VerletSpring2D;
      var VerletConstrainedSpring2D = toxi.physics2d.VerletConstrainedSpring2D;
      var VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D;

      //processing setup
      module.initialize = function(canvas) {
        module.processing = new Processing(canvas, start);
      }

      function start(p) {
        //declare variables
        p.size(800,600);
        p.background(255);
        var nX = 0, nY = 100;
        var physics = new VerletPhysics2D();
        physics.setWorldBounds = new Rect(0, 0, p.width, p.height);
        //physics.addBehavior(new GravityBehavior(new Vec2D(0,0.05)));

        //declare classes
        function ToxiBox (loc, w) {
          VerletParticle2D.call(this, loc.x, loc.y, w);
        }
        ToxiBox.prototype = new VerletParticle2D();
        ToxiBox.prototype.draw = function () {
          p.pushMatrix();
          p.rectMode(p.CENTER);
          p.rect(this.x, this.y, 10, 10);
          p.popMatrix();
        };

        function Cluster(x, y, n) {
          this.particles = [];
          this.springs = [];
          this.warm = 0;
          for (var i = 0; i < n; i++) {
            var b = new ToxiBox(new Vec2D(p.random(-50, 50) + x, p.random(-50, 50) + y), 3);
            physics.addParticle(b);
            this.particles.push(b);
          };

          for (var i = 0; i < n; i++) {
            for (var j = i+1; j < n; j++) {
              var spring = new VerletSpring2D(this.particles[j], this.particles[i], p.random(0, 1000), 0.005);
              physics.addSpring(spring);
            };
          };
        }

        Cluster.prototype.display = function () {
          /*
          for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].draw();
          };
          */

          for (var i = 0; i < this.particles.length; i++) {
            for (var j = i+1; j < this.particles.length; j++) {
              p.line(this.particles[j].x, this.particles[j].y, this.particles[i].x, this.particles[i].y);
            };
          };
        };

        Cluster.prototype.update = function () {
          var lock = true;
          if (this.warm > 0) {
            this.warm -= 1;
            this.setLocked(false);
          } else  {
            this.setLocked(true);
          }
        };

        Cluster.prototype.setLocked = function (lock) {
          this.particles.forEach(function(node) {
            if (lock) {
              node.lock();
            } else {
              node.unlock();
            }
          });
        }


        var clusters = [];

        p.strokeWeight(0.02);
        p.mousePressed = function () {
          clusters.forEach(function(e) {
            //apply a random force
            e.warm = 100; //give some time to resolve
            e.setLocked(false);
            e.particles[Math.floor(Math.random()*e.particles.length)].addForce(new Vec2D(p.random(-2,2), p.random(-2, 2)));
          });

         var c = new Cluster(p.mouseX, p.mouseY, 5);
         c.warm = 100;
         c.setLocked(false);
         clusters.push(c);
         
        };

        p.strokeWeight(2);
        p.draw = function() {
          p.fill(255, 20);
          p.rect(0, 0, p.width, p.height);
          p.background(255);
          physics.update();
          
          clusters.forEach(function(cluster) {
            //apply a random force
            cluster.display();
            cluster.update();
          });
        };
      };
      return module;
    });
