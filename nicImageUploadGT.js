/** nicImageGT */

/* START CONFIG */
var nicImageOptions = {
	buttons: {
		'image': {name: __('Add Image'), type: 'nicImageButton', tags: ['IMG']}
	}

};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({
	addPane: function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		var params = this.parseParams(this.im);

		this.addForm({
			'': {type: 'title', txt: __('Add/Edit Image')},
			'src': {type: 'text', txt: __('URL or Name'), style: {width: '150px'}},
			'href': {type: 'text', txt: __('Hyperlink'), style: {width: '150px'}},
			'size': {type: 'container', txt: __('Max Size')},
			'align': {type: 'select', txt: __('Align'), options: {none: __('Inline'), left: __('Left'), right: __('Right')}},
		}, params);

		this.hinter = new SimpleAutocomplete(this.inputs['src'], this.gtLoadData.closure(this), null, null, null, false, true);

		var s = this.inputs['href'].parentNode;
		new bkElement('br').appendTo(s);
		this.inputs['newwindow'] = new bkElement('input').setAttributes({type: 'checkbox', id: 'newwindow', checked: 1 && params.newwindow}).appendTo(s);
		new bkElement('label').setAttributes({htmlFor: 'newwindow'}).setContent(__('Open in new window')).appendTo(s);

		s = this.inputs['size'];
		this.inputs['width'] = new bkElement('input').setAttributes({type: 'text', size: 5, value: params.width||''}).appendTo(s);
		s.appendChild(document.createTextNode(' x '));
		this.inputs['height'] = new bkElement('input').setAttributes({type: 'text', size: 5, value: params.height||''}).appendTo(s);
	},

	parseParams: function(elm) {
		var r = { getAttribute: function(n) { return this[n]; } };
		if (!elm) return r;
		if (elm.parentNode.nodeName == 'A') {
			r.href = elm.parentNode.href;
			if (elm.parentNode.target == '_blank') {
				r.newwindow = true;
			}
		}
		r.align = elm.align;
		if (elm.src.substr(0, GT.domain.length+10) == GT.domain+'/file.php?') {
			var id, p, m = elm.src.substr(GT.domain.length+10).split('&');
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
		var src = this.inputs['src'].value;
		var gtId = /^#(\d+)(\s*-\s*)?(.*)/.exec(src);
		var alt = '';
		var style = {};
		var w = this.inputs['width'].value;
		var h = this.inputs['height'].value;
		if (!/^[1-9]\d*$/.exec(w)) w = '';
		if (!/^[1-9]\d*$/.exec(h)) h = '';
		if (gtId && gtId[1]) {
			alt = gtId[3];
			src = GT.domain+'/file.php?action=thumb&id='+gtId[1]+'&w='+w+'&h='+h;
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
			var href = this.inputs['href'].value;
			var p = this.im.parentNode;
			if (p.nodeName != 'A' && href) {
				var tmp = 'javascript:nicTemp();';
				this.ne.nicCommand("createlink",tmp);
				p = this.findElm('A','href',tmp);
			}
			if (p.nodeName == 'A') {
				if (href) {
					p.setAttributes({href: href, target: this.inputs['newwindow'].checked ? '_blank' : ''});
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
	}
});

nicEditors.registerPlugin(nicPlugin,nicImageOptions);

/** nicUploadGT */

/* START CONFIG */
var nicUploadOptions = {
	buttons: {
		'upload': {name: __('Upload Image'), type: 'nicUploadButton'}
	}

};
/* END CONFIG */

var nicUploadButton = nicEditorAdvancedButton.extend({
	errorText: __('Failed to upload image'),

	addPane: function() {
		if(typeof window.FormData === "undefined") {
			return this.onError(__("Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead."));
		}
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');

		var container = new bkElement('div')
			.setStyle({ padding: '10px' })
			.appendTo(this.pane.pane);

		new bkElement('div')
			.setStyle({ fontSize: '14px', fontWeight: 'bold', paddingBottom: '5px' })
			.setContent(__('Insert an Image'))
			.appendTo(container);

		this.fileInput = new bkElement('input')
			.setAttributes({ type: 'file' })
			.appendTo(container);

		this.progress = new bkElement('progress')
			.setStyle({ width: '100%', display: 'none' })
			.setAttributes('max', 100)
			.appendTo(container);

		this.fileInput.onchange = this.uploadFile.closure(this);
	},

	onError: function(msg) {
		this.removePane();
		alert(msg || __("Failed to upload image"));
	},

	uploadFile: function() {
		var file = this.fileInput.files[0];
		if (!file || !file.type.match(/image.*/)) {
			this.onError(__("Only image files can be uploaded"));
			return;
		}
		this.fileInput.setStyle({ display: 'none' });
		this.setProgress(0);

		var fd = new FormData(); // https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
		fd.append("image", file);
		fd.append("key", "b7ea18a4ecbda8e92203fa4968d10660");
		var xhr = new XMLHttpRequest();
		xhr.open("POST", this.ne.options.uploadURI || this.nicURI);

		xhr.onload = function() {
			try {
				var res = JSON.parse(xhr.responseText);
			} catch(e) {
				return this.onError();
			}
			this.onUploaded(res.upload);
		}.closure(this);
		xhr.onerror = this.onError.closure(this);
		xhr.upload.onprogress = function(e) {
			this.setProgress(e.loaded / e.total);
		}.closure(this);
		xhr.send(fd);
	},

	setProgress: function(percent) {
		this.progress.setStyle({ display: 'block' });
		if(percent < .98) {
			this.progress.value = percent;
		} else {
			this.progress.removeAttribute('value');
		}
	},

	onUploaded: function(options) {
		this.removePane();
		var src = options.links.original;
		if(!this.im) {
			this.ne.selectedInstance.restoreRng();
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage", src);
			this.im = this.findElm('IMG','src', src);
		}
		var w = parseInt(this.ne.selectedInstance.elm.getStyle('width'));
		if(this.im) {
			this.im.setAttributes({
				src: src,
				width: (w && options.image.width) ? Math.min(w, options.image.width) : ''
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicUploadOptions);
