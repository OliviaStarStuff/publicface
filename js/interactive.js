"use strict";

/* Written by Olivia*/

// Utility function to produce and x y value relative to canvas
function getMouseXY(e) {
  const mx = Math.round(e.offsetX  * canvas.width / canvas.scrollWidth | 0);
  const my = Math.round(e.offsetY * canvas.height / canvas.scrollHeight | 0);
  return { x: mx, y: my };
}

function neutralFace(e, head) {
  console.log("I am neutral");
  head.clear();
  head.lips.raise(-2);
  head.lips.widen(0);
  head.eyes.furrow(0);
  head.draw();
  // sort eye squinting and enraged states
  if(head.eyes.eyes[0].squinting) {
    head.eyes.eyes[0].squint();
    head.eyes.eyes[1].squint();
  }
  if(head.eyes.eyes[0].enraged) {
    head.eyes.eyes[0].enrage();
    head.eyes.eyes[1].enrage();
  }
  if(head.cheek.lowered) {
    head.cheek.lower();
  }
  head.draw();
}

function angryFace(e, head) {
  console.log("I am angry");
  head.clear();
  head.lips.raise(15);
  head.lips.widen(5);
  head.eyes.furrow(-15);
  // sort eye squinting and enraged states
  if(head.eyes.eyes[0].squinting) {
    head.eyes.eyes[0].squint();
    head.eyes.eyes[1].squint();
  }
  if(!head.eyes.eyes[0].enraged) {
    head.eyes.eyes[0].enrage();
    head.eyes.eyes[1].enrage();
  }
  if(!head.cheek.lowered) {
    head.cheek.lower();
  }
  head.draw();
}

function happyFace(e, head) {
  console.log("I am cheeky");
  head.clear();
  head.lips.raise(-10);
  head.lips.widen(5);
  head.eyes.furrow(10);
  // sort eye squinting and enraged states
  if(head.eyes.eyes[0].enraged) {
    head.eyes.eyes[0].enrage();
    head.eyes.eyes[1].enrage();
  }
  if(!head.eyes.eyes[0].squinting) {
    head.eyes.eyes[0].squint();
    head.eyes.eyes[1].squint();
  }
  if(head.cheek.lowered) {
    head.cheek.lower();
  }
  head.draw();
}

function createCircles(e, head) {
  // the fun function that places a circl on click
  let p = getMouseXY(e);
  if(!head.ctx.isPointInPath(head.face.boundary, p.x, p.y)) {
    let radius = Math.random() * 25 + 25;
    head.ctx.save();
    head.ctx.beginPath();
    head.ctx.arc(p.x - canvas.width / 2, p.y, radius, 0, Math.PI * 2);
    head.ctx.fillStyle = randomRGBA();
    head.ctx.fill();
    let output = document.getElementById("output_area");
    output.innerText = p.x + " " + p.y;
    head.ctx.restore();
  }
}

/**
 *
 * @param {event} e
 * @param {Head} head
 */
function blinkEye(e, head) {
  let p = getMouseXY(e);
  p.x -= canvas.width / 2;
  let changed = false;
  for (const eye of head.eyes.eyes) {
    if (eye.within(p)) {
      changed = !changed;
      eye.close();
      console.log("I am blinking");
    }
  }

  if(changed) {
    // drawGuides(canvas, ctx);
    head.ctx.fillStyle="";
    head.clear();
    head.draw();
  }
}

function changeLipColour(e, head) {
  let p = getMouseXY(e);
  p.x -= canvas.width / 2;
  if(head.lips.within(p)) {
    head.lips.changeColour();
    head.clear();
    head.draw();
  }
}

canvas.addEventListener('mousemove', (e) => {
  let output = document.getElementById("output_area");
  let p = getMouseXY(e);
  output.textContent = p.x + " " + p.y;
});

if (canvas.getContext) {
  const ctx = canvas.getContext('2d', {alpha: false});
  // translate canvas so 0 is in the middle
  ctx.translate(canvas.width / 2, 0);
  ctx.lineCap = 'round';

  let head = new Head(0, canvas.height * 2 / 5, 200, 500, 1, ctx)
  head.clear();
  // the actualy head
  head.draw();
  // face guidelines. No longer needed but can be viewed.
  // head.toggleGuides();
  // drawGuides(canvas, ctx);

  // Add all the buttons
  // Face 1 Neutal
  let buttonOne = document.getElementById("button_one");
  buttonOne.addEventListener('click', function (e) {
    neutralFace(e, head);
  });
  // Face 2 Angry
  let buttonTwo = document.getElementById("button_two");
  buttonTwo.addEventListener('click', function (e) {
    angryFace(e, head);
  });
  // Face 2 Happy
  let buttonThree = document.getElementById("button_three");
  buttonThree.addEventListener('click', function (e) {
    happyFace(e, head);
  });
  // Extra Create Circles
  canvas.addEventListener('click', function (e) {
    createCircles(e, head);
  });
  // Blink Eye
  canvas.addEventListener('click', function (e) {
    blinkEye(e, head);
  });
  // Change Lip Colour
  canvas.addEventListener('click', function (e) {
    changeLipColour(e, head);
  });

} else {
  canvas.innerHTML = "canvas is unsupported";
  // canvas-unsupported code here
}