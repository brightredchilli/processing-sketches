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
    b2box: "lib/b2box",
    b2boundary: "lib/b2boundary",
    b2surface: "lib/b2surface",
    pbox2d: "lib/pbox2d",
    toxi: "lib/toxi",
    two: "lib/two"
    //two: "lib/two.min"
  }

});

define(["sketch"], function(Sketch) {
  Sketch.initialize();
});


 





