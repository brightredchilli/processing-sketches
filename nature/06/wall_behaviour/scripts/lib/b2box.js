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


  function Box(x, y, pbox2d) {
    this.pbox2d = pbox2d;
    var p = Processing.instances[0];
    Particle.call(this);
    this.lifespan = 200;
    this.location.x = x;
    this.location.y = y;

    this.size = 15;
    var bd = new b2BodyDef();
    bd.type = b2Body.b2_dynamicBody;
    bd.position = pbox2d.coordPixelsToWorld(new p.PVector(x, y));

    //random velocity
    var rx = Math.random();
    var ry = Math.random();
    rx = p.map(rx, 0, 1, -500, 500);
    ry = p.map(ry, 0, 1, -500, 500);
    var r = new p.PVector(rx, ry);
    r = pbox2d.coordPixelsToWorld(r);
    bd.linearVelocity = r;

    body = pbox2d.createBody(bd);
    var polyShape = new b2PolygonShape();
    polyShape.SetAsBox(pbox2d.pxToWorld(this.size/2), pbox2d.pxToWorld(this.size/2));
    var fd = new b2FixtureDef();
    fd.shape = polyShape;
    fd.friction = 0.3;
    fd.restitution = 0.5;
    fd.density = 1.0;
    body.CreateFixture(fd);

    //apply some random force ot the body
    //body.ApplyForce(new b2Vec2(20, 20), body.GetPosition().Copy());

    this.body = body;
  }
  Box.prototype = new Particle();

  Box.prototype.updateLifespan = function () {
    this.lifespan -= 1;
    if (this.lifespan == 0) {
      this.pbox2d.destroyBody(this.body);;
    }
  };
  return Box;
});
