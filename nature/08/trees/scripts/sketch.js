define(["processing", "lib/arboreal"], function(Processing, Arboreal) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);
      p.strokeWeight(0.5);

      p.PVector.prototype.rotate2D = function (theta) {
        var xTmp = this.x;
        this.x =  this.x * p.cos(theta) - this.y * p.sin(theta);
        this.y =  xTmp * p.sin(theta) + this.y * p.cos(theta);
        return this;
      }

      function Branch (_parent, _origin, _direction, _level) {
        this.parentNode = _parent;
        this.origin = _origin;
        this.direction = _direction;
        this.children = undefined;
        this.level = _level;
      }

      Branch.prototype.split = function () {
        if (this.children) {
          for (var i = 0; i < this.children.length; i++) {
            this.children[i].split();
          }
        } else if (this.children == undefined && this.direction.mag() > 2) {
          /*
          var newDirection = this.direction.get();
          newDirection.mult(2/3);
          var b1 = new Branch(this, null, newDirection.get().rotate2D(p.radians(p.random(-70, 70))), this.level + 0.5);
          var b2 = new Branch(this, null, newDirection.get().rotate2D(p.radians(p.random(-70, 70))), this.level + 0.5);
          var b3 = new Branch(this, null, newDirection.get().rotate2D(p.radians(p.random(-70, 70))), this.level + 0.5);
          this.children = [b1, b2, b3];
          */

          this.children = [];
          for (var i = 0; i < 2; i ++) {
            var newDirection = this.direction.get();
            newDirection.mult(p.random(0.5, 0.8));
            var b1 = new Branch(this, null, newDirection.get().rotate2D(p.radians(p.random(-70, 70))), this.level + 0.5);
            this.children.push(b1);
          }

        } 
      };

      Branch.prototype.draw = function () {
        var accu = new p.PVector();
        var parentNode = this;
        while (true) {
          if (parentNode.parentNode == undefined) {
            break;
          } else {
            parentNode = parentNode.parentNode;
            var d = parentNode.direction.get();
            d.mult(-1);
            accu.add(d);
          }
        }
        accu.mult(-1); //get the offset from origin

        var offset = parentNode.origin.get();
        offset.add(accu);

        p.pushMatrix();
        p.strokeWeight(5/this.level);
        p.translate(offset.x, offset.y);
        p.line(0, 0, this.direction.x, this.direction.y);
        p.popMatrix();
      };

      Branch.prototype.drawAll = function () {
        this.draw();
        if (this.children) {
          for (var i = 0; i < this.children.length; i++) {
            this.children[i].drawAll();
          }

        }
      }

      Branch.prototype.fasterDraw = function(origin)  {
        
        p.pushMatrix();
        //p.stroke(p.map(this.direction.heading2D(), p.PI, -p.PI, 0, 1), 1, 1);
        p.translate(origin.x, origin.y);
        p.strokeWeight(5/this.level);
        p.line(0, 0, this.direction.x, this.direction.y);
        p.popMatrix();
        
        if (this.children) {
          var cachedEnd = origin.get();
          cachedEnd.add(this.direction);
          for (var i = 0; i < this.children.length; i++) {
            this.children[i].fasterDraw(cachedEnd);
          }
        }
      };

      Branch.prototype.applyNoise = function(n) {
        if (p.random(0, 1) > 0.7) {
          this.direction.rotate2D(n);
        }

        if (this.children) {
          for (var i = 0; i < this.children.length; i++) {
            this.children[i].applyNoise(n);
          }
        }
      }

      function splitBranches(b, num) {
        while (num > 0) {
          b.split();
          num--;
        }
      }



      function step () {
        p.background(255);
      }

      var b = new Branch(undefined, new p.PVector(400, 400), new p.PVector(0, -100), 1);
      splitBranches(b, 20);

      p.colorMode(p.HSB, 1);
      p.smooth();
      p.draw = function() {
        p.background(255);
        b.fasterDraw(b.origin);
        var noise = p.noise(p.frameCount * 0.005);
        noise = p.map(noise, 0, 1, -0.01, 0.01);
        b.applyNoise(noise);
      }

    });
  }

  return module;
});
