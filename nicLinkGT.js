/** nicLink */

/* START CONFIG */
var nicLinkGTOptions = {
	buttons : {
		'link' : {name : __('Add Link'), type : 'nicLinkGTButton', tags : ['A']},
		'unlink' : {name : __('Remove Link'),  command : 'unlink', noActive : true}
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
			'target': {type: 'select', txt: __('Open In'), options: {'' : __('Current Window'), '_blank': __('New Window')}, style: {width: '100px'}}
		},this.ln);
		this.hinter = new SimpleAutocomplete(this.inputs['href'], this.gtLoadData.closure(this), null, null, null, false, true);
	},

	gtLoadData: function(hint, value) {
		POST(GT.domain+'/api.php?action=listpages&format=json', {value: value}, function(r){
			try { hint.replaceItems(JSON.parse(r.responseText)); }
			catch(e) {}
		});
	},

	submit: function(e) {
		var url = this.inputs['href'].value;
		if(url == "http://" || url == "") {
			alert(__("You must enter a URL to Create a Link"));
			return false;
		}
		var gtId = /^#(\S+)\s+-\s+/.exec(url);
		if (gtId) {
			url = 'page.php?alias='+gtId[1];
		}
		this.removePane();

		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
		}
		if(this.ln) {
			this.ln.setAttributes({
				href: url,
				title: this.inputs['title'].value,
				target: this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkGTOptions);
