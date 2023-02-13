"use strict"

/* Written by Olivia */

// Utility functions to convert radians and degrees
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

class Point {
  /**
   * creates a point at x and y coordinates
   * @param {number} x x coordinates of point
   * @param {number} y y coordinates of point
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Produces a point from an origin point scale distance away at radians
   * @param {Point} origin
   * @param {number} radians
   * @param {number} scale
   * @returns
   */
  static fromVector(origin, radians, scale) {
    return new Point(
      Math.cos(-radians) * scale + origin.x,
      Math.sin(-radians) * scale + origin.y
    );
  }

  /**
   * Returns a new point that has been translated by a vector
   * @param {Point} point the point to translate
   * @param {Point} vector the vector
   * @returns
   */
  static translate(point, vector) {
    return new Point(point.x + vector.x, point.y + vector.y);
  }

  /**
   * Returns the radians between this point and an origin point
   * @param {Point} origin the point to measure radians from
   * @returns
   */
  getRadians(origin) {
    let dy = origin.y - this.y;
    let dx = this.x - origin.x;
    let radians = Math.asin(dy / this.getScale(origin));
    radians = dx < 0 ? Math.PI - radians : radians;
    radians = dy < 0 ? Math.PI * 2 + radians : radians;
    return radians;
  }

  /**
   * Returns the scale of the point from an origin
   * @param {Point} origin the point to measure the scale from
   * @returns
   */
  getScale(origin) {
    return Math.hypot(this.x - origin.x, this.y - origin.y);
  }

  /**
   * Rotates this point arbitrarily from an origin point
   * @param {Point} origin The point to rotate this point from
   * @param {number} degrees The number of degrees to rotate this point
   */
  rotate(origin, degrees) {
    let scale = this.getScale(origin, this);
    let oldRadians = this.getRadians(origin, this);
    let newRadians = oldRadians + toRadians(degrees);
    let p = Point.fromVector(origin, newRadians, scale);
    this.x = p.x;
    this.y = p.y;
  }

  /**
   * Returns a flipped point from origin along both axes or a specified one
   * @param {Point} origin
   * @param {number} direction
   * @returns
   */
  flip(origin, direction = -1) {
    // -1 means flip on both axis,
    // 0 means horizontal flip, 1 means vertical flip
    switch (direction) {
      case 0:
        return new Point(origin.x * 2 - this.x, this.y);
        break;
      case 1:
        return new Point(this.x, 2 * origin.y - this.y);
        break;
      default:
        return new Point(2 * origin.x - this.x, 2 * origin.y - this.y);
    }
  }

  /**
   * Scales this point from an origin point
   * @param {Point} origin the origin from which to scale this point
   * @param {number} scale the scale at which to scale this point
   */
  scale(origin, scale) {
    this.x = (this.x - origin.x) * scale + origin.x;
    this.y = (this.y - origin.y) * scale + origin.y;
  }

  /**
   * translates this point by a certain vector
   * @param {number} vector the vector to translate this point
   */
  translate(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
}

// Given the limitations of how this is evaluated
// we can hide out static constants
const ORIGIN = new Point(0, 0);

// Unused Control Point class to make it eaasier to call commands
class ControlPoint extends Point {
  constructor(x, y, origin) {
    super(x, y);
    this.origin = origin;
  }

  rotate(degrees) {
    super.rotate(this.origin, degrees);
  }

  flip(direction = -1) {
    super.flip(this.origin, direction);
  }

  scale() {
    super.scale(this.origin);
  }

  getRadians() {
    return super.getRadians(this.origin);
  }

  getScale() {
    return super.getScale(this.origin);
  }
}

class Curve {
  /**
   * Creates a Cubic Bezier Curve
   * @param {Point} cp1 Control Point 1
   * @param {Point} cp2 Control Point 2
   * @param {Point} p1  The start point
   * @param {Point} p2  the end point
   */
  constructor(cp1, cp2, p1, p2) {
    this.cp1 = cp1;
    this.cp2 = cp2;
    this.p1 = p1;
    this.p2 = p2;
  }

  /**
   * Adds curve to path2D
   * @param {Path2D} path the path object we want to add this curve to
   * @param {boolean} [positioned=false] whether we need to move the cursor to the starting point
   */
  path(path, positioned = false) {
    // If we are continuing a path, we don't have to move to the first point
    if (!positioned) {
      path.moveTo(this.p1.x, this.p1.y);
    }
    path.bezierCurveTo(this.cp1.x, this.cp1.y,
      this.cp2.x, this.cp2.y,
      this.p2.x, this.p2.y);
  }

  /**
   * Rotates curve by a given amount of degrees
   * @param {Point} origin origin point to rotate this point
   * @param {number} degrees by this number of degrees
   */
  rotate(origin, degrees) {
    this.p1.rotate(origin, degrees);
    this.p2.rotate(origin, degrees);
    this.cp1.rotate(origin, degrees);
    this.cp2.rotate(origin, degrees);
  }

  /**
   * Returns a flipped end control point through the end point
   * @returns The flipped point
   */
  extend() {
    return Point.flip(this.p2, this.cp2);
  }

  /**
   * Draws guidelines for the curve's control points for debugging
   * @param {Path2D} strokePath to add the line from point to control point
   * @param {Path2D} fillPath to add the circles that indicate the control point
   * @param {boolean} positioned whether the first point needs to be used
   * @returns
   */
  drawGuides(strokePath, fillPath, positioned = false) {
    if (!positioned) {
      strokePath.moveTo(this.p1.x, this.p1.y);
    }
    strokePath.lineTo(this.cp1.x, this.cp1.y);
    strokePath.moveTo(this.p2.x, this.p2.y);
    strokePath.lineTo(this.cp2.x, this.cp2.y);

    fillPath.moveTo(this.cp1.x, this.cp1.y);
    fillPath.arc(this.cp1.x, this.cp1.y, 2.5, 0, Math.PI * 2);
    fillPath.moveTo(this.cp2.x, this.cp2.y);
    fillPath.arc(this.cp2.x, this.cp2.y, 2.5, 0, Math.PI * 2);

    let line = new Shape(strokePath, "rgba(0, 0, 0, 0.5)", 1);
    let shape = new Shape(fillPath, "rgba(255, 0, 0, 0.5)");
    return [line, shape];
  }
}

class MirroredCurve extends Curve {
  /**
   * Produces a Mirrored Cubic Bezier Curve
   * @param {Point} cp1 The Control point to be mirroed
   * @param {Point} p1  The start point
   * @param {Point} p2  The end point
   */
  constructor(cp1, p1, p2) {
    let delta = new Point(p2.x - p1.x, p2.y - p1.y);
    let axis = new Point(p2.x, cp1.y);
    let cp2 = Point.translate(cp1, delta).flip(axis);

    super(cp1, cp2, p1, p2);
  }

  /**
   * Moves the control point
   * @param {Point} vector the vector to move the control point by
   */
  translate_control_points(vector) {
    this.cp1.translate(vector);
    this.cp2.translate(Point.flip(ORIGIN, vector));
  }
}

class QuadraticCurve extends Curve {
  /**
   * Creates a Quadratic Curve with one control point
   * @param {Point} cp1 The one Control point
   * @param {Point} p1  The start point
   * @param {Point} p2  The end point
   */
  constructor(cp1, p1, p2) {
    super(cp1, cp1, p1, p2);
  }

  /**
   * Rotates the curve. Quadratic curves need to be managed differently to
   * Bezier curves
   * @param {Point} origin The point to rotate from
   * @param {number} degrees The number of degrees to rotate it
   */
  rotate(origin, degrees) {
    this.p1.rotate(origin, degrees);
    this.p2.rotate(origin, degrees);
    this.cp1.rotate(origin, degrees);
  }

  /**
   * Adds curve to path2D
   * @param {Path2D} path
   * @param {boolean} [positioned=false]
   * @returns
   */
  path(path, positioned = false) {
    if (!positioned) {
      path.moveTo(this.p1.x, this.p1.y);
    }
    path.quadraticCurveTo(this.cp1.x, this.cp1.y,
      this.p2.x, this.p2.y);
  }
}

class Shape extends Path2D {
  /**
   * Creates a shap object that holds information on how a path should be drawn
   * @param {?Path2D|string} path the path object to be drawn
   * @param {?string|CanvasGradient} colour the colour/gradient of shape
   * @param {?Path2D} mask Masks to be applied
   * @param {?number} width the line width if this is a stroked shape
   * @param {?Array} lineDash the line dash style if this is a stroke shape
   */
  constructor(path, colour = "black", mask = null, width = 2, lineDash = []) {
    super(path);
    this.colour = colour;
    this.lineWidth = width;
    this.lineDash = lineDash;
    this.mask = mask;
  }
}

/**
 * Produces a horizontal symmetrical curve
 * @param {CanvasRenderingContext2D} ctx to draw on
 * @param {number} xCoords x coodinates
 * @param {number} yCoords y coordinates
 * @param {number} length distance between start and end point
 * @param {number} height height of curve from
 */



function myCurve(xCoords, yCoords, length, height) {
  let p1 = {x: xCoords-length/2, y: yCoords};
  let p2 = {x: xCoords+length/2, y: yCoords};
  let cp = {x: xCoords, y: yCoords-height};

  path = new Path2D;
  path.moveTo(p1);
  path.QuadraticCurve(cp.x, cp.y, p2.x, p2.y)
  return path;
}
