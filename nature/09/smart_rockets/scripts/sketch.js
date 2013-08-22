define(["processing"], function(Processing, Arboreal) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);

      function DNA () {
        this.score = 0;
        this.genes = [];
      }

      var d = 100;
      var thres = 100;

      var allPoints = [];
      for (var j = 0; j < 100; j++) {
        allPoints.push(new p.PVector(p.random(thres, p.width - thres), p.random(thres, p.height - thres)));
      }
      function Point (point) {
        this.score = 0;
        this.cp1 = new p.PVector(p.random(-d, d), p.random(-d, d));
        this.cp2 = new p.PVector(p.random(-d, d), p.random(-d, d));
      }

      function Curve () {
        this.points = [];
        for (var j = 0; j < 100; j++) {
          this.points.push(new Point(new p.PVector(p.random(0, p.width), p.random(0, p.height))));
          this.points[j].location = allPoints[j];
        }
      }

      Curve.prototype.calculateScore = function () {
        var curve_score = 0;
        for (var j = 2; j < this.points.length; j++) {
          // get point at j and j-1
          var p0 = this.points[j-1];
          var p1 = this.points[j];

          var p0cp2 = p0.location.get(); p0cp2.add(p0.cp2);
          var p1cp1 = p1.location.get(); p1cp1.add(p1.cp1);

          var adj = p0cp2.get();
          adj.sub(p0.location);
          adj.normalize();
          adj.mult(10);
          adj.sub(p0.location);
          p1.cp1 = adj.get();
          p1cp1 = p1.location.get(); p1cp1.add(p1.cp1);


          var line_eq = p0cp2.get();
          line_eq.sub(p0.location);
          line_eq.normalize();
          var start_offset = p0.location.get();
          var a = p1cp1.get();
          a.sub(start_offset);
          var b = a.get();
          var c = b.dot(line_eq);
          line_eq.mult(c);
          a.sub(line_eq);

          var dist = 1/a.mag();
          dist = (dist > 1) ? 1 : dist;
          curve_score += dist;
        }

        this.score = curve_score/(this.points.length-1);
      }

      Curve.prototype.crossover = function (otherParent) {
        var child = new Curve();

        //average the locations of control points in both parents
        for (var j = 0; j < this.points.length; j++) {
          var point = this.points[j];
          var other_point = otherParent.points[j];

          var cp1 = point.cp1.get();
          var cp2 = point.cp2.get();
          var other_cp1 = other_point.cp1.get();
          var other_cp2 = other_point.cp2.get();

          cp1.add(other_cp1); cp1.div(2);
          cp2.add(other_cp2); cp2.div(2);
          child.points[j].cp1 = cp1;
          child.points[j].cp2 = cp2;

          //just copy the locations though
          child.points[j].location = this.points[j].location;

          //once in a while we mutate the whole thing
          if (p.random() < 0.05) {
            child.cp1 = new p.PVector(p.random(-d, d), p.random(-d, d));
            child.cp2 = new p.PVector(p.random(-d, d), p.random(-d, d));
          }
        }
        return child;
      }

      var pool = [];
      var line = [];
      for (var i = 0; i < 100; i++) {
        pool.push(new Curve());
      }

      function drawLine (arr) {
        p.strokeWeight(0.1);
        p.beginShape();
        for (var i = 0; i < arr.length; i++) {
          var point = arr[i];
          if (i == 0) {
            p.vertex(point.x, point.y);
          } else {
            var cp1 = point.location.get(); cp1.add(point.cp1);
            var cp2 = point.location.get(); cp2.add(point.cp2);
            p.bezierVertex(
                cp1.x, cp1.y, 
                cp2.x, cp2.y, 
                point.location.x, point.location.y);
            /*
            p.pushStyle();
            p.stroke(0, 255, 0);
            p.strokeWeight(1);
            p.rect(cp1.x,cp1.y, 5, 5);
            p.rect(cp2.x,cp2.y, 5, 5);
            p.stroke(255, 0, 0);
            for (var i = 0; i < best.points.length; i++) {
            var r = best.points[i].location;
            p.rect(r.x, r.y, 5, 5);
            }
            p.popStyle();
            */
          }
        }
        p.stroke(0);
        p.endShape();
      }


      p.background(255);
      p.smooth();
      p.noFill();
      p.draw = function() {

        var highscore_idx = 0;
        var highscore = -1;

        if (true) {
          //calclulate scores
          for (var i = 0; i < pool.length; i++) {
            pool[i].calculateScore();
            if (pool[i].score > 2) {
              drawLine(pool[i].points);
              throw "stop executing";
            }
          }

          //get mating pool
          var matingPool = [];
          for (var i = 0; i < pool.length; i++) {
            var n = pool[i].score * pool.length;
            for (var j = 0; j < n; j++) {
              matingPool.push(pool[i]);
            }
          }

          //reproduce
          for (var i = 0; i < pool.length; i++) {
            var mom = matingPool[Math.floor(p.random(0, matingPool.length))];
            var dad = matingPool[Math.floor(p.random(0, matingPool.length))];
            var child = mom.crossover(dad);
            child.calculateScore();
            pool[i] = child;

            if (child.score > highscore) {
              highscore_idx = i;
              highscore = child.score;

            }
          }
        }
        
        //display results
        var best = pool[highscore_idx];
        drawLine(best.points);
        console.log(highscore);

        /*
        var a = best.points[1];
        var b = best.points[2];
        var acp2 = a.location.get(); acp2.add(a.cp2);
        var bcp1 = b.location.get(); bcp1.add(b.cp1);
        p.stroke(255,0,0);
        p.strokeWeight(1);
        p.line(a.location.x, a.location.y, acp2.x, acp2.y);
        p.line(acp2.x, acp2.y, bcp1.x, bcp1.y);
        */

       


      }

    });
  }

  return module;
});
