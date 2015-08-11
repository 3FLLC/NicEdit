/** nicAdvancedButton */

var nicEditorAdvancedButton = nicEditorButton.extend({

	init : function() {
		this.ne.addEvent('selected',this.removePane.closure(this)).addEvent('blur',this.removePane.closure(this));
	},

	mouseClick : function() {
		if(!this.isDisabled) {
			if(this.pane && this.pane.pane) {
				this.removePane();
			} else {
				this.pane = new nicEditorPane(this.contain,this.ne,{width : (this.width || '270px'), backgroundColor : '#fff'},this);
				this.addPane();
				this.ne.selectedInstance.saveRng();
			}
		}
	},

	addForm : function(f,elm) {
		this.form = new bkElement('form').setAttributes({className: 'niceabf'}).addEvent('submit',this.submit.closureListener(this));
		this.pane.append(this.form);
		this.inputs = {};
		if (!document._nicCss) {
			document._nicCss = document.createElement('style');
			document._nicCss.appendChild(document.createTextNode(
				'.niceabf table { border-collapse: collapse; }\n'+
				'.niceabf td { padding: 2px 5px 2px 0; }\n'+
				'.niceabf td.h { vertical-align: top; padding-top: 4px; white-space: nowrap; }\n'+
				'.niceabf h2 { font-size: 14px; font-weight: bold; padding: 0; margin: 0; }\n'+
				'.niceabf input, .niceabf select { text-transform: none; font-weight: normal; height: auto; padding: 1px; vertical-align: middle; font-size: 13px; border: 1px solid #ccc; }\n'+
				'.niceabf textarea { border: 1px solid #ccc; }\n'+
				'.niceabf input.button { background-color: #efefef; color: black; margin: 3px 0; }\n'
			));
			document.getElementsByTagName('head')[0].appendChild(document._nicCss);
		}
		var tab, tr, td;

		for(itm in f) {
			var field = f[itm];
			var val = '';
			if(elm) {
				val = elm.getAttribute(itm);
			}
			if(!val) {
				val = field['value'] || '';
			}
			var type = f[itm].type;

			if(type == 'title') {
				new bkElement('h2').setContent(field.txt).appendTo(this.form);
			} else {
				if (!tab) {
					tab = new bkElement('table').appendTo(this.form);
				}
				tr = new bkElement('tr').appendTo(tab);
				if(field.txt) {
					td = new bkElement('td').setAttributes({className: 'h'}).appendTo(tr);
					new bkElement('label').setAttributes({htmlFor: itm}).setContent(field.txt).appendTo(td);
				}
				td = new bkElement('td').appendTo(tr);
				if(!field.txt) {
					td.setAttributes({colspan: 2});
				}

				switch(type) {
					case 'text':
						this.inputs[itm] = new bkElement('input').setAttributes({id: itm, value: val, type: 'text'}).setStyle(field.style).appendTo(td);
						break;
					case 'select':
						this.inputs[itm] = new bkElement('select').setAttributes({id: itm}).appendTo(td);
						for(opt in field.options) {
							var o = new bkElement('option').setAttributes({value: opt, selected: (opt == val) ? 'selected' : ''}).setContent(field.options[opt]).appendTo(this.inputs[itm]);
						}
						break;
					case 'content':
						this.inputs[itm] = new bkElement('textarea').setAttributes({id: itm}).setStyle(field.style).appendTo(td);
						this.inputs[itm].value = val;
						break;
					case 'container':
						this.inputs[itm] = td;
						break;
				}
			}
		}
		new bkElement('input').setAttributes({type: 'submit', value: __('Submit'), className: 'button'}).appendTo(this.form);
		this.form.onsubmit = bkLib.cancelEvent;
	},

	submit : function() { },

	findElm : function(tag,attr,val) {
		var list = this.ne.selectedInstance.getElm().getElementsByTagName(tag);
		for(var i=0;i<list.length;i++) {
			if(list[i].getAttribute(attr) == val) {
				return $BK(list[i]);
			}
		}
	},

	removePane : function() {
		if(this.pane) {
			this.pane.remove();
			this.pane = null;
			this.ne.selectedInstance.restoreRng();
		}
	}
});

