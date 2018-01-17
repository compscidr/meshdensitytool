var intervalid = -1; // TODO: wat
var canvas = document.getElementById('canvas');
var ctx = $('#canvas')[0].getContext("2d");
var id = ctx.getImageData(0, 0, 1, 1);
var cw = canvas.width;
var ch = canvas.height;
var devices;

//stats
var hasHotspot;
var hasntHotspot;
var avgHotspots;
var avgClients;

/**
 * Grab input parameters from test boxes and create an initial distribution
 * of nodes.
 * @param animate: boolean to determine whether to evolve the sim.
 * @param density: The density, in nodes per square spatial unit.
 * @param ap: Percentage of devices that are wifi hotspots.
 * @param coverage: The range of wifi hotspot connection in spatial units.
 */
function Animator(continuous, density, ap, coverage) {
  if(intervalid != -1) {
		clearInterval(intervalid);
  }

  this.density = density;
  this.wifiHotspotFraction = ap;
  this.wifiHotspotRange = coverage;

	generate(this.density, this.wifiHotspotFraction, this.wifiHotspotRange);

	if(continuous == false)
	{
		draw(density, ap, coverage, false);
	}
	else
	{
		intervalid = setInterval( function() { draw(this.density, this.wifiHotspotFraction, this.wifiHotspotRange, true); }, 100);
	}
}

/**
 * Animation frame.
 */
function frame() {
  clear();
  update();
  draw();
}

/**
 * Update status of all animated things.
 */
function update() {
  // TODO: stub, currently all done by draw.
}

/**
 * Clear the canvas.
 */
function clear() {
	ctx.clearRect(0, 0, cw, ch);
}

/**
 * Compute stats and display them.
 * @param density: The density that was set at sim start.
 * @param ap: // TODO: wat
 * @param coverage: // TODO: wat
 */
 function compute_stats(density, ap, coverage)
{
	hasHotspot = 0;
	hasntHotspot = 0;
	avgHotspots = 0;
	avgClients = 0;
	var counter = 0;
	var totalHotspots = 0;
	while(counter < devices.length)
	{
		device = devices[counter];
		var hotspots = get_hotspots(device);
		if(hotspots.length == 0)
			hasntHotspot++;
		else
			hasHotspot++;
		avgHotspots += hotspots.length;
		counter++;

		if(device.hotspot == true)
		{
			totalHotspots++;
			var clients = get_clients(device);
			avgClients+=clients.length;
		}
	}
	$('#status').text("DENSITY (pp/sq. km): " + density + " AP%: " + ap + " COVERAGE: (m):" + coverage + " COVERAGE: " + ((hasHotspot / density)*100).toFixed(2) + "% AVG HOTSPOTS: " + (avgHotspots / hasHotspot).toFixed(2) + " AVG CLIENTS: " + ( avgClients / totalHotspots).toFixed(2));
}

/**
 * Generate an arrangement of mesh nodes, with the given group characteristics.
 * @param density: The desired average density of nodes.
 * @param ap: // TODO: wat
 * @param coverage: The radius of the wifi hotspot coverage area.
 */
function generate ( density, ap, coverage ) {
	devices = new Array();
	clear();
	var counter = 0;
	while(counter < density)
	{
		var device = new Object();
		var x = Math.floor(Math.random() * cw); // TODO: globals
		var y = Math.floor(Math.random() * ch);
		device.dx = 0;
		device.dy = 0;
		device.x = x;
		device.y = y;
		device.coverage = Math.floor(Math.random() * coverage) + (2/3 * coverage);
		if(Math.floor(Math.random() * 100) < ap)
			device.hotspot = true;
		devices[counter] = device;
		counter++;
	}
}

/**
 * Draw a single frame of animation.
 * TODO: params
 */
function draw(density, ap, coverage, move) // TODO: parameters aren't used, except in subroutine
{
	clear();
	var counter = 0;
	while(counter < devices.length)
	{
		if(move == true)
		{
			var x = Math.random() * 0.1;
			var y = Math.random() * 0.1;
			var dirx = Math.random();
			var diry = Math.random();
			if(dirx > 0.5)
				devices[counter].dx += x;
			else
				devices[counter].dx -= x;

			if(diry > 0.5)
				devices[counter].dy += y;
			else
				devices[counter].dy -= y;

			devices[counter].x+=devices[counter].dx;
			devices[counter].y+=devices[counter].dy;

			if(devices[counter].x < 0)
			{
				devices[counter].x = 0;
				devices[counter].dx*=-1;
			}

			if(devices[counter].y < 0)
			{
				devices[counter].dy*=-1;
				devices[counter].y = 0;
			}

			if(devices[counter].x > cw)
			{
				devices[counter].dx*=-1;
				devices[counter].x = cw;
			}

			if(devices[counter].y > ch)
			{
				devices[counter].dy*=-1;
				devices[counter].y = ch;
			}
		}

		draw_device(devices[counter]);
		counter++;
	}
	draw_links();
	compute_stats(density, ap, coverage);
}

/**
 * Draw a device, showing its coverage area if it is a wifi hotspot.
 */
function draw_device(device)
{
	var r = 0;
	var g = 0;
	var b = 0;
	id.data[0] = r;
	id.data[1] = g;
	id.data[2] = b;
	id.data[3] = 255;

	ctx.putImageData(id, device.x, device.y);
	if(device.hotspot == true)
	{
		ctx.fillStyle = "rgba(255, 10, 10, .5)";
		ctx.beginPath();
		ctx.arc(device.x, device.y, device.coverage, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fill();
	}
	else
	{

	}
}

/**
 * Draw links between every device and each hotspot that it is connected to.
 */
function draw_links()
{
	var counter = 0;
	while(counter < devices.length)
	{
		var device = devices[counter];
		var hotspots = get_hotspots(device);
		var counter2 = 0;
		while(counter2 < hotspots.length)
		{
			ctx.strokeStyle = "rgba(10, 100, 100, 1)";
			ctx.beginPath();
			ctx.moveTo(device.x,device.y);
			ctx.lineTo(hotspots[counter2].x,hotspots[counter2].y);
			ctx.stroke();
			counter2++;
		}
		counter++;
	}
}

/*
 * Returns an array of hotspots that this device is in range of
 */
function get_hotspots(device)
{
	var index = 0;
	var hotspots = new Array();

	var counter = 0;
	while(counter < devices.length)
	{
		if(devices[counter].hotspot == true)
		{
			var distance = Math.sqrt(Math.pow(devices[counter].x - device.x,2) + Math.pow(devices[counter].y - device.y,2));
			if(distance < devices[counter].coverage)
			{
				hotspots[index] = devices[counter];
				index++;
			}
		}
		counter++;
	}
	return hotspots;
}

/*
 * Returns an array of clients that this hotspot is in range of
 */
function get_clients(device)
{
	var index = 0;
	var clients = new Array();

	var counter = 0;
	while(counter < devices.length)
	{
		var distance = Math.sqrt(Math.pow(devices[counter].x - device.x,2) + Math.pow(devices[counter].y - device.y,2));
		if(distance < devices[counter].coverage)
		{
			clients[index] = devices[counter];
			index++;
		}
		counter++;
	}
	return clients;
}

// Characteristicis of Canada
function canada()
{
	 $('#density').val("4");
	 clear();
	 if(intervalid != -1)
			clearInterval(intervalid);
}

// Characteristicis of Guatamala City
function guatcity()
{
	 $('#density').val("1000");
	 clear();
	 if(intervalid != -1)
			clearInterval(intervalid);
}

// Characteristicis of Toronto
function tor()
{
	 $('#density').val("2650");
	 clear();
	 if(intervalid != -1)
			clearInterval(intervalid);
}

// Characteristicis of Vancouver
function van()
{
	 $('#density').val("5249");
	 clear();
	 if(intervalid != -1)
			clearInterval(intervalid);
}
