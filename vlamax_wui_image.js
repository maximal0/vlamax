// Image editor developed by Maxim Alkhilou 2014

function calculateFitImageSize(src, maxWidth, maxHeight) {
	var size = getImageSize(src);
	var fitSize = calculateAspectRatioFit(size.width, size.height, maxWidth, maxHeight);
	return { width: Math.floor(fitSize.width), height: Math.floor(fitSize.height) };
};

function TCanvasBrick(className) {
	var m_alignment    = 0;
	var m_element      = document.createElement('canvas');
	var m_height       = 0;
	var m_image        = null;
	var m_width        = 0;
	var m_x            = 0;
	var m_y            = 0;
	
	var setVisibility = function(visibility) {
		m_element.style.visibility = visibility;
    };
	
	this.addEvent = function(event, callback) {
		$$$$(m_element, event, callback);
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.createImageData = function(w, h) {
		w = (w === undefined || w == null) ? m_width : w;
		h = (h === undefined || h == null) ? m_height : h;
		
		var ctx = m_element.getContext('2d');
		var imgData = ctx.createImageData(w, h);
		
		return imgData;
	};

    this.destroy = function() {
        document.body.removeChild(m_element);
        m_element = null;
    };

	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getContext = function() {
		return m_element.getContext('2d');
	};
	
	this.getImage = function() {
		return m_image;
	};
	
	this.getImageData = function(rect) {
		var ctx = m_element.getContext('2d');
		var imgData = null;
		if (rect === undefined || rect == null) {
			imgData = ctx.getImageData(0, 0, m_width, m_height);
		} else {
			imgData = ctx.getImageData(rect.left, rect.top, rect.width, rect.height);
		}
		return imgData;
	};
	
	this.getElement = function() {
		return m_element;
	};

	this.getHeight = function() {
		return m_height;
	};
	
	this.getWidth = function() {
		return m_width;
	};
	
	this.getX = function() {
		return m_x;
	};
	
	this.getY = function() {
		return m_y;
	};
	
	this.hasCanvas = function() {
		try {
			return ((typeof m_element.getContext == "function") && m_element.getContext("2d")); 
		}
		catch(e) { 
			return false;
		}
	};
	
	this.hide = function() {
		setVisibility('hidden');
	};

	this.move = function(x, y) {
		this.setX(x);
		this.setY(y);
	};

	this.putImageData = function(imgData, x, y) {
		x = (x === undefined || x == null) ? 0 : x;
		y = (y === undefined || y == null) ? 0 : y;
		
		var ctx = m_element.getContext('2d');
		var res = ctx.putImageData(imgData, x, y);
		
		return res;
	};
	
	this.removeEvent = function(event, callback) {
	    $$$$$(m_element, event, callback);
	};
	
	this.resetImage = function() {
		var ctx = m_element.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, m_width, m_height);
		ctx.drawImage(m_image, 0, 0, m_width, m_height);
	};
	
	this.setCanvas = function(canvas, rect) {
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: m_width, height: m_height } : rect;
		var ctx = m_element.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, rect.width, rect.height);
		ctx.drawImage(canvas, rect.left, rect.top, rect.width, rect.height);
	};
	
	this.setCursor = function(cursor) {
		m_element.style.cursor = cursor;
	};
	
	this.setHeight = function(height) {
		m_element.style.height = height + 'px';
		m_element.height = height;
		m_height = height;
	};
	
	this.setImage = function(src, rect) {
		m_image = new Image();
		m_image.src = src;
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: m_width, height: m_height } : rect;
		var ctx = m_element.getContext('2d');
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
		
		if (m_image.complete) {
			ctx.drawImage(m_image, rect.left, rect.top, rect.width, rect.height);
		} else {
			m_image.onload = function() { ctx.drawImage(m_image, rect.left, rect.top, rect.width, rect.height); };
		}
	};
	
    this.setOrder = function(order) {
		m_element.style.zIndex = order + 2;
		
		return order + 3;
	};
	
	this.setOverflow = function(overflow) {
		m_element.style.overflow = overflow;
	};
    
    this.setSize = function(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	};

	this.setTabIndex = function(index) {
	    m_element.tabIndex = index;
	};

	this.setWidth = function(width) {
		m_element.style.width = width + 'px';
		m_element.width = width;
		m_width = width;
	};

	this.setX = function(x) {
		m_element.style.left  = x + 'px';
		m_x = x;
	};
	
	this.setY = function(y) {
		m_element.style.top  = y + 'px';
		m_y = y;
	};
	
	this.show = function() {
		setVisibility('visible');
	};
	
	m_element.className      = (className === undefined || className == null) ? null : className;
	m_element.style.position = 'absolute';

	document.body.appendChild(m_element);
	
	m_height = m_element.offsetHeight;
	m_width  = m_element.offsetWidth;

	setVisibility('hidden');
};

function TImageViewer(srcArray, selectedIndex, viewWidth, viewHeight, edit) {
	var m_alignment                = 0;
	var m_brkArrowNext             = new TBrick();
	var m_brkArrowPrevious         = new TBrick();
	var m_brkBackground            = new TBrick();
	var m_brkImageView             = new TBrick();
	var m_brkSlide                 = new TBrick();
	var m_edit                     = (edit === undefined || edit == null) ? false : edit;
	var m_enableNext               = false;
	var m_enablePrevious           = false;
	var m_height                   = 0;
	var m_images                   = new Array();
	var m_imgView                  = null;
	var m_order                    = 0;
	var m_selectedImage            = (selectedIndex === undefined || selectedIndex == null) ? 0 : selectedIndex;
	var m_selectionChangedCallback = null;
	var m_slideImages              = new Array();
	var m_slideItemHeight          = 75;
	var m_slideItemPadding         = 5;
	var m_slideItemsNumber         = 4;
	var m_slideItemWidth           = 100;
	var m_viewHeight               = (viewHeight === undefined || viewHeight == null) ? 400 : viewHeight;
	var m_viewWidth                = (viewWidth === undefined || viewWidth == null) ? 600 : viewWidth;
	var m_width                    = 0;
	
	m_brkArrowNext.setBackground('url(images/next_image.png) no-repeat');
	m_brkArrowNext.setSize(40, 40);
	m_brkArrowNext.setTooltip(TLang.translate('nextImage'));
	m_brkArrowPrevious.setBackground('url(images/previous_image.png) no-repeat');
	m_brkArrowPrevious.setSize(40, 40);
	m_brkArrowPrevious.setTooltip(TLang.translate('previousImage'));
	m_brkBackground.setBorder('#AFCCEE', 1, 1, 1, 1, 1);
	m_brkBackground.setBackground('#AFCCEE');
	m_brkImageView.setBackground('#FFFFFF');
	m_brkSlide.setBackground('#E0E0E0');
	m_brkSlide.setSize(m_slideItemsNumber * m_slideItemWidth + (m_slideItemsNumber + 1) * m_slideItemPadding , m_slideItemHeight + m_slideItemPadding * 2);
	
	var hideSlideImages = function() {
		for (var i = 0; i < m_slideImages.length; i++) {
    		m_images[m_slideImages[i]].background.hide();
    		m_images[m_slideImages[i]].image.hide();
    		m_images[m_slideImages[i]].cover.hide();
    	}
	};
	
	var moveSlideItems = function() {
		var itemX = m_brkSlide.getX() + m_slideItemPadding;
    	var itemY = m_brkSlide.getY() + m_slideItemPadding;
    	
    	for (var i = 0; i < m_slideImages.length; i++) {
    		m_images[m_slideImages[i]].background.move(itemX, itemY);
    		m_images[m_slideImages[i]].cover.move(itemX, itemY);
    		m_images[m_slideImages[i]].image.move(itemX + (m_slideItemWidth - m_images[m_slideImages[i]].image.getWidth()) / 2, itemY + (m_slideItemHeight - m_images[m_slideImages[i]].image.getHeight()) / 2);
    		
    		itemX += m_slideItemWidth + m_slideItemPadding;
    	}
	};
	
	var moveViewImage = function() {
		var imgWidth = m_imgView.getWidth();
    	var imgHeight = m_imgView.getHeight();
    	
    	if (m_viewWidth - imgWidth == 0) {
    		if (m_viewHeight - imgHeight == 0) {
    			m_imgView.move(m_brkImageView.getX(), m_brkImageView.getY());
    		} else {
    			m_imgView.move(m_brkImageView.getX(), m_brkImageView.getY() + (m_viewHeight - imgHeight) / 2);
    		}
    	} else {
    		if (m_viewHeight - imgHeight == 0) {
    			m_imgView.move(m_brkImageView.getX() + (m_viewWidth - imgWidth) / 2, m_brkImageView.getY());
    		} else {
    			m_imgView.move(m_brkImageView.getX() + (m_viewWidth - imgWidth) / 2, m_brkImageView.getY() + (m_viewHeight - imgHeight) / 2);
    		}
    	}
	};
	
	var onNextClick = function() {
		if (m_enableNext) {
			hideSlideImages();
			
			for (var i = 0; i < m_slideImages.length; i++) {
				m_slideImages[i] += 1;
			}
			
			if (m_slideImages[m_slideImages.length - 1] == m_images.length - 1) { onNextOut(); m_enableNext = false; }
			if (!m_enablePrevious) { m_enablePrevious = true; }
			
			moveSlideItems();
			showSlideImages();
		}
	};
	
	var onNextOut = function() {
		if (m_enableNext) {
			m_brkArrowNext.setBackground('url(images/next_image.png) no-repeat');
			m_brkArrowNext.setCursor('default');
		}
	};
	
	var onNextOver = function() {
		if (m_enableNext) {
			m_brkArrowNext.setBackground('url(images/next_image_on.png) no-repeat');
			m_brkArrowNext.setCursor('pointer');
		}
	};
	
	var onPreviousClick = function() {
		if (m_enablePrevious) {
			hideSlideImages();
			
			for (var i = 0; i < m_slideImages.length; i++) {
				m_slideImages[i] -= 1;
			}
			
			if (m_slideImages[0] == 0) { onPreviousOut(); m_enablePrevious = false; }
			if (!m_enableNext) { m_enableNext = true; }
			
			moveSlideItems();
			showSlideImages();
		}
	};
	
	var onPreviousOut = function() {
		if (m_enablePrevious) {
			m_brkArrowPrevious.setBackground('url(images/previous_image.png) no-repeat');
			m_brkArrowPrevious.setCursor('default');
		}
	};
	
	var onPreviousOver = function() {
		if (m_enablePrevious) {
			m_brkArrowPrevious.setBackground('url(images/previous_image_on.png) no-repeat');
			m_brkArrowPrevious.setCursor('pointer');
		}
	};
	
	var onSlideItemClick = function(index) {
		if (m_selectedImage != index) {
			m_images[m_selectedImage].background.setBackground('#FFFFFF');
			m_selectedImage = index;
			m_images[index].background.setBackground('#FFD0A0');
			if (m_imgView != null) {
				var url = m_images[index].image.getUrl();
				if (url != '') {
					var size = calculateFitImageSize(url, m_viewWidth, m_viewHeight);
					m_imgView.setHeight(size.height);
					m_imgView.setWidth(size.width);
				} else {
					m_imgView.setHeight(m_viewHeight);
					m_imgView.setWidth(m_viewWidth);
				}
				if (!m_edit) { 
					m_imgView.setUrl(url); 
				} else { 
					m_imgView.setImage(url); 
				}
				moveViewImage();
				m_imgView.show();
			}
			if (m_selectionChangedCallback != null) {
				m_selectionChangedCallback();
			}
		}
	};
	
	var onSlideItemOut = function(index) {
		if (index != m_selectedImage) { m_images[index].background.setBackground('#FFFFFF'); }
		m_images[index].cover.setCursor('default');
	};
	
	var onSlideItemOver = function(index) {
		m_images[index].background.setBackground('#FFD0A0');
		m_images[index].cover.setCursor('pointer');
	};
	
	var setSlideImages = function() {
		m_slideImages = new Array();
		var beg = 0;
    	var end = 0;
    	if (m_images.length < m_slideItemsNumber) {
    		end = m_images.length;
    	} else {
    		if (m_selectedImage + m_slideItemsNumber - 1 > m_images.length) {
	    		beg = m_images.length - m_slideItemsNumber;
	    		end = m_images.length;
	    		m_enableNext = false;
	    		if (m_images.length > m_slideItemsNumber) { m_enablePrevious = true; }
	    	} else {
	    		beg = m_selectedImage;
	    		end = m_selectedImage + m_slideItemsNumber;
	    		if (m_images.length != m_slideItemsNumber) { m_enableNext = true; }
	    	}
    	}
    	for (var i = beg; i < end; i++) {
	    	m_slideImages.push(i);
	    }
	};
	
	var showSlideImages = function() {
		for (var i = 0; i < m_slideImages.length; i++) {
    		m_images[m_slideImages[i]].background.show();
    		m_images[m_slideImages[i]].image.show();
    		m_images[m_slideImages[i]].cover.show();
    	}
	};
	
	this.addImage = function(url, i, init) {
		i = (i === undefined || i == null) ? m_images.length : i;
		init = (init === undefined || init == null) ? false : init;
		
		var background = new TBrick();
    	var cover = new TBrick();
    	var coverClick = new TCaller(onSlideItemClick, i);
		var coverOut = new TCaller(onSlideItemOut, i);
		var coverOver = new TCaller(onSlideItemOver, i);
		var size = calculateFitImageSize(url, m_slideItemWidth - 10, m_slideItemHeight - 10);
    	var image = new TImage(url, size.width, size.height);
    		
    	background.setSize(m_slideItemWidth, m_slideItemHeight);
    	background.setBackground('#FFFFFF');
    	cover.addEvent('click', coverClick.callback);
		cover.addEvent('mouseout', coverOut.callback);
		cover.addEvent('mouseover', coverOver.callback);
		cover.setSize(m_slideItemWidth, m_slideItemHeight);
			
		m_images.push({ background: background, cover: cover, image: image });
		
		if (url == '') {
    		onSlideItemClick(i);
    	} 
    	
		if (!init) { 
			hideSlideImages();
			setSlideImages();
			moveSlideItems();
			m_images[i].background.setOrder(m_order + 3);
    		m_images[i].cover.setOrder(m_order + 11);
    		m_images[i].image.setOrder(m_order + 10);
			showSlideImages();
		}
	};
	
	this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };

    this.getAlignment = function() {
        return m_alignment;
    };
    
    this.getCanvas = function() {
    	if (m_edit) {
    		return m_imgView;
    	} else {
    		return null;
    	}
    };
    
    this.getHeight = function() {
    	m_height = m_viewHeight +  m_brkSlide.getHeight() + 30;
    	
    	return m_height;
    };
    
    this.getWidth = function() {
    	m_width = Math.max(m_viewWidth + 20, m_brkSlide.getWidth() + m_brkArrowNext.getWidth() + m_brkArrowPrevious.getWidth() + 40);
    	
    	return m_width;
    };
    
    this.hasCanvas = function() {
    	if (m_edit) {
    		if (m_imgView != null) {
    			return m_imgView.hasCanvas();
    		} else {
    			return false;
    		}
    	} else {
    		return false;
    	}
    };
    
    this.hide = function() {
    	m_brkBackground.hide();
    	m_brkArrowNext.hide();
    	m_brkArrowPrevious.hide();
    	m_brkImageView.hide();
    	if (m_imgView != null) { m_imgView.hide(); }
    	m_brkSlide.hide();
    	
    	hideSlideImages();
    };
    
    this.move = function(x, y) {
    	m_brkBackground.move(x, y);
    	m_brkBackground.setSize(m_width, m_height);
    	
    	m_brkImageView.move(x + (m_width - m_viewWidth) / 2, y + 10);
    	m_brkImageView.setSize(m_viewWidth, m_viewHeight);
    	
    	if (m_imgView != null) {
    		moveViewImage();
    	}
    	
    	m_brkSlide.move(x + (m_width - m_brkSlide.getWidth()) / 2, y + m_viewHeight + 20);
    	
    	m_brkArrowPrevious.move(m_brkSlide.getX() - 50, m_brkSlide.getY() + (m_brkSlide.getHeight() - 40) / 2);
    	
    	m_brkArrowNext.move(m_brkSlide.getX() + m_brkSlide.getWidth() + 10, m_brkArrowPrevious.getY());
    	
    	moveSlideItems();
    };
    
    this.resetViewer = function() {
    	if (m_edit && m_imgView != null) {
    		var url = m_images[m_selectedImage].image.getUrl();
			if (url != '') {
				var size = calculateFitImageSize(url, m_viewWidth, m_viewHeight);
				m_imgView.setHeight(size.height);
				m_imgView.setWidth(size.width);
				m_imgView.setImage(url);
			} else {
				m_imgView.setHeight(m_viewHeight);
				m_imgView.setWidth(m_viewWidth);
			}
			moveViewImage();
			m_imgView.show();
    	}
    };
    
    this.resizeViewElement = function(newWidth, newHeight) {
    	var size = calculateAspectRatioFit(newWidth, newHeight, m_viewWidth, m_viewHeight);
    	m_imgView.setHeight(Math.floor(size.height));
		m_imgView.setWidth(Math.floor(size.width));
		moveViewImage();
		m_imgView.show();
    };
    
    this.setBackgroundColor = function(color) {
    	m_brkBackground.setBorder(color, 1, 1, 1, 1, 1);
    	m_brkBackground.setBackground(color);
    };
    
    this.setCanvas = function(canvas) {
    	if (m_edit) {
    		m_imgView.setSize(canvas.getWidth(), canvas.getHeight());
    		m_imgView.setCanvas(canvas.getElement());
    		moveViewImage();
    		m_imgView.show();
    	} 
    };
    
    this.setOrder = function(order) {
    	m_order = order;
    	m_brkBackground.setOrder(order + 1);
    	m_brkArrowNext.setOrder(order + 2);
    	m_brkArrowPrevious.setOrder(order + 2);
    	m_brkImageView.setOrder(order + 2);
    	if (m_imgView != null) { m_imgView.setOrder(order + 10); }
    	m_brkSlide.setOrder(order + 2);
    	
    	for (var i = 0; i < m_images.length; i++) {
    		m_images[i].background.setOrder(order + 3);
    		m_images[i].cover.setOrder(order + 11);
    		m_images[i].image.setOrder(order + 10);
    	}
    	
    	return order + 12;
    };
    
    this.setSelectionChangedCallback = function(callback) {
    	m_selectionChangedCallback = callback;
    };
    
    this.setSlideItemHeight = function(height) {
    	m_slideItemHeight = height;
    };
    
    this.setSlideItemPadding = function(Padding) {
    	m_slideItemPadding = Padding;
    };
    
    this.setSlideItemsNumber = function(n) {
    	m_slideItemsNumber = n;
    };
    
    this.setSlideItemWidth = function(width) {
    	m_slideItemWidth = width;
    };
    
    this.show = function() {
    	m_brkBackground.show();
    	m_brkArrowNext.show();
    	m_brkArrowPrevious.show();
    	m_brkImageView.show();
    	if (m_imgView != null) { m_imgView.show(); }
    	m_brkSlide.show();
    	
    	showSlideImages();
    };
    
    if (srcArray !== undefined && srcArray != null) {
    	for (var i = 0; i < srcArray.length; i++) {
    		this.addImage(srcArray[i], i, true);
    		if (m_selectedImage == i) {
	    		size = calculateFitImageSize(srcArray[i], m_viewWidth, m_viewHeight);
	    		if (!m_edit) {
	    			m_imgView = new TImage(srcArray[i], size.width, size.height);
	    		} else {
	    			m_imgView = new TCanvasBrick();
	    			if (m_imgView.hasCanvas()) {
	    				m_imgView.setSize(size.width, size.height);
	    				m_imgView.setImage(srcArray[i]);
	    				//m_imgView.getElement().style.border = '1px solid #000000';
	    			} else {
	    				m_imgView = null;
	    			}
	    		}
	    		m_images[i].background.setBackground('#FFD0A0');
	    	}
    	}
    	srcArray = null;
    	setSlideImages();
    } 
    
    m_brkArrowNext.addEvent('click', onNextClick);
    m_brkArrowNext.addEvent('mouseout', onNextOut);
    m_brkArrowNext.addEvent('mouseover', onNextOver);
    
    m_brkArrowPrevious.addEvent('click', onPreviousClick);
    m_brkArrowPrevious.addEvent('mouseout', onPreviousOut);
    m_brkArrowPrevious.addEvent('mouseover', onPreviousOver);
};

function TImageViewerWindow(srcArray, selectedIndex, viewWidth, viewHeight) {
	var m_btnClose    = new TButton(TLang.translate('close'));
	var m_imgViewer   = new TImageViewer(srcArray, selectedIndex, viewWidth, viewHeight);
	var m_layCommands = new THorizontalLayout();
	var m_window      = createWindow(TLang.translate('imageViewer'));
	
	var onCloseClick = function() {
		hideModal();
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	m_btnClose.setOnClick(onCloseClick);
	m_layCommands.add(m_btnClose);
	
	m_window.add(m_imgViewer);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TImageEditor(srcArray, foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveUrl) {
	var m_ajaxPanel       = new TAjaxPanel();
	var m_alignment       = 0;
	var m_angel           = 0;
	var m_backColor       = '#FFFFFF';
	var m_brkBackColor    = new TBrick();
	var m_brkForeColor    = new TBrick();
	var m_brkBackground   = new TBrick();
	var m_cursorMode      = 'default';
	var m_ddlLineWidth    = new TDropdownList();
	var m_foreColor       = '#000000';
	var m_hasChange       = false;
	var m_height          = 0;
	var m_imgViewer       = new TImageViewer(srcArray, 0, null, null, true);
	var m_left            = 0;
	var m_mnuMain         = new THorizontalMenu();
	var m_redoCanvas      = new TCanvasBrick();
	var m_tbMain          = new TToolBar('Icon', '#ECF1F6');
	var m_this            = this;
	var m_top             = 0;
	var m_txtLineWidth    = new TText(TLang.translate('thickness'));
	var m_undoCanvas      = new TCanvasBrick();
	var m_width           = 0;
	var m_wndColorPicker  = null;
	
	m_brkBackground.setBorder('#AFCCEE', 1, 1, 1, 1, 1);
	m_brkBackground.setBackground('#AFCCEE');
	
	var flipImage = function(mode, canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var copyCanvas = document.createElement("canvas");
		copyCanvas.width = rect.width;
		copyCanvas.height = rect.height;
		copyCanvas.getContext("2d").drawImage(canvas.getElement(), rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

		var ctx = canvas.getContext();
		ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
		ctx.save();
		if (mode == "horizontal") {
			ctx.scale(-1, 1);
			ctx.drawImage(copyCanvas, -rect.left - rect.width, rect.top, rect.width, rect.height);
		} else {
			ctx.scale(1, -1);
			ctx.drawImage(copyCanvas, rect.left, -rect.top - rect.height, rect.width, rect.height);
		}
		ctx.restore();
		
		setSaveChanges(original);
	};
	
	var hideLineWidth = function() {
		m_ddlLineWidth.hide();
		m_txtLineWidth.hide();
	};
	
	var onBackColorClick = function() {
		m_wndColorPicker = new TColorPickerWindow(function() { onColorSelected('back'); });
		m_wndColorPicker.show();
	};
	
	var onBlendClick = function() {
		var wndBlend = new TBlendWindow(m_imgViewer.getCanvas(), foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, setSaveChanges, saveUrl);
		wndBlend.show();
	};
	
	var onBlurClick = function() {
		var wndBlur = new TBlurWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndBlur.show();
	};
	
	var onBrightContraClick = function() {
		var wndBrightContra = new TBrightnessContrastWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndBrightContra.show();
	};
	
	var onCircleClick = function() {
		m_cursorMode = 'circle';
		showLineWidth();
	};
	
	var onColorAdjustClick = function() {
		var wndColorAdjust = new TColorAdjustWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndColorAdjust.show();
	};
	
	var onCropClick = function() {
		var wndCrop = new TCropWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndCrop.show();
	};
	
	var onColorSelected = function(type) {
		var color = m_wndColorPicker.getSelectedColor();
		if (color != null) {
			if (type == 'back') {
				m_brkBackColor.setBackground(color);
				m_backColor = color;
			} else {
				m_brkForeColor.setBackground(color);
				m_foreColor = color;
			}
		}
	};
	
	var onDesaturateClick = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var p = rect.width * rect.height;
		var pix = p * 4, pix1, pix2;

		while (p--) {
			imgData.data[pix -= 4] = imgData.data[pix1 = pix + 1] = imgData.data[pix2 = pix + 2] = (imgData.data[pix] * 0.3 + imgData.data[pix1] * 0.59 + imgData.data[pix2] * 0.11);
		}
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onDrawTextClick = function() {
		var wndDrawText = new TDrawTextWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndDrawText.show();
	};
	
	var onEdgeDetect1Click = function() {
		var wndEdge1 = new TEdgeDetection1Window(m_imgViewer.getCanvas(), setSaveChanges);
		wndEdge1.show();
	};
	
	var onEdgeDetect2Click = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		var dataCopy = imgData.data;
		
		var pixel = rect.width * 4 + 4;
		var hm1 = rect.height - 1;
		var wm1 = rect.width - 1;
		for (var y = 1; y < hm1; ++y) {
			var centerRow = pixel - 4;
			var priorRow = centerRow - rect.width * 4;
			var nextRow = centerRow + rect.width * 4;
				
			var r1 = - dataCopy[priorRow]   - dataCopy[centerRow]   - dataCopy[nextRow];
			var g1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
			var b1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
				
			var rp = dataCopy[priorRow += 2];
			var gp = dataCopy[++priorRow];
			var bp = dataCopy[++priorRow];
				
			var rc = dataCopy[centerRow += 2];
			var gc = dataCopy[++centerRow];
			var bc = dataCopy[++centerRow];
				
			var rn = dataCopy[nextRow += 2];
			var gn = dataCopy[++nextRow];
			var bn = dataCopy[++nextRow];
				
			var r2 = - rp - rc - rn;
			var g2 = - gp - gc - gn;
			var b2 = - bp - bc - bn;
				
			for (var x = 1; x < wm1; ++x) {
				centerRow = pixel + 4;
				priorRow = centerRow - rect.width * 4;
				nextRow = centerRow + rect.width * 4;
					
				var r = 127 + r1 - rp - (rc * -8) - rn;
				var g = 127 + g1 - gp - (gc * -8) - gn;
				var b = 127 + b1 - bp - (bc * -8) - bn;
					
				r1 = r2;
				g1 = g2;
				b1 = b2;
					
				rp = dataCopy[  priorRow];
				gp = dataCopy[++priorRow];
				bp = dataCopy[++priorRow];
					
				rc = dataCopy[  centerRow];
				gc = dataCopy[++centerRow];
				bc = dataCopy[++centerRow];
					
				rn = dataCopy[  nextRow];
				gn = dataCopy[++nextRow];
				bn = dataCopy[++nextRow];
					
				r += (r2 = - rp - rc - rn);
				g += (g2 = - gp - gc - gn);
				b += (b2 = - bp - bc - bn);

				if (r > 255) r = 255;
				if (g > 255) g = 255;
				if (b > 255) b = 255;
				if (r < 0) r = 0;
				if (g < 0) g = 0;
				if (b < 0) b = 0;

				imgData.data[pixel] = r;
				imgData.data[++pixel] = g;
				imgData.data[++pixel] = b;

				pixel += 2;
			}
			pixel += 8;
		}
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onEdgeDetectLaplaceClick = function() {
		var wndEdge = new TEdgeDetectionLaplaceWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndEdge.show();
	};
	
	var onEmbossClick = function() {
		var wndEmboss = new TEmbossWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndEmboss.show();
	};
	
	var onEraserClick = function() {
		m_cursorMode = 'eraser';
		showLineWidth();
	};
	
	var onFillColorClick = function() {
		m_cursorMode = 'fill';
		hideLineWidth();
	};
	
	var onForeColorClick = function() {
		m_wndColorPicker = new TColorPickerWindow(function() { onColorSelected('fore'); });
		m_wndColorPicker.show();
	};
	
	var onGlowClick = function() {
		var wndGlow = new TGlowWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndGlow.show();
	};
	
	var onHistogramClick = function() {
		var wndHist = new THistogramWindow(m_imgViewer.getCanvas());
		wndHist.show();
	};
	
	var onHueSatuLightClick = function() {
		var wndHueSatLight = new THueSaturationLightnessWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndHueSatLight.show();
	};
	
	var onInvertClick = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var p = rect.width * rect.height;

		var pix = p * 4, pix1 = pix + 1, pix2 = pix + 2;

		while (p--) {
			imgData.data[pix -= 4] = 255 - imgData.data[pix];
			imgData.data[pix1 -= 4] = 255 - imgData.data[pix1];
			imgData.data[pix2 -= 4] = 255 - imgData.data[pix2];
		}
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onLightenClick = function() {
	 	var wndLighten = new TLightenWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndLighten.show();
	};
	
	var onLineClick = function() {
		m_cursorMode = 'line';
		showLineWidth();
	};
	
	var onMouseDown = function(e) {
		e = e ? e : window.event;
        
        document.body.style.MozUserSelect = "none";
        document.onselectstart = function () { return false; };
        document.ondragstart = function () { return false; };
        
        if (m_cursorMode != 'default') {
        	m_undoCanvas.setSize(m_imgViewer.getCanvas().getWidth(), m_imgViewer.getCanvas().getHeight());
			m_undoCanvas.setCanvas(m_imgViewer.getCanvas().getElement());
        }
        
        m_imgViewer.getCanvas().addEvent('mousemove', onMouseMove);
        var ctx = m_imgViewer.getCanvas().getContext();
        ctx.lineWidth = parseInt(m_ddlLineWidth.getText());
        var x = parseInt(e.clientX - m_imgViewer.getCanvas().getX(), 10);
        var y = parseInt(e.clientY - m_imgViewer.getCanvas().getY(), 10);
        
        switch(m_cursorMode) {
        	case 'pen': {
        		m_hasChange = true;
        		ctx.beginPath();
        		ctx.moveTo(x, y);
        		ctx.fillStyle = m_foreColor;
        		ctx.fillRect(x, y, 1, 1);
        		break;
        	}
        	case 'eraser': {
        		m_hasChange = true;
        		ctx.beginPath();
        		ctx.moveTo(x, y);
        		ctx.fillStyle = '#FFFFFF';
        		ctx.fillRect(x, y, 1, 1);
        		break;
        	}
        	case 'fill': {
        		ctx.fillStyle = m_foreColor;
        		ctx.fill();
        		break;
        	}
        	default: {
        		ctx.beginPath();
        		m_left = x;
        		m_top = y;
        		break;
        	}
        }
	};
	
	var onMouseMove = function(e) {
		e = e ? e : window.event;
		
		var ctx = m_imgViewer.getCanvas().getContext();
		
		if (m_cursorMode == 'rect' || m_cursorMode == 'circle' || m_cursorMode == 'line') {
        	m_hasChange = true;
        	m_imgViewer.setCanvas(m_undoCanvas);
        	ctx.lineWidth = parseInt(m_ddlLineWidth.getText());
        	ctx.beginPath();
        }
		
		switch(m_cursorMode) {
        	case 'pen': {
        		ctx.lineTo(parseInt(e.clientX - m_imgViewer.getCanvas().getX(), 10), parseInt(e.clientY - m_imgViewer.getCanvas().getY(), 10));
				ctx.strokeStyle = m_foreColor;
				ctx.stroke();
        		break;
        	}
        	case 'eraser': {
        		ctx.lineTo(parseInt(e.clientX - m_imgViewer.getCanvas().getX(), 10), parseInt(e.clientY - m_imgViewer.getCanvas().getY(), 10));
				ctx.strokeStyle = '#FFFFFF';
				ctx.stroke();
        		break;
        	}
        	case 'line': {
        		ctx.moveTo(m_left, m_top);
        		ctx.lineTo(parseInt(e.clientX - m_imgViewer.getCanvas().getX(), 10), parseInt(e.clientY - m_imgViewer.getCanvas().getY(), 10));
				ctx.strokeStyle = m_foreColor;
				ctx.stroke();
        		break;
        	}
        	case 'rect': {
				ctx.strokeStyle = m_foreColor;
				ctx.strokeRect(m_left, m_top, parseInt(e.clientX  - m_imgViewer.getCanvas().getX() - m_left, 10), parseInt(e.clientY  - m_imgViewer.getCanvas().getY() - m_top, 10));
        		break;
        	}
        	case 'circle': {
				ctx.strokeStyle = m_foreColor;
				ctx.arc(m_left, m_top, parseInt(Math.abs(e.clientX  - m_imgViewer.getCanvas().getX() - m_left), 10), 0, 2 * Math.PI);
				ctx.stroke();
        		break;
        	}
        }
	};
	
	var onMouseOut = function() {
		m_imgViewer.getCanvas().setCursor('default');
	};
	
	var onMouseOver = function() {
		switch(m_cursorMode) {
        	case 'pen': {
        		m_imgViewer.getCanvas().setCursor('crosshair');
        		break;
        	}
        	case 'eraser': {
        		m_imgViewer.getCanvas().setCursor('crosshair');
        		break;
        	}
        	default : {
        		m_imgViewer.getCanvas().setCursor('crosshair');
        		break;
        	}
        }
	};
	
	var onMouseUp = function() {
		m_imgViewer.getCanvas().removeEvent('mousemove', onMouseMove);
        document.onselectstart = null;
        document.ondragstart = null;
        document.body.style.MozUserSelect = "all";
        
        if (m_cursorMode != 'default') {
        	m_redoCanvas.setSize(m_imgViewer.getCanvas().getWidth(), m_imgViewer.getCanvas().getHeight());
			m_redoCanvas.setCanvas(m_imgViewer.getCanvas().getElement());
        }
	};
	
	var onMosaicClick = function() {
		var wndMosaic = new TMosaicWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndMosaic.show();
	};
	
	var onNewClick = function() {
		m_imgViewer.addImage('');
	};
	
	var onNoiseClick = function() {
		var wndNoise = new TNoiseWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndNoise.show();
	};
	
	var onPencilClick = function() {
		m_cursorMode = 'pen';
		showLineWidth();
	};
	
	var onPointillizeClick = function() {
		var wndPoint = new TPointillizeWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndPoint.show();  
	};
	
	var onPosterizeClick = function() {
		var wndPosterize = new TPosterizeWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndPosterize.show(); 
	};
	
	var onRectClick = function() {
		m_cursorMode = 'rect';
		showLineWidth();
	};
	
	var onRedoClick = function() {
		m_imgViewer.setCanvas(m_redoCanvas);
	};
	
	var onResetClick = function() {
		m_imgViewer.resetViewer();
	};
	
	var onSaveClick = function() {
		if (m_hasChange) {
			save();
		}
	};
	
	var onSaveError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), TLang.translate('errorSavingImage') + ': ' + text);
	};
	
	var onSaveOk = function() {
		m_hasChange = false;
		TMessageBox.showModal(TLang.translate('imageEditor'), TLang.translate('imageSavedSuccessfully'));
	};
	
	var onSelectedImageChanged = function() {
		if (m_hasChange) {
			TQuestionBox.showModal('Image Editor', 'Do you want to save changes?', save);
			m_hasChange = false;
		}
		var newCanvas = m_imgViewer.getCanvas();
		m_redoCanvas.setSize(newCanvas.getWidth(), newCanvas.getHeight());
		m_redoCanvas.setCanvas(newCanvas.getElement());
		m_undoCanvas.setSize(newCanvas.getWidth(), newCanvas.getHeight());
		m_undoCanvas.setCanvas(newCanvas.getElement());
	};
	
	var onSepia1Click = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;
			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;
			
				var d = imgData.data[offset] * 0.299 + imgData.data[offset + 1] * 0.587 + imgData.data[offset + 2] * 0.114;
				var	r = (d + 39);
				var	g = (d + 14);
				var	b = (d - 36);

				if (r < 0) r = 0; if (r > 255) r = 255;
				if (g < 0) g = 0; if (g > 255) g = 255;
				if (b < 0) b = 0; if (b > 255) b = 255;

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onSepia2Click = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;
			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;
				
				var or = imgData.data[offset];
				var og = imgData.data[offset + 1];
				var ob = imgData.data[offset + 2];
	
				var r = (or * 0.393 + og * 0.769 + ob * 0.189);
				var g = (or * 0.349 + og * 0.686 + ob * 0.168);
				var b = (or * 0.272 + og * 0.534 + ob * 0.131);

				if (r < 0) r = 0; if (r > 255) r = 255;
				if (g < 0) g = 0; if (g > 255) g = 255;
				if (b < 0) b = 0; if (b > 255) b = 255;

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onSharpenClick = function() {
		var wndSharpen = new TSharpenWindow(m_imgViewer.getCanvas(), setSaveChanges);
		wndSharpen.show(); 
	};
	
	var onSolarizeClick = function(canvas, rect) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;
			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;

				var r = imgData.data[offset];
				var g = imgData.data[offset + 1];
				var b = imgData.data[offset + 2];

				if (r > 127) { r = 255 - r; }
				if (g > 127) { g = 255 - g; }
				if (b > 127) { b = 255 - b; }

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		setSaveChanges(original);
	};
	
	var onUndoClick = function() {
		m_imgViewer.setCanvas(m_undoCanvas);
	};
	
	var rotateImage = function(dir, canvas) {
		canvas = (canvas === undefined || canvas == null) ? m_imgViewer.getCanvas() : canvas;
		var original = new TCanvasBrick();
		original.setSize(canvas.getWidth(), canvas.getHeight());
		original.setCanvas(canvas.getElement());
		
		if (m_angel == 0 && dir == 'left') {
			m_angel = 270;
		} else if (m_angel == 270 && dir == 'right') {
			m_angel= 0;
		} else {
			if (dir == 'left') {
				m_angel -= 90;
			} else {
				m_angel += 90;
			}
		}
		
		var rads = m_angel * Math.PI / 180;
		m_imgViewer.resizeViewElement(canvas.getHeight(), canvas.getWidth());
		
		var ctx = canvas.getContext();
		ctx.save();
		ctx.translate(canvas.getWidth() / 2, canvas.getHeight() / 2);
		ctx.rotate(rads);
		
		if (canvas.getImage().href != '') {
			ctx.drawImage(canvas.getImage(), canvas.getWidth() / -2, canvas.getHeight() / -2, canvas.getWidth(), canvas.getHeight());
		} else {
			ctx.drawImage(original.getElement(), canvas.getWidth() / -2, canvas.getHeight() / -2, canvas.getWidth(), canvas.getHeight());
		}
		
		ctx.restore();
		
		setSaveChanges(original);
	};
	
	var save = function() {
		if (saveUrl !== undefined && saveUrl != null) {
			var data = m_imgViewer.getCanvas().getElement().toDataURL();
			if (g_sessionId !== undefined && g_sessionId != null) {
				data += ',' + g_sessionId;
			}
			var src = m_imgViewer.getCanvas().getImage().href;
			
			if (src != '') {
				data = src + ',' + data;
				TAjax.sendRequest(m_this, saveUrl, data, onSaveOk, onSaveError, 'application/upload');
			} else {
				var wndSave = new TSaveImage(data, saveUrl, function() { m_hasChange = false; });
				wndSave.show();
			}
		}
	};
	
	var setSaveChanges = function(originalCanvas) {
		m_hasChange = true;
		var newCanvas = m_imgViewer.getCanvas();
		m_redoCanvas.setSize(newCanvas.getWidth(), newCanvas.getHeight());
		m_redoCanvas.setCanvas(newCanvas.getElement());
		m_undoCanvas.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		m_undoCanvas.setCanvas(originalCanvas.getElement());
	};
	
	var showLineWidth = function() {
		m_ddlLineWidth.show();
		m_txtLineWidth.show();
	};
	
	this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getBackColor = function() {
		return m_backColor;
	};
	
	this.getForeColor = function() {
		return m_foreColor;
	};
	
	this.getHeight = function() {
		m_height = m_mnuMain.getHeight() + m_tbMain.getHeight() + m_imgViewer.getHeight();
		m_height += 35;
		
		return m_height;
	};
	
	this.getWidth = function() {
		var width = Math.max(m_mnuMain.getWidth(), m_tbMain.getWidth() + m_txtLineWidth.getWidth() + m_ddlLineWidth.getWidth() + 10, m_imgViewer.getWidth());
		m_width = width + 20;
		
		return m_width;
	};
	
	this.hide = function() {
		if (m_hasChange) {
			TQuestionBox.showModal(TLang.translate('imageEditor'), TLang.translate('saveChanges') + '?', save);
		}
		
		m_ajaxPanel.hide();
		m_brkBackColor.hide();
		m_brkForeColor.hide();
		m_brkBackground.hide();
		m_mnuMain.hide();
		m_tbMain.hide();
		m_imgViewer.hide();
		hideLineWidth();
	};
	
	this.move = function(x, y) {
		m_brkBackground.move(x, y);
		m_brkBackground.setSize(m_width, m_height);
		
		m_ajaxPanel.setSize(m_width, m_height);
	    m_ajaxPanel.move(x, y);
		
		m_mnuMain.move(x + 10, y + 10);
		m_tbMain.move(x + 10, y + m_mnuMain.getHeight() + 20);
		m_txtLineWidth.move(x + m_tbMain.getWidth() + 15, y + m_mnuMain.getHeight() + (m_tbMain.getHeight() - m_txtLineWidth.getHeight()) / 2 + 20);
		m_ddlLineWidth.move(x + m_tbMain.getWidth() + m_txtLineWidth.getWidth() + 20, y + m_mnuMain.getHeight() + (m_tbMain.getHeight() - m_ddlLineWidth.getHeight()) / 2 + 20);
		m_imgViewer.move(x + 10, y + m_mnuMain.getHeight() + m_tbMain.getHeight() + 25);
		
		var maxWidth = Math.max(m_mnuMain.getWidth(), m_tbMain.getWidth() + m_txtLineWidth.getWidth() + m_ddlLineWidth.getWidth() + 10);
		m_brkBackColor.move(x + 45 + maxWidth, y + 25);
		m_brkBackColor.setSize(30, 30);
		m_brkBackColor.setBackground(m_backColor);
		m_brkBackColor.setTooltip('Back Color');
		m_brkForeColor.move(x + 25 + maxWidth, y + 10);
		m_brkForeColor.setSize(30, 30);
		m_brkForeColor.setBackground(m_foreColor);
		m_brkForeColor.setTooltip('Fore Color');
	};
	
	this.setAjaxOff = function () {
        m_ajaxPanel.hide();
    };

    this.setAjaxOn = function () {
        m_ajaxPanel.show();
    };
	
	this.setBackgroundColor = function(color) {
		m_brkBackground.setBorder(color, 1, 1, 1, 1, 1);
		m_brkBackground.setBackground(color);
		m_imgViewer.setBackgroundColor(color);
	};
	
	this.setOrder = function(order) {
		m_brkBackColor.setOrder(order + 2);
		m_brkForeColor.setOrder(order + 3);
		m_brkBackground.setOrder(order + 1);
		m_ddlLineWidth.setOrder(order + 2);
		m_mnuMain.setOrder(order + 2);
		m_tbMain.setOrder(order + 2);
		m_txtLineWidth.setOrder(order + 2);
		m_imgViewer.setOrder(order + 2);
		
		return m_ajaxPanel.setOrder(order + 4);
	};
	
	this.show = function() {
		if (m_imgViewer.hasCanvas()) {
			m_brkBackColor.show();
			m_brkForeColor.show();
			m_brkBackground.show();
			m_mnuMain.show();
			m_tbMain.show();
			m_imgViewer.show();
		} else {
			TMessageBox.showModal(TLang.translate('imageEditor'), TLang.translate('BrowserNotSupportFeature') + '!');
		}
	};
	
	m_brkBackColor.addEvent('click', onBackColorClick);
	//m_brkBackColor.setBorder('#000000', 1, 1, 1, 1);
	m_brkForeColor.addEvent('click', onForeColorClick);
	//m_brkForeColor.setBorder('#000000', 1, 1, 1, 1);
	
	for (var i = 1; i <= 10; i++) {
		m_ddlLineWidth.add(i, i + 'px');
	}
	m_ddlLineWidth.setSelectedId(1);
	
	m_imgViewer.setSelectionChangedCallback(onSelectedImageChanged);
	
	m_mnuMain.addMenuItem('file', TLang.translate('file'));
	m_mnuMain.addMenuItem('new', TLang.translate('new'), 'file', onNewClick);
	m_mnuMain.addMenuItem('save', TLang.translate('save'), 'file', onSaveClick);
	m_mnuMain.addMenuItem('edit', TLang.translate('edit'));
	m_mnuMain.addMenuItem('undo', TLang.translate('undo'), 'edit', onUndoClick);
	m_mnuMain.addMenuItem('redo', TLang.translate('redo'), 'edit', onRedoClick);
	m_mnuMain.addMenuItem('reset', TLang.translate('reset'), 'edit', onResetClick);
	m_mnuMain.addMenuItem('image', TLang.translate('image'));
	m_mnuMain.addMenuItem('blend', 'Blend', 'image', onBlendClick);
	m_mnuMain.addMenuItem('edgeDetect', 'Edge Detection', 'image');
	m_mnuMain.addMenuItem('edgeDetect1', 'Edge Detection 1', 'edgeDetect', onEdgeDetect1Click);
	m_mnuMain.addMenuItem('edgeDetect2', 'Edge Detection 2', 'edgeDetect', onEdgeDetect2Click);
	m_mnuMain.addMenuItem('edgeDetect3', 'Edge Detection Laplace', 'edgeDetect', onEdgeDetectLaplaceClick);
	m_mnuMain.addMenuItem('rotate', 'Rotation', 'image');
	m_mnuMain.addMenuItem('rotate90r', 'Rotate 90 Right', 'rotate', function() { rotateImage('right'); });
	m_mnuMain.addMenuItem('rotate90l', 'Rotate 90 Left', 'rotate', function() { rotateImage('left'); });
	m_mnuMain.addMenuItem('flipHor', 'Flip Horizontally', 'rotate', function() { flipImage('horizontal'); });
	m_mnuMain.addMenuItem('flipVer', 'Flip Vertically', 'rotate', function() { flipImage('vertical'); });
	m_mnuMain.addMenuItem('crop', 'Crop', 'image', onCropClick);
	m_mnuMain.addMenuItem('adjust', 'Adjustment');
	m_mnuMain.addMenuItem('brightContra', 'Brightness/Contrast', 'adjust', onBrightContraClick);
	m_mnuMain.addMenuItem('colorAdjust', 'Color Adjust', 'adjust', onColorAdjustClick);
	m_mnuMain.addMenuItem('desaturate', 'Desaturate', 'adjust', onDesaturateClick);
	m_mnuMain.addMenuItem('hueSatuLight', 'Hue/Saturation/Lightness', 'adjust', onHueSatuLightClick);
	m_mnuMain.addMenuItem('invert', 'Invert', 'adjust', onInvertClick);
	m_mnuMain.addMenuItem('posterize', 'Posterize', 'adjust', onPosterizeClick);
	m_mnuMain.addMenuItem('filter', 'Filter');
	m_mnuMain.addMenuItem('blur', 'Blur', 'filter', onBlurClick);
	m_mnuMain.addMenuItem('emboss', 'Emboss', 'filter', onEmbossClick);
	m_mnuMain.addMenuItem('glow', 'Glow', 'filter', onGlowClick);
	m_mnuMain.addMenuItem('lighten', 'Lighten', 'filter', onLightenClick); 
	m_mnuMain.addMenuItem('mosaic', 'Mosaic', 'filter', onMosaicClick);
	m_mnuMain.addMenuItem('noise', 'Noise', 'filter', onNoiseClick);
	m_mnuMain.addMenuItem('point', 'Pointillize', 'filter', onPointillizeClick);
	m_mnuMain.addMenuItem('sepia', 'Sepia', 'filter');
	m_mnuMain.addMenuItem('sepia1', 'Sepia 1', 'sepia', onSepia1Click);
	m_mnuMain.addMenuItem('sepia2', 'Sepia 2', 'sepia', onSepia2Click);
	m_mnuMain.addMenuItem('sharpen', 'Sharpen', 'filter', onSharpenClick);
	m_mnuMain.addMenuItem('solarize', 'Solarize', 'filter', onSolarizeClick);
	m_mnuMain.addMenuItem('hist', 'Histogram', null, onHistogramClick);
	
	m_tbMain.add('pen', 'Pencil', 'images/imgeditor/pen.png', 'images/imgeditor/pen_on.png', null, onPencilClick);
	m_tbMain.add('eraser', 'Eraser', 'images/imgeditor/eraser.png', 'images/imgeditor/eraser_on.png', null, onEraserClick);
	m_tbMain.insertSeparator();
	m_tbMain.add('line', 'Line', 'images/imgeditor/line.png', 'images/imgeditor/line_on.png', null, onLineClick);
	m_tbMain.add('rect', 'Rectangle', 'images/imgeditor/rect.png', 'images/imgeditor/rect_on.png', null, onRectClick);
	m_tbMain.add('circle', 'Circle', 'images/imgeditor/circle.png', 'images/imgeditor/circle_on.png', null, onCircleClick);
	m_tbMain.insertSeparator();
	m_tbMain.add('drawtext', 'Draw Text', 'images/imgeditor/drawtext.png', 'images/imgeditor/drawtext_on.png', null, onDrawTextClick);
	
	m_redoCanvas.setSize(m_imgViewer.getCanvas().getWidth(), m_imgViewer.getCanvas().getHeight());
	m_redoCanvas.setCanvas(m_imgViewer.getCanvas().getElement());
	m_undoCanvas.setSize(m_imgViewer.getCanvas().getWidth(), m_imgViewer.getCanvas().getHeight());
	m_undoCanvas.setCanvas(m_imgViewer.getCanvas().getElement());
	
	m_imgViewer.getCanvas().addEvent('mouseover', onMouseOver);
	m_imgViewer.getCanvas().addEvent('mouseout', onMouseOut);
	m_imgViewer.getCanvas().addEvent('mousedown', onMouseDown);
	$$$$(document, 'mouseup', onMouseUp);
};

function TImageEditorWindow(srcArray, foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveUrl) {
	var m_btnClose    = new TButton(TLang.translate('close'));
	var m_imgEditor   = new TImageEditor(srcArray, foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveUrl);
	var m_layCommands = new THorizontalLayout();
	var m_window      = createWindow(TLang.translate('imageEditor'));
	
	var onCloseClick = function() {
		hideModal();
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	m_btnClose.setOnClick(onCloseClick);
	m_layCommands.add(m_btnClose);
	
	m_window.add(m_imgEditor);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TBlendWindow(originalCanvas, foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, callback, saveUrl) {
	var m_brkImgBlend = new TBrick();
	var m_btnBlend    = new TButton('Blend');
	var m_btnCancel   = new TButton(TLang.translate('cancel'));
	var m_btnOk       = new TButton(TLang.translate('ok'));
	var m_btnReset    = new TButton(TLang.translate('reset'));
	var m_btnSelect   = new TButton(TLang.translate('select') + '...');
	var m_canvas      = new TCanvasBrick();
	var m_ddlMode     = new TDropdownList();
	var m_image       = null;
	var m_layCommands = new THorizontalLayout();
	var m_layControls = new TVerticalLayout();
	var m_layForm     = new TFormLayout();
	var m_layMain     = new THorizontalLayout();
	var m_slideAmount = new TSlider('Horizontal', 0, 1, 0.1, 0.5);
	var m_tbAmount    = new TTextBox(60);
	var m_window      = createWindow('Blend');
	var m_wndFinder   = null;
	
	m_brkImgBlend.setSize(200, 100);
	m_brkImgBlend.setBackground('#E0E0E0');
	
	var blend = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		
		var amount = parseFloat(m_slideAmount.getValue());
		var mode = m_ddlMode.getText().toLowerCase();
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var imgData = canvas.getImageData(rect);
		
		var otherCanvas = document.createElement("canvas");
		otherCanvas.width = rect.width;
		otherCanvas.height = rect.height;
		var otherCtx = otherCanvas.getContext("2d");
		otherCtx.drawImage(m_image, 0, 0);
		var dataDesc2 = otherCtx.getImageData(rect.left, rect.top, rect.width, rect.height);
		var data2 = dataDesc2.data;

		var p = rect.width * rect.height;
		var pix = p * 4;
		var pix1, pix2;
		var r1, g1, b1;
		var r2, g2, b2;
		var r3, g3, b3;
		var r4, g4, b4;

		var dataChanged = false;
		
		switch (mode) {
			case "normal" : 
					//while (p--) {
					//	data2[pix-=4] = data2[pix];
					//	data2[pix1=pix+1] = data2[pix1];
					//	data2[pix2=pix+2] = data2[pix2];
					//}
				break;

			case "multiply" : 
				while (p--) {
					data2[pix -= 4] = imgData.data[pix] * data2[pix] / 255;
					data2[pix1 = pix + 1] = imgData.data[pix1] * data2[pix1] / 255;
					data2[pix2 = pix + 2] = imgData.data[pix2] * data2[pix2] / 255;
				}
				dataChanged = true;
				break;

			case "lighten" : 
				while (p--) {
					if ((r1 = imgData.data[pix -= 4]) > data2[pix])
						data2[pix] = r1;
					if ((g1 = imgData.data[pix1 = pix + 1]) > data2[pix1])
						data2[pix1] = g1;
					if ((b1 = imgData.data[pix2 = pix + 2]) > data2[pix2])
						data2[pix2] = b1;
				}
				dataChanged = true;
				break;

			case "darken" : 
				while (p--) {
					if ((r1 = imgData.data[pix -= 4]) < data2[pix])
						data2[pix] = r1;
					if ((g1 = imgData.data[pix1 = pix + 1]) < data2[pix1])
						data2[pix1] = g1;
					if ((b1 = imgData.data[pix2 = pix + 2]) < data2[pix2])
						data2[pix2] = b1;

				}
				dataChanged = true;
				break;

			case "darkercolor" : 
				while (p--) {
					if (((r1 = imgData.data[pix -= 4]) * 0.3 + (g1 = imgData.data[pix1 = pix + 1]) * 0.59 + (b1 = imgData.data[pix2 = pix + 2]) * 0.11) <= (data2[pix] * 0.3 + data2[pix1] * 0.59 + data2[pix2] * 0.11)) {
						data2[pix] = r1;
						data2[pix1] = g1;
						data2[pix2] = b1;
					}
				}
				dataChanged = true;
				break;

			case "lightercolor" : 
				while (p--) {
					if (((r1 = imgData.data[pix -= 4]) * 0.3 + (g1 = imgData.data[pix1 = pix + 1]) * 0.59 + (b1 = imgData.data[pix2 = pix + 2]) * 0.11) > (data2[pix] * 0.3 + data2[pix1] * 0.59 + data2[pix2] * 0.11)) {
						data2[pix] = r1;
						data2[pix1] = g1;
						data2[pix2] = b1;
					}
				}
				dataChanged = true;
				break;

			case "lineardodge" : 
				while (p--) {
					if ((r3 = imgData.data[pix -= 4] + data2[pix]) > 255) {
						data2[pix] = 255;
					} else {
						data2[pix] = r3;
					}
					if ((g3 = imgData.data[pix1 = pix + 1] + data2[pix1]) > 255) {
						data2[pix1] = 255;
					} else {
						data2[pix1] = g3;
					}
					if ((b3 = imgData.data[pix2 = pix + 2] + data2[pix2]) > 255) {
						data2[pix2] = 255;
					} else {
						data2[pix2] = b3;
					}
				}
				dataChanged = true;

				break;

			case "linearburn" : 
				while (p--) {
					if ((r3 = imgData.data[pix -= 4] + data2[pix]) < 255) {
						data2[pix] = 0;
					} else {
						data2[pix] = (r3 - 255);
					}
					if ((g3 = imgData.data[pix1 = pix + 1] + data2[pix1]) < 255) {
						data2[pix1] = 0;
					} else {
						data2[pix1] = (g3 - 255);
					}
					if ((b3 = imgData.data[pix2 = pix + 2] + data2[pix2]) < 255) {
						data2[pix2] = 0;
					} else {
						data2[pix2] = (b3 - 255);
					}
				}
				dataChanged = true;
				break;

			case "difference" : 
				while (p--) {
					if ((r3 = imgData.data[pix -= 4] - data2[pix]) < 0) {
						data2[pix] = -r3;
					} else {
						data2[pix] = r3;
					}
					if ((g3 = imgData.data[pix1 = pix + 1] - data2[pix1]) < 0) {
						data2[pix1] = -g3;
					} else {
						data2[pix1] = g3;
					}
					if ((b3 = imgData.data[pix2 = pix + 2] - data2[pix2]) < 0) {
						data2[pix2] = -b3;
					} else {
						data2[pix2] = b3;
					}
				}
				dataChanged = true;
				break;

			case "screen" : 
				while (p--) {
					data2[pix -= 4] = (255 - ( ((255 - data2[pix]) * (255 - imgData.data[pix])) >> 8));
					data2[pix1 = pix + 1] = (255 - ( ((255 - data2[pix1]) * (255 - imgData.data[pix1])) >> 8));
					data2[pix2 = pix + 2] = (255 - ( ((255 - data2[pix2]) * (255 - imgData.data[pix2])) >> 8));
				}
				dataChanged = true;
				break;

			case "exclusion" : 
				var div_2_255 = 2 / 255;
				while (p--) {
					data2[pix -= 4] = (r1 = imgData.data[pix]) - (r1 * div_2_255 - 1) * data2[pix];
					data2[pix1 = pix + 1] = (g1 = imgData.data[pix1]) - (g1 * div_2_255 - 1) * data2[pix1];
					data2[pix2 = pix + 2] = (b1 = imgData.data[pix2]) - (b1 * div_2_255 - 1) * data2[pix2];
				}
				dataChanged = true;
				break;

			case "overlay" : 
				var div_2_255 = 2 / 255;
				while (p--) {
					if ((r1 = imgData.data[pix -= 4]) < 128) {
						data2[pix] = data2[pix] * r1 * div_2_255;
					} else {
						data2[pix] = 255 - (255 - data2[pix]) * (255 - r1) * div_2_255;
					}

					if ((g1 = imgData.data[pix1 = pix + 1]) < 128) {
						data2[pix1] = data2[pix1] * g1 * div_2_255;
					} else {
						data2[pix1] = 255 - (255 - data2[pix1]) * (255 - g1) * div_2_255;
					}

					if ((b1 = imgData.data[pix2 = pix + 2]) < 128) {
						data2[pix2] = data2[pix2] * b1 * div_2_255;
					} else {
						data2[pix2] = 255 - (255 - data2[pix2]) * (255 - b1) * div_2_255;
					}

				}
				dataChanged = true;
				break;

			case "softlight" : 
				var div_2_255 = 2 / 255;
				while (p--) {
					if ((r1 = imgData.data[pix -= 4]) < 128) {
						data2[pix] = ((data2[pix]>>1) + 64) * r1 * div_2_255;
					} else {
						data2[pix] = 255 - (191 - (data2[pix]>>1)) * (255 - r1) * div_2_255;
					}

					if ((g1 = imgData.data[pix1 = pix + 1]) < 128) {
						data2[pix1] = ((data2[pix1]>>1) + 64) * g1 * div_2_255;
					} else {
						data2[pix1] = 255 - (191 - (data2[pix1]>>1)) * (255 - g1) * div_2_255;
					}

					if ((b1 = imgData.data[pix2 = pix + 2]) < 128) {
						data2[pix2] = ((data2[pix2]>>1) + 64) * b1 * div_2_255;
					} else {
						data2[pix2] = 255 - (191 - (data2[pix2]>>1)) * (255 - b1) * div_2_255;
					}

				}
				dataChanged = true;
				break;

			case "hardlight" : 
				var div_2_255 = 2 / 255;
				while (p--) {
					if ((r2 = data2[pix -= 4]) < 128) {
						data2[pix] = imgData.data[pix] * r2 * div_2_255;
					} else {
						data2[pix] = 255 - (255 - imgData.data[pix]) * (255 - r2) * div_2_255;
					}

					if ((g2 = data2[pix1 = pix + 1]) < 128) {
						data2[pix1] = imgData.data[pix1] * g2 * div_2_255;
					} else {
						data2[pix1] = 255 - (255 - imgData.data[pix1]) * (255 - g2) * div_2_255;
					}

					if ((b2 = data2[pix2 = pix + 2]) < 128) {
						data2[pix2] = imgData.data[pix2] * b2 * div_2_255;
					} else {
						data2[pix2] = 255 - (255 - imgData.data[pix2]) * (255 - b2) * div_2_255;
					}

				}
				dataChanged = true;
				break;

			case "colordodge" : 
				while (p--) {
					if ((r3 = (imgData.data[pix -= 4] << 8) / (255 - (r2 = data2[pix]))) > 255 || r2 == 255) {
						data2[pix] = 255;
					} else {
						data2[pix] = r3;
					}

					if ((g3 = (imgData.data[pix1 = pix + 1] << 8) / (255 - (g2 = data2[pix1]))) > 255 || g2 == 255) {
						data2[pix1] = 255;
					} else {
						data2[pix1] = g3;
					}

					if ((b3 = (imgData.data[pix2 = pix + 2] << 8) / (255 - (b2 = data2[pix2]))) > 255 || b2 == 255) {
						data2[pix2] = 255;
					} else {
						data2[pix2] = b3;
					}
				}
				dataChanged = true;
				break;

			case "colorburn" : 
				while (p--) {
					if ((r3 = 255 - ((255 - imgData.data[pix -= 4]) << 8) / data2[pix]) < 0 || data2[pix] == 0) {
						data2[pix] = 0;
					} else {
						data2[pix] = r3;
					}

					if ((g3 = 255 - ((255 - imgData.data[pix1 = pix + 1]) << 8) / data2[pix1]) < 0 || data2[pix1] == 0) {
						data2[pix1] = 0;
					} else {
						data2[pix1] = g3;
					}

					if ((b3 = 255 - ((255 - imgData.data[pix2 = pix + 2]) << 8) / data2[pix2]) < 0 || data2[pix2] == 0) {
						data2[pix2] = 0;
					} else {
						data2[pix2] = b3;
					}
				}
				dataChanged = true;
				break;

			case "linearlight" : 
				while (p--) {
					if ( ((r3 = 2 * (r2 = data2[pix -= 4]) + imgData.data[pix] - 256) < 0) || (r2 < 128 && r3 < 0)) {
						data2[pix] = 0;
					} else {
						if (r3 > 255) {
							data2[pix] = 255;
						} else {
							data2[pix] = r3;
						}
					}
					if ( ((g3 = 2 * (g2 = data2[pix1 = pix + 1]) + imgData.data[pix1] - 256) < 0) || (g2 < 128 && g3 < 0)) {
						data2[pix1] = 0;
					} else {
						if (g3 > 255) {
							data2[pix1] = 255;
						} else {
							data2[pix1] = g3;
						}
					}
					if ( ((b3 = 2 * (b2 = data2[pix2 = pix + 2]) + imgData.data[pix2] - 256) < 0) || (b2 < 128 && b3 < 0)) {
						data2[pix2] = 0;
					} else {
						if (b3 > 255) {
							data2[pix2] = 255;
						} else {
							data2[pix2] = b3;
						}
					}
				}
				dataChanged = true;
				break;

			case "vividlight" : 
				while (p--) {
					if ((r2 = data2[pix -= 4]) < 128) {
						if (r2) {
							if ((r3 = 255 - ((255 - imgData.data[pix]) << 8) / (2 * r2)) < 0) {
								data2[pix] = 0;
							} else {
								data2[pix] = r3;
							}
						} else {
							data2[pix] = 0;
						}
					} else if ((r3 = (r4 = 2 * r2 - 256)) < 255) {
						if ((r3 = (imgData.data[pix] << 8) / (255 - r4)) > 255) {
							data2[pix] = 255;
						} else {
							data2[pix] = r3;
						}
					} else {
						if (r3 < 0) {
							data2[pix] = 0;
						} else {
							data2[pix] = r3;
						}
					}

					if ((g2 = data2[pix1 = pix + 1]) < 128) {
						if (g2) {
							if ((g3 = 255 - ((255 - imgData.data[pix1]) << 8) / (2 * g2)) < 0) {
								data2[pix1] = 0;
							} else {
								data2[pix1] = g3;
							}
						} else {
							data2[pix1] = 0;
						}
					} else if ((g3 = (g4 = 2 * g2 - 256)) < 255) {
						if ((g3 = (imgData.data[pix1] << 8) / (255 - g4)) > 255) {
							data2[pix1] = 255;
						} else {
							data2[pix1] = g3;
						}
					} else {
						if (g3 < 0) {
							data2[pix1] = 0;
						} else {
							data2[pix1] = g3;
						}
					}

					if ((b2 = data2[pix2 = pix + 2]) < 128) {
						if (b2) {
							if ((b3 = 255 - ((255 - imgData.data[pix2]) << 8) / (2 * b2)) < 0) {
								data2[pix2] = 0;
							} else {
								data2[pix2] = b3;
							}
						} else {
							data2[pix2] = 0;
						}
					} else if ((b3 = (b4 = 2 * b2 - 256)) < 255) {
						if ((b3 = (imgData.data[pix2] << 8) / (255 - b4)) > 255) {
							data2[pix2] = 255;
						} else {
							data2[pix2] = b3;
						}
					} else {
						if (b3 < 0) {
							data2[pix2] = 0;
						} else {
							data2[pix2] = b3;
						}
					}
				}
				dataChanged = true;
				break;

			case "pinlight" : 
				while (p--) {
					if ((r2 = data2[pix -= 4]) < 128) {
						if ((r1 = imgData.data[pix]) < (r4 = 2 * r2)) {
							data2[pix] = r1;
						} else {
							data2[pix] = r4;
						}
					} else {
						if ((r1 = imgData.data[pix]) > (r4 = 2 * r2 - 256)) {
							data2[pix] = r1;
						} else {
							data2[pix] = r4;
						}
					}

					if ((g2 = data2[pix1 = pix + 1]) < 128) {
						if ((g1 = imgData.data[pix1]) < (g4 = 2 * g2)) { 
							data2[pix1] = g1;
						} else {
							data2[pix1] = g4;
						}
					} else {
						if ((g1 = imgData.data[pix1]) > (g4 = 2 * g2 - 256)) {
							data2[pix1] = g1;
						} else {
							data2[pix1] = g4;
						}
					}

					if ((r2 = data2[pix2 = pix + 2]) < 128) {
						if ((r1 = imgData.data[pix2]) < (r4 = 2 * r2)) {
							data2[pix2] = r1;
						} else {
							data2[pix2] = r4;
						}
					} else {
						if ((r1 = imgData.data[pix2]) > (r4 = 2 * r2 - 256)) {
							data2[pix2] = r1;
						} else {
							data2[pix2] = r4;
						}
					}
				}
				dataChanged = true;
				break;

			case "hardmix" : 
				while (p--) {
					if ((r2 = data2[pix -= 4]) < 128) {
						if (255 - ((255 - imgData.data[pix]) << 8) / (2 * r2) < 128 || r2 == 0) {
							data2[pix] = 0;
						} else {
							data2[pix] = 255;
						}
					} else if ((r4 = 2 * r2 - 256) < 255 && (imgData.data[pix] << 8) / (255 - r4) < 128) {
						data2[pix] = 0;
					} else {
						data2[pix] = 255;
					}

					if ((g2 = data2[pix1 = pix + 1]) < 128) {
						if (255 - ((255 - imgData.data[pix1]) << 8) / (2 * g2) < 128 || g2 == 0) {
							data2[pix1] = 0;
						} else {
							data2[pix1] = 255;
						}
					} else if ((g4 = 2 * g2 - 256) < 255 && (imgData.data[pix1] << 8) / (255 - g4) < 128) {
						data2[pix1] = 0;
					} else {
						data2[pix1] = 255;
					}

					if ((b2 = data2[pix2 = pix + 2]) < 128) {
						if (255 - ((255 - imgData.data[pix2]) << 8) / (2 * b2) < 128 || b2 == 0) {
							data2[pix2] = 0;
						} else {
							data2[pix2] = 255;
						}
					} else if ((b4 = 2 * b2 - 256) < 255 && (imgData.data[pix2] << 8) / (255 - b4) < 128) {
						data2[pix2] = 0;
					} else {
						data2[pix2] = 255;
					}
				}
				dataChanged = true;
				break;
			}

			if (dataChanged) { otherCtx.putImageData(dataDesc2, 0, 0); }

			if (amount != 1) {
				var p = rect.width * rect.height;
				var amount1 = 1 - amount;
				while (p--) {
					var pix = p * 4;
					var r = (imgData.data[pix] * amount1 + data2[pix] * amount) >> 0;
					var g = (imgData.data[pix + 1] * amount1 + data2[pix + 1] * amount) >> 0;
					var b = (imgData.data[pix + 2] * amount1 + data2[pix + 2] * amount) >> 0;

					imgData.data[pix] = r;
					imgData.data[pix + 1] = g;
					imgData.data[pix + 2] = b;
				}
				canvas.putImageData(imgData);
				if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
			} else {
				var ctx = canvas.getContext();
				ctx.save();
				ctx.globalAlpha = amount;
				ctx.drawImage(otherCanvas, 0, 0, rect.width, rect.height, rect.left, rect.top, rect.width, rect.height);
				ctx.globalAlpha = 1;
				ctx.restore();
			}
		
		return true;
	};
	
	var onBlendClick = function() {
		blend(m_canvas, null, false);
	};
	
	var onBlendImageSelected = function() {
		var sItems = m_wndFinder.getSelectedItems();
		if(sItems.length) {
			m_image = new Image();
			m_image.src = sItems[0].url;
			var size = calculateFitImageSize(sItems[0].url, 200, 100);
			m_brkImgBlend.setBackgroundImage(sItems[0].url);
			m_brkImgBlend.setSize(size.width, size.height);
			m_brkImgBlend.getElement().style.backgroundSize = 'contain';
			m_btnBlend.enable();
			m_btnOk.enable();
			m_btnReset.enable();
		}
		
		m_wndFinder.hide();
		m_wndFinder = null;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		blend(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onResetClick = function() {
		m_canvas.setCanvas(originalCanvas.getElement());
	};
	
	var onSelectClick = function() {
		m_wndFinder = new TFinderWindow(foldersUrl, imagesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, null, saveUrl);
		m_wndFinder.setOnFileDblClick(onBlendImageSelected);
        m_wndFinder.show();
	};
	
	var onSliderChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 500, 250);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnBlend.setOnClick(onBlendClick);
	m_btnBlend.disable();
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnOk.disable();
	m_btnReset.setOnClick(onResetClick);
	m_btnReset.disable();
	m_btnSelect.setOnClick(onSelectClick);
	m_ddlMode.add(0, 'Normal');
	m_ddlMode.add(1, 'Multiply');
	m_ddlMode.add(2, 'Lighten');
	m_ddlMode.add(3, 'Darken');
	m_ddlMode.add(4, 'Darker Color');
	m_ddlMode.add(5, 'Lighter Color');
	m_ddlMode.add(6, 'Difference');
	m_ddlMode.add(7, 'Screen');
	m_ddlMode.add(8, 'Exclusion');
	m_ddlMode.add(9, 'Overlay');
	m_ddlMode.add(10, 'Soft Light');
	m_ddlMode.add(11, 'Hard Light');
	m_ddlMode.add(12, 'Color Dodge');
	m_ddlMode.add(13, 'Color Burn');
	m_ddlMode.add(14, 'Linear Dodge');
	m_ddlMode.add(15, 'Linear Burn');
	m_ddlMode.add(16, 'Linear Light');
	m_ddlMode.add(17, 'Vivid Light');
	m_ddlMode.add(18, 'Pin Light');
	m_ddlMode.add(19, 'Hard Mix');
	m_ddlMode.setSelectedId(0);
	m_slideAmount.setOnChangeCallback(onSliderChanged);
	m_tbAmount.setValue('0.5');
	m_tbAmount.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layForm.add(new TText(''), m_slideAmount);
	m_layForm.add(new TText('Mode:'), m_ddlMode);
	m_layForm.add(new TText('Blend Image:'), m_btnSelect);
	m_layControls.add(m_layForm);
	m_layControls.add(m_brkImgBlend);
	m_layControls.add(m_btnBlend);
	m_layControls.add(m_btnReset);
	m_layMain.add(m_layControls);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TBlurWindow(originalCanvas, callback) {
	var m_btnCancel   = new TButton(TLang.translate('cancel'));
	var m_btnOk       = new TButton(TLang.translate('ok'));
	var m_canvas      = new TCanvasBrick();
	var m_layCommands = new THorizontalLayout();
	var m_layControls = new TVerticalLayout();
	var m_layForm     = new TFormLayout();
	var m_layMain     = new THorizontalLayout();
	var m_slideAmount = new TSlider('Horizontal', 0, 4, 0.1);
	var m_tbAmount    = new TTextBox(60);
	var m_window      = createWindow('Blur');
	
	var blur = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		
		var amount = parseFloat(m_slideAmount.getValue());
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var ctx = canvas.getContext();
		ctx.save();
		ctx.beginPath();
		ctx.rect(rect.left, rect.top, rect.width, rect.height);
		ctx.clip();

		var scale = 2;
		var smallWidth = Math.round(rect.width / scale);
		var smallHeight = Math.round(rect.height / scale);
		
		var copy = document.createElement("canvas");
		copy.width = smallWidth;
		copy.height = smallHeight;

		var steps = Math.round(amount * 20);
		var copyCtx = copy.getContext("2d");
		
		for (var i = 0; i < steps; i++) {
			var scaledWidth = Math.max(1, Math.round(smallWidth - i));
			var scaledHeight = Math.max(1, Math.round(smallHeight - i));
	
			copyCtx.clearRect(0, 0, smallWidth, smallHeight);
	
			copyCtx.drawImage(canvas.getElement(), 0, 0, rect.width, rect.height, 0, 0, scaledWidth, scaledHeight); 
	
			
			ctx.drawImage(copy, 0, 0, scaledWidth, scaledHeight, 0, 0, rect.width, rect.height);
		}

		ctx.restore();
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		blur(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onSliderChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
		blur(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideAmount.setOnChangeCallback(onSliderChanged);
	m_tbAmount.setValue('0');
	m_tbAmount.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layControls.add(m_layForm);
	m_layControls.add(m_slideAmount);
	m_layMain.add(m_layControls);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TBrightnessContrastWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_chkLegacy     = new TCheckBox('');
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideBright   = new TSlider('Horizontal', -150, 150, 3, 0);
	var m_slideContrast = new TSlider('Horizontal', -1, 3, 0.1, 0);
	var m_tbBright      = new TTextBox(60);
	var m_tbContrast    = new TTextBox(60);
	var m_window        = createWindow('Brightness / Contrast');
	
	var brightContra = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var brightness = m_slideBright.getValue();
		var contrast = parseFloat(m_slideContrast.getValue() + 1);
		var legacy = m_chkLegacy.isChecked();

		var imgData = canvas.getImageData(rect);
		var brightMul = 0;
		
		if (legacy) {
			brightness = Math.min(150, Math.max(-150, brightness));
		} else {
			brightMul = 1 + Math.min(150, Math.max(-150, brightness)) / 150;
		}
		
		var p = rect.width * rect.height;
		var pix = p * 4, pix1, pix2;

		var mul, add;
		if (contrast != 1) {
			if (legacy) {
				mul = contrast;
				add = (brightness - 128) * contrast + 128;
			} else {
				mul = brightMul * contrast;
				add = - contrast * 128 + 128;
			}
		} else {  
			if (legacy) {
				mul = 1;
				add = brightness;
			} else {
				mul = brightMul;
				add = 0;
			}
		}
		var r, g, b;
		while (p--) {
			if ((r = imgData.data[pix -= 4] * mul + add) > 255 ) {
				imgData.data[pix] = 255;
			} else if (r < 0) {
				imgData.data[pix] = 0;
			} else {
 				imgData.data[pix] = r;
 			}

			if ((g = imgData.data[pix1 = pix + 1] * mul + add) > 255 ) {
				imgData.data[pix1] = 255;
			} else if (g < 0) {
				imgData.data[pix1] = 0;
			} else {
				imgData.data[pix1] = g;
			}

			if ((b = imgData.data[pix2 = pix + 2] * mul + add) > 255 ) {
				imgData.data[pix2] = 255;
			} else if (b < 0) {
				imgData.data[pix2] = 0;
			} else {
				imgData.data[pix2] = b;
			}
		}
			
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onLegacyStateChanged = function() {
		brightContra(m_canvas, null, true);
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		brightContra(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onBrightnessChanged = function() {
		m_tbBright.setValue(m_slideBright.getValue());
		brightContra(m_canvas, null, true);
	};
	
	var onContrastChanged = function() {
		m_tbContrast.setValue(m_slideContrast.getValue());
		brightContra(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 400, 200);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_chkLegacy.setOnChange(onLegacyStateChanged);
	m_slideBright.setOnChangeCallback(onBrightnessChanged);
	m_slideContrast.setOnChangeCallback(onContrastChanged);
	m_tbBright.setValue('0');
	m_tbBright.disable();
	m_tbContrast.setValue('0');
	m_tbContrast.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Brightness:'), m_tbBright);
	m_layForm.add(new TText(''), m_slideBright);
	m_layForm.add(new TText('Contrast:'), m_tbContrast);
	m_layForm.add(new TText(''), m_slideContrast);
	m_layForm.add(new TText('Use Legacy:'), m_chkLegacy);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TColorAdjustWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideBlue     = new TSlider('Horizontal', -1, 1, 0.01, 0);
	var m_slideGreen    = new TSlider('Horizontal', -1, 1, 0.01, 0);
	var m_slideRed      = new TSlider('Horizontal', -1, 1, 0.01, 0);
	var m_tbBlue        = new TTextBox(60);
	var m_tbGreen       = new TTextBox(60);
	var m_tbRed         = new TTextBox(60);
	var m_window        = createWindow('Color Adjustment');
	
	var colorAdjust = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var blue = Math.round(parseFloat(m_slideBlue.getValue()) * 255);
		var green = Math.round(parseFloat(m_slideGreen.getValue()) * 255);
		var red = Math.round(parseFloat(m_slideRed.getValue()) * 255);

		var imgData = canvas.getImageData(rect);
		
		var p = rect.width * rect.height;
		var pix = p * 4, pix1, pix2;

		var r, g, b;
		while (p--) {
			pix -= 4;

			if (red) {
				if ((r = imgData.data[pix] + red) < 0 ) { 
					imgData.data[pix] = 0;
				} else if (r > 255 ) {
					imgData.data[pix] = 255;
				} else {
					imgData.data[pix] = r;
				}
			}

			if (green) {
				if ((g = imgData.data[pix1 = pix + 1] + green) < 0 ) {
					imgData.data[pix1] = 0;
				} else if (g > 255 ) {
					imgData.data[pix1] = 255;
				} else {
					imgData.data[pix1] = g;
				}
			}

			if (blue) {
				if ((b = imgData.data[pix2 = pix + 2] + blue) < 0 ) {
					imgData.data[pix2] = 0;
				} else if (b > 255 ) {
					imgData.data[pix2] = 255;
				} else {
					imgData.data[pix2] = b;
				}
			}
		}
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onBlueChanged = function() {
		m_tbBlue.setValue(m_slideBlue.getValue());
		colorAdjust(m_canvas, null, true);
	};
	
	var onGreenChanged = function() {
		m_tbGreen.setValue(m_slideGreen.getValue());
		colorAdjust(m_canvas, null, true);
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		colorAdjust(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onRedChanged = function() {
		m_tbRed.setValue(m_slideRed.getValue());
		colorAdjust(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 400, 200);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideBlue.setOnChangeCallback(onBlueChanged);
	m_slideGreen.setOnChangeCallback(onGreenChanged);
	m_slideRed.setOnChangeCallback(onRedChanged);
	m_tbBlue.setValue('0');
	m_tbBlue.disable();
	m_tbGreen.setValue('0');
	m_tbGreen.disable();
	m_tbRed.setValue('0');
	m_tbRed.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Red:'), m_tbRed);
	m_layForm.add(new TText(''), m_slideRed);
	m_layForm.add(new TText('Green:'), m_tbGreen);
	m_layForm.add(new TText(''), m_slideGreen);
	m_layForm.add(new TText('Blue:'), m_tbBlue);
	m_layForm.add(new TText(''), m_slideBlue);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TColorPickerWindow(callback) {
	var m_btnReturn   = new TButton(TLang.translate('cancel'));
	var m_btnOk       = new TButton(TLang.translate('ok'));
	var m_callback    = (callback === undefined || callback == null) ? null : callback;
	var m_color       = null;
	var m_colorPicker = new TColorPicker();
	var m_layCommands = new THorizontalLayout();
	var m_window      = createWindow(TLang.translate('selectColor'));
	
	var onReturnClick = function() {
        m_color = null;
        hideModal();
    };
	
	var onOkClick = function() {
		hideModal();
		
		if (m_callback != null) {
			m_callback();
		}
	};
	
    var onSelectColor = function() {
    	m_color = m_colorPicker.getSelectedColor();
    };
    
    this.getSelectedColor = function() {
    	return m_color;
    };
    
    this.show = function() {
        showModal(m_window);
    };
	
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_colorPicker.setOnSelectColorCallback(onSelectColor);
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_window.add(m_colorPicker);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TCropWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnCrop       = new TButton('Crop');
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_btnReset      = new TButton(TLang.translate('reset'));
	var m_canvas        = new TCanvasBrick();
	var m_height        = 0;
	var m_layCommands   = new THorizontalLayout();
	var m_layControls   = new TVerticalLayout();
	var m_layMain       = new THorizontalLayout();
	var m_left          = 0;
	var m_top           = 0;
	var m_width         = 0;
	var m_window        = createWindow('Crop Image');
	
	var crop = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		if (m_height < 1) { m_height = 1; }
		if (m_width < 1) { m_width = 1; }
		
		var copy = document.createElement("canvas");
		copy.width = rect.width;
		copy.height = rect.height;
		copy.getContext("2d").drawImage(canvas.getElement(), 0, 0);

		canvas.setWidth(m_width);
		canvas.setHeight(m_height);
		var ctx = canvas.getContext();
		ctx.clearRect(0, 0, m_width, m_height);

		ctx.drawImage(copy, m_left, m_top, m_width, m_height, 0, 0, m_width, m_height);
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onCropClick = function() {
		crop(m_canvas, null, false);
	};
	
	var onMouseDown = function(e) {
		e = e ? e : window.event;
		m_left = parseInt(e.clientX - m_canvas.getX(), 10);
		m_top = parseInt(e.clientY - m_canvas.getY(), 10);
        m_canvas.addEvent('mousemove', onMouseMove);
        document.body.style.MozUserSelect = "none";
        document.onselectstart = function () { return false; };
        document.ondragstart = function () { return false; };
	};
	
	var onMouseMove = function(e) {
		m_canvas.setCanvas(originalCanvas.getElement());
		e = e ? e : window.event;
		var ctx = m_canvas.getContext();
		m_height = parseInt(e.clientY - m_canvas.getY() - m_top, 10);
		m_width = parseInt(e.clientX  - m_canvas.getX() - m_left, 10);
		ctx.strokeRect(m_left, m_top, m_width, m_height);
	};
	
	var onMouseOut = function() {
		m_canvas.setCursor('default');
	};
	
	var onMouseOver = function() {
		m_canvas.setCursor('crosshair');
	};
	
	var onMouseUp = function() {
		m_canvas.removeEvent('mousemove', onMouseMove);
        document.onselectstart = null;
        document.ondragstart = null;
        document.body.style.MozUserSelect = "all";
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		crop(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onResetClick = function() {
		m_canvas.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		m_canvas.setCanvas(originalCanvas.getElement());
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 m_canvas.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_canvas.addEvent('mouseover', onMouseOver);
	m_canvas.addEvent('mouseout', onMouseOut);
	m_canvas.addEvent('mousedown', onMouseDown);
	$$$$(document, 'mouseup', onMouseUp);
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnCrop.setOnClick(onCropClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnReset.setOnClick(onResetClick);
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layControls.add(m_btnCrop);
	m_layControls.add(m_btnReset);
	m_layMain.add(m_layControls);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TDrawTextWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_editor        = new TLightTextEditor(300, originalCanvas.getHeight());
	var m_layCommands   = new THorizontalLayout();
	var m_layMain       = new THorizontalLayout();
	var m_left          = 0;
	var m_top           = 0;
	var m_window        = createWindow('Draw Text');
	
	var drawText = function(canvas, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		
		var ctx = canvas.getContext();
		var styles = m_editor.getStyles();
		var font = '';
		if (styles.italic) { font += 'italic '; }
		if (styles.bold) { font += 'bold '; }
		font += TSizeConverter.convertFontSizeToPX(styles.fontSize) + ' ';
		font += styles.fontFamily;
		
		ctx.fillStyle = styles.color;
		ctx.font = font;
		ctx.fillText(m_editor.getText(), m_left, m_top);
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onMouseClick = function(e) {
		e = e ? e : window.event;
		m_left = parseInt(e.clientX - m_canvas.getX(), 10);
		m_top = parseInt(e.clientY - m_canvas.getY(), 10);
 		if (m_editor.getText() != '') {
 			drawText(m_canvas, true);
 		} else {
 			m_canvas.setCanvas(originalCanvas.getElement());
 		}
	};
	
	var onMouseOut = function() {
		m_canvas.setCursor('default');
	};
	
	var onMouseOver = function() {
		m_canvas.setCursor('text');
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		drawText(originalCanvas, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 m_canvas.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_canvas.addEvent('mouseover', onMouseOver);
	m_canvas.addEvent('mouseout', onMouseOut);
	m_canvas.addEvent('click', onMouseClick);
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layMain.add(m_editor);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TEdgeDetection1Window(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_chkInvert     = new TCheckBox('Invert');
	var m_chkMono       = new TCheckBox('Mono');
	var m_layCommands   = new THorizontalLayout();
	var m_layControls   = new TVerticalLayout();
	var m_layMain       = new THorizontalLayout();
	var m_window        = createWindow('Edge Detection 1');
	
	var edgeDetect = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var mono = m_chkMono.isChecked();
		var invert =  m_chkInvert.isChecked();
		var imgData = canvas.getImageData(rect);
		var dataCopy = imgData.data;
		
		var c = - 1/8;
		var kernel = [
			[c, 	c, 	c],
			[c, 	1, 	c],
			[c, 	c, 	c]
		];

		weight = 1/c;

		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;

			var nextY = (y == rect.height) ? y - 1 : y;
			var prevY = (y == 1) ? 0 : y - 2;

			var offsetYPrev = prevY * rect.width * 4;
			var offsetYNext = nextY * rect.width * 4;

			var x = rect.width;
			do {
				var offset = offsetY + (x * 4 - 4);

				var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x - 2) * 4;
				var offsetNext = offsetYNext + ((x == rect.width) ? x - 1 : x) * 4;
	
				var r = ((dataCopy[offsetPrev - 4] + dataCopy[offsetPrev] + dataCopy[offsetPrev + 4] + dataCopy[offset - 4] + dataCopy[offset + 4] + dataCopy[offsetNext - 4] + dataCopy[offsetNext] + dataCopy[offsetNext + 4]) * c + dataCopy[offset]) * weight;
				var g = ((dataCopy[offsetPrev - 3] + dataCopy[offsetPrev + 1] + dataCopy[offsetPrev + 5] + dataCopy[offset - 3] + dataCopy[offset + 5] + dataCopy[offsetNext - 3] + dataCopy[offsetNext + 1] + dataCopy[offsetNext + 5]) * c + dataCopy[offset + 1]) * weight;
				var b = ((dataCopy[offsetPrev - 2] + dataCopy[offsetPrev + 2] + dataCopy[offsetPrev + 6] + dataCopy[offset - 2] + dataCopy[offset + 6] + dataCopy[offsetNext - 2] + dataCopy[offsetNext + 2] + dataCopy[offsetNext + 6]) * c + dataCopy[offset + 2]) * weight;

				if (mono) {
					var brightness = (r * 0.3 + g * 0.59 + b * 0.11);
					if (invert) { brightness = 255 - brightness; }
					if (brightness < 0 ) { brightness = 0; }
					if (brightness > 255 ) { brightness = 255; }
					r = g = b = brightness;
				} else {
					if (invert) {
						r = 255 - r;
						g = 255 - g;
						b = 255 - b;
					}
					if (r < 0 ) r = 0;
					if (g < 0 ) g = 0;
					if (b < 0 ) b = 0;
					if (r > 255 ) r = 255;
					if (g > 255 ) g = 255;
					if (b > 255 ) b = 255;
				}

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onInvertStateChanged = function() {
		edgeDetect(m_canvas, null, true);
	};
	
	var onMonoStateChanged = function() {
		edgeDetect(m_canvas, null, true);
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		edgeDetect(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	this.show = function() {
		showModal(m_window);
		edgeDetect(m_canvas, null, false);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_chkInvert.setOnChange(onInvertStateChanged);
	m_chkMono.setOnChange(onMonoStateChanged);
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layControls.add(m_chkInvert);
	m_layControls.add(m_chkMono);
	m_layMain.add(m_layControls);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TEdgeDetectionLaplaceWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_chkInvert     = new TCheckBox('');
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideGray     = new TSlider('Horizontal', 0, 255, 3);
	var m_slideStrength = new TSlider('Horizontal', 0, 5, 0.1);
	var m_tbGray        = new TTextBox(60);
	var m_tbStrength    = new TTextBox(60);
	var m_window        = createWindow('Edge Detection Laplace');
	
	var edgeDetect = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		var strength = 1.0;
		var contrast = parseFloat(m_slideStrength.getValue()) * -1;
		var greyLevel = m_slideGray.getValue();
		var invert =  m_chkInvert.isChecked();
		var imgData = canvas.getImageData(rect);
		var dataCopy = imgData.data;
		
		var kernel = [
			[-1, 	-1, 	-1],
			[-1, 	8, 	-1],
			[-1, 	-1, 	-1]
		];

		var weight = 1/8;

		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;

			var nextY = (y == rect.height) ? y - 1 : y;
			var prevY = (y == 1) ? 0 : y - 2;

			var offsetYPrev = prevY * rect.width * 4;
			var offsetYNext = nextY * rect.width * 4;

			var x = rect.width;
			do {
				var offset = offsetY + (x * 4 - 4);

				var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x - 2) * 4;
				var offsetNext = offsetYNext + ((x == rect.width) ? x - 1 : x) * 4;
	
				var r = ((-dataCopy[offsetPrev - 4] - dataCopy[offsetPrev] - dataCopy[offsetPrev + 4] - dataCopy[offset - 4] - dataCopy[offset + 4] - dataCopy[offsetNext - 4] - dataCopy[offsetNext] - dataCopy[offsetNext + 4]) + dataCopy[offset] * 8) * weight;
	
				var g = ((-dataCopy[offsetPrev - 3] - dataCopy[offsetPrev + 1] - dataCopy[offsetPrev + 5] - dataCopy[offset - 3] - dataCopy[offset + 5] - dataCopy[offsetNext - 3] - dataCopy[offsetNext + 1] - dataCopy[offsetNext + 5]) + dataCopy[offset + 1] * 8) * weight;
	
				var b = ((-dataCopy[offsetPrev - 2] - dataCopy[offsetPrev + 2] - dataCopy[offsetPrev + 6] - dataCopy[offset - 2] - dataCopy[offset + 6] - dataCopy[offsetNext - 2] - dataCopy[offsetNext + 2] - dataCopy[offsetNext + 6]) + dataCopy[offset + 2] * 8) * weight;

				var brightness = ((r + g + b) / 3) + greyLevel;

				if (contrast != 0) {
					if (brightness > 127) {
						brightness += ((brightness + 1) - 128) * contrast;
					} else if (brightness < 127) {
						brightness -= (brightness + 1) * contrast;
					}
				}
				if (invert) {
					brightness = 255 - brightness;
				}
				if (brightness < 0 ) { brightness = 0; }
				if (brightness > 255 ) { brightness = 255; }

				imgData.data[offset] = imgData.data[offset + 1] = imgData.data[offset + 2] = brightness;

			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onGrayChanged = function() {
		m_tbGray.setValue(m_slideGray.getValue());
		edgeDetect(m_canvas, null, true);
	};
	
	var onInvertStateChanged = function() {
		edgeDetect(m_canvas, null, true);
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		edgeDetect(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onStrengthChanged = function() {
		m_tbStrength.setValue(m_slideStrength.getValue());
		edgeDetect(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_chkInvert.setOnChange(onInvertStateChanged);
	m_slideGray.setOnChangeCallback(onGrayChanged);
	m_slideStrength.setOnChangeCallback(onStrengthChanged);
	m_tbGray.setValue('0');
	m_tbGray.disable();
	m_tbStrength.setValue('0');
	m_tbStrength.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Gray Level:'), m_tbGray);
	m_layForm.add(new TText(''), m_slideGray);
	m_layForm.add(new TText('Edge Strength:'), m_tbStrength);
	m_layForm.add(new TText(''), m_slideStrength);
	m_layForm.add(new TText('Invert:'), m_chkInvert);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TEmbossWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_chkBlend      = new TCheckBox('');
	var m_ddlDirection  = new TDropdownList();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideGray     = new TSlider('Horizontal', 0, 255, 1);
	var m_slideStrength = new TSlider('Horizontal', 0, 10, 0.1);
	var m_tbGray        = new TTextBox(60);
	var m_tbStrength    = new TTextBox(60);
	var m_window        = createWindow('Emboss');
	
	var emboss = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var strength = parseFloat(m_slideStrength.getValue());
		var greyLevel = m_slideGray.getValue();
		var direction = m_ddlDirection.getText();
		var blend = m_chkBlend.isChecked();

		var dirY = 0;
		var dirX = 0;

		switch (direction.toLowerCase()) {
			case "top left":		
				dirY = -1;
				dirX = -1;
				break;
			case "top":			
				dirY = -1;
				dirX = 0;
				break;
			case "top right":			
				dirY = -1;
				dirX = 1;
				break;
			case "right":			
				dirY = 0;
				dirX = 1;
				break;
			case "bottom right":			
				dirY = 1;
				dirX = 1;
				break;
			case "bottom":			
				dirY = 1;
				dirX = 0;
				break;
			case "bottom left":		
				dirY = 1;
				dirX = -1;
				break;
			case "left":	
				dirY = 0;
				dirX = -1;
				break;
		}

		var imgData = canvas.getImageData(rect);
		var dataCopy = imgData.data;

		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;

			var otherY = dirY;
			if (y + otherY < 1 || y + otherY > rect.height) otherY = 0;

			var offsetYOther = (y - 1 + otherY) * rect.width * 4;

			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;

				var otherX = dirX;
				if (x + otherX < 1 || x + otherX > rect.width) otherX = 0;

				var offsetOther = offsetYOther + (x - 1 + otherX) * 4;

				var dR = dataCopy[offset] - dataCopy[offsetOther];
				var dG = dataCopy[offset + 1] - dataCopy[offsetOther + 1];
				var dB = dataCopy[offset + 2] - dataCopy[offsetOther + 2];

				var dif = dR;
				var absDif = dif > 0 ? dif : -dif;

				var absG = dG > 0 ? dG : -dG;
				var absB = dB > 0 ? dB : -dB;

				if (absG > absDif) {
					dif = dG;
				}
				if (absB > absDif) {
					dif = dB;
				}

				dif *= strength;

				if (blend) {
					var r = imgData.data[offset] + dif;
					var g = imgData.data[offset + 1] + dif;
					var b = imgData.data[offset + 2] + dif;

					imgData.data[offset] = (r > 255) ? 255 : (r < 0 ? 0 : r);
					imgData.data[offset + 1] = (g > 255) ? 255 : (g < 0 ? 0 : g);
					imgData.data[offset + 2] = (b > 255) ? 255 : (b < 0 ? 0 : b);
				} else {
					var grey = greyLevel - dif;
					if (grey < 0) {
						grey = 0;
					} else if (grey > 255) {
						grey = 255;
					}

					imgData.data[offset] = imgData.data[offset + 1] = imgData.data[offset + 2] = grey;
				}

			} while (--x);
		} while (--y);
			
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onBlendStateDirectionChanged = function() {
		emboss(m_canvas, null, true);
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		emboss(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onGrayChanged = function() {
		m_tbGray.setValue(m_slideGray.getValue());
		emboss(m_canvas, null, true);
	};
	
	var onStrengthChanged = function() {
		m_tbStrength.setValue(m_slideStrength.getValue());
		emboss(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_chkBlend.setOnChange(onBlendStateDirectionChanged);
	m_ddlDirection.add(0, 'Top Left');
	m_ddlDirection.add(1, 'Top');
	m_ddlDirection.add(2, 'Top Right');
	m_ddlDirection.add(3, 'Bottom Left');
	m_ddlDirection.add(4, 'Bottom');
	m_ddlDirection.add(5, 'Bottom Right');
	m_ddlDirection.add(6, 'Left');
	m_ddlDirection.add(7, 'Right');
	m_ddlDirection.setOnChange(onBlendStateDirectionChanged);
	m_ddlDirection.setSelectedId(0);
	m_slideGray.setOnChangeCallback(onGrayChanged);
	m_slideStrength.setOnChangeCallback(onStrengthChanged);
	m_tbGray.setValue('0');
	m_tbGray.disable();
	m_tbStrength.setValue('0');
	m_tbStrength.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Strength:'), m_tbStrength);
	m_layForm.add(new TText(''), m_slideStrength);
	m_layForm.add(new TText('Gray Level:'), m_tbGray);
	m_layForm.add(new TText(''), m_slideGray);
	m_layForm.add(new TText('Direction:'), m_ddlDirection);
	m_layForm.add(new TText('Blend with Original:'), m_chkBlend);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TGlowWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideAmount   = new TSlider('Horizontal', 0, 1, 0.01);
	var m_slideRadius   = new TSlider('Horizontal', 0, 1, 0.01);
	var m_tbAmount      = new TTextBox(60);
	var m_tbRadius      = new TTextBox(60);
	var m_window        = createWindow('Glow');
	
	var glow = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var amount = parseFloat(m_slideAmount.getValue());
		var radius = parseFloat(m_slideRadius.getValue());
		
		var imgData = canvas.getImageData(rect);
		
		var blurCanvas = document.createElement("canvas");
		blurCanvas.width = rect.width;
		blurCanvas.height = rect.height;
		var blurCtx = blurCanvas.getContext("2d");
		blurCtx.drawImage(canvas.getElement(), 0, 0);

		var smallWidth = Math.round(rect.width / 2);
		var smallHeight = Math.round(rect.height / 2);

		var copy = document.createElement("canvas");
		copy.width = smallWidth;
		copy.height = smallHeight;

		var steps = Math.round(radius * 20);

		var copyCtx = copy.getContext("2d");
		for (var i = 0; i < steps; i++) {
			var scaledWidth = Math.max(1, Math.round(smallWidth - i));
			var scaledHeight = Math.max(1, Math.round(smallHeight - i));
	
			copyCtx.clearRect(0, 0, smallWidth, smallHeight);
	
			copyCtx.drawImage(blurCanvas, 0, 0, rect.width, rect.height, 0, 0, scaledWidth, scaledHeight);
	
			blurCtx.clearRect(0, 0, rect.width, rect.height);
	
			blurCtx.drawImage(copy, 0, 0, scaledWidth, scaledHeight, 0, 0, rect.width, rect.height);
		}
		
		var blurData = blurCanvas.getContext('2d').getImageData(rect.left, rect.top, rect.width, rect.height).data;

		var p = rect.width * rect.height;

		var pix = p * 4, pix1 = pix + 1, pix2 = pix + 2;
		while (p--) {
			if ((imgData.data[pix -= 4] += amount * blurData[pix]) > 255) imgData.data[pix] = 255;
			if ((imgData.data[pix1 -= 4] += amount * blurData[pix1]) > 255) imgData.data[pix1] = 255;
			if ((imgData.data[pix2 -= 4] += amount * blurData[pix2]) > 255) imgData.data[pix2] = 255;
		}
					
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); } 
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		glow(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onAmountChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
		glow(m_canvas, null, true);
	};
	
	var onRadiusChanged = function() {
		m_tbRadius.setValue(m_slideRadius.getValue());
		glow(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideAmount.setOnChangeCallback(onAmountChanged);
	m_slideRadius.setOnChangeCallback(onRadiusChanged);
	m_tbAmount.setValue('0');
	m_tbAmount.disable();
	m_tbRadius.setValue('0');
	m_tbRadius.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layForm.add(new TText(''), m_slideAmount);
	m_layForm.add(new TText('Radius:'), m_tbRadius);
	m_layForm.add(new TText(''), m_slideRadius);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function THistogramWindow(originalCanvas) {
	var m_btnBrightHist = new TButton('Brightness Histogram');
	var m_btnClose      = new TButton(TLang.translate('close'));
	var m_btnColorHist  = new TButton('Color Histogram');
	var m_btnReset      = new TButton(TLang.translate('reset'));     
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layControls   = new TVerticalLayout();
	var m_layMain       = new THorizontalLayout();
	var m_window        = createWindow('Histogram');
	
	var onBrightHistClick = function(rect) {
		m_canvas.setCanvas(originalCanvas.getElement()); 
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: m_canvas.getWidth(), height: m_canvas.getHeight() } : rect;
		var imgData = m_canvas.getImageData(rect);
		var returnValue = { values: [] };
		
		for (var i = 0; i < 256; i++) {
			returnValue.values[i] = 0;
		}
		
		var p = rect.width * rect.height;

		var pix = p * 4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

		while (p--) {
			returnValue.values[ Math.round(imgData.data[pix -= 4] * 0.3 + imgData.data[pix + 1] * 0.59 + imgData.data[pix + 2] * 0.11) ]++;
		}
		
		var maxValue = 0;
		for (var i = 0; i < 256; i++) {
			if (returnValue.values[i] > maxValue) {
				maxValue = returnValue.values[i];
			}
		}
		var heightScale = m_canvas.getHeight() / maxValue;
		var widthScale = m_canvas.getWidth() / 256;
		var ctx = m_canvas.getContext();
		ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
		for (var i = 0; i < 256; i++) {
			ctx.fillRect(i * widthScale, m_canvas.getHeight() - heightScale * returnValue.values[i], widthScale, returnValue.values[i] * heightScale);
		}
		
		return returnValue;
	};
	
	var onCloseClick = function() {
		hideModal();
	};
	
	var onColorHistClick = function(rect) {
		m_canvas.setCanvas(originalCanvas.getElement()); 
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: m_canvas.getWidth(), height: m_canvas.getHeight() } : rect;
		var returnValue = { rvals: [], gvals: [], bvals: [] };
		var imgData = m_canvas.getImageData(rect);
		
		var rvals = []; for (var i = 0; i < 256; i++) { rvals[i] = 0; }
		var gvals = []; for (var i = 0; i < 256; i++) { gvals[i] = 0; }
		var bvals = []; for (var i = 0; i < 256; i++) { bvals[i] = 0; }
		
		var p = rect.width * rect.height;
		var pix = p * 4;
		while (p--) {
			rvals[imgData.data[pix -= 4]]++;
			gvals[imgData.data[pix + 1]]++;
			bvals[imgData.data[pix + 2]]++;
		}
 
		returnValue.rvals = rvals;
		returnValue.gvals = gvals;
		returnValue.bvals = bvals;
		
		var ctx = m_canvas.getContext();
		var vals = [rvals, gvals, bvals];
		for (var v = 0; v < 3; v++) {
			var yoff = (v + 1) * m_canvas.getHeight() / 3;
			var maxValue = 0;
			for (var i = 0; i < 256; i++) {
				if (vals[v][i] > maxValue)
					maxValue = vals[v][i];
			}
			var heightScale = m_canvas.getHeight() / 3 / maxValue;
			var widthScale = m_canvas.getWidth() / 256;
			if (v == 0) { ctx.fillStyle = "rgba(255,0,0,0.5)";
			} else if (v == 1) { ctx.fillStyle = "rgba(0,255,0,0.5)";
			} else if (v == 2) { ctx.fillStyle = "rgba(0,0,255,0.5)"; }
			for (var i = 0; i < 256; i++) {
				ctx.fillRect(i * widthScale, m_canvas.getHeight() - heightScale * vals[v][i] - m_canvas.getHeight() + yoff, widthScale, vals[v][i] * heightScale);
			}
		}
		return returnValue;
	};
	
	var onResetClick = function() {
		m_canvas.setCanvas(originalCanvas.getElement());
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 600, 400);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnBrightHist.setOnClick(onBrightHistClick);
	m_btnClose.setOnClick(onCloseClick);
	m_btnColorHist.setOnClick(onColorHistClick);
	m_btnReset.setOnClick(onResetClick);
	m_layCommands.add(m_btnClose);
	m_layControls.add(m_btnBrightHist);
	m_layControls.add(m_btnColorHist);
	m_layControls.add(m_btnReset);
	m_layMain.add(m_layControls);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function THueSaturationLightnessWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideHue      = new TSlider('Horizontal', -180, 180, 3, 0);
	var m_slideLight    = new TSlider('Horizontal', -100, 100, 2, 0);
	var m_slideSatu     = new TSlider('Horizontal', -100, 100, 2, 0);
	var m_tbHue         = new TTextBox(60);
	var m_tbLight       = new TTextBox(60);
	var m_tbSatu        = new TTextBox(60);
	var m_window        = createWindow('Hue/Saturation/Lightness');
	
	var hueSatuLight = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var hue = (parseInt(m_slideHue.getValue(), 10) % 360) / 360;
		var saturation = (parseInt(m_slideSatu.getValue(), 10)) / 100;
		var lightness = (parseInt(m_slideLight.getValue(), 10)) / 100;

		var imgData = canvas.getImageData(rect);
		
		var satMul = 0;
		if (saturation < 0) {
			satMul = 1 + saturation;
		} else {
			satMul = 1 + saturation * 2;
		}

		var rgbDiv = 1 / 255;

		var light255 = lightness * 255;
		var lightp1 = 1 + lightness;
		var lightm1 = 1 - lightness;
		
		var p = rect.width * rect.height;

		var pix = p * 4, pix1 = pix + 1, pix2 = pix + 2, pix3 = pix + 3;

		while (p--) {

			var r = imgData.data[pix -= 4];
			var g = imgData.data[pix1 = pix + 1];
			var b = imgData.data[pix2 = pix + 2];

			if (hue != 0 || saturation != 0) {
				var vs = Math.max(r, g, b);
				var ms = Math.min(r, g, b);
				var vm = (vs - ms);
				var l = (ms + vs) / 510;
				if (l > 0) {
					if (vm > 0) {
						var v = 0;
						if (l <= 0.5) {
							var s = vm / (vs + ms) * satMul;
							if (s > 1) { s = 1; }
							v = (l * (1 + s));
						} else {
							var s = vm / (510 - vs - ms) * satMul;
							if (s > 1) { s = 1; }
							v = (l + s - l * s);
						}
						var h = 0;
						if (r == vs) {
							if (g == ms) {
								h = 5 + ((vs - b) / vm) + hue * 6;
							} else {
								h = 1 - ((vs - g) / vm) + hue * 6;
							}
						} else if (g == vs) {
							if (b == ms) {
								h = 1 + ((vs - r) / vm) + hue * 6;
							} else {
								h = 3 - ((vs - b) / vm) + hue * 6;
							}
						} else {
							if (r == ms) {
								h = 3 + ((vs - g) / vm) + hue * 6;
							} else {
								h = 5 - ((vs - r) / vm) + hue * 6;
							}
						}
						if (h < 0) { h += 6; }
						if (h >= 6) { h -= 6; }
						var m = (l + l - v);
						var sextant = h>>0;
						if (sextant == 0) {
							r = v * 255; g = (m + ((v - m) * (h - sextant))) * 255; b = m * 255;
						} else if (sextant == 1) {
							r = (v - (( v - m) * (h - sextant))) * 255; g = v * 255; b = m * 255;
						} else if (sextant == 2) {
							r = m * 255; g = v * 255; b = (m + ((v - m) * (h - sextant))) * 255;
						} else if (sextant == 3) {
							r = m * 255; g = (v - ((v - m) * (h - sextant))) * 255; b = v * 255;
						} else if (sextant == 4) {
							r = (m + ((v - m) * (h - sextant))) * 255; g = m * 255; b = v * 255;
						} else if (sextant == 5) {
							r = v * 255; g = m * 255; b = (v - ((v - m) * (h - sextant))) * 255;
						}
					}
				}
			}

			if (lightness < 0) {
				r *= lightp1;
				g *= lightp1;
				b *= lightp1;
			} else if (lightness > 0) {
				r = r * lightm1 + light255;
				g = g * lightm1 + light255;
				b = b * lightm1 + light255;
			}

			if (r < 0) {
				imgData.data[pix] = 0;
			} else if (r > 255) {
				imgData.data[pix] = 255;
			} else {
				imgData.data[pix] = r;
			}

			if (g < 0) { 
				imgData.data[pix1] = 0;
			} else if (g > 255) {
				imgData.data[pix1] = 255;
			} else {
				imgData.data[pix1] = g;
			}

			if (b < 0) {
				imgData.data[pix2] = 0;
			} else if (b > 255) {
				imgData.data[pix2] = 255;
			} else {
				imgData.data[pix2] = b;
			}

		}
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onHueChanged = function() {
		m_tbHue.setValue(m_slideHue.getValue());
		hueSatuLight(m_canvas, null, true);
	};
	
	var onLightnessChanged = function() {
		m_tbLight.setValue(m_slideLight.getValue());
		hueSatuLight(m_canvas, null, true);
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		hueSatuLight(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onSaturationChanged = function() {
		m_tbSatu.setValue(m_slideSatu.getValue());
		hueSatuLight(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 400, 200);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideHue.setOnChangeCallback(onHueChanged);
	m_slideLight.setOnChangeCallback(onLightnessChanged);
	m_slideSatu.setOnChangeCallback(onSaturationChanged);
	m_tbHue.setValue('0');
	m_tbHue.disable();
	m_tbLight.setValue('0');
	m_tbLight.disable();
	m_tbSatu.setValue('0');
	m_tbSatu.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Hue:'), m_tbHue);
	m_layForm.add(new TText(''), m_slideHue);
	m_layForm.add(new TText('Saturation:'), m_tbSatu);
	m_layForm.add(new TText(''), m_slideSatu);
	m_layForm.add(new TText('Lightness:'), m_tbLight);
	m_layForm.add(new TText(''), m_slideLight);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TLightenWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideAmount   = new TSlider('Horizontal', -1, 1, 0.1, 0);
	var m_tbAmount      = new TTextBox(60);
	var m_window        = createWindow('Lighten');
	
	var lighten = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var amount = parseFloat(m_slideAmount.getValue() + 1);
		
		var imgData = canvas.getImageData(rect);

		var p = rect.width * rect.height;

		var pix = p * 4, pix1 = pix + 1, pix2 = pix + 2;

		while (p--) {
			if ((imgData.data[pix -= 4] = imgData.data[pix] * amount) > 255) { imgData.data[pix] = 255; }

			if ((imgData.data[pix1 -= 4] = imgData.data[pix1] * amount) > 255) { imgData.data[pix1] = 255; }

			if ((imgData.data[pix2 -= 4] = imgData.data[pix2] * amount) > 255) { imgData.data[pix2] = 255; }
		}
					
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); } 
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		lighten(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onAmountChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
		lighten(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideAmount.setOnChangeCallback(onAmountChanged);
	m_tbAmount.setValue('0');
	m_tbAmount.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layForm.add(new TText(''), m_slideAmount);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TMosaicWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideBlock    = new TSlider('Horizontal', 1, 100, 1);
	var m_tbBlock       = new TTextBox(60);
	var m_window        = createWindow('Mosaic');
	
	var mosaic = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var blockSize = m_slideBlock.getValue();
		var ctx = canvas.getContext();

		var pixel = document.createElement("canvas");
		pixel.width = pixel.height = 1;
		var pixelCtx = pixel.getContext("2d");

		var copy = document.createElement("canvas");
		copy.width = rect.width;
		copy.height = rect.height;
		var copyCtx = copy.getContext("2d");
		copyCtx.drawImage(canvas.getElement(), rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

		for (var y = 0; y < rect.height; y += blockSize) {
			for (var x = 0; x< rect.width; x += blockSize) {
				var blockSizeX = blockSize;
				var blockSizeY = blockSize;
		
				if (blockSizeX + x > rect.width) { blockSizeX = rect.width - x; }
				if (blockSizeY + y > rect.height) { blockSizeY = rect.height - y; }

				pixelCtx.drawImage(copy, x, y, blockSizeX, blockSizeY, 0, 0, 1, 1);
				var data = pixelCtx.getImageData(0, 0, 1, 1).data;
				ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
				ctx.fillRect(rect.left + x, rect.top + y, blockSize, blockSize);
			}
		}
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		mosaic(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onBlockChanged = function() {
		m_tbBlock.setValue(m_slideBlock.getValue());
		mosaic(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideBlock.setOnChangeCallback(onBlockChanged);
	m_tbBlock.setValue('0');
	m_tbBlock.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Block Size:'), m_tbBlock);
	m_layForm.add(new TText(''), m_slideBlock);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TNoiseWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_chkMono       = new TCheckBox('');
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideAmount   = new TSlider('Horizontal', 0, 1, 0.01);
	var m_slideStrength = new TSlider('Horizontal', 0, 1, 0.01);
	var m_tbAmount      = new TTextBox(60);
	var m_tbStrength    = new TTextBox(60);
	var m_window        = createWindow('Noise');
	
	var noise = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var amount = parseFloat(m_slideAmount.getValue());
		var strength = parseFloat(m_slideStrength.getValue());
		var mono = m_chkMono.isChecked();
		
		var noise = 128 * strength;
		var noise2 = noise / 2;
		
		var imgData = canvas.getImageData(rect);
		var y = rect.height;
		var random = Math.random;

		do {
			var offsetY = (y - 1) * rect.width * 4;
			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;
				if (random() < amount) {
					var r, g, b;
					if (mono) {
						var pixelNoise = - noise2 + random() * noise;
						r = imgData.data[offset] + pixelNoise;
						g = imgData.data[offset + 1] + pixelNoise;
						b = imgData.data[offset + 2] + pixelNoise;
					} else {
						r = imgData.data[offset] - noise2 + (random() * noise);
						g = imgData.data[offset + 1] - noise2 + (random() * noise);
						b = imgData.data[offset + 2] - noise2 + (random() * noise);
					}

					if (r < 0 ) r = 0;
					if (g < 0 ) g = 0;
					if (b < 0 ) b = 0;
					if (r > 255 ) r = 255;
					if (g > 255 ) g = 255;
					if (b > 255 ) b = 255;

					imgData.data[offset] = r;
					imgData.data[offset + 1] = g;
					imgData.data[offset + 2] = b;
				}
			} while (--x);
		} while (--y);
		
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); }
		
		return true;
	};
	
	var onMonoStateChanged = function() {
		noise(m_canvas, null, true);
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		noise(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onAmountChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
		noise(m_canvas, null, true);
	};
	
	var onStrengthChanged = function() {
		m_tbStrength.setValue(m_slideStrength.getValue());
		noise(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_chkMono.setOnChange(onMonoStateChanged);
	m_slideAmount.setOnChangeCallback(onAmountChanged);
	m_slideStrength.setOnChangeCallback(onStrengthChanged);
	m_tbAmount.setValue('0');
	m_tbAmount.disable();
	m_tbStrength.setValue('0');
	m_tbStrength.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layForm.add(new TText(''), m_slideAmount);
	m_layForm.add(new TText('Strength:'), m_tbStrength);
	m_layForm.add(new TText(''), m_slideStrength);
	m_layForm.add(new TText('Monochromatic:'), m_chkMono);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TPointillizeWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_btnPoint      = new TButton('Pointillize');
	var m_btnReset      = new TButton(TLang.translate('reset'));
	var m_canvas        = new TCanvasBrick();
	var m_chkTrans      = new TCheckBox('');
	var m_layCan        = new TVerticalLayout();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideDensity  = new TSlider('Horizontal', 0, 5, 0.1);
	var m_slideNoise    = new TSlider('Horizontal', 0, 2, 0.1);
	var m_slideRadius   = new TSlider('Horizontal', 1, 100, 1);
	var m_tbDensity     = new TTextBox(60);
	var m_tbNoise       = new TTextBox(60);
	var m_tbRadius      = new TTextBox(60);
	var m_window        = createWindow('Pointillize');
	
	var pointillize = function(canvas, rect) {
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var density = parseFloat(m_slideDensity.getValue());
		var noise = parseFloat(m_slideNoise.getValue());
		var radius = m_slideRadius.getValue();
		var transparent = m_chkTrans.isChecked();

		var ctx = canvas.getContext();
		var canvasWidth = canvas.getWidth();
		var canvasHeight = canvas.getHeight();

		var pixel = document.createElement("canvas");
		pixel.width = pixel.height = 1;
		var pixelCtx = pixel.getContext("2d");

		var copy = document.createElement("canvas");
		copy.width = rect.width;
		copy.height = rect.height;
		var copyCtx = copy.getContext("2d");
		copyCtx.drawImage(canvas.getElement(), rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

		var diameter = radius * 2;

		if (transparent) { ctx.clearRect(rect.left, rect.top, rect.width, rect.height); }

		var noiseRadius = radius * noise;

		var dist = 1 / density;

		for (var y = 0; y < rect.height + radius; y += diameter * dist) {
			for (var x = 0; x < rect.width + radius; x += diameter * dist) {
				var rndX = noise ? (x + ((Math.random() * 2 - 1) * noiseRadius))>>0 : x;
				var rndY = noise ? (y + ((Math.random() * 2 - 1) * noiseRadius))>>0 : y;

				var pixX = rndX - radius;
				var pixY = rndY - radius;
				if (pixX < 0) { pixX = 0; }
				if (pixY < 0) { pixY = 0; }

				var cx = rndX + rect.left;
				var cy = rndY + rect.top;
				if (cx < 0) { cx = 0; }
				if (cx > canvasWidth) { cx = canvasWidth; }
				if (cy < 0) { cy = 0; }
				if (cy > canvasHeight) { cy = canvasHeight; }

				var diameterX = diameter;
				var diameterY = diameter;

				if (diameterX + pixX > rect.width) { diameterX = rect.width - pixX; }
				if (diameterY + pixY > rect.height) { diameterY = rect.height - pixY; }
				if (diameterX < 1) { diameterX = 1; }
				if (diameterY < 1) { diameterY = 1; }

				pixelCtx.drawImage(copy, pixX, pixY, diameterX, diameterY, 0, 0, 1, 1);
				var data = pixelCtx.getImageData(0, 0, 1, 1).data;

				ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
				ctx.beginPath();
				ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			}
		}
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onDensityChanged = function() {
		m_tbDensity.setValue(m_slideDensity.getValue());
	};
	
	var onNoiseChanged = function() {
		m_tbNoise.setValue(m_slideNoise.getValue());
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		pointillize(originalCanvas);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onPointClick = function() {
		pointillize(m_canvas);
	};
	
	var onRadiusChanged = function() {
		m_tbRadius.setValue(m_slideRadius.getValue());
	};
	
	var onResetClick = function() {
		m_canvas.setCanvas(originalCanvas.getElement());
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 400, 200);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnPoint.setOnClick(onPointClick);
	m_btnReset.setOnClick(onResetClick);
	m_slideDensity.setOnChangeCallback(onDensityChanged);
	m_slideNoise.setOnChangeCallback(onNoiseChanged);
	m_slideRadius.setOnChangeCallback(onRadiusChanged);
	m_tbDensity.setValue('0');
	m_tbDensity.disable();
	m_tbNoise.setValue('0');
	m_tbNoise.disable();
	m_tbRadius.setValue('0');
	m_tbRadius.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Point Radius:'), m_tbRadius);
	m_layForm.add(new TText(''), m_slideRadius);
	m_layForm.add(new TText('Density:'), m_tbDensity);
	m_layForm.add(new TText(''), m_slideDensity);
	m_layForm.add(new TText('Noise:'), m_tbNoise);
	m_layForm.add(new TText(''), m_slideNoise);
	m_layForm.add(new TText('Transparent Background:'), m_chkTrans);
	m_layCan.add(m_canvas);
	m_layCan.add(m_btnPoint);
	m_layCan.add(m_btnReset);
	m_layMain.add(m_layForm);
	m_layMain.add(m_layCan);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TPosterizeWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideLevel    = new TSlider('Horizontal', 1, 32, 1);
	var m_tbLevels      = new TTextBox(60);
	var m_window        = createWindow('Posterize');
	
	var posterize = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var numLevels = Math.max(2, parseInt(m_slideLevel.getValue(), 10));
		
		var imgData = canvas.getImageData(rect);

		var numAreas = 256 / numLevels;
		var numValues = 256 / (numLevels - 1);
		
		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;
			var x = rect.width;
			do {
				var offset = offsetY + (x - 1) * 4;

				var r = numValues * ((imgData.data[offset] / numAreas)>>0);
				var g = numValues * ((imgData.data[offset + 1] / numAreas)>>0);
				var b = numValues * ((imgData.data[offset + 2] / numAreas)>>0);

				if (r > 255) { r = 255; }
				if (g > 255) { g = 255; }
				if (b > 255) { b = 255; }

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
					
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); } 
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		posterize(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onLevelChanged = function() {
		m_tbLevels.setValue(m_slideLevel.getValue());
		posterize(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideLevel.setOnChangeCallback(onLevelChanged);
	m_tbLevels.setValue('0');
	m_tbLevels.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Levels:'), m_tbLevels);
	m_layForm.add(new TText(''), m_slideLevel);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TSaveImage(data, saveUrl, callback) {
	var m_btnClose       = new TButton(TLang.translate('close'));
	var m_btnSave        = new TButton(TLang.translate('save'));
	var m_callback       = (callback === undefined || callback == null) ? null : callback;
	var m_layForm        = new TFormLayout();
	var m_vtbDescription = new TValidatableTextBox(200, new TEmptyValidator());
	var m_vtbTitle       = new TValidatableTextBox(200, new TEmptyValidator());
	var m_window         = createWindow(TLang.translate('save'));
	
	var doSave = function() {
		data = m_vtbTitle.getValue() + ',' + m_vtbDescription.getValue() + ',' + data;
		TAjax.sendRequest(m_window, saveUrl, data, onSaveOk, onSaveError, 'application/upload');
	};
	
	var onCloseClick = function() {
		hideModal();
	};
	
	var onSaveClick = function() {
		TQuestionBox.showModal(TLang.translate('save'), TLang.translate('saveImage'), doSave);
	};
	
	var onSaveError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), TLang.translate('errorSavingImage') + ': ' + text);
	};
	
	var onSaveOk = function() {
		TMessageBox.showModal(TLang.translate('imageEditor'), TLang.translate('imageSavedSuccessfully'));
		hideModal();
		
		if (m_callback != null) {
			m_callback();
		}
	};
	
	var validateAdd = function() {
		if (m_vtbDescription.isValid() && m_vtbTitle.isValid()) {
			m_btnSave.enable();
		} else {
			m_btnSave.disable();
		}
	};
	
	this.show = function() {
        m_btnSave.disable();
        m_vtbDescription.setValue('');
        m_vtbTitle.setValue('');
        showModal(m_window);
    };
    
    m_btnClose.setOnClick(onCloseClick);
    m_btnSave.setOnClick(onSaveClick);
    m_vtbDescription.setMaxLength(100);
	m_vtbDescription.setOnValidationChanged(validateAdd);
	m_vtbTitle.setMaxLength(100);
	m_vtbTitle.setOnValidationChanged(validateAdd);
	m_layForm.setDirection(TLang.getDirection());
	m_layForm.add(new TText(TLang.translate('title') + ': '), m_vtbTitle);
	m_layForm.add(new TText(TLang.translate('desc') + ': '), m_vtbDescription);
	m_layForm.add(new TText(''), m_btnSave);
	
	m_window.add(m_layForm);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_btnClose);  
};

function TSharpenWindow(originalCanvas, callback) {
	var m_btnCancel     = new TButton(TLang.translate('cancel'));
	var m_btnOk         = new TButton(TLang.translate('ok'));
	var m_canvas        = new TCanvasBrick();
	var m_layCommands   = new THorizontalLayout();
	var m_layForm       = new TFormLayout();
	var m_layMain       = new THorizontalLayout();
	var m_slideAmount   = new TSlider('Horizontal', 0, 1, 0.01);
	var m_tbAmount      = new TTextBox(60);
	var m_window        = createWindow('Sharpen');
	
	var sharpen = function(canvas, rect, reset) {
		if (reset) { canvas.setCanvas(originalCanvas.getElement()); }
		rect = (rect === undefined || rect == null) ? { left : 0, top : 0, width: canvas.getWidth(), height: canvas.getHeight() } : rect;
		
		var amount = parseFloat(m_slideAmount.getValue());
		
		var imgData = canvas.getImageData(rect);

		var dataCopy = imgData.data;

		var mul = 15;
		var mulOther = 1 + 3 * amount;

		var kernel = [
			[0, 	-mulOther, 	0],
			[-mulOther, 	mul, 	-mulOther],
			[0, 	-mulOther, 	0]
		];

		var weight = 0;
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				weight += kernel[i][j];
			}
		}

		weight = 1 / weight;

		mul *= weight;
		mulOther *= weight;

		var y = rect.height;
		do {
			var offsetY = (y - 1) * rect.width * 4;

			var nextY = (y == rect.height) ? y - 1 : y;
			var prevY = (y == 1) ? 0 : y - 2;

			var offsetYPrev = prevY * rect.width * 4;
			var offsetYNext = nextY * rect.width * 4;

			var x = rect.width;
			do {
				var offset = offsetY + (x * 4 - 4);

				var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x - 2) * 4;
				var offsetNext = offsetYNext + ((x == rect.width) ? x - 1 : x) * 4;

				var r = ((- dataCopy[offsetPrev] - dataCopy[offset - 4] - dataCopy[offset + 4] - dataCopy[offsetNext]) * mulOther + dataCopy[offset] * mul);

				var g = ((- dataCopy[offsetPrev + 1] - dataCopy[offset - 3] - dataCopy[offset + 5] - dataCopy[offsetNext + 1]) * mulOther + dataCopy[offset + 1] * mul);

				var b = ((- dataCopy[offsetPrev + 2] - dataCopy[offset - 2] - dataCopy[offset + 6] - dataCopy[offsetNext + 2]) * mulOther + dataCopy[offset + 2] * mul);


				if (r < 0 ) r = 0;
				if (g < 0 ) g = 0;
				if (b < 0 ) b = 0;
				if (r > 255 ) r = 255;
				if (g > 255 ) g = 255;
				if (b > 255 ) b = 255;

				imgData.data[offset] = r;
				imgData.data[offset + 1] = g;
				imgData.data[offset + 2] = b;

			} while (--x);
		} while (--y);
					
		canvas.putImageData(imgData);
		if (isOpera()) { canvas.getContext().fillRect(0, 0, 0, 0); } 
		
		return true;
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		var original = new TCanvasBrick();
		original.setSize(originalCanvas.getWidth(), originalCanvas.getHeight());
		original.setCanvas(originalCanvas.getElement());
		sharpen(originalCanvas, null, false);
		hideModal();
		
		if (callback !== undefined && callback != null) {
			callback(original);
		}
	};
	
	var onAmountChanged = function() {
		m_tbAmount.setValue(m_slideAmount.getValue());
		sharpen(m_canvas, null, true);
	};
	
	this.show = function() {
		showModal(m_window);
	};
	
	if (originalCanvas != null && originalCanvas !== undefined) {
		 var size = calculateFitImageSize(originalCanvas.getImage().src, 300, 150);
		 m_canvas.setSize(size.width, size.height);
		 m_canvas.setCanvas(originalCanvas.getElement());
	}
	
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_slideAmount.setOnChangeCallback(onAmountChanged);
	m_tbAmount.setValue('0');
	m_tbAmount.disable();
	m_layCommands.add(m_btnCancel);
	m_layCommands.add(m_btnOk);
	m_layForm.add(new TText('Amount:'), m_tbAmount);
	m_layForm.add(new TText(''), m_slideAmount);
	m_layMain.add(m_layForm);
	m_layMain.add(m_canvas);
	m_window.add(m_layMain);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};