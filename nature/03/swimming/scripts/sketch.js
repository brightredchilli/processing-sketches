define(["processing", "mover"], function(Processing, Mover) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes
    
    Mover.prototype.checkEdges = Mover.NoEdges;
    function Fish() {
      this.tailAngle = 0;
      this.tailSpeed = 0;
    }
    Fish.prototype = new Mover();
   
    var superUpdate = Fish.prototype.update;
    Fish.prototype.update = function () {
      superUpdate.apply(this);
      //update tail speed
      this.tailSpeed = 0.1;
      this.tailAngle += this.tailSpeed;
    };

    Fish.prototype.display = function () {
      p.pushMatrix();
      p.translate(this.location.x, this.location.y);
      p.rotate(this.velocity.heading2D() + p.PI/2);

      p.ellipse(0, 0, this.size, this.size);
      p.line(0, 0, 0, -this.size/2); //draw a line from origin to the top of the ellipse

      p.pushMatrix();
      var tailLength = 30;
      var currentSweep = p.sin(this.tailAngle);
      var currentAngle = currentSweep * p.PI/4; //max rotation is 45 deg
      p.rotate(currentAngle);

      //"bendiness" of tail is determined by how far are we on the angle. this is just directly the currentSweep value
      var c1x = 10 * currentSweep;
        p.bezier(0, 0, 
                 c1x, tailLength/4, 
                 c1x, tailLength - tailLength/4, 
                 0, tailLength);
      if(currentSweep < 0) {
      }


      p.popMatrix();
      p.popMatrix();


    };


    //declare variables
    p.size(800,600);
    p.strokeWeight(3);

    var m = new Fish();
    m.location = new p.PVector(300, 300);
    m.velocity = new p.PVector(0, 0);
    m.size = 100;

    var bg = p.color(0,0,0,30);

    p.draw = function() {
      p.pushStyle();
      p.fill(bg);
      p.rect(0,0,p.width,p.height);
      p.popStyle();
      m.update();
      m.display();
    };
  };
  return module;
});
