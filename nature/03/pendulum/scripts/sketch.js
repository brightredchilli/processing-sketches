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
    p.background(255);
    p.smooth();

    var xOffset = 100,
        yOffset = p.height/2,
        start = p.color(33, 106, 234),
        end = p.color(234, 36, 88);


    function Pendulum () {
      this.origin = new p.PVector(0,0);
      this.r = 200;
      this.angle = p.PI/2;
      this.aVelocity = 0;
      this.mass = 30;
      
    }

    Pendulum.prototype.update = function () {

      //calculate force that gravity will have on Pendulum
      var G = 0.5;
      var a = (-1 * G * p.sin(this.angle))/ this.r;

      this.aVelocity += a;
      this.angle += this.aVelocity;

      this.aVelocity *= 0.995; //dampening
    };

    Pendulum.prototype.display = function () {
      p.pushMatrix();
      p.translate(this.origin.x, this.origin.y);
      
      //calculate pendulum location
      var x = p.sin(this.angle) * this.r,
          y = p.cos(this.angle) * this.r;
      p.strokeWeight(4);
      p.stroke(0);
      p.line(0, 0, x, y);
      p.strokeWeight(1);
      p.fill(118, 13, 13);
      p.ellipse(x, y, 50, 50);

      p.pushMatrix();
      p.translate(x, y);
      p.fill(236, 239, 36);
      p.noStroke();

      for (var i = 0; i < 2*p.PI; i+= p.PI/8) {
        var bubbleX = p.cos(i) * 50,
            bubbleY = p.sin(i) * 50;
        p.ellipse(bubbleX, bubbleY, 10, 10);
      }
      p.popMatrix();

      p.popMatrix();

    };

    var pen = new Pendulum();
    pen.origin.set(p.width/2, 100);

    p.draw = function() {
      p.background(255);
      pen.update();
      pen.display();
    };
  };
  return module;
});
