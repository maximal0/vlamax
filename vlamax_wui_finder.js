// Files Finder developed by Maxim Alkhilou 2013

function TFinderWindow(getFoldersUrl, getMediaUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, closeCallback, saveUrl) {
	var m_ajaxPanel          = new TAjaxPanel();
	var m_closeCallback      = (closeCallback === undefined || closeCallback == null) ? null : closeCallback;
	var m_getFoldersCallback = null;
	var m_listLayout         = new TVerticalLayout();
	var m_mainLayout         = new THorizontalLayout();
	var m_mediaList          = new TMediaList(3, 5, getMediaUrl);
	var m_this               = this;
	var m_toolBar            = new TToolBar('IconTitle', null, true);
	var m_toolsLayout        = new THorizontalLayout();
	var m_treeView           = new TTreeView(TLang.translate('folders'), 450, 200);
	var m_txtSearch          = new TSearchTextBox('images/finder/Search.png', 200, searchUrl, search);
	var m_wndAdd             = null;
	var m_wndEdit            = null;
	var m_wndSettings        = null;
	var m_window             = createWindow(TLang.translate('finder'));
	var m_wndImageEditor     = null;
	var m_wndImageViewer     = null;
	
	var addMedia = function() {
		var selectedFolder = m_treeView.getSelectedItem();
		if (selectedFolder != null && selectedFolder != '') {
			m_wndAdd = new TAddMediaWindow(addMediaUrl, selectedFolder, onSelectedFolderChanged);
			m_wndAdd.show();
		} else {
			TMessageBox.showModal(TLang.translate('info'), TLang.translate('selectFolderFirst'));
		}
	};
	
	var deleteMedia = function() {
		TQuestionBox.showModal(TLang.translate('media'), TLang.translate('sureDeleteMedia'), doDeleteMedia);
	};
	
	var doDeleteMedia = function() {
		var media = m_mediaList.getRightClickedMedia();
    	if (media != null) {
    		var request = new TRequest();

			request.add('Id', media.id);
			TAjax.sendRequest(m_window, deleteMediaUrl, request.getRequest(), onDeletedOk, onDeletedError);
    	}
	};
	
	var downloadMedia = function() {
		var media = m_mediaList.getRightClickedMedia();
    	if (media != null) {
    		var wndDownload = new TFileDownloadingWindow();
    		wndDownload.show(media.title, media.id, media.url, onDownloaded);
    	}
	};
	
	var editMedia = function() {
    	var media = m_mediaList.getRightClickedMedia();
    	if (media != null) {
    		m_wndEdit = new TEditMediaWindow(media.id, media.title, media.description, editMediaUrl, onSelectedFolderChanged);
    		m_wndEdit.show();
    	}
    };
	
	var onCloseClick = function() {
        if (m_closeCallback != null) {
        	m_closeCallback();
        }
        hideModal();
    };
	
	var onDeletedError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), TLang.translate('errorDeletingMedia'));
	};
	
	var onDeletedOk = function(xmlDoc, text) {
		var tagResult = getSimpleTagValue(xmlDoc, 'Result');
		
		if (tagResult == 'OK') {
			TMessageBox.showModal(TLang.translate('finder'), TLang.translate('deleteMediaOk'), onSelectedFolderChanged);
		} else {
			onDeletedError(text);
		}
	};
	
	var onDownloaded = function(response) {
		var win = window.open('', TLang.translate('finder'));
	    win.document.write('<html><head><title>' +  TLang.translate('finder') + '</title>');
	    win.document.write('</head><body >');
	    win.document.write(response);
	    win.document.write('</body></html>');
	};
	
	var onGetFolderError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));
		
		if (m_getFoldersCallback != null) {
			m_getFoldersCallback();
			m_getFoldersCallback = null;
		}
	};
	
	var onGetFolderOk = function(xmlDoc, xmlText) {
		m_treeView.loadXML(xmlDoc);
		
		if (m_getFoldersCallback != null) {
			m_getFoldersCallback();
			m_getFoldersCallback = null;
		}
	};
	
	var onSelectedFolderChanged = function() {
		var selectedFolder = m_treeView.getSelectedItem();
		m_mediaList.setAuxiliaryParameters('<Folder>' + selectedFolder + '</Folder>');
		m_mediaList.update(refresh);
	};
	
	var onSettings = function(itemHeight, itemWidth, itemsNumber, rowsNumber) {
		//m_mediaList.reset(itemHeight, itemWidth, itemsNumber, rowsNumber);
		//m_window.refresh();
		//m_mediaList.show();
	};
	
	var onSettingsClick = function() {
		if (m_wndSettings == null) {
			m_wndSettings = new TFinderSettingsWindow(onSettings);
		}
		m_wndSettings.show();
	};
	
	var processMedia = function() {
		var media = m_mediaList.getRightClickedMedia();
    	if (media != null) {
    		var type = media.type.toLowerCase().split('/');
    		if (type[0] == 'image') {
    			var selectedMedia = m_mediaList.getSelectedMedia();
    			var srcs = new Array();
    			srcs.push(media.url);
    			for (var i = 0; i < selectedMedia.length; i++) {
    				if (selectedMedia[i].id != media.id && selectedMedia[i].type.toLowerCase().split('/')[0] == 'image') {
    					srcs.push(selectedMedia[i].url);
    				}
    			}
    			m_wndImageEditor = new TImageEditorWindow(srcs, getFoldersUrl, getMediaUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveUrl);
    			m_wndImageEditor.show();
    		}
    	}
	};
	
	var refresh = function() {
		m_window.refresh(0);
	};
    
    var search = function(xmlDoc) {
    	m_mediaList.loadXML(xmlDoc);
    };
    
    var viewMedia = function() {
    	var media = m_mediaList.getRightClickedMedia();
    	if (media != null) {
    		var type = media.type.toLowerCase().split('/');
    		if (type[0] == 'image') {
    			var selectedMedia = m_mediaList.getSelectedMedia();
    			var srcs = new Array();
    			srcs.push(media.url);
    			for (var i = 0; i < selectedMedia.length; i++) {
    				var sType = selectedMedia[i].type.toLowerCase().split('/');
    				if (selectedMedia[i].id != media.id && sType[0] == 'image') {
    					srcs.push(selectedMedia[i].url);
    				}
    			}
    			m_wndImageViewer = new TImageViewerWindow(srcs, 0);
    			m_wndImageViewer.show();
    		}
    	}
    };
    
    this.getFolders = function(getFoldersCallback) {
    	var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId></Vtf>';

	    if (getFoldersCallback !== undefined && getFoldersCallback != null) {
	        m_getFoldersCallback = getFoldersCallback;
	    }

	    TAjax.sendRequest(m_this, getFoldersUrl, request, onGetFolderOk, onGetFolderError);
    };
    
    this.getSelectedFolder = function() {
    	m_treeView.getSelectedItem();
    };
    
    this.getSelectedItems = function() {
		return m_mediaList.getSelectedMedia();
	};
	
	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};

	this.hide = function() {
		hideModal();
	};

	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setListItemHeight = function(h) {
		m_mediaList.setMediaHeight(h);
	};
	
	this.setListItemWidth = function(w) {
		m_mediaList.setMediaWidth(w);
	};
    
    this.setOnFileDblClick = function(callback) {
    	m_mediaList.setDblClickCallback(callback);
    };
    
    this.setOnFileSelectionChanged = function(callback) {
    	m_mediaList.setSelectionChangedCallback(callback);
    };
    
    this.show = function () {
    	m_this.getFolders(refresh);
        showModal(m_window);
    };
    
    m_mediaList.addMenuCommand(1, TLang.translate('view'), viewMedia);
    m_mediaList.addMenuCommand(2, TLang.translate('download'), downloadMedia);
    m_mediaList.addMenuCommand(3, TLang.translate('info'), editMedia);
    m_mediaList.addMenuCommand(4, TLang.translate('delete'), deleteMedia);
    m_mediaList.addMenuCommand(5, TLang.translate('process'), processMedia);
    
    m_treeView.setOnSelectedItemChanged(onSelectedFolderChanged);
    
    m_toolBar.add('upload', TLang.translate('upload'), 'images/finder/upload.png', null, null, addMedia);
	m_toolBar.add('refresh', TLang.translate('refresh'), 'images/finder/refresh.png', null, null, refresh);
	m_toolBar.add('settings', TLang.translate('settings'), 'images/finder/settings.png', null, null, onSettingsClick);
	m_toolBar.add('help', TLang.translate('help'), 'images/finder/help.png', null, null);
	m_toolBar.add('close', TLang.translate('close'), 'images/finder/exit.png', null, null, onCloseClick);
    m_toolsLayout.add(m_toolBar);
 	m_toolsLayout.add(new THorizontalDelimiter(200));
    m_toolsLayout.add(m_txtSearch);
    
    m_listLayout.add(m_toolsLayout);
    m_listLayout.add(m_mediaList);
    
    m_mainLayout.add(m_treeView);
    m_mainLayout.add(m_listLayout);
    
    m_window.add(m_mainLayout);
};

function TAddMediaWindow(AddUrl, folder, callback) {
	var m_btnClose        = new TButton(TLang.translate('close'));
	var m_btnUpload       = new TButton(TLang.translate('uploadToServer'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_fileSelected    = false;
	var m_fileUpload      = new TFileUploader(TLang.translate('browse'), 'audio/*|video/*|image/*');
	var m_layForm         = new TFormLayout();
	var m_layMain         = new THorizontalLayout();
	var m_txtFile         = new TText(TLang.translate('noFileSelected') + '.');
	var m_txtUploadResult = new TText('');
	var m_vtbDescription  = new TValidatableTextBox(200, new TEmptyValidator());
	var m_vtbTitle        = new TValidatableTextBox(200, new TEmptyValidator());
	var m_window          = createWindow(TLang.translate('uploadMediaFile'));
	
	var onClientFileSelected = function(files) {
		if (files.length > 0) {
			m_txtFile.setText(files[0].name + ' (' + (files[0].size / 1024) + ' KB)');
			m_fileSelected = true;
			m_window.refresh();
			validateAdd();
		} else {
			m_txtFile.setText(TLang.translate('noFileSelected') + '.');
			m_fileSelected = false;
		}
		m_txtUploadResult.setText('');
	};
	
	var onCloseClick = function() {
		hideModal();
		
		if (m_callback != null) {
			m_callback();
		}
	};
	
	var onFileUpload = function() {
		if (m_fileSelected) {
			var auxiliary = folder + ';' + m_vtbTitle.getValue() + ';' + m_vtbDescription.getValue() + ';'+ g_sessionId;
			m_fileUpload.upload(AddUrl, onFileUploaded, auxiliary);
		} else {
			m_txtUploadResult.setText(TLang.translate('selectFileFirst') + '.');
			m_window.refresh();
		}
	};
	
	var onFileUploaded = function(response) {
		m_txtUploadResult.setText(response);
		m_window.refresh();
	};
	
	var validateAdd = function() {
		if (m_vtbDescription.isValid() && m_vtbTitle.isValid() && m_fileSelected) {
			m_btnUpload.enable();
		} else {
			m_btnUpload.disable();
		}
	};
	
	this.show = function() {
		m_vtbDescription.setValue('');
        m_vtbTitle.setValue('');
        showModal(m_window);
        m_btnUpload.disable();
    };
    
    m_btnClose.setOnClick(onCloseClick);
	m_btnUpload.setOnClick(onFileUpload);
	m_fileUpload.setOnClick(onClientFileSelected);
	
	m_vtbDescription.setMaxLength(100);
	m_vtbDescription.setOnValidationChanged(validateAdd);
	m_vtbTitle.setMaxLength(100);
	m_vtbTitle.setOnValidationChanged(validateAdd);
	
	m_layMain.setDirection(TLang.getDirection());
	m_layMain.add(m_fileUpload);
	m_layMain.add(m_txtFile);
	
	m_layForm.setDirection(TLang.getDirection());
	m_layForm.add(new TText(TLang.translate('title') + ': '), m_vtbTitle);
	m_layForm.add(new TText(TLang.translate('desc') + ': '), m_vtbDescription);
	m_layForm.add(new TText(TLang.translate('selectFile') + ': '), m_layMain);
	m_layForm.add(new TText(''), m_btnUpload);
	
	m_window.add(m_layForm);
	m_window.add(m_txtUploadResult);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_btnClose);    	
};

function TEditMediaWindow(Id, title, desc, editUrl, callback) {
	var m_btnClose        = new TButton(TLang.translate('close'));
	var m_btnChange       = new TButton(TLang.translate('change'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_chvDesc         = new TChangeValidator(new TEmptyValidator());
	var m_chvTitle        = new TChangeValidator(new TEmptyValidator());
	var m_desc            = (desc === undefined || desc == null) ? '' : desc;
	var m_layCommands     = new THorizontalLayout();
	var m_layForm         = new TFormLayout();
	var m_title           = (title === undefined || title == null) ? '' : title;
	var m_vtbDescription  = new TValidatableTextBox(200, m_chvDesc);
	var m_vtbTitle        = new TValidatableTextBox(200, m_chvTitle);
	var m_window          = createWindow(TLang.translate('edit'));
	
	var onChangeClick = function() {
		var request = new TRequest();
		
		request.add('Id', Id);
		request.add('Title', m_vtbTitle.getValue());
		request.add('Description', m_vtbDescription.getValue());
		
		TAjax.sendRequest(m_window, editUrl, request.getRequest(), onChangedOk, onChangedError);
	};
	
	var onCloseClick = function() {
		hideModal();
		
		if (m_callback != null) {
			m_callback();
		}
	};
	
	var onChangedError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), TLang.translate('errorChangingMedia'));
	};
	
	var onChangedOk = function(xmlDoc, text) {
		var tagResult = getSimpleTagValue(xmlDoc, 'Result');
		
		if (tagResult == 'OK') {
			TMessageBox.showModal(TLang.translate('finder'), TLang.translate('changeMediaOk'), onChangedOkCompleted);
		} else {
			onChangedError('');
		}
	};
	
	var onChangedOkCompleted = function() {
		m_title = m_vtbTitle.getValue();
		m_chvTitle.setOriginalValue(m_title);
		m_desc = m_vtbDescription.getValue();
		m_chvDesc.setOriginalValue(m_desc);
		validateChange();
	};
	
	var validateChange = function() {
		if (m_vtbDescription.getValue() != '' && m_vtbTitle.getValue() != '') { 
			if (m_vtbDescription.getValue() != m_desc || m_vtbTitle.getValue() != m_title) {
				m_btnChange.enable();
			} else {
				m_btnChange.disable();
			}
		} else {
			m_btnChange.disable();
		}
	};
	
	this.show = function() {
		m_btnChange.disable();
        showModal(m_window);
    };
    
    m_btnClose.setOnClick(onCloseClick);
	m_btnChange.setOnClick(onChangeClick);
	
	m_chvDesc.setOriginalValue(m_desc);
	m_chvDesc.setCallback(validateChange);
	m_chvTitle.setOriginalValue(m_title);
	m_chvTitle.setCallback(validateChange);
	
	m_vtbDescription.setMaxLength(100);
	m_vtbDescription.setOnValidationChanged(validateChange);
	m_vtbDescription.setValue(m_desc);
	m_vtbTitle.setMaxLength(100);
	m_vtbTitle.setOnValidationChanged(validateChange);
	m_vtbTitle.setValue(m_title);
	
	m_layCommands.setDirection(TLang.getDirection());
	m_layCommands.add(m_btnChange);
	m_layCommands.add(m_btnClose);
	
	m_layForm.setDirection(TLang.getDirection());
	m_layForm.add(new TText(TLang.translate('title') + ': '), m_vtbTitle);
	m_layForm.add(new TText(TLang.translate('desc') + ': '), m_vtbDescription);
	
	m_window.add(m_layForm);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);   
};

function TFinderSettingsWindow(callback) {
	var m_btnOk           = new TButton(TLang.translate('ok'));
	var m_btnReturn       = new TButton(TLang.translate('cancel'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_layCommands     = new THorizontalLayout();
	var m_layMain         = new TFormLayout();
	var m_tbItemHeight    = new TValidatableTextBox(60, new TNumberValidator());
	var m_tbItemWidth     = new TValidatableTextBox(60, new TNumberValidator());
	var m_tbRowItems      = new TValidatableTextBox(60, new TNumberValidator());
	var m_tbRowsNumber    = new TValidatableTextBox(60, new TNumberValidator());
	var m_window          = createWindow(TLang.translate('settings'));
	
	var onOkClick = function() {
		hideModal();
		
		if (m_callback != null) {
			var validator = new TNumberValidator();
			if (validator.validate(m_tbItemHeight.getValue()) && validator.validate(m_tbItemWidth.getValue()) && validator.validate(m_tbRowItems.getValue()) && validator.validate(m_tbRowsNumber.getValue())) {
				m_callback(m_tbItemHeight.getValue(), m_tbItemWidth.getValue(), m_tbRowItems.getValue(), m_tbRowsNumber.getValue());
			}
		}
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var validate = function() {
		if (m_tbItemHeight.isValid() && m_tbItemWidth.isValid() && m_tbRowItems.isValid() && m_tbRowsNumber.isValid()) {
			m_btnOk.enable();
		} else {
			m_btnOk.disable();
		}
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	m_btnOk.setOnClick(onOkClick);
	m_btnReturn.setOnClick(onCancelClick);
	
	m_tbItemHeight.setValue('125');
	m_tbItemHeight.setOnValidationChanged(validate);
	m_tbItemWidth.setValue('150');
	m_tbItemWidth.setOnValidationChanged(validate);
	m_tbRowItems.setValue('5');
	m_tbRowItems.setOnValidationChanged(validate);
	m_tbRowsNumber.setValue('3');
	m_tbRowsNumber.setOnValidationChanged(validate);
	
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_layMain.add(new TText('Item Height:'), m_tbItemHeight);
	m_layMain.add(new TText('Item Width:'), m_tbItemWidth);
	m_layMain.add(new TText('Number of Items Per Row:'), m_tbRowItems);
	m_layMain.add(new TText('Number of Rows:'), m_tbRowsNumber);
	
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};
