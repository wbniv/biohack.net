/*
moo.fx, simple effects library built with prototype.js (http://prototype.conio.net).
by Valerio Proietti (http://mad4milk.net) MIT-style LICENSE.
for more info (http://moofx.mad4milk.net).
10/24/2005
v(1.0.2)
*/

//base
var fx = new Object();
fx.Base = function(){};
fx.Base.prototype = {
	setOptions: function(options) {
	this.options = {
		duration: 500,
		onComplete: ''
	}
	Object.extend(this.options, options || {});
	},

	go: function() {
		this.duration = this.options.duration;
		this.startTime = (new Date).getTime();
		this.timer = setInterval (this.step.bind(this), 13);
	},

	step: function() {
		var time  = (new Date).getTime();
		var Tpos   = (time - this.startTime) / (this.duration);
		if (time >= this.duration+this.startTime) {
			this.now = this.to;
			clearInterval (this.timer);
			this.timer = null;
			if (this.options.onComplete) setTimeout(this.options.onComplete.bind(this), 10);
		}
		else {
			this.now = ((-Math.cos(Tpos*Math.PI)/2) + 0.5) * (this.to-this.from) + this.from;
			//this time-position, sinoidal transition thing is from script.aculo.us
		}
		this.increase();
	},

	custom: function(from, to) {
		if (this.timer != null) return;
		this.from = from;
		this.to = to;
		this.go();
	},

	hide: function() {
		this.now = 0;
		this.increase();
	},

	clearTimer: function() {
		clearInterval(this.timer);
		this.timer = null;
	}
}

//stretchers
fx.Layout = Class.create();
fx.Layout.prototype = Object.extend(new fx.Base(), {
	initialize: function(el, options) {
		this.el = $(el);
		this.el.style.overflow = "hidden";
		this.el.iniWidth = this.el.offsetWidth;
		this.el.iniHeight = this.el.offsetHeight;
		this.setOptions(options);
	}
});

fx.Height = Class.create();
Object.extend(Object.extend(fx.Height.prototype, fx.Layout.prototype), {	
	increase: function() {
		this.el.style.height = this.now + "px";
	},

	toggle: function() {
		if (this.el.offsetHeight > 0) this.custom(this.el.offsetHeight, 0);
		else this.custom(0, this.el.scrollHeight);
	}
});

fx.Width = Class.create();
Object.extend(Object.extend(fx.Width.prototype, fx.Layout.prototype), {	
	increase: function() {
		this.el.style.width = this.now + "px";
	},

	toggle: function(){
		if (this.el.offsetWidth > 0) this.custom(this.el.offsetWidth, 0);
		else this.custom(0, this.el.iniWidth);
	}
});

//fader
fx.Opacity = Class.create();
fx.Opacity.prototype = Object.extend(new fx.Base(), {
	initialize: function(el, options) {
		this.el = $(el);
		this.now = 1;
		this.increase();
		this.setOptions(options);
	},

	increase: function() {
		if (this.now == 1) this.now = 0.9999;
		if (this.now > 0 && this.el.style.visibility == "hidden") this.el.style.visibility = "visible";
		if (this.now == 0) this.el.style.visibility = "hidden";
		if (window.ActiveXObject) this.el.style.filter = "alpha(opacity=" + this.now*100 + ")";
		this.el.style.opacity = this.now;
	},

	toggle: function() {
		if (this.now > 0) this.custom(1, 0);
		else this.custom(0, 1);
	}
});

// ------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------

fx.Scroll = Class.create();
fx.Scroll.prototype = Object.extend(new fx.Base(), {
    initialize: function(options) {
        this.setOptions(options);
    },

    scrollTo: function(el){
        var desty = Position.cumulativeOffset($(el));
        var dest = desty[1];
        var client = window.innerHeight || document.documentElement.fullHeight;
        var full = document.documentElement.scrollHeight;
        var top = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        if (dest+client > full) this.custom(top, dest - client + (full-dest));
        else this.custom(top, dest);
    },

    increase: function(){
        window.scrollTo(0, this.now);
    }
});

// ------------------------------------------------------------------------------------------------------------

var ScrollLinks = {
    currentHash: false,
    start: function(){
        this.scroll = new fx.Scroll({duration: 800, onComplete: function(){ScrollLinks.end();}});
        this.allinks = document.getElementsByTagName('a');
        for (i=0; i<this.allinks.length; i++){
            var lnk = this.allinks[i];
            if ((lnk.href && lnk.href.indexOf('#') != -1) && ( (lnk.pathname == location.pathname) || ('/'+lnk.pathname == location.pathname) ) && (lnk.search == location.search)) {
                lnk.onclick = function(){
                    ScrollLinks.scroll.clearTimer();
                    this.initialHref = this.href;
                    this.initialHash = this.hash;
                    this.href = "javascript:void(0)";
                    setTimeout(function(){this.href = this.initialHref;}.bind(this), 200);
                    ScrollLinks.click(this);
                }
            }
        }
    },

    click: function(link){
        this.currentHash = link.initialHash.substr(1);
        if (this.currentHash) {
            for (j=0; j<this.allinks.length; j++){
                if (this.allinks[j].id == this.currentHash){
                    if (!window.opera) this.scroll.scrollTo(this.allinks[j]);
                    else this.scroll.scrollTo(this.allinks[j].parentNode);
                    break;
                }
            }
        }
    },

    end: function(){
        window.location.href = "#"+this.currentHash;
        this.currentHash = false;
    }
}


	window.onload = function(){
		ScrollLinks.start();
	}


// ------------------------------------------------------------------------------------------------------------