define(["processing"], function(Processing) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  };

  function start(p) {
    //declare classes
    
    function Car() {
      var wheelSize = 10, wheelDistance = 10;
      var chassisWidth = 30, chassisHeight = 10;
      this.location = new p.PVector(30, 400);
      this.velocity = new p.PVector(0, 0);
      this.acceleration = new p.PVector(0, 0);

      this.checkEdges = function () {
        if (this.location.x > p.width) {
          this.location.x = 0;
        } else if (this.location.x < 0){
          this.location.x = p.width;
        }

        if (this.location.y > p.height) {
          this.location.y = 0;
        } else if (this.location.y < 0){
          this.location.y = p.height;
        }
      };

      this.update = function () {
        this.velocity.add(this.acceleration);
        this.velocity.limit(10);
        if (this.velocity.x < 0) {
          this.velocity.x = 0;
          this.acceleration.x = 0;
        }

        //update location
        this.location.add(this.velocity);
        this.checkEdges();
      };

      this.display = function () {

        var leftWheel = this.location.get(); leftWheel.add(-wheelDistance, 0);
        var rightWheel = this.location.get(); rightWheel.add(wheelDistance, 0);
        var chassis = this.location.get(); chassis.add(-15, -13);

        p.rect(chassis.x, chassis.y, chassisWidth, chassisHeight);
        p.ellipse(leftWheel.x, leftWheel.y, wheelSize, wheelSize);
        p.ellipse(rightWheel.x, rightWheel.y, wheelSize, wheelSize);
      };

      this.accelerate = function () {
        this.acceleration.add(new p.PVector(0.05, 0));
        this.acceleration.limit(2);
      };

      this.brake = function () {
        this.acceleration.sub(new p.PVector(0.05, 0));
      };
    }

    

    //declare variables
    p.size(800,600);
    p.background(0);

    var car = new Car();
    p.keyPressed = function () {
      if (p.keyCode == p.UP) {
        car.accelerate();
      } else if (p.keyCode == p.DOWN) {
        car.brake();
      }
    };

    p.draw = function() {
      p.background(p.color(0, 0, 0, 200));
      car.update();
      car.display();
    };
  }
  return module;
});
