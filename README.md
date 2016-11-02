# meshdensitytool
This is a simple tool which lets you visualise how density impacts the connectivity and coverage of a mesh network. It also lets you adjust the range of the underlying technology used to connect the mesh together.

For instance if you set it to 30 meters, this will be the maximum range of the signal for a particular node (some will have less with a random factor to simulate interference and environment causing reduced signal strength).

This tool models a single square km of a populated area, and then randomly distributes devices around the area based on the population density of the area. It can then perform a one-off computation of the coverage, or it can run an animated simulation where users move around with random motion and connections are made and broken. 

Links between two devices are drawn when they are within each others communications ranges. The tool calculates on average how many infrastructure nodes participant nodes see, and on average how many participant nodes an infrastructure node would have to servce. This allows one to examine when density can be too high or too low for a mesh to be effective. In the cases where density is too high (ie: infrastructure nodes must make too many connections to serve, it may make sense to artificially reduce the number of connections to reduce the complexity of routing and resource assignments).
