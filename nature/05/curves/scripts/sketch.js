define(["processing", "particle", "particlesystem", "box2dweb", "pbox2d", "b2box", "b2boundary", "b2surface"], 
    function(Processing, Particle, ParticleSystem, Box2D, PBox2D, Box, Boundary, Surface) {;
  var module = {};

  var b2Vec2 = Box2D.Common.Math.b2Vec2;
  var b2BodyDef = Box2D.Dynamics.b2BodyDef;
  var b2Body = Box2D.Dynamics.b2Body;
  var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
  var b2Fixture = Box2D.Dynamics.b2Fixture;
  var b2World = Box2D.Dynamics.b2World;
  var b2MassData = Box2D.Collision.Shapes.b2MassData;
  var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
  var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
  var b2AABB = Box2D.Collision.b2AABB;
  var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  //processing setup
  module.initialize = function(canvas) {
    module.processing = new Processing(canvas, start);
  }

  function start(p) {
    //declare variables
    p.size(800,600);
    p.background(0);
    //declare classes
    var nX = 0, nY = 100;

    var pbox2d = new PBox2D(p);
    pbox2d.createWorld();
    pbox2d.setGravity(new b2Vec2(0, -100));

    Box.prototype.display = function () {
      var coord = pbox2d.getBodyPixelCoord(this.body);
      var angle = this.body.GetAngle();
      p.pushMatrix();
      p.translate(coord.x, coord.y);
      p.rotate(-angle);
      p.rectMode(p.CENTER);
      p.fill(0, 77, 255);
      p.rect(0, 0, this.size, this.size);
      p.popMatrix();
    };

    
    Boundary.prototype.display = function () {
      var coord = pbox2d.getBodyPixelCoord(this.body);
      var angle = this.body.GetAngle();
      p.pushMatrix();
      p.translate(this.location.x, this.location.y);
      p.rotate(-angle);
      p.rectMode(p.CENTER);
      p.fill(255, 42, 20);
      p.rect(0, 0, this.width, this.height);
      p.popMatrix();
      p.fill(255);
      p.rect(coord.x, coord.y, 5, 5);
    };

    var boxes = new ParticleSystem();
    boxes.display = function () {}; //surpress warnings
    
    //var b1 = new Boundary(0, 300, 400, 30);;
    //boxes.addParticle(b1);
    var b2 = new Boundary(300, 300, 100, 100, pbox2d);
    boxes.addParticle(b2);

    var vertices = [];
    vertices.push(new p.PVector(p.width, p.height/2+130));
    vertices.push(new p.PVector(p.width/2, p.height/2 - 30));
    vertices.push(new p.PVector(0, p.height + 50));
    vertices.push(new p.PVector(p.width/2, p.height/2 + 200));
    //var s = new Surface(vertices);
    //boxes.addParticle(s);

    var curvyVertices = [];
    var t = 0;
    curvyVertices.push(new p.PVector(p.width, p.height/2 + 150));
    for (var x = p.width-20; x > 0; x -= 100) {;
      var n = p.noise(t);
      n = p.map(n, 0, 1, p.height/2, p.height/2 +150);
      curvyVertices.push(new p.PVector(x, n));
      t += 0.03;
    }
    curvyVertices.push(new p.PVector(0, p.height/2 + 150));
    var c = new Surface(curvyVertices, pbox2d);
    boxes.addParticle(c);


    p.mousePressed = function () {
      var particle = new Box(this.mouseX, this.mouseY, pbox2d);
      boxes.addParticle(particle);
    };


    p.draw = function() {
      p.background(0);
      boxes.run();
      pbox2d.step();
      if (p.__mousePressed) {
        p.mousePressed();
      }
      nX += 0.005, nY += 0.005;
    };
  };
  return module;
});
