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
          p.rectMode(p.CENTER);
          p.rect(this.x, this.y, 10, 10);
        };

        function Snake(x, y) {
          this.color = p.color(p.random(0, 255), p.random(0, 255), p.random(0, 255));
          this.lifespan = 200;
          this.nX = p.random(0, 1000), this.nY = p.random(0, 1000);
          this.particles = [];

          this.head = new ToxiBox(new Vec2D(x, y), 2);
          physics.addParticle(this.head);
          this.particles.push(this.head);
          for (var i = 1; i < 20; i++) {
            var a = new ToxiBox(new Vec2D(x + i*5, y), 1);
            this.particles.push(a);
            physics.addParticle(a);
            var spring = new VerletSpring2D(a, this.particles[i-1], 5, 0.5);
            physics.addSpring(spring);
          }
        }
        
        Snake.prototype.display = function () {
          p.pushStyle();
          p.stroke(this.color);
          p.noFill();
          p.beginShape();
          for (var i = 0; i < this.particles.length; i++) {
            p.vertex(this.particles[i].x, this.particles[i].y);
          }
          p.endShape();
          p.popStyle();
        };

        Snake.prototype.randomUpdate = function () {
          var x, y, force;
          if (p.__mousePressed) {
            force = this.head.sub(new Vec2D(p.mouseX, p.mouseY));
            force = force.getInverted();
            force.limit(2);
          } else {
            x = p.noise(this.nX) - 0.5;
            y = p.noise(this.nY) - 0.5;
            force = new Vec2D(x, y);
            force.scale(3);
          }
          
          this.head.clearForce();
          this.head.addForce(force);
          this.nX += 0.005, this.nY += 0.005;
        };

        Snake.prototype.updateLifespan = function () {
          this.lifespan -= 1;
        };

        var center = new ToxiBox(new Vec2D(p.width/2, p.height/2), 1);
        center.lock();
        physics.addParticle(center);

        var snakeArray = [];
        for (var i = 0; i < 15; i++) {
          var snake = new Snake(p.random(100, p.width-100), p.random(100, p.height-100));
          snakeArray.push(snake);
          var spring = new VerletConstrainedSpring2D(center, snake.head, 20, 0.00005, 400);
          physics.addSpring(spring);


        };


        p.strokeWeight(2);
        p.draw = function() {
          p.fill(255, 100);
          p.rect(0, 0, p.width, p.height);
          physics.update();
          for (var i = 0; i < 10; i++) {
            var snake = snakeArray[i];
            snake.display();
            snake.randomUpdate();
          };
        };
      };
      return module;
    });
