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

      function drawElement(x,y,radius) {
        p.noFill();
        p.rect(x, y, radius*2, radius*2);
        if (radius > 2) {
          drawElement(x - radius, y, radius/2);
          drawElement(x + radius, y, radius/2);
        }
      }

      p.background(255);
      p.smooth();
      p.draw = function() {
        drawElement(p.width/2, p.height/2, 400);
      }


    });
  }

  return module;
});
