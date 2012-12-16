/** nicLink */

/* START CONFIG */
var nicLinkOptions = {
	buttons : {
		'link' : {name : __('Add Link'), type : 'nicLinkButton', tags : ['A']},
		'unlink' : {name : __('Remove Link'),  command : 'unlink', noActive : true}
	}
};
/* END CONFIG */

var nicLinkButton = nicEditorAdvancedButton.extend({
	addPane : function() {
		this.ln = this.ne.selectedInstance.selElm().parentTag('A');
		this.addForm({
			'' : {type : 'title', txt : __('Add/Edit Link')},
			'href' : {type : 'text', txt : 'URL', value : 'http://', style : {width: '150px'}},
			'title' : {type : 'text', txt : __('Hint')},
			'target' : {type : 'select', txt : __('Open In'), options : {'' : __('Current Window'), '_blank' : __('New Window')},style : {width : '100px'}}
		},this.ln);
	},

	submit : function(e) {
		var url = this.inputs['href'].value;
		if(url == "http://" || url == "") {
			alert(__("You must enter a URL to Create a Link"));
			return false;
		}
		this.removePane();

		if(!this.ln) {
			var tmp = 'javascript:nicTemp();';
			this.ne.nicCommand("createlink",tmp);
			this.ln = this.findElm('A','href',tmp);
		}
		if(this.ln) {
			this.ln.setAttributes({
				href : this.inputs['href'].value,
				title : this.inputs['title'].value,
				target : this.inputs['target'].options[this.inputs['target'].selectedIndex].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicLinkOptions);
