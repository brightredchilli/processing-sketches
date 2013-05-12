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

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    /*
       var descriptionElement = document.getElementById("content-description");
       var canvas = document.createElement("canvas");
       contentElement.insertBefore(canvas, descriptionElement);
       module.processing = new Processing(canvas, start);
       */

    var two = new Two({width : 800, height : 600}).appendTo(contentElement);
    var physics = new VerletPhysics2D();
    physics.setWorldBounds = new Rect(0, 0, two.width, two.height);

    var background = two.makeRectangle(two.width/2, two.height/2, two.width, two.height);
    background.stroke = "#aaa";

    function Vehicle(x, y) {
      VerletParticle2D.call(this, x, y, 5);
      physics.addParticle(this);

      this.shape = two.makePolygon(0, -20, 7, 0, -7, 0,  false);
      this.shape.translation = new Two.Vector(this.x, this.y);

    }
    Vehicle.prototype = new VerletParticle2D();

    Vehicle.prototype.update = function () {
      this.shape.translation = new Two.Vector(this.x, this.y);
    };

    Vehicle.prototype.steer = function (target) {
    };
    var v = new Vehicle(300, 300);


    two.bind('update', function(frameCount) {
      v.update();

    }).play();
  }
  return module;
});
