const canvas =document.getElementById('canvas');
const brush = canvas.getContext('2d');
const height=540;
let width=960;
const ground=430;
const tile=40;
const speed=380;
let distance=0;
const gravity=4400;
let y=100;
let vy=0;
let held=false;

function resize(){
    const portrait = innerHeight>innerWidth;
    const screenwidth = portrait ? innerHeight : innerWidth;
    const screenheight= portrait ? innerWidth : innerHeight;
    width = Math.round(height*screenwidth/screenheight)
    canvas.width= width;
    canvas.height= height;
}
window.addEventListener('resize', resize);
resize();

window.addEventListener('keydown', function(){held=true;});
window.addEventListener('keyup',function(){held=false;});
canvas.addEventListener('pointerdown',function(){held=true;});
window.addEventListener('pointerup',function(){held=false;});


function move(dt){
    distance+=speed*dt;

    vy+=gravity*dt;
    y+=vy*dt;

    if(y+tile>=ground){
        y=ground-tile;
        vy=0;
    }
    if (held && y+tile>=ground){
        vy=-900;
    }
}

function draw(){
    const hue = (250 + distance * 0.05)%360;

    brush.fillStyle=`hsl(${hue},60%,20%)`;
    brush.fillRect(0,0,width,height);

    brush.fillStyle=`hsla(${hue+20},80%,60%,0.15)`;
    const triangle =(distance*0.15)%400;
    for (let x=-triangle-100; x<width+100; x+=400){
        brush.beginPath();
        brush.moveTo(x,ground);
        brush.lineTo(x+130,ground-210);
        brush.lineTo(x+260,ground);
        brush.fill()
    }

    brush.strokeStyle=`hsla(${hue+40},90%,65%,0.3)`
    brush.lineWidth=2;
    const offset=(distance*0.35)%120;

    for(let x=-offset; x<width; x+=120){
        brush.beginPath();
        brush.moveTo(x,0);
        brush.lineTo(x,ground);
        brush.stroke();
    }

    for(let y=ground; y>0; y-=90){
        brush.beginPath();
        brush.moveTo(0,y)
        brush.lineTo(width,y)
        brush.stroke();
    }

    brush.fillStyle='black'
    brush.fillRect(0,ground,width,height-ground)

    brush.strokeStyle=`hsl(${hue+40},100%,70%)`
    brush.lineWidth=3;
    brush.shadowColor=brush.strokeStyle;
    brush.shadowBlur=14;
    brush.beginPath();
    brush.moveTo(0,ground);
    brush.lineTo(width,ground);
    brush.stroke();
    brush.shadowBlur=0;

    brush.strokeStyle=`hsla(${hue+40},90%,70%,0.25)`;
    brush.lineWidth=2;
    const tick=distance%tile;
    for(let x=-tick; x<width; x+=tile){
        brush.beginPath();
        brush.moveTo(x,ground);
        brush.lineTo(x,height);
        brush.stroke();
    }
    
    brush.fillStyle='yellow';
    brush.fillRect(200,y,tile,tile);
}

let last=performance.now();

function loop(now){
    const dt=Math.min(0.05, (now-last)/1000);
    last=now;
    move(dt);
    draw();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);