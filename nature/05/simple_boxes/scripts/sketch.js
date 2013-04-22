define(["processing", "particle", "particlesystem", "pbox2d"], function(Processing, Particle, ParticleSystem, PBox2D) {
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

    function Box(x, y) {
      Particle.call(this);
      this.location.x = x;
      this.location.y = y;

      this.size = 15;
      var bd = new b2BodyDef();
      bd.type = b2Body.b2_dynamicBody;
      bd.position = pbox2d.coordPixelsToWorld(new p.PVector(x, y));
      var body = pbox2d.createBody(bd);
      var polyShape = new b2PolygonShape();
      polyShape.SetAsBox(pbox2d.pxToWorld(this.size), pbox2d.pxToWorld(this.size));
      var fd = new b2FixtureDef();
      fd.shape = polyShape;
      fd.friction = 0.3;
      fd.restitution = 0.5;
      fd.density = 1.0;
      body.CreateFixture(fd);
      this.body = body;
    }
    Box.prototype = new Particle();

    Box.prototype.display = function () {
      var coord = pbox2d.getBodyPixelCoord(this.body);
      var angle = this.body.GetAngle();
      p.pushMatrix();
      p.translate(coord.x, coord.y);
      p.rotate(-angle);
      p.rectMode = p.CENTER;
      p.fill(0, 77, 255);
      p.rect(0, 0, this.size, this.size);
      p.popMatrix();
    };

    Box.prototype.updateLifespan = function () {
      // do not die, ever
    };

    var boxes = new ParticleSystem();
    boxes.display = function () {};

    //declare variables
    p.size(800,600);
    p.background(0);

    p.mousePressed = function () {
      var particle = new Box(this.mouseX, this.mouseY);
      boxes.addParticle(particle);
    };

    p.mouseDragged = function () {
      p.mousePressed();
    };

    p.draw = function() {
    p.background(0);
      boxes.run();
      pbox2d.step();
    };
  };
  return module;
});
