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