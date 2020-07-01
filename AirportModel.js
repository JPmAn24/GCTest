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