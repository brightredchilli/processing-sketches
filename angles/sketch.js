
var canvas, cellHeight, 
    cols = 0, 
    rows = 6,
    northColor = color(0, 100, 100),
    southColor = color(0, 190, 100),
    eastColor = color(0, 280, 100),
    westColor = color(0, 100, 130);

setup = function () {
  canvas = createGraphics(window.innerWidth, window.innerHeight);
  cellHeight = ceil(height/rows);
  cols = ceil(width/cellHeight);
  noStroke();
}

draw = function () {

  var v = PVector.sub(new PVector(mouseX, mouseY), new PVector(width/2, height/2));
  var heading = v.heading();

  //figure out which quadrant we are in.
  var fillColor; 
  if(heading > 0) { //south
    if(heading > HALF_PI) { //west
      fillColor = lerpColor(southColor, westColor, (heading-HALF_PI)/HALF_PI);
    } else { //east
      fillColor = lerpColor(eastColor, southColor, heading/HALF_PI);
    }

  } else { //north
    if(heading > -HALF_PI) { //east
      fillColor = lerpColor(eastColor, northColor, -heading/HALF_PI);


    } else { //west
      fillColor = lerpColor(northColor, westColor, -(heading + HALF_PI)/HALF_PI);
    }
  }
  background(fillColor[0], fillColor[1], fillColor[2]);

  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      pushMatrix();
      translate(j * cellHeight + cellHeight/2, i * cellHeight + cellHeight/2);
      rotate(heading);
      rect(-cellHeight/2, -10, cellHeight, 20);
      popMatrix();
    }
  }
};


