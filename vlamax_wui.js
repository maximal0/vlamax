
var g_sessionId = 0;
var m_nextOrder    = 1;
var m_modalWindows = new Array();
var m_objectsToBeCentered = new Array();
window.onresize = function () { onResize(); };

var $ = function(id) {
	return TObjects.getObject(id);
};

var $$ = function(id, object) {
	TObjects.setObject(id, object);
};

var $$$ = function(id, object) {
	return TUniqueId.getUniqueId();
};

var $$$$ = function(element, event, method) {
	if (element.addEventListener) {
		element.addEventListener(event, method, false);
	} else if (element.attachEvent) {
		element.attachEvent('on' + event, method);
	}
};

var $$$$$ = function (element, event, method) {
    if (element.removeEventListener) {
        element.removeEventListener(event, method, false);
    } else if (element.detachEvent) {
        element.detachEvent('on' + event, method);
    }
};

function calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
    ratio = Math.min(ratio[0], ratio[1]);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
};

function createWindow(title, margin, padding, layout, undertext) {
	var window = new TWindow(title, margin, padding, layout, undertext);
	
	m_objectsToBeCentered[m_objectsToBeCentered.length] = window;
	
	return window;
};

function displayServerError(xmlDoc, text) {
	var errorTags = xmlDoc.getElementsByTagName('Error');
	var message   = 'Server error.';
				
	if (errorTags.length == 1) {
		var reason = errorTags[0].getAttribute('reason');
				
		if (reason) {
			message = reason;
		}
	} else {
		message = toHtml(text);
	}
			
	TMessageBox.showModal(TLang.translate('error'), message);
};

function fromHtml(textToConvert) {
	var decoded = '';

	if (textToConvert != null) {
		var text = textToConvert.toString();

		decoded = text.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
	}

	return decoded;
};

function getDocHeight() {
    return Math.max(
        Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
        Math.max(document.body.offsetHeight, document.documentElement.offsetHeight),
        Math.max(document.body.clientHeight, document.documentElement.clientHeight)
    );
};

function getDocWidth() {
    return Math.max(
        Math.max(document.body.scrollWidth, document.documentElement.scrollWidth),
        Math.max(document.body.offsetWidth, document.documentElement.offsetWidth),
        Math.max(document.body.clientWidth, document.documentElement.clientWidth)
    );
};

function getImageSize(src) {
	var img = new Image();
	img.src = src;
	
	/*var startT = new Date().getTime();
	while(true) { 
		var now = new Date().getTime();
	    if( (now - startT) > 5) {
	        break;
	    } 
	}*/
	if (src != '') { while(img.width == 0 || img.height == 0) { } }
	
	//img = null;
	return { width: img.width, height: img.height };
};

function getSimpleTagValue(xmlDoc, tag) {
	var elements = xmlDoc.getElementsByTagName(tag);
	var value = '';
			
	if (elements.length == 1 && elements[0].firstChild != null) {
		value = elements[0].firstChild.nodeValue;
	}

	return value;
};

function getViewportHeight() {
	return window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
};

function getViewportWidth() {
	return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
};

function hideModal() {
	if (m_modalWindows.length > 0) {
		var object = m_modalWindows.pop();
		
		object.shield.hide();
		delete object.shield;
		object.window.hide();
		
		m_nextOrder = object.startOrder;
	}
};

function hidePage() {
	if (m_modalWindows.length > 0) {
		var object = m_modalWindows.pop();
		object.window.hide();
		m_nextOrder = object.startOrder;
	}
};

function isFF() {
	return navigator.userAgent.indexOf('Firefox') != -1;
};

function isIE() {
	return navigator.userAgent.indexOf('MSIE') != -1;
};

function isIE11() {
	return navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/.NET4.0E/);
};

function isInt(n) {
   return !isNaN(n) && parseFloat(n) == parseInt(n, 10);
};

function isOpera() {
	return navigator.userAgent.indexOf('Opera') != -1;
};

function loadXMLString(txt) {
	 if (window.DOMParser) {
	   parser = new DOMParser();
	   xmlDoc = parser.parseFromString(txt, "text/xml");
	 } else { // IE
	   xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
	   xmlDoc.async = false;
	   xmlDoc.loadXML(txt); 
	 }
	 return xmlDoc;
 };

var log = function(text) {
	throw new Error('DEBUG: ' + text);
};

function onResize() {
	var viewportHeight = getViewportHeight();
	var viewportWidth  = getViewportWidth();
		
	for (var i = 0; i < m_objectsToBeCentered.length; i++) {
		if (m_objectsToBeCentered[i].isVisible()) {
			resize(m_objectsToBeCentered[i], viewportHeight, viewportWidth);
		}
	}
	
	for (var j = 0; j < m_modalWindows.length; j++) {
		if (m_modalWindows[j].shield) {
			m_modalWindows[j].shield.setSize(viewportWidth, getDocHeight());
		}
	}
};

function removeChar(str, ch) {
    for (var i = str.length - 1; i >= 0; i--) {
        if (str.charAt(i) == ch) {
            str = str.substring(0, i) + str.substring(i + 1, str.length);
        }
    }
    return str;
};

function resize(window, viewportHeight, viewportWidth) {
	if (viewportHeight === undefined) {
		viewportHeight = getViewportHeight();
	}
	
	if (viewportWidth === undefined) {
		viewportWidth = getViewportWidth();
	}
		
	var height = window.getHeight();
	var width  = window.getWidth();
	var x      = 5;
	var y      = 5;
		
	if (viewportWidth > width) {
		x = (viewportWidth - width) / 2;
	}
		
	if (viewportHeight > height) {
		y = (viewportHeight - height) / 2;
	}
		
	window.move(x, y);
};

function showModal(window) {
	var shield = new TBrick('modal');

	shield.setSize(getViewportWidth(), getDocHeight());
	shield.setOrder(m_nextOrder);
	shield.show();
	
	var endOrder = window.setOrder(m_nextOrder + 1);
	
	m_modalWindows.push({ window: window, startOrder: m_nextOrder, endOrder: endOrder, shield: shield });
	m_nextOrder = endOrder + 1;
	
	resize(window);
	window.show();
};

function showPage(page) {
	var endOrder = page.setOrder(m_nextOrder + 1);
	
	m_modalWindows.push({ window: page, startOrder: m_nextOrder, endOrder: endOrder, shield: null });
	m_nextOrder = endOrder + 1;
	
	page.move(0, 0);
	page.show();
};

function simpleTagExists(xmlDoc, tag) {
	var elements = xmlDoc.getElementsByTagName(tag);
			
	return elements.length != 0;
};

function toHtml(textToConvert) {
	var encoded = '';

	if (textToConvert != null) {
		var text = textToConvert.toString();

		encoded = text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	return encoded;
};

function toMessage(text, leaveSpaces) {
	var encoded = '';

	if (text != null) {
		encoded = text.replace(/\n/g, '<br>');
		
		if (leaveSpaces === undefined || leaveSpaces != true) {
			encoded = encoded.replace(/ /g, '&nbsp;');
		}
	}

	return encoded;
};

function trim(str) {
	str = str.replace(/^\s+/, '');

	for (var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}

	return str;
}

var TAjax = (function() {
	var m_ajaxPanel = null;
	
	var createAjaxPanel = function() {
		if (m_ajaxPanel == null) {
			m_ajaxPanel = new TAjaxPanel();
		}
		
		m_ajaxPanel.setSize(getViewportWidth(), getViewportHeight());	
		m_ajaxPanel.move(0, 0);
		m_ajaxPanel.setOrder(m_nextOrder + 1);
		m_ajaxPanel.show();
	};
	
	return {
		sendRequest: function (parentObject, url, data, okCallback, errorCallback, contentType) {
			contentType = (contentType === undefined || contentType == null) ? 'text/xml; charset=UTF-8' : contentType;
			
			if (parentObject == null) {
				createAjaxPanel();
			} else {
				parentObject.setAjaxOn();
			}

			var ajaxRequest;
	
			try {
				ajaxRequest = new XMLHttpRequest();
			} catch (e) {
				try {
					ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					try {
						ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (e) {
						return false;
					}
				}
			}

			ajaxRequest.onreadystatechange = function() {
				if (ajaxRequest.readyState == 4) {
					if (parentObject == null) {
						m_ajaxPanel.hide();
					} else {
						parentObject.setAjaxOff();
					}
					
					if (ajaxRequest.status == 200) {
						var xmlDoc = ajaxRequest.responseXML;
						
						if (xmlDoc) {
							// TODO: Add processing of error attribute.
							okCallback(xmlDoc, ajaxRequest.responseText);
							return;
						}
					}
					
					if (errorCallback === undefined) {
						TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(ajaxRequest.responseText));
					} else {
						errorCallback(ajaxRequest.responseText);
					}
				}
			};
			
			ajaxRequest.open('POST', url, true);
			ajaxRequest.setRequestHeader('Content-Type', contentType);
			ajaxRequest.send(data);
		}
	};
})();

var TMessageBox = (function() {
	var m_messageBox = null;
	var m_message    = null;
	var m_button     = null;
	var m_callback   = null;
	
	var createMessageBox = function() {
		m_messageBox = createWindow(TLang.translate('test'));
		m_message    = new TText('');
		m_button     = new TButton(TLang.translate('ok'));
		
		m_messageBox.add(m_message);
		m_messageBox.add(new TVerticalDelimiter(5));
		m_messageBox.add(m_button);
		m_button.setOnClick(onClick);
	};

	var onClick = function() {
		hideModal();
		
		if (m_callback) {
			m_callback();
		}
	};

	return {
		showModal: function (title, message, callback) {
			if (m_messageBox == null) {
				createMessageBox();
			}
			
			m_messageBox.setTitle(title);
			m_message.setText(message);			
			m_callback = callback === undefined ? null : callback;

			showModal(m_messageBox);
		}
	};
})();

var TNotificationBox = (function() {
	var m_box     = null;
	var m_message = null;
	var m_this    = this;

	return {
		hide: function() {
			hideModal();
		},
		setMessage: function (message) {
			if (m_box != null) {
				m_message.setText(message);
		    	m_box.refresh();
		    }
		},
		showModal: function (title, message) {
			if (m_box == null) {
				m_box = createWindow(title);
		        m_message = new TText(message);

		        m_box.add(m_message);
			} else {
				m_box.setTitle(title);
			    m_message.setText(message);
			}

			showModal(m_box);
		}
	};
})();

var TObjects = (function() {
	var m_objects = new Object();

	return {
		getObject: function (id) {
			return m_objects[id];
		},
		
		setObject: function (id, object) {
			m_objects[id] = object;
		}
	};
})();

var TQuestionBox = (function() {
	var m_messageBox  = null;
	var m_message     = null;
	var m_btnNo       = null;
	var m_btnYes      = null;
	var m_buttons     = null;
	var m_callbackNo  = null;
	var m_callbackYes = null;
	var m_image       = null;
	var m_layMain     = null;

	var createMessageBox = function() {
		m_messageBox = createWindow('');
		m_message    = new TText('');
		m_btnNo      = new TButton(TLang.translate('no'));
		m_btnYes     = new TButton(TLang.translate('yes'));
		m_buttons    = new THorizontalLayout(5, 15);
		m_layData    = new TVerticalLayout();
		m_layMain    = new THorizontalLayout(0, 0);

		m_btnNo.setOnClick(onNo);
		m_btnYes.setOnClick(onYes);

		m_buttons.add(m_btnYes);
		m_buttons.add(m_btnNo);

		m_layData.add(m_message);
		m_layData.add(new TVerticalDelimiter(5));
		m_layData.add(m_buttons);

		m_layMain.add(m_image);
		m_layMain.add(new THorizontalDelimiter(20));
		m_layMain.add(m_layData);

		m_messageBox.add(m_layMain);
	};

	var onNo = function() {
		hideModal();
		
		if (m_callbackNo) {
			m_callbackNo();
		}
	};
	
	var onYes = function() {
		hideModal();
		
		if (m_callbackYes) {
			m_callbackYes();
		}
	};

	return {
		showModal: function (title, message, callbackYes, callbackNo, image) {
			m_image = (image === undefined || image == null) ? new TImage('images/Robot/question2.png', 112, 80) : image;
			
			createMessageBox();
			
			m_messageBox.setTitle(title);
			m_message.setText(message);			
			
			m_callbackNo  = callbackNo === undefined ? null : callbackNo;
			m_callbackYes = callbackYes === undefined ? null : callbackYes;

			showModal(m_messageBox);
		}
	};
})();

var TUniqueId = (function() {
	var m_id = 0;

	return {
		getUniqueId: function () {
			return m_id++;
		}
	};
})();

function TAjaxPanel() {
	var m_shield = new TBrick('modal2');
	var m_image  = document.createElement('img');
	var m_height = 0;
	var m_width  = 0;

	m_image.className = 'ajax';
	m_image.setAttribute('src', 'images/ajax-loader2.gif');
	
	document.body.appendChild(m_image);
	
	this.hide = function() {
		m_shield.hide();
		m_image.style.visibility = 'hidden';
	};
	
	this.hide();
	
	this.move = function(x, y) {
		m_shield.move(x, y);
		m_image.style.left = x + (m_width - 32) / 2 + 'px';
		m_image.style.top  = y + (m_height - 32) / 2 + 'px';
	};
	
	this.setImage = function(url) {
		m_image.setAttribute('src', url);
	};
	
	this.setOrder = function(order) {
		order++;
		
		order = m_shield.setOrder(order) + 1;
		m_image.style.zIndex = order;
		
		return order + 1;
	};
	
	this.setSize = function(width, height) {
		m_shield.setSize(width, height);
		m_height = height;
		m_width  = width;
	};
	
	this.show = function() {
		m_shield.show();
		m_image.style.visibility = 'visible';
	};
};

function TBrick(className, parent) {
	var m_alignment    = 0;
	var m_backColor    = false;
	var m_border       = null;
	var m_borderBottom = false;
	var m_borderColor  = '#000000';
	var m_borderLeft   = false;
	var m_borderRight  = false;
	var m_borderTop    = false;
	var m_element      = document.createElement('div');
	var m_height       = 0;
	var m_order        = 0;
	var m_padding      = 0;
	var m_parent       = parent === undefined ? null : parent;
	var m_roundedCorners = false;
	var m_tag          = null;
	var m_visible      = false;
	var m_width        = 0;
	var m_x            = 0;
	var m_y = 0;
	
	var adjustBorderHeight = function() {
		if (m_border) {
			m_border.style.height = (m_height + (m_borderTop ? 1 : 0) + (m_borderBottom ? 1 : 0)) + 'px';
		}
	};

	var adjustBorderWidth = function() {
		if (m_border) {
			m_border.style.width = (m_width + (m_borderLeft ? 1 : 0) + (m_borderRight ? 1 : 0)) + 'px';
		}
	};

	var applyBorder = function() {
	    if (m_borderBottom || m_borderLeft || m_borderRight || m_borderTop) {
	        createBorder();

	        m_border.style.background = m_borderColor;
	        m_border.style.zIndex = m_order;
	        if (!m_backColor) { m_element.style.background = '#FFFFFF'; }

	        if (m_roundedCorners) {
	            m_border.style.borderRadius = '10px';
	            m_border.style.MozBorderRadius = '10px';
	            m_border.style.WebKitBorderRadius = '10px';
	            m_element.style.borderRadius = '10px';
	            m_element.style.MozBorderRadius = '10px';
	            m_element.style.WebKitBorderRadius = '10px';
            }
	    } else {
	        deleteBorder();
	    }
	};

	var createBorder = function() {
		if (!m_border) {
			m_border = document.createElement('div');
			m_border.style.position = 'absolute';
			m_border.style.fontSize = '0';
			document.body.appendChild(m_border);
			m_border.style.visibility = 'hidden';
			adjustBorderHeight();
			adjustBorderWidth();
		}
	};
	
	var deleteBorder = function() {
		if (m_border) {
			document.body.removeChild(m_border);
			delete m_border;
			m_border = null;
		}
	};

	var setVisibility = function(visibility) {
		m_element.style.visibility = visibility;
		
		if (m_border) {
			m_border.style.visibility = visibility;
		}
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
	
	this.appendChild = function(child) {
		m_element.appendChild(child);
	};

    this.destroy = function() {
        if (m_parent) {
            m_parent.removeChild(m_element);
        } else {
            document.body.removeChild(m_element);
        }
        m_element = null;
        deleteBorder();
    };

    this.disable = function() {
        m_element.disabled = true;
        m_element.style.background = '#F8F8F8';
    };

	this.enable = function() {
	    m_element.disabled = false;
	    m_element.style.background = '#FFFFFF';
	};

	this.getAlignment = function() {
		return m_alignment;
	};

	this.getElement = function() {
		return m_element;
	};

	this.getHeight = function() {
		return m_height;
	};
	
	this.getOrder = function() {
		return m_order;
	};
	
	this.getTag = function() {
		return m_tag;
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
	
	this.hide = function() {
		setVisibility('hidden');
		m_visible = false;
	};
	
	this.isVisible = function() {
		return m_visible;
	};
	
	this.justifyText = function() {
		m_element.style.textAlign = 'justify';
	};

	this.move = function(x, y) {
		this.setX(x);
		this.setY(y);
	};

	this.removeChild = function(child) {
	    m_element.removeChild(child);
	};

	this.removeEvent = function(event, callback) {
	    $$$$$(m_element, event, callback);
	};

	this.setBackground = function(background) {
		m_element.style.background = background;
		m_backColor = true;
	};

	this.setBackgroundImage = function(image) {
		m_element.style.backgroundImage = 'url(\'' + image + '\')';
		m_backColor = true;
	};
	
	this.setBackgroundPosition = function(position) {
		m_element.style.backgroundPosition = position;
	};

	this.setBackgroundSize = function(mode) {
		m_element.style.backgroundSize = mode;
	};

	this.setBorder = function(color, left, right, top, bottom, roundedCorners) {
	    m_borderColor = color;
	    m_borderBottom = bottom ? true : false;
	    m_borderLeft = left ? true : false;
	    m_borderRight = right ? true : false;
	    m_borderTop = top ? true : false;
	    m_roundedCorners = roundedCorners ? true : false;
	    applyBorder();
	};
	
	this.setBorderBottom = function(bottom) {
		m_borderBottom = bottom ? true : false;
		applyBorder();
		adjustBorderHeight();
	};
	
	this.setBorderLeft = function(left) {
		m_borderLeft = left ? true : false;
		applyBorder();
		adjustBorderWidth();
	};
	
	this.setBorderRight = function(right) {
		m_borderRight = right ? true : false;
		applyBorder();
		adjustBorderWidth();
	};
	
	this.setBorderTop = function(top) {
		m_borderTop = top ? true : false;
		applyBorder();
		adjustBorderHeight();
	};
	
	this.setCursor = function(cursor) {
		m_element.style.cursor = cursor;
	};
	
	this.setDirection = function(dir) {
	  	m_element.style.direction = dir;
	};
	
	this.setFilter = function(value) {
		m_element.style.filter = "alpha(opacity=" + value + ")";
		m_element.style.background = "rgba(255, 255, 255, " + (value / 100) + ")";
	};
	
	this.setFocus = function() {
		m_element.focus();
	};
	
	this.setFontSize = function(size) {
		m_element.style.fontSize = size;
	};
	
	this.setHeight = function(height) {
		m_element.style.height = height + 'px';
		m_height = height + m_padding * 2;
		
		if (m_border) {
			m_border.style.height = (m_height + (m_borderTop ? 1 : 0) + (m_borderBottom ? 1 : 0)) + 'px';
		}
	};

    this.setOrder = function(order) {
		m_order = order + 1;
		
		if (m_border) {
			m_border.style.zIndex = m_order;
		}

		m_element.style.zIndex = m_order + 1;
		
		return m_order + 2;
	};
	
	this.setOverflow = function(overflow) {
		m_element.style.overflow = overflow;
	};
	
	this.setOverflowX = function(overflow) {
		m_element.style.overflowX = overflow;
	};
	
	this.setOverflowY = function(overflow) {
		m_element.style.overflowY = overflow;
	};
	
	this.setPadding = function(padding) {
		m_padding = padding;
		m_element.style.padding = padding + 'px';
	};
    
    this.setSize = function(width, height) {
		this.setWidth(width);
		this.setHeight(height);
	};

	this.setTabIndex = function(index) {
	    m_element.tabIndex = index;
	};
    
    this.setTag = function(tag) {
		m_tag = tag;
	};
	
	this.setText = function(text) {
		m_element.innerHTML = text;
	};

	this.setTooltip = function(text) {
		m_element.title = text;
	};

	this.setWidth = function(width) {
		m_element.style.width = width + 'px';
		m_width = width + m_padding * 2;
		
		adjustBorderWidth();
	};

	this.setWordWrap = function() {
		m_element.style.wordWrap = 'break-word';
	};
	
	this.setX = function(x) {
		m_element.style.left  = x + 'px';
		m_x = x;
		
		if (m_border) {
			m_border.style.left = (x - (m_borderLeft ? 1 : 0)) + 'px';
		}
	};
	
	this.setY = function(y) {
		m_element.style.top  = y + 'px';
		m_y = y;
		
		if (m_border) {
			m_border.style.top  = (y - (m_borderTop ? 1 : 0)) + 'px';
		}
	};
	
	this.show = function() {
		setVisibility('visible');
		m_visible = true;
	};
	
	m_element.className      = (className === undefined || className == null) ? 'transparentWrapper' : className;
	m_element.style.position = 'absolute';

	if (m_parent) {
		m_parent.appendChild(m_element);
	} else {
		document.body.appendChild(m_element);
	}
	
	m_height = m_element.offsetHeight;
	m_width  = m_element.offsetWidth;

	setVisibility('hidden');

};

function TButton(caption, margin) {
	var m_alignment    = 0;
	var m_leftObject   = new TBrick('buttonLeft');
	var m_middleObject = new TBrick('buttonMiddle');
	var m_rightObject  = new TBrick('buttonRight');
	var m_caption      = new TText(caption);
	var m_wrapper      = new TBrick();
	var m_margin       = ((margin === undefined) || (margin == null)) ? 10 : margin;
	var m_enabled      = true;
	var m_pressed      = false;
	var m_onClickCallback = null;
	
	var setNormalImage = function() {
		m_leftObject.setBackgroundImage('images/btn/nl.png');
		m_middleObject.setBackgroundImage('images/btn/nm.png');
		m_rightObject.setBackgroundImage('images/btn/nr.png');
	};
	
	var onClick = function() {
		if (m_enabled && m_onClickCallback != null) {
			m_onClickCallback();
		}
	};
	
	var onMouseDown = function() {
		if (m_enabled) {
			m_leftObject.setBackgroundImage('images/btn/pl.png');
			m_middleObject.setBackgroundImage('images/btn/pm.png');
			m_rightObject.setBackgroundImage('images/btn/pr.png');
			m_pressed = true;
		}
	};
	
	var onMouseUp = function() {
		if (m_enabled) {
			setNormalImage();
			m_pressed = false;
		}
	};
	
	m_wrapper.addEvent('click', onClick);
	m_wrapper.addEvent('mousedown', onMouseDown);
	m_wrapper.addEvent('mouseout', onMouseUp);
	m_wrapper.addEvent('mouseup', onMouseUp);
	m_wrapper.setCursor('pointer');
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.disable = function() {
		if (m_enabled) {
			m_leftObject.setBackgroundImage('images/btn/dl.png');
			m_middleObject.setBackgroundImage('images/btn/dm.png');
			m_rightObject.setBackgroundImage('images/btn/dr.png');
			m_caption.setColor('808080');
			m_wrapper.setCursor('default');
			m_enabled = false;
		}
	};
	
	this.enable = function() {
		if (!m_enabled) {
			setNormalImage();
			m_caption.setColor('000000');
			m_wrapper.setCursor('pointer');
			m_enabled = true;
		}
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};

	this.getHeight = function() {
		return m_leftObject.getHeight() - 1;
	};
	
	this.getWidth = function() {
		return m_leftObject.getWidth() + m_caption.getWidth() + m_rightObject.getWidth() + m_margin * 2 - 1;
	};

	this.getWrapperElement = function() {
		return m_wrapper.getElement();
	};

	this.hide = function() {
		m_leftObject.hide();
		m_middleObject.hide();
		m_rightObject.hide();
		m_caption.hide();
		m_wrapper.hide();
	};
	
	this.move = function(x, y) {
		m_leftObject.move(x, y);
		m_middleObject.move(x + m_leftObject.getWidth(), y);
		
		var middleWidth = m_caption.getWidth() + m_margin * 2;
		
		m_middleObject.setWidth(middleWidth);
		m_rightObject.move(x + m_leftObject.getWidth() + middleWidth, y);
		m_caption.move(x + m_leftObject.getWidth() + m_margin, y + (m_rightObject.getHeight() - m_caption.getHeight()) / 2);
		m_wrapper.move(x, y);
		m_wrapper.setSize(this.getWidth(), this.getHeight());
	};
	
	this.setOnClick = function(callback) {
		m_onClickCallback = callback;
	};
	
	this.setOrder = function(order) {
		order++;
		
		m_leftObject.setOrder(order);
		m_middleObject.setOrder(order);
		order = m_rightObject.setOrder(order);
		order = m_caption.setOrder(order);

		return m_wrapper.setOrder(order);
	};
	
	this.show = function() {
		m_leftObject.show();
		m_middleObject.show();
		m_rightObject.show();
		m_caption.show();
		m_wrapper.show();
	};
};

function TCaller(mcallback, parameter) {
	this.callback = function() {
		mcallback(parameter);
	};
};

function TChangeValidator(parentValidator) {
	var m_callback        = null;
	var m_originalValue   = null;
	var m_parentValidator = parentValidator === undefined ? null : parentValidator;
	var m_state           = null;

	this.getPhrase = function() {
		return m_parentValidator ? m_parentValidator.getPhrase() : TLang.translate('thisIsValid');
	};

	this.setCallback = function(callback) {
		m_callback = callback;
	};

	this.setOriginalValue = function(originalValue) {
		m_originalValue = originalValue;
		m_state = null;
	};

	this.validate = function(value) {
		var validity = m_parentValidator != null ? m_parentValidator.validate(value) : true;

		if (m_originalValue != value) {
			if (m_state == null || m_state == true) {
				m_state = false;

				if (m_callback) {
					m_callback();
				}
			}
		} else {
			validity = false;
			if (m_state == null || m_state == false) {
				m_state = true;

				if (m_callback) {
					m_callback();
				}
			}
		}

		return validity;
	};
};

function TChangingValidator(parentValidator) {
	var m_callback        = null;
	var m_previousValue   = null;
	var m_parentValidator = parentValidator === undefined ? null : parentValidator;

	this.getPhrase = function() {
		return m_parentValidator ? m_parentValidator.getPhrase() : TLang.translate('thisIsValid');
	};
	
	this.setCallback = function(callback) {
		m_callback = callback;
	};

	this.validate = function(value) {
		var validity = m_parentValidator ? m_parentValidator.validate(value) : true;

		if (m_previousValue != value) {
			m_previousValue = '' + value;
			
			if (m_callback != null) {
				m_callback();
			}
		}

		return validity;
	};
};

function TCheckBox(labelText, boxPosition /* 0 - left, 1 - right */, padding) {
	var m_alignment         = 0;
	var m_box               = new TBrick('checkbox');
	var m_checked           = false;
	var m_enabled           = true;
	var m_label             = new TText(labelText);
	var m_labelHeight       = labelText == "" ? 0 : m_label.getHeight();
	var m_onCheckCallback   = null;
	var m_onUncheckCallback = null;
	var m_padding           = padding === undefined ? 7 : padding;
	var m_this              = this;
	var m_wrapper           = new TBrick();

	m_wrapper.setCursor('pointer');
	m_wrapper.setSize(m_box.getWidth() + m_label.getWidth() + m_padding, m_box.getHeight() > m_labelHeight ? m_box.getHeight() : m_labelHeight);
	
	var onClick = function() {
		if (m_enabled) {
			if (m_checked) {
				m_box.setBackgroundImage('images/cbxh.png');
				m_checked = false;
			
				if (m_onUncheckCallback != null) {
					m_onUncheckCallback();
				}
			} else {
				m_box.setBackgroundImage('images/cbxhs.png');
				m_checked = true;
			
				if (m_onCheckCallback != null) {
					m_onCheckCallback();
				}
			}
		}
	};
	
	var onMouseOut = function() {
		if (m_enabled) {
			if (m_checked) {
				m_box.setBackgroundImage('images/cbxns.png');
			} else {
				m_box.setBackgroundImage('images/cbxn.png');
			}
		}
	};
	
	var onMouseOver = function() {
		if (m_enabled) {
			if (m_checked) {
				m_box.setBackgroundImage('images/cbxhs.png');
			} else {
				m_box.setBackgroundImage('images/cbxh.png');
			}
		}
	};
	
	m_wrapper.addEvent('click', onClick);
	m_wrapper.addEvent('mouseout', onMouseOut);
	m_wrapper.addEvent('mouseover', onMouseOver);
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};

	this.check = function(mayCallback) {
		if (!m_checked) {
			m_box.setBackgroundImage(m_enabled ? 'images/cbxns.png' : 'images/cbxds.png');
			m_checked = true;
			
			if (mayCallback !== undefined && mayCallback && m_onCheckCallback != null) {
				m_onCheckCallback();
			}
		}
	};

	this.disable = function() {
		if (m_enabled) {
			if (m_checked) {
				m_box.setBackgroundImage('images/cbxds.png');
			} else {
				m_box.setBackgroundImage('images/cbxd.png');
			}

			m_label.setColor('808080');
			m_wrapper.setCursor('default');
			m_enabled = false;
		}
	};
	
	this.enable = function() {
		if (!m_enabled) {
			if (m_checked) {
				m_box.setBackgroundImage('images/cbxns.png');
			} else {
				m_box.setBackgroundImage('images/cbxn.png');
			}

			m_label.setColor('000000');
			m_wrapper.setCursor('pointer');
			m_enabled = true;
		}
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		return m_wrapper.getHeight();
	};
	
	this.getWidth = function() {
		return m_wrapper.getWidth();
	};
	
	this.hide = function() {
		m_box.hide();
		m_label.hide();
		m_wrapper.hide();
	};
	
	this.isChecked = function() {
		return m_checked;
	};
	
	this.move = function(x, y) {
		m_box.move(x, y + (m_box.getHeight() > m_labelHeight ? 0 : ((m_labelHeight - m_box.getHeight()) / 2)));
		m_label.move(x + m_box.getWidth() + m_padding, y + (m_box.getHeight() < m_labelHeight ? 0 : ((m_box.getHeight() - m_labelHeight) / 2)));
		m_wrapper.move(x, y);
	};

	this.setChecked = function(checked) {
		checked ? m_this.check() : m_this.uncheck();
	};

	this.setOnChange = function(callback) {
		m_onCheckCallback = callback;
		m_onUncheckCallback = callback;
	};

	this.setOnCheck = function(callback) {
		m_onCheckCallback = callback;
	};
	
	this.setOnUncheck = function(callback) {
		m_onUncheckCallback = callback;
	};
	
	this.setOrder = function(order) {
		order++;
		
		m_box.setOrder(order);

		order = m_label.setOrder(order);		
		
		return m_wrapper.setOrder(order);
	};
	
	this.show = function() {
		m_box.show();
		m_label.show();
		m_wrapper.show();
	};
	
	this.uncheck = function() {
		if (m_checked) {
			m_box.setBackgroundImage(m_enabled ? 'images/cbxn.png' : 'images/cbxd.png');
			m_checked = false;
			
			if (m_onUncheckCallback != null) {
				m_onUncheckCallback();
			}
		}
	};
};

function TCheckBoxGroup(mode /* Single || Multi */, label, direction, padding) {
	var m_alignment         = 0;
	var m_dir               = (direction == 'ltr' || direction == 'rtl') ? direction : 'ltr';
	var m_enabled           = true;
	var m_gbItems           = new TGroupBox(label);
	var m_items             = new Array();
	var m_mode              = (mode === undefined || mode == null || (mode != 'Single' && mode != 'Multi')) ? 'Single' : mode;
	var m_padding           = padding === undefined ? 7 : padding;
	var m_this              = this;
	
	if (m_dir == 'ltr') { m_gbItems.alignLeft(); } else { m_gbItems.alignRight(); }
	
	var uncheckItems = function() {
		for (var i = 0; i < m_items.length; i++) {
			m_items[i].item.uncheck();
		}
	};
	
	this.add = function(id, text, isChecked, changeCallback) {
		var pos = (m_dir == 'ltr') ? 0 : 1;
		var chkBox = new TCheckBox(text, pos, m_padding);
		
		if (pos) {
			chkBox.alignRight();
		} else {
			chkBox.alignLeft();
		}
		
		isChecked = (isChecked === undefined || isChecked == null) ? false : isChecked;
		if (isChecked) {
			if (m_mode == 'Single') {
				uncheckItems();
			}
			chkBox.check();
		}
		
		if (changeCallback !== undefined && changeCallback != null) {
			chkBox.setOnChange(changeCallback);
		}
		
		m_gbItems.add(chkBox);
		
		m_items.push({ id: id, item: chkBox });
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
		m_gbItems.alignLeft();
	};
	
	this.alignRight = function() {
		m_alignment = 2;
		m_gbItems.alignRight();
	};

	this.check = function(id, mayCallback) {
		for (var i = 0; i < m_items.length; i++) {
			if (m_items[i].id == id) {
				if (m_mode == 'Single') {
					uncheckItems();	
				}
				
				m_items[i].item.check(mayCallback);
				break;
			}
		}
	};
	
	this.checkAll = function() {
		if (m_mode == 'Multi') {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].item.check();
			}
		}
	};
	
	this.disable = function() {
		if (m_enabled) {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].item.disable();
			}
			m_enabled = false;
		}
	};
	
	this.enable = function() {
		if (!m_enabled) {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].item.enable();
			}
			m_enabled = true;
		}
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getCheckedIds = function() {
		var chkItems = new Array();
		
		for (var i = 0; i < m_items.length; i++) {
			if (m_items[i].item.isChecked()) {
				chkItems.push({ id: m_items[i].id });
				if (m_mode == 'Single') { break; }
			}
		}
		
		return chkItems;
	};
	
	this.getHeight = function() {
		return m_gbItems.getHeight();
	};
	
	this.getUncheckedIds = function() {
		var unchkItems = new Array();
		
		for (var i = 0; i < m_items.length; i++) {
			if (!m_items[i].item.isChecked()) {
				unchkItems.push({ id: m_items[i].id });
			}
		}
		
		return unchkItems;
	};
	
	this.getWidth = function() {
		return m_gbItems.getWidth();
	};
	
	this.hide = function() {
		m_gbItems.hide();
	};
	
	this.isChecked = function(id) {
		for (var i = 0; i < m_items.length; i++) {
			if (m_items[i].id == id) {
				return m_items[i].item.isChecked();
			}
		}
		return null;
	};
	
	this.move = function(x, y) {
		m_gbItems.move(x, y);
	};

	this.setChecked = function(id, checked) {
		checked ? m_this.check(id) : m_this.uncheck(id);
	};
	
	this.setCheckedIds = function(ids) {
		uncheckItems();
		
		if (m_mode == 'Single') {
			for (var j = 0; j < m_items.length; j++) {
				if (ids[0] == m_items[j].id) {
					m_items[j].item.check();
					break;
				}
			}
		} else {
			for (var i = 0; i < ids.length; i++) {
				for (var j = 0; j < m_items.length; j++) {
					if (ids[i] == m_items[j].id) {
						m_items[j].item.check();
						break;
					}
				}
			}
		}
	};
	
	this.setDirection = function(dir) {
		m_dir = (dir == 'ltr' || dir == 'rtl') ? dir : 'ltr';
	};
	
	this.setOnChange = function(callback) {
		for (var i = 0; i < m_items.length; i++) {
			m_items[i].item.setOnChange(callback);
		}
	};

	this.setOnCheck = function(callback) {
		for (var i = 0; i < m_items.length; i++) {
			m_items[i].item.setOnCheck(callback);
		}
	};
	
	this.setOnUncheck = function(callback) {
		for (var i = 0; i < m_items.length; i++) {
			m_items[i].item.setOnUncheck(callback);
		}
	};
	
	this.setOrder = function(order) {
		order++;		
		
		return m_gbItems.setOrder(order);
	};
	
	this.show = function() {
		if (m_items.length) {
			m_gbItems.show();
		}
	};
	
	this.uncheck = function(id) {
		if (m_mode == 'Multi') {
			for (var i = 0; i < m_items.length; i++) {
				if (m_items[i].id == id) {
					m_items[i].item.uncheck();
					break;
				}
			}
		}
	};
	
	this.uncheckAll = function() {
		if (m_mode == 'Multi') {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].item.uncheck();
			}
		}
	};
};

function TColorPicker() {
	var m_alignment                  = 0;
    var m_brkBackground              = new TBrick();
    var m_brkBorder                  = new TBrick();
    var m_colors                     = new Array();
    var m_colorBricks                = new Array();
    var m_height                     = 0;
    var m_layout                     = new TVerticalLayout();
    var m_onSelectColorCallback      = null;
    var m_selectedColor              = null;
    var m_tbHighlighted              = new TTextBox(70);
    var m_tbSelected                 = new TTextBox(70);
    var m_txtH                       = new TText(TLang.translate('highlighted'));
    var m_txtHC                      = new TText('#FFFFFF');
    var m_txtS                       = new TText(TLang.translate('selected'));
    var m_txtSC                      = new TText('#FFFFFF');
    var m_width                      = 0;
    
    m_brkBorder.setBorder('#AFCCEE', 1, 1, 1, 1);
    m_brkBackground.setBorder('#FFFFFF', 1, 1, 1, 1);
    m_colors = ["#000000", "#000000", "#000000", "#000000", "#003300", "#006600", "#009900", "#00CC00", "#00FF00", "#330000", "#333300", "#336600", "#339900", "#33CC00", "#33FF00", "#660000", "#663300", "#666600", "#669900", "#66CC00", "#66FF00", 
                "#000000", "#333333", "#000000", "#000033", "#003333", "#006633", "#009933", "#00CC33", "#00FF33", "#330033", "#333333", "#336633", "#339933", "#33CC33", "#33FF33", "#660033", "#663333", "#666633", "#669933", "#66CC33", "#66FF33", 
                "#000000", "#666666", "#000000", "#000066", "#003366", "#006666", "#009966", "#00CC66", "#00FF66", "#330066", "#333366", "#336666", "#339966", "#33CC66", "#33FF66", "#660066", "#663366", "#666666", "#669966", "#66CC66", "#66FF66", 
                "#000000", "#999999", "#000000", "#000099", "#003399", "#006699", "#009999", "#00CC99", "#00FF99", "#330099", "#333399", "#336699", "#339999", "#33CC99", "#33FF99", "#660099", "#663399", "#666699", "#669999", "#66CC99", "#66FF99", 
                "#000000", "#CCCCCC", "#000000", "#0000CC", "#0033CC", "#0066CC", "#0099CC", "#00CCCC", "#00FFCC", "#3300CC", "#3333CC", "#3366CC", "#3399CC", "#33CCCC", "#33FFCC", "#6600CC", "#6633CC", "#6666CC", "#6699CC", "#66CCCC", "#66FFCC", 
                "#000000", "#FFFFFF", "#000000", "#0000FF", "#0033FF", "#0066FF", "#0099FF", "#00CCFF", "#00FFFF", "#3300FF", "#3333FF", "#3366FF", "#3399FF", "#33CCFF", "#33FFFF", "#6600FF", "#6633FF", "#6666FF", "#6699FF", "#66CCFF", "#66FFFF", 
                "#000000", "#FF0000", "#000000", "#990000", "#993300", "#996600", "#999900", "#99CC00", "#99FF00", "#CC0000", "#CC3300", "#CC6600", "#CC9900", "#CCCC00", "#CCFF00", "#FF0000", "#FF3300", "#FF6600", "#FF9900", "#FFCC00", "#FFFF00", 
                "#000000", "#00FF00", "#000000", "#990033", "#993333", "#996633", "#999933", "#99CC33", "#99FF33", "#CC0033", "#CC3333", "#CC6633", "#CC9933", "#CCCC33", "#CCFF33", "#FF0033", "#FF3333", "#FF6633", "#FF9933", "#FFCC33", "#FFFF33", 
                "#000000", "#0000FF", "#000000", "#990066", "#993366", "#996666", "#999966", "#99CC66", "#99FF66", "#CC0066", "#CC3366", "#CC6666", "#CC9966", "#CCCC66", "#CCFF66", "#FF0066", "#FF3366", "#FF6666", "#FF9966", "#FFCC66", "#FFFF66", 
                "#000000", "#FFFF00", "#000000", "#990099", "#993399", "#996699", "#999999", "#99CC99", "#99FF99", "#CC0099", "#CC3399", "#CC6699", "#CC9999", "#CCCC99", "#CCFF99", "#FF0099", "#FF3399", "#FF6699", "#FF9999", "#FFCC99", "#FFFF99", 
                "#000000", "#00FFFF", "#000000", "#9900CC", "#9933CC", "#9966CC", "#9999CC", "#99CCCC", "#99FFCC", "#CC00CC", "#CC33CC", "#CC66CC", "#CC99CC", "#CCCCCC", "#CCFFCC", "#FF00CC", "#FF33CC", "#FF66CC", "#FF99CC", "#FFCCCC", "#FFFFCC", 
                "#000000", "#FF00FF", "#000000", "#9900FF", "#9933FF", "#9966FF", "#9999FF", "#99CCFF", "#99FFFF", "#CC00FF", "#CC33FF", "#CC66FF", "#CC99FF", "#CCCCFF", "#CCFFFF", "#FF00FF", "#FF33FF", "#FF66FF", "#FF99FF", "#FFCCFF", "#FFFFFF"];
    
    var addColorBrick = function(index, color) {
    	var brk = new TBrick();
    	brk.setSize(15, 15);
    	brk.setBackground(color);
    	
    	var click = new TCaller(onColorClick, index);
    	var over = new TCaller(onColorOver, index);
    	
    	brk.addEvent('click', click.callback);
    	brk.addEvent('mouseover', over.callback);
    	
    	m_colorBricks.push({ brk: brk });
    };
    
    var clear = function() {
    	for (var i = 0; i < m_colorBricks.length; i++) {
    		m_colorBricks[i].brk.destroy();	
    	}
    };
    
    var onColorClick = function(index) {
    	m_selectedColor = m_colors[index];
    	m_tbSelected.setBackground(m_colors[index]);
    	m_txtSC.setText(m_colors[index]);
    	
    	if (m_onSelectColorCallback != null) {
    		m_onSelectColorCallback();
    	}
    };
    
    var onColorOver = function(index) {
    	m_tbHighlighted.setBackground(m_colors[index]);
    	m_txtHC.setText(m_colors[index]);
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
    
    this.getHeight = function() {
    	m_height = (m_layout.getHeight() > 180) ? m_layout.getHeight() : 180;
    	m_height += 10;
    	return m_height;
    };
    
    this.getSelectedColor = function() {
    	return m_selectedColor;
    };
    
    this.getWidth = function() {
    	m_width = 315 + m_layout.getWidth() + 10;
    	
    	return m_width;
    };
    
    this.hide = function() {
    	m_brkBackground.hide();
    	m_brkBorder.hide();
    	
    	for (var i = 0; i < m_colorBricks.length; i++) {
    		m_colorBricks[i].brk.hide();
    	}
    	
    	m_layout.hide();
    	
    	clear();
    };
    
    this.move = function(x, y) {
	    m_brkBorder.move(x, y);
	    m_brkBorder.setSize(m_width, m_height);

	    m_brkBackground.move(x + 1, y + 1);
	    m_brkBackground.setSize(m_width - 2, m_height - 2);
	    
	    var headX = x + 3;
	    var headY = y + 5;
	    for (var i = 0; i < m_colorBricks.length; i++) {
    		if (i % 21 == 0 && i != 0) {
    			headX = x + 3;
    			headY += 15;
    		}
    		m_colorBricks[i].brk.move(headX, headY);
    		headX += 15;
    	}
    	
    	m_layout.move(x + 322, y + 5);
    	m_txtSC.setText('');
    };
    
    this.setOnSelectColorCallback = function(callback) {
    	m_onSelectColorCallback = callback;
    };
    
    this.setOrder = function(order) {
    	order = m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1));
    	m_layout.setOrder(order + 1);
    	for (var i = 0; i < m_colorBricks.length; i++) {
    		m_colorBricks[i].brk.setOrder(order + 2);
    	}
    	return order + 3;
    };
    
    this.setSelectedColor = function(color) {
    	m_selectedColor = color;
    	m_tbSelected.setBackground(color);
    	m_txtSC.setText(color.toUpperCase());
    };
    
    this.show = function() {
    	m_brkBackground.show();
    	m_brkBorder.show();
    	
    	for (var i = 0; i < m_colorBricks.length; i++) {
    		m_colorBricks[i].brk.show();
    	}
    	
    	m_layout.show();
    };
    
    for (var i = 0; i < m_colors.length; i++) {
    	addColorBrick(i, m_colors[i]);
    }
    
    m_layout.add(m_txtH);
    m_tbHighlighted.setReadOnly();
    m_layout.add(m_tbHighlighted);
    m_layout.add(m_txtHC);
    m_layout.add(new TVerticalDelimiter(5));
    m_layout.add(m_txtS);
    m_tbSelected.setReadOnly();
    m_layout.add(m_tbSelected);
    m_layout.add(m_txtSC);
};

function TCommandsList() {
	var m_brkList      = new TBrick('ddWrapper');
	var m_brkSeperator = new TBrick();
	var m_commands     = new Array();
	var m_height       = 0;
	var m_lists        = new Array();
	var m_padding      = 2;
	var m_this         = this;
	var m_width        = 0;
	
	m_brkList.setBackground('#FFFFFF');
	m_brkList.setBorder('#80B0D0', 1, 1, 1, 1);
	m_brkSeperator.setBackground('url(images/VSeperator.png) repeat-y left top'); // #4371B0
	
	var getCommandIndex = function(id) {
		for (var i = 0; i < m_commands.length; i++) {
			if (m_commands[i].id == id) {
				return i;
			}
		}
		return null;
	};
	
	var hideLists = function() {
		for (var i = 0; i < m_lists.length; i++) {
			m_lists[i].list.hide();
		}
	};
	
	var onCmdClick = function(id) {
		var index = getCommandIndex(id);
		if (m_commands[index].enabled == true) {
			if (m_commands[index].callback != null && m_commands[index].isParent == false) {
				m_commands[index].callback();
			}
			m_this.hide();
		}
	};
	
	var onCmdOut = function(id) {
		var index = getCommandIndex(id);
		if (m_commands[index].enabled == true) { 
			m_commands[index].background.setBackground('#ffffff');
		}
	};
	
	var onCmdOver = function(id) { 
		hideLists();
		var index = getCommandIndex(id);
		if (m_commands[index].enabled == true) { 
			m_commands[index].background.setBackground('#ffd0a0');
			if (m_commands[index].isParent == true) {
				var x = m_commands[index].background.getX() + m_commands[index].background.getWidth() + 1;
				var y = m_commands[index].background.getY();
				showList(id, x, y);
			}
		}
	};
	
	var setParent = function(parentId) {
		for (var i = 0; i < m_commands.length; i++) {
			if (m_commands[i].id == parentId) {
				m_commands[i].isParent = true;
				var arrowBack = new TBrick();
				arrowBack.setBackground('url(images/tbl/inc.png) no-repeat left top');
				arrowBack.setSize(8, 12);
				m_commands[i].arrow = arrowBack;
				break;
			}
		}
	};
	
	var showList = function(id, x, y) {
		for (var i = 0; i < m_lists.length; i++) {
			if (m_lists[i].id == id) {
				m_lists[i].list.show(x, y);
			}
		}
	};
	
	this.add = function(id, command, callback, nIconUrl, parentId) {
		if (parentId != null) {
			var index = -1;
			for (var i = 0; i < m_lists.length; i++) {
				if (m_lists[i].id == parentId) {
					index = i;
					break;	
				}
			}
			if (index != -1) {
				m_lists[index].list.add(id, command, callback, nIconUrl);
			} else {
				var lst = new TCommandsList();
				lst.add(id, command, callback, nIconUrl);
				m_lists.push({ id: parentId, list: lst });
				setParent(parentId);
			}
		} else {
			callback = (callback === undefined || callback == null) ? null : callback;
		    nIconUrl = (nIconUrl === undefined || nIconUrl == null) ? null : "url(" + nIconUrl + ") no-repeat left top";
		    parentId = (parentId === undefined || parentId == null) ? null : parentId;
		    
		    var cover     = new TBrick();
			var cmdClick = new TCaller(onCmdClick, id);
			var cmdOut   = new TCaller(onCmdOut, id);
			var cmdOver  = new TCaller(onCmdOver, id);
			
			cover.addEvent('mouseout', cmdOut.callback);
			cover.addEvent('mouseover', cmdOver.callback);
			cover.addEvent('click', cmdClick.callback);
			
			var iconBack = null;
			
			if (nIconUrl != null) {
				iconBack = new TBrick();
				iconBack.setSize(24, 24);
				iconBack.setBackground(nIconUrl);
			} 
			
			m_commands.push({ id: id, command: new TText(command), background: new TBrick(), cover: cover, callback: callback, enabled: true, icon: iconBack, nUrl: nIconUrl, isParent: false, arrow: null });	
		}
	};
	
	this.clear = function () {
	    while (m_commands.length) {
	        m_commands[m_commands.length - 1].background.destroy();
	        m_commands[m_commands.length - 1].command.destroy();
	        m_commands[m_commands.length - 1].cover.destroy();
	        if (m_commands[m_commands.length - 1].icon != null) { m_commands[m_commands.length - 1].icon.destroy(); }
	        if (m_commands[m_commands.length - 1].isParent) { m_commands[m_commands.length - 1].arrow.destroy(); }
	        m_commands.splice(m_commands.length - 1, 1);
	    }
	    for (var i = 0; i < m_lists.length; i++) {
	    	m_lists[i].list.clear();
	    }
	};
	
	this.disable = function(id) {
		var index = getCommandIndex(id);
		if (index === undefined || index == null) {
			for (var i = 0; i < m_lists.length; i++) {
				var res = m_lists[i].list.disable(id);
				if (res) {
					return true;
				} 
			}
		} else {
			m_commands[index].enabled = false;
			m_commands[index].command.setColor('#E0E0E0');
			return true;
		}
	};
	
	this.enable = function(id) {
		var index = getCommandIndex(id);
		if (index === undefined || index == null) {
			for (var i = 0; i < m_lists.length; i++) {
				var res = m_lists[i].list.enable(id);
				if (res) {
					return true;
				} 
			}
		} else {
			m_commands[index].enabled = true;
			m_commands[index].command.setColor('#000000');
			return true;
		}
	};
	
	this.getAlignment = function() {
		return 0;
	};
	
	this.getHeight = function() {
		m_height = 0;
		
		for (var i = 0; i < m_commands.length; i++) {
			m_height += Math.max(m_commands[i].command.getHeight() + m_padding * 2, 24 + m_padding * 2);	
		}
			
		return m_height;
	};
	
	this.getWidth = function() {
		m_width = 0;
		
		for (var i = 0; i < m_commands.length; i++) {
			var width = m_commands[i].command.getWidth() + 24;
			if (m_commands[i].isParent == true) { width += m_commands[i].arrow.getWidth(); }
			
			if (m_width < width) {
				m_width = width;
			}
		}
		
		m_width += m_padding * 8 + 2;
			
		return m_width;
	};
	
	this.hide = function() {
		m_brkList.hide();
		m_brkSeperator.hide();
		
		for (var i = 0; i < m_commands.length; i++) {
			m_commands[i].background.hide();
			m_commands[i].command.hide();
			m_commands[i].cover.hide();
			if (m_commands[i].icon != null) { m_commands[i].icon.hide(); }
			if (m_commands[i].arrow != null) { m_commands[i].arrow.hide(); }
		}
		
		hideLists();
	};
	
	this.move = function(x, y) {
		m_this.getWidth();
		m_this.getHeight();
		
		m_brkList.move(x, y);
		m_brkList.setSize(m_width, m_height);
		
		m_brkSeperator.move(x + 24 + m_padding * 2, y + 1);
		m_brkSeperator.setSize(2, m_height - 2);
		
		var itemY = y;
		
		for (var i = 0; i < m_commands.length; i++) {
			var itemHeight = Math.max(m_commands[i].command.getHeight() + m_padding * 2, 24 + m_padding * 2);

			m_commands[i].background.move(x, itemY);
			m_commands[i].background.setSize(m_width, itemHeight);
			m_commands[i].cover.move(x, itemY);
			m_commands[i].cover.setSize(m_width, itemHeight);
			m_commands[i].command.move(x + 26 + m_padding * 4 , itemY + (itemHeight - m_commands[i].command.getHeight()) / 2);
			if (m_commands[i].icon != null) { m_commands[i].icon.move(x + m_padding, itemY + m_padding); }
			if (m_commands[i].arrow != null) { m_commands[i].arrow.move(x + m_width - m_padding - m_commands[i].arrow.getWidth(), itemY + (m_commands[i].background.getHeight() - m_commands[i].arrow.getHeight()) / 2); }
			
			itemY += itemHeight;
		}
	};
	
	this.setCommandCallback = function(cmd, callback) {
		for (var i = 0; i < m_commands.length; i++) {
			if (m_commands[i].command.getText() == cmd) {
				m_commands[i].callback = callback;
				return true;
			}
		}
		for (var i = 0; i < m_lists.length; i++) {
			var res = m_lists[i].list.setCommandCallback(cmd, callback);
			if (res) {
				return true;
			} 
		}
		return false;
	};
	
	this.setOrder = function(order) {
		m_brkList.setOrder(order + 200);
		m_brkSeperator.setOrder(order + 220);
		
		for (var i = 0; i < m_commands.length; i++) {
			m_commands[i].background.setOrder(order + 210);
			m_commands[i].command.setOrder(order + 220);
			m_commands[i].cover.setOrder(order + 240);
			if (m_commands[i].icon != null) { m_commands[i].icon.setOrder(order + 230); }
			if (m_commands[i].arrow != null) { m_commands[i].arrow.setOrder(order + 230); }
		}
		
		return order + 1;
	};
	
	this.setPadding = function(padding) {
		m_padding = padding;
	};
	
	this.show = function(x, y) {
		hideLists();
		
		m_this.setOrder(100);
		m_this.move(x, y);
		
		m_brkList.show();
		m_brkSeperator.show();
		
		for (var i = 0; i < m_commands.length; i++) {
			m_commands[i].background.show();
			m_commands[i].command.show();
			m_commands[i].cover.show();
			if (m_commands[i].icon != null) { m_commands[i].icon.show(); }
			if (m_commands[i].arrow != null) { m_commands[i].arrow.show(); }
		}
	};
};

function TCubeValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re    = /^\d+\.\d\d\d$/;
		var valid = false;
		
		if (!re.test(text)) {
			m_phrase = 'This must contain only numbers and decimal dot!';
		} else {
			valid = true;
			m_phrase = 'This is valid';
		}
		
		return valid;
	};
};

function TDropdownList() {
	var m_alignment               = 0;
	var m_button                  = new TBrick('dllButton');
	var m_cover                   = new TBrick();
	var m_ddHeight                = 0;
	var m_ddWrapper               = new TBrick('ddWrapper');
	var m_height                  = 0;
	var m_isDisabled              = false;
	var m_items                   = new Array();
	var m_itemsVisible            = false;
	var m_onChangeCallback        = null;
	var m_onMouseOutItemCallback  = null;
	var m_onMouseOverItemCallback = null;
	var m_order                   = 0;
	var m_padding                 = 2;
	var m_selectedId              = 0;
	var m_this                    = this;
	var m_timeout                 = 1000;
	var m_timerId                 = 0;
	var m_txtItem                 = new TText(' ');
	var m_width                   = 0;
	var m_wrapper                 = new TBrick();
	
	var closeDropdownPanel = function() {
		m_ddWrapper.hide();

		var m = m_items.length;

		for (var j = 0; j < m; j++) {
			m_items[j].background.hide();
			m_items[j].cover.hide();
			m_items[j].item.hide();
		}
		
		m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
		m_itemsVisible = false;
	};

	var onCoverClick = function () {
	    if (!m_isDisabled) {
	        if (!m_itemsVisible) {
	            m_ddWrapper.show();
	            
	            var n = m_items.length;

	            for (var i = 0; i < n; i++) {
	                m_items[i].background.show();
	                m_items[i].cover.show();
	                m_items[i].item.show();
	            }

	            m_button.setBackground("url('images/ddl/bd.gif') no-repeat left top");
	            m_itemsVisible = true;

	            if (m_timerId > 0) {
	                clearTimeout(m_timerId);
	                m_timerId = 0;
	            }
	        }
	    }
	};

	var onCoverOut = function () {
	    if (!m_isDisabled) {
	        if (!m_itemsVisible) {
	            m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
	        } else {
	            if (m_timerId == 0) {
	                m_timerId = setTimeout(onTimeout, m_timeout);
	            }
	        }
	    }
	};

	var onCoverOver = function () {
	    if (!m_isDisabled) {
	        if (!m_itemsVisible) {
	            m_button.setBackground("url('images/ddl/bo.gif') no-repeat left top");
	        } else {
	            if (m_timerId > 0) {
	                clearTimeout(m_timerId);
	                m_timerId = 0;
	            }
	        }
	    }
	};

	var onItemClick = function (id) {
	    if (!m_isDisabled) {
	    	var n = m_items.length;

	        for (var i = 0; i < n; i++) {
	            if (m_items[i].id == id) {
	                if (m_selectedId != id) {
	                    m_txtItem.setText(m_items[i].item.getText());
	                    m_selectedId = id;

	                    if (m_onChangeCallback) {
	                        m_onChangeCallback(id);
	                    }
	                }

	                closeDropdownPanel();
	                break;
	            }
	        }

	        clearTimeout(m_timerId);
	        m_timerId = 0;
	    }
	};

	var onItemOut = function (id) {
	    if (!m_isDisabled) {
	    	var n = m_items.length;

	        for (var i = 0; i < n; i++) {
	            if (m_items[i].id == id) {
	                m_items[i].background.setBackground('#ffffff');
	                break;
	            }
	        }

	        if (m_timerId == 0) {
	            m_timerId = setTimeout(onTimeout, m_timeout);
	        }
	        
	        if (m_onMouseOutItemCallback != null) {
	        	m_onMouseOutItemCallback();
	        }
	    }
	};

	var onItemOver = function (id) {
	    if (!m_isDisabled) {
	    	var n = m_items.length;

	        for (var i = 0; i < n; i++) {
	            if (m_items[i].id == id) {
	                m_items[i].background.setBackground('#ffd0a0');
	                break;
	            }
	        }

	        if (m_timerId > 0) {
	            clearTimeout(m_timerId);
	            m_timerId = 0;
	        }
	        
	        if (m_onMouseOverItemCallback != null) {
	        	m_onMouseOverItemCallback(id);
	        }
	    }
	};
	
	var onTimeout = function() {
		closeDropdownPanel();

		m_timerId = 0;
	};
	
	this.add = function(id, itemText) {
		var cover     = new TBrick();
		var itemClick = new TCaller(onItemClick, id);
		var itemOut   = new TCaller(onItemOut, id);
		var itemOver  = new TCaller(onItemOver, id);
		
		cover.addEvent('mouseout', itemOut.callback);
		cover.addEvent('mouseover', itemOver.callback);
		cover.addEvent('click', itemClick.callback);
		
		m_items.push({ id: id, item: new TText(itemText), background: new TBrick(), cover: cover });
		
		m_this.getWidth();
		m_this.getHeight();
	};

	this.clear = function () {
	    while (m_items.length) {
	        m_items[m_items.length - 1].item.destroy();
	        m_items[m_items.length - 1].background.destroy();
	        m_items.splice(m_items.length - 1, 1);
	    }
	    m_txtItem.setText('');
	};

	this.disable = function () {
	    m_isDisabled = true;
	    m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
	    m_wrapper.disable();
	    m_txtItem.disable();
	};

	this.enable = function () {
	    m_isDisabled = false;
	    m_wrapper.enable();
	    m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
	    m_txtItem.enable();
	};

	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		m_ddHeight = 0;
		m_height   = 0;
		
		var n = m_items.length;

		for (var i = 0; i < n; i++) {
			var height = m_items[i].item.getHeight();
			
			m_ddHeight += height + m_padding * 2;

			if (m_height < height) {
				m_height = height;
			}
		}

		m_height += m_padding * 2;
		
		if (m_height < 20) {
			m_height = 20;
		}

		return m_height + 2;
	};
	
	this.getItemsIds = function() {
		var ids = new Array;
		for (var i = 0; i < m_items.length; i++) {
			ids.push(m_items[i].id);
		}
		return ids;
	};
	
	this.getSelectedId = function() {
		return m_selectedId;
	};
	
	this.getText = function() {
		return m_txtItem.getText();
	};

	this.getWidth = function() {
		m_width = 0;

		var n = m_items.length;

		for (var i = 0; i < n; i++) {
			var width = m_items[i].item.getWidth();
			
			if (m_width < width) {
				m_width = width;
			}
		}
		
		m_width += m_padding * 4 + 18;

		return m_width + 2;
	};
	
	this.hide = function() {
		m_button.hide();
		m_cover.hide();
		m_ddWrapper.hide();
		m_txtItem.hide();
		m_wrapper.hide();
		
		var n = m_items.length;
		
		for (var i = 0; i < n; i++) {
			m_items[i].background.hide();
			m_items[i].cover.hide();
			m_items[i].item.hide();
		}
	};

	this.isDisabled = function () {
	    return m_isDisabled;
	};

	this.move = function(x, y) {
		m_button.move(x + m_width + 1 - 18, y + 1);
		
		m_cover.move(x, y);
		m_cover.setSize(m_width + 2, m_height + 2);
		
		m_ddWrapper.move(x + 1, y + 4 + m_height);
		m_ddWrapper.setSize(m_width - 18, m_ddHeight);
		
		var itemY = y + 4 + m_height;
		var n = m_items.length;

		for (var i = 0; i < n; i++) {
			var itemHeight = m_items[i].item.getHeight() + m_padding * 2;

			m_items[i].background.move(x + 1, itemY);
			m_items[i].background.setSize(m_width - 18, itemHeight);
			m_items[i].cover.move(x + 1, itemY);
			m_items[i].cover.setSize(m_width - 18, itemHeight);
			m_items[i].item.move(x + m_padding * 2 + 1, itemY + 1);
			
			var valX = x + m_padding * 2 + 1;
			var valY = itemY + 1;

			itemY += itemHeight;
		}
		
		m_txtItem.move(x + m_padding * 2 + 1, y + 1 + (m_height - m_txtItem.getHeight()) / 2);
		
		m_wrapper.move(x + 1, y + 1);
		m_wrapper.setSize(m_width, m_height);
	};
	
	this.remove = function(id) {
		for (var i = 0; i < m_items.length; i++) {
			if (m_items[i].id == id) {
				m_items[i].item.destroy();
		        m_items[i].background.destroy();
		        m_items.splice(i, 1);
		        return true;
			}
		}
		return false;
	};
	
	this.resetOrder = function() {
		var n = m_items.length;
		var orderBackground = m_order + 60;
		var orderItem       = m_order + 70;
		var orderCover      = m_order + 80;

		for (var i = 0; i < n; i++) {
			m_items[i].background.setOrder(orderBackground);
			m_items[i].cover.setOrder(orderCover);
			m_items[i].item.setOrder(orderItem);
		}
	};

	this.setOnChange = function(callback) {
		m_onChangeCallback = callback;
	};
	
	this.setOnItemOut = function(callback) {
		m_onMouseOutItemCallback = callback;
	};
	
	this.setOnItemOver = function(callback) {
		m_onMouseOverItemCallback = callback;
	};
	
	this.setOrder = function(order) {
		m_order = m_cover.setOrder(m_button.setOrder(m_txtItem.setOrder(m_wrapper.setOrder(order + 1))) + 1);

		m_ddWrapper.setOrder(m_order + 50);
		m_this.resetOrder();

		return m_order + 3;
	};
	
	this.setSelectedFirst = function() {
		if (m_items.length > 0) {
			m_selectedId = m_items[0].id;
			m_txtItem.setText(m_items[0].item.getText());
		}
	};

	this.setSelectedId = function(id) {
		var n = m_items.length;

		for (var i = 0; i < n; i++) {
			if (m_items[i].id == id) {
				m_selectedId = id;
				m_txtItem.setText(m_items[i].item.getText());
				break;
			}
		}
	};

	this.setSelectedItem = function(itemText) {
		var n = m_items.length;

		for (var i = 0; i < n; i++) {
			if (m_items[i].item.getText() == itemText) {
				m_selectedId = m_items[i].id;
				m_txtItem.setText(m_items[i].item.getText());
				break;
			}
		}
	};

	this.show = function () {
	    if (!m_isDisabled) {
	        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
	    } else {
	        m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
	    }

	    m_button.show();
	    m_cover.show();
	    m_txtItem.show();
	    m_wrapper.show();
	};
	
	m_cover.addEvent('click', onCoverClick);
	m_cover.addEvent('mouseout', onCoverOut);
	m_cover.addEvent('mouseover', onCoverOver);
	
	m_ddWrapper.setBackground('#FFFFFF');
	m_ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);
	
	m_wrapper.setBackground('#FFFFFF');
	m_wrapper.setBorder('#80B0D0', 1, 1, 1, 1);
};

function TEmailValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		var valid = false;
		
		if (text != '') {
			if (!re.test(text)) {
				m_phrase = TLang.translate('e-mailIsInvalid');
			} else {
				valid = true;
				m_phrase = TLang.translate('e-mailIsValid');
			}
		}
		
		return valid;
	};
};

function TEmptyValidator(callback) {
	var m_callback = callback === undefined ? null : callback;
	var m_phrase   = '';
	var m_valid    = null;
	
	this.clear = function() {
		m_valid = null;
	};

	this.getPhrase = function() {
		return m_phrase;
	};

	this.setCallback = function(callback) {
		m_callback = callback === undefined ? null : callback;
	};

	this.validate = function(text) {
		var strTemp = trim(text);
		var valid   = false;
		
		if (strTemp.length > 0) {
			valid = true;
			m_phrase = TLang.translate('thisIsValid');
		} else {
			m_phrase = TLang.translate('fieldMustnotBeEmpty');
		}
		
		if (m_valid != valid) {
			m_valid = valid;

			if (m_callback) {
				m_callback(valid);
			}
		}

		return valid;
	};
};

function TFileDownloadingWindow() {
	var m_callback    = null;
	var m_iframe      = null;
	var m_txtFilename = new TText('');
	var m_window      = createWindow(TLang.translate('downloadingFile'));
	
	var onCheckReadyState = function() {
		if (m_iframe && m_iframe.contentDocument) {
			if (m_iframe.contentDocument.readyState && m_iframe.contentDocument.readyState == 'complete') {
				onLoaded();
			} else {
				setTimeout(onCheckReadyState, 250);
			}
		}
	};

	var onLoaded = function() {
		setTimeout(onRemove, 250);
	};
	
	var onRemove = function() {
		if (m_iframe) {
			if (m_iframe.detachEvent) {
				m_iframe.detachEvent('onload', onLoaded);
			} else if (m_iframe.removeEventListener) {
				m_iframe.removeEventListener('load', onLoaded, false);
			}

			var response = '';

			if (m_iframe.contentDocument) {
				response = m_iframe.contentDocument.body.innerHTML;
			} else if (m_iframe.contentWindow) {
				response = m_iframe.contentWindow.document.body.innerHTML;
			} else if (m_iframe.document) {
				response = m_iframe.document.body.innerHTML;
			}

			m_iframe.parentNode.removeChild(m_iframe);
			m_iframe = null;
			
			hideModal();
			
			if (m_callback) {
				m_callback(response);
			}
		}
	};

	this.show = function(fileName, fileId, url, callback) {
		m_callback = callback;
		m_txtFilename.setText(TLang.translate('downloading') + ' ' + fileName);
		showModal(m_window);
		
		var formLocation = url + '?sessionId=' + g_sessionId + '&fileId=' + fileId;

		m_iframe               = document.createElement('iframe');
		m_iframe.style.left    = '0px';
		m_iframe.style.top     = '0px';
		m_iframe.style.width   = '1px';
		m_iframe.style.height  = '1px';
		m_iframe.style.border  = '1px';
		
		m_iframe.setAttribute('src', formLocation);
		m_iframe.onload = onLoaded;
		m_iframe.onreadystatechange = onLoaded;

		if (m_iframe.addEventListener) {
			m_iframe.addEventListener('load', onLoaded, true);
		} else if (m_iframe.attachEvent) {
			m_iframe.attachEvent('onload', onLoaded);
		} else if (m_iframe.contentWindow) {
			m_iframe.contentWindow.onLoad = onLoaded;
		}

		document.body.appendChild(m_iframe);
		setTimeout(onCheckReadyState, 250);
	};

	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_txtFilename);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(new TImage('images/ajax-loader3.gif', 220, 19));
	m_window.add(new TVerticalDelimiter(5));
};

function TFileUploader(title, accept) {
	var m_auxiliary      = document.createElement('input');
	var m_button         = new TButton(title);
	var m_callback       = null;
	var m_form           = document.createElement('form');
	var m_iframeId       = null;
	var m_input          = document.createElement('input');
	var m_sessionId      = document.createElement('input');
	var m_uploadCallback = null;
	var m_wndUploading   = null;
	var m_wrapper        = new TBrick('inputWrapper', m_form);

	var onChange = function() {
		m_input.blur();

		if (m_callback) {
			m_callback(this.files);
		}
	};
	
	var onUpload = function() {
		if (m_iframeId.detachEvent)
			m_iframeId.detachEvent('onload', onUpload);
		else
			m_iframeId.removeEventListener('load', onUpload, false);

		var response = '';

		if (m_iframeId.contentDocument) {
			response = m_iframeId.contentDocument.body.innerHTML;
		} else if (m_iframeId.contentWindow) {
			response = iframeId.contentWindow.document.body.innerHTML;
		} else if (m_iframeId.document) {
			response = m_iframeId.document.body.innerHTML;
		}

		setTimeout(onUploaded, 250);
		
		hideModal();
		
		if (m_uploadCallback) {
			m_uploadCallback(response);
		};
	};
	
	var onUploaded = function() {
		m_iframeId.parentNode.removeChild(m_iframeId);
	};
	
	this.getAlignment = function() {
		return 0;
	};
	
	this.getHeight = function() {
		return m_button.getHeight();
	};
	
	this.getValue = function() {
		return m_input.value;
	};
	
	this.getWidth = function() {
		return m_button.getWidth();
	};
	
	this.hide = function() {
		m_button.hide();
		m_wrapper.hide();
		m_input.style.visibility = 'hidden';
	};
	
	this.move = function(x, y) {
		m_button.move(x, y);
		m_wrapper.move(x, y);
		m_wrapper.setSize(m_button.getWidth(), m_button.getHeight());
		m_input.style.left   = '0px';
		m_input.style.top    = '0px';
		m_input.style.width  = m_button.getWidth() + 'px';
		m_input.style.height = m_button.getHeight() + 'px';
	};

	this.setOnClick = function(callback) {
		m_callback = callback;
	};

	this.setOrder = function(order) {
		order = m_wrapper.setOrder(m_button.setOrder(order));
		m_input.style.zIndex = order + 1;

		return order + 2;
	};
	
	this.show = function() {
		m_form.reset();
		m_button.show();
		m_wrapper.show();
		m_input.style.visibility = 'visible';
	};
	
	this.upload = function(actionURL, uploadCallback, auxiliaryParameters) {
		if (m_wndUploading == null) {
			m_wndUploading = new TFileUploadingWindow();
		}
		
		m_wndUploading.show();

		m_uploadCallback = uploadCallback;

		if (auxiliaryParameters === undefined || auxiliaryParameters == null) {
			m_auxiliary.setAttribute('value', '');
		} else {
			m_auxiliary.setAttribute('value', auxiliaryParameters);
		}

		var iframe = document.createElement('iframe');

		iframe.setAttribute('id', 'upload_iframe');
		iframe.setAttribute('name', 'upload_iframe');
		iframe.setAttribute('width', '0');
		iframe.setAttribute('height', '0');
		iframe.setAttribute('border', '0');
		iframe.setAttribute('style', 'width: 0; height: 0; border: none;');

		m_form.parentNode.appendChild(iframe);
		window.frames['upload_iframe'].name = 'upload_iframe';
		
		m_iframeId = document.getElementById('upload_iframe');
		
		if (m_iframeId.addEventListener)
			m_iframeId.addEventListener('load', onUpload, true);
		
		if (m_iframeId.attachEvent)
			m_iframeId.attachEvent('onload', onUpload);

		m_form.setAttribute('target', 'upload_iframe');
		m_form.setAttribute('action', actionURL);
		m_form.setAttribute('method', 'post');
		m_form.setAttribute('enctype', 'multipart/form-data');
		m_form.setAttribute('encoding', 'multipart/form-data');
		m_form.submit();
	};
	
	m_input.className = 'inputFile';
	m_input.setAttribute('name', 'attachment');
	m_input.setAttribute('id', 'attachment');
	m_input.setAttribute('type', 'file');
	m_input.setAttribute('value', 'Browsefile');
	m_input.setAttribute('accept', accept === undefined ? 'image/*' : accept);
	m_input.setAttribute('size', '0');
	m_input.style.visibility = 'hidden';
	
	m_auxiliary.setAttribute('type', 'hidden');
	m_auxiliary.setAttribute('name', 'Auxiliary');

	m_sessionId.setAttribute('type', 'hidden');
	m_sessionId.setAttribute('name', 'SessionId');
	
	m_sessionId.setAttribute('value', g_sessionId);

	if (isFF()) {
		m_input.style.marginLeft = '-240px';
	}
	
	$$$$(m_input, 'change', onChange);
	
	m_wrapper.appendChild(m_input);
	m_form.appendChild(m_sessionId);
	m_form.appendChild(m_auxiliary);
	
	document.body.appendChild(m_form);
};

function TFileUploadingWindow() {
	var m_window = createWindow(TLang.translate('uploadingFile'));

	this.show = function() {
		showModal(m_window);
	};

	m_window.add(new TVerticalDelimiter(5));
	m_window.add(new TText(TLang.translate('uploadingFile')));
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(new TImage('images/ajax-loader3.gif', 220, 19));
	m_window.add(new TVerticalDelimiter(5));
};

function TFormLayout(verticalPadding, horizontalPadding) {
	var m_alignment         = 0;
	var m_direction         = 'ltr';
	var m_height            = 0;
	var m_horizontalPadding = horizontalPadding === undefined ? 7 : horizontalPadding;
	var m_objects           = new Array();
	var m_leftWidth         = 0;
	var m_middleWidth       = 0;
	var m_needCalculation   = true;
	var m_rightWidth        = 0;
	var m_verticalPadding   = verticalPadding === undefined ? 7 : verticalPadding;
	
	var calculateSize = function() {
		m_height      = m_verticalPadding * ((m_objects.length > 0) ? (m_objects.length - 1) : 0);
		m_leftWidth   = 0;
		m_middleWidth = 0;
		m_rightWidth  = 0;
		
		for (var i = 0; i < m_objects.length; i++) {
			if (m_objects[i].rightObject === undefined) {
				m_height += m_objects[i].leftObject.getHeight();
			
				if (m_objects[i].leftObject.getWidth() > m_middleWidth) {
					m_middleWidth = m_objects[i].leftObject.getWidth();
				}
			}
			else {
				m_height += m_objects[i].leftObject.getHeight() > m_objects[i].rightObject.getHeight() ? m_objects[i].leftObject.getHeight() : m_objects[i].rightObject.getHeight();
		
				if (m_objects[i].rightObject.getWidth() > m_rightWidth) {
					m_rightWidth = m_objects[i].rightObject.getWidth();
				}
			
				if (m_objects[i].leftObject.getWidth() > m_leftWidth) {
					m_leftWidth = m_objects[i].leftObject.getWidth();
				}
			}
		}
		
		m_needCalculation = false;
	};
	
	this.add = function(leftObject, rightObject) {
		if (m_direction == 'rtl') {
			var temp = leftObject;
			leftObject = rightObject;
			rightObject = temp;
		}
		
		if (leftObject.setDirection) {
			leftObject.setDirection(m_direction);
		}
		if (rightObject.setDirection) {
			rightObject.setDirection(m_direction);
		}
		
		m_objects[m_objects.length] = { leftObject: leftObject, rightObject: rightObject };
		m_needCalculation = true;
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
	
	this.getHeight = function() {
		if (m_needCalculation) {
			calculateSize();
		}

		return m_height;
	};

	this.getWidth = function() {
		if (m_needCalculation) {
			calculateSize();
		}

		var width = m_leftWidth + m_horizontalPadding + m_rightWidth;
		
		return width < m_middleWidth ? m_middleWidth : width;
	};
	
	this.hide = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].leftObject.hide();
			
			if (m_objects[i].rightObject !== undefined) {
				m_objects[i].rightObject.hide();
			}
		}
	};
	
	this.move = function(x, y) {
		var totalWidth = this.getWidth();
		
		for (var i = 0; i < m_objects.length; i++) {
			var leftObject = m_objects[i].leftObject;

			if (m_objects[i].rightObject === undefined) {
				leftObject.move(x + (totalWidth - leftObject.getWidth()) / 2, y);
				y += leftObject.getHeight() + m_verticalPadding;
			}
			else {
				var rightObject = m_objects[i].rightObject;
				
				if (leftObject.getHeight() < rightObject.getHeight()) {
					leftObject.move(x + m_leftWidth - leftObject.getWidth(), y + (rightObject.getHeight() - leftObject.getHeight()) / 2);
					rightObject.move(x + m_leftWidth + m_horizontalPadding, y);
					y += rightObject.getHeight();
				}
				else {
					leftObject.move(x + m_leftWidth - leftObject.getWidth(), y);
					rightObject.move(x + m_leftWidth + m_horizontalPadding, y + (leftObject.getHeight() - rightObject.getHeight()) / 2);
					y += leftObject.getHeight();
				}
				
				y += m_verticalPadding;
			}
		}
	};
	
	this.setDirection = function(dir) {
		m_direction = dir;
	};
	
	this.setOrder = function(order) {
		var resultingOrder = 0;

		order++;
		
		for (var i = 0; i < m_objects.length; i++) {
			var intermediateOrder = m_objects[i].leftObject.setOrder(order);
			
			if (resultingOrder < intermediateOrder) {
				resultingOrder = intermediateOrder;
			}
			
			if (m_objects[i].rightObject !== undefined) {
				intermediateOrder = m_objects[i].rightObject.setOrder(order);
				
				if (resultingOrder < intermediateOrder) {
					resultingOrder = intermediateOrder;
				}
			}
		}
		
		return resultingOrder;
	};
	
	this.show = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].leftObject.show();
			
			if (m_objects[i].rightObject !== undefined) {
				m_objects[i].rightObject.show();
			}
		}
		
		m_needCalculation = true;
	};
};

function TGridLayout(nColumns, nRows, margin, padding) {
	var m_alignment = 0;
	var m_cells     = new Array();
	var m_colWidth  = new Array();
	var m_columns   = nColumns === undefined ? 1 : (nColumns < 1 ? 1 : nColumns);
	var m_direction = 'ltr';
	var m_height    = 0;
	var m_margin    = margin === undefined ? 5 : margin;
	var m_padding   = (padding === undefined || padding == null || padding < 5) ? 7 : padding;
	var m_rowHeight = new Array();
	var m_rows      = nRows === undefined ? 1 : (nRows < 1 ? 1 : nRows);
	var m_width     = 0;
	
	for (var row = 0; row < m_rows; ++row) {
		m_cells[row] = new Array();
		
		for (var column = 0; column < m_columns; ++column) {
			m_cells[row][column] = null;
		}
	}
	
	for (var column = 0; column < m_columns; ++column) {
		m_colWidth[column] = 0;
	}
	
	for (var row = 0; row < m_rows; ++row) {
		m_rowHeight[row] = 0;
	}
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		m_height = 0;
		
		for (var row = 0; row < m_rows; ++row) {
			var rowHeight = 0;

			for (var column = 0; column < m_columns; ++column) {
				var cell = m_cells[row][column];
				
				if (cell != null) {
					var cellHeight = cell.getHeight();
					
					if (cellHeight > rowHeight) {
						rowHeight = cellHeight;
					}
				}
			}

			m_rowHeight[row] = rowHeight;
			m_height += rowHeight;
		}

		return m_height + m_margin * 2 + (m_rows - 1) * m_padding;
	};
	
	this.getWidth = function() {
		m_width = 0;
		
		for (var row = 0; row < m_rows; ++row) {
			for (var column = 0; column < m_columns; ++column) {
				var cell = m_cells[row][column];
				
				if (cell != null) {
					var cellWidth = cell.getWidth();
					
					if (m_colWidth[column] < cellWidth) {
						m_colWidth[column] = cellWidth + m_padding;
					}
				}
			}
		}

		for (var column = 0; column < m_columns; ++column) {
			m_width += m_colWidth[column];
		}

		return m_width + m_margin * 2 + (m_columns - 1) * m_padding;
	};
	
	this.hide = function() {
		for (var row = 0; row < m_rows; ++row) {
			for (var column = 0; column < m_columns; ++column) {
				var cell = m_cells[row][column];
				
				if (cell != null) {
					cell.hide();
				}
			}
		}
	};
	
	this.move = function(x, y) {
		x += m_margin;
		y += m_margin;
		
		for (var row = 0; row < m_rows; y += m_rowHeight[row++] + m_padding) {
			var rowHeight = m_rowHeight[row];
			var xx = x;

			if (m_direction == 'ltr') {
				for (var column = 0; column < m_columns; ++column) {
					var cell = m_cells[row][column];
					
					if (cell != null) {
						var objectX = xx;
						var objectY = y + (rowHeight - cell.getHeight()) / 2;
	
						switch (m_alignment) {
						case 0: objectX += (m_colWidth[column] - cell.getWidth()) / 2; break;
						case 2: objectX += (m_colWidth[column] - cell.getWidth()); break;
						}
	
						cell.move(objectX, objectY);
					}
					
					xx += m_colWidth[column] + m_padding;
				}	
			} else {
				for (var column = m_columns - 1; column >= 0; --column) {
					var cell = m_cells[row][column];
					
					if (cell != null) {
						var objectX = xx;
						var objectY = y + (rowHeight - cell.getHeight()) / 2;
	
						switch (m_alignment) {
						case 0: objectX += (m_colWidth[column] - cell.getWidth()) / 2; break;
						case 2: objectX += (m_colWidth[column] - cell.getWidth()); break;
						}
	
						cell.move(objectX, objectY);
					}
					
					xx += m_colWidth[column] + m_padding;
				}
			}
		}
	};

	this.setCell = function(column, row, object) {
		if (object.setDirection) {
			object.setDirection(m_direction);
		}
		m_cells[row][column] = object;
	};
	
	this.setDirection = function(dir) {
		m_direction = dir;
	};
	
	this.setOrder = function(order) {
		var resultingOrder = 0;
		
		order++;

		for (var row = 0; row < m_rows; ++row) {
			for (var column = 0; column < m_columns; ++column) {
				var cell = m_cells[row][column];
				
				if (cell != null) {
					var cellOrder = cell.setOrder(order);
					
					if (resultingOrder < cellOrder) {
						resultingOrder = cellOrder;
					}
				}
			}
		}
		
		return resultingOrder + 1;
	};
	
	this.show = function() {
		for (var row = 0; row < m_rows; ++row) {
			for (var column = 0; column < m_columns; ++column) {
				var cell = m_cells[row][column];
				
				if (cell != null) {
					cell.show();
				}
			}
		}
	};
};

function TGroupBox(title, borderColor, margin, padding) {
    var m_alignment          = 0;
    var m_borderColor        = (borderColor === undefined || borderColor == null) ? '#AFCCEE' : borderColor;
    var m_brkBackground      = new TBrick();
    var m_brkBorder          = new TBrick();
    var m_brkTitleBackground = new TBrick();
    var m_height             = 0;
    var m_layout             = new TVerticalLayout();
    var m_margin             = margin === undefined ? 5 : margin;
    var m_padding            = padding === undefined ? 7 : padding;
    var m_titleAlignment     = 0;
    var m_txtTitle           = new TText((title === undefined || title == null) ? '' : title);
    var m_width              = 0;
    
    m_brkBorder.setBorder(m_borderColor, true, true, true, true, true);
    m_brkBackground.setBorder('#FFFFFF', true, true, true, true, true);
    m_brkTitleBackground.setBackground('#FFFFFF');

    this.add = function (element) {
        m_layout.add(element);
    };

    this.alignLeft = function () {
        m_alignment = 1;
        m_layout.alignLeft();
    };

    this.alignRight = function () {
        m_alignment = 2;
        m_layout.alignRight();
    };

    this.alignTitleLeft = function () {
        m_titleAlignment = 1;
    };

    this.alignTitleRight = function () {
        m_titleAlignment = 2;
    };

    this.getAlignment = function () {
        return m_alignment;
    };

    this.getBorderColor = function () {
        return m_borderColor;
    };

    this.getHeight = function () {
        m_height = m_layout.getHeight() + m_padding + 10;

        return m_height + m_margin * 2;
    };

    this.getWidth = function () {
    	var layoutWidth     = m_layout.getWidth();
    	var titleHalfHeight = m_txtTitle.getHeight() / 2;
    	var titleWidth      = m_txtTitle.getWidth();

        m_width = (layoutWidth < titleWidth ? titleWidth : layoutWidth) + (titleHalfHeight < 5 ? 5 : titleHalfHeight) * 2;

        return m_width + m_margin * 2;
    };

    this.hide = function () {
        m_layout.hide();
        m_brkBorder.hide();
        m_txtTitle.hide();
        m_brkBackground.hide();
        m_brkTitleBackground.hide();
    };

    this.move = function (x, y) {
    	var titleHalfHeight = m_txtTitle.getHeight() / 2;

        x += m_margin;
        y += m_margin;

        m_brkBorder.move(x, y);
        m_brkBorder.setSize(m_width, m_height);

        m_brkBackground.move(x + 1, y + 1);
        m_brkBackground.setSize(m_width - 2, m_height - 2);

        if (m_titleAlignment == 1) {
            m_txtTitle.move(x + 20, y - (m_txtTitle.getHeight() / 2));
            m_brkTitleBackground.move(x + 17, y - (m_txtTitle.getHeight() / 2) - 1);
        } else if (m_titleAlignment == 2) {
            m_txtTitle.move(x + (m_width - (20 + m_txtTitle.getWidth())), y - (m_txtTitle.getHeight() / 2));
            m_brkTitleBackground.move(x + (m_width - (20 + m_txtTitle.getWidth())) - 3, y - (m_txtTitle.getHeight() / 2) - 1);
        } else {
            m_txtTitle.move(x + ((m_width / 2) - (m_txtTitle.getWidth() / 2)), y - (m_txtTitle.getHeight() / 2));
            m_brkTitleBackground.move(x + ((m_width / 2) - (m_txtTitle.getWidth() / 2)) - 3, y - (m_txtTitle.getHeight() / 2) - 1);
        }

        m_brkTitleBackground.setSize(m_txtTitle.getWidth() + 6, m_txtTitle.getHeight() + 2);

		var borderMargin = titleHalfHeight < 5 ? 5 : titleHalfHeight;

        m_layout.move(x + borderMargin + 1, y + borderMargin);
    };

    this.setBorderColor = function (color) {
        m_borderColor = color;
        m_brkBorder.setBorder(m_borderColor, true, true, true, true, true);
    };

    this.setOrder = function (order) {
        return m_layout.setOrder((m_txtTitle.setOrder(m_brkTitleBackground.setOrder(m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1) + 1) + 1) + 1) + 1) + 1);
    };

    this.setPadding = function (padding) {
        m_padding = padding;
    };

    this.setTitle = function (title) {
        m_title = title;
        m_txtTitle.setText(m_title);
    };

    this.setTitleColor = function (color) {
        m_txtTitle.setColor(color);
    };

    this.show = function () {
        m_brkBackground.show();
        m_brkBorder.show();
        m_brkTitleBackground.show();
        m_txtTitle.show();
        m_layout.show();
    };
};

function THorizontalDelimiter(width) {
	var m_width = width;
	
	this.getAlignment = function() {
		return 0;
	};

	this.getHeight = function() {
		return 1;
	};
	
	this.getWidth = function() {
		return m_width;
	};

	this.hide = function() {
	};
	
	this.move = function(x, y) {
	};
	
	this.setOrder = function(order) {
		return order;
	};

	this.show = function() {
	};
};

function THorizontalLayout(margin, padding) {
	var m_alignment = 0;
	var m_direction = 'ltr';
	var m_height    = 0;
	var m_margin    = (margin === undefined || margin == null) ? 5 : margin;
	var m_objects   = new Array();
	var m_padding   = (padding === undefined || padding == null || padding < 7) ? 7 : padding;
	var m_width     = 0;
	
	this.add = function(object) {
		if (object.setDirection) {
			object.setDirection(m_direction);
		}
		m_objects[m_objects.length] = object;
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
	
	this.getHeight = function() {
		m_height = 0;

		for (var i = 0; i < m_objects.length; i++) {
			var objectHeight = m_objects[i].getHeight();

			if (m_height < objectHeight) {
				m_height = objectHeight;
			}
		}
		
		return m_height + m_margin * 2;
	};
	
	this.getWidth = function() {
		m_width = 0;
		
		for (var i = 0; i < m_objects.length; i++) {
			m_width += m_objects[i].getWidth();
		}
		
		if (m_objects.length > 0) {
			m_width += (m_objects.length - 1) * m_padding;
		}
		
		return m_width + m_margin * 2;
	};
	
	this.hide = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].hide();
		}
	};
	
	this.move = function(x, y) {
		x += m_margin;
		y += m_margin;
		
		if (m_direction == 'ltr') {
			for (var i = 0; i < m_objects.length; i++) {
				m_objects[i].move(x, y + (m_height - m_objects[i].getHeight()) / 2);
				x += m_objects[i].getWidth() + m_padding;
			}
		} else {
			for (var i = m_objects.length - 1; i >= 0; i--) {
				m_objects[i].move(x, y + (m_height - m_objects[i].getHeight()) / 2);
				x += m_objects[i].getWidth() + m_padding;
			}
		}
	};
	
	this.setDirection = function(dir) {
		m_direction = dir;
	};
	
	this.setOrder = function(order) {
		var resultingOrder = 0;
		
		order++;

		for (var i = 0; i < m_objects.length; i++) {
			var intermediateOrder = m_objects[i].setOrder(order);
			
			if (resultingOrder < intermediateOrder) {
				resultingOrder = intermediateOrder;
			}
		}
		
		return resultingOrder;
	};
	
	this.show = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].show();
		}
	};
};

function THorizontalMenu() {
	var m_alignment                  = 0;
    var m_brkBackground              = new TBrick();
    var m_brkBorder                  = new TBrick();
    var m_ddWrappers                 = new Array();
    var m_direction                  = 'ltr';
    var m_height                     = 0;
    var m_menuItems                  = new Array();
    var m_timeout                    = 1000;
	var m_timerId                    = 0;
    var m_width                      = 0;
    
    m_brkBorder.setBorder('#80B0D0', 1, 1, 1, 1);
    m_brkBackground.setBorder('#FFFFFF', 1, 1, 1, 1);
    
    var getRootItems = function() {
    	var rootItems = new Array();
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == '') {
    			rootItems.push(m_menuItems[i]);
    		}
    	}
    	return rootItems;
    };
    
    var getSubItems = function(parentName) {
    	var subItems = new Array();
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == parentName) {
    			subItems.push(m_menuItems[i]);
    		}
    	}
    	return subItems;
    };
    
    var getWrapperHeight = function(name) {
    	var ddHeight = 0;
		var subItems = getSubItems(name);
		for (var j = 0; j < subItems.length; j++) {
			ddHeight += 19;
		}
		return ddHeight;
    };
    
    var getWrapperWidth = function(name) {
    	var ddWidth = 0;
		var subItems = getSubItems(name);
		
		for (var j = 0; j < subItems.length; j++) {
			if (ddWidth < subItems[j].width) {
				ddWidth = subItems[j].width;
			}
		}
		
		for (var j = 0; j < subItems.length; j++) {
			subItems[j].width = ddWidth;
			subItems[j].titleBack.setSize(ddWidth, 19);
			subItems[j].cover.setSize(ddWidth, 19);
		}
		
		return ddWidth + 2;
    };
    
    var hideSubItems = function(parentName) {
    	var subItems = getSubItems(parentName);
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		if (m_ddWrappers[i].parentName == parentName) {
    			m_ddWrappers[i].ddWrapper.hide();
    			break;
    		}
    	}
    	
    	for (var i = 0; i < subItems.length; i++) {
    		if (isParent(subItems[i].name)) { hideSubItems(subItems[i].name); }
    		subItems[i].title.hide();
    		subItems[i].titleBack.hide();
    		subItems[i].arrowBack.hide();
    		subItems[i].cover.hide();
    	}
    };
    
    var hideWrappers = function() {
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		m_ddWrappers[i].ddWrapper.hide();
    	}
    	
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName != '') {
    			m_menuItems[i].title.hide();
    			m_menuItems[i].titleBack.hide();
    			m_menuItems[i].arrowBack.hide();
    			m_menuItems[i].cover.hide();
    		}
    	}
    };
    
    var isParent = function(menuItemName) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == menuItemName) {
    			return true;
    		}
    	}
    	return false;
    };
    
    var moveItem = function(item, x, y) {
		item.titleBack.move(x, y + 1);
    	item.cover.move(x, y + 1);
    		
    	switch (item.alignment) {
    		case 0:
    			item.title.move(x + (item.width - item.title.getWidth()) / 2, y + (19 - item.title.getHeight()) / 2);
    			break;
    		case 1:
    			item.title.move(x + 1, y + (19 - item.title.getHeight()) / 2);
    			break;
    		case 2:
    			item.title.move(x + (item.width - item.title.getWidth() - 13), y + (19 - item.title.getHeight()) / 2);
    			break;
    	}
    	
    	if (isParent(item.name)) {
    		var subItems = getSubItems(item.name);
    		
    		if (item.parentName == '') {
    			item.arrowBack.setBackground('url(images/tbl/down.png) no-repeat left top');
    			item.arrowBack.setSize(12, 8);
    			item.arrowBack.move(x + (item.width - 13), y + 7);
    			
    			var headerY = item.titleBack.getY() + 19;
    			
    			for (var i = 0; i < m_ddWrappers.length; i++) {
	    			if (m_ddWrappers[i].parentName == item.name) {
	    				m_ddWrappers[i].ddWrapper.setSize(getWrapperWidth(item.name), getWrapperHeight(item.name));
	    				m_ddWrappers[i].ddWrapper.move(x, headerY);
	    				break;
	    			}
	    		}
    			
    			for (var j = 0; j < subItems.length; j++) {
	    			moveItem(subItems[j], x + 1, headerY - 1);
	    			headerY = subItems[j].titleBack.getY() + 19;
	    		}
	    		
    		} else {
    			item.arrowBack.setBackground('url(images/tbl/inc.png) no-repeat left top');
    			item.arrowBack.setSize(8, 12);
    			item.arrowBack.move(x + (item.width - 8), y + 4);
    			
    			var headerY = y + 2;
    			
    			for (var i = 0; i < m_ddWrappers.length; i++) {
	    			if (m_ddWrappers[i].parentName == item.name) {
	    				m_ddWrappers[i].ddWrapper.setSize(getWrapperWidth(item.name), getWrapperHeight(item.name));
	    				m_ddWrappers[i].ddWrapper.move(x + item.width + 2, headerY);
	    				break;
	    			}
	    		}
    			
    			for (var j = 0; j < subItems.length; j++) {
	    			moveItem(subItems[j], x + item.width + 3, headerY - 1);
	    			headerY = subItems[j].titleBack.getY() + 19;
	    		}
    		}
    	}
	};
    
    var onMenuItemClick = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
	    	if (m_menuItems[i].name == name) {
	    		if (m_menuItems[i].callback != null) {
			    	m_menuItems[i].callback();
			    }
			    hideWrappers();
	    		break;
	    	}
	    }
    };
    
    var onMenuItemOut = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].name == name) {
    			m_menuItems[i].titleBack.setBackground('url(images/tblh.png) repeat-x');
    			m_menuItems[i].cover.setCursor('default');
    			break;
    		}
    	}
    	
    	if (m_timerId == 0) {
    		m_timerId = setTimeout(onTimeout, m_timeout);
    	}
    };
    
    var onMenuItemOver = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].name == name) {
    			m_menuItems[i].titleBack.setBackground('url(images/tblb.png) repeat-x');
    			m_menuItems[i].cover.setCursor('pointer');
    			
    			if (m_menuItems[i].parentName == '') {
    				hideWrappers();
    			} else {
    				var items = getSubItems(m_menuItems[i].parentName);
	    			for (var j = 0; j < items.length; j++) {
	    				if (items[j].name != name) {
	    					hideSubItems(items[j].name);
	    				} else {
	    					var sItems = getSubItems(name);
	    					for (var k = 0; k < sItems.length; k++) {
	    						hideSubItems(sItems[k].name);
	    					}
	    				}
	    			}
    			}
    			
    			break;
    		}
    	}
    	
    	if (isParent(name)) {
    		 showSubItems(name);
    	}
    	
    	if (m_timerId > 0) {
    		 clearTimeout(m_timerId);
    		 m_timerId = 0;
    	}
    };
    
    var onTimeout = function() {
		hideWrappers();

		m_timerId = 0;
	};
    
    var showRootItems = function() {
    	var rootItems = getRootItems();
    	
    	for (var i = 0; i < rootItems.length; i++) {
    		rootItems[i].title.show();
    		rootItems[i].titleBack.show();
    		rootItems[i].arrowBack.show();
    		rootItems[i].cover.show();
    	}
    };
    
    var showSubItems = function(parentName) {
    	var subItems = getSubItems(parentName);
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		if (m_ddWrappers[i].parentName == parentName) {
    			m_ddWrappers[i].ddWrapper.show();
    			break;
    		}
    	}
    	
    	for (var i = 0; i < subItems.length; i++) {
    		subItems[i].title.show();
    		subItems[i].titleBack.show();
    		subItems[i].arrowBack.show();
    		subItems[i].cover.show();
    	}
    };
    
    this.addMenuItem = function(name, title, parentName, callback, alignment) {
    	var arrowBack = new TBrick();
    	var backgroundTitle = new TBrick();
        var cover = new TBrick();
        var txtTitle = new TText(title, 'normalFixed');
        var itemClick = new TCaller(onMenuItemClick, name);
        var itemOut = new TCaller(onMenuItemOut, name);
	    var itemOver = new TCaller(onMenuItemOver, name);
	    
	    parentName = (parentName === undefined || parentName == null) ? '' : parentName;
        if (parentName != '') {
        	var ddWrapper = new TBrick('ddWrapper');
        	ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);
        	m_ddWrappers.push({ parentName: parentName, ddWrapper: ddWrapper });
        }
        
        backgroundTitle.setBackground('url(images/tblh.png) repeat-x');
	    backgroundTitle.setFontSize('0');
	    
	    var width = (txtTitle.getWidth() + 26 < 50) ? 50 : txtTitle.getWidth() + 26;
	    backgroundTitle.setSize(width, 19);
	    
	    cover.addEvent('click', itemClick.callback);
	    cover.addEvent('mouseout', itemOut.callback);
	    cover.addEvent('mouseover', itemOver.callback);
	    cover.setSize(width, 19);
	    
	    alignment = (alignment === undefined || alignment == null) ? 0 : alignment;
	    
	    callback = (callback === undefined || callback == null) ? null : callback;
        
        m_menuItems.push({ name: name, title: txtTitle, parentName: parentName, titleBack: backgroundTitle, arrowBack: arrowBack, callback: callback, cover: cover, width: width, alignment: alignment });
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

    this.getHeight = function() {
		m_height = 19;
        
        return m_height;
    };

    this.getWidth = function() {
    	m_width             = 0;
    	var rootItems       = getRootItems();
    	
    	for (var i = 0; i < rootItems.length; i++) {
    		m_width += rootItems[i].width;
    	}
		
		m_width += rootItems.length + 1;
		
        return m_width;
    };

    this.hide = function() {
        m_brkBackground.hide();
        m_brkBorder.hide();
        
        for (var i = 0; i < m_menuItems.length; i++) {
    		m_menuItems[i].title.hide();
    		m_menuItems[i].titleBack.hide();
    		m_menuItems[i].arrowBack.hide();
    		m_menuItems[i].cover.hide();
    	}
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		m_ddWrappers[i].ddWrapper.hide();
    	}
    };
	
    this.move = function(x, y) {
        m_brkBorder.move(x, y);
        m_brkBorder.setSize(m_width, m_height + 1);

        m_brkBackground.move(x + 1, y + 1);
        m_brkBackground.setSize(m_width - 2, m_height - 1);

        var headerX = x + 1;
        var rootItems = getRootItems();
    	
    	if (m_direction == 'ltr') {
    		for (var i = 0; i < rootItems.length; i++) {
	    		moveItem(rootItems[i], headerX, y);
	    		
	    		headerX += rootItems[i].width + 1;
	    	}
    	} else {
    		for (var i = rootItems.length - 1; i >= 0; i--) {
	    		moveItem(rootItems[i], headerX, y);
	    		
	    		headerX += rootItems[i].width + 1;
	    	}
    	}
    };
	
	this.setDirection = function(dir) {
		m_direction = dir;
	};
	
    this.setOrder = function(order) {
    	borderOrder = m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1));
    	var titleBackOrder = borderOrder + 1;
    	var titleOrder     = titleBackOrder + 1;
    	var arrowOrder     = titleOrder + 1;
    	var coverOrder     = arrowOrder + 1; 
    	var rootItems      = getRootItems();
    	
    	for (var j = 0; j < m_ddWrappers.length; j++) {
    			m_ddWrappers[j].ddWrapper.setOrder(titleBackOrder + 100);	
    	}
    	
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == '') {
    			m_menuItems[i].titleBack.setOrder(titleBackOrder);
	    		m_menuItems[i].title.setOrder(titleOrder);
	    		m_menuItems[i].cover.setOrder(coverOrder);
	    		m_menuItems[i].arrowBack.setOrder(arrowOrder);
    		} else {
    			m_menuItems[i].titleBack.setOrder(titleBackOrder + 101);
	    		m_menuItems[i].title.setOrder(titleOrder + 101);
	    		m_menuItems[i].cover.setOrder(coverOrder + 101);
	    		m_menuItems[i].arrowBack.setOrder(arrowOrder + 101);
    		}
    	}
    	
    	return coverOrder + 1;
    };

    this.show = function() {
        m_brkBackground.show();
        m_brkBorder.show();
        showRootItems();
    };
    
};

function THyperlink(href, text) {
	var m_alignment   = 0;
	var m_color       = '#afccee';
	var m_colorActive = '#ffd0a0';
	var m_element     = document.createElement('a');
	var m_height      = 0;
	var m_image       = null;
	var m_text        = new TText((text === undefined || text == null) ? TLang.translate('hyperlink'): text);
	var m_width       = 0;
	
	m_element.href = href;
	m_element.innerHTML = m_text.getText();
	m_element.style.color = m_color;
	m_element.style.display = 'block';
	m_element.style.position = 'absolute';
	
	var onMouseOut = function() {
		m_element.style.color = m_color;
	};
	
	var onMouseOver = function() {
		m_element.style.color = m_colorActive;
	};
	
	var setVisibility = function(visibility) {
		m_element.style.visibility = visibility;
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};

	this.appendChild = function(child) {
		m_element.appendChild(child);
	};
	
	this.destroy = function() {
		if (m_image != null) {
			m_image.destroy();
		}
		document.body.removeChild(m_element);
        m_element = null;
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		if (m_image) {
			m_height = m_image.getHeight();
		} else {
			m_height = m_text.getHeight();
		}
		
		return m_height;
	};

	this.getLink = function() {
		return m_element.href;
	};

	this.getText = function() {
		return m_element.innerHTML;
	};

	this.getWidth = function() {
		if (m_image) {
			m_width = m_image.getWidth();
		} else {
			m_width = m_text.getWidth();
		}
		
		return m_width;
	};

	this.hide = function() {
		setVisibility('hidden');
		if (m_image != null) {
			m_image.hide();
		}
	};

	this.move = function(x, y) {
		m_element.style.left = x + 'px';
		m_element.style.top  = y + 'px';
	};

	this.removeChild = function(child) {
		m_element.removeChild(child);
	};
	
	this.removeUnderline = function() {
		m_element.style.textDecoration = 'None';
	};
	
	this.setColor = function(color) {
		m_color = color;
		m_element.style.color = m_color;
	};
	
	this.setColorActive = function(color) {
		m_colorActive = color;
	};
	
	this.setCursor = function(cursor) {
		m_element.style.cursor = cursor;
	};

	this.setDownload = function(download) {
		if (m_element.download) {
			m_element.download = download;
		}
	};

	this.setImage = function(url, width, height) {
		m_image = new TImage(url, width, height, this);
	};

	this.setLink = function(href) {
		m_element.href = href;
	};

	this.setMedia = function(media) {
		if (m_element.media) {
			m_element.media = media;
		}
	};

	this.setOrder = function(order) {
		m_element.style.zIndex = order + 1;

		return order + 2;
	};

	this.setTarget = function(target) {
		m_element.target = target;
	};
	
	this.setText = function(text) {
		m_text.setText(text);
		m_element.innerHTML = text;
	};

	this.setType = function(mime) {
		if (m_element.type) {
			m_element.type = mime;
		}
	};

	this.show = function() {
		setVisibility('visible');
		if (m_image != null) {
			m_image.show();
		}
	};
	
	document.body.appendChild(m_element);
	
	m_element.onmouseout = onMouseOut;
	m_element.onmouseover = onMouseOver;
};

function TIdentityValidator(object, objectName) {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var valid = false;
		
		if (text != object.getValue() || text == '') {
			m_phrase = TLang.translate('itMustBeIdenticalTo') + objectName + '!'; 
		} else {
			valid = true;
			m_phrase = TLang.translate('thisIsValid');
		}
		
		return valid;
	};
};

function TImage(url, width, height, parent) {
	var m_alignment = 0;
	var m_height    = (height === undefined || height == null) ? 100 : height;
	var m_image     = document.createElement('img');
	var m_parent    = (parent === undefined || parent == null) ? null : parent;
	var m_url       = url;
	var m_width     = (width === undefined || width == null) ? 100 : width;
	
	var setVisibility = function(visibility) {
		m_image.style.visibility = visibility;
	};

	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};

	this.destroy = function() {
		if (m_parent) {
            m_parent.removeChild(m_image);
        } else {
            document.body.removeChild(m_image);
        }
        m_image = null;
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};

	this.getElement = function() {
	  return m_image;
	};

	this.getHeight = function() {
		return m_height;
	};

	this.getUrl = function() {
		return m_url;
	};
	
	this.getWidth = function() {
		return m_width;
	};

	this.hide = function() {
		setVisibility('hidden');
	};

	this.move = function(x, y) {
		m_image.style.left = x + 'px';
		m_image.style.top  = y + 'px';
	};
	
	this.setAttribute = function(name, value) {
		m_image.setAttribute(name, value);
	};
	
	this.setCursor = function(cursor) {
		m_image.style.cursor = cursor;
	};

	this.setHeight = function(height) {
		m_height = height;
		m_image.style.height   = m_height;
	};
	
	this.setOrder = function(order) {
		m_image.style.zIndex = order;

		return order + 1;
	};
	
	this.setWidth = function(width) {
		m_width = width;
		m_image.style.width    = m_width;
	};
	
	this.setUrl = function(url) {
		m_url = url;
		m_image.setAttribute('src', url);
	};

	this.show = function() {
		setVisibility('visible');
	};

	m_image.style.height   = m_height;
	m_image.style.position = 'absolute';
	m_image.style.width    = m_width;
	
	m_image.setAttribute('border', '0px');
	m_image.setAttribute('src', url);
	
	if (m_parent) {
		m_parent.appendChild(m_image);
	} else {
		document.body.appendChild(m_image);
	}

	setVisibility('hidden');
};

function TImageButton(width, height, urlNormal, urlSelected, urlDisabled) {
	var m_alignment   = 0;
	var m_height      = height;
	var m_imgNormal   = new TImage(urlNormal, width, height);
	var m_imgSelected = new TImage(((urlSelected === undefined) || (urlSelected == null)) ? urlNormal : urlSelected, width, height);
	var m_imgDisabled = new TImage(((urlDisabled === undefined) || (urlDisabled == null)) ? urlNormal : urlDisabled, width, height);
	var m_enabled     = true;
	var m_selected    = false;
	var m_onCallback  = null;
	var m_width       = width;
	var m_wrapper     = new TBrick();
	
	var setNormalImage = function() {
		m_imgNormal.show();
		m_imgSelected.hide();
		m_imgDisabled.hide();
	};

	var setSelectedImage = function() {
		m_imgNormal.hide();
		m_imgSelected.show();
		m_imgDisabled.hide();
	};

	var onClick = function() {
		if (m_enabled && m_onCallback != null) {
			m_onCallback();
		}
	};

	var onMouseOut = function() {
		if (m_enabled && m_selected) {
			setNormalImage();
			m_selected = false;
		}
	};

	var onMouseOver = function() {
		if (m_enabled && !m_selected) {
			setSelectedImage();
			m_selected = true;
		}
	};

	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.disable = function() {
		if (m_enabled) {
			m_imgNormal.hide();
			m_imgSelected.hide();
			m_imgDisabled.show();
			m_wrapper.setCursor('default');
			m_enabled = false;
		}
	};

	this.enable = function() {
		if (!m_enabled) {
			setNormalImage();
			m_wrapper.setCursor('pointer');
			m_enabled = true;
			m_selected = false;
		}
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};

	this.getHeight = function() {
		return m_height;
	};
	
	this.getWidth = function() {
		return m_width;
	};
	
	this.hide = function() {
		m_imgNormal.hide();
		m_imgSelected.hide();
		m_imgDisabled.hide();
		m_wrapper.hide();
	};
	
	this.move = function(x, y) {
		m_imgNormal.move(x, y);
		m_imgSelected.move(x, y);
		m_imgDisabled.move(x, y);
		m_wrapper.move(x, y);
		m_wrapper.setSize(m_width, m_height);
	};
	
	this.setOnClick = function(callback) {
		m_onCallback = callback;
	};
	
	this.setOrder = function(order) {
		m_imgNormal.setOrder(order);
		m_imgSelected.setOrder(order);
		m_imgDisabled.setOrder(order);

		return m_wrapper.setOrder(order + 1);
	};
	
	this.show = function() {
		if (m_enabled) {
			setNormalImage();

			m_wrapper.show();
			m_wrapper.setCursor('pointer');
		} else {
			m_enabled = true;
			disable();
		}
	};
	
	m_wrapper.addEvent('click', onClick);
	m_wrapper.addEvent('mouseout', onMouseOut);
	m_wrapper.addEvent('mouseover', onMouseOver);
	m_wrapper.setCursor('pointer');
};

function TImageRotater(imgArray, width, height, interval /* in seconds */, mode /* sequental or random*/) {
	var m_alignment   = 0;
	var m_clickCallback = null;
	var m_current     = 0;
	var m_height      = (height === undefined || height == null) ? 250 : height;
	var m_imgViewer   = null;
	var m_interval    = (interval === undefined || interval == null) ? 5000 : interval * 1000;
	var m_mode        = (mode === undefined || mode == null || (mode != 'sequental' && mode != 'random')) ? 'sequental' : mode;
	var m_timerId     = 0;
	var m_width       = (width === undefined || width == null) ? 450 : width;
	var m_wrapper     = new TBrick();
	
	var calculateFitImageSize = function(src, maxWidth, maxHeight) {
		var size = getImageSize(src);
		var fitSize;
		if (size.width == 0 || size.height == 0) {
			return { width: maxWidth, height: maxHeight };
		} else {
			fitSize = calculateAspectRatioFit(size.width, size.height, maxWidth, maxHeight);
		}
		
		return { width: fitSize.width, height: fitSize.height };
	};
	
	var onMouseClick = function() {
		if (m_clickCallback != null) {
			m_clickCallback(m_current);
		}
	};
	
	var onMouseOut = function() {
		m_wrapper.setCursor('default');
		resume();
	};
	
	var onMouseOver = function() {
		m_wrapper.setCursor('pointer');
		stop();
	};
	
	var resume = function() {
		m_timerId = setTimeout(rotate, m_interval);
	};
	
	var rotate = function() {
		var previous = m_current;
		if (m_mode == 'sequental') {
			if (m_current == imgArray.length - 1) {
				 m_current = 0; 
			} else {
				m_current++;
			}	
		} else {
			m_current = Math.floor((Math.random() * (imgArray.length - 1)));
		}
		
		// TODO: apply closing effects on imgArray(previous) and opening effects on imgArray(m_current)
		
		size = calculateFitImageSize(imgArray[m_current], m_width, m_height);
		m_imgViewer.setHeight(size.height);
		m_imgViewer.setWidth(size.width);
		m_imgViewer.setUrl(imgArray[m_current]);
		m_timerId = setTimeout(rotate, m_interval);
	};
	
	var stop = function() {
		if (m_timerId > 0) {
	        clearTimeout(m_timerId);
	        m_timerId = 0;
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

	this.getHeight = function() {
		return m_height;
	};
	
	this.getWidth = function() {
		return m_width;
	};
	
	this.hide = function() {
		if (m_imgViewer != null) {
			m_imgViewer.hide();
		}
		m_wrapper.hide();
	};
	
	this.move = function(x, y) {
		if (m_imgViewer != null) {
			m_imgViewer.move(x, y);
		}
		m_wrapper.setSize(m_width, m_height);
		m_wrapper.move(x, y);
	};
	
	this.setOnClickCallback = function(callback) {
		m_clickCallback = callback;
	};
	
	this.setOrder = function(order) {
		if (m_imgViewer != null) {
			m_imgViewer.setOrder(order + 1);
		}
		m_wrapper.setOrder(order + 2);
		
		return order + 3;
	};
	
	this.show = function() {
		if (m_imgViewer != null) {
			m_imgViewer.show();
			m_wrapper.show();
			rotate();	
		}
	};
	
	m_wrapper.addEvent('mouseout', onMouseOut);
	m_wrapper.addEvent('mouseover', onMouseOver);
	
	if (imgArray !== undefined && imgArray != null && imgArray.length != 0) {
		m_imgViewer = new TImage(imgArray[0], m_width, m_height);
	}
};

var TLang = (function() { 
	var m_language = 'en';
	var m_ar = { 'alignment': 'المحاذاة', 'alternativeText': 'نص بديل', 'audio': 'صوت', 'backColor': 'لون تمييز النص', 'bold': 'غامق', 'border': 'حد', 'borderColor': 'لون الحد', 'borderSize': 'قياس الحد', 'borderStyle': 'ستايل الحد', 'browse': 'إستعراض', 'browseServer': 'استعراض المخدم', 'BrowserNotSupportFeature': 'متصفحك لا يدعم هذه الميزة', 'cancel': 'إلغاء الأمر', 'cell': 'خلية', 'cellPadding': 'بطانة الخلية', 'cellProperties': 'خصائص الخلية', 'cellSpacing': 'تباعد الخلايا', 'change': 'تعديل', 'changeMediaOk': 'تم تعديل ملف الميديا', 'choose': 'إختيار', 'close': 'إغلاق', 'column': 'عمود', 'columns': 'أعمدة', 'copy': 'نسخ', 'cut': 'قص', 'delete': 'حذف', 'deleteCell': 'حذف خلية', 'deleteColumn': 'حذف عمود', 'deleteImage': 'حذف الصورة', 'deleteMediaOk': 'تم حذف ملف الميديا', 'deleteRow': 'حذف سطر', 'deleteTable': 'حذف الجدول', 'desc': 'الوصف', 'download': 'تنزيل', 'downloading': 'جاري التنزيل', 'downloadingFile': 'جاري تنزيل الملف', 'edit': 'تحرير', 'e-mailIsInvalid': 'البريد الإلكتروني غير صالح', 'e-mailIsValid': 'البريد الإلكتروني صالح', 'error': 'خطأ', 'errorChangingMedia': 'خطأ في تعديل ملف الميديا', 'errorDeletingMedia': 'خطأ في حذف ملف الميديا', 'errorSavingImage': 'خطأ في حفظ الصورة', 'fieldMustnotBeEmpty': 'الحقل يجب أن لا يكون فارغ', 'file': 'ملف', 'finder': 'الباحث', 'folder': 'مجلد', 'folders': 'مجلدات', 'foreColor': 'لون الخط', 'help': 'مساعدة', 'highlighted' : 'مفعل', 'height': 'إرتفاع', 'horizontalAlign': 'محاذاة أفقية', 'hyperlink': 'رابط تشعبي', 'image': 'صورة', 'imageEditor': 'محرر الصورة', 'imageInfo': 'معلومات الصورة', 'imageProperties': 'خصائص الصورة', 'imageSavedSuccessfully': 'تم حفظ الصورة بنجاح', 'imageViewer': 'عارض الصور', 'indent': 'زيادة المسافة البادئة', 'info': 'معلومات', 'insertAudio': 'إدراج صوت', 'insertCellBefore': 'إدراج خلية قبل', 'insertColumnAfter': 'إدراج عمود بعد', 'insertColumnBefore': 'إدراج عمود قبل', 'insertHorizontalRule': 'إدراج تسطيرة أفقية', 'insertImage': 'إدراج صورة', 'insertLink': 'إدراج رابط', 'insertRowAfter': 'إدراج سطر بعد', 'insertRowBefore': 'إدراج سطر قبل', 'insertSound': 'إدراج صوت', 'insertTable': 'إدراج جدول', 'insertVideo': 'إدراج فيديو', 'italic': 'مائل', 'itMustBeIdenticalTo': 'يجب أن يكون مطابق لـ ', 'justify': 'ضبط', 'justifyCenter': 'توسيط', 'justifyLeft': 'محاذاة النص لليسار', 'justifyRight': 'محاذاة النص لليمين', 'loading': 'جاري التحميل', 'media': 'ميديا', 'mergeDown': 'دمج للأسفل', 'mergeRight': 'دمج لليمين', 'new': 'جديد', 'newPage': 'صفحة جديدة', 'nextImage': 'الصورة التالية', 'no': 'لا', 'noFileSelected': 'لم يتم تحديد ملف بعد', 'ok': 'موافق', 'openMSWordFile': 'فتح ملف مايكروسوفت وورد', 'orderedList': 'ترقيم', 'outdent': 'إنقاص المسافة البادئة', 'pageOf': 'Page Of', 'passwordAtLeast': 'كلمة السر يجب أن تتضمن 6 محارف على الأقل', 'passwordIsValid': 'كلمة المرور صالحة', 'passwordMustContain': 'كلمة السر يجب أن تتضمن الأرقام 0-9، أحرف صغيرة و كبيرة، و الرموز @#$%^&*_!', 'paste': 'لصق', 'preview': 'معاينة', 'previousImage': 'الصورة السابقة', 'print': 'طباعة', 'process': 'معالجة', 'processImage': 'معالجة الصورة', 'redo': 'تكرار', 'refresh': 'تحديث', 'reset': 'إعادة ضبط', 'row': 'سطر', 'rows': 'أسطر', 'save': 'حفظ', 'saveChanges': 'هل تريد حفظ التغييرات', 'saveImage': 'هل انت متأكد من انك تريد حفظ هذه الصورة؟', 'select': 'إختار', 'selectColor': 'تحديد اللون', 'selected' : 'محدد', 'selectFile': 'إختار ملف', 'selectFileFirst': 'يجب أن تختار ملف أولا', 'selectFolderFirst': 'يجب أن تححد مجلد أولا', 'settings': 'إعدادات', 'splitCellHorizontally': 'تقسيم الخلية أفقيا', 'splitCellVertically': 'تقسيم الخلية عموديا', 'strikeThrough': 'يتوسطه خط', 'subscript': 'منخفض', 'superscript': 'مرتفع', 'sureDeleteMedia': 'هل تريد بالتأكيد حذف ملف الميديا؟', 'table': 'جدول', 'tableProperties': 'خصائص الجدول', 'test': 'تجريب', 'thickness': 'الثخانة', 'thisIsValid': 'إنه صالح', 'thisMustContainOnlyNumbers': 'يجب أن يتضمن أرقام فقط', 'title': 'العنوان', 'type': 'النوع', 'underline': 'تسطير', 'undo': 'تراجع', 'unlink': 'إزالة الرابط', 'unorderedList': 'تعداد نقطي', 'upload': 'رفع', 'uploaded': 'تم الرفع', 'uploadingFile': 'جاري رفع الملف', 'uploadMediaFile': 'رفع ملف الوسائط', 'uploadToServer': 'رفع إلى المخدم', 'urlIsInvalid': 'URL غير صحيح', 'urlIsValid': 'URL صحيح', 'verticalAlign': 'محاذاة عامودية', 'view': 'عرض', 'video': 'فديو', 'viewSource': 'عرض المصدر', 'viewText': 'عرض النص', 'width': 'عرض', 'wordWrap': 'إلتفاف الكلمة', 'yes': 'نعم' };
	var m_en = { 'alignment': 'Alignment', 'alternativeText': 'Alternative Text', 'audio': 'Audio', 'backColor': 'Back Color', 'bold': 'Bold', 'border': 'Border', 'borderColor': 'Border Color', 'borderSize': 'Border Size', 'borderStyle': 'Border Style', 'browse': 'Browse', 'browseServer': 'Browse Server', 'BrowserNotSupportFeature': 'Your browser does not support this feature', 'cancel': 'Cancel', 'cell': 'Cell', 'cellPadding': 'Cell Padding', 'cellProperties': 'Cell Properties', 'cellSpacing': 'Cell Spacing', 'change': 'Change', 'changeMediaOk': 'Media file has been changed', 'choose': 'Choose', 'close': 'Close', 'column': 'Column', 'columns': 'Columns', 'copy': 'Copy', 'cut': 'Cut', 'delete': 'Delete', 'deleteCell': 'Delete Cell', 'deleteColumn': 'Delete Column', 'deleteImage': 'Delete Image', 'deleteMediaOk': 'Media file has been deleted', 'deleteRow': 'Delete Row', 'deleteTable': 'Delete Table', 'desc': 'Description', 'download': 'Download', 'downloading': 'Downloading', 'downloadingFile': 'Downloading File', 'edit': 'Edit', 'e-mailIsInvalid': 'E-mail is invalid', 'e-mailIsValid': 'E-mail is valid', 'error': 'Error', 'errorChangingMedia': 'Error changing media file', 'errorDeletingMedia': 'Error deleting media file', 'errorSavingImage': 'Error saving image', 'fieldMustnotBeEmpty': 'The field must not be empty', 'file': 'File', 'finder': 'Finder', 'folder': 'Folder', 'folders': 'Folders', 'foreColor': 'Fore Color', 'help': 'Help', 'highlighted': 'Highlighted', 'height': 'Height', 'horizontalAlign': 'Horizontal Align', 'hyperlink': 'Hyperlink', 'image': 'Image', 'imageEditor': 'Image Editor', 'imageInfo': 'Image Info', 'imageProperties': 'Image Properties', 'imageSavedSuccessfully': 'Image saved successfully', 'imageViewer': 'Image Viewer', 'indent': 'Indent', 'info': 'Information', 'insertAudio': 'Insert Audio', 'insertCellAfter': 'Insert Cell After', 'insertCellBefore': 'Insert Cell Before', 'insertColumnAfter': 'Insert Column After', 'insertColumnBefore': 'Insert Column Before', 'insertHorizontalRule': 'Insert Horizontal Rule', 'insertImage': 'Insert Image', 'insertLink': 'Insert Link', 'insertRowAfter': 'Insert Row After', 'insertRowBefore': 'Insert Row Before', 'insertSound': 'Insert Sound', 'insertTable': 'Insert Table', 'insertVideo': 'Insert Video', 'italic': 'Italic', 'itMustBeIdenticalTo': 'It must be identical to ', 'justify': 'Justify', 'justifyCenter': 'Justify Center', 'justifyLeft': 'Justify Left', 'justifyRight': 'Justify Right', 'loading': 'Loading', 'media': 'Media', 'mergeDown': 'Merge Down', 'mergeRight': 'Merge Right', 'new': 'New', 'newPage': 'New Page', 'nextImage': 'Next Image', 'no': 'No', 'noFileSelected': 'No file selected yet', 'ok': 'OK', 'openMSWordFile': 'Open MS Word File', 'orderedList': 'Ordered List', 'outdent': 'Outdent', 'pageOf': 'Page Of', 'passwordAtLeast': 'Password must contain at least six characters', 'passwordIsValid': 'Password is valid', 'passwordMustContain': 'Password must contain numbers 0-9, lower- and uppercase letters a-z, A-Z, and symbols @#$%^&*_!', 'paste': 'Paste', 'patternIsInvalid': 'Pattern is invalid', 'preview': 'Preview', 'previousImage': 'Previous Image', 'print': 'Print', 'process': 'Process', 'processImage': 'Process Image', 'redo': 'Redo', 'refresh': 'Refresh', 'reset': 'Reset', 'row': 'Row', 'rows': 'Rows', 'save': 'Save', 'saveChanges': 'Do you want to save changes', 'saveImage': 'Are you sure you want to save this image?', 'select': 'Select', 'selectColor': 'Select Color', 'selected': 'Selected', 'selectFile': 'Select File', 'selectFileFirst': 'You must select file first', 'selectFolderFirst': 'You must select folder first', 'settings': 'Settings', 'splitCellHorizontally': 'Split Cell Horizontally', 'splitCellVertically': 'Split Cell Vertically', 'strikeThrough': 'Strike Through', 'subscript': 'Subscript', 'superscript': 'Superscript', 'sureDeleteMedia': 'Are you sure you want to delete this media file?', 'table': 'Table', 'tableProperties': 'Table Properties', 'test': 'Test', 'thickness': 'Thickness', 'thisIsValid': 'This is valid', 'thisMustContainOnlyNumbers': 'This must contain only numbers', 'title': 'Title', 'type': 'Type', 'underline': 'Underline', 'undo': 'Undo', 'unlink': 'Unlink', 'unorderedList': 'Unordered List', 'upload': 'Upload', 'uploaded': 'Uploaded', 'uploadingFile': 'Uploading File', 'uploadMediaFile': 'Upload Media File', 'uploadToServer': 'Upload to Server', 'urlIsInvalid': 'URL is invalid', 'urlIsValid': 'URL is valid', 'verticalAlign': 'Vertical Align', 'video': 'Video', 'view': 'View', 'viewSource': 'View Source', 'viewText': 'View Text', 'width': 'Width', 'wordWrap': 'Word Wrap', 'yes': 'Yes'};
	
	return {
		detectLanguage: function() {
			var lang = window.navigator.userLanguage || window.navigator.language;
			return lang.substr(0, 2).toLowerCase();
		},
		
		getDirection: function() {
			if (m_language == 'ar') {
				return 'rtl';
			} else {
				return 'ltr';
			}
		},
		
		getLanguage: function() {
			return m_language;
		},
		
		setLanguage: function(lang) {
			if (lang == 'en' || lang == 'ar') {
				m_language = lang;
			} 
		},
		
		translate: function(source) {
			var dest = '';
			switch(m_language) {
				case 'ar': {
					dest = m_ar[source];
					break;
				}
				case 'en': {
					dest = m_en[source];
					break;
				}
			}
			return dest;
		}
	};
})();

function TMediaList(numberOfRows, numberOfRowItems, url, autoUpdate) {
	var m_ajaxPanel                    = new TAjaxPanel();
    var m_alignment                    = 0;
    var m_autoUpdate                   = ((autoUpdate === undefined) || (autoUpdate == null)) ? false : autoUpdate;
    var m_auxiliaryParameters          = null;
    var m_brkBackground                = new TBrick('tableBackground');
	var m_brkBegin                     = new TBrick('tableBegin');
	var m_brkBorder                    = new TBrick();
	var m_brkBottom                    = new TBrick('tableBottom');
	var m_brkDecPage                   = new TBrick('tableDecPage');
	var m_brkEnd                       = new TBrick('tableEnd');
	var m_brkIncPage                   = new TBrick('tableIncPage');
	var m_cmdList                      = new TCommandsList();
	var m_dblClickCallback             = null;
    var m_height                       = 0;
    var m_items                        = new Array();
    var m_itemHeight                   = 125;
    var m_itemWidth                    = 150;
    var m_numberOfPages                = 0;
    var m_numberOfRows                 = ((numberOfRows === undefined) || (numberOfRows == null) || (numberOfRows <= 0)) ? 5 : numberOfRows;
    var m_numberOfRowItems             = (numberOfRowItems === undefined || numberOfRowItems == null || numberOfRowItems <= 0) ? 2 : numberOfRowItems;
    var m_order                        = 0;
    var m_padding                      = 2;
    var m_pageNumber                   = 1;
    var m_rightClickId                 = 0;
    var m_selectedMediaChangedCallback = null;
    var m_testCell                     = new TText('', 'normalText');
    var m_this                         = this;
    var m_txtNumberOfPages             = new TText('');
    var m_txtPageNumber                = new TText('', 'smallFixed');
	var m_txtPageOfPages               = new TText(TLang.translate('pageOf'), 'smallFixed');
    var m_updateCallback               = null;
    var m_url                          = url;
    var m_width                        = 0;
    var m_x                            = 0;
    var m_y                            = 0;
    
    var adjustMedia = function(i, j) {
    	var coverClick = new TCaller(onItemClick, m_items[i][j].id);
    	var coverDblClick = new TCaller(onItemDblClick, m_items[i][j].id);
		var coverOut = new TCaller(onItemOut, m_items[i][j].id);
		var coverOver = new TCaller(onItemOver, m_items[i][j].id);
									
		m_items[i][j].cover.addEvent('click', coverClick.callback);
		m_items[i][j].cover.getElement().oncontextmenu = function(e) { onItemContextMenu(e, m_items[i][j].id); };
		m_items[i][j].cover.addEvent('dblclick', coverDblClick.callback);
		m_items[i][j].cover.addEvent('mouseout', coverOut.callback);
		m_items[i][j].cover.addEvent('mouseover', coverOver.callback);
		m_items[i][j].cover.setTooltip(m_items[i][j].description);
		
		m_items[i][j].background.setBackground('#FFFFFF');
		
		if (m_items[i][j].title != null) {
			m_items[i][j].title.setOrder(m_order + 2);
	    	m_items[i][j].title.move(m_items[i][j].background.getX() + (m_itemWidth - m_items[i][j].title.getWidth()) / 2, m_items[i][j].background.getY() + m_itemHeight - 5 - m_items[i][j].title.getHeight());
	    	m_items[i][j].title.show();
		}
		
		var type = m_items[i][j].type.split("/")[0].toLowerCase();
		
    	if (type == 'image') {
    		var size = calculateFitImageSize(m_items[i][j].url, m_itemWidth - 10, m_itemHeight - 15 - m_items[i][j].title.getHeight());
    		var img = new TImage(m_items[i][j].url, size.width, size.height);
    		m_items[i][j].media = img;
    		m_items[i][j].media.setOrder(m_order + 7);
    		m_items[i][j].media.move(m_items[i][j].background.getX() + (m_itemWidth - size.width) / 2, m_items[i][j].background.getY() + 5);
    	} else if (type == 'audio'){
    		var img = new TImage('images/sound.png', 67, 72);
    		m_items[i][j].media = img;
    		m_items[i][j].media.setOrder(m_order + 7);
    		m_items[i][j].media.move(m_items[i][j].background.getX() + (m_itemWidth - 67) / 2, m_items[i][j].background.getY() + 5);
    	} else if(type == 'video') {
    		var img = new TImage('images/video.png', 72, 72);
    		m_items[i][j].media = img;
    		m_items[i][j].media.setOrder(m_order + 7);
    		m_items[i][j].media.move(m_items[i][j].background.getX() + (m_itemWidth - 72) / 2, m_items[i][j].background.getY() + 5);
    	}
    	
    	m_items[i][j].cover.show();
    	if (m_items[i][j].media != null) { m_items[i][j].media.show(); }
    };
    
    var adjustPageNumber = function() {
		m_txtPageNumber.setX(m_brkDecPage.getX() + m_brkDecPage.getWidth() + 8);
		m_txtPageOfPages.setX(m_txtPageNumber.getX() + m_txtPageNumber.getWidth() + 8);
		m_txtNumberOfPages.setX(m_txtPageOfPages.getX() + m_txtPageOfPages.getWidth() + 8);
		m_brkIncPage.setX(m_txtNumberOfPages.getX() + m_txtNumberOfPages.getWidth() + 8);
		m_brkEnd.setX(m_brkIncPage.getX() + m_brkIncPage.getWidth() + 5);
	};
	
	var calculateFitImageSize = function(src, maxWidth, maxHeight) {
		var size = getImageSize(src);
		var fitSize;
		if (size.width == 0 || size.height == 0) {
			return { width: maxWidth, height: maxHeight };
		} else {
			fitSize = calculateAspectRatioFit(size.width, size.height, maxWidth, maxHeight);
		}
		
		return { width: fitSize.width, height: fitSize.height };
	};
	
	var closeCmdList = function() {
    	m_cmdList.hide();
    };
	
	var getItemById = function(id) {
		for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) {
				if (m_items[i][j].id == id) {
					return [i, j];
				}
			}
		}
		return null;
	};
    
    var isSelected = function(id) {
	  for (var i = 0; i < m_numberOfRows; i++) {
		for (var j = 0; j < m_numberOfRowItems; j++) {
			if (m_items[i][j].id == id) {
				return m_items[i][j].selected == true;
			}
		}
	  }
	  return false;
	};
    
    var onBeginClick = function() {
		m_pageNumber = 1;
		m_this.update();
	};

	var onDecPageClick = function() {
		m_pageNumber--;
		m_this.update();
	};
	
	var onEndClick = function() {
		m_pageNumber = m_numberOfPages;
		m_this.update();
	};
	
	var onIncPageClick = function() {
		m_pageNumber++;
		m_this.update();
	};
	
	var onItemClick = function(id) { 
		if (isSelected(id)) {
			unselectItem(id);
		} else {
			selectItem(id);
		}
		
		if(m_selectedMediaChangedCallback != null) {
			m_selectedMediaChangedCallback();
		}
	};
	
	var onItemContextMenu = function(e, id) {
		m_rightClickId = id;
		e = e ? e : window.event;
		m_cmdList.show(e.clientX, e.clientY);
		if (e.returnValue) {
		 	e.returnValue = false;
		} else if (e.preventDefault) {
			e.preventDefault();
		} else {
			return false;
		}
	};
	
	var onItemDblClick = function(id) {
		selectItem(id);
		
		if (m_dblClickCallback != null) {
			m_dblClickCallback(id);
		}
	};
	
	var onItemOut = function(id) {
		var indexes = getItemById(id);
		if (!isSelected(id)) { m_items[indexes[0]][indexes[1]].background.setBackground('#FFFFFF'); }
		m_items[indexes[0]][indexes[1]].cover.setCursor('default');
	};
	
	var onItemOver = function(id) {
		var indexes = getItemById(id);
		m_items[indexes[0]][indexes[1]].background.setBackground('#FFD0A0');
		m_items[indexes[0]][indexes[1]].cover.setCursor('pointer');
	};
	
	var onSelectItem = function() {
		var indexes = getItemById(m_rightClickId);
		m_items[indexes[0]][indexes[1]].selected = true;
		m_items[indexes[0]][indexes[1]].background.setBackground('#FFD0A0');
	};
	
	var onUpdateError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));
		
		if (m_updateCallback != null) {
			m_updateCallback();
			m_updateCallback = null;
		}
	};
	
	var onUpdateOk = function(xmlDoc, xmlText) {
		m_this.loadXML(xmlDoc);
	};
	
	var removeMedia = function() {
		for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) { 
				var x = m_items[i][j].background.getX();
				var y = m_items[i][j].background.getY();
				m_items[i][j].background.setBackground('#E0E0E0');
				m_items[i][j].cover.destroy();
				m_items[i][j].cover = new TBrick();
				m_items[i][j].cover.setSize(m_itemWidth, m_itemHeight);
				m_items[i][j].cover.setOrder(m_order + 10);
				m_items[i][j].cover.move(x, y);
				m_items[i][j].description = null;
				m_items[i][j].id = null;
				if (m_items[i][j].media) { m_items[i][j].media.destroy(); }
				m_items[i][j].media = null;
				m_items[i][j].selected = false;
				if (m_items[i][j].title && m_items[i][j].title.getElement() != null) { m_items[i][j].title.destroy(); }
				m_items[i][j].type = null;
				m_items[i][j].url = null;
				
			} 
		}
	};
	
	var selectItem = function(id) {
	  for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) {
				if (m_items[i][j].id != id && m_items[i][j].id != null) {
						m_items[i][j].background.setBackground('#FFFFFF');
						m_items[i][j].selected = false;
				} else if(m_items[i][j].id == id) {
					m_items[i][j].selected = true;
				}
			}
	  }
	};
	
	var unselectItem = function(id) {
	  for (var i = 0; i < m_numberOfRows; i++) {
		for (var j = 0; j < m_numberOfRowItems; j++) {
			if (m_items[i][j].id == id) {
				m_items[i][j].background.setBackground('#FFFFFF');
				m_items[i][j].selected = false;
			}
		}
	  }
	};
	
	this.addMenuCommand = function(id, cmd, callback) {
		m_cmdList.add(id, cmd, callback);
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
	
	this.getHeight = function() {
		m_height = m_numberOfRows * m_itemHeight + (m_numberOfRows + 1) * 5 + 22;
		return m_height;
	};
	
	this.getRightClickedMedia = function() {
		for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) {
				if (m_items[i][j].id == m_rightClickId) {
					return { id: m_items[i][j].id, description: m_items[i][j].description, title: m_items[i][j].title.getText(), type: m_items[i][j].type, url: m_items[i][j].url };
				}
			}
		}
		return null;
	};
	
	this.getSelectedMedia = function() {
		var selectedItems = new Array();
		for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) {
				if (m_items[i][j].selected == true) {
					selectedItems.push({ id: m_items[i][j].id, description: m_items[i][j].description, title: m_items[i][j].title.getText(), type: m_items[i][j].type, url: m_items[i][j].url });
				}
			}
		}
		return selectedItems;
	};
	
	this.getWidth = function() {
		m_width = m_numberOfRowItems * m_itemWidth + (m_numberOfRowItems + 1) * 5 + 4;
		return m_width;
	};
	
	this.hide = function() {
		m_ajaxPanel.hide();
		m_brkBackground.hide();
	    m_brkBorder.hide();
	    m_brkBottom.hide();
	    m_brkBegin.hide();
	    m_brkDecPage.hide();
	    m_brkEnd.hide();
	    m_brkIncPage.hide();
	    m_txtNumberOfPages.hide();
	    m_txtPageNumber.hide();
	    m_txtPageOfPages.hide();

	    for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) { 
				m_items[i][j].background.hide();
				m_items[i][j].cover.hide();
				if (m_items[i][j].title && m_items[i][j].title.getElement() != null) { m_items[i][j].title.hide(); }
				if (m_items[i][j].media) {
					m_items[i][j].media.hide();
				}
			} 
		}
		
		if (m_items[0][0].media != null) {
			removeMedia();
		}
	};
	
	this.loadXML = function(xmlDoc) {
    	var elmNumberOfPages = xmlDoc.getElementsByTagName('NumberOfPages');
		
		if (elmNumberOfPages.length == 1) {
			if (elmNumberOfPages[0].firstChild.nodeValue != null) {
				m_numberOfPages = elmNumberOfPages[0].firstChild.nodeValue;
				m_txtNumberOfPages.setText(m_numberOfPages);

				var elmPageNumber = xmlDoc.getElementsByTagName('PageNumber');
				
				if (elmPageNumber.length == 1) {
					if (elmPageNumber[0].firstChild.nodeValue != null) {
						m_pageNumber = elmPageNumber[0].firstChild.nodeValue;
						m_txtPageNumber.setText(m_pageNumber);
						adjustPageNumber();
						
						if (m_items[0][0].media != null) {
							removeMedia();
						}
						
						var elmRow = xmlDoc.getElementsByTagName('Row');
						var h = 0;
						
						for (var i = 0; i < m_numberOfRows; i++) {
							for (var j = 0; j < m_numberOfRowItems; j++) {
								if (elmRow[h]) {
									var nodes = elmRow[h].childNodes;
									h++;
									for (var k = 0; k < nodes.length; k++) {
										switch(nodes[k].nodeName.toString().toLowerCase()) {
											case 'id': {
												if (nodes.item(k).firstChild) { m_items[i][j].id = nodes.item(k).firstChild.nodeValue; }
												break;
											}
											case 'title': {
												if (nodes.item(k).firstChild) { 
													var title = new TText('', 'normalFixed');
													m_items[i][j].title = title;
													m_testCell.setText(nodes.item(k).firstChild.nodeValue);
													if (m_testCell.getWidth() + 8 > m_itemWidth) {
														m_items[i][j].title.setWidth(m_itemWidth - 8);
													}
													m_items[i][j].title.setText(nodes.item(k).firstChild.nodeValue);
											 	}
												break;
											}
											case 'type': {
												if (nodes.item(k).firstChild) { m_items[i][j].type = nodes.item(k).firstChild.nodeValue; }
												break;
											}
											case 'url': {
												if (nodes.item(k).firstChild) { m_items[i][j].url = nodes.item(k).firstChild.nodeValue; }
												break;
											}
											case 'description': {
												if (nodes.item(k).firstChild) { m_items[i][j].description = nodes.item(k).firstChild.nodeValue; }
												break;
											}
										}
									}
									
									adjustMedia(i, j);
									
								} 
							}
						}
					}
				}
			} else {
				TMessageBox.showModal(TLang.translate('error'), 'Received invalid number of table pages.');
			}
		} else {
			elements = xmlDoc.getElementsByTagName('Error');
				
			if (elements.length == 1) {
				var $errorText = (elements[0].firstChild == null || elements[0].firstChild.nodeValue == null) ? null : toHtml(elements[0].firstChild.nodeValue);
				
				if ($errorText == null) {
					$errorText = elements[0].getAttribute('reason');
				}

				TMessageBox.showModal(TLang.translate('error'), $errorText == null ? 'Unidentified error on server side.' : $errorText);
			} else {
				TMessageBox.showModal(TLang.translate('error'), 'Unidentified error on server side.');
			}
		}

		if (m_updateCallback != null) {
			m_updateCallback();
			m_updateCallback = null;
		}
    };
	
	this.move = function(x, y) {
		m_x = x;
		m_y = y;
		
	    m_brkBorder.move(x, y);
	    m_brkBorder.setSize(m_width, m_height);
	    m_brkBottom.move(x + 1, y + m_height - 19);
	    m_brkBottom.setWidth(m_width - 2);

	    m_brkBackground.move(x + 1, y + 1);
	    m_brkBackground.setSize(m_width - 2, m_height - 2);

	    m_ajaxPanel.setSize(m_width, m_height);
	    m_ajaxPanel.move(x, y);

	    var navigationY = y + m_height - 15;

	    m_brkBegin.move(x + 4, navigationY);
	    m_brkDecPage.move(x + 22, navigationY);
	    m_txtNumberOfPages.setY(navigationY - 1);
	    m_txtPageNumber.setY(navigationY - 1);
	    m_txtPageOfPages.setY(navigationY - 1);
	    m_brkIncPage.move(x + 72, navigationY);
	    m_brkEnd.move(x + 92, navigationY);
	    
	    var itemY = y + 7;
	    
	    for (var i = 0; i < m_numberOfRows; i++) {
	    	var itemX = x + 7;
			for (var j = 0; j < m_numberOfRowItems; j++) { 
				m_items[i][j].background.move(itemX, itemY);
				m_items[i][j].background.setSize(m_itemWidth, m_itemHeight);
				m_items[i][j].cover.move(itemX, itemY);
				m_items[i][j].cover.setSize(m_itemWidth, m_itemHeight);
				itemX += m_itemWidth + 5;
			}
			itemY += m_itemHeight + 5;
		}

	    adjustPageNumber();
	};
	
	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};

	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setAuxiliaryParameters = function(auxiliaryParameters) {
		m_auxiliaryParameters = auxiliaryParameters;
	};
	
	this.setCommandCallback = function(cmd, callback) {
		m_cmdList.setCommandCallback(cmd, callback);
	};
	
	this.setDblClickCallback = function(callback) {
		m_dblClickCallback = callback;
	};
	
	this.setSelectionChangedCallback = function(callback) {
		m_selectedMediaChangedCallback = callback;
	};
	
	this.setMediaHeight = function(h) {
		if (h >= 100) { m_itemHeight = h; }
	};
	
	this.setMediaWidth = function(w) {
		if (w >=100) { m_itemWidth = w; }
	};
	
	this.setOrder = function(order) {
		m_order = m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1) + 1);

		for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) { 
				m_items[i][j].background.setOrder(m_order + 1);
				m_items[i][j].cover.setOrder(m_order + 10);
			} 
		}

	    var navigationOrder = m_brkBottom.setOrder(m_order + 2);

	    m_brkBegin.setOrder(navigationOrder);
	    m_brkDecPage.setOrder(navigationOrder);
	    m_brkEnd.setOrder(navigationOrder);
	    m_brkIncPage.setOrder(navigationOrder);
	    m_txtNumberOfPages.setOrder(navigationOrder);
	    m_txtPageNumber.setOrder(navigationOrder);
	    m_txtPageOfPages.setOrder(navigationOrder);

	    return m_ajaxPanel.setOrder(navigationOrder + 6);
	};
	
	this.show = function() {
		m_brkBackground.show();
	    m_brkBorder.show();
	    m_brkBottom.show();
	    m_brkBegin.show();
	    m_brkDecPage.show();
	    m_brkEnd.show();
	    m_brkIncPage.show();
	    m_txtNumberOfPages.show();
	    m_txtPageNumber.show();
	    m_txtPageOfPages.show();

	    for (var i = 0; i < m_numberOfRows; i++) {
			for (var j = 0; j < m_numberOfRowItems; j++) { 
				m_items[i][j].background.show();
				m_items[i][j].cover.show();
			} 
		}

	    if (m_autoUpdate) {
	        m_this.update();
	    }
	};
	
	this.update = function (updateCallback) {
		var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId><ItemsOnPage>' + m_numberOfRows * m_numberOfRowItems + '</ItemsOnPage><PageNumber>' + m_pageNumber + '</PageNumber>';

	    if (updateCallback !== undefined) {
	        m_updateCallback = updateCallback;
	    }

	    if (m_auxiliaryParameters) {
	        request += m_auxiliaryParameters;
	    }

	    request += '</Vtf>';
	    TAjax.sendRequest(m_this, m_url, request, onUpdateOk, onUpdateError);
	};
	
	for (var i = 0; i < m_numberOfRows; i++) {
		m_items[i] = new Array(m_numberOfRowItems);
		for (var j = 0; j < m_numberOfRowItems; j++) {
			var background = new TBrick();
			var cover = new TBrick();
			
			m_items[i][j] = { id: null, background: background, title: null, media: null, url: null, cover: cover, description: null, type: null, selected: false };
		}
	}
	
	m_cmdList.add(0, TLang.translate('select'), onSelectItem);
	/*m_cmdList.add(1, TLang.translate('view'));
	m_cmdList.add(2, TLang.translate('download'));
	m_cmdList.add(3, TLang.translate('edit')); 
	m_cmdList.add(4, TLang.translate('delete'));*/
	
    document.onclick = closeCmdList;
	
	m_brkBegin.addEvent('click', onBeginClick);
	m_brkBorder.setBorder('#80B0D0', 1, 1, 1, 1);
	m_brkDecPage.addEvent('click', onDecPageClick);
	m_brkIncPage.addEvent('click', onIncPageClick);
	m_brkEnd.addEvent('click', onEndClick);
	
	m_testCell.move(0, 0);
	m_testCell.hide();
};

function TNameValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re    = /^[\w]+[\w\'\x20\-]*[\w]+$/;
		var valid = false;
		
		if (!re.test(text)) {
			m_phrase = 'This must contain only letters, numbers and underscores!';
		} else {
			valid = true;
			m_phrase = TLang.translate('thisIsValid');
		}
		
		return valid;
	};
};

function TNumberValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re    = /^[+-]?\d+(\.\d+)?$/;
		var valid = false;
		
		if (!re.test(text)) {
			m_phrase = TLang.translate('thisMustContainOnlyNumbers');
		} else {
			valid = true;
			m_phrase = TLang.translate('thisIsValid');
		}
		
		return valid;
	};
};

function TPage(title, backColor, margin, padding, layout) {
	var m_body       = new TBrick();
	var m_layout     = (layout === undefined || layout == null) ? new TVerticalLayout((margin === undefined || margin == null) ? 15 : margin, (padding === undefined || padding == null) ? 7 : padding) : layout;
	var m_visible    = false;
	var m_ajaxPanel  = new TAjaxPanel();
	var m_this       = this;

	title === undefined || title == null ? document.title = TLang.translate('newPage') : document.title = title;
	m_body.setBackground((backColor == undefined || backColor == null) ? '#FFFFFF' : backColor);
	
	this.add = function(object) {
		if (m_layout != null) {
			m_layout.add(object);
		}
	};
	
	this.getHeight = function() {
		return Math.max(m_layout == null ? getViewportHeight() : m_layout.getHeight(), getViewportHeight());
	};

	this.getLayout = function() {
		return m_layout;
	};

	this.getWidth = function() {
		return Math.max(m_layout == null ? getViewportWidth() : m_layout.getWidth(), getViewportWidth());
	};
	
	this.hide = function() {
		if (m_visible) {
			m_body.hide();
			
			if (m_layout != null) {
				m_layout.hide();
			}
		
			m_visible = false;
		}
	};

	this.isVisible = function() {
		return m_visible;
	};

	this.move = function(x, y) {
		var bodyHeight  = m_this.getHeight();
		var bodyWidth   = m_this.getWidth();
		
		m_body.setSize(bodyWidth, bodyHeight);
		m_body.move(x, y);
		
		if (m_layout != null) {
			m_layout.move(x + (bodyWidth - m_layout.getWidth()) / 2, y);
		}

		m_ajaxPanel.setSize(bodyWidth, bodyHeight);
		m_ajaxPanel.move(x + getViewportWidth() / 2, y + getViewportHeight() / 2);
	};

	this.refresh = function() {
		hidePage();
		showPage(m_this);
	};
	
	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};
	
	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setBackground = function(value) {
		m_body.setBackground(value);
	};
	
	this.setOrder = function(order) {
		order += 1;

		m_body.setOrder(order++);
		
		if (m_layout != null) {
			order = m_layout.setOrder(order++);
		}

		return m_ajaxPanel.setOrder(order);
	};
	
	this.setTitle = function(title) {
		document.title = title;
	};
	
	this.show = function() {
		if (!m_visible) {
			m_body.show();
		
			if (m_layout != null) {
				m_layout.show();
			}
		
			m_visible = true;
		}
	};
};

function TPasswordValidator() {
	var m_phrase = '';

	this.getPhrase = function() {
		return m_phrase;
	};
	
	this.validate = function(text) {
		var valid = false;

		if (text.length < 6) {
			m_phrase = TLang.translate('passwordAtLeast'); 
		} else {
			var re = /^[\w\@\#\$\%\^\&\*]+$/;
			
			if (!re.test(text)) {
				m_phrase = TLang.translate('passwordMustContain');
			} else {
				m_phrase = TLang.translate('passwordIsValid');
				valid = true;
			}
		}

		return valid;
	};
};

function TPatternValidator(pattern) {
	var m_phrase = '';
	var re = (pattern === undefined || pattern == null) ? /^([A-Za-z0-9_\-\.])+$/ : pattern;
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var valid = false;
		
		if (text != '') {
			if (!re.test(text)) {
				m_phrase = TLang.translate('patternIsInvalid');
			} else {
				valid = true;
				m_phrase = TLang.translate('thisIsValid');
			}
		}
		
		return valid;
	};
};

function TPriceValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re    = /^\d+\.\d\d$/;
		var valid = false;
		
		if (!re.test(text)) {
			m_phrase = 'This must contain only numbers and decimal dot!';
		} else {
			valid = true;
			m_phrase = TLang.translate('thisIsValid');
		}
		
		return valid;
	};
};

function TRequest() {
	var m_request = '';

	this.add = function(propertyName, propertyValue, encode) {
		encode = (encode === undefined || encode == null) ? true : encode;
		if (encode) {
			m_request += '<' + propertyName + '>' + toHtml(propertyValue) + '</' + propertyName + '>';
		} else {
			m_request += '<' + propertyName + '>' + propertyValue + '</' + propertyName + '>';
		}
	};

	this.getParameters = function() {
		return m_request;
	};

	this.getRequest = function() {
		return '<Vtf><SessionId>' + g_sessionId + '</SessionId>' + m_request + '</Vtf>';
	};
};

function TScrollableDropdownList3(numberOfVisibleItems, url, parent, autoUpdate) {
    var m_ajaxPanel = new TAjaxPanel();
    var m_alignment = 0;
    var m_autoUpdate = ((autoUpdate === undefined) || (autoUpdate == null)) ? false : autoUpdate;
    var m_auxiliaryParameters = null;
    var m_button = new TBrick('dllButton');
    var m_cover = new TBrick();
    var m_ddHeight = 0;
    var m_ddWrapper = new TBrick('ddWrapper');
    var m_height = 16;
    var m_isDisabled = false;
    var m_items = new Array();
    var m_itemsVisible = false;
    var m_numberOfVisibleItems = ((numberOfVisibleItems === undefined) || (numberOfVisibleItems == null) || (numberOfVisibleItems <= 0)) ? 8 : numberOfVisibleItems;
    var m_onChangeCallback = null;
    var m_order = 0;
    var m_padding = 2;
    var m_parent = ((parent === undefined) || (parent == null)) ? null : parent;
    var m_selectedId = 0;
    var m_selectedText = '';
    var m_setFirst = false;
    var m_setId = false;
    var m_setItem = false;
    var m_this = this;
    var m_timeout = 1000;
    var m_timerId = 0;
    var m_txtItem = new TText();
    var m_updateCallback = null;
    var m_url = url;
    var m_width = 200;
    var m_wrapper = new TBrick();

    var setItemsOrder = function () {
        var orderBackground = m_order + 101;
        var orderItem = m_order + 110;
        var orderCover = m_order + 111;

        for (var i = 0, n = m_items.length; i < n; i++) {
            m_items[i].background.setOrder(orderBackground);
            m_items[i].cover.setOrder(orderCover);
            m_items[i].item.setOrder(orderItem);
        }
    };

    var closeDropdownPanel = function () {
        m_ddWrapper.hide();

        hideItems(0, m_items.length);

        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        m_itemsVisible = false;
    };

    var hideItems = function (from, to) {
        for (var i = from; i < to; i++) {
            m_items[i].background.hide();
            m_items[i].cover.hide();
            m_items[i].item.hide();
        }
    };

    var onCoverClick = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_ddWrapper.show();

                showItems(0, m_items.length);

                m_button.setBackground("url('images/ddl/bd.gif') no-repeat left top");
                m_itemsVisible = true;

                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
        }
    };

    var onCoverOut = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
            } else {
                if (m_timerId == 0) {
                    m_timerId = setTimeout(onTimeout, m_timeout);
                }
            }
        }
    };

    var onCoverOver = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bo.gif') no-repeat left top");
            } else {
                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }

            //console.log(id + ' I am over dropdown button !!!!!');
        }
    };

    var onDropdownOut = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
            } else {
                if (m_timerId == 0) {
                    m_timerId = setTimeout(onTimeout, m_timeout);
                }
            }
        }
    };

    var onDropdownOver = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bo.gif') no-repeat left top");
            } else {
                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
            //console.log(id + ' I am over scrollbar !!!!!');
        }
    };

    var onItemClick = function (id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    if (m_selectedId != id) {
                        m_txtItem.setText(m_items[i].item.getText());
                        m_selectedId = id;

                        if (m_onChangeCallback) {
                            m_onChangeCallback(id);
                        }
                    }

                    closeDropdownPanel();
                    break;
                }
            }

            clearTimeout(m_timerId);
            m_timerId = 0;
        }
    };

    var onItemOut = function (id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffffff');
                    break;
                }
            }

            if (m_timerId == 0) {
                m_timerId = setTimeout(onTimeout, m_timeout);
            }
        }
    };

    var onItemOver = function (id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffd0a0');
                    break;
                }
            }

            if (m_timerId > 0) {
                clearTimeout(m_timerId);
                m_timerId = 0;
            }
        }
    };

    var onTimeout = function () {
        closeDropdownPanel();

        m_timerId = 0;
    };

    var onUpdateError = function (text) {
        TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var onUpdateOk = function (xmlDoc, xmlText) {

        var itemElems = xmlDoc.getElementsByTagName('Item');

        if (itemElems.length >= 1) {

            for (var i = 0; i < itemElems.length; i++) {
                var nodes = itemElems[i].childNodes;
                if (nodes[0].firstChild != null && nodes[0].firstChild.nodeValue != null && nodes[1].firstChild != null && nodes[1].firstChild.nodeValue != null) {
                    var itemId = nodes[0].firstChild.nodeValue;
                    var itemText = nodes[1].firstChild.nodeValue;

                    var cover = new TBrick(null, m_ddWrapper);
                    var itemClick = new TCaller(onItemClick, itemId);
                    var itemOut = new TCaller(onItemOut, itemId);
                    var itemOver = new TCaller(onItemOver, itemId);

                    cover.addEvent('mouseout', itemOut.callback);
                    cover.addEvent('mouseover', itemOver.callback);
                    cover.addEvent('click', itemClick.callback);

                    m_items.push({ id: itemId, item: new TText(itemText, null, null, m_ddWrapper), background: new TBrick(null, m_ddWrapper), cover: cover });
                }
            }

            setItemsOrder();

            if (m_parent != null) {
                m_parent.refresh();
            }

            if (m_setFirst) {
                if (m_items.length > 0) {
                    m_selectedId = m_items[0].id;
                    m_txtItem.setText(m_items[0].item.getText());
                }
            } else if (m_setId) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].id == m_selectedId) {
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            } else if (m_setItem) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].item.getText() == m_selectedText) {
                        m_selectedId = m_items[i].id;
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            }

        } else {
            elements = xmlDoc.getElementsByTagName('Error');

            if (elements.length == 1) {
                var $errorText = (elements[0].firstChild == null || elements[0].firstChild.nodeValue == null) ? null : toHtml(elements[0].firstChild.nodeValue);

                if ($errorText == null) {
                    $errorText = elements[0].getAttribute('reason');
                }

                TMessageBox.showModal(TLang.translate('error'), $errorText == null ? 'Unidentified error on server side.' : $errorText);
            } else {
                TMessageBox.showModal(TLang.translate('error'), 'Unidentified error on server side.');
            }
        }

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var showItems = function (from, to) {
        var itemY = 2;

        for (var i = from; i < to; i++) {
            var itemHeight = m_items[i].item.getHeight() + m_padding * 2;

            m_items[i].background.move(1, itemY);
            m_items[i].background.setSize(m_width, itemHeight);
            m_items[i].background.show();
            m_items[i].cover.move(1, itemY);
            m_items[i].cover.setSize(m_width, itemHeight);
            m_items[i].cover.show();
            m_items[i].item.move(m_padding * 2 + 1, itemY + 1);
            m_items[i].item.setWidth(m_width);
            m_items[i].item.show();

            itemY += itemHeight;
        }
    };

    this.clear = function () {
        while (m_items.length) {
            m_items[m_items.length - 1].item.destroy();
            m_items[m_items.length - 1].background.destroy();
            m_items[m_items.length - 1].cover.destroy();
            m_items.splice(m_items.length - 1, 1);
        }
    };

    this.disable = function () {
        m_isDisabled = true;
        m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        m_wrapper.disable();
    };

    this.enable = function () {
        m_isDisabled = false;
        m_wrapper.enable();
        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
    };

    this.getAlignment = function () {
        return m_alignment;
    };

    this.getHeight = function () {
        m_height = (m_items.length == 0) ? 16 : 0;
        m_ddHeight = 0;

        if (m_items.length > m_numberOfVisibleItems) {
            for (var i = 0; i < m_numberOfVisibleItems; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;

                if (m_height < height) {
                    m_height = height;
                }

            }
        } else {
            for (var i = 0; i < m_items.length; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;

                if (m_height < height) {
                    m_height = height;
                }

            }
        }

        m_height += m_padding * 2;

        if (m_height < 20) {
            m_height = 20;
        }

        return m_height;
    };

    this.getNumberOfItems = function () {
        return m_numberOfItems;
    };

    this.getNumberOfVisibleItems = function () {
        return m_numberOfVisibleItems;
    };

    this.getSelectedId = function () {
        return m_selectedId;
    };

    this.getText = function () {
        return m_txtItem.getText();
    };

    this.getWidth = function () {
        m_width = (m_items.length == 0) ? 200 : 0;

        for (var i = 0, n = m_items.length; i < n; i++) {
            var width = m_items[i].item.getWidth();

            if (m_width < width) {
                m_width = width;
            }
        }

        m_width += m_padding * 4;

        return m_width + 18;
    };

    this.hide = function () {
        m_button.hide();
        m_cover.hide();
        m_ddWrapper.hide();
        m_txtItem.hide();
        m_wrapper.hide();

        hideItems(0, m_items.length);
    };

    this.isDisabled = function () {
        return m_isDisabled;
    };

    this.move = function (x, y) {
        m_button.move(x + m_width + 5, y + 1);

        m_cover.move(x, y);
        m_cover.setSize(m_width + 22, m_height + 2);

        m_ddWrapper.move(x + 1, y + 4 + m_height);
        m_ddWrapper.setSize(m_width + 22, m_ddHeight);

        var itemY = y + 4 + m_height;

        for (var i = 0, n = m_items.length; i < n; i++) {
            var itemHeight = m_items[i].item.getHeight() + m_padding * 2;

            m_items[i].background.move(x + 1, itemY);
            m_items[i].background.setSize(m_width, itemHeight);
            m_items[i].cover.move(x + 1, itemY);
            m_items[i].cover.setSize(m_width, itemHeight);
            m_items[i].item.move(x + m_padding * 2 + 1, itemY + 1);

            itemY += itemHeight;
        }

        m_txtItem.move(x + m_padding * 2 + 1, y + 1 + (m_height - m_txtItem.getHeight()) / 2);

        m_wrapper.move(x + 1, y + 1);
        m_wrapper.setSize(m_width + 22, m_height);
    };

    this.setAjaxOff = function () {
        m_ajaxPanel.hide();
    };

    this.setAjaxOn = function () {
        m_ajaxPanel.show();
    };

    this.setAuxiliaryParameters = function (auxiliaryParameters) {
        m_auxiliaryParameters = auxiliaryParameters;
    };

    this.setNumberOfVisibleItems = function (numOfItm) {
        m_numberOfVisibleItems = (numOfItm > 0) ? numOfItm : 8;
    };

    this.setOnChange = function (callback) {
        m_onChangeCallback = callback;
    };

    this.setOrder = function (order) {
        m_order = order;

        order = m_cover.setOrder(m_button.setOrder(m_txtItem.setOrder(m_wrapper.setOrder(order + 1))) + 1);
        m_ddWrapper.setOrder(order + 1);

        var orderBackground = order + 2;
        var orderItem = order + 3;
        var orderCover = order + 4;

        for (var i = 0, n = m_items.length; i < n; i++) {
            m_items[i].background.setOrder(orderBackground);
            m_items[i].cover.setOrder(orderCover);
            m_items[i].item.setOrder(orderItem);
        }

        return order + 5;
    };

    this.setParent = function (parent) {
        m_parent = parent;
    };

    this.setSelectedFirst = function () {
        m_setFirst = true;
        m_setId = false;
        m_setItem = false;
        if (m_items.length > 0) {
            m_selectedId = m_items[0].id;
            m_txtItem.setText(m_items[0].item.getText());
        }
    };

    this.setSelectedId = function (id) {
        m_setFirst = false;
        m_setId = true;
        m_setItem = false;
        m_selectedId = id;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].id == id) {
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.setSelectedItem = function (itemText) {
        m_setFirst = false;
        m_setId = false;
        m_setItem = true;
        m_selectedText = itemText;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].item.getText() == itemText) {
                m_selectedId = m_items[i].id;
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.show = function () {
        if (!m_isDisabled) {
            m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        } else {
            m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        }

        if (m_autoUpdate) {
            this.update();
        }
        m_button.show();
        m_cover.show();
        m_txtItem.setText('Loading...');
        m_txtItem.show();
        m_wrapper.show();

        //console.log(id + ' I am the new TScrollableDropdownList !!!!!');
    };

    this.update = function (updateCallback) {
        this.clear();

        var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId>';

        if (updateCallback !== undefined) {
            m_updateCallback = updateCallback;
        }

        if (m_auxiliaryParameters) {
            request += m_auxiliaryParameters;
        }

        request += '</Vtf>';
        TAjax.sendRequest(m_this, m_url, request, onUpdateOk, onUpdateError);
    };

    m_cover.addEvent('click', onCoverClick);
    m_cover.addEvent('mouseout', onCoverOut);
    m_cover.addEvent('mouseover', onCoverOver);
    m_cover.setTabIndex(0);

    m_ddWrapper.addEvent('mouseout', onDropdownOut);
    m_ddWrapper.addEvent('mouseover', onDropdownOver);
    m_ddWrapper.setBackground('#FFFFFF');
    m_ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);
    m_ddWrapper.setOverflow('scroll');

    m_wrapper.setBackground('#FFFFFF');
    m_wrapper.setBorder('#80B0D0', 1, 1, 1, 1);
};

function TScrollableDropdownList2(numberOfVisibleItems, url, parent, autoUpdate) {
    var m_ajaxPanel = new TAjaxPanel();
    var m_alignment = 0;
    var m_autoUpdate = ((autoUpdate === undefined) || (autoUpdate == null)) ? false : autoUpdate;
    var m_auxiliaryParameters = null;
    var m_button = new TBrick('dllButton');
    var m_cover = new TBrick();
    var m_ddHeight = 0;
    var m_ddWrapper = new TBrick('ddWrapper');
    var m_down = new TBrick();
    var m_height = 16;
    var m_isDisabled = false;
    var m_items = new Array();
    var m_itemsVisible = false;
    var m_lastYPosition = 0;
    var m_numberOfVisibleItems = ((numberOfVisibleItems === undefined) || (numberOfVisibleItems == null) || (numberOfVisibleItems <= 0)) ? 8 : numberOfVisibleItems;
    var m_onChangeCallback = null;
    var m_order = 0;
    var m_padding = 2;
    var m_parent = ((parent === undefined) || (parent == null)) ? null : parent;
    var m_scroll = new TBrick();
    var m_scrollBar = new TBrick();
    var m_scrollPosition = 0;
    var m_scrollStep = 0;
    var m_scrollX = 0;
    var m_scrollY = 0;
    var m_selectedId = 0;
    var m_selectedText = '';
    var m_setFirst = false;
    var m_setId = false;
    var m_setItem = false;
    var m_this = this;
    var m_timeout = 1000;
    var m_timerId = 0;
    var m_txtItem = new TText();
    var m_up = new TBrick();
    var m_updateCallback = null;
    var m_url = url;
    var m_width = 200;
    var m_wrapper = new TBrick();
    var m_x = 0;
    var m_y = 0;

    var setItemsOrder = function () {
        var orderBackground = m_order + 101;
        var orderItem = m_order + 110;
        var orderCover = m_order + 111;

        for (var i = 0, n = m_items.length; i < n; i++) {
            m_items[i].background.setOrder(orderBackground);
            m_items[i].cover.setOrder(orderCover);
            m_items[i].item.setOrder(orderItem);
        }
    };

    var closeDropdownPanel = function () {
        m_ddWrapper.hide();

        if (m_items.length > m_numberOfVisibleItems) {
            m_scrollBar.hide();
            m_down.hide();
            m_scroll.hide();
            m_up.hide();

            hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

        } else {
            hideItems(0, m_items.length);
        }

        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        m_itemsVisible = false;
    };

    var hideItems = function (from, to) {
        for (var i = from; i < to; i++) {
            m_items[i].background.hide();
            m_items[i].cover.hide();
            m_items[i].item.hide();
        }
    };

    var onCoverClick = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_ddWrapper.show();

                if (m_items.length > m_numberOfVisibleItems) {
                    m_scrollBar.show();
                    m_down.setBackground("url('images/ddl/bo.gif') no-repeat left top");
                    m_down.show();
                    m_scroll.setBackground("url('images/ddl/bom.gif') no-repeat left top");
                    m_scroll.move(m_scrollX, m_scrollY);
                    m_scroll.show();
                    m_up.setBackground("url('images/ddl/bou.gif') no-repeat left top");
                    m_up.show();

                    showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

                } else {
                    showItems(0, m_items.length);
                }

                m_button.setBackground("url('images/ddl/bd.gif') no-repeat left top");
                m_itemsVisible = true;

                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
        }
    };

    var onCoverOut = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
            } else {
                if (m_timerId == 0) {
                    m_timerId = setTimeout(onTimeout, m_timeout);
                }
            }
        }
    };

    var onCoverOver = function () {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bo.gif') no-repeat left top");
            } else {
                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
        }
    };

    var onItemClick = function (id) {
        if (!m_isDisabled) {
            if (m_items.length > m_numberOfVisibleItems) {
                for (var i = m_scrollPosition, n = m_scrollPosition + m_numberOfVisibleItems; i < n; i++) {
                    if (m_items[i].id == id) {
                        if (m_selectedId != id) {
                            m_txtItem.setText(m_items[i].item.getText());
                            m_selectedId = id;

                            if (m_onChangeCallback) {
                                m_onChangeCallback(id);
                            }
                        }

                        closeDropdownPanel();
                        var newPosition = i;
                        var steps = 0;
                        if ((newPosition + m_numberOfVisibleItems) < m_items.length) {
                            steps = newPosition - m_scrollPosition;
                            m_scrollPosition = newPosition;
                            m_scrollY += (m_scrollStep * steps);
                        } else {
                            newPosition = m_items.length - m_numberOfVisibleItems;
                            if (newPosition > m_scrollPosition) {
                                steps = newPosition - m_scrollPosition;
                                m_scrollPosition = newPosition;
                                m_scrollY += (m_scrollStep * steps);
                            }
                        }

                        break;
                    }
                }
            } else {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].id == id) {
                        if (m_selectedId != id) {
                            m_txtItem.setText(m_items[i].item.getText());
                            m_selectedId = id;

                            if (m_onChangeCallback) {
                                m_onChangeCallback(id);
                            }
                        }

                        closeDropdownPanel();
                        break;
                    }
                }
            }

            clearTimeout(m_timerId);
            m_timerId = 0;
        }
    };

    var onItemOut = function (id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffffff');
                    break;
                }
            }

            if (m_timerId == 0) {
                m_timerId = setTimeout(onTimeout, m_timeout);
            }
        }
    };

    var onItemOver = function (id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffd0a0');
                    break;
                }
            }

            if (m_timerId > 0) {
                clearTimeout(m_timerId);
                m_timerId = 0;
            }
        }
    };

    var onPageUpDownClick = function (e) {
        if (!m_isDisabled) {

            switch (e.keyCode) {
                case 33: // Page Up
                    {
                        onScrollUp(m_numberOfVisibleItems);

                        if (e.stopPropagation) {           /* FF */
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        else {                             /* IE */
                            e.cancelBubble = true;
                            e.returnValue = false;
                        }

                        break;
                    }

                case 34: // Page Down
                    {
                        onScrollDown(m_numberOfVisibleItems);

                        if (e.stopPropagation) {           /* FF */
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        else {                             /* IE */
                            e.cancelBubble = true;
                            e.returnValue = false;
                        }

                        break;
                    }

                default:
                    {
                        break;
                    }
            }
        }
    };

    var onScrollBarClick = function (e) {
        if (!m_isDisabled) {
            e = (e == null) ? window.event : e;

            var clickYPosition = e.clientY;

            if (clickYPosition < m_scrollY) {  // Page Up
                onScrollUp(m_numberOfVisibleItems);
            } else {  // Page Down
                onScrollDown(m_numberOfVisibleItems);
            }
        }
    };
    
    var onScrollBarOut = function () {
        if (!m_isDisabled) {
            m_scrollBar.setBackground('#FFFFFF');

            onScrollOut();
        }
    };

    var onScrollBarOver = function () {
        if (!m_isDisabled) {
            m_scrollBar.setBackground('#F8F8F8');

            onScrollOver();
        }
    };

    var onScrollDown = function (n) {
        if (!m_isDisabled) {
            var maxY = m_y + m_height + m_ddHeight - 56;
            if ((m_scrollPosition + n) <= (m_items.length - m_numberOfVisibleItems)) {
                hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

                m_scrollPosition += n;

                if (m_scrollY + (m_scrollStep * n) < maxY) {
                    m_scrollY += (m_scrollStep * n);
                    m_scroll.move(m_scrollX, m_scrollY);
                }

                showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
            } else if (m_scrollY < maxY) {
                m_scrollY = maxY;
                m_scroll.move(m_scrollX, m_scrollY);

                hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
                m_scrollPosition = m_items.length - m_numberOfVisibleItems;
                showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
            }
        }
    };

    var onScrollDownClick = function () {
        if (!m_isDisabled) {
            onScrollDown(1);
        }
    };

    var onScrollMouseDown = function (e) {
        if (!m_isDisabled) {
            e = (e == null) ? window.event : e;
            m_scroll.addEvent('mousemove', onScrollMove);
            m_lastYPosition = e.clientY;
            document.body.style.MozUserSelect = "none";
            document.onselectstart = function () { return false; };
            document.ondragstart = function () { return false; };
        }
    };

    var onScrollMouseUp = function () {
        if (!m_isDisabled) {
            m_scroll.removeEvent('mousemove', onScrollMove);
            document.onselectstart = null;
            document.ondragstart = null;
            document.body.style.MozUserSelect = "all";
        }
    };

    var onScrollMove = function (e) {
        if (!m_isDisabled) {
            e = (e == null) ? window.event : e;

            var newYPosition = e.clientY;
            var d = newYPosition - m_lastYPosition;

            if (Math.abs(d) >= m_scrollStep) {
                var positionNumber = Math.round(Math.abs(d) / m_scrollStep);
                var minY = m_y + m_height + 24;
                var maxY = m_y + m_height + m_ddHeight - 56;

                hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

                if (d + m_scrollY > minY && d + m_scrollY < maxY) {
                    if (d < 0) {
                        if (m_scrollPosition - positionNumber > 0) {
                            m_scrollPosition -= positionNumber;
                        }
                    } else if (d > 0) {
                        if (m_scrollPosition + positionNumber < m_items.length - m_numberOfVisibleItems) {
                            m_scrollPosition += positionNumber;
                        }
                    }
                    m_scrollY += d;
                } else if (d + m_scrollY <= minY) {
                    m_scrollPosition = 0;
                    m_scrollY = minY;
                } else {
                    m_scrollPosition = m_items.length - m_numberOfVisibleItems;
                    m_scrollY = maxY;
                }

                m_scroll.move(m_scrollX, m_scrollY);

                showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

                m_lastYPosition = newYPosition;
            }
        }
    };

    var onScrollOut = function () {
        if (m_timerId == 0) {
            m_timerId = setTimeout(onTimeout, m_timeout);
        }
    };

    var onScrollOver = function () {
        if (m_timerId > 0) {
            clearTimeout(m_timerId);
            m_timerId = 0;
        }
    };

    var onScrollUp = function (n) {
        if (!m_isDisabled) {
            var minY = m_y + m_height + 24;
            if ((m_scrollPosition - n) >= 0) {
                hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);

                m_scrollPosition -= n;

                if (m_scrollY - (m_scrollStep * n) > minY) {
                    m_scrollY -= (m_scrollStep * n);
                    m_scroll.move(m_scrollX, m_scrollY);
                }

                showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
            } else if (m_scrollY > minY) {
                m_scrollY = minY;
                m_scroll.move(m_scrollX, m_scrollY);

                hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
                m_scrollPosition = 0;
                showItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
            }
        }
    };

    var onScrollUpClick = function () {
        if (!m_isDisabled) {
            onScrollUp(1);
        }
    };

    var onTimeout = function () {
        closeDropdownPanel();

        m_timerId = 0;
    };

    var onUpdateError = function (text) {
        TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var onUpdateOk = function (xmlDoc, xmlText) {

        var itemElems = xmlDoc.getElementsByTagName('Item');

        if (itemElems.length >= 1) {

            for (var i = 0; i < itemElems.length; i++) {
                var nodes = itemElems[i].childNodes;
                if (nodes[0].firstChild != null && nodes[0].firstChild.nodeValue != null && nodes[1].firstChild != null && nodes[1].firstChild.nodeValue != null) {
                    var itemId = nodes[0].firstChild.nodeValue;
                    var itemText = nodes[1].firstChild.nodeValue;

                    var cover = new TBrick();
                    var itemClick = new TCaller(onItemClick, itemId);
                    var itemOut = new TCaller(onItemOut, itemId);
                    var itemOver = new TCaller(onItemOver, itemId);

                    cover.addEvent('mouseout', itemOut.callback);
                    cover.addEvent('mouseover', itemOver.callback);
                    cover.addEvent('click', itemClick.callback);
                    
                    m_items.push({ id: itemId, item: new TText(itemText), background: new TBrick(), cover: cover });
                }
            }

            setItemsOrder();

            if (m_parent != null) {
                m_parent.refresh();
            }

            if (m_setFirst) {
                if (m_items.length > 0) {
                    m_selectedId = m_items[0].id;
                    m_txtItem.setText(m_items[0].item.getText());
                }
            } else if (m_setId) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].id == m_selectedId) {
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            } else if (m_setItem) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].item.getText() == m_selectedText) {
                        m_selectedId = m_items[i].id;
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            }

        } else {
            elements = xmlDoc.getElementsByTagName('Error');

            if (elements.length == 1) {
                var $errorText = (elements[0].firstChild == null || elements[0].firstChild.nodeValue == null) ? null : toHtml(elements[0].firstChild.nodeValue);

                if ($errorText == null) {
                    $errorText = elements[0].getAttribute('reason');
                }

                TMessageBox.showModal(TLang.translate('error'), $errorText == null ? 'Unidentified error on server side.' : $errorText);
            } else {
                TMessageBox.showModal(TLang.translate('error'), 'Unidentified error on server side.');
            }
        }

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var showItems = function (from, to) {
        var itemY = m_y + 4 + m_height;

        for (var i = from; i < to; i++) {
            var itemHeight = m_items[i].item.getHeight() + m_padding * 2;

            m_items[i].background.move(m_x + 1, itemY);
            m_items[i].background.setSize(m_width, itemHeight);
            m_items[i].background.show();
            m_items[i].cover.move(m_x + 1, itemY);
            m_items[i].cover.setSize(m_width, itemHeight);
            m_items[i].cover.show();
            m_items[i].item.move(m_x + m_padding * 2 + 1, itemY + 1);
            m_items[i].item.setWidth(m_width);
            m_items[i].item.show();

            itemY += itemHeight;
        }
    };

    this.clear = function () {
        while (m_items.length) {
            m_items[m_items.length - 1].item.destroy();
            m_items[m_items.length - 1].background.destroy();
            m_items.splice(m_items.length - 1, 1);
        }
    };

    this.disable = function () {
        m_isDisabled = true;
        m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        m_wrapper.disable();
    };

    this.enable = function () {
        m_isDisabled = false;
        m_wrapper.enable();
        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
    };

    this.getAlignment = function () {
        return m_alignment;
    };

    this.getHeight = function () {
        m_height = (m_items.length == 0) ? 16 : 0;
        m_ddHeight = 0;

        if (m_items.length > m_numberOfVisibleItems) {
            for (var i = 0; i < m_numberOfVisibleItems; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;
                
                if (m_height < height) {
                    m_height = height;
                }

            }
        } else {
            for (var i = 0; i < m_items.length; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;
                
                if (m_height < height) {
                    m_height = height;
                }

            }
        }

        m_height += m_padding * 2;

        if (m_height < 20) {
            m_height = 20;
        }

        return m_height;
    };

    this.getNumberOfItems = function () {
        return m_numberOfItems;
    };

    this.getNumberOfVisibleItems = function () {
        return m_numberOfVisibleItems;
    };

    this.getSelectedId = function () {
        return m_selectedId;
    };

    this.getText = function () {
        return m_txtItem.getText();
    };

    this.getWidth = function () {
        m_width = (m_items.length == 0) ? 200 : 0;

        for (var i = 0, n = m_items.length; i < n; i++) {
            var width = m_items[i].item.getWidth();

            if (m_width < width) {
                m_width = width;
            }
        }

        m_width += m_padding * 4;

        return m_width + 18;
    };

    this.hide = function () {
        m_button.hide();
        m_cover.hide();
        m_ddWrapper.hide();
        m_scroll.hide();
        m_down.hide();
        m_up.hide();
        m_scrollBar.hide();
        m_txtItem.hide();
        m_wrapper.hide();

        if (m_items.length > m_numberOfVisibleItems) {
            hideItems(m_scrollPosition, m_scrollPosition + m_numberOfVisibleItems);
        } else {
            hideItems(0, m_items.length);
        }
    };

    this.isDisabled = function () {
        return m_isDisabled;
    };

    this.move = function (x, y) {
        m_y = y;
        m_x = x;

        var scrollImageWidth = 18;
        var scrollImageHeight = 20;
        m_scrollPosition = 0;

        if (m_items.length > m_numberOfVisibleItems) {

            m_scrollBar.move(x + m_width + 1, y + 4 + m_height);
            m_scrollBar.setSize(scrollImageWidth, m_ddHeight);

            m_up.move(x + m_width + 1, y + 4 + m_height);
            m_up.setSize(scrollImageWidth, scrollImageHeight);

            m_scroll.move(x + m_width + 1, y + 4 + m_height + scrollImageHeight);
            m_scroll.setSize(scrollImageWidth, 40);

            m_down.move(x + m_width + 1, y + 4 + m_height + (m_ddHeight - scrollImageHeight));
            m_down.setSize(scrollImageWidth, scrollImageHeight);

            m_scrollX = x + m_width + 1;
            m_scrollY = y + 4 + m_height + scrollImageHeight;

            m_scrollStep = (m_ddHeight - ((2 * scrollImageHeight) + 40)) / (m_items.length - m_numberOfVisibleItems);

        } else {
            scrollImageWidth = 0;

            m_scrollBar.move(x + 1, y + 4 + m_height);
            m_scrollBar.setSize(0, 0);

            m_up.move(x + 1, y + 4 + m_height);
            m_up.setSize(0, 0);

            m_scroll.move(x + 1, y + 4 + m_height);
            m_scroll.setSize(0, 0);

            m_down.move(x + 1, y + 4 + m_height);
            m_down.setSize(0, 0);
        }

        m_button.move(x + m_width + 1, y + 1);

        m_cover.move(x, y);
        m_cover.setSize(m_width + 20, m_height + 2);

        m_ajaxPanel.setSize(m_width, m_height);
        m_ajaxPanel.move(x, y);

        m_ddWrapper.move(x + 1, y + 4 + m_height);
        m_ddWrapper.setSize(m_width + scrollImageWidth, m_ddHeight);

        m_txtItem.move(x + m_padding * 2 + 1, y + 1 + (m_height - m_txtItem.getHeight()) / 2);

        m_wrapper.move(x + 1, y + 1);
        m_wrapper.setSize(m_width + 18, m_height);
    };

    this.setAjaxOff = function () {
        m_ajaxPanel.hide();
    };

    this.setAjaxOn = function () {
        m_ajaxPanel.show();
    };
    
    this.setAuxiliaryParameters = function (auxiliaryParameters) {
        m_auxiliaryParameters = auxiliaryParameters;
    };
    
    this.setNumberOfVisibleItems = function (numOfItm) {
        m_numberOfVisibleItems = (numOfItm > 0) ? numOfItm : 8;
    };

    this.setOnChange = function (callback) {
        m_onChangeCallback = callback;
    };

    this.setOrder = function (order) {
        order = m_cover.setOrder(m_button.setOrder(m_txtItem.setOrder(m_wrapper.setOrder(order + 1))) + 1);
        order = m_scrollBar.setOrder(m_ddWrapper.setOrder(order + 100) + 1);

        m_down.setOrder(order);
        m_scroll.setOrder(order);
        m_up.setOrder(order);

        m_order = order;

        var orderBackground = order + 101;
        var orderItem = order + 110;
        var orderCover = order + 111;

        for (var i = 0, n = m_items.length; i < n; i++) {
            m_items[i].background.setOrder(orderBackground);
            m_items[i].cover.setOrder(orderCover);
            m_items[i].item.setOrder(orderItem);
        }

        return order + 1;
    };

    this.setParent = function (parent) {
        m_parent = parent;
    };

    this.setSelectedFirst = function () {
        m_setFirst = true;
        m_setId = false;
        m_setItem = false;
        if (m_items.length > 0) {
            m_selectedId = m_items[0].id;
            m_txtItem.setText(m_items[0].item.getText());
        }
    };

    this.setSelectedId = function (id) {
        m_setFirst = false;
        m_setId = true;
        m_setItem = false;
        m_selectedId = id;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].id == id) {
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.setSelectedItem = function (itemText) {
        m_setFirst = false;
        m_setId = false;
        m_setItem = true;
        m_selectedText = itemText;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].item.getText() == itemText) {
                m_selectedId = m_items[i].id;
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.show = function () {
        if (!m_isDisabled) {
            m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        } else {
            m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        }

        if (m_autoUpdate) {
            this.update();
        }
        m_button.show();
        m_cover.show();
        m_txtItem.setText(TLang.translate('loading') + '...');
        m_txtItem.show();
        m_wrapper.show();
    };

    this.update = function (updateCallback) {
        this.clear();

        var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId>';

        if (updateCallback !== undefined) {
            m_updateCallback = updateCallback;
        }

        if (m_auxiliaryParameters) {
            request += m_auxiliaryParameters;
        }

        request += '</Vtf>';
        TAjax.sendRequest(m_this, m_url, request, onUpdateOk, onUpdateError);
    };
    
    m_cover.addEvent('click', onCoverClick);
    m_cover.addEvent('mouseout', onCoverOut);
    m_cover.addEvent('mouseover', onCoverOver);
    m_cover.addEvent('keydown', onPageUpDownClick);
    m_cover.setTabIndex(0);

    m_ddWrapper.setBackground('#FFFFFF');
    m_ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);

    m_down.addEvent('click', onScrollDownClick);
    m_down.addEvent('mouseout', onScrollOut);
    m_down.addEvent('mouseover', onScrollOver);
    m_down.addEvent('keydown', onPageUpDownClick);
    m_down.setTabIndex(0);

    m_scroll.addEvent('mousedown', onScrollMouseDown);
    m_scroll.addEvent('mouseout', onScrollOut);
    m_scroll.addEvent('mouseover', onScrollOver);
    m_scroll.addEvent('keydown', onPageUpDownClick);
    m_scroll.setTabIndex(0);
    document.onmouseup = onScrollMouseUp;

    m_scrollBar.addEvent('mouseout', onScrollBarOut);
    m_scrollBar.addEvent('mouseover', onScrollBarOver);
    m_scrollBar.addEvent('click', onScrollBarClick);
    m_scrollBar.setBackground('#FFFFFF');

    m_up.addEvent('click', onScrollUpClick);
    m_up.addEvent('mouseout', onScrollOut);
    m_up.addEvent('mouseover', onScrollOver);
    m_up.addEvent('keydown', onPageUpDownClick);
    m_up.setTabIndex(0);

    m_wrapper.setBackground('#FFFFFF');
    m_wrapper.setBorder('#80B0D0', 1, 1, 1, 1);
};

function TScrollableDropdownList(numberOfVisibleItems, url, parent, autoUpdate) {
    var m_ajaxPanel            = new TAjaxPanel();
    var m_alignment            = 0;
    var m_autoUpdate           = ((autoUpdate === undefined) || (autoUpdate == null)) ? false : autoUpdate;
    var m_auxiliaryParameters  = null;
    var m_button               = new TBrick('dllButton');
    var m_cover                = new TBrick();
    var m_ddHeight             = 0;
    var m_ddWrapper            = new TBrick('ddWrapper');
    var m_down                 = new TBrick();
    var m_height               = 16;
    var m_isDisabled           = false;
    var m_items                = new Array();
    var m_itemsVisible         = false;
    var m_numberOfVisibleItems = ((numberOfVisibleItems === undefined) || (numberOfVisibleItems == null) || (numberOfVisibleItems <= 0)) ? 8 : numberOfVisibleItems;
    var m_onChangeCallback     = null;
    var m_order                = 0;
    var m_padding              = 2;
    var m_parent               = ((parent === undefined) || (parent == null)) ? null : parent;
    var m_Position             = 0;
    var m_selectedId           = 0;
    var m_selectedText         = '';
    var m_setFirst             = false;
    var m_setId                = false;
    var m_setItem              = false;
    var m_this                 = this;
    var m_timeout              = 1000;
    var m_timerId              = 0;
    var m_txtItem              = new TText();
    var m_txtItemsNumber       = new TText('100/100');
    var m_up                   = new TBrick();
    var m_updateCallback       = null;
    var m_url                  = url;
    var m_width                = 200;
    var m_wrapper              = new TBrick();
    var m_x                    = 0;
    var m_y                    = 0;

    var setItemsOrder = function() {
        var orderBackground = m_order + 101;
        var orderItem = m_order + 110;
        var orderCover = m_order + 111;

        for (var i = 0, n = m_items.length; i < n; i++) {
            m_items[i].background.setOrder(orderBackground);
            m_items[i].cover.setOrder(orderCover);
            m_items[i].item.setOrder(orderItem);
        }
    };

    var closeDropdownPanel = function() {
        m_ddWrapper.hide();
		m_down.hide();
        m_up.hide();
        m_txtItemsNumber.hide();
        
        if (m_items.length > m_numberOfVisibleItems) {
            hideItems(m_Position, m_Position + m_numberOfVisibleItems);

        } else {
            hideItems(0, m_items.length);
        }

        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        m_itemsVisible = false;
    };

    var hideItems = function(from, to) {
        for (var i = from; i < to; i++) {
            m_items[i].background.hide();
            m_items[i].cover.hide();
            m_items[i].item.hide();
        }
    };

    var onCoverClick = function() {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_ddWrapper.show();
				m_down.setBackground("url('images/tbl/down.png') no-repeat left top");
                m_down.show();
                m_up.setBackground("url('images/tbl/up.png') no-repeat left top");
                m_up.show();
                m_txtItemsNumber.show();
                
                if (m_items.length > m_numberOfVisibleItems) {
                    showItems(m_Position, m_Position + m_numberOfVisibleItems);

                } else {
                    showItems(0, m_items.length);
                }

                m_button.setBackground("url('images/ddl/bd.gif') no-repeat left top");
                m_itemsVisible = true;

                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
        }
    };

    var onCoverOut = function() {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
            } else {
                if (m_timerId == 0) {
                    m_timerId = setTimeout(onTimeout, m_timeout);
                }
            }
        }
    };

    var onCoverOver = function() {
        if (!m_isDisabled) {
            if (!m_itemsVisible) {
                m_button.setBackground("url('images/ddl/bo.gif') no-repeat left top");
            } else {
                if (m_timerId > 0) {
                    clearTimeout(m_timerId);
                    m_timerId = 0;
                }
            }
        }
    };

    var onItemClick = function(id) {
        if (!m_isDisabled) {
            if (m_items.length > m_numberOfVisibleItems) {
                for (var i = m_Position, n = m_Position + m_numberOfVisibleItems; i < n; i++) {
                    if (m_items[i].id == id) {
                        if (m_selectedId != id) {
                            m_txtItem.setText(m_items[i].item.getText());
                            m_selectedId = id;

                            if (m_onChangeCallback) {
                                m_onChangeCallback(id);
                            }
                        }
						
						closeDropdownPanel();
						
						if (i + m_numberOfVisibleItems < m_items.length) {
								m_Position = i;
						} else {
							m_Position = m_items.length - m_numberOfVisibleItems;
						}
						
                        break;
                    }
                }
            } else {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].id == id) {
                        if (m_selectedId != id) {
                            m_txtItem.setText(m_items[i].item.getText());
                            m_selectedId = id;

                            if (m_onChangeCallback) {
                                m_onChangeCallback(id);
                            }
                        }

                        closeDropdownPanel();
                        break;
                    }
                }
            }

            clearTimeout(m_timerId);
            m_timerId = 0;
        }
    };

    var onItemOut = function(id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffffff');
                    break;
                }
            }

            if (m_timerId == 0) {
                m_timerId = setTimeout(onTimeout, m_timeout);
            }
        }
    };

    var onItemOver = function(id) {
        if (!m_isDisabled) {
            for (var i = 0, n = m_items.length; i < n; i++) {
                if (m_items[i].id == id) {
                    m_items[i].background.setBackground('#ffd0a0');
                    break;
                }
            }

            if (m_timerId > 0) {
                clearTimeout(m_timerId);
                m_timerId = 0;
            }
        }
    };

    var onDownClick = function() {
        hideItems(m_Position, m_Position + m_numberOfVisibleItems);
        
        if (m_Position + m_numberOfVisibleItems <= m_items.length - m_numberOfVisibleItems) {
        	 m_Position += m_numberOfVisibleItems;
        } else {
        	m_Position = m_items.length - m_numberOfVisibleItems;
        }
        
        showItems(m_Position, m_Position + m_numberOfVisibleItems);
    };

	var onDownOut = function() {
		m_down.setCursor('default');
		m_down.setBorder('#ffffff', 1, 1, 1, 1);
	};
	
	var onDownOver = function() {
		m_down.setCursor('pointer');
		m_down.setBorder('#ffd0a0', 1, 1, 1, 1);
		
		if (m_timerId > 0) {
            clearTimeout(m_timerId);
            m_timerId = 0;
        }
	};
	
    var onDropDownOut = function() {
        if (m_timerId == 0) {
            m_timerId = setTimeout(onTimeout, m_timeout);
        }
    };

    var onDropDownOver = function() {
        if (m_timerId > 0) {
            clearTimeout(m_timerId);
            m_timerId = 0;
        }
    };

    var onUpClick = function() {
        hideItems(m_Position, m_Position + m_numberOfVisibleItems);
        
        if (m_Position - m_numberOfVisibleItems >= 0) {
        	m_Position -= m_numberOfVisibleItems;
        } else {
        	m_Position = 0;
        }
        
        showItems(m_Position, m_Position + m_numberOfVisibleItems);
    };

	var onUpOut = function() {
		m_up.setCursor('default');
		m_up.setBorder('#ffffff', 1, 1, 1, 1);
	};
	
	var onUpOver = function() {
		m_up.setCursor('pointer');
		m_up.setBorder('#ffd0a0', 1, 1, 1, 1);
		
		if (m_timerId > 0) {
            clearTimeout(m_timerId);
            m_timerId = 0;
        }
	};

    var onTimeout = function() {
        closeDropdownPanel();

        m_timerId = 0;
    };

    var onUpdateError = function(text) {
        TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var onUpdateOk = function(xmlDoc, xmlText) {

        var itemElems = xmlDoc.getElementsByTagName('Item');

        if (itemElems.length >= 1) {
			if (itemElems.length < m_numberOfVisibleItems) {
				m_numberOfVisibleItems = itemElems.length;
			}
			
            for (var i = 0; i < itemElems.length; i++) {
                var nodes = itemElems[i].childNodes;
                if (nodes[0].firstChild != null && nodes[0].firstChild.nodeValue != null && nodes[1].firstChild != null && nodes[1].firstChild.nodeValue != null) {
                    var itemId = nodes[0].firstChild.nodeValue;
                    var itemText = nodes[1].firstChild.nodeValue;

                    var cover = new TBrick();
                    var itemClick = new TCaller(onItemClick, itemId);
                    var itemOut = new TCaller(onItemOut, itemId);
                    var itemOver = new TCaller(onItemOver, itemId);

                    cover.addEvent('mouseout', itemOut.callback);
                    cover.addEvent('mouseover', itemOver.callback);
                    cover.addEvent('click', itemClick.callback);
                    
                    m_items.push({ id: itemId, item: new TText(itemText), background: new TBrick(), cover: cover });
                }
            }

            setItemsOrder();
            m_this.getHeight();
            m_this.getWidth();
            m_this.move(m_x, m_y);

            if (m_parent != null) {
                m_parent.refresh();
            }

            if (m_setFirst) {
                if (m_items.length > 0) {
                    m_selectedId = m_items[0].id;
                    m_txtItem.setText(m_items[0].item.getText());
                }
            } else if (m_setId) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].id == m_selectedId) {
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            } else if (m_setItem) {
                for (var i = 0, n = m_items.length; i < n; i++) {
                    if (m_items[i].item.getText() == m_selectedText) {
                        m_selectedId = m_items[i].id;
                        m_txtItem.setText(m_items[i].item.getText());
                        break;
                    }
                }
            }

        } else {
            elements = xmlDoc.getElementsByTagName('Error');

            if (elements.length == 1) {
                var $errorText = (elements[0].firstChild == null || elements[0].firstChild.nodeValue == null) ? null : toHtml(elements[0].firstChild.nodeValue);

                if ($errorText == null) {
                    $errorText = elements[0].getAttribute('reason');
                }

                TMessageBox.showModal(TLang.translate('error'), $errorText == null ? 'Unidentified error on server side.' : $errorText);
            } else {
                TMessageBox.showModal(TLang.translate('error'), 'Unidentified error on server side.');
            }
        }

        if (m_updateCallback != null) {
            m_updateCallback();
            m_updateCallback = null;
        }
    };

    var showItems = function(from, to) {
        var itemY = m_y + 4 + m_height * 2;

        for (var i = from; i < to; i++) {
            var itemHeight = m_items[i].item.getHeight() + m_padding * 2;

            m_items[i].background.move(m_x + 1, itemY);
            m_items[i].background.setSize(m_width, itemHeight);
            m_items[i].background.show();
            m_items[i].cover.move(m_x + 1, itemY);
            m_items[i].cover.setSize(m_width, itemHeight);
            m_items[i].cover.show();
            m_items[i].item.move(m_x + m_padding * 2 + 1, itemY + 1);
            m_items[i].item.setWidth(m_width);
            m_items[i].item.show();

            itemY += itemHeight;
        }
        
        m_txtItemsNumber.setText('(' + to + '/' + m_items.length + ')');
    };
	
	this.add = function(itemId, itemText) {
		var cover = new TBrick();
        var itemClick = new TCaller(onItemClick, itemId);
        var itemOut = new TCaller(onItemOut, itemId);
        var itemOver = new TCaller(onItemOver, itemId);

        cover.addEvent('mouseout', itemOut.callback);
        cover.addEvent('mouseover', itemOver.callback);
        cover.addEvent('click', itemClick.callback);
                    
        m_items.push({ id: itemId, item: new TText(itemText), background: new TBrick(), cover: cover });
	};
	
    this.clear = function() {
        while (m_items.length) {
            m_items[m_items.length - 1].item.destroy();
            m_items[m_items.length - 1].background.destroy();
            m_items.splice(m_items.length - 1, 1);
        }
    };

    this.disable = function() {
        m_isDisabled = true;
        m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        m_wrapper.disable();
    };

    this.enable = function() {
        m_isDisabled = false;
        m_wrapper.enable();
        m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
    };

    this.getAlignment = function() {
        return m_alignment;
    };

    this.getHeight = function() {
        m_height = (m_items.length == 0) ? 16 : 0;
        m_ddHeight = 0;

        if (m_items.length > m_numberOfVisibleItems) {
            for (var i = 0; i < m_numberOfVisibleItems; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;
                
                if (m_height < height) {
                    m_height = height;
                }

            }
        } else {
            for (var i = 0; i < m_items.length; i++) {
                var height = m_items[i].item.getHeight();
                m_ddHeight += height + m_padding * 2;
                
                if (m_height < height) {
                    m_height = height;
                }

            }
        }

        m_height += m_padding * 2;

        if (m_height < 20) {
            m_height = 20;
        }

		m_ddHeight += m_height * 3;
		
        return m_height;
    };

    this.getNumberOfItems = function() {
        return m_numberOfItems;
    };

    this.getNumberOfVisibleItems = function() {
        return m_numberOfVisibleItems;
    };

    this.getSelectedId = function() {
        return m_selectedId;
    };

    this.getText = function() {
        return m_txtItem.getText();
    };

    this.getWidth = function() {
        m_width = (m_items.length == 0) ? 200 : 0;

        for (var i = 0, n = m_items.length; i < n; i++) {
            var width = m_items[i].item.getWidth();

            if (m_width < width) {
                m_width = width;
            }
        }

        m_width += m_padding * 4 + 20;
        
        var txtText = new TText('(' + m_items.length + '/' + m_items.length + ')');
        if (m_width < txtText.getWidth()) {
        	m_width = txtText.getWidth() + m_padding * 4;
        }
        txtText = null;

        return m_width;
    };

    this.hide = function() {
        m_button.hide();
        m_cover.hide();
        m_ddWrapper.hide();
        m_down.hide();
        m_up.hide();
        m_txtItem.hide();
        m_wrapper.hide();
        m_txtItemsNumber.hide();

        if (m_items.length > m_numberOfVisibleItems) {
            hideItems(m_Position, m_Position + m_numberOfVisibleItems);
        } else {
            hideItems(0, m_items.length);
        }
    };

    this.isDisabled = function() {
        return m_isDisabled;
    };

    this.move = function(x, y) {
        m_y = y;
        m_x = x;

        m_Position = 0;

        m_up.move(x + (m_width - 12) / 2, y + m_height * 1.5);
        m_up.setSize(12, 8);

        m_down.move(x + (m_width - 12) / 2, y + m_ddHeight - m_height / 2);
        m_down.setSize(12, 8);
        
        m_txtItemsNumber.move(x + (m_width - m_txtItemsNumber.getWidth())/ 2, y + m_ddHeight + m_height - m_height / 2 - m_txtItemsNumber.getHeight() / 2);

        m_button.move(x + m_width - 17, y + 1);

        m_cover.move(x, y);
        m_cover.setSize(m_width, m_height + 2);

        m_ddWrapper.move(x + 1, y + 4 + m_height);
        m_ddWrapper.setSize(m_width, m_ddHeight);

        m_txtItem.move(x + m_padding * 2 + 1, y + 1 + (m_height - m_txtItem.getHeight()) / 2);

        m_wrapper.move(x + 1, y + 1);
        m_wrapper.setSize(m_width, m_height);
        
        m_ajaxPanel.setSize(m_width, m_height);
        m_ajaxPanel.move(x, y);
    };
    
    this.setAjaxOff = function() {
        m_ajaxPanel.hide();
    };

    this.setAjaxOn = function() {
        m_ajaxPanel.show();
    };
    
    this.setAuxiliaryParameters = function(auxiliaryParameters) {
        m_auxiliaryParameters = auxiliaryParameters;
    };
    
    this.setNumberOfVisibleItems = function(numOfItm) {
        m_numberOfVisibleItems = (numOfItm > 0) ? numOfItm : 8;
    };

    this.setOnChange = function(callback) {
        m_onChangeCallback = callback;
    };

    this.setOrder = function (order) {
        order = m_cover.setOrder(m_button.setOrder(m_txtItem.setOrder(m_wrapper.setOrder(order + 1))) + 1);
        order = m_ddWrapper.setOrder(order + 100);

        m_down.setOrder(order + 1);
        m_up.setOrder(order + 1);
        m_txtItemsNumber.setOrder(order + 1);

        m_order = order;
		
		setItemsOrder();

        return order + 1;
    };

    this.setParent = function(parent) {
        m_parent = parent;
    };

    this.setSelectedFirst = function() {
        m_setFirst = true;
        m_setId = false;
        m_setItem = false;
        if (m_items.length > 0) {
            m_selectedId = m_items[0].id;
            m_txtItem.setText(m_items[0].item.getText());
        }
    };

    this.setSelectedId = function(id) {
        m_setFirst = false;
        m_setId = true;
        m_setItem = false;
        m_selectedId = id;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].id == id) {
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.setSelectedItem = function(itemText) {
        m_setFirst = false;
        m_setId = false;
        m_setItem = true;
        m_selectedText = itemText;
        for (var i = 0, n = m_items.length; i < n; i++) {
            if (m_items[i].item.getText() == itemText) {
                m_selectedId = m_items[i].id;
                m_txtItem.setText(m_items[i].item.getText());
                break;
            }
        }
    };

    this.show = function() {
        if (!m_isDisabled) {
            m_button.setBackground("url('images/ddl/bn.gif') no-repeat left top");
        } else {
            m_button.setBackground("url('images/ddl/dn.gif') no-repeat left top");
        }

        if (m_autoUpdate) {
        	m_txtItem.setText('Loading...');
            this.update();
        }
        m_button.show();
        m_cover.show();
        m_txtItem.show();
        m_wrapper.show();
    };

    this.update = function(updateCallback) {
        this.clear();
		
		var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId>';

        if (updateCallback !== undefined) {
            m_updateCallback = updateCallback;
        }

        if (m_auxiliaryParameters) {
            request += m_auxiliaryParameters;
        }

        request += '</Vtf>';
        TAjax.sendRequest(m_this, m_url, request, onUpdateOk, onUpdateError);
    };
    
    if (m_items.length) {
    	if (m_setFirst) {
           m_selectedId = m_items[0].id;
           m_txtItem.setText(m_items[0].item.getText());
        } else if (m_setId) {
           for (var i = 0, n = m_items.length; i < n; i++) {
               if (m_items[i].id == m_selectedId) {
                   m_txtItem.setText(m_items[i].item.getText());
                   break;
               }
           }
        } else if (m_setItem) {
           for (var i = 0, n = m_items.length; i < n; i++) {
               if (m_items[i].item.getText() == m_selectedText) {
                   m_selectedId = m_items[i].id;
                   m_txtItem.setText(m_items[i].item.getText());
                   break;
               }
           }
        }
    }
    
    m_cover.addEvent('click', onCoverClick);
    m_cover.addEvent('mouseout', onCoverOut);
    m_cover.addEvent('mouseover', onCoverOver);
    m_cover.setTabIndex(0);

    m_ddWrapper.addEvent('mouseout', onDropDownOut);
    m_ddWrapper.addEvent('mouseover', onDropDownOver);
    m_ddWrapper.setBackground('#FFFFFF');
    m_ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);

    m_down.addEvent('click', onDownClick);
    m_down.addEvent('mouseout', onDownOut);
    m_down.addEvent('mouseover', onDownOver);

    m_up.addEvent('click', onUpClick);
    m_up.addEvent('mouseout', onUpOut);
    m_up.addEvent('mouseover', onUpOver);
   
    m_wrapper.setBackground('#FFFFFF');
    m_wrapper.setBorder('#80B0D0', 1, 1, 1, 1);
};

function TScrollText(width, height, padding, url) {
	var m_ajaxPanel  = new TAjaxPanel();
	var m_alignment  = 0;
	var m_background = new TBrick();
	var m_callback   = null;
	var m_height     = height === undefined ? 300 : height;
	var m_padding    = padding === undefined ? 5 : padding;
	var m_padPanel   = new TBrick();
	var m_panel      = new TBrick('normalText');
	var m_loaded     = false;
	var m_this       = this;
	var m_url        = url === undefined ? null : url;
	var m_width      = width === undefined ? 200 : width;

	var onLoadError = function(text) {
		m_panel.setText(toMessage(text, true));
		
		if (m_callback) {
			m_callback();
		}
		
		m_loaded = true;
	};

	var onLoadOk = function(xmlDoc, text) {
		onLoadError(text);
	};

	this.getAlignment = function() {
		return m_alignment;
	};

	this.getHeight = function() {
		return m_height;
	};

	this.getWidth = function() {
		return m_width;
	};

	this.hide = function() {
		m_ajaxPanel.hide();
		m_background.hide();
		m_padPanel.hide();
		m_panel.hide();
	};

	this.move = function(x, y) {
		m_ajaxPanel.move(x + 1, y + 1);
		m_background.move(x, y);
		m_padPanel.move(x + 1, y + 1);
		m_panel.move(x + 1 + m_padding, y + 1 + m_padding);
	};

	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};
	
	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};

	this.setOnLoaded = function(callback) {
		m_callback = callback;
	};

	this.setOrder = function(order) {
		return m_ajaxPanel.setOrder(m_panel.setOrder(m_padPanel.setOrder(m_background.setOrder(order))));
	};
	
	this.setText = function(text) {
		m_panel.setText(toMessage(text));
	};

	this.show = function() {
		m_background.show();
		m_padPanel.show();
		m_panel.show();
		
		if (!m_loaded && m_url) {
			TAjax.sendRequest(m_this, m_url, (new TRequest()).getRequest(), onLoadOk, onLoadError);
		}
	};

	m_ajaxPanel.setSize(m_width - 2, m_height - 2);

	m_background.setBackground('#80B0D0');
	m_background.setSize(m_width, m_height);
	
	m_padPanel.setBackground('#FFFFFF');
	m_padPanel.setSize(m_width - 2, m_height - 2);
	
	m_panel.justifyText();
	m_panel.setBackground('#FFFFFF');
	m_panel.setOverflow('auto');
	m_panel.setSize(m_width - 2 - m_padding * 2, m_height - 2 - m_padding * 2);
};

function TSearchTextBox(icon, width, url, callback) {
	var m_ajaxPanel = new TAjaxPanel();
	var m_alignment = 0;
	var m_btnSearch = new TImageButton(25, 25, icon);
	var m_callback  = (callback === undefined || callback == null) ? null : callback;
	var m_this      = this;
	var m_txtBox    = new TTextBox(width);
	
	var onSearchClick = function() {
		var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId><SearchPhrase>' + m_txtBox.getValue() + '</SearchPhrase></Vtf>';

	    TAjax.sendRequest(m_this, url, request, onSearchOk, onSearchError);
	};
	
	var onSearchError = function(text) {
		TMessageBox.showModal('Error', 'Cannot connect to a server: ' + toHtml(text));
	};
	
	var onSearchOk = function(xmlDoc, xmlText) {
		if (m_callback != null) {
			m_callback(xmlDoc);
		}
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.disable = function() {
		m_btnSearch.disable();
		m_txtBox.disable();
	};
	
	this.enable = function() {
		m_btnSearch.enable();
		m_txtBox.enable();
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		return Math.max(m_txtBox.getHeight(), m_btnSearch.getHeight());
	};
	
	this.getText = function() {
		m_txtBox.getValue();
	};
	
	this.getWidth = function() {
		return m_txtBox.getWidth() + m_btnSearch.getWidth() + 32;
	};
	
	this.hide = function() {
		m_btnSearch.hide();
		m_txtBox.hide();
		m_ajaxPanel.hide();
	};
	
	this.move = function(x, y) {
		m_ajaxPanel.setSize(25, 25);
	    m_ajaxPanel.move(x + m_txtBox.getWidth() + m_btnSearch.getWidth() + 4, y);
		m_txtBox.move(x, y);
		m_btnSearch.move(x + m_txtBox.getWidth() + 2, y);
	};
	
	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};

	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setBackground = function(value) {
		m_txtBox.setBackground(value);
	};
	
	this.setFocus = function() {
		m_txtBox.setFocus();
	};
	
	this.setMaxLength = function(maxLength) {
		m_txtBox.setMaxLength(maxLength);
	};
	
	this.setOrder = function(order) {
		m_ajaxPanel.setOrder(order + 1);
		m_btnSearch.setOrder(order + 1);
		m_txtBox.setOrder(order + 1);
		return order + 2;
	};
	
	this.setText = function() {
		m_txtBox.setValue();
	};
	
	this.show = function() {
		m_btnSearch.show();
		m_txtBox.show();
	};
	
	m_btnSearch.setOnClick(onSearchClick);
};

function TSlider(mode, minValue, maxValue, step, currentValue, width, height) { // r 221 g 228 b 238 #DDE4EE
	var m_alignment      = 0;
	var m_brkBackground  = new TBrick();
	var m_brkBarCover    = new TBrick();
	var m_brkBarOn       = new TBrick();
	var m_brkLeftBar     = new TBrick();
	var m_brkMiddleBar   = new TBrick();
	var m_brkRightBar    = new TBrick();
	var m_brkHandle      = new TBrick();
	var m_changeCallback = null;
	var m_currentValue   = (currentValue === undefined || currentValue == null) ? 0 : currentValue;
	var m_handleX        = 0;
	var m_handleY        = 0;
	var m_height         = (height === undefined || height == null || typeof height !== 'number') ? 0 : height;
	var m_maxPossition   = 0;
	var m_maxValue       = (maxValue === undefined || maxValue == null || typeof maxValue !== 'number') ? 100 : maxValue;
	var m_minPossition   = 0;
	var m_minValue       = (minValue === undefined || minValue == null || typeof minValue !== 'number') ? 0 : minValue;
	var m_mode           = (mode === undefined || mode == null) ? 'horizontal' : mode.toLowerCase();
	var m_mouseDownPos   = 0;
	var m_step           = (step === undefined || step == null || typeof step !== 'number') ? 1 : step;
	var m_stepInPX       = 0;
	var m_width          = (width === undefined || width == null || typeof width !== 'number') ? 0 : width;
	
	m_brkBackground.setBackground('#FFFFFF');
	m_brkBackground.setBorder('#AFCCEE', 1, 1, 1, 1);
	
	if (m_maxValue <= m_minValue) {
		m_maxValue = 100;
		m_minValue = 0;
	}
	
	if (m_step < 0 || m_step > (m_maxValue - m_minValue) / 2) {
		m_step = 1;
	}
	
	if (m_currentValue > m_maxValue || m_currentValue < m_minValue) {
		m_currentValue = m_minValue;
	}
	
	var onCoverClick = function(e) {
		e = e ? e : window.event;
		if (m_mode == 'horizontal') {
			if (e.clientX < m_handleX) {
				m_currentValue -= m_step;
				m_handleX -= m_stepInPX;
			} else if (e.clientX > m_handleX + 20) {
				m_currentValue += m_step;
				m_handleX += m_stepInPX;
			} else {
				return;
			}
		} else {
			if (e.clientY < m_handleY) {
				m_currentValue += m_step;
				m_handleY -= m_stepInPX;
			} else if (e.clientY > m_handleY) {
				m_currentValue -= m_step;
				m_handleY += m_stepInPX;
			} else {
				return;
			}
		}
		
		setBarProgress();
		m_brkHandle.move(m_handleX, m_handleY);
		if (!isInt(m_step) && m_step.toString().length < m_currentValue.toString().length) {
			m_brkHandle.setTooltip(parseValue());
		} else { 
			m_brkHandle.setTooltip(m_currentValue);
		}
		
		if (m_changeCallback != null) {
			m_changeCallback();
		}
	};
	
	var onHandleDown = function(e) {
		e = e ? e : window.event;
		m_mouseDownPos = (m_mode == 'horizontal') ? e.clientX : e.clientY;
        m_brkHandle.addEvent('mousemove', onHandleMove);
        document.body.style.MozUserSelect = "none";
        document.onselectstart = function () { return false; };
        document.ondragstart = function () { return false; };
	};
	
	var onHandleMove = function(e) {
		e = e ? e : window.event;
		
		if (m_mode == 'horizontal') {
			var d = e.clientX - m_mouseDownPos;
			if (Math.abs(d) >= m_stepInPX) {
				if (d + m_handleX > m_minPossition && d + m_handleX < m_maxPossition) {
                   var steps = Math.floor(Math.abs(d) / m_stepInPX);
                   if ((Math.abs(d) % m_stepInPX) / m_stepInPX >= m_stepInPX / 2) { steps += 1; }
                   if (d > 0) { m_currentValue += steps * m_step; m_handleX += steps * m_stepInPX; } else { m_currentValue -= steps * m_step; m_handleX -= steps * m_stepInPX; }
                   
                } else if (d + m_handleX <= m_minPossition) {
                    m_handleX = m_minPossition;
                    m_currentValue = m_minValue;
                } else {
                    m_handleX = m_maxPossition;
                    m_currentValue = m_maxValue;
                }

                m_brkHandle.move(m_handleX, m_handleY);
				
                m_mouseDownPos = e.clientX;
			}
		} else {
			var d = e.clientY - m_mouseDownPos;
			if (Math.abs(d) >= m_stepInPX) {
				if (d + m_handleY < m_minPossition && d + m_handleY > m_maxPossition) {
                   var steps = Math.floor(Math.abs(d) / m_stepInPX);
                   if ((Math.abs(d) % m_stepInPX) / m_stepInPX >= m_stepInPX / 2) { steps += 1; }
                   if (d > 0) { m_currentValue -= steps * m_step;  m_handleY += steps * m_stepInPX; } else { m_currentValue += steps * m_step; m_handleY -= steps * m_stepInPX; }
                   
                } else if (d + m_handleY >= m_minPossition) {
                    m_handleY = m_minPossition;
                    m_currentValue = m_minValue;
                } else {
                    m_handleY = m_maxPossition;
                    m_currentValue = m_maxValue;
                }

                m_brkHandle.move(m_handleX, m_handleY);
				
                m_mouseDownPos = e.clientY;
            }
		}
		
		setBarProgress();
		
		if (!isInt(m_step) && m_step.toString().length < m_currentValue.toString().length) {
			m_brkHandle.setTooltip(parseValue());
		} else { 
			m_brkHandle.setTooltip(m_currentValue);
		}
		
		if (m_changeCallback != null) {
			m_changeCallback();
		}
	};
	
	var onHandleOut = function() {
		if (m_mode == 'horizontal') {
			m_brkHandle.setBackground('url(images/slider/h_handle.png) no-repeat');
		} else {
			m_brkHandle.setBackground('url(images/slider/v_handle.png) no-repeat');
		}
	};
	
	var onHandleOver = function() {
		if (m_mode == 'horizontal') {
			m_brkHandle.setBackground('url(images/slider/h_handle_on.png) no-repeat');
		} else {
			m_brkHandle.setBackground('url(images/slider/v_handle_on.png) no-repeat');
		}
	};
	
	var onHandleUp = function(e) {
		m_brkHandle.removeEvent('mousemove', onHandleMove);
        document.onselectstart = null;
        document.ondragstart = null;
        document.body.style.MozUserSelect = "all";
	};
	
	var parseValue = function() {
		var st = m_step.toString().split('.');
		var n = 1;
		for (var i = 0; i < st[1].length; i++) { n *= 10; }
		var m = 1;
		if (m_currentValue.toString().indexOf('-') != -1) { m = 2; }
		return parseFloat((Math.ceil(m_currentValue * n) / n).toString().substr(0, st[0].length + st[1].length + m));
	};
	
	var setBarProgress = function() {
		if (m_mode == 'horizontal') {  
			var d = m_handleX - m_brkBarOn.getX();
			if (d > 0) { m_brkBarOn.setSize(d, 8); } else { m_brkBarOn.setSize(0, 8); }
		} else { 
			var d = m_handleY + 20 - m_brkRightBar.getY();
			if (d < 0) { m_brkBarOn.setSize(8, Math.abs(d)); } else { m_brkBarOn.setSize(8, 0); }
			m_brkBarOn.move(m_brkBarOn.getX(), m_handleY + 20);
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

	this.getHeight = function() {
		if (m_height == 0) {
			m_height = (m_mode == 'horizontal') ? 42 : 130;
		}
		
		return m_height;
	};
	
	this.getWidth = function() {
		if (m_width == 0) {
			m_width = (m_mode == 'horizontal') ? 130 : 42;
		}
		
		return m_width;
	};
	
	this.getValue = function() {
		if (!isInt(m_step) && m_step.toString().length < m_currentValue.toString().length) {
			return parseValue();
		}
		return m_currentValue;
	};
	
	this.hide = function() {
		m_brkBackground.hide();
		m_brkBarCover.hide();
		m_brkBarOn.hide();
		m_brkLeftBar.hide();
		m_brkMiddleBar.hide();
		m_brkRightBar.hide();
		m_brkHandle.hide();
	};
	
	this.move = function(x, y) {
		m_brkBackground.move(x, y);
		m_brkBackground.setSize(m_width, m_height);
			
		if (m_mode == 'horizontal') {
			m_brkBarCover.setSize(m_width - 10, 8);
			m_brkBarCover.move(x + 5, y + (m_height - 8) / 2);
			
			m_brkBarOn.setSize(0, 8);
			m_brkBarOn.move(x + 7, y + (m_height - 8) / 2);
			m_brkBarOn.setBackground('url(images/slider/h_bar_center_on.png) repeat-x');
			
			m_brkLeftBar.setSize(2, 8);
			m_brkLeftBar.move(x + 5, y + (m_height - 8) / 2);
			m_brkLeftBar.setBackground('url(images/slider/h_bar_left.png) no-repeat');
			
			m_brkMiddleBar.setSize(m_width - 14, 8);
			m_brkMiddleBar.move(x + 7, y + (m_height - 8) / 2);
			m_brkMiddleBar.setBackground('url(images/slider/h_bar_center.png) repeat-x');
			
			m_brkRightBar.setSize(2, 8);
			m_brkRightBar.move(x + m_width - 7, y + (m_height - 8) / 2);
			m_brkRightBar.setBackground('url(images/slider/h_bar_right.png) no-repeat');
			
			m_brkHandle.setSize(20, 32);
			m_brkHandle.setBackground('url(images/slider/h_handle.png) no-repeat');
			
			m_stepInPX = (m_width - 10 - m_brkHandle.getWidth()) / ((m_maxValue - m_minValue) / m_step);
			m_maxPossition = x + m_width - 5 - m_brkHandle.getWidth();
			m_minPossition = x + 5;
			
			m_handleY = y + 5;
			if (m_currentValue == m_minValue) { 
				m_handleX = x + 5;
			} else if (m_currentValue == m_maxValue) {
				m_handleX = m_maxPossition;
			} else {
				var steps = Math.floor(Math.abs((m_currentValue - m_minValue)) / m_step);
				m_handleX = x + 5 + steps * m_stepInPX;
			}
		} else {
			m_brkBarCover.setSize(8, m_height - 10);
			m_brkBarCover.move(x + (m_width - 8) / 2, y + 5);
			
			m_brkBarOn.setSize(8, 0);
			m_brkBarOn.move(x + (m_width - 8) / 2, y + m_height - 7);
			m_brkBarOn.setBackground('url(images/slider/v_bar_center_on.png) repeat-y');
			
			m_brkLeftBar.setSize(8, 2);
			m_brkLeftBar.move(x + (m_width - 8) / 2, y + 5);
			m_brkLeftBar.setBackground('url(images/slider/v_bar_top.png) no-repeat');
			
			m_brkMiddleBar.setSize(8, m_height - 14);
			m_brkMiddleBar.move(x + (m_width - 8) / 2, y + 7);
			m_brkMiddleBar.setBackground('url(images/slider/v_bar_center.png) repeat-y');
			
			m_brkRightBar.setSize(8, 2);
			m_brkRightBar.move(x + (m_width - 8) / 2, y + m_height - 7);
			m_brkRightBar.setBackground('url(images/slider/v_bar_bottom.png) no-repeat');
			
			m_brkHandle.setSize(32, 20);
			m_brkHandle.setBackground('url(images/slider/v_handle.png) no-repeat');
			
			m_stepInPX = (m_height - 10 - m_brkHandle.getHeight()) / ((m_maxValue - m_minValue) / m_step);
			m_minPossition = y + m_height - 5 - m_brkHandle.getHeight();
			m_maxPossition = y + 5;
			
			m_handleX = x + 5;
			if (m_currentValue == m_minValue) { 
				m_handleY = m_minPossition;
			} else if (m_currentValue == m_maxValue) {
				m_handleY = m_maxPossition;
			} else {
				var steps = Math.floor(Math.abs((m_currentValue - m_minValue)) / m_step);
				m_handleY = y + m_height - 5 - m_brkHandle.getHeight() - steps * m_stepInPX;
			}
		}
		
		m_brkHandle.move(m_handleX, m_handleY);
		m_brkHandle.setTooltip(m_currentValue);
			
		setBarProgress();
			
		/*if (m_changeCallback != null) {
			m_changeCallback();
		}*/
	};
	
	this.setOnChangeCallback = function(callback) {
		m_changeCallback = callback;	
	};
	
	this.setOrder = function(order) {
		m_brkBackground.setOrder(order + 1);
		m_brkBarCover.setOrder(order + 4);
		m_brkBarOn.setOrder(order + 3);
		m_brkLeftBar.setOrder(order + 2);
		m_brkMiddleBar.setOrder(order + 2);
		m_brkRightBar.setOrder(order + 2);
		m_brkHandle.setOrder(order + 5);
		
		return order + 6;
	};
	
	this.show = function() {
		m_brkBackground.show();
		m_brkBarCover.show();
		m_brkBarOn.show();
		m_brkLeftBar.show();
		m_brkMiddleBar.show();
		m_brkRightBar.show();
		m_brkHandle.show();
	};
	
	m_brkBarCover.addEvent('click', onCoverClick);
	
	m_brkHandle.addEvent('mousedown', onHandleDown);
    m_brkHandle.addEvent('mouseout', onHandleOut);
    m_brkHandle.addEvent('mouseover', onHandleOver);
    $$$$(document, 'mouseup', onHandleUp);
};

function TTab(margin, padding) {
	var m_alignment                  = 1;
    var m_brkBackground              = new TBrick();
    var m_brkBorder                  = new TBrick();
    var m_direction                  = 'ltr';
    var m_height                     = 0;
    var m_margin                     = margin === undefined ? 5 : margin;
    var m_padding                    = padding === undefined ? 7 : padding;
    var m_selectedTabChangedCallback = null;
    var m_selectedTabName            = '';
    var m_tabs                       = new Array();
    var m_width                      = 0;
    
    m_brkBorder.setBorder('#80B0D0', 1, 1, 1, 1); // #AFCCEE
    m_brkBackground.setBorder('#FFFFFF', 1, 1, 1, 1);
    
    var hideLayout = function(tabName) {
    	for (var i = 0; i < m_tabs.length; i++) {
    		if (m_tabs[i].name == tabName) {
    			m_tabs[i].layout.hide();
    			break;
    		}
    	}
    };
    
    var highlightTab = function(tabName, setCursor) {
    	for (var i = 0; i < m_tabs.length; i++) {
    		if (m_tabs[i].name == tabName) {
    			m_tabs[i].titleBack.setBackground('url(images/tblb.png) repeat-x');
    			if (setCursor) { m_tabs[i].cover.setCursor('pointer'); }
    			break;
    		}
    	}
    };
    
    var unhighlightTab = function(tabName, setCursor) {
    	for (var i = 0; i < m_tabs.length; i++) {
    		if (m_tabs[i].name == tabName) {
    			m_tabs[i].titleBack.setBackground('url(images/tblh.png) repeat-x');
    			if (setCursor) { m_tabs[i].cover.setCursor('default'); }
    			break;
    		}
    	}
    };
    
    var onTabClick = function(tabName) {
    	if (m_selectedTabName != tabName) {
    		if (m_selectedTabName != '') {
    			hideLayout(m_selectedTabName);
    			unhighlightTab(m_selectedTabName, false);
    		} else {
    			if (m_tabs[0] != null) {
    				hideLayout(m_tabs[0].name);
    				unhighlightTab(m_tabs[0].name, false);
    			}	
    		}
    		
    		m_selectedTabName = tabName;
    		
    		highlightTab(tabName, false);
    		
    		showLayout(tabName);
    		
    		if (m_selectedTabChangedCallback != null) {
	    		m_selectedTabChangedCallback();
	    	}
    	}
    };
    
    var onTabOut = function(tabName) {
    	if (m_selectedTabName != tabName) {
    		unhighlightTab(tabName, true);
    	}
    };
    
    var onTabOver = function(tabName) {
    	highlightTab(tabName, true);
    };
    
    var showLayout = function(tabName) {
    	for (var i = 0; i < m_tabs.length; i++) {
    		if (m_tabs[i].name == tabName) {
    			m_tabs[i].layout.show();
    			break;
    		}
    	}
    };
    
    this.addTab = function(name, title, alignment) {
        name = (name === undefined || name == null) ? TUniqueId.getUniqueId() : name;
        var backgroundTitle = new TBrick();
        var cover = new TBrick();
        var layout = new TVerticalLayout();
        var txtTitle = new TText(title, 'normalFixed');
        var tabClick = new TCaller(onTabClick, name);
        var tabOut = new TCaller(onTabOut, name);
	    var tabOver = new TCaller(onTabOver, name);
	    
        
        backgroundTitle.setBackground('url(images/tblh.png) repeat-x');
        backgroundTitle.setBorder('#80B0D0', 1, 1, 1, 1);
	    backgroundTitle.setFontSize('0');
	    var width = (txtTitle.getWidth() + 10 < 50) ? 50 : txtTitle.getWidth() + 10;
	    backgroundTitle.setSize(width, 19);
	    
	    cover.addEvent('click', tabClick.callback);
	    cover.addEvent('mouseout', tabOut.callback);
	    cover.addEvent('mouseover', tabOver.callback);
	    cover.setSize(width, 19);
	    
	    alignment = (alignment === undefined || alignment == null) ? 0 : alignment;
	    
	    switch (alignment) {
	    	case 1:
	    		layout.alignLeft();
	    		break;
	    	case 2:
	    		layout.alignRight();
	    		break;
	    }
        
        m_tabs.push({ name: name, title: txtTitle, titleBack: backgroundTitle, cover: cover, layout: layout, alignment: alignment });
    };
    
    this.addTabItem = function(tabName, item) {
        for (var i = 0; i < m_tabs.length; i++) {
        	if (m_tabs[i].name == tabName) {
        		m_tabs[i].layout.add(item);
        		break;
        	}
        }
    };

    this.alignCenter = function() {
        m_alignment = 0;
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

    this.getHeight = function() {
		for (var i = 0; i < m_tabs.length; i++) {
			if (m_tabs[i].layout.getHeight() > m_height) {
				m_height = m_tabs[i].layout.getHeight();
			}
		}
        
        m_height += 19;
        
        return m_height + m_margin * 2 + m_padding + 10;
    };

	this.getSelectedTabName = function() {
		return m_selectedTabName;
	};

    this.getWidth = function() {
    	var layoutWidth     = 0;
    	var titleWidth      = 0;
    	m_width             = 0;
    	var tabsWidth       = 0;
    	
    	for (var i = 0; i < m_tabs.length; i++) {
	    	tabsWidth += m_tabs[i].titleBack.getWidth();
	    }
	    	
	    tabsWidth += 2 * (m_tabs.length - 1);
		
		for (var i = 0; i < m_tabs.length; i++) {
			layoutWidth     = m_tabs[i].layout.getWidth();
			titleWidth      = m_tabs[i].titleBack.getWidth();
			var tabWidth    = layoutWidth < titleWidth ? titleWidth : layoutWidth;
			
			if (tabsWidth < tabWidth) {
				if (m_width < tabWidth) {
					m_width = tabWidth;
				}
			} else {
				if (m_width < tabsWidth) {
					m_width = tabsWidth;
				}
			}
		}
		
		m_width += 20;
		
        return m_width + m_margin * 2;
    };

    this.hide = function() {
        m_brkBackground.hide();
        m_brkBorder.hide();
        
        if (m_selectedTabName != '') {
        	hideLayout(m_selectedTabName);
        } else {
        	if (m_tabs[0] != null) {
        		hideLayout(m_tabs[0].name);
        	}
        }
        
        for (var i = 0; i < m_tabs.length; i++) {
        	m_tabs[i].title.hide();
        	m_tabs[i].titleBack.hide();
        	m_tabs[i].cover.hide();
        }
    };

    this.move = function(x, y) {
    	x += m_margin;
        y += m_margin;

        m_brkBorder.move(x, y + 20);
        m_brkBorder.setSize(m_width, m_height);

        m_brkBackground.move(x + 1, y + 21);
        m_brkBackground.setSize(m_width - 2, m_height - 2);

        var headerX = x;
	    var tabsWidth = 0;

	    if (m_alignment != 1) {
	    	for (var i = 0; i < m_tabs.length; i++) {
	    		tabsWidth += m_tabs[i].titleBack.getWidth();
	    	}
	    	
	    	tabsWidth += 2 * (m_tabs.length - 1);
	    	
	    	switch (m_alignment) {
	    		case 0:
	    			headerX += (m_width - tabsWidth) / 2;
	    			break; 
	    		case 2:
	    			headerX += m_width - tabsWidth;
	    			break;
	    	}
	    }
	    
	    if (m_direction == 'rtl') {
	    	for (var i = m_tabs.length - 1; i >= 0; i--) {
		        m_tabs[i].titleBack.move(headerX, y);
		        m_tabs[i].cover.move(headerX, y);
		        m_tabs[i].title.move(headerX + (m_tabs[i].titleBack.getWidth() - m_tabs[i].title.getWidth()) / 2, y + (19 - m_tabs[i].title.getHeight()) / 2);
		        
		        switch (m_tabs[i].alignment) {
		        	case 0:
		        		m_tabs[i].layout.move(x + (m_width - m_tabs[i].layout.getWidth()) / 2, y + 23 + m_padding);
		        		break;
		        	case 1:
		        		m_tabs[i].layout.move(x + 3, y + 23 + m_padding);
		        		break;
		        	case 2:
		        		m_tabs[i].layout.move(x + m_width - m_tabs[i].layout.getWidth(), y + 23 + m_padding);
		        		break;
		        }
		        
		        headerX += m_tabs[i].titleBack.getWidth() + 2; 
		    }
	    } else {
	    	for (var i = 0; i < m_tabs.length; i++) {
		        m_tabs[i].titleBack.move(headerX, y);
		        m_tabs[i].cover.move(headerX, y);
		        m_tabs[i].title.move(headerX + (m_tabs[i].titleBack.getWidth() - m_tabs[i].title.getWidth()) / 2, y + (19 - m_tabs[i].title.getHeight()) / 2);
		        
		        switch (m_tabs[i].alignment) {
		        	case 0:
		        		m_tabs[i].layout.move(x + (m_width - m_tabs[i].layout.getWidth()) / 2, y + 23 + m_padding);
		        		break;
		        	case 1:
		        		m_tabs[i].layout.move(x + 3, y + 23 + m_padding);
		        		break;
		        	case 2:
		        		m_tabs[i].layout.move(x + m_width - m_tabs[i].layout.getWidth(), y + 23 + m_padding);
		        		break;
		        }
		        
		        headerX += m_tabs[i].titleBack.getWidth() + 2; 
		    }
	    }
    };
	
	this.setDirection = function(dir) {
		m_direction = dir;
		if (dir == 'rtl') { m_alignment = 2; }
	};
	
    this.setOrder = function(order) {
    	m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1));
    	
    	for (var i = 0; i < m_tabs.length; i++) {
    		m_tabs[i].titleBack.setOrder(order + 1);
    		m_tabs[i].title.setOrder(order + 2);
    		m_tabs[i].cover.setOrder(order + 3);
    		m_tabs[i].layout.setOrder(order + 3);
    	}
    	
    	return order + 4;
    };

    this.setOnSelectedTabChanged = function(callback) {
    	m_selectedTabChangedCallback = callback;
    };
    
    this.setPadding = function(padding) {
        m_padding = padding;
    };

	this.setSelectedTabName = function(tabName) {
		m_selectedTabName = tabName;
	};

    this.show = function() {
        m_brkBackground.show();
        m_brkBorder.show();
        
        if (m_selectedTabName != '') {
        	showLayout(m_selectedTabName);
	        highlightTab(m_selectedTabName, false);
        } else {
        	if (m_tabs[0] != null) {
	        	m_selectedTabName = m_tabs[0].name;
	        	showLayout(m_tabs[0].name);
	        	highlightTab(m_tabs[0].name, false);
	        }
        }
        
        for (var i = 0; i < m_tabs.length; i++) {
        	m_tabs[i].title.show();
        	m_tabs[i].titleBack.show();
        	m_tabs[i].cover.show();
        }
    };
};

function TTable(numberOfRows, url, autoUpdate, selection) {
	var m_ajaxPanel        = new TAjaxPanel();
	var m_alignment        = 0;
	var m_autoUpdate       = ((autoUpdate === undefined) || (autoUpdate == null)) ? true : autoUpdate;
	var m_auxiliaryParameters = null;
	var m_brkBackground    = new TBrick('tableBackground');
	var m_brkBegin         = new TBrick('tableBegin');
	var m_brkBorder        = new TBrick();
	var m_brkBottom        = new TBrick('tableBottom');
	var m_brkDecPage       = new TBrick('tableDecPage');
	var m_brkEnd           = new TBrick('tableEnd');
	var m_brkIncPage       = new TBrick('tableIncPage');
	var m_columnHeader = new Array();
	var m_height = 0;
	var m_highlightedRowsIndexes  = new Array(); 
	var m_numberOfPages    = 1;
	var m_onClickCallback  = null;
	var m_offsetX = 0;
	var m_offsetY = 0;
	var m_pageNumber       = 1;
	var m_recordIds        = new Array();
	var m_rowWrappers      = new Array();
	var m_rowBars = new Array();
	var m_selection = ((selection === undefined) || (selection == null)) ? 'None' : selection;
	var m_selectionChangedCallback = null;
	var m_sortAlignment = 2;
	var m_sortByMultipleColumns = false;
	var m_startX = 0;
	var m_startY = 0;
	var m_txtNumberOfPages = new TText('', 'smallFixed');
	var m_txtPageNumber    = new TText('', 'smallFixed');
	var m_txtPageOfPages   = new TText(TLang.translate('pageOf'), 'smallFixed');
	var m_txtTest          = new TText('Ay', 'normalFixed');
	var m_testCell         = new TText('', 'normalText');
	var m_updateCallback   = null;
	var m_url              = url;
	var m_visible          = false;
	var m_width            = 0;
	var m_this             = this;

	var adjustCell = function(row, column, value) {
		var cell = m_rowWrappers[row][column];

		m_testCell.setText(value);

		if (cell.bkg.getWidth() > (m_testCell.getWidth() + 8)) {
			switch (m_columnHeader[column].alignment) {
				case 0:
					cell.txtCell.move(cell.bkg.getX() + (cell.bkg.getWidth() - m_testCell.getWidth()) / 2, cell.bkg.getY() + 2);
					break;
				
				case 1:
					cell.txtCell.move(cell.bkg.getX() + 4, cell.bkg.getY() + 2);
					break;
				
				case 2:
					cell.txtCell.move(cell.bkg.getX() + (cell.bkg.getWidth() - m_testCell.getWidth()) - 4, cell.bkg.getY() + 2);
					break;
			}

			//cell.txtCell.setWidth(m_testCell.getWidth());
		} else {
			cell.txtCell.move(cell.bkg.getX() + 4, cell.bkg.getY() + 2);
			cell.txtCell.setWidth(cell.bkg.getWidth() - 8);
		}

		cell.txtCell.setText(value);
		
		if (cell.safeMode) {
			cell.value = value;
		}

		if (m_visible) {
			cell.txtCell.show();
		} else {
			cell.txtCell.hide();
		}
	};

	var clearCell = function(i, j) {
		var cell = m_rowWrappers[i][j];

		cell.txtCell.setText('');
		cell.txtCell.show();
	};
    
    var moveCell = function(row, column, x, y) {
		var cell = m_rowWrappers[row][column];

		var deltaX = x - cell.bkg.getX();
		
		cell.bkg.move(x, y);
		cell.txtCell.move(cell.txtCell.getX() + deltaX, y + 2);
	};
	
	var adjustPageNumber = function() {
		m_txtPageNumber.setX(m_brkDecPage.getX() + m_brkDecPage.getWidth() + 8);
		m_txtPageOfPages.setX(m_txtPageNumber.getX() + m_txtPageNumber.getWidth() + 8);
		m_txtNumberOfPages.setX(m_txtPageOfPages.getX() + m_txtPageOfPages.getWidth() + 8);
		m_brkIncPage.setX(m_txtNumberOfPages.getX() + m_txtNumberOfPages.getWidth() + 8);
		m_brkEnd.setX(m_brkIncPage.getX() + m_brkIncPage.getWidth() + 5);
	};

	var highlight = function (rowIndex) {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_rowWrappers[rowIndex][i].bkg.setBackground('#DA2C43');
	    }

	    m_highlightedRowsIndexes.push(rowIndex);
	};

	var unHighlight = function (rowIndex, arrayIndex) {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_rowWrappers[rowIndex][i].bkg.setBackground('#ffffff');
	    }

	    if (m_selection == 'Single') {
	    	m_highlightedRowsIndexes.length = 0;
	    } else {
	    	m_highlightedRowsIndexes.splice(arrayIndex, 1);
	    }
    };

    var onBarClick = function (rowNumber) {
        var projectId = m_recordIds[rowNumber - 1];

        if (projectId > 0 && m_selection != 'None') {
            if (m_highlightedRowsIndexes.length > 0) {
                if (m_selection == 'Single') {

                    if (rowNumber - 1 != m_highlightedRowsIndexes[0]) {
                        unHighlight(m_highlightedRowsIndexes[0], 0);

                        m_highlightedRowsIndexes[0] = rowNumber - 1;

                        highlight(rowNumber - 1);

                    } else {
                        unHighlight(rowNumber - 1, 0);
                    }

                } else if (m_selection == 'Multi') {
                    var exists = false;

                    for (var i = 0; i < m_highlightedRowsIndexes.length; i++) {
                        if (m_highlightedRowsIndexes[i] == rowNumber - 1) {
                            unHighlight(rowNumber - 1, i);
                            exists = true;
                            break;
                        }
                    }

                    if (!exists) {
                        highlight(rowNumber - 1);
                    }
                }

            } else {
                highlight(rowNumber - 1);
            }
            
            if (m_selectionChangedCallback != null) {
            	m_selectionChangedCallback();
            }
        }

        if (projectId > 0 && m_onClickCallback != null) {
            m_onClickCallback(projectId);
        }
    };

    var onBarOut = function (rowNumber) {
        rowNumber--;

        if (m_selection != 'None') {
            if (m_highlightedRowsIndexes.length > 0) {
                var exists = false;

                for (var i = 0; i < m_highlightedRowsIndexes.length; i++) {
                    if (m_highlightedRowsIndexes[i] == rowNumber) {
                        exists = true;
                        break;
                    }
                }

                if (!exists) {
                    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
                        m_rowWrappers[rowNumber][i].bkg.setBackground('#ffffff');
                    }
                }
            } else {
                for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
                    m_rowWrappers[rowNumber][i].bkg.setBackground('#ffffff');
                }
            }
        } else {
            for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
                m_rowWrappers[rowNumber][i].bkg.setBackground('#ffffff');
            }
        }
        
    };
	
	var onBarOver = function(rowNumber) {
		rowNumber--;

		if (m_selection != 'None') {
		    if (m_highlightedRowsIndexes.length > 0) {
		        var exists = false;

		        for (var i = 0; i < m_highlightedRowsIndexes.length; i++) {
		            if (m_highlightedRowsIndexes[i] == rowNumber) {
		                exists = true;
		                break;
		            }
		        }

		        if (!exists) {
		            for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
		                m_rowWrappers[rowNumber][i].bkg.setBackground('#ffd0a0');
		            }
		        }
		    } else {
		        for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
		            m_rowWrappers[rowNumber][i].bkg.setBackground('#ffd0a0');
		        }
		    }
		} else {
		    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
		        m_rowWrappers[rowNumber][i].bkg.setBackground('#ffd0a0');
		    }
		}
	};
	
	var onBeginClick = function() {
		m_pageNumber = 1;
		m_this.update();
	};

	var onDecPageClick = function() {
		m_pageNumber--;
		m_this.update();
	};
	
	var onEndClick = function() {
		m_pageNumber = m_numberOfPages;
		m_this.update();
	};
	
	var onIncPageClick = function() {
		m_pageNumber++;
		m_this.update();
	};

	var m_dragedHeaderIndex = 0;
	var m_overHeaderIndex = 0;
	var m_columnName = '';
	var m_dragging = false;
	var m_dragOrder = 0;
	var m_x = 0;
	var m_y = 0;
	
    var onHeaderMouseDown = function(e) {
    	if (e == null) e = window.event;
    	
    	if (e.button == 1 && window.event != null || e.button == 0) {
    		
    		if (m_dragging && m_overHeaderIndex != -1) {
    			m_columnHeader[m_overHeaderIndex].background.setBackground('url(images/tblh.png) repeat-x');
    		}
    		
    		for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	            if (m_columnHeader[i].title.getText() == m_columnName) {
	                m_dragedHeaderIndex = i;
	                m_overHeaderIndex = i;
		    		document.onmousemove = onHeaderMouseMove;
		    		
		    		m_startX = e.clientX;
		    		m_startY = e.clientY;
		    		
		    		m_offsetX = m_columnHeader[i].cover.getX();
		    		m_offsetY = m_columnHeader[i].cover.getY();
		    		
		    		m_columnHeader[i].cover.setOrder(m_dragOrder + 1000);
		    		m_columnHeader[i].cover.setSize(m_columnHeader[i].cover.getWidth(), m_this.getHeight() - m_brkBottom.getHeight());
		    		
		    		document.onselectstart = function () { return false; };
		    		m_columnHeader[i].cover.getElement().ondragstart = function() { return false; };
		    		
		    		m_columnHeader[i].cover.getElement().innerHTML = extractColumn(i);
	                
	                m_dragging = true;
	                break;
	            }
	        }
	        return false;
    	}
    };
    
    var extractColumn = function(columnIndex) {
    	var align = 'center';
    	if (m_columnHeader[columnIndex].alignment == 1) align = 'left';
    	if (m_columnHeader[columnIndex].alignment == 2) align = 'right';
    	
    	var str ='<table width="100%" cellpadding="0" cellspacing="0" style="background-color:rgba(255,255,255,0.7); filter: alpha(opacity=50); font-size: 12; font-family: Verdana; border:1px solid #AFCCEE; border-collapse:collapse; height: ' + (m_this.getHeight() - m_brkBottom.getHeight()) + 'px;"><tr><td align ="' + align +  '" style="background:url(images/tblh.png) repeat-x; color: #000000; border:1px solid #F0F0F0; height: ' + m_columnHeader[columnIndex].background.getHeight() + 'px;">';
    	str += m_columnHeader[columnIndex].title.getText() + '</td></tr>';
    	
    	for (var i = 0; i < numberOfRows; i++) {
    		if (m_rowWrappers[i][columnIndex].txtCell.getText() != '') {
    			str += '<tr><td align = "' + align + '" style="border:1px solid #F0F0F0; height: ' + m_columnHeader[columnIndex].background.getHeight() + 'px;">' + m_rowWrappers[i][columnIndex].txtCell.getText() + '</td></tr>';
    		} else {
    			str += '<tr><td style="border:1px solid #F0F0F0; height: ' + m_columnHeader[columnIndex].background.getHeight() + 'px;">&nbsp;</td></tr>';
    		}
			
		}
    	
    	str += '</table>';
    	return str;
    };
    
    var onHeaderMouseMove = function(e) {
    	if (m_dragging) {
    		if(e == null) e = window.event;
		    
		    m_columnHeader[m_dragedHeaderIndex].cover.move(m_offsetX + e.clientX - m_startX, m_offsetY + e.clientY - m_startY);
		     
		    highlightHeader(e.clientX);
    	}
    };
    
    var highlightHeader = function(x) {
    	m_overHeaderIndex = -1;
    	
    	for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        if (x >= m_columnHeader[i].background.getX() && x <= m_columnHeader[i].background.getX() + m_columnHeader[i].background.getWidth()) {
	           m_overHeaderIndex = i;
	           if (i != m_dragedHeaderIndex) { m_columnHeader[i].background.setBackground('url(images/tblb.png) repeat-x'); }
	        }
	        else {
	        	m_columnHeader[i].background.setBackground('url(images/tblh.png) repeat-x');
	        }
	    }
    };
    
    var onHeaderMouseOut = function (columnName) {
        for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
            if (m_columnHeader[i].title.getText() == columnName) {
                switch (m_columnHeader[i].sortState) {
                    case 0:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/sni.png) no-repeat left top');
                            break;
                        }
                    case 1:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/sui.png) no-repeat left top');
                            break;
                        }
                    case 2:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/sdi.png) no-repeat left top');
                            break;
                        }

                    default: { break; }
                }
                m_columnHeader[i].cover.setCursor('default');
                if (isIE()) { m_columnHeader[i].title.setCursor('default'); }
                m_columnName = '';
                break;
            }
        }
    };

    var onHeaderMouseOver = function (columnName) {
        for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
            if (m_columnHeader[i].title.getText() == columnName) {
                switch (m_columnHeader[i].sortState) {
                    case 0:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/sn.png) no-repeat left top');
                            break;
                        }
                    case 1:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/su.png) no-repeat left top');
                            break;
                        }
                    case 2:
                        {
                            m_columnHeader[i].sort.setBackground('url(images/tbl/sd.png) no-repeat left top');
                            break;
                        }

                    default: { break; }
                }
                m_columnHeader[i].cover.setCursor('pointer');
                if (isIE()) { m_columnHeader[i].title.setCursor('pointer'); }
                m_columnName = columnName;
                break;
            }
        }
    };
	
	var onHeaderMouseUp = function(e){
    	if (e == null) e = window.event;
    	
    	m_dragging = false;
    	
		m_columnHeader[m_dragedHeaderIndex].cover.getElement().ondragstart = null;
		document.onmousemove = null;
		m_columnHeader[m_dragedHeaderIndex].cover.setSize(m_columnHeader[m_dragedHeaderIndex].background.getWidth(), m_columnHeader[m_dragedHeaderIndex].background.getHeight());
		m_columnHeader[m_dragedHeaderIndex].cover.setOrder(m_dragOrder);
		m_columnHeader[m_dragedHeaderIndex].cover.getElement().innerHTML = '';
		document.onselectstart = null;
    	
    	if (m_dragedHeaderIndex != m_overHeaderIndex && m_overHeaderIndex != -1) {
    		m_columnHeader[m_overHeaderIndex].background.setBackground('url(images/tblh.png) repeat-x');
    		
    		var tempItem = m_columnHeader[m_dragedHeaderIndex];
    		var tempElements = new Array();
    		for (var i = 0; i < m_rowWrappers.length; i++) {
				tempElements.push(m_rowWrappers[i][m_dragedHeaderIndex]);
			}
    		
    		if (m_dragedHeaderIndex < m_overHeaderIndex) {
    			for (var i = m_dragedHeaderIndex; i < m_overHeaderIndex; i++) {
    				m_columnHeader[i] = m_columnHeader[i + 1];
    				for (var j = 0; j < m_rowWrappers.length; j++) {
						m_rowWrappers[j][i] = m_rowWrappers[j][i + 1];
					}
    			}
    		} else {
    			for (var i = m_dragedHeaderIndex; i > m_overHeaderIndex; i--) {
    				m_columnHeader[i] = m_columnHeader[i - 1];
    				for (var j = 0; j < m_rowWrappers.length; j++) {
						m_rowWrappers[j][i] = m_rowWrappers[j][i - 1];
					}
    			}
    		}
    		
    		m_columnHeader[m_overHeaderIndex] = tempItem;
    		for (var i = 0; i < m_rowWrappers.length; i++) {
				m_rowWrappers[i][m_overHeaderIndex] = tempElements[i];
			}
			
			redrawTable();
    	} else {
    		m_this.move(m_x, m_y);
    	}
    	
    	if (e.clientY > m_columnHeader[m_dragedHeaderIndex].background.getY() + m_columnHeader[m_dragedHeaderIndex].background.getHeight() || e.clientY < m_columnHeader[m_dragedHeaderIndex].background.getY() || m_overHeaderIndex == -1) {
			onHeaderMouseOut(m_columnHeader[m_dragedHeaderIndex].title.getText());
			if (m_overHeaderIndex != -1) { onHeaderMouseOut(m_columnHeader[m_overHeaderIndex].title.getText()); }
		} else {
			if (e.clientX > m_columnHeader[m_dragedHeaderIndex].background.getX() && e.clientX < m_columnHeader[m_dragedHeaderIndex].background.getX() + m_columnHeader[m_dragedHeaderIndex].background.getWidth()) {
				onHeaderMouseOver(m_columnHeader[m_dragedHeaderIndex].title.getText());
				onHeaderMouseOut(m_columnHeader[m_overHeaderIndex].title.getText());
			} else if (e.clientX > m_columnHeader[m_overHeaderIndex].background.getX() && e.clientX < m_columnHeader[m_overHeaderIndex].background.getX() + m_columnHeader[m_overHeaderIndex].background.getWidth()) {
				onHeaderMouseOver(m_columnHeader[m_overHeaderIndex].title.getText());
				onHeaderMouseOut(m_columnHeader[m_dragedHeaderIndex].title.getText());
			} else {
				onHeaderMouseOut(m_columnHeader[m_dragedHeaderIndex].title.getText());
				onHeaderMouseOut(m_columnHeader[m_overHeaderIndex].title.getText());
			}
		}
    	
    };
	
	var redrawTable = function() {
		m_this.move(m_x, m_y);
		
		for (var i = 0; i < m_rowWrappers.length; i++) {
			for (var j = 0; j < m_columnHeader.length; j++) {
				adjustCell(i, j, m_rowWrappers[i][j].txtCell.getText());
			}
		}
	};
	
	var onSortClick = function (columnName) {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        if (m_columnHeader[i].title.getText() == columnName) {
	            switch (m_columnHeader[i].sortState) {
	                case 0:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/suh.png) no-repeat left top');
	                        m_columnHeader[i].sortState = 1;
	                        break;
	                    }
	                case 1:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/sdh.png) no-repeat left top');
	                        m_columnHeader[i].sortState = 2;
	                        break;
	                    }
	                case 2:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/snh.png) no-repeat left top');
	                        m_columnHeader[i].sortState = 0;
	                        break;
	                    }

	                default: { break; }
	            }
				
				if (! m_sortByMultipleColumns) {
					singleSort(columnName);
				}
				
	            m_this.update();
	            break;
	        }
	    }
	};

	var onSortOut = function (columnName) {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        if (m_columnHeader[i].title.getText() == columnName) {
	            switch (m_columnHeader[i].sortState) {
	                case 0:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/sni.png) no-repeat left top');
	                        break;
	                    }
	                case 1:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/sui.png) no-repeat left top');
	                        break;
	                    }
	                case 2:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/sdi.png) no-repeat left top');
	                        break;
	                    }

	                default: { break; }
	            }
	            m_columnHeader[i].sort.setCursor('default');
	            break;
	        }
	    }
	};

	var onSortOver = function (columnName) {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        if (m_columnHeader[i].title.getText() == columnName) {
	            switch (m_columnHeader[i].sortState) {
	                case 0:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/snh.png) no-repeat left top');
	                        break;
	                    }
	                case 1:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/suh.png) no-repeat left top');
	                        break;
	                    }
	                case 2:
	                    {
	                        m_columnHeader[i].sort.setBackground('url(images/tbl/sdh.png) no-repeat left top');
	                        break;
	                    }

	                default: { break; }
	            }
	            m_columnHeader[i].sort.setCursor('pointer');
	            break;
	        }
	    }
	};

	var onUpdateError = function(text) {
		TMessageBox.showModal(TLang.translate('error'), 'Cannot connect to a server: ' + toHtml(text));
		
		if (m_updateCallback != null) {
			m_updateCallback();
			m_updateCallback = null;
		}
	};
	
	var onUpdateOk = function(xmlDoc, xmlText) {
		//console.log(xmlText);
		//console.log('----------');

		m_this.loadXML(xmlDoc);
	};
	
	var singleSort= function(columnName){
		for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        if (m_columnHeader[i].title.getText() != columnName) {
	            m_columnHeader[i].sortState = 0;
	            m_columnHeader[i].sort.setBackground('url(images/tbl/sni.png) no-repeat left top');
	        }
	    }
	};
	
	this.addColumn = function (name, title, width, alignment, safeMode, sortAlignment) {
	    safeMode = safeMode === undefined ? false : safeMode;

	    var backgroundTitle = new TBrick('');
	    var headerCover = new TBrick('');
	    var backOut = new TCaller(onHeaderMouseOut, title);
	    var backOver = new TCaller(onHeaderMouseOver, title);
	    var columnTitle = new TText(title, 'normalFixed');
	    var columnSort = new TBrick('');
	    var sortClick = new TCaller(onSortClick, title);
	    var sortOver = new TCaller(onSortOver, title);
	    var sortOut = new TCaller(onSortOut, title);

	    if (isIE()) {
	    	columnTitle.getElement().onmousedown = onHeaderMouseDown;
		    columnTitle.addEvent('mouseout', backOut.callback);
		    columnTitle.addEvent('mouseover', backOver.callback);
		    columnTitle.getElement().onmouseup = onHeaderMouseUp;
	    }
	    
	    headerCover.getElement().onmousedown = onHeaderMouseDown;
	    headerCover.addEvent('mouseout', backOut.callback);
	    headerCover.addEvent('mouseover', backOver.callback);
	    headerCover.getElement().onmouseup = onHeaderMouseUp;

	    columnSort.addEvent('click', sortClick.callback);
	    columnSort.addEvent('mouseover', sortOver.callback);
	    columnSort.addEvent('mouseout', sortOut.callback);

	    if (alignment === undefined) {
	        alignment = 0;
	    }

	    sortAlignment = (sortAlignment === undefined || sortAlignment == null || (sortAlignment != 1 && sortAlignment != 2)) ? m_sortAlignment : sortAlignment;

	    backgroundTitle.setBackground('url(images/tblh.png) repeat-x');
	    backgroundTitle.setFontSize('0');
	    backgroundTitle.setSize(width, 19);

	    columnSort.setBackground('url(images/tbl/sni.png) no-repeat left top');
	    columnSort.setSize(13, 13);

	    headerCover.setSize(width, 19);

	    if (columnTitle.getWidth() > (width - 10)) {
	        columnTitle.setWidth(width - 10);
	    }

	    m_columnHeader.push({ name: name, background: backgroundTitle, title: columnTitle, cover: headerCover, width: width, alignment: alignment, sort: columnSort, sortState: 0, sortAlignment: sortAlignment });

	    var cellHeight = m_txtTest.getHeight() + 4;

	    for (var i = 0; i < numberOfRows; i++) {
	        var cell = { bkg: new TBrick(''), txtCell: new TText('', 'normalFixed'), safeMode: safeMode, value: '' };

	        cell.bkg.setBackground('#FFFFFF');
	        cell.bkg.setFontSize('0');
	        cell.bkg.setSize(width, cellHeight);
	        //cell.txtCell.setWidth(width - 8);

	        m_rowWrappers[i].push(cell);
	    }
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};

	this.clearSelection = function () {
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        for (var j = 0; j < numberOfRows; j++) {
	            m_rowWrappers[j][i].bkg.setBackground('#ffffff');
            }
	    }

	    m_highlightedRowsIndexes.length = 0;
	};

	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getCellByName = function(id, columnName) {
		for (var i = 0; i < numberOfRows; i++) {
			if (m_recordIds[i] == id) {
				for (var j = 0; j < m_columnHeader.length; j++) {
					if (m_columnHeader[j].name == columnName) {
						var cell = m_rowWrappers[i][j];

						return cell.safeMode ? cell.value : cell.txtCell.getText();
					}
				}
			}
		}

		return '';
	};
	
	this.getHeight = function() {
		m_height = 18 + numberOfRows + (m_txtTest.getHeight() + 4) * numberOfRows + 18;
		return m_height + 2;
	};

	this.getSelectedIds = function () {
	    var selectedIds = new Array();
	    for (var i = 0; i < m_highlightedRowsIndexes.length; i++) {
	        selectedIds[i] = m_recordIds[m_highlightedRowsIndexes[i]];
	    }
	    return selectedIds;
	};
    
    this.getSelectionMode = function () {
	    return m_selection;
	};

	this.getWidth = function() {
		var nColumns = m_columnHeader.length;

		m_width = nColumns - 1;
		
		for (var i = 0; i < nColumns; i++) {
			m_width += m_columnHeader[i].width;
		}

		return m_width + 2;
	};
	
	this.hasSelection = function() {
		if (m_highlightedRowsIndexes.length) {
			return true;
		} else {
			return false;
		}
	};
	
	this.hide = function () {
	    m_visible = false;
	    m_brkBackground.hide();
	    m_brkBorder.hide();
	    m_brkBottom.hide();
	    m_brkBegin.hide();
	    m_brkDecPage.hide();
	    m_brkEnd.hide();
	    m_brkIncPage.hide();
	    m_ajaxPanel.hide();
	    m_txtNumberOfPages.hide();
	    m_txtPageNumber.hide();
	    m_txtPageOfPages.hide();
	    
	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_columnHeader[i].background.hide();
	        m_columnHeader[i].cover.hide();
	        m_columnHeader[i].title.hide();
	        m_columnHeader[i].sort.hide();

	        for (var j = 0; j < numberOfRows; j++) {
	            m_rowWrappers[j][i].bkg.hide();
	            m_rowWrappers[j][i].txtCell.hide();
	        }
	    }

	    for (var i = 0; i < numberOfRows; i++) {
	        m_rowBars[i].hide();
	    }
	};

	this.leftAlignedSort = function () {
	    m_sortAlignment = 1;
	};
	
	this.loadXML = function(xmlDoc) {
		for (var i = 0; i < numberOfRows; i++) {
			m_recordIds[i] = 0;
		}
		
		if (m_selection != 'None') {
			for (var i = 0; i < m_highlightedRowsIndexes.length; i++) {
				for (var j = 0, nColumns = m_columnHeader.length; j < nColumns; j++) {
					m_rowWrappers[i][j].bkg.setBackground('#ffffff');
			    }
			}
			m_highlightedRowsIndexes.length = 0;
		}
		
		var elmNumberOfPages = xmlDoc.getElementsByTagName('NumberOfPages');
		
		if (elmNumberOfPages.length == 1) {
			if (elmNumberOfPages[0].firstChild.nodeValue != null) {
				m_numberOfPages = elmNumberOfPages[0].firstChild.nodeValue;
				m_txtNumberOfPages.setText(m_numberOfPages);

				var elmPageNumber = xmlDoc.getElementsByTagName('PageNumber');
				
				if (elmPageNumber.length == 1) {
					if (elmPageNumber[0].firstChild.nodeValue != null) {
						m_pageNumber = elmPageNumber[0].firstChild.nodeValue;
						m_txtPageNumber.setText(m_pageNumber);
						adjustPageNumber();
						
						var elmRow = xmlDoc.getElementsByTagName('Row');
						
						for (var i = 0; i < elmRow.length; i++) {
							var nodes = elmRow[i].childNodes;
							var numberOfNodes = nodes.length;

							for (var j = 0; j <= m_columnHeader.length; j++) {
								if (j < numberOfNodes) {
									if (j > 0) {
										for (var k = 1; k < nodes.length; k++) {
											if (nodes[k].nodeName == m_columnHeader[j - 1].name) {
												if (nodes.item(k).firstChild != null && nodes.item(k).firstChild.nodeValue != null) {
													var text = toHtml(nodes.item(k).firstChild.nodeValue);
																
													adjustCell(i, j - 1, text);
															
												} else {
													if (j > 0) {
														adjustCell(i, j - 1, '');
													}
												}
												break;
											}
										}
									} else {
										m_recordIds[i] = nodes.item(j).firstChild.nodeValue;
									}
								} else {
									if (j > 0) {
										adjustCell(i, j - 1, '');
									}
								}
							}
						}

						for (var i = elmRow.length; i < numberOfRows; i++) {
							for (var j = 0; j < m_columnHeader.length; j++) {
								clearCell(i, j);
							}
						}
					}
				}
			} else {
				TMessageBox.showModal(TLang.translate('error'), 'Received invalid number of table pages.');
			}
		} else {
			elements = xmlDoc.getElementsByTagName('Error');
				
			if (elements.length == 1) {
				var $errorText = (elements[0].firstChild == null || elements[0].firstChild.nodeValue == null) ? null : toHtml(elements[0].firstChild.nodeValue);
				
				if ($errorText == null) {
					$errorText = elements[0].getAttribute('reason');
				}

				TMessageBox.showModal(TLang.translate('error'), $errorText == null ? 'Unidentified error on server side.' : $errorText);
			} else {
				TMessageBox.showModal(TLang.translate('error'), 'Unidentified error on server side.');
			}
		}

		if (m_updateCallback != null) {
			m_updateCallback();
			m_updateCallback = null;
		}
	};
	
	this.move = function (x, y) {
		m_x= x;
		m_y = y;
		
	    m_brkBorder.move(x, y);
	    m_brkBorder.setSize(m_width, m_height);
	    m_brkBottom.move(x, y + m_height - 18);
	    m_brkBottom.setWidth(m_width);

	    m_brkBackground.move(x + 1, y + 1);
	    m_brkBackground.setSize(m_width - 2, m_height - 2);

	    m_ajaxPanel.setSize(m_width, m_height);
	    m_ajaxPanel.move(x, y);

	    var navigationY = y + m_height - 15;

	    m_brkBegin.move(x + 4, navigationY);
	    m_brkDecPage.move(x + 22, navigationY);
	    m_txtNumberOfPages.setY(navigationY - 1);
	    m_txtPageNumber.setY(navigationY - 1);
	    m_txtPageOfPages.setY(navigationY - 1);
	    m_brkIncPage.move(x + 72, navigationY);
	    m_brkEnd.move(x + 92, navigationY);

	    var headerX = x;
	    var headerY = y;
	    var titleY = y + (19 - m_txtTest.getHeight()) / 2;

	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_columnHeader[i].background.move(headerX, headerY);
	        m_columnHeader[i].cover.move(headerX, headerY);

	        var titleWidth = m_columnHeader[i].title.getWidth();
	        var offset = 0;

	        switch (m_columnHeader[i].sortAlignment) {
	            case 1:
	                offset = 16;

	                if ((titleWidth + 10) < m_columnHeader[i].width) {
	                    switch (m_columnHeader[i].alignment) {
	                        case 0:
	                            offset = (m_columnHeader[i].width - titleWidth) / 2;
	                            break;

	                        case 2:
	                            offset = m_columnHeader[i].width - titleWidth - 7;
	                            break;
	                    }
	                }
	                m_columnHeader[i].sort.move(headerX + 3, headerY + 3);
	                break;

	            case 2:
	                offset = 7;

	                if ((titleWidth + 10) < m_columnHeader[i].width) {
	                    switch (m_columnHeader[i].alignment) {
	                        case 0:
	                            offset = (m_columnHeader[i].width - titleWidth) / 2;
	                            break;

	                        case 2:
	                            offset = m_columnHeader[i].width - titleWidth - 16;
	                            break;
	                    }
	                }

	                m_columnHeader[i].sort.move(headerX + (m_columnHeader[i].width - 17), headerY + 3);
	                break;
	        }

	        m_columnHeader[i].title.move(headerX + offset, titleY);

	        headerX += m_columnHeader[i].width + 1;
	    }

	    m_columnHeader[m_columnHeader.length - 1].background.setBorderRight(0);

	    var cellY = y + 19;

	    for (var i = 0; i < numberOfRows; i++) {
	        var cellX = x;

	        for (var j = 0, nColumns = m_columnHeader.length; j < nColumns; j++) {
	            moveCell(i, j, cellX, cellY);
	            cellX += m_columnHeader[j].width + 1;
	        }

	        m_rowWrappers[i][m_columnHeader.length - 1].bkg.setBorderRight(0);

	        m_rowBars[i].move(x, cellY);
	        m_rowBars[i].setSize(m_width, m_txtTest.getHeight() + 5);

	        cellY += m_txtTest.getHeight() + 5;
	    }

	    adjustPageNumber();
	};

	this.rightAlignedSort = function () {
	    m_sortAlignment = 2;
	};
    
    this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};

	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setAuxiliaryParameters = function(auxiliaryParameters) {
		m_auxiliaryParameters = auxiliaryParameters;
	};

	this.setCell = function(id, columnNumber, value) {
		for (var i = 0; i < numberOfRows; i++) {
			if (m_recordIds[i] == id) {
				adjustCell(i, columnNumber - 1, value);
				break;
			}
		}
	};

	this.setOnClick = function(callback) {
		m_onClickCallback = callback;
	};
	
	this.setOnSelectionChangedCallback = function(callback) {
		m_selectionChangedCallback = callback;
	};
	
	this.setOrder = function (order) {
	    var backgroundOrder = m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1) + 1);
	    var titleOrder = backgroundOrder + 1;
	    m_dragOrder = titleOrder + 1;
	    var sortOrder = m_dragOrder + 1;

	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_columnHeader[i].background.setOrder(backgroundOrder);
	        m_columnHeader[i].title.setOrder(titleOrder);
	        m_columnHeader[i].cover.setOrder(m_dragOrder);
	        m_columnHeader[i].sort.setOrder(sortOrder);

	        for (var j = 0; j < numberOfRows; j++) {
	            m_rowWrappers[j][i].bkg.setOrder(backgroundOrder);
	            m_rowWrappers[j][i].txtCell.setOrder(backgroundOrder + 5);
	        }
	    }

	    for (var i = 0; i < numberOfRows; i++) {
	        m_rowBars[i].setOrder(backgroundOrder + 6);
	    }

	    var navigationOrder = m_brkBottom.setOrder(backgroundOrder + 2);

	    m_brkBegin.setOrder(navigationOrder);
	    m_brkDecPage.setOrder(navigationOrder);
	    m_brkEnd.setOrder(navigationOrder);
	    m_brkIncPage.setOrder(navigationOrder);
	    m_txtNumberOfPages.setOrder(navigationOrder);
	    m_txtPageNumber.setOrder(navigationOrder);
	    m_txtPageOfPages.setOrder(navigationOrder);

	    return m_ajaxPanel.setOrder(navigationOrder + 6);
	};

	this.setSelectionMode = function (sel) {
	    m_selection = ((sel === undefined) || (sel == null) || ((sel != 'None') || (sel != 'Single') || (sel != 'Multi'))) ? 'None' : sel;

	    clearSelection();
	};

	this.show = function () {
	    m_brkBackground.show();
	    m_brkBorder.show();
	    m_brkBottom.show();
	    m_brkBegin.show();
	    m_brkDecPage.show();
	    m_brkEnd.show();
	    m_brkIncPage.show();
	    m_txtNumberOfPages.show();
	    m_txtPageNumber.show();
	    m_txtPageOfPages.show();

	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        m_columnHeader[i].background.show();
	        m_columnHeader[i].title.show();
	        m_columnHeader[i].cover.show();
	        m_columnHeader[i].sort.show();

	        for (var j = 0; j < numberOfRows; j++) {
	            m_rowWrappers[j][i].bkg.show();
	        }
	    }

	    for (var i = 0; i < numberOfRows; i++) {
	        m_rowBars[i].show();
	    }

	    m_visible = true;

	    if (m_autoUpdate) {
	        this.update();
	    }
	};

	this.sortByMultipleColumns = function(multiSort){
		m_sortByMultipleColumns = multiSort;
	};
	
	this.update = function (updateCallback) {
		var request = '<Vtf><SessionId>' + g_sessionId + '</SessionId><ItemsOnPage>' + numberOfRows + '</ItemsOnPage><PageNumber>' + m_pageNumber + '</PageNumber>';

	    if (updateCallback !== undefined) {
	        m_updateCallback = updateCallback;
	    }

	    if (m_auxiliaryParameters) {
	        request += m_auxiliaryParameters;
	    }

	    for (var i = 0, nColumns = m_columnHeader.length; i < nColumns; i++) {
	        request += '<Column' + (i + 1) + '>';
	        request += m_columnHeader[i].sortState;
	        request += '</Column' + (i + 1) + '>';
	    }

	    request += '</Vtf>';
	    TAjax.sendRequest(m_this, m_url, request, onUpdateOk, onUpdateError);
	};
	
	for (var i = 0; i < numberOfRows; i++) {
		m_rowWrappers.push(new Array());
		m_rowBars.push(new TBrick());
		
		var barClick = new TCaller(onBarClick, i + 1);
		var barOut   = new TCaller(onBarOut, i + 1);
		var barOver  = new TCaller(onBarOver, i + 1);
		
		m_rowBars[i].addEvent('mouseout', barOut.callback);
		m_rowBars[i].addEvent('mouseover', barOver.callback);
		m_rowBars[i].addEvent('click', barClick.callback);
	}
	
	m_brkBegin.addEvent('click', onBeginClick);
	m_brkBorder.setBorder('#80B0D0', 1, 1, 1, 1);
	m_brkDecPage.addEvent('click', onDecPageClick);
	m_brkIncPage.addEvent('click', onIncPageClick);
	m_brkEnd.addEvent('click', onEndClick);
	
	m_testCell.move(0, 0);
	m_testCell.hide();
};

function TText(text, className, widthParent, parent) {
    var m_alignment   = 0;
    var m_color       = '#000000';
    var m_parent = parent === undefined ? null : parent;
	var m_span        = document.createElement('span');
	var m_widthParent = widthParent === undefined ? null : widthParent;

	m_span.className      = (className === undefined || className == null) ? 'normalText' : className;
	m_span.innerHTML      = text;
	m_span.style.position = 'absolute';

	if(m_parent){
		m_parent.appendChild(m_span);
	} else{
		document.body.appendChild(m_span);
	}

	this.addEvent = function(event, callback) {
		$$$$(m_span, event, callback);
	};
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};

	this.destroy = function () {
        if(m_parent){
        	m_parent.removeChild(m_span);
        } else {
        	document.body.removeChild(m_span);
        }
        
	    m_span = null;
	};

	this.disable = function () {
	    if (m_span != null) {
	    	m_span.style.color = '#808080';
	    }
	};
	
	this.enable = function () {
	    if (m_span != null) {
	    	m_span.style.color = m_color;
	    }
	};

	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getBackgroundColor = function() {
		return m_span.style.backgroundColor;
	};
	
	this.getColor = function() {
		return m_color;
	};
	
	this.getElement = function () {
	  return m_span;
	};
	
	this.getHeight = function() {
		if (m_widthParent) {
			this.setWidth(m_widthParent.getWidth());
		}

		return m_span.offsetHeight;
	};
	
	this.getText = function() {
		return m_span.innerHTML;
	};
	
	this.getWidth = function() {
		if (m_widthParent) {
			this.setWidth(m_widthParent.getWidth());
		}

		return m_span.offsetWidth;
	};
	
	this.getX = function() {
		var value = parseInt(m_span.style.left);
		
		return value ? value : 0;
	};
	
	this.getY = function() {
		var value = parseInt(m_span.style.top);
		
		return value ? value : 0;
	};
	
	this.hide = function() {
		m_span.style.visibility = 'hidden';
	};
	
	this.hide();
	
	this.move = function(x, y) {
		m_span.style.left = x + 'px';
		m_span.style.top  = y + 'px';
	};
	
	this.removeEvent = function(event, callback) {
		$$$$$(m_span, event, callback);
	};
	
	this.setBackgroundColor = function(color) {
		m_span.style.backgroundColor = color;
	};
	
	this.setColor = function(color) {
		m_color = color;
		m_span.style.color = color;
	};
	
	this.setCursor = function(cursor) {
		m_span.style.cursor = cursor;
	};
	
	this.setFontFamily = function(family) {
		m_span.style.fontFamily = family;
	};
	
	this.setFontSize = function(size) {
		m_span.style.fontSize = size;
	};
	
	this.setInnerHTML = function(html) {
		m_span.innerHTML = html;
	};
	
	this.setOrder = function(order) {
		order++;
		
		m_span.style.display = 'block';
		m_span.style.zIndex = order;
		
		return order + 1;
	};
	
	this.show = function() {
		m_span.style.visibility = 'visible';
	};
	
	this.setText = function(text) {
		m_span.innerHTML = text;
	};
	
	this.setX = function(x) {
		m_span.style.left = x + 'px';
	};
	
	this.setY = function(y) {
		m_span.style.top = y + 'px';
	};
	
	this.setWidth = function(width) {
		m_span.style.width = width + 'px';
    };
};

function TTextArea(width, height) {
	var m_alignment = 0;
	var m_height    = height;
	var m_input     = document.createElement('textarea');
	var m_width     = width;
	
	var setVisibility = function(visibility) {
		m_input.style.visibility = visibility;
	};

	m_input.className = 'textArea';
	m_input.style.width = width + 'px';
	
	document.body.appendChild(m_input);

	m_input.style.height = m_height + 'px';
	m_input.style.width  = m_width + 'px';
	
	setVisibility('hidden');
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.disable = function() {
		m_input.style.color = '#808080';
		m_input.disabled = true;
	};
	
	this.enable = function() {
		m_input.style.color = '#000000';
		m_input.disabled = false;
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		return m_height;
	};
	
	this.getValue = function() {
		return m_input.value;
	};

	this.getWidth = function() {
		return m_width;
	};
	
	this.hide = function() {
		setVisibility('hidden');
	};
	
	this.move = function(x, y) {
		m_input.style.left = x + 'px';
		m_input.style.top  = y + 'px';
	};
	
	this.setMaxLength = function(maxLength) {
		m_input.style.maxlength = maxLength;
	};

	this.setOrder = function(order) {
		m_input.style.zIndex = order + 1;
		
		return order + 2;
	};
	
	this.setValue = function(value) {
		m_input.value = value;
	};
	
	this.show = function() {
		setVisibility('visible');
	};
};

function TTextBox(width, isPassword) {
	var m_alignment = 0;
	var m_layer     = document.createElement('div');
	var m_input     = document.createElement('input');
	var m_width     = (width === undefined || width == null) ? 150 : width;

	var setVisibility = function(visibility) {
		m_layer.style.visibility = visibility;
		m_input.style.visibility = visibility;
	};
	
	m_layer.className = 'absoluteLayer';
	m_input.className = 'textBox';
	m_input.style.width = m_width + 'px';
	m_input.setAttribute('type', ((isPassword === undefined) || !isPassword) ? 'text' : 'password');
	m_layer.appendChild(m_input);
	
	document.body.appendChild(m_layer);
	
	var m_height = m_input.offsetHeight;

	m_layer.style.height = m_height + 'px';
	m_layer.style.width  = m_width + 'px';

	setVisibility('hidden');
	
	this.alignLeft = function() {
		m_alignment = 1;
	};
	
	this.alignRight = function() {
		m_alignment = 2;
	};
	
	this.disable = function() {
		m_input.style.color = '#808080';
		m_input.disabled = true;
	};
	
	this.enable = function() {
		m_input.style.color = '#000000';
		m_input.disabled = false;
	};
	
	this.getAlignment = function() {
		return m_alignment;
	};
	
	this.getHeight = function() {
		return m_height;
	};
	
	this.getValue = function() {
		return m_input.value;
	};

	this.getWidth = function() {
		return m_width;
	};

	this.hide = function () {
	    setVisibility('hidden');
	};
	
	this.move = function(x, y) {
		m_layer.style.left = x + 'px';
		m_layer.style.top  = (y - m_input.offsetTop) + 'px';
	};
	
	this.setBackground = function(value) {
		m_input.style.background = value;
	};
	
	this.setDirection = function(dir) {
		m_input.style.direction = dir;
	};
	
	this.setFocus = function() {
		m_input.focus();
		m_input.value = m_input.value;
	};
	
	this.setMaxLength = function(maxLength) {
		m_input.setAttribute('maxLength', maxLength);
	};

	this.setOrder = function(order) {
		order++;
		
		m_layer.style.zIndex = order;
		m_input.style.zIndex = order;
		
		return order;
	};

	this.setReadOnly = function() {
		m_input.setAttribute('readOnly', 'readonly');
	};

	this.setValue = function(value) {
		m_input.value = value;
	};

	this.show = function () {
	    setVisibility('visible');
	};

	this.unsetReadOnly = function() {
		m_input.setAttribute('readOnly', 'false');
	};
};

function TToolBar(mode, backgroundColor, roundedCorners, padding) { // mode = Icon IconTitle
	var m_alignment                  = 0;
	var m_background                 = (backgroundColor === undefined || backgroundColor == null) ? '#AFCCEE' : backgroundColor;
    var m_brkBackground              = new TBrick();
    var m_direction                  = 'ltr';
    var m_height                     = 0;
    var m_items                      = new Array();
	var m_mode                       = (mode === undefined || mode == null) ? 'Icon' : mode;
	var m_padding                    = (padding === undefined || padding == null) ? 5 : padding;
	var m_roundedCorners             = (roundedCorners === undefined || roundedCorners == null) ? false : roundedCorners;
	var m_separators                 = new Array();
	var m_width                      = 0;
	
	m_brkBackground.setBorder(m_background, 1, 1, 1, 1, m_roundedCorners);
	m_brkBackground.setBackground(m_background);
	
	var itemOut = function(index) {
		m_items[index].iconB.setBackground(m_items[index].icon);
		if (m_items[index].active) { 
			if (m_items[index].aIcon != null) { m_items[index].iconB.setBackgroundImage(m_items[index].aIcon); } 
		} 
		if (m_mode == 'IconTitle') { m_items[index].title.setColor('#000000'); }
		m_items[index].cover.setCursor('default');
	};
	
	var getItemIndexByName = function(name) {
		for (var i = 0; i < m_items.length; i++) {
			if (m_items[i].name == name) {
				return i;
			}	
		}
	};
	
	var onCoverClick = function(name) {
		var index = getItemIndexByName(name);
		
		if (m_items[index].enabled == true) {
			if (m_items[index].active) {
				if (m_items[index].hIcon != null) { m_items[index].iconB.setBackground(m_items[index].hIcon); }
				m_items[index].active = false;
			} else {
				if (m_items[index].aIcon != null) { m_items[index].iconB.setBackground(m_items[index].aIcon); }
				m_items[index].active = true;
			}
			if (m_items[index].callback != null) {
				m_items[index].callback();
				//itemOut(index);
			}
		}
	};
	
	var onCoverOut = function(name) {
		var index = getItemIndexByName(name);
		if (m_items[index].enabled == true) {
			itemOut(index);
		}
	};
	
	var onCoverOver = function(name) {
		var index = getItemIndexByName(name);
		if (m_items[index].enabled == true) {
			if (m_items[index].hIcon != null) { m_items[index].iconB.setBackground(m_items[index].hIcon); }
			if (m_mode == 'IconTitle') { m_items[index].title.setColor('#ffd0a0'); }
			m_items[index].cover.setCursor('pointer');
		}
	};
	
	this.add = function(name, title, icon, hIcon, aIcon, callback) {
		callback = (callback === undefined || callback == null) ? null : callback;
		icon = (icon === undefined || icon == null) ? null : "url(" + icon + ") no-repeat left top";
		aIcon = (aIcon === undefined || aIcon == null) ? null : "url(" + aIcon + ") no-repeat left top";
		hIcon = (hIcon === undefined || hIcon == null) ? null : "url(" + hIcon + ") no-repeat left top";
		
		var iconB = new TBrick();
    	var cover= new TBrick();
    	var txtTitle = null;
    	var width = 0;
    	
		if (m_mode == 'Icon') {
			width = 24;
			cover.setTooltip(title);
		} else if (m_mode == 'IconTitle') {
			txtTitle = new TText(title);
			width = txtTitle.getWidth() + 24;
		}
		
    	iconB.setSize(24, 24);
    	iconB.setBackground(icon);
    	cover.setSize(width, 24);
    	
    	var coverClick = new TCaller(onCoverClick, name);
    	var coverOut = new TCaller(onCoverOut, name);
    	var coverOver = new TCaller(onCoverOver, name);
    	
    	cover.addEvent('click', coverClick.callback);
    	cover.addEvent('mouseout', coverOut.callback);
    	cover.addEvent('mouseover', coverOver.callback);
    	
    	m_items.push({ name: name, title: txtTitle, icon: icon, hIcon: hIcon, aIcon: aIcon, iconB: iconB, cover: cover, callback: callback, width: width, enabled: true, active: false });
	};
    
    this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };
	
	this.disable = function(name) {
		name = (name === undefined || name == null) ? null : name;
		if (name != null) {
			var index = getItemIndexByName(name);
			m_items[index].enabled = false;
			m_items[index].cover.setFilter(20);
			if (m_mode == 'IconTitle') { m_items[index].title.setColor('#ffffff'); }
		} else {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].enabled = false;
				m_items[i].cover.setFilter(20);
				if (m_mode == 'IconTitle') { m_items[i].title.setColor('#ffffff'); }	
			}
		}
	};
	
	this.enable = function(name) {
		name = (name === undefined || name == null) ? null : name;
		if (name != null) {
			var index = getItemIndexByName(name);
			m_items[index].enabled = true;
			m_items[index].cover.setFilter(0);
			if (m_mode == 'IconTitle') { m_items[index].title.setColor('#000000'); }
		} else {
			for (var i = 0; i < m_items.length; i++) {
				m_items[i].enabled = true;
				m_items[i].cover.setFilter(0);
				if (m_mode == 'IconTitle') { m_items[i].title.setColor('#000000'); }
			}
		}
	};
	
    this.getAlignment = function() {
        return m_alignment;
    };
	
	this.getHeight = function() {
		m_height = 26;
		
		return m_height;
	};
	
	this.getWidth = function() {
		m_width = 0;
		
		for (var i = 0; i < m_items.length; i++) {
			m_width += m_items[i].width;	
		}
		
		for (var i = 0; i < m_separators.length; i++) {
			m_width += m_separators[i].separator.getWidth();
		}
		
		m_width += m_items.length * m_padding + m_separators.length * m_padding + m_padding;
		
		return m_width;
	};
	
	this.hide = function() {
		m_brkBackground.hide();
		
		for (var i = 0; i < m_items.length; i++) {
			if (m_mode == 'IconTitle') { m_items[i].title.hide(); }
			m_items[i].iconB.hide();
			m_items[i].cover.hide();
		}
		
		for (var i = 0; i < m_separators.length; i++) {
			m_separators[i].separator.hide();
		}
	};
	
	this.insertSeparator = function() {
		var separator = new TBrick();
		separator.setBackground('url(images/seperator.gif) no-repeat left top');
		separator.setSize(2, 18);
		
		m_separators.push({ index: m_items.length, separator: separator });
	};
	
	this.move = function(x, y) {
		m_brkBackground.setSize(m_width, m_height);
		m_brkBackground.move(x, y);
		
		var headerX = x + m_padding;
		
		if (m_direction == 'ltr') {
			for (var i = 0; i < m_items.length; i++) {
				for (var j = 0; j < m_separators.length; j++) {
					if (m_separators[j].index == i) {
						m_separators[j].separator.move(headerX, y + 3);
						headerX += m_separators[j].separator.getWidth() + m_padding;
						break;
					}	
				}
				if (m_mode == 'IconTitle') { m_items[i].title.move(headerX + 26, y + (m_height - m_items[i].title.getHeight()) / 2); }
				m_items[i].iconB.move(headerX, y + (m_height - 24) / 2);
				m_items[i].cover.move(headerX, y + (m_height - 24) / 2);
				
				headerX += m_items[i].width + m_padding;
			}
		} else {
			for (var i = m_items.length - 1; i >= 0; i--) {
				for (var j = 0; j < m_separators.length; j++) {
					if (m_separators[j].index == i) {
						m_separators[j].separator.move(headerX, y + 3);
						headerX += m_separators[j].separator.getWidth() + m_padding;
						break;
					}	
				}
				if (m_mode == 'IconTitle') { m_items[i].title.move(headerX + 26, y + (m_height - m_items[i].title.getHeight()) / 2); }
				m_items[i].iconB.move(headerX, y + (m_height - 24) / 2);
				m_items[i].cover.move(headerX, y + (m_height - 24) / 2);
				
				headerX += m_items[i].width + m_padding;
			}
		}
	};
	
	this.setBackgroundColor = function(color) {
		m_background = color;
		m_brkBackground.setBorder(m_background, 1, 1, 1, 1, m_roundedCorners);
	};
	
	this.setDirection = function(dir) {
		m_direction = dir;
	};
	
	this.setOrder = function(order) {
		m_brkBackground.setOrder(order + 1);
		
		for (var i = 0; i < m_items.length; i++) {
			if (m_mode == 'IconTitle') { m_items[i].title.setOrder(order + 2); }
			m_items[i].iconB.setOrder(order + 2);
			m_items[i].cover.setOrder(order + 3);
		}
		
		for (var i = 0; i < m_separators.length; i++) {
			m_separators[i].separator.setOrder(order + 2);
		}
		
		return order + 4;
	};
	
	this.setPadding = function(padding) {
		m_padding = padding;
	};
	
	this.setRoundedCorners = function(value) {
		m_roundedCorners = value;
		m_brkBackground.setBorder(m_background, 1, 1, 1, 1, m_roundedCorners);
	};
	
	this.show = function() {
		m_brkBackground.show();
		
		for (var i = 0; i < m_items.length; i++) {
			if (m_mode == 'IconTitle') { m_items[i].title.show(); }
			m_items[i].iconB.show();
			m_items[i].cover.show();
		}
		
		for (var i = 0; i < m_separators.length; i++) {
			m_separators[i].separator.show();
		}
	};
};

function TTreeView(title, height, width) {
	var m_alignment                  = 1;
    var m_brkBackground              = new TBrick();
    var m_brkBorder                  = new TBrick();
    var m_expandedItems              = new Array();
    var m_fileDblClickCallback       = null;
    var m_height                     = (height === undefined || height == null) ? 0 : height;
    var m_items                      = new Array();
    var m_order                      = 0;
    var m_selectedItemChangedCallback = null;
    var m_selectedItemName           = '';
    var m_txtTitle                   = new TText((title === undefined || title == null) ? '' : title);
    var m_titleAlignment             = 0;
    var m_width                      = (width === undefined || width == null) ? 0 : width;
    
    m_brkBorder.setBorder('#AFCCEE', 1, 1, 1, 1); //80B0D0
    m_brkBorder.setBackground('#AFCCEE');
    m_brkBackground.setBorder('#FFFFFF', 1, 1, 1, 1);
    m_brkBackground.setOverflow('auto');
    
    var getRootItems = function() {
    	var rootItems = new Array();
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].parentName == '') {
    			rootItems.push(m_items[i]);
    		}
    	}
    	return rootItems;
    };
    
    var getSubItems = function(parentName) {
    	var subItems = new Array();
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].parentName == parentName) {
    			subItems.push(m_items[i]);
    		}
    	}
    	return subItems;
    };
    
    var hideSubItems = function(parentName) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].parentName == parentName) {
    			m_items[i].node.hide();
		    	m_items[i].icon.hide();
		    	m_items[i].titleBack.hide();
		    	m_items[i].titleCover.hide();
		    	m_items[i].title.hide();
		    	
		    	if (isParent(m_items[i].name) && isExpanded(m_items[i].name)) {
		    		hideSubItems(m_items[i].name);
		    	}
    		}
    	}
    };
    
    var isExpanded = function(itemName) {
    	for (var i = 0; i < m_expandedItems.length; i++) {
		    if (m_expandedItems[i].name == itemName) {
		    	return true;
		    }
		}
		return false;
    };
    
    var isParent = function(itemName) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].parentName == itemName) {
    			return true;
    		}
    	}
    	return false;
    };
    
    var itemClick = function(name) {
    	var plus = true;
    	for (var i = 0; i < m_expandedItems.length; i++) {
		    if (m_expandedItems[i].name == name) {
		    	m_expandedItems.splice(i, 1);
		    	plus = false;
		    }
		}
		    	
		if (plus) {
		    for (var i = 0; i < m_items.length; i++) {
			    if (m_items[i].name == name) {
			    	m_expandedItems.push(m_items[i]);
			    	break;
			    } 
			}
		} 
		    	
		drawTree();
    };
    
    var itemColor = function(name) {
    	if (m_selectedItemName != '') {
    		if (m_selectedItemName != name) {
    			for (var i = 0; i < m_items.length; i++) {
		    		if (m_items[i].name == m_selectedItemName) {
		    			m_items[i].titleBack.setBackground('#ffffff');
		    		} else if (m_items[i].name == name) {
		    			m_items[i].titleBack.setBackground('#ffd0a0');
		    		}
		    	}
		    	m_selectedItemName = name;
    		} 
    	} else {
    		m_selectedItemName = name;
    		for (var i = 0; i < m_items.length; i++) {
	    		if (m_items[i].name == name) {
	    			m_items[i].titleBack.setBackground('#ffd0a0');
	    			break;
	    		}
	    	}
    	}
    };
    
    var onCoverClick = function(name) {
    	itemColor(name);
    	
    	if (m_selectedItemChangedCallback != null) {
    		m_selectedItemChangedCallback();
    	}
    };
    
    var onCoverDoubleClick = function(name) {
    	itemColor(name);
    	itemClick(name);
    	
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			if (m_items[i].type == 'File') {
    				if (m_fileDblClickCallback != null) {
    					m_fileDblClickCallback();
    				}
    			}
    			break;
    		}
    	}
    };
    
    var onCoverOut = function(name) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			m_items[i].titleCover.setCursor('default');
    			break;
    		}
    	}
    };
    
    var onCoverOver = function(name) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			m_items[i].titleCover.setCursor('pointer');
    			break;
    		}
    	}
    };
    
    var onNodeClick = function(name) {
    	itemClick(name);
    };
    
    var onNodeOut = function(name) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			m_items[i].node.setCursor('default');
    			break;
    		}
    	}
    };
    
    var onNodeOver = function(name) {
    	for (var i = 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			m_items[i].node.setCursor('pointer');
    			break;
    		}
    	}
    };
    
    var drawTree = function() {
    	var rootItems = getRootItems();
	    var itemY = 2;
	    
	    for (var i = 0; i < rootItems.length; i++) {
	    	itemY = drawItem(rootItems[i].name, 0, itemY);
	    	if (i < rootItems.length - 1) { itemY += 20; }
	    }
    };
    
    var drawItem = function(name, x, y) {
    	var itemIndex = 0;
    	for (var i= 0; i < m_items.length; i++) {
    		if (m_items[i].name == name) {
    			itemIndex = i;
    			break;
    		}
    	}
    	
    	m_items[itemIndex].node.move(x, y);
    	m_items[itemIndex].node.show();
	    m_items[itemIndex].icon.move(x + 20, y);
	    m_items[itemIndex].icon.show();
	    m_items[itemIndex].titleBack.move(x + 40, y);
	    m_items[itemIndex].titleBack.show();
	    m_items[itemIndex].titleCover.move(x + 40, y);
	    m_items[itemIndex].titleCover.show();
	    m_items[itemIndex].title.move(x + 40 + (m_items[itemIndex].titleBack.getWidth() - m_items[itemIndex].title.getWidth()) / 2, y + (m_items[itemIndex].titleBack.getHeight() - m_items[itemIndex].title.getHeight()) / 2);
	    m_items[itemIndex].title.show();
	    
	    if (isParent(m_items[itemIndex].name)) {
	    	if (isExpanded(m_items[itemIndex].name)) {
	    		m_items[itemIndex].icon.setBackground('url(images/tree/folderOpen.gif) no-repeat left top');
	    		m_items[itemIndex].node.setBackground('url(images/tree/minus.gif) no-repeat left top');
	    		
	    		var subItems = getSubItems(m_items[itemIndex].name);
	    		y += 20;
	    		for (var i = 0; i < subItems.length; i++) {
	    			y = drawItem(subItems[i].name, x + 10, y);
	    			if (i < subItems.length - 1) { y += 20; }
	    		}
	    		
	    	} else {
	    		hideSubItems(m_items[itemIndex].name);
	    		m_items[itemIndex].icon.setBackground('url(images/tree/folderClosed.gif) no-repeat left top');
	    		m_items[itemIndex].node.setBackground('url(images/tree/plus.gif) no-repeat left top');
	    	}
	    	
	    } else {
	    	if (m_items[itemIndex]. type != 'File') {
	    		if (isExpanded(m_items[itemIndex].name)) {
	    			m_items[i].icon.setBackground('url(images/tree/folderOpen.gif) no-repeat left top');
	    		} else {
	    			m_items[i].icon.setBackground('url(images/tree/folderClosed.gif) no-repeat left top');
	    		}
	    	}
	    	m_items[itemIndex].node.disable();
	    	m_items[itemIndex].node.setBackground('#ffffff');
	    }
	    
	    return y;
    };
    
    var orderItems = function() {
    	for (var i = 0; i < m_items.length; i++) {
	    	m_items[i].node.setOrder(m_order + 1);
	    	m_items[i].icon.setOrder(m_order + 1);
	    	m_items[i].titleBack.setOrder(m_order + 1);
	    	m_items[i].titleCover.setOrder(m_order + 3);
	    	m_items[i].title.setOrder(m_order + 2);
	    }
    };
    
    this.add = function(name, type, title, parentName) {
    	parentName = (parentName === undefined || parentName == null) ? '' : parentName;
    	type = (type === undefined || type == null || (type != 'File' && type != 'Folder')) ? 'Folder' : type;
    	
    	var node = new TBrick(null, m_brkBackground);
    	var icon = new TBrick(null, m_brkBackground);
    	var titleBack = new TBrick(null, m_brkBackground);
    	var titleCover= new TBrick(null, m_brkBackground);
    	var txtTitle = new TText(title, null, null, m_brkBackground);
    	var width = txtTitle.getWidth() + 50;
    	
    	var coverClick = new TCaller(onCoverClick, name);
    	var coverDoubleClick = new TCaller(onCoverDoubleClick, name);
    	var coverOut = new TCaller(onCoverOut, name);
    	var coverOver = new TCaller(onCoverOver, name);
    	
    	titleCover.addEvent('click', coverClick.callback);
    	titleCover.addEvent('dblclick', coverDoubleClick.callback);
    	titleCover.addEvent('mouseout', coverOut.callback);
    	titleCover.addEvent('mouseover', coverOver.callback);
    	
    	var nodeClick = new TCaller(onNodeClick, name);
		var nodeOut = new TCaller(onNodeOut, name);
		var nodeOver = new TCaller(onNodeOver, name);
		    	
		node.addEvent('click', nodeClick.callback);
		node.addEvent('mouseout', nodeOut.callback);
		node.addEvent('mouseover', nodeOver.callback);
    	
    	node.setSize(18, 18);
    	icon.setSize(18, 18);
    	if (type == 'File') { icon.setBackground('url(images/tree/leaf.gif) no-repeat left top'); }
    	
    	titleBack.setSize(txtTitle.getWidth() + 10, 18);
    	titleCover.setSize(txtTitle.getWidth() + 10, 18);
    	
    	m_items.push({ name: name, type: type, title: txtTitle, titleBack: titleBack, titleCover: titleCover, parentName: parentName, node: node, icon: icon, width: width });
    };
    
    this.alignCenter = function() {
        m_alignment = 0;
    };
    
    this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };
	
	this.alignTitleLeft = function() {
        m_titleAlignment = 1;
    };

    this.alignTitleRight = function() {
        m_titleAlignment = 2;
    };
	
	this.clear = function() {
		while (m_items.length) {
			m_items[m_items.length - 1].icon.destroy();
			m_items[m_items.length - 1].node.destroy();
			m_items[m_items.length - 1].title.destroy();
			m_items[m_items.length - 1].titleBack.destroy();
			m_items[m_items.length - 1].titleCover.destroy();
	        m_items.splice(m_items.length - 1, 1);
	    }
	};
	
    this.getAlignment = function() {
        return m_alignment;
    };
    
    this.getHeight = function() {
    	if (m_height == 0) {
    		m_height = 21;
	    	var root = getRootItems();
	    	
	    	for (var i = 0; i < root.length; i++) {
	    		m_height += 19;
	    	}
	    	
	    	m_height = m_height < 250 ? 250 : m_height;
    	} 
    	
    	return m_height;
    };
    
    this.getSelectedItem = function() {
    	return m_selectedItemName;
    };
    
    this.getWidth = function() {
    	if (m_width == 0) {
    		m_width = m_txtTitle.getWidth() + 20;
	    	var root = getRootItems();
	    	
	    	for (var i = 0; i < root.length; i++) {
	    		if (m_width < root[i].width) {
	    			m_width = root[i].width;
	    		}
	    	}
	    	m_width += 20;
    	}
    	
    	return m_width;
    };
    
    this.hide = function() {
    	m_brkBackground.hide();
    	m_brkBorder.hide();
    	m_txtTitle.hide();
    	
    	for (var i = 0; i < m_items.length; i++) {
	    	m_items[i].node.hide();
	    	m_items[i].icon.hide();
	    	m_items[i].titleBack.hide();
	    	m_items[i].titleCover.hide();
	    	m_items[i].title.hide();
	    }
	    
	    m_selectedItemName = '';
    };
    
    this.loadXML = function(xmlDoc) {
    	this.clear();
    	
    	var itemRows = xmlDoc.getElementsByTagName('Row');
    	
    	for (var i = 0; i < itemRows.length; i++) {
    		nodes = itemRows[i].childNodes;
    		var name, type, title, parentName = null;
    		
    		for (var j = 0; j < nodes.length; j++) {
    			if (nodes[j].nodeName == 'Name') {
    				if (nodes.item(j).firstChild) { name = nodes.item(j).firstChild.nodeValue; }
    			} else if (nodes[j].nodeName == 'Type') {
    				if (nodes.item(j).firstChild) { type = nodes.item(j).firstChild.nodeValue; }
    			} else if (nodes[j].nodeName == 'Title') {
    				if (nodes.item(j).firstChild) { title = nodes.item(j).firstChild.nodeValue; }
    			} else if (nodes[j].nodeName == 'ParentName') {
    				if (nodes.item(j).firstChild) { parentName = nodes.item(j).firstChild.nodeValue; }
    			}
    		}
    		
    		this.add(name, type, title, parentName);
    	}
    	orderItems();
    	drawTree();
    };
    
    this.move = function(x, y) {
	    m_brkBorder.move(x, y);
	    m_brkBorder.setSize(m_width, m_height);

	    m_brkBackground.move(x + 1, y + 20);
	    m_brkBackground.setSize(m_width - 2, m_height - 21);
	    
	    switch (m_titleAlignment) {
	    	case 0:
	    		m_txtTitle.move(x + (m_width - m_txtTitle.getWidth()) / 2, y + (20 - m_txtTitle.getHeight()) / 2);
	    		break;		
	    	case 1:
	    		m_txtTitle.move(x + 5, y + (20 - m_txtTitle.getHeight()) / 2);
	    		break;
	    	case 2:
	    		m_txtTitle.move(x + m_width - m_txtTitle.getWidth() - 5, y + (20 - m_txtTitle.getHeight()) / 2);
	    		break;
	    }
	    
	    drawTree();
    };
    
    this.setOnFileDblClick = function(callback) {
    	m_fileDblClickCallback = callback;
    };
    
    this.setOnSelectedItemChanged = function(callback) {
    	m_selectedItemChangedCallback = callback;
    };
    
    this.setOrder = function(order) {
    	m_order = order;
    	order = m_brkBackground.setOrder(m_txtTitle.setOrder(m_brkBorder.setOrder(order + 1)));
    	
    	orderItems();
    };
    
    this.show = function() {
    	m_brkBackground.show();
    	m_brkBorder.show();
    	m_txtTitle.show();
    	
    	var rootItems = getRootItems();
    	for (var i = 0; i < rootItems.length; i++) {
	    	rootItems[i].node.show();
	    	rootItems[i].icon.show();
	    	rootItems[i].titleBack.show();
	    	rootItems[i].titleCover.show();
	    	rootItems[i].title.show();
	    }
    };
};

function TURLValidator() {
	var m_phrase = '';
	
	this.getPhrase = function() {
		return m_phrase;
	};

	this.validate = function(text) {
		var re = /^(http:\/\/www.|https:\/\/www.|ftp:\/\/www.|www.|http:\/\/|https:\/\/|ftp:\/\/){1}([0-9A-Za-z]+\.[A-Za-z])/;

		var valid = false;
		
		if (text != '') {
			if (!re.test(text)) {
				m_phrase = TLang.translate('urlIsInvalid');
			} else {
				valid = true;
				m_phrase = TLang.translate('urlIsValid');
			}
		}
		
		return valid;
	};
};

function TValidatableTextBox(width, validator, isPassword) {
	var m_direction     = 'ltr';
	var m_enabled       = true;
	var m_textBox       = new TTextBox(width, isPassword);
	var m_timerId       = 0;
	var m_validatingBox = new TBrick();
	var m_validator     = validator === undefined ? null : validator;
	var m_validated     = false;
	var m_onValidationChangedCallback = null;
	
	m_validatingBox.setSize(16, 16);
	m_validatingBox.setBackgroundImage('images/valid/er.png');
	m_validatingBox.setBackgroundSize('cover');
	
	var onValidate = function() {
		if (m_validator != null) {
			if (m_timerId != 0) {
				clearTimeout(m_timerId);
				m_timerId = 0;
			}

			if (m_validator.validate(m_textBox.getValue())) {
				if (m_enabled) {
					m_validatingBox.setBackgroundImage('images/valid/ok.png');
				} else {
					m_validatingBox.setBackgroundImage('images/valid/okd.png');
				}
				
				if (!m_validated) {
					m_validated = true;
					
					if (m_onValidationChangedCallback != null) {
						m_onValidationChangedCallback();
					}
				}
			} else {
				if (m_enabled) {
					m_validatingBox.setBackgroundImage('images/valid/er.png');
				} else {
					m_validatingBox.setBackgroundImage('images/valid/erd.png');
				}
				
				if (m_validated) {
					m_validated = false;
					
					if (m_onValidationChangedCallback != null) {
						m_onValidationChangedCallback();
					}
				}
			}
			
			m_timerId = setTimeout(onValidate, 250);
		} else {
			m_timerId = 0;
		}
	};
	
	this.alignLeft = function() {
		m_textBox.alignLeft();
	};
	
	this.alignRight = function() {
		m_textBox.alignRight();
	};
	
	this.disable = function() {
		m_enabled = false;
		m_textBox.disable();
		
		if (m_validated) {
			m_validatingBox.setBackgroundImage('images/valid/okd.png');
		} else {
			m_validatingBox.setBackgroundImage('images/valid/erd.png');
		}
	};
	
	this.enable = function() {
		m_enabled = true;
		m_textBox.enable();

		if (m_validated) {
			m_validatingBox.setBackgroundImage('images/valid/ok.png');
		} else {
			m_validatingBox.setBackgroundImage('images/valid/er.png');
		}
	};

	this.getAlignment = function() {
		return m_textBox.getAlignment();
	};
	
	this.getHeight = function() {
		var height = m_textBox.getHeight();
		
		return height > 16 ? height : 16;
	};
	
	this.getValidator = function() {
		return m_validator;
	};
	
	this.getValue = function() {
		return m_textBox.getValue();
	};
	
	this.getWidth = function() {
		return m_textBox.getWidth() + 21;
	};
	
	this.hide = function() {
		m_textBox.hide();
		m_validatingBox.hide();
		
		if (m_timerId != 0) {
			clearTimeout(m_timerId);
			m_timerId = 0;
		}
	};
	
	this.isValid = function() {
		return m_validated;
	};
	
	this.move = function(x, y) {
		var height = m_textBox.getHeight();

		if (m_direction == 'ltr') {
			m_textBox.move(x, y);
			m_validatingBox.move(x + m_textBox.getWidth() + 5, y + (height > 16 ? ((height - 16) / 2) : 0));
		} else {
			m_validatingBox.move(x, y + (height > 16 ? ((height - 16) / 2) : 0));
			m_textBox.move(x + m_validatingBox.getWidth() + 5, y);
		}		
	};
	
	this.setDirection = function(dir) {
		m_direction = dir;
		m_textBox.setDirection(dir);
	};
	
	this.setFocus = function() {
		m_textBox.setFocus();
	};
	
	this.setMaxLength = function(maxLength) {
		m_textBox.setMaxLength(maxLength);
	};

	this.setOnValidationChanged = function(callback) {
		m_onValidationChangedCallback = callback;
	};

	this.setOrder = function(order) {
		order++;
		order = m_textBox.setOrder(order);

		return m_validatingBox.setOrder(order);
	};
	
	this.setReadOnly = function() {
		m_textBox.setReadOnly();
	};
	
	this.setText = function(text) {
		m_textBox.setValue(text);
		onValidate();
	};
	
	this.setValue = function(value) {
		m_textBox.setValue(value);
		onValidate();
	};

	this.show = function() {
		m_textBox.show();
		m_validatingBox.show();
		m_timerId = setTimeout(onValidate, 250);
	};
	
	this.unsetReadOnly = function() {
		m_textBox.unsetReadOnly();
	};
};

function TVerticalDelimiter(height) {
	var m_height = height;
	
	this.getAlignment = function() {
		return 0;
	};

	this.getHeight = function() {
		return m_height;
	};
	
	this.getWidth = function() {
		return 1;
	};

	this.hide = function() {
	};
	
	this.move = function(x, y) {
	};
	
	this.setOrder = function(order) {
		return order;
	};

	this.show = function() {
	};
};

function TVerticalLayout(margin, padding) {
	var m_alignment = 0;
	var m_height    = 0;
	var m_margin    = margin === undefined ? 5 : margin;
	var m_objects   = new Array();
	var m_padding   = padding === undefined ? 7 : padding;
	var m_width     = 0;

	this.add = function(object) {
		m_objects[m_objects.length] = object;
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

	this.getHeight = function() {
		m_height = 0;
		
		for (var i = 0; i < m_objects.length; i++) {
			m_height += m_objects[i].getHeight();
		}
		
		if (m_objects.length > 0) {
			m_height += (m_objects.length - 1) * m_padding;
		}
		
		return m_height + m_margin * 2;
	};
	
	this.getWidth = function() {
		m_width = 0;
		
		for (var i = 0; i < m_objects.length; i++) {
			var objectWidth = m_objects[i].getWidth();
			
			if (m_width < objectWidth) {
				m_width = objectWidth;
			}
		}
		
		return m_width + m_margin * 2;
	};
	
	this.hide = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].hide();
		}
	};
	
	this.move = function(x, y) {
		x += m_margin;
		y += m_margin;

		for (var i = 0; i < m_objects.length; i++) {
			if (i > 0) {
				y += m_padding;
			}
			
			switch (m_alignment) {
				case 0: // Center
					m_objects[i].move(x + (m_width - m_objects[i].getWidth()) / 2, y);
					break;
					
				case 1: // Left					
					m_objects[i].move(x, y);
					break;
					
				case 2: // Right
					m_objects[i].move(x + (m_width - m_objects[i].getWidth()), y);
					break;
			}
			
			y += m_objects[i].getHeight();
		}
	};
	
	this.setOrder = function(order) {
		var resultingOrder = 0;
		
		order++;

		for (var i = 0; i < m_objects.length; i++) {
			var intermediateOrder = m_objects[i].setOrder(order);
			
			if (resultingOrder < intermediateOrder) {
				resultingOrder = intermediateOrder;
			}
		}
		
		return resultingOrder;
	};

	this.setPadding = function(padding) {
		m_padding = padding;
	};

	this.show = function() {
		for (var i = 0; i < m_objects.length; i++) {
			m_objects[i].show();
		}
	};
};

function TVerticalMenu() {
	var m_alignment                  = 1;
    var m_brkBackground              = new TBrick();
    var m_brkBorder                  = new TBrick();
    var m_ddWrappers                 = new Array();
    var m_height                     = 0;
    var m_menuItems                  = new Array();
    var m_timeout                    = 1000;
	var m_timerId                    = 0;
    var m_width                      = 0;
    
    m_brkBorder.setBorder('#80B0D0', 1, 1, 1, 1);
    m_brkBackground.setBorder('#FFFFFF', 1, 1, 1, 1);
    
    var getRootItems = function() {
    	var rootItems = new Array();
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == '') {
    			rootItems.push(m_menuItems[i]);
    		}
    	}
    	return rootItems;
    };
    
    var getSubItems = function(parentName) {
    	var subItems = new Array();
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == parentName) {
    			subItems.push(m_menuItems[i]);
    		}
    	}
    	return subItems;
    };
    
    var getWrapperHeight = function(name) {
    	var ddHeight = 0;
		var subItems = getSubItems(name);
		for (var j = 0; j < subItems.length; j++) {
			ddHeight += 19;
		}
		return ddHeight;
    };
    
    var getWrapperWidth = function(name) {
    	var ddWidth = 0;
		var subItems = getSubItems(name);
		
		for (var j = 0; j < subItems.length; j++) {
			if (ddWidth < subItems[j].width) {
				ddWidth = subItems[j].width;
			}
		}
		
		for (var j = 0; j < subItems.length; j++) {
			subItems[j].width = ddWidth;
			subItems[j].titleBack.setSize(ddWidth, 19);
			subItems[j].cover.setSize(ddWidth, 19);
		}
		
		return ddWidth + 2;
    };
    
    var hideSubItems = function(parentName) {
    	var subItems = getSubItems(parentName);
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		if (m_ddWrappers[i].parentName == parentName) {
    			m_ddWrappers[i].ddWrapper.hide();
    			break;
    		}
    	}
    	
    	for (var i = 0; i < subItems.length; i++) {
    		if (isParent(subItems[i].name)) { hideSubItems(subItems[i].name); }
    		subItems[i].title.hide();
    		subItems[i].titleBack.hide();
    		subItems[i].arrowBack.hide();
    		subItems[i].cover.hide();
    	}
    };
    
    var hideWrappers = function() {
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		m_ddWrappers[i].ddWrapper.hide();
    	}
    	
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName != '') {
    			m_menuItems[i].title.hide();
    			m_menuItems[i].titleBack.hide();
    			m_menuItems[i].arrowBack.hide();
    			m_menuItems[i].cover.hide();
    		}
    	}
    };
    
    var isParent = function(menuItemName) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == menuItemName) {
    			return true;
    		}
    	}
    	return false;
    };
    
    var moveItem = function(item, x, y) {
		item.titleBack.move(x, y + 1);
    	item.cover.move(x, y + 1);
    	item.arrowBack.move(x + (item.width - 8), y + 4);
    		
    	switch (item.alignment) {
    		case 0:
    			item.title.move(x + (item.width - item.title.getWidth()) / 2, y + (19 - item.title.getHeight()) / 2);
    			break;
    		case 1:
    			item.title.move(x + 1, y + (19 - item.title.getHeight()) / 2);
    			break;
    		case 2:
    			item.title.move(x + (item.width - item.title.getWidth() - 13), y + (19 - item.title.getHeight()) / 2);
    			break;
    	}
    	
    	if (isParent(item.name)) {
    		item.arrowBack.setBackground('url(images/tbl/inc.png) no-repeat left top');
    		item.arrowBack.setSize(8, 12);
    		var subItems = getSubItems(item.name);
    		
    		var headerY = y + 1;
    			
    		for (var i = 0; i < m_ddWrappers.length; i++) {
	    		if (m_ddWrappers[i].parentName == item.name) {
	    			m_ddWrappers[i].ddWrapper.setSize(getWrapperWidth(item.name), getWrapperHeight(item.name));
	    			m_ddWrappers[i].ddWrapper.move(x + item.width + 2, headerY);
	    			break;
	    		}
	    	}
    			
    		for (var j = 0; j < subItems.length; j++) {
	    		moveItem(subItems[j], x + item.width + 3, headerY - 1);
	    		headerY = subItems[j].titleBack.getY() + 19;
	    	}
    	}
	};
    
    var onMenuItemClick = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
	    	if (m_menuItems[i].name == name) {
	    		if (m_menuItems[i].callback != null) {
			    	m_menuItems[i].callback();
			    }
			    hideWrappers();
	    		break;
	    	}
	    }
    };
    
    var onMenuItemOut = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].name == name) {
    			m_menuItems[i].titleBack.setBackground('url(images/tblh.png) repeat-x');
    			m_menuItems[i].cover.setCursor('default');
    			break;
    		}
    	}
    	
    	if (m_timerId == 0) {
    		m_timerId = setTimeout(onTimeout, m_timeout);
    	}
    };
    
    var onMenuItemOver = function(name) {
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].name == name) {
    			m_menuItems[i].titleBack.setBackground('url(images/tblb.png) repeat-x');
    			m_menuItems[i].cover.setCursor('pointer');
    			
    			if (m_menuItems[i].parentName == '') {
    				hideWrappers();
    			} else {
    				var items = getSubItems(m_menuItems[i].parentName);
	    			for (var j = 0; j < items.length; j++) {
	    				if (items[j].name != name) {
	    					hideSubItems(items[j].name);
	    				} else {
	    					var sItems = getSubItems(name);
	    					for (var k = 0; k < sItems.length; k++) {
	    						hideSubItems(sItems[k].name);
	    					}
	    				}
	    			}
    			}
    			
    			break;
    		}
    	}
    	
    	if (isParent(name)) {
    		 showSubItems(name);
    	}
    	
    	if (m_timerId > 0) {
    		 clearTimeout(m_timerId);
    		 m_timerId = 0;
    	}
    };
    
    var onTimeout = function() {
		hideWrappers();

		m_timerId = 0;
	};
    
    var showRootItems = function() {
    	var rootItems = getRootItems();
    	
    	for (var i = 0; i < rootItems.length; i++) {
    		rootItems[i].title.show();
    		rootItems[i].titleBack.show();
    		rootItems[i].arrowBack.show();
    		rootItems[i].cover.show();
    	}
    };
    
    var showSubItems = function(parentName) {
    	var subItems = getSubItems(parentName);
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		if (m_ddWrappers[i].parentName == parentName) {
    			m_ddWrappers[i].ddWrapper.show();
    			break;
    		}
    	}
    	
    	for (var i = 0; i < subItems.length; i++) {
    		subItems[i].title.show();
    		subItems[i].titleBack.show();
    		subItems[i].arrowBack.show();
    		subItems[i].cover.show();
    	}
    };
    
    this.addMenuItem = function(name, title, parentName, callback, alignment) {
    	var arrowBack = new TBrick();
    	var backgroundTitle = new TBrick();
        var cover = new TBrick();
        var txtTitle = new TText(title, 'normalFixed');
        var itemClick = new TCaller(onMenuItemClick, name);
        var itemOut = new TCaller(onMenuItemOut, name);
	    var itemOver = new TCaller(onMenuItemOver, name);
	    
	    parentName = (parentName === undefined || parentName == null) ? '' : parentName;
        if (parentName != '') {
        	var ddWrapper = new TBrick('ddWrapper');
        	ddWrapper.setBorder('#80B0D0', 1, 1, 1, 1);
        	m_ddWrappers.push({ parentName: parentName, ddWrapper: ddWrapper });
        }
        
        backgroundTitle.setBackground('url(images/tblh.png) repeat-x');
	    backgroundTitle.setFontSize('0');
	    
	    var width = (txtTitle.getWidth() + 26 < 50) ? 50 : txtTitle.getWidth() + 26;
	    backgroundTitle.setSize(width, 19);
	    
	    cover.addEvent('click', itemClick.callback);
	    cover.addEvent('mouseout', itemOut.callback);
	    cover.addEvent('mouseover', itemOver.callback);
	    cover.setSize(width, 19);
	    
	    alignment = (alignment === undefined || alignment == null) ? 0 : alignment;
	    
	    callback = (callback === undefined || callback == null) ? null : callback;
        
        m_menuItems.push({ name: name, title: txtTitle, parentName: parentName, titleBack: backgroundTitle, arrowBack: arrowBack, callback: callback, cover: cover, width: width, alignment: alignment });
    };
    
    this.alignCenter = function() {
        m_alignment = 0;
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

    this.getHeight = function() {
		m_height = 0;
		var rootItems = getRootItems();
		
		for (var i = 0; i < rootItems.length; i++) {
			m_height += 19;
		}
        
        return m_height;
    };

    this.getWidth = function() {
    	m_width             = 0;
    	var rootItems       = getRootItems();
    	
    	for (var i = 0; i < rootItems.length; i++) {
    		if (m_width < rootItems[i].width) {
    			m_width = rootItems[i].width;
    		}
    	}
		
        return m_width;
    };

    this.hide = function() {
        m_brkBackground.hide();
        m_brkBorder.hide();
        
        for (var i = 0; i < m_menuItems.length; i++) {
    		m_menuItems[i].title.hide();
    		m_menuItems[i].titleBack.hide();
    		m_menuItems[i].arrowBack.hide();
    		m_menuItems[i].cover.hide();
    	}
    	
    	for (var i = 0; i < m_ddWrappers.length; i++) {
    		m_ddWrappers[i].ddWrapper.hide();
    	}
    };
	
    this.move = function(x, y) {
        m_brkBorder.move(x, y);
        m_brkBorder.setSize(m_width, m_height + 1);

        m_brkBackground.move(x + 1, y + 1);
        m_brkBackground.setSize(m_width - 2, m_height - 1);

        var headerY = y;
        var rootItems = getRootItems();
    	
    	for (var i = 0; i < rootItems.length; i++) {
    		moveItem(rootItems[i], x, headerY);
    		
    		headerY += 19;
    	}
    };

    this.setOrder = function(order) {
    	borderOrder = m_brkBackground.setOrder(m_brkBorder.setOrder(order + 1));
    	var titleBackOrder = borderOrder + 1;
    	var titleOrder     = titleBackOrder + 1;
    	var arrowOrder     = titleOrder + 1;
    	var coverOrder     = arrowOrder + 1; 
    	var rootItems      = getRootItems();
    	
    	for (var j = 0; j < m_ddWrappers.length; j++) {
    			m_ddWrappers[j].ddWrapper.setOrder(titleBackOrder + 100);	
    	}
    	
    	for (var i = 0; i < m_menuItems.length; i++) {
    		if (m_menuItems[i].parentName == '') {
    			m_menuItems[i].titleBack.setOrder(titleBackOrder);
	    		m_menuItems[i].title.setOrder(titleOrder);
	    		m_menuItems[i].cover.setOrder(coverOrder);
	    		m_menuItems[i].arrowBack.setOrder(arrowOrder);
    		} else {
    			m_menuItems[i].titleBack.setOrder(titleBackOrder + 101);
	    		m_menuItems[i].title.setOrder(titleOrder + 101);
	    		m_menuItems[i].cover.setOrder(coverOrder + 101);
	    		m_menuItems[i].arrowBack.setOrder(arrowOrder + 101);
    		}
    	}
    	
    	return coverOrder + 1;
    };

    this.show = function() {
        m_brkBackground.show();
        m_brkBorder.show();
        showRootItems();
    };
    
};

function TWindow(title, margin, padding, layout, undertext) {
	var m_objects    = new Array();
	var m_layout     = (layout === undefined || layout == null) ? new TVerticalLayout((margin === undefined || margin == null) ? 15 : margin, (padding === undefined || padding == null) ? 7 : padding) : layout;
	var m_visible    = false;
	var m_parent     = null;
	var m_ajaxPanel  = new TAjaxPanel();
	var m_this       = this;

	m_objects[0] = new TBrick('windowTitleLeft');
	m_objects[1] = new TBrick('windowTitleMiddle');
	m_objects[2] = new TBrick('windowTitleRight');
	m_objects[3] = new TBrick('windowBodyLeft');
	m_objects[4] = new TBrick('windowBodyMiddle');
	m_objects[5] = new TBrick('windowBodyRight');
	m_objects[6] = new TBrick('windowBottomLeft');
	m_objects[7] = new TBrick('windowBottomMiddle');
	m_objects[8] = new TBrick('windowBottomRight');
	m_objects[9] = new TText(title, 'windowTitle');
	m_objects[10] = (undertext === undefined || undertext == null) ? null : new TText(undertext, 'smallFixed');
	
	if (m_objects[10] != null) {
		m_objects[10].setColor('#808080');
	}

	this.add = function(object) {
		if (m_layout != null) {
			m_layout.add(object);
		}
	};
	
	this.getHeight = function() {
		return 35 + (m_layout == null ? 0 : m_layout.getHeight()) + ((m_objects[10] == null) ? 0 : (m_objects[10].getHeight() + 5));
	};

	this.getLayout = function() {
		return m_layout;
	};

	this.getWidth = function() {
		var width        = 18 + (m_layout == null ? 0 : m_layout.getWidth());
		var widthByTitle = m_objects[9].getWidth() + 28;
		var widthByUndertext = (m_objects[10] == null) ? 0 : m_objects[10].getWidth() + 50;
		
		return widthByTitle > width ? (widthByTitle > widthByUndertext ? widthByTitle : widthByUndertext) : (width > widthByUndertext ? width : widthByUndertext);
	};
	
	this.hide = function() {
		if (m_visible) {
			for (var i = 0, count = m_objects.length; i < count; i++) {
				if (m_objects[i] != null) {
					m_objects[i].hide();
				}
			}
		
			if (m_layout != null) {
				m_layout.hide();
			}
		
			m_visible = false;
		}
	};

	this.isVisible = function() {
		return m_visible;
	};

	this.move = function(x, y) {
		var bodyHeight  = m_layout == null ? 0 : m_layout.getHeight();
		var bodyWidth   = m_layout == null ? 0 : m_layout.getWidth();
		var layoutWidth = bodyWidth;

		if (bodyWidth < m_objects[9].getWidth() + 10) {
			bodyWidth = m_objects[9].getWidth() + 10;
		}

		m_objects[0].move(x, y);
		m_objects[1].move(x + 9, y);
		m_objects[1].setWidth(bodyWidth);
		m_objects[2].move(x + 9 + bodyWidth, y);
		m_objects[3].move(x, y + 26);
		m_objects[3].setHeight(bodyHeight);
		m_objects[4].move(x + 9, y + 26);
		m_objects[4].setSize(bodyWidth, bodyHeight);
		m_objects[5].move(x + 9 + bodyWidth, y + 26);
		m_objects[5].setHeight(bodyHeight);
		m_objects[6].move(x, y + 26 + bodyHeight);
		m_objects[7].move(x + 9, y + 26 + bodyHeight);
		m_objects[7].setWidth(bodyWidth);
		m_objects[8].move(x + 9 + bodyWidth, y + 26 + bodyHeight);
		m_objects[9].move(x + 14, y + (24 - m_objects[9].getHeight()) / 2);

		if (m_objects[10] != null) {
			m_objects[10].move(x + 9 + bodyWidth / 2 - m_objects[10].getWidth() / 2, y + 40 + bodyHeight);
		}

		if (m_layout != null) {
			if (layoutWidth < bodyWidth) {
				m_layout.move(x + 9 + (bodyWidth - layoutWidth) / 2, y + 26);
			} else {
				m_layout.move(x + 9, y + 26);
			}
		}

		m_ajaxPanel.setSize(bodyWidth, bodyHeight);
		m_ajaxPanel.move(x + 9, y + 26);
	};

	this.refresh = function(mode) {
		mode = (mode === undefined || mode == null) ? 1 : mode;
		if (mode == 0) {
			resize(m_this, getViewportHeight(), getViewportWidth());
		} else {
			hideModal();
			showModal(m_this);
		}
	};
	
	this.setAjaxOff = function() {
		m_ajaxPanel.hide();
	};
	
	this.setAjaxOn = function() {
		m_ajaxPanel.show();
	};
	
	this.setOrder = function(order) {
		order += 1;

		for (var i = 0; i < 9; i++) {
			m_objects[i].setOrder(order);
		}

		m_objects[9].setOrder(++order);
		
		if (m_objects[10] != null) {
			m_objects[10].setOrder(order++);
		}
		
		if (m_layout != null) {
			order = m_layout.setOrder(order);
		}

		return m_ajaxPanel.setOrder(order);
	};
	
	this.setParent = function(parent) {
		m_parent = parent;
	};

	this.show = function() {
		if (!m_visible) {
			for (var i = 0, count = m_objects.length; i < count; i++) {
				if (m_objects[i] != null) {
					m_objects[i].show();
				}
			}
		
			if (m_layout != null) {
				m_layout.show();
			}
		
			m_visible = true;
		}
	};
	
	this.setTitle = function(title) {
		m_objects[9].setText(title);
	};
};

if (!window.console) console = { log: function () { } };