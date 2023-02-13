"use strict";

/* Written by Olivia*/

const SKIN_COLOUR = "#F2AE7E";
const SKIN_HIGHLIGHT = "#FCB683";
const SKIN_SHADOW = "#da9a6c";
const HAIR_COLOUR = "#16286a";
const HAIR_HIGHLIGHT = "#1d358c";
const HAIR_SHADOW = "#0e1a44";
const LINEART = "#663333";
const HIGHLIGHT = "#ffcca8";
const PINK_LIP_LOWER = "#FF82AC";
const PINK_LIP_UPPER = "#CC728C";
const PINK_LIP_LINE = "#AA4465";
const EYE_COLOUR = "rgb(5,100,5)";

class Eye extends Feature {
  constructor(x, y, width, height, colour = `black`, iris_radius = height / 3) {
    super(x, y, width, height);
    this.iris_radius = iris_radius;
    this.closeState = false;
    this.colour = colour;
    this.squinting = false;
    this.enraged = false;
    this.build();
  }

  build() {
    let path = new Path2D();
    let p = [];
    let cp = [];
    // Upper lid Points
    p.push(new Point(this.x - this.w, this.y));
    p.push(new Point(this.x + this.w, Math.floor(this.y + this.h * 2 / 5)));
    cp.push(new Point(this.x - this.w / 10, this.y - this.h * 7 / 10));
    cp.push(new Point(
      this.x + this.w - this.w * 2 / 5, this.y - this.h * 8 / 10));
    this.curves.push(new Curve(cp[0], cp[1], p[0], p[1]));
    // Lower lid Points
    cp.push(new Point(p[0].x + this.w * 3 / 10, this.y + this.h));
    this.curves.push(new QuadraticCurve(cp[2], p[1], p[0]));

    // Brow ridge points
    p.push(new Point(this.x - this.w / 2, this.y - this.h * 1.4));
    cp.push(new Point(this.x + this.w * 1.4, this.y - this.h * 1.4));
    p.push(new Point(
        this.x + this.w * 1.6, this.y + Math.floor(this.h * 2 / 5)));
    this.curves.push(new QuadraticCurve(cp[3], p[2], p[3]));
    // eye shadow
    p.push(new Point(this.x - 20, this.y + 10));
    cp.push(Point.fromVector(p[4], toRadians(85), 20));
    cp.push(Point.fromVector(p[4], toRadians(-45), 20));
    this.curves.push(new QuadraticCurve(cp[5], p[3], p[0]));
    this.curves.push(new QuadraticCurve(cp[4], p[0], p[2]));

    this.generate();
    super.build();
  }

  generate(p) {
    let path = new Path2D();
    this.strokes = [];
    this.fills = [];
    let mask;
    this.curves[1].cp1.x = this.x - this.w * 7 / 10;
    this.curves[1].cp1.y = this.y + this.h;
    if (this.squinting) {
      this.curves[1].cp1.x += 30;
      this.curves[1].cp1.y -= 2;
    } else if (this.enraged) {
      this.curves[1].cp1.x += 10;
      this.curves[1].cp1.y += 10;
    }

    if (!this.closeState) {
      //upper lid
      this.curves[0].path(path);
      this.strokes.push(new Shape(path, LINEART));
    }
    //lower lid
    this.curves[1].path(path);
    if (!this.closeState) {
      mask = path;
    }
    else if (this.strokes.length < 1) {
      this.strokes.push(new Shape(path, LINEART));
    } else {
      this.strokes[0] = new Shape(path, LINEART);
    }

    path = new Path2D();
    // brow ridge
    this.curves[2].path(path);
    if(this.strokes.length == 1) {
      this.strokes.push(new Shape(path, LINEART));
    } else {
      this.strokes[1] = new Shape(path, LINEART);
    }


    this.curves[3].path(path, true);
    this.curves[4].path(path, true);
    if(this.fills.length == 1) {
      this.fills.push(new Shape(path, SKIN_SHADOW));
      this.fills.push(new Shape(mask, "white"));
    }
    else
    {
      this.fills[0] = new Shape(path, SKIN_SHADOW);
      this.fills[1] =new Shape(mask, "white");
    }

    if (!this.closeState) {
      path = new Path2D();
      // eye
      path.moveTo(this.x + this.iris_radius, this.y);
      path.arc(this.x, this.y, this.iris_radius, 0, Math.PI * 2);
      if(this.fills.length == 2) {
        this.fills.push(new Shape(path, this.colour, mask));
      } else {
        this.fills[2] = new Shape(path, this.colour, mask)
      }
      //pupil
      path = new Path2D();
      path.moveTo(this.x + this.iris_radius / 2, this.y);
      path.arc(this.x, this.y, this.iris_radius / 2, 0, Math.PI * 2);
      if(this.fills.length == 3) {
        this.fills.push(new Shape(path));
      } else {
        this.fills[3] = (new Shape(path));
      }
    }
  }

  close() {
    this.closeState = !this.closeState;
    this.generate();
  }

  squint() {
    this.squinting = !this.squinting;
    this.generate();
  }

  enrage() {
    this.enraged = !this.enraged;
    this.generate();
  }
}

class Brow extends Feature {
  constructor(x, y, width, height, colour = "black") {
    super(x, y, width, height);

    this.outer_y = y - Math.floor(height / 10) / 2;
    this.inner_y = this.y;
    this.raise_outer_state = false;
    this.raise_inner_state = false;
    this.colour = colour;
    this.furrowed = false;
    this.build();
    this.furrowedAmount = 0;
    this.furrowOrigin;
  }

  build() {
    let p = [];
    let cp = [];
    let path = new Path2D();
    p.push(new Point(this.x - this.w, this.outer_y));
    cp.push(new Point(
      this.x + this.w * 3 / 10, this.outer_y - this.h * 11 / 10));
    cp.push(new Point(
      this.x + this.w * 8 / 10, this.outer_y - this.h * 9 / 10));
    p.push(new Point(this.x + this.w, this.y - 5));
    cp.push(new Point(this.x + this.w / 2, this.outer_y + this.h * 9 / 10));
    cp.push(new Point(this.x + this.w * 1.1, this.y - this.h));
    this.curves.push(new Curve(cp[0], cp[1], p[0], p[1]));
    this.curves.push(new Curve(cp[2], cp[3], p[1], p[0]));
    this.curves[0].path(path);
    this.curves[1].path(path, true);
    this.fills.push(new Shape(path, this.colour));

    this.furrowOrigin = Point.fromVector(
      new Point(this.x, this.y), toRadians(-80), 45)
    super.build();
  }
  /**
   *
   * @param {number} degree
   */
  furrow(degree = 30) {
    let path = new Path2D();
    let to_furrow = 0;
    if (!this.furrowed && degree != 0) {
      this.furrowedAmount = degree;
      to_furrow = degree;
      this.furrowed = true;
    } else if (this.furrowed && degree == 0) {
      this.furrowed = false;
      to_furrow = -this.furrowedAmount;
      this.furrowAmount = 0;
    }
    if (to_furrow != 0) {
      // this.curves[0].p1.rotate(this.furrowOrigin, to_furrow);
      this.curves[0].p2.rotate(this.furrowOrigin, to_furrow);
      // this.curves[0].cp1.rotate(this.furrowOrigin, to_furrow);
      this.curves[0].cp2.rotate(this.furrowOrigin, to_furrow);
      this.curves[1].cp1.rotate(this.furrowOrigin, to_furrow);
      // this.curves[1].cp2.rotate(this.furrowOrigin, to_furrow);
      this.curves[0].path(path);
      this.curves[1].path(path, true);
      this.fills[0] = new Shape(path, this.colour);
    }
  }

  reset() {
    this.furrow(0);
  }

  switch(degree) {
    this.furrow(0);
    this.furrow(degree);
  }
}

class EyeController {
  constructor(x, y, width, height, spread, scale, colour) {
    this.x = x;
    this.eye_y = y;
    let brow_height = y * 2 / 24 * scale;
    this.brow_y = y - brow_height * scale;
    this.eye_width = width / 2 * scale;
    this.brow_width = width * 0.75 * scale;
    this.height = height / 2 * scale;
    this.spread = spread / 2 * scale;
    this.colour = colour;
    this.build();
  }

  build() {
    this.eyes = [];
    this.brows = []
    for (let i = 0; i < 2; i++) {
      let x = this.x - this.spread + 2 * this.spread * i
      this.eyes[i] = new Eye(x, this.eye_y, this.eye_width, this.height,
        this.colour[0][i]);
      this.brows[i] = new Brow(x, this.brow_y, this.brow_width, this.height,
        this.colour[1]);
    }
  }

  blink(eye = -1) {
    if (eye < 0) {
      for (let i = 0; i < 2; i++) {
        this.eyes[i].close();
      }
    }
    else {
      this.eyes[eye].close();
    }
  }

  draw(ctx) {
    ctx.save();
    for (let i = 0; i < 2; i++) {
      if (!this.eyes[i].closeState) {
        let path = new Path2D();
        path.moveTo(this.eyes[i].x + this.eyes[i].iris_radius / 4 * (1 - 2 * i),
            this.eyes[i].y - 2);
        path.arc(this.eyes[i].x + 2 * (1 - 2 * i), this.eyes[i].y - 2,
            this.eyes[i].iris_radius / 4, 0, Math.PI * 2);
        this.eyes[i].fills.push(new Shape(path, "white"));
      }
      this.eyes[i].draw(ctx);
      this.brows[i].draw(ctx);
      ctx.translate(this.spread * 2, 0);
      ctx.scale(-1, 1);
    }
    ctx.restore();
  }

  toggleGuides() {
    for (const eye of this.eyes) {
      eye.toggleGuides();
    }
    for (const brow of this.brows) {
      brow.toggleGuides();
    }
  }

  furrow(degree) {
    for (const brow of this.brows) {
      brow.switch(degree);
    }
  }
}

class Nose extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.build();
  }

  build() {
    let path = new Path2D();
    let p = [];
    let cp = [];
    p.push(new Point(this.x - this.w * 8 / 10, this.y));
    cp.push(Point.fromVector(p[0], toRadians(250), 20));

    p.push(new Point(this.x - this.w / 2, this.y + this.h * 5 / 8));
    cp.push(Point.fromVector(p[p.length - 1], toRadians(160), 10));
    cp.push(cp[cp.length - 1].flip(p[p.length - 1]));
    cp[2].scale(p[p.length - 1], 0);

    p.push(new Point(this.x - this.w * 2 / 10, this.y + this.h * 6 / 8));
    cp.push(Point.fromVector(p[2], toRadians(150), 5));
    cp.push(cp[3].flip(p[p.length - 1]));

    p.push(p[2].flip(CENTER, 0));
    cp.push(cp[3].flip(CENTER, 0));
    cp.push(cp[3].flip(CENTER, 0));

    p.push(p[1].flip(CENTER, 0));
    cp.push(cp[1].flip(CENTER, 0));
    cp.push(cp[0].flip(CENTER, 0));

    p.push(p[0].flip(CENTER, 0));
    this.curves.push(new Curve(cp[0], cp[1], p[0], p[1]));
    this.curves.push(new Curve(cp[2], cp[3], p[1], p[2]));
    this.curves.push(new MirroredCurve(cp[4], p[2], p[3]));
    this.curves.push(new Curve(cp[5], cp[6], p[3], p[4]));
    this.curves.push(new Curve(cp[7], cp[8], p[4], p[5]));
    for (let i = 0; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 0);
    }
    this.strokes.push(new Shape(path, LINEART));

    cp.push(cp[cp.length - 1].flip(p[p.length - 1]));

    p.push(new Point(this.x, this.y - this.h));
    cp.push(Point.fromVector(p[p.length - 1], 0, 10));
    cp.push(cp[cp.length - 1].flip(p[p.length - 1]));
    cp.push(cp[0].flip(p[0]));
    this.curves.push(new Curve(cp[9], cp[10], p[5], p[6]));
    this.curves.push(new Curve(cp[11], cp[12], p[6], p[0]));


    for (let i = 5; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 0);
    }
    // This was a suggestion on how to scale a path. it creates a DOMMatrix
    // with fuctions to manipulate the scale and translate. it produces the
    // desired effect of adding a highlight on top of the nose the shape of the
    // nose
    const m = document.createElementNS(
        "http://www.w3.org/2000/svg", "svg").createSVGMatrix();
    let t = m.scale(0.6);
    t = t.translate(0, canvas.height * 0.4 - this.y * 0.1);
    let newPath = new Path2D();
    newPath.addPath(path, t);
    this.fills.push(new Shape(newPath, HIGHLIGHT));
    super.build();
  }
}

class Lips extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.snarl = 0;
    this.wide = 0;
    this.lipThickness = 0;
    this.colour = [
      ["#FF82AC", "#CC728C", "#AA4465"],
      ["#8b4e23", "#6a3c1b", "#492912"],
      ["#1d358c", "#16286a", "#0e1a44"],
      ["#c60606", "#940505", "#590303"]
    ];
    this.colourState = 0;
    this.build();
  }

  build() {
    let p = [];
    let cp = [];

    // Upper lip points
    p.push(new Point(this.x - this.w - 2, this.y));
    p.push(new Point(0, this.y - this.h * 3 / 4));
    p.push(new Point(this.x + this.w, this.y));
    p.push(new Point(this.x, this.y + this.h / 4));

    // Upper lip control points
    cp.push(Point.fromVector(p[0], toRadians(30), 30));
    cp.push(cp[0].flip(CENTER, 0));
    cp.push(Point.fromVector(p[2], Math.PI, this.w / 2));
    cp.push(cp[2].flip(CENTER, 0));

    // Lower lip points and control points
    p.push(new Point(this.x, this.y + this.h));
    cp.push(Point.fromVector(p[0], toRadians(-20), 25));
    cp.push(Point.fromVector(p[4], Math.PI, 25));
    cp.push(cp[5].flip(p[1], 0));
    cp.push(cp[4].flip(p[1], 0));

    // Lip line
    cp.push(Point.fromVector(p[2], toRadians(150), 25)); //8
    p.push(new Point(this.x, this.y)); //5
    cp.push(Point.fromVector(p[5], 0, 10));
    cp.push(cp[9].flip(p[5], 0));
    cp.push(cp[8].flip(p[5], 0));
    this.curves = [];
    this.curves.push(new QuadraticCurve(cp[0], p[0], p[1]));
    this.curves.push(new QuadraticCurve(cp[1], p[1], p[2]));
    this.curves.push(new QuadraticCurve(cp[2], p[2], p[3]));
    this.curves.push(new QuadraticCurve(cp[3], p[3], p[0]));

    this.curves.push(new Curve(cp[4], cp[5], p[0], p[4]));
    this.curves.push(new Curve(cp[6], cp[7], p[4], p[2]));

    this.curves.push(new Curve(cp[8], cp[9], p[2], p[5]));
    this.curves.push(new Curve(cp[10], cp[11], p[5], p[0]));

    this.generate();
  }

  generate() {
    this.fills = [];
    this.strokes = [];
    let path = new Path2D();
    // bottom lip
    for (let i = 4; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 4);
    }
    this.fills.push(new Shape(path, this.colour[this.colourState][0]));
    // top lip
    path = new Path2D();
    for (let i = 0; i < 4; i++) {
      this.curves[i].path(path, i > 0);
    }
    this.fills.push(new Shape(path, this.colour[this.colourState][1]));
    //lip line
    path = new Path2D();
    for (let i = 2; i < 4; i++) {
      this.curves[i].path(path, i > 2);
    }
    this.strokes.push(new Shape(path, this.colour[this.colourState][2], 2));
    super.build();
  }

  /**
   * Raises the lip edge
   * @param {number} value
   */
  raise(value) {
    this.snarl = Math.max(Math.min(value, 30), -30);
    this.curves[0].p1.y = this.y + this.snarl;
    this.curves[2].p1.y = this.y + this.snarl;
    this.curves[5].cp2.x = this.x + 22 - this.snarl;
    this.curves[4].cp1.x = this.x - 22 + this.snarl;
    this.generate();
  }

  /**
   * Changes the lip colour
   */
  changeColour() {
    this.colourState = (this.colourState + 1) % this.colour.length;
    this.generate();
  }

  /**
   * Widens the mouth
   * @param {number} value
   */
  widen(value) {
    this.stretch = Math.max(Math.min(value, 50), -50);
    this.curves[0].p1.x = this.x - this.w - this.stretch;
    this.curves[2].p1.x = this.x + this.w + this.stretch;
    this.generate();
  }
}

class Cheek extends Feature {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   * @param {CanvasRenderingContext2D} ctx
   * @param {Path2D} clip
   * @param {string[][]} colour
   */
  constructor(x, y, width, height, clip, colour = [[SKIN_HIGHLIGHT]]) {
    super(x, y, width, height);
    this.snarl = 0;
    this.colour = colour;
    this.build();
    this.clip = clip;
    this.lowered = false;
  }

  /**
   * Builds the cheek shape
   * @param {CanvasRenderingContext2D} ctx
   */
  build() {
    let p = [];
    let cp = [];

    // Add unlying gradient colours
    let path = new Path2D();
    path.arc(this.x, this.y, 200, 0, Math.PI * 2);
    this.fills.push(new Shape(path, this.colour[0]));

    path = new Path2D();
    path.arc(-this.x, this.y, 200, 0, Math.PI * 2)
    this.fills.push(new Shape(path, this.colour[1]));

    // front face

    // create jaw line
    p.push(new Point(this.x - this.w * 15 / 16, this.y - this.h)); // 0
    p.push(Point.fromVector(p[0], toRadians(-70), 40)); // 1
    p.push(Point.fromVector(p[1], toRadians(-50), 50)); // 2
    p.push(Point.fromVector(p[2], toRadians(-75), 60)); // 3
    p.push(Point.fromVector(p[3], toRadians(-55), 40)); // 4
    p.push(new Point(0, this.h + this.y + 30)); // 5
    // reflect jawline
    for (let i = 4; i >= 0; i--) {
      p.push(p[i].flip(p[5], 0));
    }
    // create crown
    p.push(Point.fromVector(p[10], toRadians(120), 80)); // 11
    p.push(new Point(0, this.y - this.h * 9 / 4))
    // reflect crown
    for (let i = 11; i >= 10; i--) {
      p.push(p[i].flip(p[5], 0));
    }

    // create control points to build curves
    cp.push(Point.fromVector(p[0], toRadians(-90), 20));
    cp.push(Point.fromVector(p[1], toRadians(-55) + Math.PI, 20));
    cp.push(Point.fromVector(p[1], toRadians(-55), 20));
    cp.push(Point.fromVector(p[2], toRadians(-60) + Math.PI, 20));
    cp.push(Point.fromVector(p[2], toRadians(-60), 10));
    cp.push(Point.fromVector(p[3], toRadians(-55) + Math.PI, 20));
    cp.push(Point.fromVector(p[3], toRadians(-55), 20)); // for angry [6]
    cp.push(Point.fromVector(p[4], toRadians(-55) + Math.PI, 20));
    cp.push(Point.fromVector(p[4], toRadians(-65), 10))
    cp.push(Point.fromVector(p[5], Math.PI, 18)); // 9
    for (let i = 9; i >= 0; i--) {
      cp.push(cp[i].flip(p[5], 0));
    }
    cp.push(Point.fromVector(p[10], toRadians(100), 40));
    cp.push(Point.fromVector(p[11], toRadians(-40), 20));
    cp.push(Point.fromVector(p[11], toRadians(-40) + Math.PI, 20));
    cp.push(Point.fromVector(p[12], 0, 40));
    for (let i = 23; i >= 18; i--) {
      cp.push(cp[i].flip(p[12], 0));
    }
    // Create curves
    for (let i = 0; i < cp.length; i += 2) {
      let i2 = i + 1;
      this.curves.push(new Curve(cp[i], cp[i2], p[i / 2], p[(i2 - i / 2) % p.length]));
    }
    // Add Cheek shape and gradient
    this.generate();

    super.build();
  }
  /**
   * Some features require a separationg between the curves that have been built
   * and the creation of the shape, path-style pairs to allow for them to be
   * manipualted and updated easily. That is the purpose of generate();
   * it is usually added at the end of the function that manipulates points in
   * curves
   */
  generate() {
    let path = new Path2D();
    for (let i = 0; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 0);
    }
    // Add Cheek shape and gradient
    this.boundary = path;
    if (this.fills[3] == null) {
      this.fills.push(new Shape(path, this.colour[2]));
    } else {
      this.fills[3] = new Shape(path, this.colour[2]);
    }

  }

  /**
   * Changes the shape of the face around the mouth when angry
   */
  lower() {
    if (!this.lowered) {
      this.lowered = true;
      this.curves[3].cp1.y += 20;
      this.curves[3].cp1.x -= 20;
      this.curves[6].cp2.x += 10;
      this.curves[6].cp2.y += 10;
      this.generate();
    } else {
      this.lowered = false;
      this.curves[3].cp1.y -= 20;
      this.curves[3].cp1.x += 20;
      this.curves[6].cp2.x -= 10;
      this.curves[6].cp2.y -= 10;
      this.generate();
    }
  }
}

class Ear extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.build();
  }

  build() {
    let p = [];
    let cp = [];
    let path = new Path2D();
    p.push(new Point(this.x + this.w * 4 / 5, this.y - this.h * 3 / 4));
    p.push(new Point(this.x - this.w, this.y - this.h * 4 / 8));
    p.push(new Point(this.x + this.w, this.y + this.h));

    cp.push(Point.fromVector(p[0], toRadians(140), 30));
    cp.push(Point.fromVector(p[1], toRadians(100), 20));
    cp.push(cp[1].flip(p[1]));
    cp[2].scale(p[1], 2)
    cp.push(Point.fromVector(p[2], toRadians(170), 30));
    cp.push(Point.fromVector(p[2], toRadians(0), 20));
    cp.push(cp[0].flip(p[0]));

    this.curves.push(new Curve(cp[0], cp[1], p[0], p[1]));
    this.curves.push(new Curve(cp[2], cp[3], p[1], p[2]));
    this.curves.push(new Curve(cp[2], cp[3], p[1], p[2]));

    for (let i = 0; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 0);
    }

    this.boundary = path;
    this.fills.push(new Shape(path, SKIN_SHADOW));
    // this.toggleGuides();
    super.build();
  }
}

class Face extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.build();
  }

  build() {
    let p = [];
    let cp = [];
    let path = new Path2D();

    // Points for shape
    p.push(new Point(this.x - this.w, this.y - this.h * 1 / 50));
    p.push(Point.fromVector(p[0], toRadians(290), 120));
    p.push(new Point(this.x - this.w * 1 / 10, this.y + this.h));
    p.push(p[2].flip(CENTER, 0));
    p.push(p[1].flip(CENTER, 0));
    p.push(p[0].flip(CENTER, 0));
    p.push(new Point(this.x, this.y - this.h));

    // Control points to add curves
    cp.push(Point.fromVector(p[0], toRadians(285), 100));
    cp.push(Point.fromVector(p[1], toRadians(130), 10));
    cp.push(cp[1].flip(p[1]));
    cp.push(Point.fromVector(p[2], toRadians(155), 20));
    cp.push(cp[3].flip(p[2]));
    cp[4].scale(p[2], 0.4);
    cp.push(cp[3].flip(CENTER, 0));
    cp.push(cp[2].flip(CENTER, 0));
    cp.push(cp[1].flip(CENTER, 0));
    cp.push(cp[0].flip(CENTER, 0));
    cp.push(cp[8].flip(p[5]));
    cp[9].scale(p[5], 0.1);
    cp.push(Point.fromVector(p[6], 0, 135));
    cp.push(cp[10].flip(CENTER, 0));
    cp.push(cp[9].flip(CENTER, 0));

    // Curves construction
    this.curves.push(new Curve(cp[0], cp[1], p[0], p[1]));
    this.curves.push(new Curve(cp[2], cp[3], p[1], p[2]));
    this.curves.push(new MirroredCurve(cp[4], p[2], p[3]));
    for (let i = 5; i < cp.length; i += 2) {
      this.curves.push(new Curve(
        cp[i], cp[i + 1], p[(i + 1) / 2], p[((i + 1) / 2 + 1) % p.length]));
    }
    // Adding curves to path
    for (let i = 0; i < this.curves.length; i++) {
      this.curves[i].path(path, i > 0);
    }

    // Assigning boundary of feature
    this.boundary = path;
    this.fills.push(new Shape(path, SKIN_COLOUR));
    super.build();
  }
}

class Body extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.build();
  }
  build() {
    let p = [];
    let cp = [];
    p.push(new Point(this.x - this.w * 11 / 32, this.y - this.h));
    p.push(Point.fromVector(p[0], toRadians(-90), 80));
    p.push(Point.fromVector(p[1], toRadians(-160), 150));
    p.push(Point.fromVector(p[2], toRadians(-135), 25));
    p.push(Point.fromVector(p[3], toRadians(-90), 100));
    for (let i = p.length - 1; i >= 0; i--) {
      p.push(p[i].flip(CENTER, 0))
    }
    let mask = new Path2D();
    let path = new Path2D();
    path.moveTo(p[0].x, p[0].y);
    for (let i = 0; i < p.length; i++) {
      path.lineTo(p[i].x, p[i].y);
    }
    this.fills.push(new Shape(path, EYE_COLOUR));
    mask.arc(this.x, this.y, 150, 0, Math.PI * 2);
    this.fills.push(new Shape(mask, "gold", path));
    mask = new Path2D();
    mask.arc(this.x, this.y - 50, 70, 0, Math.PI);
    mask.rect(this.x - 70, this.y - 150, 140, 100);
    this.fills.push(new Shape(mask, EYE_COLOUR, path));
    path = new Path2D();
    path.rect(this.x - 100, this.y - 150, 200, 300);
    this.fills.push(new Shape(path, "#00000044"));
  }
}

class Clothes extends Feature {
  constructor(x, y, width, height) {
    super(x, y, width, height);
  }
}

class FrontHair extends Feature {
  constructor(x, y, width, height, colour) {
    super(x, y, width, height);
    this.colour = colour;
    this.build();
  }
  build() {
    let path = new Path2D;
    path.ellipse(this.x, this.y - 140, 130, 130, 0, Math.PI, 0, false);
    path.rect(-130, 200, 30, 400);
    path.rect(130, 200, -30, 400);
    this.fills.push(new Shape(path, this.colour[0]));
  }
}

class Head extends Feature {
  constructor(x, y, width, height, scale, ctx) {
    super(x, y, width, height);
    this.ctx = ctx;
    this.gradients = [];
    this.build();
    this.face = new Face(this.x, this.y + this.y / 12, 250, 340);
    this.cheek = new Cheek(- 62.5, this.y + this.y * 7 / 24, 125, 160,
        this.face.fills[0], this.gradients[0]);
    this.eyes = new EyeController(this.x, this.y, 100, 50, 110, 1,
        [this.gradients[1], HAIR_COLOUR]);
    this.ears = [];
    this.ears.push(new Ear(-130, this.y * 45 / 40, 44, 85));
    this.ears.push(new Ear(-130, this.y * 45 / 40, 44, 85));
    this.nose = new Nose(this.x, this.y * 31 / 24, 60, 60);
    this.lips = new Lips(this.x, this.y * 61 / 40, 80, 30);
    this.body = new Body(this.x, this.y + 250, 400, 250);
    this.FrontHair = new FrontHair(this.x, this.y + 100, 300, 500,
        this.gradients[2]);

    // ctx.translate(canvas.width / 2, 0);
    ctx.save();
  }

  build() {
    let gradients = [];
    // Left cheek gradient
    let cheekX = -62.5;
    let cheekY = this.y + this.y * 7 / 24;
    let grd = this.ctx.createRadialGradient(
      cheekX - 20, cheekY, 40, cheekX - 50, cheekY, 120);
    grd.addColorStop(0, SKIN_SHADOW);
    grd.addColorStop(1, SKIN_COLOUR + "00");
    gradients.push(grd);

    // Right cheek gradient
    grd = this.ctx.createRadialGradient(-cheekX + 20, cheekY, 40, -cheekX + 50,
        cheekY, 120);
    grd.addColorStop(0, SKIN_SHADOW);
    grd.addColorStop(1, SKIN_COLOUR + "00");
    gradients.push(grd);

    // Overall cheek gradient
    grd = this.ctx.createLinearGradient(CENTER.x, cheekY - 120, CENTER.x,
        cheekY - cheekX + 70);
    grd.addColorStop(0, SKIN_COLOUR + "DD");
    grd.addColorStop(0.1, SKIN_HIGHLIGHT);
    grd.addColorStop(0.5, SKIN_COLOUR);
    grd.addColorStop(0.9, SKIN_COLOUR + "88");
    grd.addColorStop(0.95, SKIN_HIGHLIGHT + "77");
    grd.addColorStop(1, SKIN_SHADOW);
    gradients.push(grd);
    this.gradients.push(gradients);
    let eyeX = -50;
    let eyeY = this.y;

    gradients = []
    //eye gradient
    grd = this.ctx.createRadialGradient(eyeX, eyeY, 5, eyeX, eyeY, 15);
    grd.addColorStop(0, EYE_COLOUR);
    grd.addColorStop(1, "black");
    gradients.push(grd);
    grd = this.ctx.createRadialGradient(-eyeX, eyeY, 5, -eyeX, eyeY, 15);
    grd.addColorStop(0, EYE_COLOUR);
    grd.addColorStop(1, "black");
    gradients.push(grd);
    this.gradients.push(gradients);

    // hair gradient
    gradients = [];
    grd = this.ctx.createLinearGradient(this.x, 100, 0, canvas.height);
    grd.addColorStop(0, HAIR_HIGHLIGHT);
    grd.addColorStop(0.5, HAIR_COLOUR);
    grd.addColorStop(0.8, HAIR_SHADOW);
    gradients.push(grd);
    this.gradients.push(gradients);
  }

  draw() {
    this.ctx.fillStyle = HAIR_SHADOW;
    this.ctx.beginPath();
    this.ctx.rect(-125, 170, 250, 400);
    this.ctx.fill();
    this.body.draw(this.ctx);
    this.face.draw(this.ctx);
    this.ears[0].draw(this.ctx);
    this.ctx.save();
    this.ctx.scale(-1, 1);
    this.ears[1].draw(this.ctx);
    this.ctx.restore();
    this.cheek.draw(this.ctx);
    this.eyes.draw(this.ctx);
    this.nose.draw(this.ctx);
    this.lips.draw(this.ctx);
    this.FrontHair.draw(this.ctx);
  }

  toggleGuides() {
    this.body.toggleGuides();
    this.face.toggleGuides();
    this.ears[0].toggleGuides();
    this.ears[1].toggleGuides();
    this.cheek.toggleGuides();
    this.eyes.toggleGuides();
    this.nose.toggleGuides();
    this.lips.toggleGuides();
    this.FrontHair.toggleGuides();
  }

  clear() {
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillRect(-canvas.width / 2, 0, canvas.width, canvas.height);
  }
}

const CENTER = new Point(0, canvas.height / 2);
