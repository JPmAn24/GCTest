class RunwayCollection {
    constructor(ctx) {
        this.ctx = ctx;
        this.runways = [];
    }
    add(rw) {
        let len = this.runways.length;
        this.runways[len] = rw;
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
    getDistances(wX, wY) {
        let len = this.runways.len;
        let distances = [];
        for (let i = 0; i < len; i++) {
            let sP = this.runways[i].segment.sPos;
            let eP = this.runways[i].segment.ePos;
            let dX = sP[0] - wX;
            let dY = sP[1] - wY;
            let len1 = distances.length;
            let distance = Math.sqrt((dX ** 2) + (dY ** 2));
            distances[len1] = [distance, this.runways[i], 0];
            len1 = distances.length;
            dX = eP[0] - wX;
            dY = eP[1] - wY;
            distance = Math.sqrt((dX ** 2) + (dY ** 2));
            distances[len1] = [distance, this.runways[i], 1];
        }
        return distances;
    }
}