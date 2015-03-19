This is another version of Vladimir Agafonkin's awesome simplify.js library for doing high-performance polyline
simplification in JavaScript primarily using the Ramer-Douglas-Peucker simplification algorithm.

Simplify2.js is a collection of similar simplification algorithms that has been somewhat optimized. The douglasPeucker
does not require any internal memory constructs with a size proportional to the input (for marker array and stack); the
use of recursion of cause requires use of some number of stack frames - but this will in practice be very few. The math
and flow has also been tweaked so that fewer calculations are needed.

A quite noticeable speedup can be observed on large inputs (>100K+ point) with a low tolerance < 1 for high fidelity
output (needed for e.g. LOD generation).

Additional test cases have been added.