

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


  function Surface(vertices, pbox2d) {
    Particle.call(this);

    this.vertices = vertices;

    var worldVertices = [];
    for (var i = 0; i < this.vertices.length; i++) {
      worldVertices.push(pbox2d.coordPixelsToWorld(this.vertices[i]));
    }

    var bd = new b2BodyDef();
    var body = pbox2d.createBody(bd);
    var polyShape = new b2PolygonShape();
    polyShape.SetAsArray(worldVertices, worldVertices.length); 
    body.CreateFixture2(polyShape, 1);
    this.body = body;
  }
  Surface.prototype = new Particle();
  Surface.prototype.updateLifespan = function () {};

  Surface.prototype.display = function () {
    var p = Processing.instances[0];
    p.pushStyle();
    p.strokeWeight(2);
    p.stroke(255);
    p.beginShape();
    for (var i = 0; i < this.vertices.length; i++) {
      var v = this.vertices[i];
      p.vertex(v.x, v.y);
      p.pushStyle();
      p.fill(255, 0, 0);
      p.ellipse(v.x, v.y, 5, 5);
      p.popStyle();
    }
    p.endShape();
    p.popStyle();
  }
  return Surface;
});
