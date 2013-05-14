define(["processing", "toxi", "two"], function(Processing, toxi, Two) {

  var module = {};

  var Vec2D = toxi.geom.Vec2D;
  var Rect = toxi.geom.Rect;
  var GravityBehavior = toxi.physics2d.behaviors.GravityBehavior;
  var VerletPhysics2D = toxi.physics2d.VerletPhysics2D;
  var VerletParticle2D = toxi.physics2d.VerletParticle2D;
  var VerletSpring2D = toxi.physics2d.VerletSpring2D;
  var VerletConstrainedSpring2D = toxi.physics2d.VerletConstrainedSpring2D;
  var VerletMinDistanceSpring2D = toxi.physics2d.VerletMinDistanceSpring2D;
  var PerlinNoise = toxi.math.noise.PerlinNoise;

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
    physics.setWorldBounds = new Rect(0, 0, two.width, two.height);

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
      var target = new Vec2D(x, y);
      var desired = target.sub(this);
      var steer = desired.sub(this.getVelocity());
      steer.limit(0.3); //maxspeed
      if(desired.magnitude() > 50) {
        this.addForce(steer);
      }
      
    };


    var v = new Vehicle(300, 300);
    var t = new Vehicle(500, 500);

    var target; 

    function mouseDragged (e) {
      var pt = cursorPoint(e);
      if (target) {
        target.translation.x = pt.x;
        target.translation.y = pt.y;
      } else {
        target = two.makeCircle(pt.x, pt.y, 5);
        target.fill = "blue";
      }

    };

    svg.addEventListener("mousedown", mouseDragged, false);

    two.bind('update', function(frameCount) {
      physics.update();
      v.display();
      if (target) {
        v.steer(target.translation.x, target.translation.y);
      }
    }).play();
  }
  return module;
});
