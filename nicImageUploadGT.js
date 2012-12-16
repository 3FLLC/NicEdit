/** nicImageUploadGT (Image + Upload + Lightbox support) */

/* START CONFIG */
var nicImageUploadGTOptions = {
	buttons: {
		'image': {name: __('Add Image'), type: 'nicImageUploadGTButton', tags: ['IMG']}
	}

};
/* END CONFIG */

var nicImageUploadGTButton = nicEditorAdvancedButton.extend({
	addPane: function() {
		this.im = (this.selElm || this.ne.selectedInstance.selElm()).parentTag('IMG');
		var s, params = this.parseParams(this.im);

		this.addForm({
			'': {type: 'title', txt: __('Add/Edit Image')},
			'src': {type: 'text', txt: __('URL or Name'), style: {width: '150px'}},
			'upload': {type: 'container', txt: __('Or upload')},
			'href': {type: 'text', txt: __('Hyperlink'), style: {width: '150px'}},
			'size': {type: 'container', txt: __('Max Size')},
			'align': {type: 'select', txt: __('Align'), options: {none: __('Inline'), left: __('Left'), right: __('Right')}},
			'alt': {type: 'text', txt: __('Popup text'), style: {width: '150px'}}
		}, params);

		this.hinter = new SimpleAutocomplete(this.inputs['src'], this.gtLoadData.closure(this), null, null, null, false, true);

		s = this.inputs['href'].parentNode;
		new bkElement('br').appendTo(s);
		this.inputs['newwindow'] = new bkElement('input').setAttributes({type: 'checkbox', id: 'newwindow', checked: 1 && params.newwindow}).appendTo(s);
		new bkElement('label').setAttributes({htmlFor: 'newwindow'}).setContent(__('Open in new window')).appendTo(s);

		var self = this;
		s = this.inputs['upload'];
		this.inputs['fileName'] = new bkElement('input').setStyle({width: '150px', height: '20px'}).setAttributes({type: 'button', value: __('Select file')}).appendTo(s);
		this.inputs['fileName'].addEvent('click', function() { self.inputs['file'].click(); });
		this.inputs['file'] = new bkElement('input').setStyle({ width: '150px', position: 'absolute', left: '0', top: '-100px' }).setAttributes({type: 'file', size: 5}).appendTo(s);
		this.inputs['file'].addEvent('change', this.onFileChange.closure(this));
		new bkElement('br').appendTo(s);
		this.inputs['progress'] = new bkElement('progress')
			.setStyle({ width: '100%', display: 'none' })
			.setAttributes('max', 100)
			.appendTo(s);

		s = this.inputs['size'];
		this.inputs['width'] = new bkElement('input').setAttributes({type: 'text', size: 5, value: params.width||''}).appendTo(s);
		s.appendChild(document.createTextNode(' x '));
		this.inputs['height'] = new bkElement('input').setAttributes({type: 'text', size: 5, value: params.height||''}).appendTo(s);
	},

	onFileChange: function() {
		this.inputs['src'].value = '';
		this.inputs['fileName'].value = this.inputs['file'].files[0].name;
	},

	checkNodes: function(e) {
		var r = nicEditorAdvancedButton.prototype.checkNodes.apply(this, [e]);
		this.selElm = r ? e : null;
		return r;
	},

	parseParams: function(elm) {
		var r = { getAttribute: function(n) { return this[n]; } };
		if (!elm) return r;
		if (elm.parentNode.nodeName == 'A') {
			r.href = elm.parentNode.href;
			if (r.href.substr(0, GT.domain.length+10) == GT.domain+'/file.php?' ||
				r.href.substr(0, 9) == 'file.php?') {
				// Clear lightbox link
				r.href = '';
			}
			if (elm.parentNode.target == '_blank') {
				r.newwindow = true;
			}
		} else {
			r.href = '-';
		}
		r.align = elm.align;
		var abs = elm.src.substr(0, GT.domain.length+10) == GT.domain+'/file.php?';
		if (abs || elm.src.substr(0, 9) == 'file.php?') {
			var id, p, m = elm.src.substr(abs ? GT.domain.length+10 : 9).split('&');
			for (var i = 0; i < m.length; i++) {
				p = m[i].split('=', 2);
				if (p[0] == 'id') {
					id = p[1];
				} else if (p[0] == 'w') {
					r.width = p[1];
				} else if (p[0] == 'h') {
					r.height = p[1];
				}
			}
			r.src = '#'+id+' - '+elm.title;
		} else {
			r.src = elm.src;
			r.width = elm.style.maxWidth.replace('px', '');
			r.height = elm.style.maxHeight.replace('px', '');
		}
		r.alt = elm.alt;
		return r;
	},

	removePane: function() {
		if (this.hinter) {
			this.hinter.remove();
			this.hinter = null;
		}
		nicEditorAdvancedButton.prototype.removePane.apply(this);
	},

	gtLoadData: function(hint, value) {
		POST(GT.domain+'/api.php?action=listimgs&format=json', {value: value}, function(r){
			try { hint.replaceItems(JSON.parse(r.responseText)); }
			catch(e) {}
		});
	},

	submit: function(e) {
		if (!this.inputs['src'].value && this.inputs['file'].files[0]) {
			// Upload the file, then continue from a callback
			this.uploadFile();
			return false;
		}
		var src = this.inputs['src'].value;
		var gtId = /^#(\d+)(\s*-\s*)?(.*)/.exec(src);
		var alt = this.inputs['alt'].value;
		var style = {};
		var w = this.inputs['width'].value;
		var h = this.inputs['height'].value;
		if (!/^[1-9]\d*$/.exec(w)) w = '';
		if (!/^[1-9]\d*$/.exec(h)) h = '';
		if (gtId && gtId[1]) {
			if (!alt) {
				alt = gtId[3];
			}
			// Save relative path to the page text
			// FIXME This will work only for the same level pages, but OK
			src = 'file.php?action=thumb&id='+gtId[1]+'&w='+w+'&h='+h;
		} else if (/^https?:\/\/./.exec(src)) {
			if (w) style.maxWidth = w+'px';
			if (h) style.maxHeight = h+'px';
		} else {
			alert(__('To insert an image you must select uploaded file ID or enter the image URL!'));
			return false;
		}
		this.removePane();

		if (!this.im) {
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage",tmp);
			this.im = this.findElm('IMG','src',tmp);
		}
		if (this.im) {
			var lnk = {
				href: this.inputs['href'].value,
				target: this.inputs['newwindow'].checked ? '_blank' : '',
				title: alt
			};
			if (!lnk.href.length && gtId && gtId[1] && (w || h)) {
				// If link URL is not '-', add lightbox (relative path)
				lnk.href = 'file.php?action=thumb&id='+gtId[1];
				lnk.target = '_blank';
				lnk.rel = 'lightbox';
			}
			var p = $BK(this.im.parentNode);
			if (p.nodeName != 'A' && lnk.href != '-') {
				var tmp = 'javascript:nicTemp();';
				this.ne.nicCommand("createlink",tmp);
				p = this.findElm('A','href',tmp);
			}
			if (p.nodeName == 'A') {
				if (lnk.href != '-') {
					p.setAttributes(lnk);
				} else {
					p.parentNode.appendChild(this.im);
					p.removeChild(parentNode);
				}
			}
			this.im.setStyle(style).setAttributes({
				src: src,
				alt: alt,
				title: alt,
				align: this.inputs['align'].value
			});
		}
	},

	uploadFile: function() {
		var file = this.inputs['file'].files[0];
		if (!file || !file.type.match(/image.*/)) {
			alert(__("Only image files can be uploaded"));
			return;
		}
		this.inputs['file'].setStyle({display: 'none'});
		this.setProgress(0);

		var fd = new FormData(); // https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
		fd.append("e_file", file);
		fd.append("e_title", file.name);

		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.open("POST", GT.domain+'/file.php?action=save&format=json');
		xhr.onload = function() {
			try { var res = JSON.parse(xhr.responseText); } catch(e) {}
			if (res && (res.file || res.duplicate)) {
				self.onUploaded(res);
			} else {
				alert(__('Error uploading file') + (res && res.error ? ': '+res.error : ''));
			}
		};
		xhr.onerror = function(e) { alert(__('Error uploading file')+': '+e); };
		xhr.upload.onprogress = function(e) {
			self.setProgress(e.loaded / e.total);
		};
		xhr.send(fd);
	},

	onUploaded: function(r) {
		var f = r.file||r.duplicate;
		this.inputs['src'].value = '#'+f.id+' - '+f.title;
		this.submit();
	},

	setProgress: function(percent) {
		var p = this.inputs['progress'];
		p.setStyle({display: 'block'});
		if(percent < .98) {
			p.value = percent;
		} else {
			p.removeAttribute('value');
		}
	},
});

nicEditors.registerPlugin(nicPlugin,nicImageUploadGTOptions);
