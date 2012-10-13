/** nicImage */

/* START CONFIG */
var nicImageOptions = {
	buttons : {
		'image' : {name : __('Add Image'), type : 'nicImageButton', tags : ['IMG']}
	}

};
/* END CONFIG */

var nicImageButton = nicEditorAdvancedButton.extend({
	addPane : function() {
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');
		this.addForm({
			'' : {type : 'title', txt : __('Add/Edit Image')},
			'src' : {type : 'text', txt : __('URL'), 'value' : 'http://', style : {width: '150px'}},
			'alt' : {type : 'text', txt : __('Alt Text'), style : {width: '100px'}},
			'align' : {type : 'select', txt : __('Align'), options : {none : __('Inline'),'left' : __('Left'), 'right' : __('Right')}}
		},this.im);
	},

	submit : function(e) {
		var src = this.inputs['src'].value;
		if(src == "" || src == "http://") {
			alert(__("You must enter a Image URL to insert"));
			return false;
		}
		this.removePane();

		if(!this.im) {
			var tmp = 'javascript:nicImTemp();';
			this.ne.nicCommand("insertImage",tmp);
			this.im = this.findElm('IMG','src',tmp);
		}
		if(this.im) {
			this.im.setAttributes({
				src : this.inputs['src'].value,
				alt : this.inputs['alt'].value,
				title : this.inputs['alt'].value,
				align : this.inputs['align'].value
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicImageOptions);

/** nicUpload */

/* START CONFIG */
var nicUploadOptions = {
	buttons : {
		'upload' : {name : __('Upload Image'), type : 'nicUploadButton'}
	}

};
/* END CONFIG */

var nicUploadButton = nicEditorAdvancedButton.extend({
	nicURI : 'http://api.imgur.com/2/upload.json',
	errorText : __('Failed to upload image'),

	addPane : function() {
		if(typeof window.FormData === "undefined") {
			return this.onError(__("Image uploads are not supported in this browser, use Chrome, Firefox, or Safari instead."));
		}
		this.im = this.ne.selectedInstance.selElm().parentTag('IMG');

		var container = new bkElement('div')
			.setStyle({ padding: '10px' })
			.appendTo(this.pane.pane);

		new bkElement('div')
			.setStyle({ fontSize: '14px', fontWeight : 'bold', paddingBottom: '5px' })
			.setContent(__('Insert an Image'))
			.appendTo(container);

		this.fileInput = new bkElement('input')
			.setAttributes({ 'type' : 'file' })
			.appendTo(container);

		this.progress = new bkElement('progress')
			.setStyle({ width : '100%', display: 'none' })
			.setAttributes('max', 100)
			.appendTo(container);

		this.fileInput.onchange = this.uploadFile.closure(this);
	},

	onError : function(msg) {
		this.removePane();
		alert(msg || __("Failed to upload image"));
	},

	uploadFile : function() {
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

	setProgress : function(percent) {
		this.progress.setStyle({ display: 'block' });
		if(percent < .98) {
			this.progress.value = percent;
		} else {
			this.progress.removeAttribute('value');
		}
	},

	onUploaded : function(options) {
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
				src : src,
				width : (w && options.image.width) ? Math.min(w, options.image.width) : ''
			});
		}
	}
});

nicEditors.registerPlugin(nicPlugin,nicUploadOptions);
