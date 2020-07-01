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