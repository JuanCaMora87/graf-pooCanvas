const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// PALA JUGADOR
const player = {
    x: 20,
    y: 200,
    width: 15,
    height: 100,
    color: "white",
    speed: 8
};

// PALA IA
const ai = {
    x: 865,
    y: 200,
    width: 15,
    height: 100,
    color: "white",
    speed: 4
};

// 5 PELOTAS
const balls = [];

for(let i = 0; i < 5; i++){
    balls.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 10,
        color: getRandomColor(),
        speedX: randomSpeed(),
        speedY: randomSpeed()
    });
}

// CONTROLES
let upPressed = false;
let downPressed = false;

document.addEventListener("keydown", (e)=>{
    if(e.key === "ArrowUp"){
        upPressed = true;
    }

    if(e.key === "ArrowDown"){
        downPressed = true;
    }
});

document.addEventListener("keyup", (e)=>{
    if(e.key === "ArrowUp"){
        upPressed = false;
    }

    if(e.key === "ArrowDown"){
        downPressed = false;
    }
});

// FUNCION COLOR RANDOM
function getRandomColor(){
    const colors = [
        "red",
        "blue",
        "green",
        "yellow",
        "purple",
        "orange",
        "cyan"
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

// VELOCIDAD RANDOM
function randomSpeed(){
    let speed = Math.random() * 4 + 2;

    return Math.random() < 0.5 ? -speed : speed;
}

// DIBUJAR PALA
function drawPaddle(paddle){
    ctx.fillStyle = paddle.color;
    ctx.fillRect(
        paddle.x,
        paddle.y,
        paddle.width,
        paddle.height
    );
}

// DIBUJAR PELOTA
function drawBall(ball){
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

// MOVIMIENTO
function update(){

    // JUGADOR
    if(upPressed && player.y > 0){
        player.y -= player.speed;
    }

    if(downPressed && player.y + player.height < canvas.height){
        player.y += player.speed;
    }

    // IA
    if(ai.y + ai.height / 2 < balls[0].y){
        ai.y += ai.speed;
    }else{
        ai.y -= ai.speed;
    }

    // PELOTAS
    balls.forEach(ball => {

        ball.x += ball.speedX;
        ball.y += ball.speedY;

        // REBOTE ARRIBA/ABAJO
        if(ball.y + ball.radius > canvas.height ||
           ball.y - ball.radius < 0){
            ball.speedY *= -1;
        }

        // COLISION JUGADOR
        if(
            ball.x - ball.radius < player.x + player.width &&
            ball.y > player.y &&
            ball.y < player.y + player.height
        ){
            ball.speedX *= -1;
        }

        // COLISION IA
        if(
            ball.x + ball.radius > ai.x &&
            ball.y > ai.y &&
            ball.y < ai.y + ai.height
        ){
            ball.speedX *= -1;
        }

        // REINICIO
        if(ball.x < 0 || ball.x > canvas.width){
            ball.x = canvas.width / 2;
            ball.y = canvas.height / 2;

            ball.speedX = randomSpeed();
            ball.speedY = randomSpeed();
        }
    });
}

// DIBUJAR TODO
function draw(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

    drawPaddle(player);
    drawPaddle(ai);

    balls.forEach(ball => {
        drawBall(ball);
    });

    update();

    requestAnimationFrame(draw);
}

draw();