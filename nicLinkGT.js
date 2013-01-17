/** nicLink */

/* START CONFIG */
var nicLinkGTOptions = {
	buttons: {
		link: {name: __('Add Link'), type: 'nicLinkGTButton', tags: ['A']},
		unlink: {name: __('Remove Link'), command: 'unlink', noActive: true}
	}
};
/* END CONFIG */

var nicLinkGTButton = nicEditorAdvancedButton.extend({
	addPane: function() {
		this.ln = this.ne.selectedInstance.selElm().parentTag('A');
		this.addForm({
			'': {type: 'title', txt: __('Add/Edit Link')},
			'href': {type: 'text', txt: __('URL or Page'), value: '', style: {width: '150px'}},
			'title': {type: 'text', txt: __('Hint')},
			'target': {type: 'select', txt: __('Open In'), options: {'': __('Current Window'), '_blank': __('New Window')}, style: {width: '100px'}}
		}, this.parseParams(this.ln || {}));
		this.hinter = new SimpleAutocomplete(this.inputs['href'], this.gtLoadData.closure(this), {
			emptyText: false,
			allowHTML: true
		});
	},

	parseParams: function(elm) {
		var r = { getAttribute: function(n) { return this[n]; } };
		r.href = elm.href || '';
		if (r.href.substr(0, GT.domain.length+10) == GT.domain+'/page.php?' ||
			r.href.substr(0, 9) == 'page.php?') {
			var m = /[\?&]alias=([^\?&]+)/.exec(r.href);
			if (m) {
				r.href = '#'+m[1]+' - '+elm.title;
			}
		}
		r.title = elm.title;
		r.target = elm.target;
		return r;
	},

	gtLoadData: function(hint, value) {
		POST(GT.domain+'/api.php?action=listpages&format=json', {value: value}, function(r){
			try { hint.replaceItems(JSON.parse(r.responseText)); }
			catch(e) {}
		});
	},

	submit: function(e) {
		var url = this.inputs['href'].value;
		var title = this.inputs['title'].value;
		if(url == "http://" || url == "") {
			alert(__("You must enter a URL to Create a Link"));
			return false;
		}
		var gtId = /^#(\S+)\s+-(\s*(.+))?/.exec(url);
		if (gtId) {
			url = 'page.php?alias='+gtId[1];
			if (!title && gtId[3]) {
				title = gtId[3];
			}
		}
		this.removePane();

		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
			if(!this.ln) {
				this.ne.nicCommand("insertHTML",'<a href="'+tmp+'">'+(title||url)+'</a>');
				this.ln = this.findElm('A','href',tmp);
			}
		}
		if(this.ln) {
			this.ln.setAttributes({
				href: url,
				title: title,
				target: this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});
		}
	},

	removePane: function() {
		if (this.hinter) {
			this.hinter.remove();
			this.hinter = null;
		}
		nicEditorAdvancedButton.prototype.removePane.apply(this);
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkGTOptions);
