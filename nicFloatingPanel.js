/** nicFloatingPanel */

nicEditor = nicEditor.extend({
	floatingPanel: function() {
		this.floating = new bkElement('DIV').setStyle({display: 'inline-block', position: 'absolute', left: '-1000px', top: '-1000px', zIndex: 100}).appendTo(document.body);
		this.addEvent('focus', this.reposition.closure(this)).addEvent('blur', this.hide.closure(this));
		bkLib.addEvent(window, 'scroll', this.reposition.closure(this));
		this.setPanel(this.floating);
	},

	reposition: function() {
		var e = this.selectedInstance;
		if (!e || !(e = e.elm)) return;
		var h = this.floating.offsetHeight;
		var p = e.pos();
		var d = document;
		d = window.pageYOffset || d.body.scrollTop || d.documentElement.scrollTop;
		var top = p[1]-h;
		this.floating.setStyle({ top: (top < d ? d : top)+'px', left: p[0]+'px' });
	},

	hide: function() {
		this.floating.setStyle({ top: '-1000px', left: '-1000px' });
	}
});

