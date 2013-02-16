define(["processing", "gaussian"], function(Processing, Gaussian) {
  var module = {};

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare classes


    //declare variables
    p.size(800,600);
    p.background(0);

    p.draw = function() {
    };
  };
  return module;
});
