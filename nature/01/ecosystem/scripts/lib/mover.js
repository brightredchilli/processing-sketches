define(["processing"], function() {

  function Mover(){
    this.location = new Processing.prototype.PVector();
    this.velocity = new Processing.prototype.PVector();
    this.acceleration = new Processing.prototype.PVector();
    this.size = 15;
    this.mass = 10;
  };
  Mover.prototype.canvasSize = {};
  Mover.prototype.canvasSize.width = 800, Mover.prototype.canvasSize.height = 600;

  Mover.prototype.applyForce = function (f) {
    var tmp = f.get();
    tmp.div(this.mass);
    this.acceleration.add(tmp);
  };

  Mover.prototype.update = function () {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.checkEdges();
    this.acceleration.mult(0);
  };


  Mover.EllipseCheckEdges = function () {
    var halfSize = this.size/2;
    if (this.location.x + halfSize > this.canvasSize.width) {
      this.location.x = this.canvasSize.width - halfSize;
      this.velocity.x *= -1;

    } else if (this.location.x - halfSize < 0){
      this.location.x =  halfSize;
      this.velocity.x *= -1;
    }

    if (this.location.y + halfSize > this.canvasSize.height) {
      this.location.y = this.canvasSize.height - halfSize;
      this.velocity.y *= -1;
    } else if (this.location.y - halfSize < 0){
      this.location.y = halfSize;
      this.velocity.y *= -1;
    }

  };

  Mover.RectCheckEdges = function () {
    var halfSize = this.size;
    if (this.location.x + halfSize > this.canvasSize.width) {
      this.location.x = this.canvasSize.width - halfSize;
      this.velocity.x *= -1;

    } else if (this.location.x < 0){
      this.location.x =  0;
      this.velocity.x *= -1;
    }

    if (this.location.y + halfSize > this.canvasSize.height) {
      this.location.y = this.canvasSize.height - halfSize;
      this.velocity.y *= -1;
    } else if (this.location.y < 0){
      this.location.y = 0;
      this.velocity.y *= -1;
    }

  };

  Mover.NoEdges = function () {
    var halfSize = this.size;
    if (this.location.x + halfSize > this.canvasSize.width) {
      this.location.x =  halfSize;

    } else if (this.location.x < 0){
      this.location.x = this.canvasSize.width - halfSize;
    }

    if (this.location.y + halfSize > this.canvasSize.height) {
      this.location.y =  halfSize;
    } else if (this.location.y < 0){
      this.location.y = this.canvasSize.height - halfSize;
    }
  };

  Mover.prototype.checkEdges = Mover.EllipseCheckEdges;

  //physics simulation code

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

  return Mover;
});
