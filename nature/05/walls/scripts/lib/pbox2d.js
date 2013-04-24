define(["processing", "box2dweb"], function (Processing, Box2DWeb) {

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

  var yFlip = true;

  function PBox2D (processing_instance) {
    this.world = undefined;
    this.processing = processing_instance;
    this.transX = processing_instance.width/2;
    this.transY = processing_instance.height/2;
    this.scaleFactor = 50;
  }

  PBox2D.prototype.createWorld = function () {
    this.world = new b2World(new b2Vec2(0, -10), true);
  };

  PBox2D.prototype.setGravity = function (vec) {
    if (!vec instanceof b2Vec2) {
      console.log("Error - not a vector in setGravity");
    }
    this.world.m_gravity = vec;
  }

  PBox2D.prototype.coordPixelsToWorld = function (pvec) {
    var x = pvec.x, y = pvec.y;
    var worldX = this.processing.map(x, this.transX, this.transX + this.scaleFactor, 0, 1);
    var worldY = y;
    if (yFlip) {
      worldY = this.processing.map(y, this.processing.height, 0, 0, this.processing.height);
    }
    worldY = this.processing.map(worldY, this.transY, this.transY + this.scaleFactor, 0, 1);

    //console.log("x : " + worldX + " y : " + worldY);
    return new b2Vec2(worldX, worldY);
  }

  PBox2D.prototype.coordWorldToPixels = function (b2vec) {
    var x = b2vec.x, y = b2vec.y;

    var pixelX = this.processing.map(x, 0, 1, this.transX, this.transX + this.scaleFactor);
    var pixelY = this.processing.map(y, 0, 1, this.transY, this.transY + this.scaleFactor);

    if (yFlip) {
      pixelY = this.processing.map(pixelY, 0, this.processing.height, this.processing.height, 0);
    }
    return new this.processing.PVector(pixelX, pixelY);
  }

  PBox2D.prototype.createBody = function(bd) {
    return this.world.CreateBody(bd);
  }

  PBox2D.prototype.pxToWorld = function(px) {
    return px/this.scaleFactor;
  }

  PBox2D.prototype.worldToPx = function(w) {
    return w * this.scaleFactor;
  }

  PBox2D.prototype.step = function (timeStep, velocityIterations, positionIterations) {
    if (arguments.length == 0) {
      var ts = 1/60;
      this.step(ts, 10, 8);
      return;
    }
    this.world.Step(timeStep, velocityIterations, positionIterations);
  }

  PBox2D.prototype.getBodyPixelCoord = function (b) {
    var transform = b.GetTransform();
    return this.coordWorldToPixels(transform.position);
  }

  PBox2D.prototype.destroyBody = function (b) {
    this.world.DestroyBody(b);
  }

  return PBox2D;

});
