define(["processing", "particle", "particlesystem", "box2dweb", "pbox2d", "b2box", "b2boundary"], 
    function(Processing, Particle, ParticleSystem, Box2D, PBox2D, Box, Boundary) {;
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
  var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;

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


    function Pair() {
      Particle.call(this);
      this.p1 = new Particle();
      this.p2 = new Particle();

      var bd = new b2BodyDef();
      bd.type = b2Body.b2_dynamicBody;
      
      var cs = new b2CircleShape();
      cs.SetRadius(pbox2d.pxToWorld(10));
      

      bd.position = pbox2d.coordPixelsToWorld(new p.PVector(p.mouseX, p.mouseY));
      var body1 = pbox2d.createBody(bd);
      body1.CreateFixture2(cs, 1);

      bd.position = pbox2d.coordPixelsToWorld(new p.PVector(p.mouseX + Math.random() * 20, p.mouseY + Math.random() * 20));
      var body2 = pbox2d.createBody(bd);
      body2.CreateFixture2(cs, 1);

      this.p1.body = body1;
      this.p2.body = body2;

      
      
      var jd = new b2DistanceJointDef();
      jd.Initialize(body1, body2, body1.GetWorldCenter(), body2.GetWorldCenter()); 
      jd.frequencyHz = 5;
      jd.dampingRatio = 0.05;
      pbox2d.world.CreateJoint(jd);

    }
    Pair.prototype = new Particle();

    Pair.prototype.display = function () {
      p.fill(200);
      var coord1 = pbox2d.getBodyPixelCoord(this.p1.body);
      p.ellipse(coord1.x, coord1.y, 20, 20);

      var coord2 = pbox2d.getBodyPixelCoord(this.p2.body);
      p.ellipse(coord2.x, coord2.y, 20, 20);
      
      p.stroke(240);
      p.line(coord1.x, coord1.y, coord2.x, coord2.y);
    }

    Pair.prototype.updateLifespan = function () {
      this.lifespan -= 1;
      if (this.lifespan == 0) {
        pbox2d.destroyBody(this.p1.body);
        pbox2d.destroyBody(this.p2.body);
      }
    };

    function Bridge() {
      var noop = function () {};

      ParticleSystem.call(this);
      var r = 10;

      var bd = new b2BodyDef();
      var cs = new b2CircleShape();
      cs.SetRadius(pbox2d.pxToWorld(r));

      var display = function () {
        p.fill(200, 30, 100);
        var coord1 = pbox2d.getBodyPixelCoord(this.body);
        p.ellipse(coord1.x, coord1.y, r*2, r*2);
      };

      var numCircles = Math.floor(p.width/(r*2));

      for (var x = 0; x < numCircles; x++) {
        var particle = new Particle();
        particle.updateLifespan = noop;
        bd.position = pbox2d.coordPixelsToWorld(new p.PVector(x * (r*2), p.height/2));
        if (x == 0 || x == numCircles - 1) {
          bd.type = b2Body.b2_staticBody;
        } else {
          bd.type = b2Body.b2_dynamicBody;
        }
        particle.body = pbox2d.createBody(bd);
        particle.body.CreateFixture2(cs, 1);
        particle.display = display;
        this.addParticle(particle);

      }

      for (var i = 0; i < this.particles.size() - 1; i++) {
        var body1 = this.particles.get(i).body;
        var body2 = this.particles.get(i+1).body;
        var jd = new b2DistanceJointDef();
        jd.Initialize(body1, body2, body1.GetWorldCenter(), body2.GetWorldCenter()); 
        jd.length = 0.05;
        jd.frequencyHz = 10;
        jd.dampingRatio = 0.9;
        pbox2d.world.CreateJoint(jd);
      }


      this.updateLifespan = noop;
      this.display = noop;
    }
    Bridge.prototype = new ParticleSystem();


    var boxes = new ParticleSystem();
    boxes.display = function () {}; //surpress warnings

    var bridge = new Bridge();
    boxes.addParticle(bridge);

    Boundary.prototype.display = function () {
      var coord = pbox2d.getBodyPixelCoord(this.body);
      var angle = this.body.GetAngle();
      p.pushMatrix();
      p.translate(coord.x, coord.y);
      p.rotate(-angle);
      p.rectMode(p.CENTER);
      p.fill(255, 42, 20);
      p.rect(0, 0, this.width, this.height);
      p.popMatrix();
    };




    p.mousePressed = function () {
      var pair = new Pair();
      boxes.addParticle(pair);
    }


    /*
    var b1 = new Boundary(150, 300, 300, 30, pbox2d);
    b1.body.SetAngle(0.3);
    boxes.addParticle(b1);
    var b2 = new Boundary(250, 400, 300, 30, pbox2d);
    boxes.addParticle(b2);
    */


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
