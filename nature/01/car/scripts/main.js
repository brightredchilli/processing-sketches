require.config({
  paths: {
    app: "./",
    processing: "lib/processing-1.4.1-api", //p for processing
    domready: "lib/domready",
    gaussian: "lib/gaussian_random"
  }
});

define(["sketch"], function(Sketch) {
  var canvas = document.getElementById("processing-canvas");
  Sketch.initialize(canvas);
});


 





