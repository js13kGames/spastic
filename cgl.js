var CGL_PRIMITIVES = [ 0, 1, 2, 3, 4, 5 ];
var CGL_LINE = 0;
var CGL_LINE_STRIP = 1;
var CGL_TRIANGLE = 2;
var CGL_QUAD = 3;
var CGL_POLYGON = 4;
var CGL_POINT = 5;

var cgl =
{
	context: null,
	m_vertices: [],
	m_primitive: null,
	m_color: '#FFFFFF',
	m_alpha: 1.0,
	m_texture: null,
	m_point_size: 1,
	m_ortho: { left: 0, right: 640, bottom: 480, top: 0 },

	ortho: function(left, right, bottom, top)
	{
		this.m_ortho.left = left;
		this.m_ortho.right = right;
		this.m_ortho.bottom = bottom;
		this.m_ortho.top = top;
	},

	to_ortho: function(x, y)
	{
		return { x: x / this.context.canvas.width * (this.m_ortho.right - this.m_ortho.left), y: y / this.context.canvas.height * (this.m_ortho.bottom - this.m_ortho.top) };
	},

	dec2hex: function(dec)
	{
		var digits = '0123456789ABCDEF';

		return (digits[dec >> 4] + digits[dec & 15]);
	},

	color: function(r, g, b, a)
	{
		r = 255 * r;
		g = 255 * g;
		b = 255 * b;
		a = a || 1.0;

		if (a != this.m_alpha)
		{
			this.m_alpha = a;
			this.alpha(a);
		}

		this.m_color = '#' + this.dec2hex(r) + this.dec2hex(g) + this.dec2hex(b);
	},

	alpha: function(a)
	{
		this.context.globalAlpha = a;
	},

	point_size: function(a)
	{
		this.m_point_size = a;
	},

	is_valid_primitive: function(primitive)
	{
		for (var i = 0; i < CGL_PRIMITIVES.length; i++)
		{
			if (primitive == CGL_PRIMITIVES[i])
			{
				return true;
			}
		}

		return false;
	},

	bind: function(texture)
	{
		this.m_texture = texture;
	},

	unbind: function()
	{
		this.m_texture = null;
	},

	begin: function(primitive)
	{
		if (this.is_valid_primitive(primitive))
		{
			this.m_primitive = primitive;

			if (this.m_primitive == CGL_LINE || this.m_primitive == CGL_LINE_STRIP)
			{
				this.context.strokeStyle = this.m_color;
			} else
			{
				if (this.m_texture != null)
				{
					this.context.fillStyle = this.context.createPattern(this.m_texture, 'repeat');
				} else
				{
					this.context.fillStyle = this.m_color;
				}
			}

			this.context.beginPath();
		} else
		{
			this.m_primitive = null;
		}
	},

	end: function()
	{
		if (this.m_primitive != null)
		{
			this.context.closePath();

			if (this.m_primitive == CGL_LINE || this.m_primitive == CGL_LINE_STRIP)
			{
				this.context.stroke();
			} else
			{
				this.context.fill();
			}

			// before CGL_POINT close path was here
			//this.context.closePath();

			this.m_primitive = null;
			this.m_vertices = [];
		}
	},

	vertex: function(x, y)
	{
		x = x / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width;
		y = y / (this.m_ortho.bottom - this.m_ortho.top) * this.context.canvas.height;

		if (this.m_primitive != null)
		{
			if (this.m_primitive == CGL_POINT && this.m_vertices.length == 1)
			{
				this.end();
			} else if (this.m_primitive == CGL_LINE && this.m_vertices.length == 2)
			{
				//this.end();
			} else if (this.m_primitive == CGL_TRIANGLE && this.m_vertices.length == 3)
			{
				this.end();
			} else if (this.m_primitive == CGL_QUAD && this.m_vertices.length == 4)
			{
				this.end();
			}

			if (this.m_primitive == CGL_POINT)
			{
				// why this.m_point_size - Math.PI equales actual circle radius?
				this.context.arc(x, y, this.m_point_size - Math.PI, Math.PI*2.0, 0, true);
			} else
			{
				if (this.m_vertices.length == 0)
				{
					this.context.moveTo(x, y);
				} else
				{
					this.context.lineTo(x, y);
				}
			}

			if (this.m_primitive != CGL_POINT)
			{
				this.m_vertices.push({ x: x, y: y });
			}
		}
	},

	clear: function()
	{
		this.unbind();

		var w = this.context.canvas.width;
		this.context.canvas.width = 1;
		this.context.canvas.width = w;
		//this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
	},

	get_pixel: function(x, y)
	{
		var image = this.context.getImageData(x, y, 1, 1);
		var pixel = image.data;

		return pixel;
	},

	set_pixel: function(x, y, pixel)
	{
		this.context.putImageData(pixel, x, y);
	},

	rotate: function(angle)
	{
		this.context.rotate(angle * (Math.PI / 180));
	},

	translate: function(x, y)
	{
		x = x / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width;
		y = y / (this.m_ortho.bottom - this.m_ortho.top) * this.context.canvas.height;

		this.context.translate(x, y);
	},

	scale: function(x, y)
	{
		this.context.scale(x, y);
	},

	push_matrix: function()
	{
		this.context.save();
	},

	pop_matrix: function()
	{
		this.context.restore();
	},

	sprite: function(x, y, w, h, sx, sy, sw, sh, flip)
	{
		var iw = this.m_texture.width;
		var ih = this.m_texture.height;

		w = w || iw;
		h = h || ih;

		sx = sx || 0.0;
		sy = sy || 0.0;
		sw = sw || (w / iw);
		sh = sh || (h / ih);

		var bx = x;
		var bw = w;

		x = x / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width;
		y = y / (this.m_ortho.bottom - this.m_ortho.top) * this.context.canvas.height;
		w = w / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width;
		h = h / (this.m_ortho.bottom - this.m_ortho.top) * this.context.canvas.height;

		flip = flip || false;

		this.push_matrix();

		if (flip)
		{
			this.context.translate(iw + bx - bw, 0);
			this.context.scale(-1, 1);
		}

		this.context.drawImage(this.m_texture, parseInt(sx * iw), parseInt(sy * ih), parseInt(sw * iw), parseInt(sh * ih), x, y, w, h);

		this.pop_matrix();
	},

	write: function(font, x, y, text, size)
	{
		size = size || 16;

		x = x / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width;
		y = y / (this.m_ortho.bottom - this.m_ortho.top) * this.context.canvas.height;

		this.context.font = 'normal ' + (size / (this.m_ortho.right - this.m_ortho.left) * this.context.canvas.width) + 'px ' + font;
		this.context.fillStyle = this.m_color;
		this.context.fillText(text, x, y);
	}
};
