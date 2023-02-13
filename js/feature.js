"use strict"

/* Written by Olivia*/

class Feature {
  /**
   *
   * @param {number} x x position of feature
   * @param {number} y y position of feature
   * @param {number} width width of the feature
   * @param {number} height height of the feature
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.w = width / 2;
    this.h = height / 2;
    // Shape object arrays to produce feature
    this.strokes = [];
    this.fills = [];
    this.curves = [];

    // to produce guides for debugging
    this.guidesOn = false;
    this.strokeGuides = [];
    this.fillGuides = [];

    // to provide a path based boundary for mouse position detection
    this.boundary = null;
  }

  build() {
    // default build options mostly unused
    if (this.guidesOn) {
      this.addBoundingBox();
      this.addGuides();
    }
  }
  /**
   * Draws all shapes stored in feature
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {

    ctx.save();
    // Apply a clip if it exists
    if (this.clip!=null) { ctx.clip(this.clip)}
    // Fill shapes
    for (const shape of this.fills) {
      ctx.fillStyle = shape.colour;
      ctx.save();
      if (shape.mask!=null) {
        // If the shape itself has its own mask, apply it
        ctx.clip(shape.mask);
      }
      ctx.fill(shape);
      ctx.restore();
    }
    // Stroke shapes
    for (const shape of this.strokes) {
      ctx.strokeStyle = shape.colour;
      ctx.lineWidth = shape.lineWidth;
      ctx.setLineDash(shape.lineDash);
      ctx.stroke(shape);
    }
    ctx.restore();

    // Draw guides
    if (this.guidesOn) {
      for (const shape of this.fillGuides) {
        ctx.fillStyle = shape.colour;
        ctx.fill(shape);
      }
      for (const shape of this.strokeGuides) {
        ctx.strokeStyle = shape.colour;
        ctx.lineWidth = shape.lineWidth;
        ctx.setLineDash(shape.lineDash);
        ctx.stroke(shape);
      }
    }
  }

  addBoundingBox() {
    // A square bounding box
    let path = new Path2D();
    path.moveTo(this.x - this.w, this.y - this.h);
    path.rect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
    this.strokeGuides.push(new Shape(path, "blue", 2, [5, 5]));
  }

  addGuides() {
    let path = new Path2D();
    let fillPath = new Path2D();
    for (let i = 0; i < this.curves.length; i++) {
      let shapes = this.curves[i].drawGuides(path, fillPath);
      this.fillGuides.push(shapes[1]);
      this.strokeGuides.push(shapes[0]);
    }
  }

  toggleGuides() {
    // toggles whether the guides on and off
    if(this.guidesOn) {
      this.fillGuides = [];
      this.strokeGuides = [];
    }
    this.addGuides();
    this.addBoundingBox();
    this.guidesOn = !this.guidesOn;
  }

  within(e) {
    // Checks if shape is within bounding box
    if (e.x < this.x+this.w && e.x > this.x-this.w
    && e.y < this.y+this.h && e.y > this.y-this.h) {
      return true;
    }
    return false;
  }
}