var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var taxiwayMatColor = "rgba(18, 18, 106, 1)";

drawCanvas = () => {
    ctx.clearRect(0, 0, width, height);
	kdca.drawAirport();
	ap1.updatePosition();
    ap2.updatePosition();
    ap1.drawAirplane();
    ap2.drawAirplane();
}

class Airplane {
	constructor(ctx, name, icao, callsign, position, turnRate, brakingAction, acceleration) {
		this.ctx = ctx;
		this.name = name;
        this.icao = icao;
        this.callsign = callsign;
		this.position = position;
		this.speed = 0;
		this.heading = 0;
        this.turn = 0;
        this.scratchpad = 0;
        this.turnRate = turnRate;
        this.brakingAction = brakingAction;
        this.acceleration = acceleration;
        this.isBraking = false;
        this.isAccelerating = false;
        this.targetSpeed = this.speed;
        this.targetHeading = 0;
        this.onPushback = false;
	}
	updatePosition() {
        this.updateSpeed();
        this.updateHeading();
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
        let topText = this.callsign.toUpperCase() + " " +  this.icao.toUpperCase();
        let bottomText = parseInt(this.speed) + " " + parseInt(this.heading) + " " + this.scratchpad;
        ctx.translate(this.position[0], this.position[1]);
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.font = "10px arial";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(topText, 0, -25);
        ctx.fillText(bottomText, 0, -13);
        ctx.fill();
        ctx.restore();
    }
    updateSpeed() {
        if (this.onPushback == false) {
            if (this.targetSpeed == 0 && this.speed > 0) {
                this.speed += (this.brakingAction / 50);
                if (this.speed < 0) {
                    this.speed = 0;
                }
            }
            else if (this.speed > this.targetSpeed) {
                this.speed += (this.brakingAction / 50);
                if (this.speed < this.targetSpeed) {
                    this.speed = this.targetSpeed;
                }
            }
            else if (this.speed < this.targetSpeed) {
                this.speed += (this.acceleration / 50);
                if (this.speed > this.targetSpeed) {
                    this.speed = this.targetSpeed;
                }
            }
        }
    }
    updateHeading() {
        if (this.speed > 0) {
            if (this.heading < this.targetHeading) {
                this.heading += (this.turnRate / 20);
                if (this.heading > this.targetHeading) {
                    this.heading = this.targetHeading;
                }
            }
            if (this.heading > this.targetHeading) {
                this.heading -= (this.turnRate / 20);
                if (this.heading < this.targetHeading) {
                    this.heading = this.targetHeading;
                }
            }
        }
    }
}

class Airport {
	constructor(ctx, icao) {
    	this.ctx = ctx;
        this.icao = icao;
        var taxiways = [];
        this.taxiways = taxiways;
        var runways = [];
        this.runways = runways;
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
    addRunway(runway) {
        var len = this.runways.length;
        this.runways[len] = runway;
    }
    drawRunways() {
        let ctx = this.ctx;
        let len = this.runways.length;
        ctx.beginPath();
        ctx.strokeStyle = "#a0a0a0";
        ctx.lineWidth = 50;
        for (let i = 0; i < len; i++) {
            ctx.moveTo(this.runways[i].segment.sPos[0], this.runways[i].segment.sPos[1]);
            ctx.lineTo(this.runways[i].segment.ePos[0], this.runways[i].segment.ePos[1]);
        }
        ctx.stroke();
        for (let i = 0; i < len; i++) {
            let posX = this.runways[i].segment.sPos[0];
            let posY = this.runways[i].segment.sPos[1];
            let dX = this.runways[i].segment.ePos[0] - this.runways[i].segment.sPos[0];
            let dY = this.runways[i].segment.ePos[1] - this.runways[i].segment.sPos[1];
            let rot = Math.atan(dY/dX);
            rot += (Math.PI / 2);
            ctx.save();
            ctx.translate(posX, posY);
            ctx.rotate(rot);
            ctx.fillStyle = "#ffffff";
            ctx.font = "17px arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.translate(0, -14);
            ctx.fillText(this.runways[i].names[0], 0, 0);
            ctx.restore();
            posX = this.runways[i].segment.ePos[0];
            posY = this.runways[i].segment.ePos[1];
            rot *= -1;
            ctx.save();
            ctx.translate(posX, posY);
            ctx.rotate(rot);
            ctx.fillStyle = "#ffffff";
            ctx.font = "17px arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.translate(0, -14);
            ctx.fillText(this.runways[i].names[1], 0, 0);
            ctx.restore();
        }
    }
    drawAirport() {
        this.drawTaxiways();
        this.drawRunways();
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

class Runway {
    constructor(names, segment) {
        this.names = names
        this.segment = segment;
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
let r1s = new Segment([100, 100], [400, 100], true);
let r1 = new Runway(["9", "27"], r1s);
kdca.addRunway(r1);
let A1 = new Taxiway("A1");
A1.addSegment([100, 100], [100, 400], true);
A1.addSegment([100, 400], [400, 400], false);
A1.addSegment([400, 400], [400, 100], true);
kdca.addTaxiway(A1);

let ap1 = new Airplane(ctx, "B737", "B737", "AAL123", [100, 100], 5, -10, 5);

let ap2 = new Airplane(ctx, "B737", "B737", "SWA123", [100, 200], 5, -10, 5);

setInterval(drawCanvas, 20);
