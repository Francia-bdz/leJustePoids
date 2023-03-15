// doc
// https://brm.io/matter-js/docs/

// examples
// https://brm.io/matter-js/demo/#car

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
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        showAngleIndicator: true,   // debug
        showCollisions: true,       // debug
        showVelocity: true,         // debug
        wireframes: false        // false pour afficher les textures
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// Masks
var toIgnoreMask = 0x0001
var clickableMask = 0x0002
var collisionMask = 0x0004
var ignoreMask = 0x0008




// plateau de la balance
// Bodies.rectangle(xCentre, yCentre, largeur, hauteur[, options])
var xPlateau = 400;
var yPlateau = 520;
var wPlateau = 400;
var hPlateau = 20;
var plateau = Bodies.rectangle(xPlateau, yPlateau, wPlateau, hPlateau, { collisionFilter: { mask: ignoreMask }, render: { fillStyle: '#00ff00', opacity: 0.2 } })
// Composites.group()
var wSquare = 200;
var hSquare = 10;
var xOffSeteL = -wPlateau / 2 + wSquare / 2;
var xOffSeteR = +wPlateau / 2 - wSquare / 2;
var yOffSet = -hPlateau / 2 - hSquare / 2;
var edgeLeft = Bodies.rectangle(xPlateau + xOffSeteL, yPlateau + yOffSet, wSquare, hSquare, { collisionFilter: { mask: collisionMask } }); // bord gauche de la balance
var edgeRight = Bodies.rectangle(xPlateau + xOffSeteR, yPlateau + yOffSet, wSquare, hSquare, { collisionFilter: { mask: collisionMask } }); // bord droit de la balance


// sol
var ground = Bodies.rectangle(400, 600, 800, 50.5, { collisionFilter: { category: collisionMask }, isStatic: true, render: { fillStyle: '#ff0000' } });



// options
// { 
//     isStatic: true, 
//     collisionFilter: { group: group }, // supprime les collisions entres les élements du groupe
//     render: { fillStyle: '#ff0000' }
// }

var poid1 = Bodies.rectangle(300, 495, 30, 30, { mass: 2, collisionFilter: { category: collisionMask | clickableMask}, render: { fillStyle: '#ff00ff' } }); // poids 1
var poid2 = Bodies.rectangle(500, 495, 30, 30, { mass: 2, collisionFilter: { category: collisionMask | clickableMask}, render: { fillStyle: '#0000ff' } }); // poids 1


Composite.add(world, [
    ground,
    plateau,
    edgeLeft,
    edgeRight,
    poid1,
    poid2,

    // poteaux central
    Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: -1, mask: 0 }, render: { fillStyle: '#ff0000' } }),

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
            collisionFilter: { mask: clickableMask },
            stiffness: .2, // 0 les objets deviennent insaissiables
            render: {
                visible: false
            }
        }
    });

Composite.add(world, mouseConstraint);

// keep the mouse in sync with rendering
render.mouse = mouse;


// fit the render viewport to the scene
Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 800, y: 600 }
});



console.log(plateau.collisionFilter.mask)

Animate();

function Animate() {

    if (plateau.angle < -0.02) {
        Matter.Body.setAngle(plateau, plateau.angle + 0.003)

    } else if (plateau.angle > 0.02) {
        Matter.Body.setAngle(plateau, plateau.angle - 0.003)
    }

    Matter.Body.setInertia(edgeLeft, Infinity)
    Matter.Body.setInertia(edgeRight, Infinity)

    

    window.requestAnimationFrame(Animate);
}


