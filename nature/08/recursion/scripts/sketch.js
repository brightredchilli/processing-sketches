define(["processing"], function(Processing) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);
      p.strokeWeight(0.1);
      p.rectMode(p.CENTER);

      function drawElement(x,y,radius, bearing) {
        p.noFill();
        p.pushMatrix();
        p.translate(x, y);
        p.rotate(bearing);
        p.rect(0, 0, radius*2, radius*2);
        p.popMatrix();
        if (p.abs(bearing) < 10) {
          drawElement(x - radius/2, y, radius/1.3, bearing + 1.5);
          drawElement(x + radius/2, y, radius/1.3, bearing + 1.5);
        }
      }

      p.background(255);
      p.smooth();
      drawElement(p.width/2, p.height/2, 300, 0);
      p.draw = function() {
      }


    });
  }

  return module;
});
