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