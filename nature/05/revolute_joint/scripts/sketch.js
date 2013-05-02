define(["processing", "particle", "particlesystem", "box2dweb", "pbox2d", "b2box", "b2boundary"], 
    function(Processing, Particle, ParticleSystem, Box2D, PBox2D, Box, Boundary) {
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
      var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;

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
          p.translate(coord.x, coord.y);
          p.rotate(-angle);
          p.rectMode(p.CENTER);
          p.fill(255, 42, 20);
          p.rect(0, 0, this.width, this.height);
          p.popMatrix();
        };

        var boxes = new ParticleSystem();
        boxes.display = function () {}; //surpress warnings

        p.mousePressed = function () {
        }

        function CircleSystem (x, y) {
          ParticleSystem.call(this);

          this.location.x = x;
          this.location.y = y;


          this.p1 = new Boundary(p.width/2, p.height/2, 10, 10, pbox2d);
          this.p2 = new Box(p.width/2, p.height/2 - 100, pbox2d);
          this.p2.updateLifespan = function () {};
          this.addParticle(this.p1);
          this.addParticle(this.p2);

          var rjd12 = new b2RevoluteJointDef();
          rjd12.Initialize(this.p1.body, this.p2.body, this.p1.body.GetWorldCenter());
          rjd12.enableMotor = true;
          rjd12.motorSpeed = p.PI*2;
          rjd12.maxMotorTorque = 5; 
          pbox2d.world.CreateJoint(rjd12);

          this.p3 = new Box(p.width/2, p.height/2 - 150, pbox2d);
          this.p3.updateLifespan = function () {};
          this.addParticle(this.p3);


          this.updateLifespan = function () {};
          this.display = function () {};
        }

        CircleSystem.prototype = new ParticleSystem();

        var cs = new CircleSystem(p.width/2, p.height/2);


        /*
           var b1 = new Boundary(150, 300, 300, 30, pbox2d);
           b1.body.SetAngle(0.3);
           boxes.addParticle(b1);
           var b2 = new Boundary(250, 400, 300, 30, pbox2d);
           boxes.addParticle(b2);
           */


        p.noStroke();
        p.draw = function() {
          cs.run();
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
