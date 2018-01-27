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
 * The simulator engine.
 */
class Simulator {
  generate(width, height, count, hotspotFraction, hotspotRange) {
    console.log("generating");

    if(intervalid != -1) {
      clearInterval(intervalid);
    }

    this.width = width
    this.height = height
    this.count = count
    this.wifiHotspotFraction = hotspotFraction
    this.wifiHotspotRange = hotspotRange

  	this.devices = new Array();
  	let counter = 0;
  	while(counter < this.count) {
  		let device = new Object();
  		let x = Math.floor(Math.random() * cw); // TODO: globals
  		let y = Math.floor(Math.random() * ch);
  		device.dx = 0;
  		device.dy = 0;
  		device.x = x;
  		device.y = y;
  		device.range = Math.floor(Math.random() * hotspotRange) + (2/3 * hotspotRange);
  		if(Math.floor(Math.random() * 100) < hotspotFraction) {
  			device.hotspot = true;
      }
  		this.devices[counter] = device;
  		counter++;
  	}
  }

  run(continuous) {
    if(continuous == false) {
      this.frame();
    } else {
      intervalid = setInterval( this.frame.bind(this), 100);
    }
  }

  pause(continuous) {
    clearInterval(intervalid);
  }

  clear() {
    ctx.clearRect(0, 0, cw, ch);
  }

  draw() {
    let counter = 0;
  	while(counter < this.devices.length)
  	{
			var x = Math.random() * 0.1;
			var y = Math.random() * 0.1;
			var dirx = Math.random();
			var diry = Math.random();
			if(dirx > 0.5)
				this.devices[counter].dx += x;
			else
				this.devices[counter].dx -= x;

			if(diry > 0.5)
				this.devices[counter].dy += y;
			else
				this.devices[counter].dy -= y;

			this.devices[counter].x+=this.devices[counter].dx;
			this.devices[counter].y+=this.devices[counter].dy;

			if(this.devices[counter].x < 0)
			{
				this.devices[counter].x = 0;
				this.devices[counter].dx*=-1;
			}

			if(this.devices[counter].y < 0)
			{
				this.devices[counter].dy*=-1;
				this.devices[counter].y = 0;
			}

			if(this.devices[counter].x > cw)
			{
				this.devices[counter].dx*=-1;
				this.devices[counter].x = cw;
			}

			if(this.devices[counter].y > ch)
			{
				this.devices[counter].dy*=-1;
				this.devices[counter].y = ch;
			}

  		this.draw_device(this.devices[counter]);
  		counter++;
  	}
  	this.draw_links();
  	this.compute_stats();
  }

  draw_device(device)
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
  		ctx.arc(device.x, device.y, device.range, 0, Math.PI*2, true);
  		ctx.closePath();
  		ctx.fill();
  	}
  	else
  	{

  	}
  }

  draw_links() {
    let counter = 0;
  	while(counter < this.devices.length)
  	{
  		let device = this.devices[counter];
  		let hotspots = this.get_hotspots(device);
  		let counter2 = 0;
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

  get_hotspots(device) {
  	let index = 0;
  	let hotspots = new Array();

  	let counter = 0;
  	while(counter < this.devices.length) {
  		if(this.devices[counter].hotspot == true) {
  			let distance = Math.sqrt(Math.pow(this.devices[counter].x - device.x,2) + Math.pow(this.devices[counter].y - device.y,2));
  			if(distance < this.devices[counter].range) {
  				hotspots[index] = this.devices[counter];
  				index++;
  			}
  		}
  		counter++;
  	}
  	return hotspots;
  }

  get_clients(device) {
  	let index = 0;
  	let clients = new Array();

  	let counter = 0;
  	while(counter < this.devices.length)
  	{
  		var distance = Math.sqrt(Math.pow(this.devices[counter].x - device.x,2) + Math.pow(this.devices[counter].y - device.y,2));
  		if(distance < this.devices[counter].range)
  		{
  			clients[index] = this.devices[counter];
  			index++;
  		}
  		counter++;
  	}
  	return clients;
  }

  frame() {
    this.clear();
    //this.update();
    this.draw();
  }

  compute_stats() {
  	hasHotspot = 0;
  	hasntHotspot = 0;
  	avgHotspots = 0;
  	avgClients = 0;
  	let counter = 0;
  	let totalHotspots = 0;
    let device = this.devices[0]
  	while(counter < this.devices.length)
  	{
  		device = this.devices[counter];
  		let hotspots = this.get_hotspots(device);
  		if(hotspots.length == 0) {
        hasntHotspot++;
      } else {
  			hasHotspot++;
      }
  		avgHotspots += hotspots.length;
  		counter++;

  		if(device.hotspot == true) {
  			totalHotspots++;
  			let clients = this.get_clients(device);
  			avgClients+=clients.length;
  		}
  	}
  	$('#status').text("DENSITY (pp/sq. km): " + this.count + " AP%: " + this.wifiHotspotFraction + " COVERAGE: (m):" + this.wifiHotspotRange + " COVERAGE: " + ((hasHotspot / this.count)*100).toFixed(2) + "% AVG HOTSPOTS: " + (avgHotspots / hasHotspot).toFixed(2) + " AVG CLIENTS: " + ( avgClients / totalHotspots).toFixed(2));
  }
}

let sim = new Simulator();

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
