define(["processing"], function(Processing) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);

      function CA (_rulenum) {
        this.cellsize = 10;
        this.rows = Math.ceil(p.height/this.cellsize), this.cols = Math.ceil(p.width/this.cellsize), this.generation = 0;

        this.cells = [];
       
        for (var i = 0; i < this.cols; i++) {
          this.cells[i] = 0;
          this.cells[i] = Math.random() < 0.5 ? 0 : 1;
        }
        this.cells[Math.floor(this.cols/2)] = 1;

        //set rules
        var bin = _rulenum.toString(2);

        this.ruleset = [];
        for (var i = 0; i < bin.length; i++) {
          this.ruleset.push(parseInt(bin[i], 2))
        }
        this.ruleset.reverse();
      }

      CA.prototype.draw = function () {
        for (var i = 0; i < this.cols; i++) {
            if (this.cells[i] == 1) {
              p.fill(0);
              p.rect(i*this.cellsize, this.generation*this.cellsize, this.cellsize, this.cellsize);
            }
        }
      }

      CA.prototype.rules = function (l, m, r) {
        var str = "" + l + m + r;
        var idx = parseInt(str, 2);
        return this.ruleset[idx];
      }

      CA.prototype.step = function () {
        this.generation++;
        var newcells = [];
        newcells[0] = 0;
        newcells[this.cols-1] = 0;
        for (var i = 1; i < this.cols - 1; i++) {
          var l = this.cells[i-1], m = this.cells[i], r = this.cells[i+1];
          newcells[i] = this.rules(l,m,r);
        }
        this.cells = newcells;
      }

      var ca = new CA(90);


      p.background(255);
      p.draw = function() {
        ca.draw();
        ca.step();

        if (ca.generation > ca.rows) {
          p.background(255);
          ca = new CA(p.random(0, 255));
        }
      }


    });
  }

  return module;
});
