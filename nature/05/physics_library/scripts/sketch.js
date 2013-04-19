define(["processing", "pbox2d"], function(Processing, PBox2D) {
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
    //declare classes

    var pbox2d = new PBox2D(p);
    pbox2d.createWorld();

    var bd = new b2BodyDef();
    bd.position = pbox2d.coordPixelsToWorld(new p.PVector(p.width/2, p.height/2));

    var body = pbox2d.createBody(bd);

    var polyShape = new b2PolygonShape();
    polyShape.SetAsBox(pbox2d.coordPixelsToWorld(50), pbox2d.coordPixelsToWorld(50));

    var fd = new b2FixtureDef();
    fd.shape = polyShape;
    fd.friction = 0.3;
    fd.restitution = 0.5;
    fd.density = 1.0;
    
    body.createFixture(fd);


    //declare variables
    p.size(800,600);
    p.background(0);

    p.draw = function() {
    };
  };
  return module;
});
