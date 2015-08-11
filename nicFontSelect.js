/** nicSelect */

/* START CONFIG */
var nicSelectOptions = {
	buttons : {
		'fontSize' : {name : __('Select Font Size'), type : 'nicEditorFontSizeSelect', command : 'fontsize'},
		'fontFamily' : {name : __('Select Font Family'), type : 'nicEditorFontFamilySelect', command : 'fontname'},
		'fontFormat' : {name : __('Select Font Format'), type : 'nicEditorFontFormatSelect', command : 'formatBlock'}
	}
};
/* END CONFIG */
var nicEditorSelect = bkClass.extend({

	construct : function(e,buttonName,options,nicEditor) {
		this.options = options.buttons[buttonName];
		this.elm = e;
		this.ne = nicEditor;
		this.name = buttonName;
		this.selOptions = new Array();

		this.margin = new bkElement('div').setStyle({'float' : 'left', margin : '2px 1px 0 1px'}).appendTo(this.elm);
		this.contain = new bkElement('div').setStyle({width: '90px', height : '20px', cursor : 'pointer', overflow: 'hidden'}).addClass('selectContain').addEvent('click',this.toggle.closure(this)).appendTo(this.margin);
		this.items = new bkElement('div').setStyle({overflow : 'hidden', zoom : 1, border: '1px solid #ccc', paddingLeft : '3px', backgroundColor : '#fff'}).appendTo(this.contain);
		this.control = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'right', height: '18px', width : '16px'}).addClass('selectControl').setStyle(this.ne.getIcon('arrow',options)).appendTo(this.items);
		this.txt = new bkElement('div').setStyle({overflow : 'hidden', 'float' : 'left', width : '66px', height : '14px', marginTop : '1px', fontFamily : 'sans-serif', textAlign : 'center', fontSize : '12px'}).addClass('selectTxt').appendTo(this.items);

		if(!window.opera) {
			this.contain.onmousedown = this.control.onmousedown = this.txt.onmousedown = bkLib.cancelEvent;
		}

		this.margin.noSelect();

		this.ne.addEvent('selected', this.enable.closure(this)).addEvent('blur', this.disable.closure(this));

		this.disable();
		this.init();
	},

	disable : function() {
		this.isDisabled = true;
		this.close();
		this.contain.setStyle({opacity : 0.6});
	},

	enable : function(t) {
		this.isDisabled = false;
		this.close();
		this.contain.setStyle({opacity : 1});
	},

	setDisplay : function(txt) {
		this.txt.setContent(txt);
	},

	toggle : function() {
		if(!this.isDisabled) {
			(this.pane) ? this.close() : this.open();
		}
	},

	open : function() {
		this.pane = new nicEditorPane(this.items,this.ne,{width : '88px', padding: '0px', borderTop : 0, borderLeft : '1px solid #ccc', borderRight : '1px solid #ccc', borderBottom : '0px', backgroundColor : '#fff'});

		for(var i=0;i<this.selOptions.length;i++) {
			var opt = this.selOptions[i];
			var itmContain = new bkElement('div').setStyle({overflow : 'hidden', borderBottom : '1px solid #ccc', width: '88px', textAlign : 'left', overflow : 'hidden', cursor : 'pointer'});
			var itm = new bkElement('div').setStyle({padding : '0px 4px'}).setContent(opt[1]).appendTo(itmContain).noSelect();
			itm.addEvent('click',this.update.closure(this,opt[0])).addEvent('mouseover',this.over.closure(this,itm)).addEvent('mouseout',this.out.closure(this,itm)).setAttributes('id',opt[0]);
			this.pane.append(itmContain);
			if(!window.opera) {
				itm.onmousedown = bkLib.cancelEvent;
			}
		}
	},

	close : function() {
		if(this.pane) {
			this.pane = this.pane.remove();
		}
	},

	over : function(opt) {
		opt.setStyle({backgroundColor : '#ccc'});
	},

	out : function(opt) {
		opt.setStyle({backgroundColor : '#fff'});
	},


	add : function(k,v) {
		this.selOptions.push(new Array(k,v));
	},

	update : function(elm) {
		this.ne.nicCommand(this.options.command,elm);
		this.close();
	}
});

var nicEditorFontSizeSelect = nicEditorSelect.extend({
	sel : {1 : '1&nbsp;(8pt)', 2 : '2&nbsp;(10pt)', 3 : '3&nbsp;(12pt)', 4 : '4&nbsp;(14pt)', 5 : '5&nbsp;(18pt)', 6 : '6&nbsp;(24pt)'},
	init : function() {
		this.setDisplay(__('Font&nbsp;Size...'));
		for(itm in this.sel) {
			this.add(itm,'<font size="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFamilySelect = nicEditorSelect.extend({
	sel : {'sans-serif':__('Sans-Serif'), 'serif':__('Serif'), 'fantasy':__('Fantasy'), 'monospace':__('Monospace'), 'cursive':__('Cursive'), 'georgia':'Georgia'},

	init : function() {
		this.setDisplay(__('Font&nbsp;Family...'));
		for(itm in this.sel) {
			this.add(itm,'<font face="'+itm+'">'+this.sel[itm]+'</font>');
		}
	}
});

var nicEditorFontFormatSelect = nicEditorSelect.extend({
	sel : {'p' : __('Paragraph'), 'pre' : __('Pre'), 'h6' : __('Heading&nbsp;6'), 'h5' : __('Heading&nbsp;5'), 'h4' : __('Heading&nbsp;4'), 'h3' : __('Heading&nbsp;3'), 'h2' : __('Heading&nbsp;2'), 'h1' : __('Heading&nbsp;1')},

	init : function() {
		this.setDisplay(__('Font&nbsp;Format...'));
		for(itm in this.sel) {
			var tag = itm.toUpperCase();
			this.add('<'+tag+'>','<'+itm+' style="padding: 0px; margin: 0px;">'+this.sel[itm]+'</'+tag+'>');
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicSelectOptions);
