define(["processing", "toxi"], function(Processing, toxi) {

  var module = {};

  var Vec2D = toxi.geom.Vec2D;
  var Rect = toxi.geom.Rect;
  var Circle = toxi.geom.Circle;
  var GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
  var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
  var VerletParticle2D = toxi.physics2d.VerletParticle2D;
  var VerletSpring2D = toxi.physics2d.VerletSpring2D;
  var VerletConstrainedSpring2D = toxi.physics2d.VerletConstrainedSpring2D;
  var VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D;
  var PerlinNoise = toxi.math.noise.PerlinNoise;
  var RectConstraint = toxi.physics2d.constraints.RectConstraint;

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);

      var physics = new VerletPhysics2D();
      physics.setWorldBounds(new Rect(0, 0, p.width, p.height));
      physics.setDrag(0.08);

      function Vehicle(x, y) {
        VerletParticle2D.call(this, x, y, 5);
        physics.addParticle(this);
        this.scale = 5;
      }
      Vehicle.prototype = new VerletParticle2D();

      Vehicle.prototype.display = function () {
        p.ellipse(this.x, this.y, this.scale, this.scale);
      };

      Vehicle.prototype.steer = function (x, y) {
        var maxspeed = 1, threshold = 100, target = new Vec2D(x,y);

        var desired = target.sub(this);
        var d = desired.magnitude();

        desired.normalize();

        if (d < threshold) {
          desired.scaleSelf((d/threshold) * maxspeed);
        } else {
          desired.scaleSelf(maxspeed);
        }
        var steer = desired.sub(this.getVelocity());
        steer.scaleSelf(0.2); //maxspeed
        this.addForce(steer);
      };

      Vehicle.prototype.followPath = function(path) {
        //get current velocity and project
        var projected = this.add(this.getVelocity().normalize().scale(25));

        var a = projected.sub(path.start);
        var b = path.line.copy();
        var theta = a.angleBetween(b, true);
        var d = a.magnitude() * Math.cos(theta);

        b.normalizeTo(d);
        var normalPoint = path.start.add(b);

        if (normalPoint.sub(projected).magnitude() > path.radius) {
          var t = path.start.add(b.normalizeTo(d + 25)); //look ahead
          v.steer(t.x, t.y);
          //p.fill(255, 0, 0);
          //p.ellipse(t.x, t.y, 10, 10);
        }
        //p.fill(0, 255, 0);
        //p.ellipse(projected.x, projected.y, 10, 10);
      };

      Vehicle.prototype.forceFromDirection = function (direction) {
          direction.limit(3);
          var steer = direction.sub(this.getVelocity());
          steer.limit(0.2);
          return steer;
      };

      Vehicle.prototype.separate = function (particles, separateDist) {
        var sum = new Vec2D(), count = 0, steer = new Vec2D();
        for (var i = 0; i < particles.length; i++) {
          var v = particles[i];
          var dist = this.distanceTo(v);
          if (dist > 0 && dist < separateDist) {
            var repelForce = this.sub(v);
            repelForce.normalize();
            repelForce.scaleSelf(1/dist);
            sum.addSelf(repelForce);
            count++;
          }
        }

        if (count > 0) {
          sum.scaleSelf(1/count);
          sum.normalize();
          steer = this.forceFromDirection(sum);
        }
        return steer;
      };

      Vehicle.prototype.coalesce = function (particles) {
        var sum = new Vec2D(), count = 0, steer = new Vec2D();
        for (var i = 0; i < particles.length; i++) {
          var v = particles[i];
          var dist = this.distanceTo(v);
          if (dist > 100 && dist < 500) {
            var attractForce = v.sub(this);
            attractForce.normalize();
            attractForce.scaleSelf(dist);
            sum.addSelf(attractForce);
            count++;
          }
        }

        if (count > 0) {
          sum.scaleSelf(1/count);
          sum.normalize();
          steer = this.forceFromDirection(sum);
        }
        return steer;
      };

      Vehicle.prototype.align = function (particles) {
        var sum = new Vec2D(), count = 0, steer = new Vec2D();
        for (var i = 0; i < particles.length; i++) {
          var v = particles[i];
          var dist = this.distanceTo(v);
          if (dist > 0 && dist < 100 ) {
            var alignForce = v.getVelocity();
            alignForce.normalize();
            alignForce.scaleSelf(1/dist);
            sum.addSelf(alignForce);
            count++;
          }
        }

        if (count > 0) {
          sum.scaleSelf(1/count);
          sum.normalize();
          steer = this.forceFromDirection(sum);
        }
        return steer;

      }

      Vehicle.prototype.act = function (particles) {
          var mouse = this.separate([new Vec2D(p.mouseX, p.mouseY)], 150);
          var separate = this.separate(particles, 30);
          var coalesce = this.coalesce(particles);
          var align = this.align(particles);
          this.addForce(mouse.scale(1));
          this.addForce(separate.scale(0.05));
          this.addForce(coalesce.scale(0.01));
          this.addForce(align.scale(0.05));
      };
      
      function Path(v1, v2) {
        this.start = v1;
        this.line = v2.sub(v1);
        this.radius = 50;

        this.display = function () {
          p.pushStyle();
          p.stroke(100);
          p.translate(this.start.x, this.start.y);
          p.line(0, 0, this.line.x, this.line.y);
          p.popStyle();
        }
      }

      function ParticleSystem() {
        this.particles = [];
        for (var i = 0; i < 100; i++) {
          var x = p.width/2 + p.random(0, 100);
          var y = p.height/2 + p.random(0, 100);
          var v = new Vehicle(x, y);
          this.particles.push(v);
        }

        this.update = function () {
          if (this.nX == undefined) this.nX = 0;
          if (this.nY == undefined) this.nY = 1000;
          this.nY += 1;
          for (var i = 0; i < this.particles.length; i++) {
            var v = this.particles[i];
            v.display();
            v.act(this.particles);
          }
          /*
          //introduce a perlin steering for all particles
          this.nX += 0.002
          var angle = p.map(p.noise(this.nX), 0.2, 0.7, 0, Math.PI*2);
          console.log(p.noise(this.nX));

          var perlinForce = new Vec2D(Math.cos(angle), Math.sin(angle));
          perlinForce.subSelf(0.5);
          this.apply(perlinForce.limit(0.01));
          */
        }

        this.apply = function (f) {
          for (var i = 0; i < this.particles.length; i++) {
            var v = this.particles[i];
            v.addForce(f);
          }
        }
      }

      var ps = new ParticleSystem();


      p.noStroke();
      p.draw = function() {
        p.background(0);
        physics.update();
        ps.update();
      }


    });
  }

  return module;
});
