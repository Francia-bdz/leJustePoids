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
        // wireframes: false        // false pour afficher les textures
    }
});

Render.run(render);

// create runner
var runner = Runner.create();
Runner.run(runner, engine);

// add bodies
var group = Body.nextGroup(true);


// créer des piles d'éléments 
// Composites.stack(x,y, nbPiles, nbElementPile, ecartEntrePiles, ecartEntreElements, fonctionDessineElement);
var stack = Composites.stack(250, 2, 1, 0, 0, 20, function (x, y) {
    // Bodies.circle(xCentre, yCentre, rayon[, options])
    return Bodies.circle(x, y, 10);
    // return Bodies.rectangle(x, y, 30, 30);
});

// plateau de la balance
// Bodies.rectangle(xCentre, yCentre, largeur, hauteur[, options])
var xp = 400;
var yp = 520;
var lp = 400;
var hp = 20;
var catapult = Bodies.rectangle(xp, yp, lp, hp, { collisionFilter: { group: group } }); 
// Composites.group()
var lc = 30;
var hc = 30;
var xOffSetbg = -lp/2+lc/2;
var xOffSetbd = +lp/2-lc/2;
var yOffSet = -hp/2 -hc/2;
var bg = Bodies.rectangle(xp+xOffSetbg, yp+yOffSet, lc, hc, { collisionFilter: { group: group } }); // bord gauche de la balance
var bd = Bodies.rectangle(xp+xOffSetbd, yp+yOffSet, lc, hc, { collisionFilter: { group: group } }); // bord droit de la balance

// options
// { 
//     isStatic: true, 
//     collisionFilter: { group: group }, // supprime les collisions entres les élements du groupe
//     render: { fillStyle: '#ff0000' }
// }

Composite.add(world, [
    stack,
    catapult,
    bg,
    bd,
    Bodies.rectangle(300, 495, 30, 30), // poids 1
    Bodies.rectangle(500, 495, 30, 30), // poids 2


    // sol
    Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true, render: { fillStyle: '#ff0000' } }),
    // la cale
    // Bodies.rectangle(250, 555, 20, 50, { isStatic: true, render: { fillStyle: '#ff0000' } }),
    // poteaux central
    Bodies.rectangle(400, 535, 20, 80, { isStatic: true, collisionFilter: { group: group }, render: { fillStyle: '#ff0000' } }),

    // Bodies.circle(560, 100, 50, { density: 0.005 }),

    Constraint.create({
        bodyA: catapult, // sur quoi porte la contrainte
        pointB: Vector.clone(catapult.position), // ??? le point d'encrage (xCentre, yCentre)
        stiffness: .2, // raideur elasticité max 2 décroché min  
        length: 0 // disrtance entre le point d'encrage et le centre de gravité
    }),
    
    // assemblage des bords de la balance avec son plateau
    Constraint.create({
        bodyB: catapult, // sur quoi porte la contrainte
        pointB: { x: xOffSetbg, y: yOffSet },
        bodyA: bg,
        stiffness: 1, // raideur elasticité max 2 décroché min  
        length: 0 // disrtance entre le point d'encrage et le centre de gravité
    })

]);

// add mouse control
var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
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

console.log("coucou");
