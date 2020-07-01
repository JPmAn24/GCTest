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