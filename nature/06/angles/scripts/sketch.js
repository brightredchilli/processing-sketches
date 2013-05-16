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
    //physics.setWorldBounds(new Rect(0, 0, two.width, two.height));

    var background = two.makeRectangle(two.width/2, two.height/2, two.width, two.height);
    background.stroke = "#aaa";


    /*
    var bar = two.makePolygon(0, -5, 200, -5, 200, 5, 0, 5, false);
    bar.stroke = "white";
    bar.fill = "white";
    bar.translation.set(two.width/2, two.height/2);
    */


    var vec = new Vec2D(two.width/2, two.height/2); //this represents the bar at start state
    var list = new Bars(two.width, two.height, 100);


    function Bars (x, y, width) {
      this.bars = [];
      for (var i = 0; i < x+width; i += width) {
        for (var j = 0; j < y+width; j += width) {
          var bar = two.makePolygon(0, -5, width, -5, width, 5, 0, 5, false);
          bar.stroke = "white";
          bar.fill = "white";
          bar.translation.set(i, j);
          this.bars.push(bar);
        }
      }

      this.update = function (theta) {
        for (var i = 0; i < this.bars.length; i++) {
          this.bars[i].rotation = theta;
        }
      }
    }



    function mouseDragged (e) {
      var pt = cursorPoint(e);
      var mouse = new Vec2D(pt.x, pt.y);
      var rot = mouse.sub(vec);
      var theta = rot.heading();
      list.update(theta);

      var hslString = "hsl(" + Math.floor(theta/(Math.PI*2) * 255) + ", 100%, 50%)";
      //background.fill = "hsl(10, 100, 100)";
      theta = Math.abs(theta);
      var r = Math.floor(Math.sin(theta)*255), g = Math.floor(Math.sin(theta)*255), b = Math.floor(Math.cos(theta)*255) % 255;

      //background.fill = "rgba(" + r + ", " + g + ", " + b + ", 1)";
      background.fill = hslString;
     // console.log(background.fill);
      //background.fill = "rgb(10, 230, 30)";



    };

    svg.addEventListener("mousemove", mouseDragged, false);

    two.bind('update', function(frameCount) {
      physics.update();

      
    }).play();
  }
  return module;
});
