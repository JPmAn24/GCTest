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