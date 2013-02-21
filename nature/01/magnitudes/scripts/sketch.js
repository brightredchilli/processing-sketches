define(["processing", "gaussian"], function(Processing, Gaussian) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {

    //declare classes

    var mouseStart, mouseEnd, lineDist = 0;


    //declare variables
    p.size(800,600);
    p.background(255);
  

    p.draw = function() {
      lineDist = lineDist > 0 ? lineDist - 30 : 0;
      p.background(255);
      if (p.__mousePressed && mouseStart) {
        p.line(mouseStart.x, mouseStart.y, p.mouseX, p.mouseY);

        mouseEnd = new p.PVector(p.mouseX, p.mouseY);
        lineDist = mouseStart.dist(mouseEnd);


      }
      //draw topLine
      p.pushStyle();
      p.fill(200);
      p.noStroke();
      p.rect(0, 0, lineDist > 0 ? lineDist : 0, 30);
      p.popStyle();
    };

    p.mousePressed = function () {
      mouseStart = new p.PVector(p.mouseX, p.mouseY);
    };

    p.mouseDragged = function () {
      //p.line(mouseStart.x, mouseStart.y, p.mouseX, p.mouseY);
    };
  };
  return module;
});
