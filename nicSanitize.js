/** nicSanitize */

// Sanitize pasted HTML

var nicSanitize = bkClass.extend({
	construct: function(nicEditor)
	{
		this.ne = nicEditor;
		this.ne.addEvent('add', this.add.closure(this));
	},
	add: function(instance)
	{
		instance.elm.addEvent('paste', this.paste.closureListener(this));
	},
	paste: function(ev, target)
	{
		var d = ev.clipboardData || window.clipboardData;
		var h = d.getData('text/html') || d.getData('Text');
		if (h)
		{
			this.sanitizeCfg = this.sanitizeCfg || getSanitizeCfg();
			h = sanitizeHtml(h, this.sanitizeCfg);
			if (h)
				this.ne.nicCommand('insertHTML', h);
			bkLib.cancelEvent(ev);
		}
	}
});

nicEditors.registerPlugin(nicSanitize);

