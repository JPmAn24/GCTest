"use strict";
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var taxiwayMatColor = "rgba(18, 18, 106, 1)";

/**
 * class AirplaneCollection
 * Constructor: 
 *      ctx: canvas context
 *      collection: array of all aircraft
 * drawAircraft:
 *      Loops through every aircraft in collection[]
 *      For each aircraft, if position isn't null, aircraft gets drawn normally
 * updatePositions:
 *      Loops through every aircraft in collection[]
 *      For each aircraft, updates position
 */

class AirplaneCollection {
    constructor(ctx) {
        this.ctx = ctx;
        this.collection = [];
    }
    drawAircraft() {
        let len = this.collection.length;
        for (let i = 0; i < len; i++) {
            let airplane = this.collection[i];
            if (airplane.position == null) {
                break;
            }
            var ctx = this.ctx;
            ctx.save();
            ctx.translate((airplane.position[0]), (airplane.position[1]));
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.arc(0, 0, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.rotate((Math.PI / 180) * (180 + airplane.heading));
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.moveTo(0, 0);
            ctx.lineTo(0, (3 * airplane.speed));
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.translate(airplane.position[0], airplane.position[1]);
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.moveTo(0, -6);
            ctx.lineTo(0, -11);
            ctx.stroke();
            ctx.restore();
            ctx.save();
            let topText = airplane.callsign.toUpperCase() + " " +  airplane.icao.toUpperCase();
            let bottomText = parseInt(airplane.speed) + " " + parseInt(airplane.heading) + " " + airplane.scratchpad;
            ctx.translate(airplane.position[0], airplane.position[1]);
            ctx.beginPath();
            ctx.textAlign = "center";
            ctx.font = "10px arial";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(topText, 0, -25);
            ctx.fillText(bottomText, 0, -13);
            ctx.fill();
            ctx.restore();
        }
    }
    updatePositions() {
        let len = this.collection.length;
        for (let i = 0; i < len; i++) {
            this.collection[i].updatePosition();
        }
    }
}

let airplaneCollection = new AirplaneCollection(ctx);

/**
 * class Airplane
 * constructor:
 *      name: aircraft type name
 *      icao: aircraft type icao
 *      callsign: aircraft callsign
 *      turnRate: how fast the aircraft turns on the ground
 *      brakingAction: how fast the airplane slows down
 *      acceleration: how fast the airplane speeds up
 *      useableGates: array of useable gates to spawn at
 * beginPushback:
 *      Begins the pushback process for that airplane
 *      name: pushback path name
 * updatePosition:
 *      Updates the position of the aircraft, also initiates spawning and pushback process
 * doPushback: 
 *      Does the actual pushback logic and movement
 * updateSpeed:
 *      Updates the aircraft's speed
 * updateHeading:
 *      updates the aircraft's heading
 */

class Airplane {
    constructor(name, icao, callsign, turnRate, brakingAction, acceleration, useableGates) {
        this.name = name;
        this.icao = icao;
        this.callsign = callsign;
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
        this.hasPushedBack = false;
        this.useableGates = useableGates;
        this.needsToSpawn = true;
        this.gateOccupied = false;
        this.position = null;
        this.pushbackPath = null;
        this.pushbackProgress = null;
        let len = airplaneCollection.collection.length;
        airplaneCollection.collection[len] = this;
    }
    beginPushback(name) {
        for (let i = 0; i < this.gateOccupied.paths.length; i++) {
            if (this.gateOccupied.paths[i].name == name) {
                this.pushbackPath = this.gateOccupied.paths[i];
                this.onPushback = true;
                this.pushbackProgress = 0;
                return;
            }
        }
    }
    updatePosition() {
        if (this.needsToSpawn) {
            for (let i = 0; i < gateCollection.length; i++) {
                let gate = gateCollection[i];
                if (!gate.occupied) {
                    for (let j = 0; j < this.useableGates.length; j++) {
                        if (gate.name == this.useableGates[j]) {
                            this.position = gate.apos;
                            console.log(gate.apos);
                            gate.occupied = true;
                            this.gateOccupiedN = gate.name;
                            this.gateOccupied = gate;
                            this.needsToSpawn = false;
                        }
                    }
                }
            }
        }
        else {
            if (!this.onPushback) {
                if (this.speed == 0 && this.targetSpeed == 0) {
                    return
                }
                for (let i = 0; i < gateCollection.length; i++) {
                    if (gateCollection[i].name == this.gateOccupiedN) {
                        gateCollection[i].occupied = false;
                    }
                }
                this.gateOccupiedN = false;
                this.updateSpeed();
                this.updateHeading();
                let nPosX = this.position[0] + (this.speed * Math.cos(-1 * ((Math.PI / 180) * this.heading) + (Math.PI / 2)) / 20);
                let nPosY = this.position[1] - (this.speed * Math.sin(-1 * ((Math.PI / 180) * this.heading) + (Math.PI / 2)) / 20);
                this.position = [nPosX, nPosY];
            }
            else {
                this.doPushback();
            }
        }
    }
    doPushback() {
        if (this.pushbackProgress == this.pushbackPath.path.length) {
            this.onPushback = false;
            this.heading = this.pushbackPath.endHeading;
            this.gateOccupied.occupied = false;
            return;
        }
        let dx = this.position[0] - this.pushbackPath.path[this.pushbackProgress][0];
        let dy = this.position[1] - this.pushbackPath.path[this.pushbackProgress][1];
        let distanceToNext = Math.sqrt((Math.abs(dx)**2) + (Math.abs(dy)**2));
        let headingToNext = Math.atan(dy/dx);
        if (Math.abs(distanceToNext) <= 1) {
            this.position = this.pushbackPath.path[this.pushbackProgress];
            this.pushbackProgress += 1;
            return;
        }
        else {
            this.position[0] -= (0.25 * Math.cos(headingToNext));
            this.position[1] -= (0.25 * Math.sin(headingToNext));
        }
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

/**
 * class Airport
 * constructor:
 *      ctx: canvas drawing context
 *      icao: airport's icao code
 *      also initializes the taxiway, runway, and terminal arrays
 * addTaxiway:
 *      taxiway: taxiway to add
 *      adds a taxiway to the taxiways[] array
 * drawTaxiways:
 *      draws all taxiways inside of the taxiways[] array
 * addRunway:
 *      runway: runway to add
 *      adds a runway to the runways[] array
 * drawRunways:
 *      draws all runways inside of the runways[] array
 * addTerminal:
 *      terminal: terminal to add
 *      adds a terminal to the terminals[] array
 * drawTerminals:
 *      draws all terminals inside of the terminals[] array
 * drawAirport:
 *      calls the drawTaxiways, drawRunways, and drawTerminals functions
 */

class Airport {
    constructor(ctx, icao) {
        this.ctx = ctx;
        this.icao = icao;
        var taxiways = [];
        this.taxiways = taxiways;
        var runways = [];
        this.runways = runways;
        var terminals = [];
        this.terminals = terminals;
    }
    addTaxiway(taxiway) {
        var len = this.taxiways.length;
        this.taxiways[len] = taxiway;
    }
    drawTaxiways() {
        var ctx = this.ctx
        var len = this.taxiways.length;
        ctx.save();
        let oLC = ctx.lineCap;
        ctx.lineCap = "round";
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
        ctx.lineCap = oLC;
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
    addTerminal(terminal) {
        var len = this.terminals.length;
        this.terminals[len] = terminal;
    }
    drawTerminals() {
        let ctx = this.ctx;
        let len = this.terminals.length;
        for (let i = 0; i < len; i++) {
            let len1 = this.terminals[i].poly.length;
            ctx.fillStyle = "#2a2a2a";
            ctx.beginPath();
            ctx.moveTo(this.terminals[i].poly[0][0], this.terminals[i].poly[0][1]);
            for (let j = 1; j < len1; j++) {
                ctx.lineTo(this.terminals[i].poly[j][0], this.terminals[i].poly[j][1]);
            }
            ctx.closePath();
            ctx.fill();
        }
    }
    drawAirport() {
        this.drawTaxiways();
        this.drawRunways();
        this.drawTerminals();
    }
}

/**
 * class Taxiway:
 * constructor:
 *      name: name of the taxiway
 *      also initializes the segments[] array
 * addSegment:
 *      sPos: array [x, y] of the starting position of the segment
 *      ePos: array [x, y] of the ending position of the segment
 */

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

/**
 * class Runway:
 * constructor:
 *      names: array that has the names of each runway, depending on end of runway
 *      segment: the segment that the runway is
 */

class Runway {
    constructor(names, segment) {
        this.names = names
        this.segment = segment;
    }
}

/**
 * class Segment:
 * constructor:
 *      sPos: array [x, y] that notes the starting position of the segment
 *      ePos: array [x, y] that notes the ending position of the segment
 *      label: whether or not the segment has a label on it
 */

class Segment {
    constructor(sPos, ePos, label) {
        this.sPos = sPos;
        this.ePos = ePos;
        this.label = label;
    }
}

/**
 * class Terminal:
 * constructor:
 *      Only initiates the poly[] array, which is the shape of the building
 * addPoint:
 *      pos: array [x, y] of the position of the point to add
 *      adds a point at pos to the end of the poly[] array
 */

class Terminal {
    constructor() {
        this.poly = [];
    }
    addPoint(pos) {
        var len = this.poly.length;
        this.poly[len] = pos;
    }
}

let gateCollection = [];

/**
 * class Gate:
 * constructor:
 *      apos: array [x, y] of the actual position of the gate
 *      name: name of the gate
 *      occupied: whether or not the gate is occupied
 *      paths: pushback paths from the gate
 *      Also adds the gate to gateCollection[]
 * addPath:
 *      name: name of the path
 *      Adds a path with name name to the end of the paths[] array
 */

class Gate {
    constructor(apos, name) {
        this.apos = apos;
        this.name = name;
        var len = gateCollection.length;
        gateCollection[len] = this;
        this.occupied = false;
        this.paths = [];
    }
    addPath(name) {
        let len = this.paths.length;
        let path = new PushbackPath(name);
        this.paths[len] = path;
    }
}

/**
 * class PushbackPath:
 * constructor:
 *      name: name of the path
 *      path: array of points [x, y] along the path of the path
 *      endHeading: heading to turn to at the end of the pushback
 * addPoint:
 *      point: array [x, y] to add to path
 *      adds a point [x, y] at the end of the path[] array
 * addEndHeading:
 *      heading: what to assign to endHeading
 *      assigns a heading to endHeading
 */

class PushbackPath {
    constructor(name) {
        this.name = name;
        this.path = [];
        this.endHeading = 0;
    }
    addPoint(point) {
        let len = this.path.length;
        this.path[len] = point;
    }
    addEndHeading(heading) {
        this.endHeading = heading;
    }
}

function drawCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 20;
    ctx.clearRect(0, 0, width, height);
    kdca.drawAirport();
    airplaneCollection.updatePositions();
    airplaneCollection.drawAircraft();
}

let kdca = new Airport(ctx, "KDCA");
let r1s = new Segment([100, 100], [400, 100], true);
let r1 = new Runway(["9", "27"], r1s);
kdca.addRunway(r1);
let A1 = new Taxiway("A1");
A1.addSegment([100, 100], [100, 400], true);
A1.addSegment([100, 400], [400, 400], false);
A1.addSegment([400, 400], [400, 100], true);
kdca.addTaxiway(A1);
let t1 = new Terminal();
t1.poly = [[200, 200], [300, 200], [300, 300], [200, 300]];
kdca.addTerminal(t1);
let ramp1 = new Taxiway("ramp1");
ramp1.addSegment([100, 250], [190, 250], false);
kdca.addTaxiway(ramp1);
let g1 = new Gate([190, 250], "G1");
g1.addPath("L");
g1.paths[0].addPoint([100, 250]);
g1.paths[0].addPoint([100, 100]);
g1.paths[0].addEndHeading(180);
g1.addPath("R");
g1.paths[1].addPoint([100, 250]);
g1.paths[1].addPoint([100, 400]);
g1.paths[1].addEndHeading(0);

let ap1 = new Airplane("B737", "B737", "AAL123", 5, -10, 5, ["G1"]);

let ap2 = new Airplane("B737", "B737", "SWA123", 5, -10, 5, ["G1"]);

setInterval(drawCanvas, 20);
