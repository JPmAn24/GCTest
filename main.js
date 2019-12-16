var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var taxiwayMatColor = "rgba(18, 18, 106, 1)";

drawCanvas = () => {
    ctx.clearRect(0, 0, width, height);
	kdca.drawTaxiways();
	ap1.updatePosition();
    ap2.updatePosition();
    ap1.drawAirplane();
    ap2.drawAirplane();
}

class Airplane {
	constructor(ctx, name, icao, callsign, position) {
		this.ctx = ctx;
		this.name = name;
        this.icao = icao;
        this.callsign = callsign;
		this.position = position;
		this.speed = 0;
		this.heading = 0;
		this.turn = 0;
	}
	updatePosition() {
		let nPosX = this.position[0] + (this.speed * Math.cos(-1 * ((Math.PI / 180) * this.heading) + (Math.PI / 2)) / 20);
		let nPosY = this.position[1] - (this.speed * Math.sin(-1 * ((Math.PI / 180) * this.heading) + (Math.PI / 2)) / 20);
		this.position = [nPosX, nPosY];
	}
	drawAirplane() {
		var ctx = this.ctx;
        ctx.save();
        ctx.translate((this.position[0]), (this.position[1]));
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.rotate((Math.PI / 180) * (180 + this.heading));
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.moveTo(0, 0);
        ctx.lineTo(0, (3 * this.speed));
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.translate(this.position[0], this.position[1]);
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.moveTo(0, -6);
        ctx.lineTo(0, -11);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.font = "5px Arial";
        let boxWidth = 0;
        let topText = this.callsign.toUpperCase() + " " +  this.icao.toUpperCase();
        let topLen = ctx.measureText(topText).width;
        let bottomText = toString(this.speed) + " " + toString(this.heading);
        let bottomLen = ctx.measureText(bottomText).width + 2;
        let boxHeight = ctx.measureText(bottomText).height + 2 + ctx.measureText(topText).height + 2;
        if (topLen >= bottomLen) {
            boxWidth = topLen + 6;
        }
        else {
            boxWidth = bottomLen + 6;
        }
        ctx.translate(this.position[0], this.position[1]);
        ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.rect((-1 * (boxWidth / 2)), -12, boxWidth, (-1 * boxHeight));
        ctx.fill();
        ctx.restore();
	}
}

class Airport {
	constructor(ctx, icao) {
    	this.ctx = ctx;
        this.icao = icao;
        var taxiways = [];
        this.taxiways = taxiways;
    }
    addTaxiway(taxiway) {
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
            let len1 = this.taxiways[i].segments.length;
            for (let j = 0; j < len1; j++) {
                ctx.moveTo(this.taxiways[i].segments[j].sPos[0], this.taxiways[i].segments[j].sPos[1]);
                ctx.lineTo(this.taxiways[i].segments[j].ePos[0], this.taxiways[i].segments[j].ePos[1]);
            }
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        for (let i = 0; i < len; i++) {
            let len1 = this.taxiways[i].segments.length;
            for (let j = 0; j < len1; j++) {
                ctx.moveTo(this.taxiways[i].segments[j].sPos[0], this.taxiways[i].segments[j].sPos[1]);
                ctx.lineTo(this.taxiways[i].segments[j].ePos[0], this.taxiways[i].segments[j].ePos[1]);
            }
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        for (let i = 0; i < len; i++) {
            let len1 = this.taxiways[i].segments.length;
            for (let j = 0; j < len1; j++) {
                ctx.moveTo(this.taxiways[i].segments[j].sPos[0], this.taxiways[i].segments[j].sPos[1]);
                ctx.lineTo(this.taxiways[i].segments[j].ePos[0], this.taxiways[i].segments[j].ePos[1]);
            }
        }
        ctx.stroke();
        for (let i = 0; i < len; i++) {
            let len1 = this.taxiways[i].segments.length;
            for (let j = 0; j < len1; j++) {
                if (this.taxiways[i].segments[j].label == true) {
                    ctx.save();
                    ctx.fillStyle = "#ffffff";
                    ctx.font = "15px arial";
                    ctx.textBaseline = "middle";
                    ctx.textAlign = "center";
                    let posX = (this.taxiways[i].segments[j].sPos[0] + this.taxiways[i].segments[j].sPos[1]) / 2;
                    let posY = (this.taxiways[i].segments[j].ePos[0] + this.taxiways[i].segments[j].ePos[1]) / 2;
                    let dx = this.taxiways[i].segments[j].sPos[0] - this.taxiways[i].segments[j].ePos[0];
                    let dy = this.taxiways[i].segments[j].sPos[1] - this.taxiways[i].segments[j].ePos[1];
                    let ofs = -8;
                    let rot = Math.atan(dy/dx);
                    if ((rot > (Math.PI / 2)) && (rot < (3 * (Math.PI / 2)))) {
                        rot -= Math.PI;
                        ofs *= -1;
                    }
                    ctx.translate(posX, posY);
                    ctx.rotate(rot);
                    ctx.fillText(this.taxiways[i].name, 0, ofs);
                    ctx.restore();
                }
            }
        }
    }
}

class Taxiway {
    constructor(name) {
        this.name = name;
        var segments = [];
        this.segments = segments;
    }
    addSegment(sPos, ePos, label) {
        var seg = new Segment(sPos, ePos, label);
        var len = this.segments.length;
        this.segments[len] = seg;
    }
}

class Segment {
    constructor(sPos, ePos, label) {
        this.sPos = sPos;
        this.ePos = ePos;
        this.label = label;
    }
}

kdca = new Airport(ctx, "KDCA");
A1 = new Taxiway("A1");
A1.addSegment([100, 100], [100, 400], true);
A1.addSegment([100, 400], [400, 400], false);
A1.addSegment([400, 400], [400, 100], true);
kdca.addTaxiway(A1);
kdca.drawTaxiways();

ap1 = new Airplane(ctx, "B737", "B737", "AAL123", [100, 100]);
ap1.speed = 20;
ap1.heading = 100;

ap2 = new Airplane(ctx, "B737", "B737", "SWA123", [100, 200]);
ap2.speed = 15;
ap2.heading = 45;

setInterval(drawCanvas, 20);
