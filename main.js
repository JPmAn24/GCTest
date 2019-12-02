var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var taxiwayMatColor = "rgba(18, 18, 106, 1)"

function drawAirport() {
    drawTaxiway(ctx, 100, 100, 100, 400, 20, "A1");
    drawTaxiway(ctx, 50, 300, 150, 300, 20, "A2");
}

function drawTaxiway(ctx, sX, sY, eX, eY, name) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = taxiwayMatColor;
    ctx.lineWidth = 40;
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

class Airport {
		constructor(ctx, icao) {
    		this.ctx = ctx;
        this.icao = icao;
        this.taxiways = new Array();
    }
    addTaxiway(name, sX, sY, eX, eY) {
    		var taxiway = new Array(name, sX, sY, eX, eY);
        var len = this.taxiways.length;
        this.taxiways[len] = taxiway;
    }
    drawTaxiways() {
    		var ctx = this.ctx
    		var len = this.taxiways.length;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = taxiwayMatColor;
        ctx.lineWidth = 40;
        for (i = 0; i < len; i++) {
        	  ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        for (i = 0; i < len; i++) {
        		ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        for (i = 0; i < len; i++) {
        		ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        ctx.restore();
    }
}

kdca = new Airport(ctx, "KDCA");
kdca.addTaxiway("A1", 100, 100, 100, 400);
kdca.addTaxiway("A2", 50, 300, 150, 300);
kdca.drawTaxiways();
