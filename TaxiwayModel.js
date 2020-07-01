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