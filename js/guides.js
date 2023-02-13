"use strict";

/* Written by Olivia*/

// Code in this file represents the oldest code in this assignment.
// They include various guides to help me understand how to draw a face
// using the tools available. These functions are largely unused except
// during development. What they do is self explanatory

function middleLine(canvas, ctx) {
  let position = [canvas.width / 2, 2 * canvas.height / 5];
  ctx.beginPath();
  ctx.moveTo(position[0], 0);
  ctx.lineTo(position[0], canvas.height);
  ctx.closePath();
  ctx.setLineDash([10, 20]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function faceLines(canvas, ctx) {
  let position = [canvas.width / 2, 2 * canvas.height / 5];
  let face = faceGuides(ctx, position);
  eyeGuides(ctx, position, face);
  noseGuides(ctx, position, face);
  lipGuides(ctx, position, face);
}

function faceGuides(ctx, pos) {
  let radius = 3 / 4 * pos[0];

  let face = [radius * 7 / 10, radius]
  let jaw_line = face[1] * 5 / 8
  let jaw_width = face[0] * 15 / 20 * 38 / 40;
  let cheek_line = face[1] * 1 / 8;
  let cheek_width = radius * 1 / 10;

  //face shape
  ctx.beginPath();
  ctx.moveTo(pos[0] - face[0] * 19 / 20, pos[1] + cheek_line);
  ctx.lineTo(pos[0] - jaw_width, pos[1] + jaw_line);
  ctx.lineTo(pos[0] - jaw_width * 9 / 10, pos[1] + jaw_line * 10 / 9);
  ctx.lineTo(pos[0] - cheek_width, pos[1] + face[1]);
  ctx.lineTo(pos[0] + cheek_width, pos[1] + face[1]);
  ctx.lineTo(pos[0] + jaw_width * 9 / 10, pos[1] + jaw_line * 10 / 9);
  ctx.lineTo(pos[0] + jaw_width, pos[1] + jaw_line);
  ctx.lineTo(pos[0] + face[0] * 19 / 20, pos[1] + cheek_line);

  ctx.ellipse(pos[0], pos[1] - face[1] / 16, face[0] * 19 / 20, face[1] - face[1] * 1 / 4, 0, 0, Math.PI, true);
  ctx.closePath();
  ctx.stroke();

  let cheek_height = face[1] * 7 / 8;
  //cheeks
  let mid_cheek = (cheek_line + face[1]) / 2 * 7 / 10;
  let cheek_bulge = (cheek_width + face[0]) / 2 * 14 / 10;
  let yowl_line = (face[1] + mid_cheek) / 2;
  let yowl_width = (cheek_bulge + cheek_width) / 2;
  ctx.beginPath();
  ctx.moveTo(pos[0] - face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.lineTo(pos[0] - cheek_bulge, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] - yowl_width * 23 / 20, pos[1] + yowl_line);
  ctx.lineTo(pos[0] - cheek_width, pos[1] + face[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] + face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.lineTo(pos[0] + cheek_bulge, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] + yowl_width * 23 / 20, pos[1] + yowl_line);
  ctx.lineTo(pos[0] + cheek_width, pos[1] + face[1]);
  ctx.stroke();

  //cheek side lines
  ctx.beginPath();
  ctx.moveTo(pos[0] - jaw_width, pos[1] + jaw_line);
  ctx.lineTo(pos[0] - cheek_bulge, pos[1] + mid_cheek);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] + jaw_width, pos[1] + jaw_line);
  ctx.lineTo(pos[0] + cheek_bulge, pos[1] + mid_cheek);
  ctx.stroke();


  //front lines
  let lip_width = face[0] * 3 / 10;
  let lip_line = face[1] * 22 / 32;

  let nose_width = face[0] / 5;
  let nostril_height = 3.5 * face[1] / 10;
  ctx.beginPath();
  ctx.moveTo(pos[0] - face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.lineTo(pos[0] - yowl_width * 23 / 20, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] - yowl_width * 23 / 20, pos[1] + lip_line);
  ctx.moveTo(pos[0] - yowl_width * 23 / 20, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] - nose_width, pos[1] + nostril_height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] + face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.lineTo(pos[0] + yowl_width * 23 / 20, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] + yowl_width * 23 / 20, pos[1] + lip_line);
  ctx.moveTo(pos[0] + yowl_width * 23 / 20, pos[1] + mid_cheek);
  ctx.lineTo(pos[0] + nose_width, pos[1] + nostril_height);
  ctx.stroke();

  //mouth lines
  let nostril_bottom = 4 * face[1] / 10;
  ctx.beginPath();
  ctx.moveTo(pos[0] - nose_width, pos[1] + nostril_bottom);
  ctx.lineTo(pos[0] - (lip_width + 5), pos[1] + lip_line - 10);
  ctx.lineTo(pos[0] - (lip_width + 5), pos[1] + lip_line);
  ctx.lineTo(pos[0] - cheek_width * 8 / 10, pos[1] + cheek_height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] + nose_width, pos[1] + nostril_bottom);
  ctx.lineTo(pos[0] + (lip_width + 5), pos[1] + lip_line - 10);
  ctx.lineTo(pos[0] + (lip_width + 5), pos[1] + lip_line);
  ctx.lineTo(pos[0] + cheek_width * 8 / 10, pos[1] + cheek_height);
  ctx.stroke();

  //chin

  ctx.beginPath();
  ctx.moveTo(pos[0] - cheek_width, pos[1] + face[1]);
  ctx.lineTo(pos[0] - cheek_width * 8 / 10, pos[1] + cheek_height);
  ctx.lineTo(pos[0] + cheek_width * 8 / 10, pos[1] + cheek_height);
  ctx.lineTo(pos[0] + cheek_width, pos[1] + face[1]);
  ctx.stroke();


  //brow
  let brow_line = -face[1] * 1 / 6
  ctx.beginPath();
  ctx.moveTo(pos[0] - face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.lineTo(pos[0] - face[0] * 7 / 10, pos[1] + brow_line);
  ctx.lineTo(pos[0] + face[0] * 7 / 10, pos[1] + brow_line);
  ctx.lineTo(pos[0] + face[0] * 9 / 10, pos[1] + cheek_line);
  ctx.stroke();

  let ear_bottom = [(face[0] * 19 / 20 + jaw_width) / 2, (cheek_line + jaw_line) / 2]



  //ears
  let ear_start = -face[1] * 1 / 32
  let eat_top = -face[1] * 1 / 16
  ctx.beginPath();
  ctx.moveTo(pos[0] - face[0] * 19 / 20, pos[1] + ear_start);
  ctx.lineTo(pos[0] - face[0] * 21 / 20, pos[1] + eat_top);
  ctx.lineTo(pos[0] - face[0] * 22 / 20, pos[1] + eat_top * 0.5);
  ctx.lineTo(pos[0] - face[0] * 21 / 20, pos[1] - eat_top * 3);
  ctx.lineTo(pos[0] - face[0] * 19 / 20, pos[1] + ear_bottom[1] * 9 / 10);
  ctx.lineTo(pos[0] - ear_bottom[0], pos[1] + ear_bottom[1]);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] + face[0] * 19 / 20, pos[1] + ear_start);
  ctx.lineTo(pos[0] + face[0] * 21 / 20, pos[1] + eat_top);
  ctx.lineTo(pos[0] + face[0] * 22 / 20, pos[1] + eat_top * 0.5);
  ctx.lineTo(pos[0] + face[0] * 21 / 20, pos[1] - eat_top * 3);
  ctx.lineTo(pos[0] + face[0] * 19 / 20, pos[1] + ear_bottom[1] * 9 / 10);
  ctx.lineTo(pos[0] + ear_bottom[0], pos[1] + ear_bottom[1]);
  ctx.stroke();
  return face
}

function eyeGuides(ctx, pos, face) {
  ctx.beginPath();
  let eye_radius = face[0] / 5
  let eye_distance = eye_radius * 2
  ctx.ellipse(pos[0] - eye_distance, pos[1], eye_radius,
      eye_radius * 0.8, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(pos[0] + eye_distance, pos[1], eye_radius,
      eye_radius * 0.8, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.stroke();
}

function noseGuides(ctx, pos, face) {

  let nose_width = face[0] / 5;
  let nose_bottom = face[1] / 2;

  let nostril_bottom = 4 * face[1] / 10;
  let nostril_height = 3.5 * face[1] / 10;
  let nostril_indent = 3 * face[0] / 20;
  let nostril_start = 3 * face[1] / 10;

  let septum_width = nose_width / 4;
  let septum_height = (nose_bottom + nostril_bottom) / 2;

  ctx.beginPath();
  ctx.moveTo(pos[0] - nose_width, pos[1] + nostril_bottom);
  ctx.lineTo(pos[0] - nose_width, pos[1] + nostril_height);
  ctx.lineTo(pos[0] - nostril_indent, pos[1] + nostril_start);

  ctx.lineTo(pos[0] - septum_width, pos[1] + face[1] * 1 / 5);
  ctx.lineTo(pos[0] + septum_width, pos[1] + face[1] * 1 / 5);

  ctx.lineTo(pos[0] + nostril_indent, pos[1] + nostril_start);
  ctx.lineTo(pos[0] + nose_width, pos[1] + nostril_height);
  ctx.lineTo(pos[0] + nose_width, pos[1] + nostril_bottom);

  ctx.lineTo(pos[0] + septum_width + 5, pos[1] + septum_height);

  ctx.lineTo(pos[0] + septum_width, pos[1] + nose_bottom);
  ctx.lineTo(pos[0] - septum_width, pos[1] + nose_bottom);

  ctx.lineTo(pos[0] - septum_width - 5, pos[1] + septum_height);
  ctx.closePath();
  ctx.stroke();
}

function lipGuides(ctx, pos, face) {
  let lip_width = face[0] / 10 * 3;
  let lip_line = face[1] * 22 / 32;

  let lip_height = lip_line - face[1] / 15;
  let lip_bottom = lip_line + face[1] / 15;

  let lip_rise = face[0] / 5 / 2;
  let lip_center_height = lip_height + face[1] / 60;
  let lip_puck = face[0] / 8;

  ctx.beginPath();
  ctx.moveTo(pos[0] - lip_width, pos[1] + lip_line);
  ctx.lineTo(pos[0] - lip_rise, pos[1] + lip_height);
  ctx.lineTo(pos[0], pos[1] + lip_center_height);
  ctx.lineTo(pos[0] + lip_rise, pos[1] + lip_height);
  ctx.lineTo(pos[0] + lip_width, pos[1] + lip_line);
  ctx.lineTo(pos[0] + lip_puck, pos[1] + lip_bottom);
  ctx.lineTo(pos[0] - lip_puck, pos[1] + lip_bottom);
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pos[0] - lip_width, pos[1] + lip_line);
  ctx.lineTo(pos[0] - lip_puck, pos[1] + lip_line);
  ctx.lineTo(pos[0], pos[1] + lip_line + face[0] * 1 / 32);
  ctx.lineTo(pos[0] + lip_puck, pos[1] + lip_line);
  ctx.lineTo(pos[0] + lip_width, pos[1] + lip_line);
  ctx.stroke();
}

function drawGuides(canvas, ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
  faceLines(canvas, ctx);
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  middleLine(canvas, ctx);
  ctx.restore();
}