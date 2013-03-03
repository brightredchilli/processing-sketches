define(["processing", "mover"], function(Processing, Mover) {
  /*@pjs transparent */
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  };

  function start(p) {
    //declare classes
    var tx = 1;
    
    p.PVector.noise2D = function(tx, ty) {
      var v = new p.PVector();
      v.x = p.noise(tx);
      v.y = p.noise(ty);
      return v;
    };

    p.PVector.random2D = function() {
      var v = new p.PVector(p.random(-1, 1), p.random(-1, 1));
      return v;
    };

    Mover.prototype.display = function () {
      p.ellipse(this.location.x, this.location.y, this.size*this.mass, this.size*this.mass);
    }
    //declare variables
    p.size(800,600);
    p.background(200,20,200);;

    var movers = [];
    
    for (var i = 0; i < 20; i++) {
      var mover = new Mover();
      mover.mass = p.random(1, 5);
      mover.size = 15;
      movers.push(mover);
    }
    
    /*
    var m1 = new Mover();
    m1.mass = 1;
    var m2 = new Mover();
    m2.mass = 20;

    movers.push(m1);
    movers.push(m2);
    */

    console.clear();
    p.draw = function() {
      p.background(p.color(30, 0, 0, 100));


      for (var i = 0; i < movers.length; i++) {
        var mover = movers[i];
        var gravity = new p.PVector(0, 0.1*mover.mass);
        var wind = new p.PVector(0.02, 0);

        mover.applyForce(wind);
        mover.applyForce(gravity);
        mover.update();
        mover.display();
      }
      tx += 0.003;
    };
  }
  return module;
});
