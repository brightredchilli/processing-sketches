require.config({
  paths: {
    app: "./",
    processing: "lib/processing-1.4.1-api", //p for processing
    domready: "lib/domready",
    gaussian: "lib/gaussian_random",
    mover: "lib/mover",
    particle: "lib/particle",
    particlesystem: "lib/particlesystem",
    box2dweb: "lib/box2dweb",
    pbox2d: "lib/pbox2d"
  }
});

define(["sketch"], function(Sketch) {
  var canvas = document.getElementById("processing-canvas");
  Sketch.initialize(canvas);
});


 





