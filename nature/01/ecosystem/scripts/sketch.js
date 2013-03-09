define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes


    //declare variables
    p.size(800,600);
    p.background(0);

    var movers = [];
    for(var i = 0; i < 20; i++) {
      var m = new Mover();
      m.location.add(new p.PVector(300, 300));
      m.size = 30;
      var r = new p.PVector.random2d();
      r.mult(200);;
      m.location.add(r);
      movers.push(m);
    }

    Mover.prototype.display = function () {
      p.ellipse(this.location.x, this.location.y, this.size, this.size);
    };

    var checkEdges = Mover.prototype.checkEdges;
    Mover.prototype.checkEdges = function () {

      for (var i = 0; i < movers.length; i++) {
        var m = movers[i];
        if(this != m) {
          var direction = p.PVector.sub(this.location, m.location);
          if (direction.mag() < this.size) {
            this.applyForce(direction);
            direction.mult(-1);
            m.applyForce(direction);
          }
        }
      }
      checkEdges.call(this);

    };

    p.draw = function() {
      renderBackground();

      movers.forEach(function (m) {
        var force = new p.PVector.random2d();
        force.mult(1);
        m.applyForce(force);
        m.update();
        m.display();
      });




    };

    function renderBackground() {
      /*
      var pg = p.createGraphics(p.width, p.height);
      pg.background(34, 100, 200, 50);;
      p.image(pg);
      */

      p.pushStyle();
      p.fill(34, 100, 200, 60);
      p.rect(0,0,p.width,p.height);
      p.popStyle();
    }
  }
  return module;
});
