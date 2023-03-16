// Initialisation Matter.js

var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Vector = Matter.Vector;

// create engine
var engine = Engine.create(),
    world = engine.world;

// create renderer
var render = Render.create({
    element: document.querySelector(".jeu"),
    engine: engine,
    options: {
        width: window.innerWidth,
        background: '#BFDFF0',
        height: 600,
        wireframes: false        // false pour afficher les textures
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// Masks
var defaultMask = 1
var clickableMask = 2
var collisionMask = 3
var ignoreMask = 8


var weight = randomIntFromInterval(17, 40)
if (randomIntFromInterval(0, 1) == 0) {
    weight += 0.5
}
console.log(weight)

// plateau de la balance
// Bodies.rectangle(xCentre, yCentre, largeur, hauteur[, options])
var xPlateau = 400;
var yPlateau = 520;
var wPlateau = 400;
var hPlateau = 20;
var plateau = Bodies.rectangle(xPlateau, yPlateau, wPlateau, hPlateau, { collisionFilter: { mask: ignoreMask }, render: { fillStyle: '#00ff00', sprite: {
    texture: '/assets/balance1.png',
    xScale: 0.8,
    yScale: 0.8
  } } })

// Composites.group()
var wSquare = 200;
var hSquare = 10;
var xOffSeteL = -wPlateau / 2 + wSquare / 2;
var xOffSeteR = +wPlateau / 2 - wSquare / 2;
var yOffSet = -hPlateau / 2 - hSquare / 2;
var edgeLeft = Bodies.rectangle(xPlateau + xOffSeteL, yPlateau + yOffSet, wSquare, hSquare, { friction: 1, collisionFilter: { mask: clickableMask }, render: {sprite: {
    texture: '/assets/plateau.png',
    xScale: 1,
    yScale: 1
  }}}); // bord gauche de la balance
var edgeRight = Bodies.rectangle(xPlateau + xOffSeteR, yPlateau + yOffSet, wSquare, hSquare, { friction: 1, collisionFilter: { mask: clickableMask }, render: {sprite: {
    texture: '/assets/plateau.png',
    xScale: 1,
    yScale: 1
  }}} ); // bord droit de la balance


// sol
var ground = Bodies.rectangle(window.innerWidth / 2, 600, window.innerWidth, 50.5, { collisionFilter: { category: collisionMask }, isStatic: true, render: { fillStyle: '#86C6B5', opacity: 1 } });

let millisStart;
let milliEnd;
let score = 0;
let asWon = false;

// options
// { 
//     isStatic: true, 
//     collisionFilter: { group: group }, // supprime les collisions entres les élements du groupe
//     render: { fillStyle: '#ff0000' }
// }

var poids1 = Bodies.rectangle(window.innerWidth - 50, 50, 20, 25, { mass: 0.5, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
    texture: '/assets/pot0_5.svg',
    xScale: 0.25,
    yScale: 0.25
  }}}); 
var poids2 = Bodies.rectangle(window.innerWidth - 50, 150, 30, 35, { mass: 1, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
    texture: '/assets/pot1.svg',
    xScale: 0.28,
    yScale: 0.28
  } } }); 
var poids3 = Bodies.rectangle(window.innerWidth - 50, 250, 40, 40, { mass: 2, collisionFilter: { category: collisionMask | clickableMask }, render: {sprite: {
    texture: '/assets/pot2.svg',
    xScale: 0.30,
    yScale: 0.30
  } } }); 
var poids4 = Bodies.rectangle(window.innerWidth - 50, 350, 50, 50, { mass: 5, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
    texture: '/assets/pot5.svg',
    xScale: 0.35,
    yScale: 0.35
  } } }); 
var poids5 = Bodies.rectangle(window.innerWidth - 50, 450, 60, 60, { mass: 10, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
    texture: '/assets/pot10.svg',
    xScale: 0.38,
    yScale: 0.38
  }}}); 

var etagere1 = Bodies.rectangle(window.innerWidth - 50, 100, 100, 10, { isStatic: true, collisionFilter: { category: collisionMask }, render: { fillStyle: 'transparent' } }); // poidss 1
var etagere2 = Bodies.rectangle(window.innerWidth - 50, 200, 100, 10, { isStatic: true, collisionFilter: { category: collisionMask }, render: { fillStyle: '#0000ff00' } }); // poidss 1
var etagere3 = Bodies.rectangle(window.innerWidth - 50, 300, 100, 10, { isStatic: true, collisionFilter: { category: collisionMask }, render: { fillStyle: '#0000ff00' } }); // poidss 1
var etagere4 = Bodies.rectangle(window.innerWidth - 50, 400, 100, 10, { isStatic: true, collisionFilter: { category: collisionMask }, render: { fillStyle: '#0000ff00' } }); // poidss 1
var etagere5 = Bodies.rectangle(window.innerWidth - 50, 500, 100, 10, { isStatic: true, collisionFilter: { category: collisionMask }, render: { fillStyle: '#0000ff00' } }); // poidss 1

var ruche = Bodies.rectangle(xPlateau, yPlateau-200, 150, 150, { mass: weight, collisionFilter: { category: collisionMask, mask: collisionMask}, render: { fillStyle: '#ff00ff' , sprite: {
    texture: '/assets/ruche.png',
    xScale: 0.50,
    yScale: 0.40
  }}}); // poidss 1

Composite.add(world, [
    ground,
    plateau,
    edgeLeft,
    edgeRight,

    poids1,
    poids2,
    poids3,
    poids4,
    poids5,

    etagere1,
    etagere2,
    etagere3,
    etagere4,
    etagere5,

    ruche,

    // poteaux central
    Bodies.rectangle(xPlateau, 300, 20, 600, { isStatic: true, collisionFilter: { mask: collisionMask }, render: {sprite: {
        texture: '/assets/balance2.png',
        xScale: 1,
        yScale: 1
      } } }),

    // Bodies.circle(560, 100, 50, { density: 0.005 }),

    Constraint.create({
        bodyA: plateau, // sur quoi porte la contrainte
        pointB: Vector.clone(plateau.position), // ??? le point d'encrage (xCentre, yCentre)
        stiffness: .2, // raideur elasticité max 2 décroché min  
        length: 0 // disrtance entre le point d'encrage et le centre de gravité
    }),
    // assemblage des bords de la balance avec son plateau
    Constraint.create({
        bodyB: plateau, // sur quoi porte la contrainte
        pointB: { x: xOffSeteL - 50, y: 0 },
        bodyA: edgeLeft,
        stiffness: 0, // raideur elasticité max 2 décroché min  
        length: 0 // disrtance entre le point d'encrage et le centre de gravité
    }),
    // assemblage des bords de la balance avec son plateau
    Constraint.create({
        bodyB: plateau, // sur quoi porte la contrainte
        pointB: { x: xOffSeteR + 50, y: 0 },
        bodyA: edgeRight,
        stiffness: 0, // raideur elasticité max 2 décroché min  
        length: 0 // disrtance entre le point d'encrage et le centre de gravité
    })

]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
            collisionFilter: { category: clickableMask},
            stiffness: .2, // 0 les objets deviennent insaissiables
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


Animate();

function Animate() {

    //Position de la ruche
    Matter.Body.setPosition(ruche, Matter.Vector.create(xPlateau + xOffSeteL*1.45, ruche.position.y))

    if (plateau.angle < -0.02) {
        Matter.Body.setAngle(plateau, plateau.angle + 0.003)

    } else if (plateau.angle > 0.02) {
        Matter.Body.setAngle(plateau, plateau.angle - 0.003)
    }

    Matter.Body.setInertia(edgeLeft, Infinity)
    Matter.Body.setInertia(edgeRight, Infinity)
    Matter.Body.setInertia(ruche, Infinity)
    Matter.Body.setAngularVelocity(edgeLeft, 0)
    Matter.Body.setAngularVelocity(edgeRight, 0)

    // Génération de poids

    if (poids1.position.x < window.innerWidth - 100) {
        Composite.add(world, [
            poids1 = Bodies.rectangle(window.innerWidth - 50, 50, 10, 10, { mass: 0.5, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
                texture: '/assets/pot0_5.svg',
                xScale: 0.25,
                yScale: 0.25
              } } })
        ])
    }

    if (poids2.position.x < window.innerWidth - 100) {
        Composite.add(world, [
            poids2 = Bodies.rectangle(window.innerWidth - 50, 150, 20, 20, { mass: 1, collisionFilter: { category: collisionMask | clickableMask }, render: { sprite: {
                texture: '/assets/pot1.svg',
                xScale: 0.28,
                yScale: 0.28
              } }})
        ])
    }

    if (poids3.position.x < window.innerWidth - 100) {
        Composite.add(world, [
            poids3 = Bodies.rectangle(window.innerWidth - 50, 250, 30, 30, { mass: 2, collisionFilter: { category: collisionMask | clickableMask },  render: { sprite: {
                texture: '/assets/pot2.svg',
                xScale: 0.3,
                yScale: 0.3
              } }})
        ])
    }

    if (poids4.position.x < window.innerWidth - 100) {
        Composite.add(world, [
            poids4 = Bodies.rectangle(window.innerWidth - 50, 350, 40, 40, { mass: 5, collisionFilter: { category: collisionMask | clickableMask },  render: { sprite: {
                texture: '/assets/pot5.svg',
                xScale: 0.35,
                yScale: 0.35
              } }})
        ])
    }
    if (poids5.position.x < window.innerWidth - 100) {
        Composite.add(world, [
            poids5 = Bodies.rectangle(window.innerWidth - 50, 450, 50, 50, { mass: 10, collisionFilter: { category: collisionMask | clickableMask },  render: { sprite: {
                texture: '/assets/pot10.svg',
                xScale: 0.38,
                yScale: 0.38
              } }})
        ])
    }

    majScore();

    window.requestAnimationFrame(Animate);

}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function majScore() {
    if (-0.02 < plateau.angle && plateau.angle < 0.02) {

        setTimeout(() => {
            if (-0.02 < plateau.angle && plateau.angle < 0.02) {
                if (!asWon) {
                    endGame();
                }
            }
        }, 1000);
    }
}

function startGame() {
    let menu = document.querySelector(".menuWrapper")
    let canvas = document.querySelector("canvas")

    menu.style.opacity = 0
    menu.style.pointerEvents = "none"
    canvas.style.filter = "blur(0)"
    canvas.style.pointerEvents = "unset"

    startTimer();
}

function startTimer() {
    millisStart = Date.now();
}

function endGame() {
    let menuFin = document.querySelector(".menuWrapperFin")
    let expliFin = document.querySelector(".explicationFin")

    let canvas = document.querySelector("canvas")


    asWon = true;
    milliEnd = Date.now() - millisStart;
    console.log("seconds elapsed = " + milliEnd / 1000);


    menuFin.style.opacity = 1
    menuFin.style.pointerEvents = "unset"

    canvas.style.filter = "blur(100px)"
    canvas.style.pointerEvents = "none"

    expliFin.innerHTML = "Bravo, vous avez deviné que la balance pesait " + weight + "kg en " + milliEnd / 1000 + " secondes !"
}

