var CUL =
{
	KEY:
	{
		IS_PRESSED: 0,
		IS_RELEASED: 1,
		IS_DOWN: 2,
		IS_UP: 3,
		SPACE: 32,
		BACKSPACE: 8,
		TAB: 9,
		ENTER: 13,
		SHIFT: 16,
		CTRL: 17,
		ALT: 18,
		PAUSE: 19,
		CAPS_LOCK: 20,
		ESCAPE: 27,
		PAGE_UP: 33,
		PAGE_DOWN: 34,
		END: 35,
		HOME: 36,
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40,
		INSERT: 45,
		DELETE: 46,
		0: 48,
		1: 49,
		2: 50,
		3: 51,
		4: 52,
		5: 53,
		6: 54,
		7: 55,
		8: 56,
		9: 57,
		A: 65,
		B: 66,
		C: 67,
		D: 68,
		E: 69,
		F: 70,
		G: 71,
		H: 72,
		I: 73,
		J: 74,
		K: 75,
		L: 76,
		M: 77,
		N: 78,
		O: 79,
		P: 80,
		Q: 81,
		R: 82,
		S: 83,
		T: 84,
		U: 85,
		V: 86,
		W: 87,
		X: 88,
		Y: 89,
		Z: 90,
		WINDOW_LEFT: 91,
		WINDOW_RIGHT: 92,
		SELECT_KEY: 93,
		NUMPAD_0: 96,
		NUMPAD_1: 97,
		NUMPAD_2: 98,
		NUMPAD_3: 99,
		NUMPAD_4: 100,
		NUMPAD_5: 101,
		NUMPAD_6: 102,
		NUMPAD_7: 103,
		NUMPAD_8: 104,
		NUMPAD_9: 105,
		MULTIPLY: 106,
		ADD: 107,
		SUBSTRACT: 109,
		DECIMAL: 110,
		DIVIDE: 111,
		F1: 112,
		F2: 113,
		F3: 114,
		F4: 115,
		F5: 116,
		F6: 117,
		F7: 118,
		F8: 119,
		F9: 120,
		F10: 121,
		F11: 122,
		F12: 123,
		NUM_LOCK: 144,
		SCROLL_LOCK: 145,
		SEMI_COLON: 186,
		EQUAL: 187,
		COMMA: 188,
		DASH: 189,
		PERIOD: 190,
		SLASH: 191,
		BRACKET_OPEN: 219,
		BACKSLASH: 220,
		BRACKET_CLOSE: 221,
		QUOTE: 222,
		MOUSE_LEFT: 0,
		MOUSE_RIGHT: 1,
		MOUSE_WHEEL_UP: 2,
		MOUSE_WHEEL_DOWN: 3
	},
	CHAR:
	[{
		32: ' ',
		222: '\'',
		188: ',',
		189: '-',
		190: '.',
		191: '/',
		48: '0',
		49: '1',
		50: '2',
		51: '3',
		52: '4',
		53: '5',
		54: '6',
		55: '7',
		56: '8',
		57: '9',
		186: ';',
		65: 'a',
		66: 'b',
		67: 'c',
		68: 'd',
		69: 'e',
		70: 'f',
		71: 'g',
		72: 'h',
		73: 'i',
		74: 'j',
		75: 'k',
		76: 'l',
		77: 'm',
		78: 'n',
		79: 'o',
		80: 'p',
		81: 'q',
		82: 'r',
		83: 's',
		84: 't',
		85: 'u',
		86: 'v',
		87: 'w',
		88: 'x',
		89: 'y',
		90: 'z',
		219: '[',
		187: '=',
		221: ']',
	},
	{
		32: ' ',
		222: '"',
		188: '<',
		189: '_',
		190: '>',
		191: '?',
		48: ')',
		49: '!',
		50: '@',
		51: '#',
		52: '$',
		53: '%',
		54: '^',
		55: '&',
		56: '*',
		57: '(',
		186: ':',
		65: 'A',
		66: 'B',
		67: 'C',
		68: 'D',
		69: 'E',
		70: 'F',
		71: 'G',
		72: 'H',
		73: 'I',
		74: 'J',
		75: 'K',
		76: 'L',
		77: 'M',
		78: 'N',
		79: 'O',
		80: 'P',
		81: 'Q',
		82: 'R',
		83: 'S',
		84: 'T',
		85: 'U',
		86: 'V',
		87: 'W',
		88: 'X',
		89: 'Y',
		90: 'Z',
		219: '{',
		187: '+',
		221: '}',
	}]
};

var cul =
{
	init_callback: null,
	render_callback: null,
	update_callback: null,
	onload_callback: null,
	canvas: null,
	context: null,
	max_fps: 30,
	fps: 0.0,
	frame: 0,
	current_time: 0,
	update_time: 0,
	keys: [],
	mouse: { x: 0, y: 0, wheel: { up: false, down: false }, button: []},
	browser: { width: 0, height: 0 },
	screen: { width: 0, height: 0, center: false },

	listen: function(event, element, callback)
	{
		if (element.addEventListener)
		{
			element.addEventListener(event, callback, false);
		} else if (element.attachEvent)
		{
			element.attachEvent('on' + event, callback);
		}
	},

	trigger: function(event, element)
	{
		if (typeof(element[event]) == 'function')
		{
			element[event]();
		}
	},

	start: function()
	{
		if (this.init_callback != null)
		{
			this.init_callback();
			this.init_callback = null;
		}

		this.run();
	},

	run: function()
	{
		this.current_time = new Date().getTime();
		this.frame += 1;

		if (this.frame >= this.max_fps)
		{
			this.frame = 0;
		}

		if (cul.update_callback != null)
		{
			cul.update_callback();

			cul.mouse.wheel.down = false;
			cul.mouse.wheel.up = false;

			for (var i = 0; i < 2; i++)
			{
				cul.mouse.button[i].down = false;
				cul.mouse.button[i].up = false;
			}

			for (var i = 0; i < 255; i++)
			{
				cul.keys[i].down = false;
				cul.keys[i].up = false;
			}
		}

		if (cul.render_callback != null)
		{
			cul.render_callback();
		}

		this.update_time = new Date().getTime() - this.current_time;

		this.fps = 1000.0 / this.update_time;

		if (this.fps > this.max_fps)
		{
			this.fps = this.max_fps;
		}

		//window.setTimeout(cul.run, (1000.0 / cul.max_fps) - cul.update_time);
		window.setTimeout(cul.run, 1000.0 / cul.max_fps);
	},

	ready: function(callback)
	{
		var old_callback = window.onload;

		if (typeof window.onload != 'function')
		{
			this.listen('load', window, callback);
		} else
		{
			this.listen('load', window, function()
			{
				if (old_callback)
				{
					old_callback();
				}

				callback();
			});
		}
	},

	resize: function()
	{
		if ( ! window.innerWidth)
		{
			if ( ! (document.documentElement.clientWidth == 0))
			{
				cul.browser.width = document.documentElement.clientWidth;
				cul.browser.height = document.documentElement.clientHeight;
			} else
			{
				cul.browser.width = document.body.clientWidth;
				cul.browser.height = document.body.clientHeight;
			}
		} else
		{
			cul.browser.width = window.innerWidth;
			cul.browser.height = window.innerHeight;
		}

		cul.context.canvas.width = (cul.screen.width == null ? cul.browser.width : cul.screen.width);
		cul.context.canvas.height = (cul.screen.height == null ? cul.browser.height : cul.screen.height);
		cul.context.canvas.style.cssText = 'width: ' + cul.context.canvas.width + 'px; height: ' + cul.context.canvas.height + 'px; position: absolute;' + (cul.screen.center ? ' left: ' + (cul.browser.width/2 - cul.context.canvas.width/2) + 'px; top: ' + (cul.browser.height/2 - cul.context.canvas.height/2) + 'px;' : '');
	},

	create: function(title, width, height, center)
	{
		document.title = title;

		this.canvas = document.getElementById('cul');
		this.context = this.canvas.getContext('2d');
		this.context.imageSmoothingEnabled = false;
		this.context.webkitImageSmoothingEnabled = false;
		this.context.mozImageSmoothingEnabled = false;

		this.resize();
		this.listen('resize', window, this.resize);

		this.screen.width = width;
		this.screen.height = height;
		this.screen.center = center;

		this.listen('mousemove', document, function(e)
		{
			e = e || window.event;

			if (e.pageX || e.pageY)
			{
  				cul.mouse.x = e.pageX;
  				cul.mouse.y = e.pageY;
			} else
			{
  				cul.mouse.x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
  				cul.mouse.y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
			}

			cul.mouse.x -= cul.canvas.offsetLeft;
			cul.mouse.y -= cul.canvas.offsetTop;
		});

		for (var i = 0; i < 2; i++)
		{
			this.mouse.button[i] = { down: false, up: false, state: CUL.KEY.IS_RELEASED };
		}

		this.listen('mousedown', window, function(e)
		{
			if (e.which)
			{
				cul.mouse.button[0].down = (e.which == 1);
				cul.mouse.button[1].down = (e.which == 3);
			} else if (e.button)
			{
				cul.mouse.button[0].down = (e.button == 0);
				cul.mouse.button[1].down = (e.button == 2);
			}

			for (var i = 0; i < 2; i++)
			{
				if (cul.mouse.button[i].down)
				{
					cul.mouse.button[i].state = CUL.KEY.IS_PRESSED;
				}
			}
		});

		this.listen('mouseup', window, function(e)
		{
			if (e.which)
			{
				cul.mouse.button[0].up = (e.which == 1);
				cul.mouse.button[1].up = (e.which == 3);
			} else if (e.button)
			{
				cul.mouse.button[0].up = (e.button == 0);
				cul.mouse.button[1].up = (e.button == 2);
			}

			for (var i = 0; i < 2; i++)
			{
				if (cul.mouse.button[i].up)
				{
					cul.mouse.button[i].state = CUL.KEY.IS_RELEASED;
				}
			}
		});

		this.listen('contextmenu', window, function(e)
		{
			e.preventDefault();
		});

		this.listen('mousewheel', window, function(e)
		{
			var delta = 0;
			cul.mouse.wheel.up = false;
			cul.mouse.wheel.down = false;

			e = e || window.event;

			if (e.wheelDelta)
			{
				delta = event.wheelDelta / 120;

				if (window.opera)
				{
					delta = -delta;
				}
			} else if (e.detail)
			{
				delta = -e.detail / 3;
			}

			if (delta > 0)
			{
				cul.mouse.wheel.up = true;
			} else if (delta < 0)
			{
				cul.mouse.wheel.down = true;
			}
		});

		for (var i = 0; i < 255; i++)
		{
			this.keys[i] = { down: false, up: false, state: CUL.KEY.IS_RELEASED, once: false };
		}

		this.listen('keydown', window, function(event)
		{
			if ( ! cul.keys[event.keyCode].once)
			{
				cul.keys[event.keyCode].down = true;
				cul.keys[event.keyCode].state = CUL.KEY.IS_PRESSED;
				cul.keys[event.keyCode].once = true;
			}
		});

		this.listen('keyup', window, function(event)
		{
			cul.keys[event.keyCode].up = true;
			cul.keys[event.keyCode].once = false;
			cul.keys[event.keyCode].state = CUL.KEY.IS_RELEASED;
		});

		this.canvas.width = (width == null ? this.browser.width : width);
		this.canvas.height = (height == null ? this.browser.height : height);
		this.canvas.style.cssText = 'width: ' + this.canvas.width + 'px; height: ' + this.canvas.height + 'px; position: absolute;' + (this.screen.center ? ' left: ' + (this.browser.width/2 - this.canvas.width/2) + 'px; top: ' + (this.browser.height/2 - this.canvas.height/2) + 'px;' : '');

		if (this.context)
		{
			setTimeout( function()
			{
				cul.start();
			});
		}

		return this.context;
	},

	render: function(callback)
	{
		this.render_callback = callback;
	},

	update: function(callback)
	{
		this.update_callback = callback;
	},

	init: function(callback)
	{
		this.init_callback = callback;
	},

	load: function(callback)
	{
		this.load_callback = callback;
	},

	keycode: function(key)
	{
		for (var k in CUL_CHAR[0])
		{
			if (CUL_CHAR[0][k] == key)
			{
				return k;
			}
		}

		return;
	},

	keydown: function(key)
	{
		if (typeof key == 'string')
		{
			key = this.keycode(key);
		}

		if (typeof this.keys[key] != 'undefined')
		{
			if (this.keys[key].down)
			{
				return true;
			}
		}

		return false;
	},

	keyup: function(key)
	{
		if (typeof key == 'string')
		{
			key = this.keycode(key);
		}

		if (typeof this.keys[key] != 'undefined')
		{
			if (this.keys[key].up)
			{
				return true;
			}
		}

		return false;
	},

	keypressed: function(key)
	{
		if (typeof key == 'string')
		{
			key = this.keycode(key);
		}

		if (typeof this.keys[key] != 'undefined')
		{
			if (this.keys[key].state == CUL.KEY.IS_PRESSED)
			{
				return true;
			}
		}

		return false;
	},

	mousedown: function(button)
	{
		if (this.mouse.button[button].down)
		{
			return true;
		}

		return false;
	},

	mouseup: function(button)
	{
		if (this.mouse.button[button].up)
		{
			return true;
		}

		return false;
	},

	mousepressed: function(button)
	{
		if (this.mouse.button[button].state == CUL.KEY.IS_PRESSED)
		{
			return true;
		}

		return false;
	},

	mousewheelup: function()
	{
		return this.mouse.wheel.up;
	},

	mousewheeldown: function()
	{
		return this.mouse.wheel.down;
	},

	mousepos: function()
	{
		return { x: this.mouse.x, y: this.mouse.y };
	},

	get_fps: function()
	{
		return Math.floor(this.fps);
	}
};
