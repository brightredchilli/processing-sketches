define(["processing"], function() {

  function Mover(){
    this.canvasSize = {};
    this.canvasSize.width = 800, this.canvasSize.height = 600;
    this.location = new Processing.prototype.PVector();
    this.velocity = new Processing.prototype.PVector();
    this.acceleration = new Processing.prototype.PVector();
    this.size = 15;
    this.mass = 10;

    //strategies
    this.checkEdges = function () {
      if (this.location.x > this.canvasSize.width) {
        this.location.x = this.canvasSize.width;
        this.velocity.x *= -1;

      } else if (this.location.x < 0){
        this.location.x = 0;
        this.velocity.x *= -1;
      }

      if (this.location.y > this.canvasSize.height) {
        this.location.y = this.canvasSize.height;
        this.velocity.y *= -1;
      } else if (this.location.y < 0){
        this.location.y = 0;
        this.velocity.y *= -1;
      }

    };

    this.applyForce = function (f) {
      var tmp = f.get();
      tmp.div(this.mass);
      this.acceleration.add(tmp);
    };

    this.update = function () {
      this.velocity.add(this.acceleration);
      this.location.add(this.velocity);
      this.checkEdges();
      this.acceleration.mult(0);
    };
  };


  return Mover;
});
