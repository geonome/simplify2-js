/**
 * (c) 2015, Anders Goettsche
 *
 * https://github.com/geonome/simplify2-js
 */
(function (name, definition) {
    if (typeof module !== 'undefined') {
        module.exports = definition.apply();
    } else if (typeof define === 'function' && define.amd) {
        define(name, [], definition);
    } else {
        window[name] = definition.apply();
    }
})('simplify2', function () {
    'use strict';

    function _appendIfNotSame(points, point) {
        var p = points[points.length - 1];
        if (p.x != point.x || p.y != point.y) {
            points.push(point);
        }
    }

    function _simplifyRadialDist(points, simplifiedPoints, tolerance2) {
        var length = points.length,
            i,
            pl = points[0],
            pi,
            dx,
            dy,
            r;

        simplifiedPoints.push(pl);
        for (i = 1; i < length; i++) {
            pi = points[i];

            dx = pl.x - pi.x;
            r = tolerance2 - dx * dx;
            if (r >= 0) {
                dy = pl.y - pi.y;
                if (r - dy * dy < 0) {
                    simplifiedPoints.push(pi);
                    pl = pi;
                }
            } else {
                simplifiedPoints.push(pi);
                pl = pi;
            }
        }

        _appendIfNotSame(simplifiedPoints, pi);

        return simplifiedPoints;
    }

    function _simplifyDouglasPeucker(points, simplifiedPoints, tolerance2, t0, t1) {
        var maxD = tolerance2,
            p0 = points[t0],
            p1 = points[t1],
            x0 = p0.x,
            y0 = p0.y,
            dx = p1.x - x0,
            dy = p1.y - y0,
            d2,
            id2,
            maxIdx,
            d,
            p,
            i,
            s;

        if (dx === 0 && dy === 0) {
            if (t1 > t0 + 1) {
                var m = (t0 + t1) >> 1;
                _simplifyDouglasPeucker(points, simplifiedPoints, tolerance2, t0, m);
                _appendIfNotSame(simplifiedPoints, points[m]);
                _simplifyDouglasPeucker(points, simplifiedPoints, tolerance2, m, t1);
            }
            return;
        }

        d2 = dx * dx + dy * dy;
        id2 = 1 / d2;
        for (i = t0; i <= t1; i++) {
            p = points[i];
            s = dx * (y0 - p.y) + dy * (p.x - x0);
            d = s * s * id2;

            if (d > maxD) {
                maxIdx = i;
                maxD = d;
            }
        }

        if (maxD > tolerance2) {
            _simplifyDouglasPeucker(points, simplifiedPoints, tolerance2, t0, maxIdx);
            simplifiedPoints.push(points[maxIdx]);
            _simplifyDouglasPeucker(points, simplifiedPoints, tolerance2, maxIdx, t1);
        }
    }

    return {
        /**
         * Simplifies the input points by only picking the ones separated by the specified tolerance distance.
         *
         * @param points the input points.
         * @param tolerance the tolerance distance.
         * @returns {[]} a new array holding the simplified points.
         */
        radialDistance: function (points, tolerance) {
            return (points && points.length > 1 && tolerance > 0) ? _simplifyRadialDist(points, [], tolerance * tolerance) : points;
        },

        /**
         * Simplifies the input points using the Ramer-Douglas-Peucker algorithm using the specified tolerance distance.
         *
         * @param points the input points.
         * @param tolerance the tolerance distance.
         * @returns {[]} a new array holding the simplified points.
         */
        douglasPeucker: function (points, tolerance) {
            if (points && points.length > 1 && tolerance > 0) {
                var sPoints = [];
                sPoints.push(points[0]);
                _simplifyDouglasPeucker(points, sPoints, tolerance * tolerance, 0, points.length - 1);
                _appendIfNotSame(sPoints, points[points.length - 1]);
                return sPoints;
            }
            return points;
        },

        /**
         * Simplifies the input points first using a radial distance simplification followed by a
         * douglas-peucker simplification.
         *
         * @param points the input points.
         * @param tolerance the tolerance distance.
         * @returns {[]} a new array holding the simplified points.
         */
        radialDistanceAndDouglasPeucker: function (points, tolerance) {
            return this.douglasPeucker(this.radialDistance(points, tolerance), tolerance);
        }
    };
});