
define(["processing", "particle", "box2dweb", "pbox2d"], function (Processing, Particle, Box2D, PBox2D) {

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

  function Boundary(x, y, w, h, pbox2d) {
    var p = Processing.instances[0];

    Particle.call(this);

    this.location.x = x;
    this.location.y = y;
    this.width = w;
    this.height = h;

    var bd = new b2BodyDef();
    bd.type = b2Body.b2_staticBody;
    bd.position = pbox2d.coordPixelsToWorld(new p.PVector(x, y));

    var body = pbox2d.createBody(bd);
    var polyShape = new b2PolygonShape();
    polyShape.SetAsBox(pbox2d.pxToWorld(this.width/2), pbox2d.pxToWorld(this.height/2));
    body.CreateFixture2(polyShape, 1);
    this.body = body;
  }
  Boundary.prototype = new Particle();
  Boundary.prototype.updateLifespan = function () {
    //do not die ever
  };
  return Boundary;
});
