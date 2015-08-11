/** nicCode */

/* START CONFIG */
var nicCodeOptions = {
	buttons : {
		'xhtml' : {name : __('Edit HTML'), type : 'nicCodeButton'}
	}

};
/* END CONFIG */

var nicCodeButton = nicEditorAdvancedButton.extend({
	width : '350px',

	addPane : function() {
		this.addForm({
			'' : {type : 'title', txt : __('Edit HTML')},
			'code' : {type : 'content', 'value' : this.ne.selectedInstance.getContent(), style : {width: '340px', height : '200px'}}
		});
	},

	submit : function(e) {
		var code = this.inputs['code'].value;
		this.ne.selectedInstance.setContent(code);
		this.removePane();
	}
});

nicEditors.registerPlugin(nicPlugin,nicCodeOptions);
