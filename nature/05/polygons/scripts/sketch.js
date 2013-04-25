define(["processing", "particle", "particlesystem", "box2dweb", "pbox2d", "b2surface"], 
    function(Processing, Particle, ParticleSystem, Box2D, PBox2D, Surface) {;
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
    pbox2d.setGravity(new b2Vec2(0, -10));

  Surface.prototype.display = function () {

    var pos = pbox2d.getBodyPixelCoord(this.body);
    var a = this.body.GetAngle();

    var f = this.body.GetFixtureList();
    var ps = f.GetShape();

    
    p.pushStyle();
    p.translate(pos.x, pos.y);
    p.rotate(-a);
    p.strokeWeight(2);
    p.stroke(255);
    p.beginShape();
    for (var i = 0; i < ps.GetVertexCount(); i++) {
      var v = ps.GetVertices()[i];
      v = pbox2d.vectorWorldToPixels(v);
      p.vertex(v.x, v.y);
      p.pushStyle();
      p.fill(255, 0, 0);
      p.ellipse(v.x, v.y, 5, 5);
      p.popStyle();
    }
    p.endShape();
    p.popStyle();
  }

    var boxes = new ParticleSystem();
    boxes.display = function () {}; //surpress warnings
    

    var vertices = [];
    vertices.push(new p.PVector(100, 20));
    vertices.push(new p.PVector(50, 0));
    vertices.push(new p.PVector(0, 20));
    vertices.push(new p.PVector(10, 60));

    var c = new Surface(vertices, pbox2d);
    boxes.addParticle(c);


    p.mousePressed = function () {
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
