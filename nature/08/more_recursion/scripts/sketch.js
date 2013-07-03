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

      function drawElement(x,y,radius, bearing) {
        p.noFill();
        p.rectMode(p.CENTER);
        p.pushMatrix();
        p.translate(x, y);
        p.rotate(bearing);
        p.rect(0, 0, radius*2, radius*2);
        p.popMatrix();
        if (x < p.width) {
          drawElement(x + 1, y, radius/1.01, bearing + 0.3);
        }
      }

      p.smooth();
      p.background(255);
      p.draw = function() {
        if (p.frameCount < 2) {
          drawElement(p.width/2, p.height/2, 300, 0);
        }

        
      }


    });
  }

  return module;
});
