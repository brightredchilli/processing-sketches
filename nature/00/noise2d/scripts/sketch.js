define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start); 
  };

  function start(processing) {
    //declare classes

    //declare variables
    processing.size(500,500);
    processing.background(0);

    var xoffSpan = document.getElementById("xoff_display");
    var yoffSpan = document.getElementById("yoff_display");

    var zoff = 0;
    function procDraw() {

      var currentXOff = 0;
      //functions
      processing.loadPixels();
      for (var x = 0; x < processing.width; x++) {
        var currentYOff = 0;
        for (var y = 0; y < processing.height; y++) {
          var brightness = processing.map(processing.noise(currentXOff, currentYOff, zoff), 0, 1, 0, 255);
          processing.pixels.setPixel(x + y*processing.width, processing.color(brightness));
          currentYOff += 0.003;
        }
        currentXOff += 0.003;
      }
      processing.updatePixels();

      zoff += 0.005;

    }

    processing.draw = procDraw;
  }
  return module;
});
