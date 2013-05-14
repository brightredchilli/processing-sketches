define(["processing", "toxi", "two"], function(Processing, toxijs, Two) {

  var module = {};

  var Vec2D = toxijs.geom.Vec2D;
  var Rect = toxijs.geom.Rect;
  var GravityBehavior = toxijs.physics2d.behaviors.GravityBehavior;
  var VerletPhysics2D = toxijs.physics2d.VerletPhysics2D;
  var VerletParticle2D = toxijs.physics2d.VerletParticle2D;
  var VerletSpring2D = toxijs.physics2d.VerletSpring2D;
  var VerletConstrainedSpring2D = toxijs.physics2d.VerletConstrainedSpring2D;
  var VerletMinDistanceSpring2D = toxijs.physics2d.VerletMinDistanceSpring2D;
  var PerlinNoise = toxijs.math.noise.PerlinNoise;
  var RectConstraint = toxijs.physics2d.constraints.RectConstraint;

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    /*
       var descriptionElement = document.getElementById("content-description");
       var canvas = document.createElement("canvas");
       contentElement.insertBefore(canvas, descriptionElement);
       module.processing = new Processing(canvas, start);
       */

    function cursorPoint(evt){
      var pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }

    var two = new Two({width : 800, height : 600}).appendTo(contentElement);
    var svg = two.renderer.domElement;
    var physics = new VerletPhysics2D();
    physics.setWorldBounds(new Rect(0, 0, two.width, two.height));

    var background = two.makeRectangle(two.width/2, two.height/2, two.width, two.height);
    background.stroke = "#aaa";

    function Vehicle(x, y) {
      VerletParticle2D.call(this, x, y, 5);
      physics.addParticle(this);

      var poly = two.makePolygon(0, -20, 7, 0, -7, 0,  false);
      poly.fill = "orange";
      poly.stroke = "orangered";
      poly.linewidth = 3;
      poly.translation.set(x, y);
      this.shape = poly;
    }
    Vehicle.prototype = new VerletParticle2D();

    Vehicle.prototype.display = function () {
      this.shape.translation.x = this.x;
      this.shape.translation.y = this.y;
      this.shape.rotation = this.getVelocity().heading() + Math.PI/2;
    };

    Vehicle.prototype.steer = function (x, y) {
      this.clearForce();
      var maxspeed = 5;
      var target = new Vec2D(x, y);
      var desired = target.sub(this);
      var d = desired.magnitude();

      desired.normalize();

      if (d < 100) {
        desired.scaleSelf(Math.floor((d/100) * maxspeed));
      } else {
        desired.scaleSelf(maxspeed);
      }
      var steer = desired.sub(this.getVelocity());
      steer.scaleSelf(0.3); //maxspeed
      if (d > 10) {
        this.addForce(steer);
      } else {
        console.log("UNDER !!  ");
        this.clearVelocity();
      }
    };

    Vehicle.prototype.getRandomX = function () {
      if (this.__perlinStepX === undefined) {
        this.__perlinStepX = Math.random() * 100;
      }
      this.__perlinStepX += 0.5;
      return this.noise.noise(this.__perlinStepX) - 0.5;
    };

    Vehicle.prototype.getRandomY = function () {
      if (this.__perlinStepY === undefined) {
        this.__perlinStepY = Math.random() * 100;
      }
      this.__perlinStepY += 0.5;
      return this.noise.noise(this.__perlinStepY) - 0.5;
    };

    Vehicle.prototype.randomForce = function () {
      if (!this.noise) {
        this.noise = new PerlinNoise();
      }
      var f = new Vec2D(this.getRandomX(), this.getRandomY());
      f.scaleSelf(1);
      this.addForce(f);
    };

    var v = new Vehicle(300, 300);
    var t = new Vehicle(500, 500);
    t.shape.fill = "blue";
    t.shape.stroke = "green";
    t.randomSteer = function () {
      this.randomForce();
      
    };

    //constrain t to not move out of screen
    /*
    var center = new Vehicle(two.width/2, two.height/2);
    center.lock();
    physics.addParticle(center);
    */
    //physics.addSpring(new VerletSpring2D(t, center, 200, 0.03, 1000));


    function mouseDragged (e) {
      var pt = cursorPoint(e);
      t.lock();
      t.x = pt.x;
      t.y = pt.y;
      t.unlock();
    };

    svg.addEventListener("mousedown", mouseDragged, false);

    two.bind('update', function(frameCount) {
      physics.update();
      v.display();
      t.display();
      t.randomSteer();
      v.steer(t.x, t.y);
    }).play();
  }
  return module;
});
