const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world, cenario, barco;
var canvas, angle, torreIMG, torre, solo, canhao;
var balas = [];
var barcos = [];

var barcoAnimacao = [];
var barcoDados;
var barcoFolhaImagem;



var aguaSplashAnimacao = []
var aguaSplashDados;
var aguaSplashFolhaImagem;

function preload() {
    cenario = loadImage("./assets/background.gif");
    torreIMG = loadImage("./assets/tower.png");

    barcoDados = loadJSON("./boat/boat.json");
    barcoFolhaImagem = loadImage("./boat/boat.png");

    aguaSplashDados = loadJSON("./waterSplash/waterSplash.json");
    aguaSplashFolhaImagem = loadImage("./waterSplash/waterSplash.png");


}

function setup() {
    canvas = createCanvas(1200, 600);
    engine = Engine.create();
    world = engine.world;
    angleMode(DEGREES)
    angle = 15

    solo = Bodies.rectangle(0, height - 1, width * 2, 1, { isStatic: true });
    World.add(world, solo);

    torre = Bodies.rectangle(160, 350, 160, 310, { isStatic: true });
    World.add(world, torre);

    canhao = new Canhao(180, 110, 130, 100, angle);

    var barcoFrames = barcoDados.frames;
    for (var i = 0; i < barcoFrames.length; i++) {
        var pos = barcoFrames[i].position;
        var img = barcoFolhaImagem.get(pos.x, pos.y, pos.w, pos.h);
        barcoAnimacao.push(img);
    }


    var aguaSplashFrames = aguaSplashDados.frames;
    for (var i = 0; i < aguaSplashFrames.length; i++) {
        var pos = aguaSplashFrames[i].position;
        var img = aguaSplashFolhaImagem.get(pos.x, pos.y, pos.w, pos.h);
        aguaSplashAnimacao.push(img);
    }
}

function draw() {
    background(189);
    image(cenario, 0, 0, width, height);

    Engine.update(engine);


    rect(solo.position.x, solo.position.y, width * 2, 1);


    push();
    imageMode(CENTER);
    image(torreIMG, torre.position.x, torre.position.y, 160, 310);
    pop();

    for (var i = 0; i < balas.length; i++) {
        mostrarBalas(balas[i], i);
        colidiuComBarco(i)
    }

    canhao.display();
    mostrarBarco();
}

function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        var bala = new BalaCanhao(canhao.x, canhao.y);
        bala.trajectory = [];
        Matter.Body.setAngle(bala.body, canhao.angle);
        balas.push(bala);
    }
}

function mostrarBalas(bala) {
    if (bala) {
        bala.animate();
        bala.display();
    }
}

function keyReleased() {
    if (keyCode === DOWN_ARROW) {
        balas[balas.length - 1].atirar();
    }
}

//função mostrar barco
function mostrarBarco() {

    if (barcos.length > 0) {
        if (
            barcos[barcos.length - 1] === undefined ||
            barcos[barcos.length - 1].body.position.x < width - 300
        ) {

            var barco = new Barco(width, height - 100, 170, 170, barcoAnimacao);
            barcos.push(barco);
        }

        for (var i = 0; i < barcos.length; i++) {
            if (barcos[i]) {
                Matter.Body.setVelocity(barcos[i].body, {
                    x: -0.9,
                    y: 0
                });
                barcos[i].animate();
                barcos[i].display();

            }
        }
    } else {
        var barco = new Barco(width, height - 60, 170, 170, barcoAnimacao);
        barcos.push(barco);
    }
}

function colidiuComBarco(b) {

    for (var i = 0; i < barcos.length; i++) {

        if (barcos[i] !== undefined && balas[b] !== undefined) {
            var colisao = Matter.SAT.collides(barcos[i].body, balas[b].body);
            if (colisao.collided) {
                barcos[i].remove(i);
                balas[b].remove(b);
            }
        }
    }
}