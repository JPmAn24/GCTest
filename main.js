var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var taxiwayMatColor = "rgba(18, 18, 106, 1)"

class Airport {
		constructor(ctx, icao) {
    	this.ctx = ctx;
        this.icao = icao;
        var taxiways = [];
        this.taxiways = taxiways;
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
        for (let i = 0; i < len; i++) {
        	ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        for (let i = 0; i < len; i++) {
        	ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        for (let i = 0; i < len; i++) {
        	ctx.moveTo(this.taxiways[i][1], this.taxiways[i][2]);
            ctx.lineTo(this.taxiways[i][3], this.taxiways[i][4]);
        }
        ctx.stroke();
        for (let i = 0; i < len; i++) {
            ctx.save();
            ctx.fillStyle = "#ffffff";
            ctx.font = "15px arial";
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";
            let posX = (this.taxiways[i][1] + this.taxiways[i][3]) / 2;
            let posY = (this.taxiways[i][2] + this.taxiways[i][4]) / 2;
            let dx = this.taxiways[i][3] - this.taxiways[i][1];
            let dy = this.taxiways[i][4] - this.taxiways[i][2];
            let ofs = -8;
            let rot = Math.atan(dy/dx);
            if ((rot > (Math.PI / 2)) && (rot < (3 * (Math.PI / 2)))) {
                rot -= Math.PI;
                ofs *= -1;
            }
            ctx.translate(posX, posY);
            if (rot != 0) {
                ctx.rotate(rot);
            }
            ctx.fillText(this.taxiways[i][0], 0, ofs);
            ctx.restore();
        }
    }
}

kdca = new Airport(ctx, "KDCA");
kdca.addTaxiway("A1", 100, 100, 100, 400);
kdca.addTaxiway("A2", 50, 300, 150, 300);
kdca.addTaxiway("A3", 150, 300, 150, 500);
kdca.addTaxiway("A4", 100, 100, 400, 100);
kdca.drawTaxiways();
