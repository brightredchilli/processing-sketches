define(["scripts/lib/processing-1.4.1-api.js"], function() {
  var module = {};
  var processing;

  //processing setup
  module.start = function(canvas) {
    processing = new Processing(canvas, start);
  }

  function start(processing) {
    //declare classes


    function Walker () {
      var x = processing.width/2;
      var y = processing.height/2;

      this.display = function () {
        processing.stroke(0);
        processing.point(x,y);
        console.log("x : " + x + " y : " + y);
      }

      this.step = function () {

        if (processing.random(1) > 0.90) {
          //move towards the mouse
          x = (processing.mouseX > x) ? x+1 : x-1;
          y = (processing.mouseY > y) ? y+1 : y-1;
        } else {
          var choice = Math.floor(processing.random(4));
          switch(choice) {
            case 0:
              x--;
              break;
            case 1:
              y--;
              break;
            case 2:
              x++;
              break;
            case 3:
              y++;
              break;
          }
        }
      }
    }

    //declare variables
    processing.size(800,600);
    var walker = new Walker();
    
    //functions

    function procDraw() {
      walker.step();
      walker.display();
    };

    processing.draw = procDraw;
  }
  return module;
});
