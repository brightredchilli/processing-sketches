define(["processing"], 
    function(Processing) {
      var module = {};

      //processing setup
      module.initialize = function(canvas) {
        module.processing = new Processing(canvas, start);
      }

      function start(p) {
        //declare variables
        p.size(800,600);

        p.draw = function() {
        };
      };
      return module;
    });
