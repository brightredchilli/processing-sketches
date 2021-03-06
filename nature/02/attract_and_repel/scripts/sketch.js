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
      p.pushStyle();
      p.fill(this.color);
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
      p.popStyle();
    }

    Mover.prototype.isInside = function(l) {
      if ((this.location.x < l.absWidth()) && (this.location.x > l.x)) {
        if ((this.location.y < l.absHeight()) && (this.location.y > l.y)) {
          return true;
        }
      }
      return false;
    };


    //calculate the gravitation attraction based on another mover
    
    Mover.prototype.attract = function(location, mass) {
      var force = p.PVector.sub(this.location, location);
      var distance = force.mag();
      distance = p.constrain(distance, 5, 25);
      force.normalize();

      var strength = (1 * this.mass * mass) / (distance * distance)
        force.mult(strength);
      return force;
    };
    
    Mover.prototype.attractMover = function(m) {
      return this.attract(m.location, m.mass);
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

    Mover.prototype.checkEdges = function(){}; //dont check edges for this sketch

    //declare variables
    p.size(800,600);
    p.background(0);

    var movers = [];

    function createMover(mass) {
      var m1 = new Mover();
      m1.mass = mass;
      m1.size = m1.mass * 10;
      m1.location = new p.PVector.random2d();
      m1.location.mult(100);
      m1.location.add(new p.PVector(300, 300));
      m1.velocity = new p.PVector.random2d();
      m1.velocity.mult(3); //give some random velocity
      m1.color = p.color(p.random(0,150), p.random(0,100), p.random(150,230));
      return m1;
    }

    for (var i = 0; i < 30; i++) {
      var mover = createMover(p.random(1,3));
      movers.push(mover);
    }

    //create some big movers
    var big = createMover(20);
    big.color = p.color(p.random(0,150), p.random(0,100), p.random(150,230));
    //movers.push(big);

    var bg = p.color(30, 30, 30, 20);

    p.noStroke();

    p.draw = function() {

      p.background(0);

      for (var i = 0; i < movers.length; i++) {
        var m = movers[i];

        for (var j = 0; j < movers.length; j++) {
          if (j == i) continue;
          var force = movers[j].attractMover(m);
          m.applyForce(force);
        }
        //apply mouse position
        var mouseForce = m.attract(new p.PVector(p.mouseX, p.mouseY), 10);
        m.applyForce(mouseForce);

        //invisble center gravity to bring forces in again
        var center = m.attract(new p.PVector(p.width/2, p.height/2), 50);
        center.mult(-1);
        m.applyForce(center);

        m.update();
        m.display();
      }
    };

    


  };
  return module;
});
