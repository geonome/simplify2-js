simplify2
=========

This is another version of [Vladimir Agafonkin]'s awesome [simplify.js] library for doing high-performance polyline
simplification in JavaScript primarily using the Ramer-Douglas-Peucker simplification algorithm.

Simplify2.js is a collection of similar simplification algorithms that has been somewhat optimized. The douglasPeucker() function does not require any temporary internal memory constructs with a size proportional to the input (for marker array and stack); the use of recursion of cause requires use of some number of stack frames - but this will in practice be very few. The math and flow has also been tweaked so that fewer calculations are needed.

A quite noticeable speedup can be observed on large inputs (>100K+ point) with a low tolerance < 1 for high fidelity
output (e.g. needed for LOD generation).

Additional test cases have been added.

Please see in-code API docs.

Usage
-----
    var simplify = require('simplify2');
    ...
    var points = [...], // array of {x, y} objects.
        tolerance = 0.2;
        
    // run the douglas-peucker simplification 
    var simplifiedPoints = simplify.douglasPeucker(points, tolerance);


[Vladimir Agafonkin]: http://agafonkin.com/en
[simplify.js]: https://github.com/mourner/simplify-js
