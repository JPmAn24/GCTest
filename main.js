"use strict";
var canvas = document.getElementById("canvas");
var inputContainer = document.getElementById("inputContainer");
var consoleBar = document.getElementById("consoleBar");
var ctx = canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;
var taxiwayMatColor = "rgba(18, 18, 106, 1)";

let airplaneCollection = new AirplaneCollection(ctx);

let gateCollection = [];

function drawCanvas() {
    inputContainer.width = window.innerWidth;
    inputContainer.height = 20;
    consoleBar.width = window.innerWidth - 10;
    consoleBar.height = 15;
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
