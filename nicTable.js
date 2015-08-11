/** nicTable (c) Vitaliy Filippov */

/* START CONFIG */
var nicTableOptions = {
	buttons : {
		'table' : {name : __('Add Table'), type : 'nicTableButton', tags : ['TABLE']}
	}

};
/* END CONFIG */

var nicTableButton = nicEditorAdvancedButton.extend({
	addPane: function() {
		this.t = this.ne.selectedInstance.selElm().parentTag('TABLE');
		var r = 3, c = 3, h = '', b = 'yes';
		if (this.t && (r = this.t.rows.length)) {
			c = this.t.rows[0].cells.length;
			if (this.t.rows[0].cells[c-1].nodeName == 'TH') h += 'top';
			if (this.t.rows[r-1].cells[0].nodeName == 'TH') h += 'left';
			if (this.t.className.indexOf('bordered') < 0) b = 'no';
		}
		this.addForm({
			'': {type: 'title', txt: __('Add/Edit Table')},
			'cols': {type: 'text', txt: __('Columns'), value: c, style: {width: '50px'}},
			'rows': {type: 'text', txt: __('Rows'), value: r, style: {width: '50px'}},
			'header': {type: 'select', txt: __('Headers'), value: h, options: {'':__('None'), left:__('Left'), top:__('Top'), topleft:__('Top and Left')}},
			'bordered': {type: 'select', txt: __('Borders'), value: b, options: {'no':__('No'), 'yes':__('Yes')}}
		},this.t);
	},

	submit: function(e) {
		var r = parseInt(this.inputs['rows'].value);
		var c = parseInt(this.inputs['cols'].value);
		var cl = this.inputs['bordered'].value == 'no' ? '' : 'bordered';
		var i, j;
		if(!this.t) {
			var tmp = 'javascript:nicImTemp();', h = '';
			for (i = 0; i < r; i++) {
				h += '<tr>'+(new Array(c+1)).join('<td>-</td>')+'</tr>';
			}
			this.ne.nicCommand("insertHTML", '<table title="'+tmp+'">'+h+'</table>');
			this.t = this.findElm('TABLE','title',tmp);
		}
		if(this.t) {
			this.t.className = cl;
			this.t.removeAttribute('title');
			for (i = this.t.rows.length-1; i >= r; i--) {
				this.t.deleteRow(r);
			}
			for (i = this.t.rows.length; i < r; i++) {
				this.t.insertRow(i).innerHTML = (new Array(c+1)).join('<td>-</td>');
			}
			if (this.t.rows.length && this.t.rows[0].cells.length != c) {
				for (i = 0; i < r; i++) {
					for (j = this.t.rows[i].cells.length; j < c; j++) {
						this.t.rows[i].insertCell(j).innerHTML = '-';
					}
					for (j = this.t.rows[i].cells.length-1; j >= c; j--) {
						$BK(this.t.rows[i].cells[c]).remove();
					}
				}
			}
			if (this.t.rows.length) {
				var ht = this.inputs['header'].value;
				var repl = function(node, name) {
					var nn = document.createElement(name ? 'th' : 'td');
					nn.innerHTML = node.innerHTML;
					node.parentNode.insertBefore(nn, node);
					node.parentNode.removeChild(node);
				};
				repl(this.t.rows[0].cells[0], ht != '');
				j = ht == 'top' || ht == 'topleft';
				for (i = 1; i < c; i++) {
					repl(this.t.rows[0].cells[i], j);
				}
				j = ht == 'left' || ht == 'topleft';
				for (i = 1; i < r; i++) {
					repl(this.t.rows[i].cells[0], j);
				}
			}
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicTableOptions);

