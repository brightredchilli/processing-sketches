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

    var xoffSpan = document.getElementById("xoff_display");
    var yoffSpan = document.getElementById("yoff_display");

    var xoff = 0, yoff = 2; 
    function procDraw() {

      var currentXOff = 0, currentYOff = 0;
      //functions
      processing.loadPixels();
      for (var x = 0; x < processing.width; x++) {
        for (var y = 0; y < processing.height; y++) {
          var brightness = processing.map(processing.noise(xoff + currentXOff ,yoff+ currentYOff), 0, 1, 0, 255);
          processing.pixels.setPixel(x + y*processing.width, processing.color(brightness));
          currentYOff += 0.003;
        }
        currentXOff += 0.003;
      }
      processing.updatePixels();
      xoffSpan.textContent = xoff;
      yoffSpan.textContent = yoff;

      xoff += 0.003;
      yoff += 0.003;

    };

    processing.draw = procDraw;
  }
  return module;
});
