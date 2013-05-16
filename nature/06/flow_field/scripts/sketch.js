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


    function FlowField (width, height, size)  {
      this.size = size;
      this.rows = Math.floor(height/size);
      this.cols = Math.floor(width/size);
      
      this.perlinNoise = new PerlinNoise();

      //initialize array of arrays
      this.flowfield = [];
      for (var i = 0; i < this.rows; i++) {
        this.flowfield[i] = [];
      }
      var xoff = 1, yoff = 2, zoff = 0, step = 0.4;
      //vector for every field
      for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
          var theta = this.perlinNoise.noise(xoff, yoff) * Math.PI*2;
          var vec = new Vec2D(Math.cos(theta), Math.sin(theta));
          this.flowfield[i][j] = vec;
          xoff += step;
        }
        yoff += step;
      }
    }
    FlowField.prototype.lookup = function(x, y) {
      var row = Math.floor(y/this.size);
      var col = Math.floor(x/this.size);

      if (row < this.rows && row >= 0 && col < this.cols && col >= 0) {
        return this.flowfield[row][col].copy();
      }
      return new Vec2D(0,0);
     
    };


    function MaxVelocityConstraint (max) {
      this.max = max;
    }
    MaxVelocityConstraint.prototype.applyConstraint = function (particle) {
      var d = particle.getVelocity().magnitude() - this.max;
      if (d > 0) {
        particle.addForce(particle.getVelocity().getInverted().limit(d));
      }
    }

    function Vehicle (x, y) {
      VerletParticle2D.call(this, x, y, 5);
      this.addConstraint(new MaxVelocityConstraint(5));
      physics.addParticle(this);
      this.lifespan = 200 + Math.random()*100;

      var poly = new Two.Polygon([new Two.Vector(0, -20), new Two.Vector(5, -10), new Two.Vector(-5, -10)], true, false);
      poly.fill = "orange";
      poly.stroke = "orangered";
      poly.linewidth = 3;
      poly.translation.set(x, y);
      two.add(poly);
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
      this.addForce(steer);
    };

    Vehicle.prototype.updateLifespan = function () {
      this.lifespan -= 1;
    };

    Vehicle.prototype.getRandomX = function () {
      if (this.__perlinStepX === undefined) {
        this.__perlinStepX = Math.random() * 100;
      }
      this.__perlinStepX += 0.3;
      return this.noise.noise(this.__perlinStepX) - 0.5;
    };

    Vehicle.prototype.getRandomY = function () {
      if (this.__perlinStepY === undefined) {
        this.__perlinStepY = Math.random() * 100;
      }
      this.__perlinStepY += 0.3;
      return this.noise.noise(this.__perlinStepY) - 0.5;
    };

    Vehicle.prototype.randomForce = function () {
      if (!this.noise) {
        this.noise = new PerlinNoise();
      }
      var f = new Vec2D(this.getRandomX(), this.getRandomY());
      f.scaleSelf(0.3);
      this.addForce(f);
    };

    Vehicle.prototype.avoidWall = function () {
      //try to avoid walls
      var padding = 50;
      var force = 0.3;
      if (this.x < padding) {
        this.addForce(new Vec2D(force, 0));
      } 
      if (this.x > two.width - padding) {
        this.addForce(new Vec2D(-force, 0));
      } 
      
      if (this.y < padding) {
        this.addForce(new Vec2D(0, force));
      } 
      if (this.y > two.height - padding) {
        this.addForce(new Vec2D(0, -force));
      } 
    };

    Vehicle.prototype.follow = function (flowfield) {
      var force = flowfield.lookup(this.x, this.y);
      force.scaleSelf(0.05);
      this.addForce(force);
    };

    
    var system = [];
    system.addRandom = function () {
      var x = (Math.random() < 0.5) ? -two.width-20 : two.width + 20;
      var y = Math.random() * two.height;


      var newVehicle = new Vehicle(x, y);
      var vx = (x < 0) ? 1 : -1;
      var vy = 0;
      newVehicle.addForce(new Vec2D(vx, vy)); //give it initial force
      this.push(newVehicle);
    };

    for(var i = 0; i < 50; i++) {
      //system.addRandom();
    }

    var ff = new FlowField(two.width, two.height, 10);



    two.bind('update', function(frameCount) {
      physics.update();

      if (frameCount % 5 == 0) {
        system.addRandom();
      }


      for (var i = 0; i < system.length; i++) {
        //system[i].randomForce();
        //system[i].avoidWall();
        system[i].follow(ff);
        system[i].display();
        system[i].updateLifespan();
      }
      //remove old entries
      for (var i = 0; i < system.length;) {
        if (system[i].lifespan < 0) {
          physics.removeParticle(system[i]);
          two.scene.remove(system[i].shape);
          system.splice(i,1);
        } else {
          i++;
        }
      }


      
    }).play();
  }
  return module;
});
