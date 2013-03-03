define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes

    function Liquid(_x, _y, _w, _h, _c) {
      this.x = _x, this.y = _y, this.w = _w, this.h = _h, this.c = _c;

      this.absHeight = function () {
        return this.y + this.h;
      };

      this.absWidth = function () {
        return this.x + this.w;
      };
    }

    Mover.prototype.display = function () {
      p.rect(this.location.x, this.location.y, this.size, this.size);
    }

    Mover.prototype.isInside = function(l) {
      if ((this.location.x < l.absWidth()) && (this.location.x > l.x)) {
        if ((this.location.y < l.absHeight()) && (this.location.y > l.y)) {
          return true;
        }
      }
      return false;
    };

    Mover.prototype.drag = function(l) {
      var speed = this.velocity.mag();
      var dragMag = this.size/10 * l.c * speed * speed;
      var drag = this.velocity.get();
      drag.mult(-1);
      drag.normalize();
      drag.mult(dragMag);
      this.applyForce(drag);
      
    };

    Mover.prototype.checkEdges = Mover.RectCheckEdges;

    //declare variables
    p.size(800,600);
    p.background(0);

    var l = new Liquid(0, 400, p.width, p.height, 0.08);

    var movers = [];
    for (var i = 0; i < 5; i++) {
      var m = new Mover();
      m.mass = 4;
      m.size = p.random(1,6) * 10;
      m.location.x = i*100 + 10;
      movers.push(m);
    }

    p.draw = function() {
      p.background(30);
      
      p.pushStyle();
      p.fill(0,90,210);
      p.rect(l.x, l.y, l.w, l.h);
      p.popStyle();
      
    for (var i = 0; i < movers.length; i++) {
      var m = movers[i];
      var gravity = new p.PVector(0, 0.1 * m.mass);
      m.applyForce(gravity);

      if (m.isInside(l)) {
        m.drag(l);
      } else {
      }
      m.update();
      m.display();


    }

    };
  };
  return module;
});
