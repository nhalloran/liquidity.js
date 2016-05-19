# liquidity.js
A data visualization library for depicting quantities as animated liquid blobs.

For a demonstration of what the final product can look like, watch <a target='_new' href='https://twitter.com/neilhalloran/status/733046888035954689'>this video</a>.

The animation can be rendered in real-time using circle sprites, or rendered for video output using Marching Cubes (metaballs), which is too computation-heavy to be animated in real-time.

The first in-progress prototype to use the technique is Philly Contracts, but a more stripped down project in planned to serve as a boiler plate. Philly Contracts is supported by the <a target="_new" href='http://www.knightfoundation.org/funding-initiatives/knight-prototype-fund/'>Kight Prototype Fund</a>, and is being produced in collaboration with <a href='https://twitter.com/amanda_levinson' target='_new'>Amanda Levinson</a>.

This project is in its early stage. Some items on the to-do list include:

* Provide better documentation and a better stripped down starter project.
* Optimize performance of the Marching Cubes / metaballs, which are currently highly inneficient.
* Improve behavior of liquid movement to have more natural characteristics (less isolated circles)
* Allow for multiple circle / drop size, and more precise quantities.


