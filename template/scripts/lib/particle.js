define(["mover"], function(Mover) {

  function Particle() {
    this.lifespan = 255;

  };

  Particle.prototype = new Mover();

  Particle.prototype.updateLifespan = function() {
    this.lifespan -= 1;
  };

  //during update call reduce lifespan
  var superUpdate = Particle.prototype.update;
  Particle.prototype.update = function () {
    superUpdate.call(this);
    this.updateLifespan();
  };

  Particle.prototype.isDead = function () {
    return (this.lifespan < 0);
  };

  //so we dont get runtime errors
  Particle.prototype.display = function () {
    console.log("No display function");
  };

  Particle.prototype.run = function () {
    this.update();
    this.display();
  };
  return Particle;

});
