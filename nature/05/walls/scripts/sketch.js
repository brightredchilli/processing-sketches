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
    //declare variables
    p.size(800,600);
    p.background(0);
    //declare classes
    var nX = 0, nY = 100;

    var pbox2d = new PBox2D(p);
    pbox2d.createWorld();
    pbox2d.setGravity(new b2Vec2(0, -100));
   
    function Box(x, y) {
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

      var body = pbox2d.createBody(bd);
      var polyShape = new b2PolygonShape();
      polyShape.SetAsBox(pbox2d.pxToWorld(this.size), pbox2d.pxToWorld(this.size));
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
      this.lifespan -= 1;
      if (this.lifespan == 0) {
        pbox2d.destroyBody(this.body);
      }
    };

    function Boundary(x, y, w, h) {
      Particle.call(this);

      this.location.x = x;
      this.location.y = y;
      this.width = w/2;
      this.height = h/2;

      var bd = new b2BodyDef();
      bd.type = b2Body.b2_staticBody;
      bd.position = pbox2d.coordPixelsToWorld(new p.PVector(x, y));

      var body = pbox2d.createBody(bd);
      var polyShape = new b2PolygonShape();
      polyShape.SetAsBox(pbox2d.pxToWorld(this.width), pbox2d.pxToWorld(this.height));
      body.CreateFixture2(polyShape, 1);
      this.body = body;
    }
    Boundary.prototype = new Particle();
    Boundary.prototype.updateLifespan = function () {
      //do not die ever
    };
    Boundary.prototype.display = function () {
      var coord = pbox2d.getBodyPixelCoord(this.body);
      var angle = this.body.GetAngle();
      p.pushMatrix();
      p.translate(this.location.x, this.location.y);
      p.rotate(-angle);
      p.rectMode = p.CENTER;
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
    var b2 = new Boundary(300, 300, 100, 100);
    boxes.addParticle(b2);

    p.mousePressed = function () {
      var particle = new Box(this.mouseX, this.mouseY);
      boxes.addParticle(particle);
    };


    p.draw = function() {
      p.background(0);
      p.fill(150);
      p.rect(0, 0, 100, 100);
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
