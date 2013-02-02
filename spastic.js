// forgive me father, for I have sinned...
// made in ~20-30 hours for @js13kgames
// if you're beginner programmer, you should stop reading this code immediately! :)

// kick detection from dancer.js library

var angle_vector = function(angle, len)
{
	if (typeof len == 'undefined')
	{
		len = 1.0;
	}

	var vec = {x: cos(angle) * len, y: sin(angle) * len};

	return vec;
};

var vector_direction = function(x1, y1, x2, y2)
{
	return -Math.atan2(x2 - x1, y2 - y1) + Math.PI - dtor(90);
};

var vector_distance = function(x1, y1, x2, y2)
{
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
};

var rtod = function(rad)
{
	return rad / (Math.PI / 180);
};

var dtor = function(deg)
{
	return deg * (Math.PI / 180);
};

var wrap = function(v, max, min)
{
	return (v < min) ? (v - min) + max : (v > max) ? (v - max) + min : v;
};

var angle_normal = function(a)
{
	return wrap(a, Math.PI * 2.0, 0.0);
};

var angle_between = function(n, a, b)
{
	n = (360 + (n % 360)) % 360;
	a = (3600000 + a) % 360;
	b = (3600000 + b) % 360;

	if (a < b)
	{
		return a <= n && n <= b;
	}

	return a <= n || n <= b;
};

String.prototype.repeat = function(r)
{
   return --r ? this + this.repeat(r) : '' + this;
};

var game =
{
	font_indices:
	[
		[ 0, 0 ],
		[ 1, 0 ],
		[ 2, 0 ],
		[ 3, 0 ],
		[ 4, 0 ],
		[ 0, 1 ],
		[ 1, 1 ],
		[ 2, 1 ],
		[ 3, 1 ],
		[ 4, 1 ],
		[ 0, 2 ],
		[ 1, 2 ],
		[ 2, 2 ],
		[ 3, 2 ],
		[ 4, 2 ],
		[ 0, 3 ],
		[ 1, 3 ],
		[ 2, 3 ],
		[ 3, 3 ],
		[ 4, 3 ],
		[ 0, 4 ],
		[ 1, 4 ],
		[ 2, 4 ],
		[ 3, 4 ],
		[ 4, 4 ]
	],
	font_letters:
	{
		'a': '0,1,2,3,4,5,9,10,11,12,13,14,15,19,20,24',
		'b': '0,1,2,3,5,9,10,11,12,13,14,15,19,20,21,22,23',
		'c': '0,1,2,3,4,5,10,15,20,21,22,23,24',
		'd': '0,1,2,3,5,9,10,14,15,19,20,21,22,23',
		'e': '0,1,2,3,4,5,10,11,12,13,15,20,21,22,23,24',
		'f': '0,1,2,3,4,5,10,11,12,13,15,20',
		'g': '0,1,2,3,4,5,10,12,13,14,15,19,20,21,22,23,24',
		'h': '0,4,5,9,10,11,12,13,14,15,19,20,24',
		'i': '0,1,2,3,4,7,12,17,20,21,22,23,24',
		'j': '0,1,2,3,7,12,15,17,20,21,22',
		'k': '0,3,5,7,10,11,15,17,20,23',
		'l': '0,5,10,15,20,21,22,23',
		'm': '0,4,5,6,8,9,10,12,14,15,19,20,24',
		'n': '0,4,5,6,9,10,12,14,15,18,19,20,24',
		'o': '0,1,2,3,4,5,9,10,14,15,19,20,21,22,23,24',
		'p': '0,1,2,3,4,5,9,10,11,12,13,14,15,20',
		'q': '0,1,2,3,4,5,9,10,14,15,18,19,20,21,22,23,24',
		'r': '0,1,2,3,4,5,9,10,11,12,13,14,15,18,20,24',
		's': '0,1,2,3,4,5,10,11,12,13,14,19,20,21,22,23,24',
		't': '0,1,2,3,4,7,12,17,22',
		'u': '0,4,5,9,10,14,15,19,20,21,22,23,24',
		'v': '0,4,5,9,11,13,16,18,22',
		'w': '0,4,5,9,10,12,14,15,16,18,19,20,24',
		'x': '0,4,6,8,12,16,18,20,24',
		'y': '0,4,6,8,12,17,22',
		'z': '0,1,2,3,4,8,12,16,20,21,22,23,24',
		'0': '1,2,3,5,9,10,14,15,19,21,22,23',
		'1': '1,2,7,12,17,22',
		'2': '1,2,5,8,12,16,20,21,22,23',
		'3': '0,1,2,3,8,11,12,13,18,20,21,22,23',
		'4': '0,3,5,8,10,11,12,13,18,23',
		'5': '1,2,3,5,10,11,12,13,18,20,21,22,23',
		'6': '0,1,2,3,5,10,11,12,13,15,18,20,21,22,23',
		'7': '0,1,2,3,8,12,16,20',
		'8': '0,1,2,3,5,8,11,12,15,18,20,21,22,23',
		'9': '0,1,2,3,5,8,10,11,12,13,18,20,21,22,23',
		' ': '',
		'.': '23',
		'+': '7,10,11,12,17'
	},
	width: 640,
	height: 480,
	viewport:
	{
		x: 320,
		y: 240,
		zoom: 1.0,
		angle: 30
	},
	state: 'menu',
	menu:
	[
		{
			entries:
			[
				{ label: 'load music from hard drive', click: function() { } }/*,
				{ label: 'load music from URL', click: function() { var url = prompt('Enter URL to mp3 file'); if (url !== null && url != '') game.load(url); } }*/
			]
		},
		{
			entries:
			[
				{ label: 'play again', click: function() { game.init_track(game.buffer); } },
				{ label: 'choose another track', click: function() { game.state = 'menu'; } }
			]
		}
	],
	buffer: null,
	frame_buffer: 4096,
	buffer_size: 2048,
	signal: [ null, null],
	fft: [ null, null],
	req: null,
	source: [ null, null],
	context: [ null, null],
	gain: null,
	proc: [ null, null],
	waveform: [[], []],
	frequency: [ 0, 10 ],
    threshold: 0.3,
    decay: 0.02,
    current_threshold: 0.3,
    tick: 0,
	running: [ false, false ],
	mute: false,
	angle: 0,
	angle_dir: 1,
	angle_speed: 1,
	last_pos: null,
	delay: 0,
	time_diff: 0,
	timer: [ 0, 0 ],
	end_points: 0,
	points: 0,
	tmp_points: 0,
	missed: 0,
	scored: 0,
	combo: 0,
	color: [ 1, 1, 1 ],
	bg: [ { x: 0, y: 0, r: 0, g: 0, b: 0, timer: 0, angle: 0 }, { x: 0, y: 0, r: 0, g: 0, b: 0, timer: 0, angle: 0 } ],
	circle: { angle: [ 0, 0 ], base_size: Math.PI / 4, size: [ Math.PI / 4, Math.PI / 4 ], radius: 100 },
	msg: { message: '', r: 1, g: 1, b: 1, timer: 0 },
	message: function(msg, r, g, b)
	{
		this.msg.message = msg;
		this.msg.r = r;
		this.msg.g = g;
		this.msg.b = b;
		this.msg.timer = 20;
	},
	init_menu: function(index)
	{
		var menu = this.menu[index];

		var counter = 0;

		for (var i = 0; i < menu.entries.length; i++)
		{
			var entry = menu.entries[i];

			this.menu[index].entries[i].hover = false;

			if (typeof entry.size == 'undefined')
			{
				this.menu[index].entries[i].size = 2.5;
			}

			if (typeof entry.x == 'undefined')
			{
				this.menu[index].entries[i].min = { x: 320 - (entry.label.length * entry.size * 6) / 2, y: 120 + (counter * 35) };
				this.menu[index].entries[i].max = { x: 320 + (entry.label.length * entry.size * 6) / 2, y: 120 + (counter * 35) + 35 };

				counter++;
			} else
			{
				//this.write(entry.x, entry.y, entry.label, 5, 0);
			}
		}
	},
	render_menu: function(index)
	{
		var menu = this.menu[index];

		var counter = 0;

		for (var i = 0; i < menu.entries.length; i++)
		{
			var entry = menu.entries[i];

			if (entry.hover)
			{
				cgl.color(this.color[0], this.color[1], this.color[2]);
			} else
			{
				cgl.color(1, 1, 1);
			}

			if (typeof entry.x == 'undefined')
			{
				this.write(320, 120 + (counter * 35), entry.label, entry.size, 1);

				counter++;
			} else
			{
				this.write(entry.x, entry.y, entry.label, entry.size, 0);
			}
		}
	},
	update_menu: function(index)
	{
		var menu = this.menu[index];

		var counter = 0;
		var mouse = cul.mousepos();
		mouse = cgl.to_ortho(mouse.x, mouse.y);

		for (var i = 0; i < menu.entries.length; i++)
		{
			var entry = menu.entries[i];

			if (entry.min.x < mouse.x && entry.min.y < mouse.y && entry.max.x > mouse.x && entry.max.y > mouse.y)
			{
				this.menu[index].entries[i].hover = true;

				if (cul.mousedown(CUL.KEY.MOUSE_LEFT))
				{
					entry.click();
				}
			} else
			{
				this.menu[index].entries[i].hover = false;
			}
		}
	},
	load: function(url)
	{
		this.state = 'loading';
		this.render();

		setTimeout( function()
		{
			if (game.req !== null)
			{
				delete game.req;
			}

			game.req = new XMLHttpRequest();
			game.req.open('GET', url, true);
			game.req.responseType = 'arraybuffer';

			game.req.onload = function()
			{
				game.init_track(game.req.response);
			};

			game.req.send();
		}, 500);
	},
	stop: function()
	{
		this.clean();
	},
	clean: function()
	{
		this.timer[0] = 0;
		this.running[0] = false;
		this.timer[1] = 0;
		this.running[1] = false;
		this.time_diff = 0;

		this.angle = 90;
		this.angle_dir = -1;
		this.angle_speed = 1;
		this.points = 0;
		this.tmp_points = 0;
		this.missed = 0;
		this.scored = 0;
		this.combo = 0;

		this.last_pos = null;
		this.delay = 0;
		this.time_diff = null;

		this.bg = [ { x: 0, y: 0, r: 0, g: 0, b: 0, timer: 0, angle: 0 }, { x: 0, y: 0, r: 0, g: 0, b: 0, timer: 0, angle: 0 } ];
		this.circle = { angle: [ 0, 0 ], base_size: Math.PI / 4, size: [Math.PI / 4, Math.PI / 4 ], radius: 100 };

		for (var i = 0; i < 2; i++)
		{
			if (this.source[i] !== null)
			{
				this.source[i].disconnect();
				this.source[i].noteOff(0);

				delete this.source[i];
				this.source[i] = null;
			}

			if (this.proc[i] !== null)
			{
				this.proc[i].onaudioprocess = function() {};
				this.proc[i].disconnect();

				delete this.proc[i];
				this.proc[i] = null;
			}

			if (this.waveform[i] !== null)
			{
				delete this.waveform[i];
				this.waveform[i] = null;
			}

			if (this.signal[i] !== null)
			{
				delete this.signal[i];
				this.signal[i] = null;
			}

			if (this.fft[i] !== null)
			{
				delete this.fft[i];
				this.fft[i] = null;
			}

			if (this.context[i] !== null)
			{
				delete this.context[i];
				this.context[i] = null;
			}
		}
	},
	init_track: function(buffer)
	{
		this.buffer = buffer;

		this.clean();

		for (var i = 0; i < 2; i++)
		{
			this.signal[i] = new Float32Array(this.buffer_size);
			this.waveform[i] = new Float32Array(this.buffer_size);

			this.fft[i] = new FFT(this.buffer_size, 44100);
			this.context[i] = new webkitAudioContext();

			this.source[i] = this.context[i].createBufferSource();

			this.proc[i] = this.context[i].createJavaScriptNode(this.buffer_size);

			this.source[i].connect(this.proc[i]);
			this.proc[i].connect(this.context[i].destination);

			this.proc[i].onaudioprocess = this.process_track[i];

			//this.source[i].buffer = this.context[i].createBuffer(buffer, false);

			if (i == 0)
			{
				this.context[i].decodeAudioData(buffer, function(b)
				{
					game.source[0].buffer = b;
				}, function(err)
				{

				});
			} else
			{
				this.context[i].decodeAudioData(buffer, function(b)
				{
					game.source[1].buffer = b;

					game.ready_track();
				}, function(err)
				{
					console.log(err);
				});
			}

			this.source[i].loop = false;
		}
	},
	ready_track: function()
	{
		this.state = 'game';

		this.source[0].noteOn(0);
		this.source[1].noteOn(this.context[1].currentTime + 3);
	},
	get_waveform: function()
	{
		return this.signal[1];
	},
    get_spectrum: function(i)
    {
		return this.fft[i].spectrum;
	},

	/* begin dancer.js library */
	max_amplitude: function(frequency)
	{
		var max = 0;
		var fft = this.get_spectrum(0);

		if ( ! frequency.length)
		{
			return frequency < fft.length ? fft[~~frequency] : null;
		}

		for (var i = frequency[0], l = frequency[1]; i <= l; i++)
		{
			if (fft[i] > max)
			{
				max = fft[i];
			}
		}

		return max;
	},
	get_frequency: function(freq, end_freq)
	{
		var sum = 0;

		if (end_freq !== undefined)
		{
			for (var i = freq; i <= end_freq; i++)
			{
				sum += this.get_spectrum(1)[i];
			}

			return sum / (end_freq - freq + 1);
		} else
		{
			return this.get_spectrum(1)[freq];
		}
	},
	/* end dancer.js library */
	process_track:
	[
		function()
		{
			if (game.source[0] == 2)
			{
				game.running[0] = true;
			}

			var input_l = event.inputBuffer.getChannelData(0);
			var input_r = event.inputBuffer.getChannelData(1);
			var output_l = event.outputBuffer.getChannelData(0);
			var output_r = event.outputBuffer.getChannelData(1);

			var avg;

			for (var i = 0, j = input_l.length; i < j; i++)
			{
				avg = parseFloat(input_l[i]) + parseFloat(input_r[i]);
				game.waveform[0][2 * i] = avg / 2;
				game.waveform[0][i * 2 + 1] = avg / 2;
				game.signal[0][2 * i] = avg * 0.93;
				game.signal[0][i * 2 + 1] = avg * 0.93;
			}

			game.fft[0].forward(game.signal[0]);

			var magnitude = game.max_amplitude(game.frequency);

			if (magnitude >= game.current_threshold && magnitude >= game.threshold)
			{
				var dir = angle_normal(dtor(game.angle + rtod(avg / 2.8)));

				var x = 320 + Math.cos(dir) * 900;
				var y = 240 + Math.sin(dir) * 900;

				var inverted = false;

				if (game.last_pos != null)
				{
					if (game.delay < 10 && ! game.last_pos.inverted)
					{
						inverted = true;

						dir = angle_normal(dtor(game.angle + 180 + avg));

						x = 320 + Math.cos(dir) * 900;
						y = 240 + Math.sin(dir) * 900;
					}
				}

				dir = vector_direction(x, y, 320, 240);

				var vx = Math.cos(dir) * 10;
				var vy = Math.sin(dir) * 10;

				game.add_particle(x, y, vx, vy, 0, magnitude, game.timer[0]);

				game.last_pos = { x: x, y: y, dir: dir, inverted: inverted };
				game.delay = 0;

				game.current_threshold = magnitude;
			} else
			{
				game.current_threshold -= game.decay;
			}
		},
		function()
		{
			if (game.source[1].playbackState == 2)
			{
				if ( ! game.running[1])
				{
					game.time_diff = game.timer[0];
				}

				game.running[1] = true;
			}

			var input_l = event.inputBuffer.getChannelData(0);
			var input_r = event.inputBuffer.getChannelData(1);
			var output_l = event.outputBuffer.getChannelData(0);
			var output_r = event.outputBuffer.getChannelData(1);

			var avg;

			for (var i = 0, j = input_l.length; i < j; i++)
			{
				avg = parseFloat(input_l[i]) + parseFloat(input_r[i]);
				game.waveform[1][2 * i] = avg / 2;
				game.waveform[1][i * 2 + 1] = avg / 2;
				game.signal[1][2 * i] = avg * 0.93;
				game.signal[1][i * 2 + 1] = avg * 0.93;
			}

			if ( ! game.mute && game.running[1])
			{
				for (var i = 0; i < input_l.length; ++i)
				{
					output_l[i] = input_l[i];
					output_r[i] = input_r[i];
				}
			}

			game.fft[1].forward(game.signal[1]);
		}
	],
	particle: function(x, y, vx, vy, type, magn, start)
	{
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.type = type;
		this.remove = false;
		this.color = [ 1, 1, 1 ];
		this.alpha = 1;
		this.size = 5;
		this.render_size = 5;
		this.base_size = 5;
		this.magn = magn * 3.0;
		this.timer = 0;
		this.angle = 0;
		this.start = start;
		this.hit = false;
	},
	particles: [],
	particles_ids: [],
	add_particle: function(x, y, vx, vy, type, magn, start)
	{
		if (this.particles_ids.length == 0)
		{
			this.particles.push(new this.particle(x, y, vx, vy, type, magn, start));
		} else
		{
			var id = this.particles_ids.pop();

			this.particles[id] = new this.particle(x, y, vx, vy, type, magn, start);
		}
	},
	init: function()
	{
		cul.listen('click', cul.canvas, function()
		{
			if (game.state == 'menu' && game.menu[0].entries[0].hover)
			{
				cul.trigger('click', document.getElementById('local'));
			}
		});

		cul.listen('change', document.getElementById('local'), function(e)
		{
			var files = e.target.files;

			for (var i = 0, f; f = files[i]; i++)
			{
				if (f.type == 'audio/mp3')
				{
					game.state = 'loading';
					game.render();

					setTimeout( function()
					{
						var reader = new FileReader();

						reader.onload = (function(e)
						{
							var data = this.result;

							game.init_track(data);
						});

						reader.readAsArrayBuffer(f);
					}, 500);

					break;
				} else
				{
					alert('MP3 file required.');
				}
			}
		});

		for (var i = 0; i < 2; i++)
		{
			this.init_menu(i);
		}
	},
	update: function()
	{
		this.color[0] = this.rand(30, 80) / 100;
		this.color[1] = this.rand(30, 80) / 100;
		this.color[2] = this.rand(30, 80) / 100;

		if (this.state == 'menu')
		{
			this.update_menu(0);
		} else if (this.state == 'end')
		{
			this.update_menu(1);
		} else if (this.state == 'game')
		{
			for (var i = 0; i < this.particles.length; i++)
			{
				if (this.particles[i] !== null)
				{
					if (this.particles[i].remove)
					{
						delete this.particles[i];
						this.particles[i] = null;
						this.particles_ids.push(i);
					} else
					{
						this.particles[i].update();
					}
				}
			}
		}

		if (this.running[0])
		{
			this.delay++;
		}

		if (cul.keypressed(CUL.KEY.LEFT))
		{
			this.circle.angle[0] -= 9;
		}

		if (cul.keypressed(CUL.KEY.RIGHT))
		{
			this.circle.angle[0] += 9;
		}

		if (cul.keypressed(CUL.KEY.UP))
		{
			if (this.tmp_points > 0)
			{
				this.points += this.tmp_points;
				this.message('+' + this.tmp_points, 1.0, 0.9, 0.0);
				this.combo = 0;
				this.angle_speed = 1;
				this.tmp_points = 0;

				this.circle.size[0] = this.circle.size[1] = this.circle.base_size;
			}
		}

		this.circle.angle = wrap(this.circle.angle, 360, 0);

		this.circle.angle[1] = this.circle.angle[0] + 180;
		this.circle.size[1] = this.circle.size[0];

		if (this.running[1])
		{
			for (var i = 0; i < 2; i++)
			{
				if (this.running[i])
				{
					this.timer[i]++;
				}
			}

			if (this.timer[1] % 200 == 0 && game.rand(0, 100) > 50)
			{
				this.angle_dir *= -1;
			}

			var freq = this.get_frequency(1) * 0.2;

			if (freq > 0.2)
			{
				freq = 0.2;
			}

			this.angle += this.angle_speed * this.angle_dir;

			this.viewport.zoom = 1 - freq;

			if (this.context[1].activeSourceCount == 0)
			{
				this.end_points = this.points + this.tmp_points;
				this.stop();
				this.state = 'end';
				this.render();
			}
		}

		this.tick++;

		if (this.tick >= 100)
		{
			this.tick = 0;
		}
	},
	render_hud: function()
	{
		cgl.unbind();

		cgl.begin(CGL_LINE);
			cgl.vertex(5, 50);
			cgl.vertex(635, 50);
		cgl.end();

		cgl.begin(CGL_LINE);
			cgl.vertex(5, 430);
			cgl.vertex(635, 430);
		cgl.end();

		if (this.state == 'game')
		{
			this.write(5, 480 - 40, cul.get_fps() + 'fps', 5);

			var diff = (1000000 - this.points).toString().length - this.points.toString().length + (this.points > 0 ? 1 : 0);

			this.write(635, 10, 'score ' + '0'.repeat(diff) + this.points, 5, 2);

			var diff = (1000000 - this.tmp_points).toString().length - this.tmp_points.toString().length + (this.tmp_points > 0 ? 1 : 0);

			this.write(635, 480 - 40, 'points ' + '0'.repeat(diff) + this.tmp_points, 5, 2);

			this.write(320, 240 - (25 / 2), 'x' + this.combo, 5, 1);

			if (this.msg.timer > 0)
			{
				cgl.color(this.msg.r, this.msg.g, this.msg.b);
				this.write(320, 195, this.msg.message, 5, 1);
				this.msg.timer--;
			}
		} else if (this.state == 'loading')
		{
			this.write(320, 220, 'loading...', 5, 1);
		} else if (this.state == 'end')
		{
			this.write(320, 10, 'spastic', 5, 1);

			this.render_menu(1);

			cgl.color(1, 1, 1);

			this.write(320, 300, 'score ' + this.end_points, 5, 1);
		} else
		{
			this.write(320, 10, 'spastic', 5, 1);

			this.render_menu(0);
		}
	},
	render: function()
	{
		cgl.clear();

		if (this.running[1])
		{
			this.draw_bg(false);

			this.draw_circle(512, 384, 100, 0, 2 * Math.PI, 1, '#000', true);
		}

		cgl.push_matrix();

		cgl.scale(this.viewport.zoom, this.viewport.zoom);
		cgl.translate(-this.viewport.x + (this.width / 2 / this.viewport.zoom), -this.viewport.y + (this.height / 2 / this.viewport.zoom));

		cgl.unbind();

		if (this.running[1])
		{
			this.draw_bg(true);

			this.draw_circle(512, 384, 100, 0, 2 * Math.PI, 1, '#000', true);
		}

		for (var i = 0; i < this.particles.length; i++)
		{
			if (this.particles[i] !== null && ! this.particles[i].remove)
			{
				this.particles[i].render();
			}
		}

		cgl.color(1, 1, 1);

		if (this.state == 'game')
		{
			this.draw_circle(512, 384, 100, 0, 2 * Math.PI, 2, '#ccc', false);

			for (var i = 0; i < 2; i++)
			{
				this.draw_circle(512, 384, 100, dtor(this.circle.angle[i]) - this.circle.size[i], dtor(this.circle.angle[i]) + this.circle.size[i], 15, '#fff', false);
			}
		}

		cgl.pop_matrix();

		cgl.push_matrix();
		this.render_hud();
		cgl.pop_matrix();
	},
	rand: function(min, max)
	{
		return min + Math.floor(Math.random() * max);
	},
	rect: function(x, y, w, h)
	{
		cgl.begin(CGL_QUAD);
			cgl.vertex(x, y);
			cgl.vertex(x + w, y);
			cgl.vertex(x + w, y + h);
			cgl.vertex(x, y + h);
		cgl.end();
	},
	quad: function(x, y, w, h)
	{
		cgl.begin(CGL_QUAD);
			cgl.vertex(x - w/2, y - h/2);
			cgl.vertex(x + w/2, y - h/2);
			cgl.vertex(x + w/2, y + h/2);
			cgl.vertex(x - w/2, y + h/2);
		cgl.end();
	},
	write: function(x, y, message, size, align)
	{
		message = message.toString().toLowerCase().split('');
		align = align || 0;

		var align_pos = 0;

		if (align == 1) // center
		{
			align_pos = -(message.length * (size * 6) - size) / 2;
		} else if (align == 2)
		{
			align_pos = -(message.length * (size * 6));
		}

		for (var i = 0; i < message.length; i++)
		{
			var letter = message[i];

			if (letter != ' ')
			{
				var indices = this.font_letters[letter].split(',');

				for (var j = 0; j < indices.length; j++)
				{
					this.rect(align_pos + i * size + x + (this.font_indices[indices[j]][0] * size) + (i * (5 * size)), y + (this.font_indices[indices[j]][1] * size), size, size)
				}
			}
		}
	},
	draw_circle: function(x, y, radius, min, max, width, color, fill)
	{
		if (fill)
		{
			cgl.context.fillStyle = color;
		} else
		{
			cgl.context.strokeStyle = color;
		}

		cgl.context.lineWidth = width;

		cgl.context.beginPath();
		cgl.context.arc(x, y, radius, min, max);

		if (fill)
		{
			cgl.context.fill();
		} else
		{
			cgl.context.stroke();
		}
	},
	draw_bg: function(fade)
	{
		for (var i = 0; i < 2; i++)
		{
			if (this.bg[i].timer > 0)
			{
				var part = angle_normal(dtor(360 / (this.bg[i].x + 1)));
				var angle = angle_normal(this.bg[i].x * part);

				if (fade)
				{
					var mul = ((this.bg[i].timer + 20) / 30);

					cgl.color(this.bg[i].r * 0.5 * mul, this.bg[i].g * 0.5 * mul, this.bg[i].b * 0.5 * mul);
				} else
				{
					cgl.color(this.bg[i].r * 0.5, this.bg[i].g * 0.5, this.bg[i].b * 0.5);
				}

				cgl.begin(CGL_TRIANGLE);
					cgl.vertex(320, 240);
					cgl.vertex(320 + Math.cos(this.bg[i].angle + (fade ? dtor(this.angle) : 0)) * 900, 240 + Math.sin(this.bg[i].angle + (fade ? dtor(this.angle) : 0)) * 900);
					cgl.vertex(320 + Math.cos(this.bg[i].angle + (fade ? dtor(this.angle) : 0) + dtor(30)) * 900, 240 + Math.sin(this.bg[i].angle + (fade ? dtor(this.angle) : 0) + dtor(30)) * 900);
				cgl.end();

				if ( ! fade)
				{
					this.bg[i].timer--;
				}
			}
		}
	}
};

game.particle.prototype.update = function()
{
	if (game.timer[1] >= this.start)
	{
		if (this.hit)
		{
			this.color[0] = game.color[0];
			this.color[1] = game.color[1];
			this.color[2] = game.color[2];

			if (vector_distance(320, 240, this.x, this.y) > 500)
			{
				this.remove = true;
			}
		}

		if (this.type == 0)
		{
			var hit = true;

			for (var i = 0; i < 2; i++)
			{
				var a = dtor(game.circle.angle[i] - 90);

				var dir = rtod(vector_direction(320, 240, this.x, this.y));

				var min = game.circle.angle[i] - rtod(game.circle.size[i]);
				var max = game.circle.angle[i] + rtod(game.circle.size[i]);
				var dist = vector_distance(320, 240, this.x, this.y);

				if (dist <= 80 && dist >= 70)
				{

					if (angle_between(dir, min, max))
					{
						this.hit = true;
						this.vx *= -1;
						this.vy *= -1;

						game.circle.size[0] -= 0.005;
						game.circle.size[1] -= 0.005;

						if (game.circle.size[0] < Math.PI / 30)
						{
							game.circle.size[0] = Math.PI / 30;
						}

						if (game.circle.size[1] < Math.PI / 30)
						{
							game.circle.size[1] = Math.PI / 30;
						}

						this.render_size = this.base_size * this.magn;

						game.combo++;
						game.angle_speed += 0.02;
						game.scored++;

						game.tmp_points += (10 * game.combo);
						//game.add_particle(this.x, this.y, 0, 0, 1);

						for (var i = 0; i < 2; i++)
						{
							game.bg[i].x = game.rand(0, 8);
							game.bg[i].y = game.rand(0, 2);
							game.bg[i].r = game.rand(20, 80) / 100.0;
							game.bg[i].g = game.rand(20, 80) / 100.0;
							game.bg[i].b = game.rand(20, 80) / 100.0;
							game.bg[i].timer = (i == 0 ? 25 : 30);
							game.bg[i].angle = dtor(game.rand(0, 360));
						}

						break;
					}
				} else if  (dist < 20)
				{
					if (i == 1)
					{
						hit = false;
					}
				}
			}

			if ( ! hit)
			{
				game.missed++;
				game.combo = 0;
				game.tmp_points = 0;
				this.remove = true;
				game.angle_speed = 1;
				game.message('miss', 0.8, 0.1, 0.1);

				game.circle.size[0] = game.circle.size[1] = game.circle.base_size;
			}
		}

		if (this.type == 1)
		{
			this.size += 2;

			if (this.alpha > 0)
			{
				this.alpha -= 0.05;

				if (this.alpha <= 0)
				{
					this.remove = true;
				}
			} else
			{
				this.remove = true;
			}
		}

		if (this.render_size > this.base_size)
		{
			this.render_size -= 0.2;
		}

		if (this.render_size < this.base_size)
		{
			this.render_size = this.base_size;
		}

		this.x += this.vx;
		this.y += this.vy;
	}
};

game.particle.prototype.render = function()
{
	cgl.color(this.color[0], this.color[1], this.color[2]);
	cgl.alpha(this.alpha);
	game.quad(this.x, this.y, this.render_size * 2, this.render_size * 2);
};

cul.ready( function()
{
	cgl.context = cul.create('Spastic', 1024, 768, true);
	cgl.ortho(0, game.width, game.height, 0);
});

cul.init( function()
{
	game.init();
});

cul.update( function()
{
	game.update();
});

cul.render( function()
{
	game.render();
});
