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

    var xoff = 0; 
    var xoffSpan = document.getElementById("xoff_display");
    var yoffSpan = document.getElementById("yoff_display");
    var skip = 0;
    function procDraw() {
      //functions
      skip++;
      if ((skip % 2) == 0) {
        return;
      }
      processing.loadPixels();
      for (var x = 0; x < processing.width; x++) {
        var yoff = 0;
        for (var y = 0; y < processing.height; y++) {
          var brightness = processing.map(processing.noise(xoff,yoff), 0, 1, 0, 255);
          processing.pixels.setPixel(x + y*processing.width, processing.color(brightness));
          yoff += 0.003;
        }
        xoff += 0.003;
      }
      processing.updatePixels();
      xoffSpan.textContent = xoff;
      yoffSpan.textContent = yoff;

    };

    processing.draw = procDraw;
  }
  return module;
});
