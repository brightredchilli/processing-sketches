define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start); }

  function start(processing) {
    //declare classes

    //declare variables
    processing.size(500,500);
    processing.background(0);

    //functions

    function procDraw() {
    var noise = 2;
      processing.loadPixels();
      for (var x = 0; x < processing.width; x++) {
        for (var y = 0; y < processing.height; y++) {
          var brightness = processing.map(processing.noise(noise), 0, 1, 0, 255);
          processing.pixels.setPixel(x + y*processing.width, processing.color(brightness));
          noise += 0.003;
        }
      }
      //noise++;
      processing.updatePixels();
    };

    processing.draw = procDraw;
  }
  return module;
});
