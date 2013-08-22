define(["processing", "lib/arboreal"], function(Processing, Arboreal) {

  var module = {};

  //processing setup
  module.initialize = function() {
    var contentElement = document.getElementById("content");
    var descriptionElement = document.getElementById("content-description");
    var canvas = document.createElement("canvas");
    contentElement.insertBefore(canvas, descriptionElement);
    module.processing = new Processing(canvas, function (p) {
      p.size(800, 600);

      function DNA () {
        this.score = 0;
        this.genes = [];
      }


      function Phrase (len) {
        DNA.call(this);

        //generate random strings as genes
        for (var i = 0; i < len; i++) {
          this.genes[i] = String.fromCharCode(Math.floor(p.random(32, 91)));
        }
      }
      Phrase.prototype = new DNA();

      Phrase.prototype.calculateFitness = function (phrase) {
        var score = 0;
        for (var i = 0; i < phrase.length; i++) {
          var c = phrase.charAt(i);
          if (c == this.genes[i]) {
            score++;
          }         }
        this.score = score/phrase.length;
        if (this.score == 1) {
          console.log("ALL DONE");
          throw "stop excution";
        }
      }

      Phrase.prototype.mate = function (otherPhrase) {
        var child = new Phrase(otherPhrase.genes.length);
        var random = Math.floor(p.random(0, otherPhrase.genes.length + 1));

        for (var i = 0; i < otherPhrase.genes.length; i++) {
          child.genes[i] = (i < random) ? this.genes[i] : otherPhrase.genes[i];
          if (p.random() < 0.01) {
            child.genes[i] = String.fromCharCode(Math.floor(p.random(32, 91)));
          }
        }
        return child;
      }

      Phrase.prototype.print = function () {
        var desc = "";
        for (var i = 0; i < this.genes.length; i++) {
          desc += this.genes[i];
        }
        console.log(desc);
      }


      var targetPhrase = "YOUVE GOT ME UNDER A SPELL";

      var pool = [];

      for (var i = 0; i < 100; i++) {
        pool[i] = new Phrase(targetPhrase.length);
      }

      p.colorMode(p.HSB, 1);
      p.smooth();
      p.draw = function() {
        p.background(255);

        for (var i = 0; i < pool.length; i++) {
          pool[i].calculateFitness(targetPhrase);
        }

        //get mating pool
        var matingPool = [];
        for (var i = 0; i < pool.length; i++) {
         var n = pool[i].score * pool.length;
         for (var j = 0; j < n; j++) {
           matingPool.push(pool[i]);
         }
        }

        //reproduce
        var highscorer = new Phrase(0);
        highscorer.score = -1;
        for (var i = 0; i < pool.length; i++) {
          var mom = matingPool[Math.floor(p.random(0, matingPool.length))];
          var dad = matingPool[Math.floor(p.random(0, matingPool.length))];
          var child = mom.mate(dad);
          pool[i] = child;
          if (highscorer.score < child.score) {
            highscorer = child;
          } 
        }
        highscorer.print();

      }

    });
  }

  return module;
});
