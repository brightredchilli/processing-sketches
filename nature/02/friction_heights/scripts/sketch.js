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
    Mover.prototype.inPlay = false; //this special, 'in play' variable lets us know if we should affect gravity on this mover

    //declare variables
    p.size(800,600);
    p.background(0);

    var l = new Liquid(0, 400, p.width, p.height, 0.08);
    var movers = [];

    p.draw = function() {
      p.background(30);

      p.pushStyle();
      p.fill(0,90,210);
      p.rect(l.x, l.y, l.w, l.h);
      p.popStyle();

      for (var i = 0; i < movers.length; i++) {
        var m = movers[i];
        if (m.inPlay == true) {
          var gravity = new p.PVector(0, 0.1 * m.mass);
          m.applyForce(gravity);
          if (m.isInside(l)) {
            m.drag(l);
          } else {
          }
        }
        m.update();
        m.display();
      }
    };

    p.mouseClicked = function () {
      //if mouse clicked, then create a mover object, and add it to the list
      var m = new Mover();
      m.mass = 4;
      m.size = 60;
      m.location.x = p.mouseX;
      m.location.y = p.mouseY;
      movers.push(m);
    };

    var button = document.getElementById("go-button");
    button.onclick = function() {
      for (var i = 0; i < movers.length; i++) {
        movers[i].inPlay = true;
      }
    };
  };
  return module;
});
