var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var taxiwayMatColor = "rgba(18, 18, 106, 0.75)"
drawAirport();

function drawAirport() {
    drawTaxiway(ctx, 100, 100, 200, 400, 20, "A2");
}

function drawTaxiway(ctx, sX, sY, eX, eY, rad, name) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = taxiwayMatColor;
    ctx.lineWidth = rad * 2;
    ctx.moveTo(sX,sY);
    ctx.lineTo(eX,eY);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(sX,sY);
    ctx.lineTo(eX,eY);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#a6a6a6";
    ctx.moveTo(sX,sY);
    ctx.lineTo(eX,eY);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "15px arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    posX = (sX + eX) / 2;
    posY = (sY + eY) / 2;
    dx = eX - sX;
    dy = eY - sY;
    ofs = -8;
    rot = Math.atan(dy / dx);
    if ((rot > (Math.PI / 2)) && (rot < (3 * (Math.PI / 2)))) {
        rot -= Math.PI;
        ofs *= -1;
    }
    ctx.translate(posX, posY);
    ctx.rotate(rot);
    ctx.fillText(name, 0, ofs);
    ctx.restore();
}
