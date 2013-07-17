define(["processing"], function(Processing) {

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
      }


      function KochLine(x1, y1, x2, y2) {
        this.x1 = x1, this.y1 = y1, this.x2 = x2, this.y2 = y2;
      }

      KochLine.prototype.divide = function () {

        var point1 = new p.PVector(this.x1, this.y1);
        var point2 = new p.PVector(this.x2, this.y2);
        var direction = point2.get(); direction.sub(point1); direction.div(3);

        var currentPoint = point1.get();

        //first line
        var k1 = new KochLine();
        k1.x1 = currentPoint.x;
        k1.y1 = currentPoint.y;
        currentPoint.add(direction);
        k1.x2 = currentPoint.x;
        k1.y2 = currentPoint.y;
        
        //second line
        var k2 = new KochLine();
        k2.x1 = currentPoint.x;
        k2.y1 = currentPoint.y;
        direction.rotate2D(p.radians(-60));
        currentPoint.add(direction);
        k2.x2 = currentPoint.x;
        k2.y2 = currentPoint.y;

        //third line
        var k3 = new KochLine();
        k3.x1 = currentPoint.x;
        k3.y1 = currentPoint.y;
        direction.rotate2D(p.radians(120));
        currentPoint.add(direction);
        k3.x2 = currentPoint.x;
        k3.y2 = currentPoint.y;

        //fourth line
        var k4 = new KochLine();
        k4.x1 = currentPoint.x;
        k4.y1 = currentPoint.y;
        direction.rotate2D(p.radians(-60));
        currentPoint.add(direction);
        k4.x2 = currentPoint.x;
        k4.y2 = currentPoint.y;

        var children = [k1, k2, k3, k4];
        return children;
      }

      KochLine.prototype.draw = function () {
        var v = new p.PVector(this.x1, this.y1);
        var point1 = new p.PVector(this.x1, this.y1);
        var point2 = new p.PVector(this.x2, this.y2);
        var direction = point2.get(); direction.sub(point1); direction.div(3);
        p.colorMode(p.HSB, 1);
        p.stroke(p.map(direction.heading2D(), 0, p.PI*2, 0, 1), 1, 1);
        p.line(this.x1, this.y1, this.x2, this.y2);
      }


      var k = new KochLine(300, 300, 600, 300);

      var lines = new p.ArrayList();
      lines.add(new KochLine(600, 300, 300, 300));
      lines.add(new KochLine(450, 150, 600, 300));
      lines.add(new KochLine(300, 300, 450, 150));


      function step () {
        p.background(255);
        var it = lines.iterator();
        while (it.hasNext()) {
          var cur = it.next();
          cur.draw();
        }

        var cnt = lines.size();
        for (var i = 0; i < cnt; i ++) {
          var line = lines.remove(0);
          lines.addAll(line.divide());
        }

      }

      p.mousePressed = function () {
        step();
      }

      p.smooth();
      p.frameRate(1);
      p.strokeWeight(0.5);
      step();
      p.draw = function() {

        //get the arraylist count

        // for this many times, pop off the first element, and process

       
      }


    });
  }

  return module;
});
