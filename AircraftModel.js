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
                            this.position = $.extend(true, {}, gate.apos);
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
            this.position = $.extend(true, {}, this.pushbackPath.path[this.pushbackProgress]);
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
    getBrakingDistance(tgtSpeed) {
        let v0 = this.speed;
        let v = 0;
        let a = this.brakingAction * -1;
        let x = ((v ** 2) - (v0 ** 2)) / (a / 2);
        return x;
    }
}