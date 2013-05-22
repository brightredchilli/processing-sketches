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

      Vehicle.prototype.separate = function (particles) {
        var sum = new Vec2D(), count = 0;
        for (var i = 0; i < particles.length; i++) {
          var v = particles[i];
          var dist = this.distanceTo(v);
          if (dist > 0 && dist < 50) {
            var repelForce = this.sub(v);
            repelForce.normalize();
            sum.addSelf(repelForce);
            count++;
          }
        }

        if (count > 0) {
          sum.scaleSelf(1/count);
          sum.normalizeTo(5);
          var steer = sum.sub(this.getVelocity());
          steer.limit(0.3);
          this.addForce(steer);
        }
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
          for (var i = 0; i < this.particles.length; i++) {
            var v = this.particles[i];
            v.display();
            v.separate(this.particles);
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
