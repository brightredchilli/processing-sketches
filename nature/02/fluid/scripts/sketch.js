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
      p.ellipse(this.location.x, this.location.y, this.size*this.mass, this.size*this.mass);
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
      var dragMag = l.c * speed * speed;
      var drag = this.velocity.get();
      drag.mult(-1);
      drag.normalize();
      drag.mult(dragMag);
      this.applyForce(drag);
      
    };

    //declare variables
    p.size(800,600);
    p.background(0);

    var l = new Liquid(200, 300, 400, 150, 0.008);

    var movers = [];
    for (var i = 0; i < 5; i++) {
      var m = new Mover();
      m.mass = p.random(1,5);
      movers.push(m);
    }

    p.draw = function() {
      p.background(30);
      
      p.pushStyle();
      p.fill(0,90,210);
      p.rect(l.x, l.y, l.w, l.h);
      p.popStyle();
      var wind = new p.PVector(0.02, 0);
      
    for (var i = 0; i < movers.length; i++) {
      var m = movers[i];
      var gravity = new p.PVector(0, 0.1 * m.mass);
      m.applyForce(gravity);

      if (m.isInside(l)) {
        m.drag(l);
      } else {
        m.applyForce(wind);
      }
      m.update();
      m.display();


    }

    };
  };
  return module;
});
