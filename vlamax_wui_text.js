// A rich text editor developed by Maxim Alkhilou 2014

var TSizeConverter = (function() { 
	return {
		convertFontSizeToEM: function(size) {
			var value = '';
			switch(size) {
				case '1': 
					value = '0.63em';
					break;
				case '2':
					value = '0.82em';
					break;
				case '3':
					value = '1.0em';
					break;
				case '4':
					value = '1.13em';
					break;
				case '5':
					value = '1.5em';
					break;
				case '6':
					value = '2em';
					break;
				case '7':
					value = '3em';
					break;
			}
			return value;
		},
		
		convertFontSizeToPX: function(size) {
			var value = '';
			switch(size) {
				case '1': 
					value = '9px';
					break;
				case '2':
					value = '12px';
					break;
				case '3':
					value = '14px';
					break;
				case '4':
					value = '18px';
					break;
				case '5':
					value = '24px';
					break;
				case '6':
					value = '30px';
					break;
				case '7':
					value = '48px';
					break;
			}
			return value;
		},
		
		convertPXtoFontSize: function(size) {
			if (size == '8px' || size == '9px' || size == '10px') {
				size = '1';
			} else if (size == '11px' || size == '12px' || size == '13px') {
				size = '2';
			} else if (size == '14px' || size == '16px') {
				size = '3';
			} else if (size == '18px' || size == '20px') {
				size = '4';
			} else if (size == '22px' || size == '24px' || size == '26') {
				size = '5';
			} else if (size == '28px' || size == '30px' || size == '32px') {
				size = '6';
			} else if (size == '48px' || size == '72px') {
				size = '7';
			}
			return size;
		}
	};
})();

function TEditableBrick(parent) {
	var m_brkEditor = new TBrick('editableBrick', parent);
	var m_this = this;
	
	m_brkEditor.getElement().contentEditable = true;
	
	var getCellIndex = function(td) {
		var index = 0;
		var tempIndex = 0;
		var node = td.previousSibling;
		var myColSpan = 0;
		
		while (node != null) {
			var nodeColSpan = node.getAttribute('colspan');
			nodeColSpan = (nodeColSpan === undefined || nodeColSpan == null || nodeColSpan == '0') ? 0 : parseInt(nodeColSpan);
			if (nodeColSpan != 0) { myColSpan += nodeColSpan - 1; }
			index++;
			node = node.previousSibling;
		}
		
		var rowIndex = 2;
		var myLength = td.parentNode.childNodes.length;
		tr = td.parentNode.previousSibling;
		
		while (tr != null) {
			var rowLength = tr.childNodes.length;
			var length = 0;
			if (myLength == rowLength) {
				length = index;
			} else if (myLength < rowLength) {
				if (index != 0) {
					length = index + (rowLength - myLength);
				} else {
					var tempRow = tr;
					var tempRowIndex = 2;
					while (tempRow != null) {
						var rowSpan = tr.childNodes[0].getAttribute('rowspan');
						rowSpan = (rowSpan === undefined || rowSpan == null || rowSpan == '0' || rowSpan == '1') ? 0 : parseInt(rowSpan);
						if (rowSpan != 0 && rowSpan >= tempRowIndex) {
							length = rowLength - myLength;
							break;
						}
						tempRow = tempRow.previousSibling;
						tempRowIndex++;
					}
				}
			} else {
				if (index <= rowLength) {
					length = index;
				} else {
					length = rowLength;
				}
			}
			
			for (var i = 0; i < length; i++) {
				var rowSpan = tr.childNodes[i].getAttribute('rowspan');
				rowSpan = (rowSpan === undefined || rowSpan == null || rowSpan == '0' || rowSpan == '1') ? 0 : parseInt(rowSpan);
				if (rowSpan != 0 && rowSpan >= rowIndex) {
					var colSpan = tr.childNodes[i].getAttribute('colspan');
					colSpan = (colSpan === undefined || colSpan == null || colSpan == '0') ? 0 : parseInt(colSpan);
					if (colSpan != 0) {
						tempIndex += colSpan;
					} else {
						tempIndex++;
					}
				}
			}
			tr = tr.previousSibling;
			rowIndex++;
		}
		index += tempIndex + myColSpan;
		var indexes = new Array();
		indexes.push(index);
		var myColSpan = td.getAttribute('colspan');
		myColSpan = (myColSpan === undefined || myColSpan == null || myColSpan == '0') ? 0 : parseInt(myColSpan) - 1;
		for (var i = 0; i < myColSpan; i++) {
			indexes.push(++index);
		}
		return indexes;
	};
	
	var getCurrentCell = function() {
		var sel = getSelection();
		var range = getRange(sel);
		var td = range.startContainer.parentNode;
		while (td.nodeName != 'TD') {
			td = td.parentNode;
			if (td.nodeName == 'HTML') { return null; }
		}
		return td;
	};
	
	var getNodeBackColor = function(node) {
		var color = null;
		if (node.nodeName != 'HTML') {
			if (isIE() || isIE11()) {
				if (node.nodeName !='FONT') {
					color = getNodeBackColor(node.parentNode);
				} else {
					return node.currentStyle.backgroundColor;
				}
			} else if (isFF()) {
				if (node.nodeName !='SPAN') {
					color = getNodeBackColor(node.parentNode);
				} else {
					return node.ownerDocument.defaultView.getComputedStyle(node, null).backgroundColor;
				}
			} else {
				var c = node.ownerDocument.defaultView.getComputedStyle(node, null).backgroundColor;
				if (c == 'rgba(0, 0, 0, 0)' || c == 'transparent' || c == '') {
					color = getNodeBackColor(node.parentNode);
				} else {
					return c;
				}
			}
		}
		return color;
	};
	
	var getParentNode = function(parentTagName, range) {
		parentTagName = parentTagName.toUpperCase();
		try {
			if (!isIE()) {
				var node = range.startContainer;	
				var pos = range.startOffset;
				if(node.nodeType != 3) { node = node.childNodes[pos]; }
				while (node.tagName != "HTML") {
			  		if (node.tagName == parentTagName){
			  			return node;
			  		} 
			  		node = node.parentNode;
			 	}
			}
			else {
				var elm = null;
				elm = (range.length > 0) ? range.item(0): range.parentElement();
				while (elm.tagName != "HTML") {
			  		if (elm.tagName == parentTagName){
			  			return elm;
			  		} 
			  		elm = elm.parentNode;
			 	}					
				return null;
			}
		}
		catch(e) {
			return null;
		}
	};

	var getRange = function(sel) {
		return sel.createRange ? sel.createRange() : sel.getRangeAt(0);
	};
	
	var getRangeTag = function(range) {
		try {
			if (!isIE()) {
				var node = range.startContainer;	
				var pos = range.startOffset;
				if (node.nodeType != 3) { node = node.childNodes[pos]; }
				
				if (node.nodeName && node.nodeName.search(/#/) != -1) {
					return node.parentNode;
				}
				return node;
			} else {
				if (range.length > 0) {
					return range.item(0);
				}
				else if (range.parentElement()) {
					return range.parentElement();
				}
			}
			return null;
		}
		catch(e) {
			return null;
		}
	};
	
	var getSelection = function() {
		var sel = null;
		if (window.getSelection){
			sel = window.getSelection();
		}
		else if (document.getSelection) {
			sel = document.getSelection();
		}
		else if (document.selection) {
			sel = document.selection;
		}
		return sel;
	};

	var getTextRange = function(element) {
		var range = element.parentTextEdit.createTextRange();
		range.moveToElementText(element);
		return range;
	};

	var insertNodeAtSelection = function(node) {
		var sel = getSelection();
		var range = getRange(sel);
		sel.removeAllRanges();
		range.deleteContents();
		var container = range.startContainer;
		var pos = range.startOffset;
		range = document.createRange();
		if (container.nodeType == 3 && node.nodeType == 3) {
			container.insertData(pos, node.data);
			range.setEnd(container, pos + node.length);
			range.setStart(container, pos + node.length);
		} else {
			var afterNode;	
			var beforeNode;
			if (container.nodeType == 3) {
				var textNode = container;
				container = textNode.parentNode;
				var text = textNode.nodeValue;
				var textBefore = text.substr(0, pos);
				var textAfter = text.substr(pos);
				beforeNode = document.createTextNode(textBefore);
				afterNode = document.createTextNode(textAfter);
				container.insertBefore(afterNode, textNode);
				container.insertBefore(node, afterNode);
				container.insertBefore(beforeNode, node);
				container.removeChild(textNode);
			} 
			else {
				afterNode = container.childNodes[pos];
				container.insertBefore(node, afterNode);
			}
			
			try {
				range.setEnd(afterNode, 0);
				range.setStart(afterNode, 0);
			}
			catch(e) {
				alert(e);
			}
		}
		sel.addRange(range);
	};
	
	var intersectArrays = function(a, b) {
		var ai = 0, bi = 0;
		var result = new Array();
		
		while( ai < a.length && bi < b.length )
		{
		   if (a[ai] < b[bi] ) { ai++; }
		   else if (a[ai] > b[bi] ) { bi++; }
		   else /* they're equal */
		   {
		     result.push(a[ai]);
		     ai++;
		     bi++;
		   }
		}
		
		return result.length > 0;
	};
	
	var removeNode = function(node, deleteParent) {
		parent = node.parentNode;
		parent.removeChild(node);
		if (!parent.hasChildNodes() && deleteParent) {
			removeNode(parent);
		}
	};
	
	var removeNodeAttribute = function(node, attr) {
		node.removeAttribute(attr, false);
	};
	
	var setNodeAttribute = function(node, attr, value) {
		if (attr.toLowerCase() == "style") {
			setNodeStyleAttribute(node, value);
		}
		else {
			node.setAttribute(attr, value);
		}
    };
    
    var setNodeStyleAttribute = function(node, value) {
    	var styles = value.split(";");
		var pos;
		for (var i = 0; i < styles.length; i++) {
			var attributes = styles[i].split(":");
			if (attributes.length == 2) {
				try {
					var attr = trim(attributes[0]);
					while ((pos = attr.search(/-/)) != -1) {
						var strBefore = attr.substring(0, pos);
						var strToUpperCase = attr.substring(pos + 1, pos + 2);
						var strAfter = attr.substring(pos + 2, attr.length);
						attr = strBefore + strToUpperCase.toUpperCase() + strAfter;
					}
					var value = trim(attributes[1]).toLowerCase();
					node.style[attr] = value;
				}
				catch(e) {
					alert(e);
				}
			}
		}
    };
	
	var trim = function(str) {
		return str.replace(/^\s*|\s*$/g,"");
	};
	
	this.addEvent = function(event, callback) {
		m_brkEditor.addEvent(event, callback);
	};
	
	this.appendChild = function(child) {
		m_brkEditor.appendChild(child);
	};
	
	this.canMergeCellDown = function() {
		var td = getCurrentCell();
		if (td != null) {
			var tr = td.parentNode;
			var rowSpan = td.getAttribute('rowspan');
			if (rowSpan !== undefined && rowSpan != null && rowSpan != '0' && rowSpan != '1') {
				for (var i = 0; i < parseInt(rowSpan) - 1; i++) {
					tr = tr.nextSibling;
				}
			} 
			if (tr != null) {
				if (tr.nextSibling !== undefined && tr.nextSibling != null) {
					var numCells = getCellIndex(td);
					var colSpan1 = td.getAttribute('colspan');
					colSpan1 = (colSpan1 === undefined || colSpan1 == null || colSpan1 == '0' || colSpan1 == '1') ? 0 : parseInt(colSpan1);
					for (var i = 0; i < tr.nextSibling.childNodes.length; i++) {
						if (intersectArrays(numCells, getCellIndex(tr.nextSibling.childNodes[i]))) {
							var colSpan2 = tr.nextSibling.childNodes[i].getAttribute('colspan');
							colSpan2 = (colSpan2 === undefined || colSpan2 == null || colSpan2 == '0' || colSpan2 == '1') ? 0 : parseInt(colSpan2);
							if (colSpan1 == colSpan2) {
								return true;
							} else {
								return false;
							}
						}
					}
				} else {
					return false;
				}	
			} else {
				return false;
			}
		}
		return false;
	};
	
	this.canMergeCellRight = function() {
		var td = getCurrentCell();
		if (td != null) {
			if (td.nextSibling !== undefined && td.nextSibling != null) {
				var rowSpan1 = td.getAttribute('rowspan');
				rowSpan1 = (rowSpan1 === undefined || rowSpan1 == null || rowSpan1 == '0' || rowSpan1 == '1') ? 0 : parseInt(rowSpan1);
				var rowSpan2 = td.nextSibling.getAttribute('rowspan');
				rowSpan2 = (rowSpan2 === undefined || rowSpan2 == null || rowSpan2 == '0' || rowSpan2 == '1') ? 0 : parseInt(rowSpan2);
				if (rowSpan1 == rowSpan2) {
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		}
		return false;
	};
	
	this.cellProperties = function() {
		var wndCellProperties = new TCellWindow(getCurrentCell());
		wndCellProperties.show();
	};
	
	this.deleteImage = function(image) {
		if (image !== undefined && image != null && image.nodeName == 'IMG') {
			removeNode(image, false);
		}
	};
	
	this.deleteTable = function(table) {
		if (table === undefined || table == null) {
			var node = getCurrentCell();
			if (node != null) {
				node = node.parentNode.parentNode;
				while (node.nodeName != 'TABLE') {
					node = node.parentNode;
				}
				removeNode(node, true);
			}
		} else {
			removeNode(table, true);
		}
	};
	
	this.deleteTableCell = function(cell) {
		if (cell === undefined || cell == null) {
			var td = getCurrentCell();
			if (td != null) {
				removeNode(td, true);
			}
		} else {
			removeNode(cell, true);
		}
	};
	
	this.deleteTableColumn = function(cell) {
		var td = (cell === undefined || cell == null) ? getCurrentCell() : cell;
		if (td != null) {
			var myIndex = getCellIndex(td);
			var table = td.parentNode.parentNode;
			var tdsToDelete = new Array();
			for (var i = 0; i < table.childNodes.length; i++) {
				var tr = table.childNodes[i];
				for (var j = 0; j < tr.childNodes.length; j++) {
					if (intersectArrays(myIndex, getCellIndex(tr.childNodes[j]))) {
						tdsToDelete.push(tr.childNodes[j]);
					}
				}
			}
			while (tdsToDelete.length) {
				td = tdsToDelete.pop();
				removeNode(td, true);
			}
		}
	};
	
	this.deleteTableRow = function(row) {
		if (row === undefined || row == null) {
			var td = getCurrentCell();
			if (td != null) {
				removeNode(td.parentNode, true);
			}
		} else {
			removeNode(row, true);
		}
	};
	
    this.destroy = function() {
        m_brkEditor.destroy();
    };

    this.disable = function() {
        m_brkEditor.disable();
    };

	this.enable = function() {
	    m_brkEditor.enable();
	};

	this.executeCommand = function(commandName, commandArgument) {
		document.execCommand(commandName, false, commandArgument);
		this.setFocus();
	};

	this.getAlignment = function() {
		return m_brkEditor.getAlignment();
	};

	this.getEditorElement = function() {
		return m_brkEditor.getElement();
	};

	this.getHeight = function() {
		return m_brkEditor.getHeight();
	};
	
	this.getHTML = function() {
		return m_brkEditor.getElement().innerHTML;
	};
	
	this.getSelectedNodeStyle = function() {
		var sel = getSelection();
		var range = getRange(sel);
		var node = range.startContainer;
		if (node.nodeType == 3) {
			var bColor = getNodeBackColor(node.parentNode);
			bColor = (bColor === undefined || bColor == null) ? '#FFFFFF' : bColor;
			if (isIE() || isIE11()) {
				return { backColor: bColor, color: node.parentNode.currentStyle.color,
					 fontFamily: node.parentNode.currentStyle.fontFamily, fontSize: node.parentNode.currentStyle.fontSize,
					 fontStyle: node.parentNode.currentStyle.fontStyle, fontWeight: node.parentNode.currentStyle.fontWeight,
					 textDecoration: node.parentNode.currentStyle.textDecoration };
			} else if (document.defaultView && document.defaultView.getComputedStyle) { // ff
				var el = node.parentNode;
				var view = node.parentNode.ownerDocument.defaultView;
				return { backColor: bColor, color: view.getComputedStyle(el, null).color,
					 fontFamily: view.getComputedStyle(el, null).fontFamily, fontSize: view.getComputedStyle(el, null).fontSize,
					 fontStyle: view.getComputedStyle(el, null).fontStyle, fontWeight: view.getComputedStyle(el, null).fontWeight,
					 textDecoration: view.getComputedStyle(el, null).textDecoration };
			} else {
				return { backColor: node.parentNode.style.backgroundColor, color: node.parentNode.style.color,
					 fontFamily: node.parentNode.style.fontFamily, fontSize: node.parentNode.style.fontSize,
					 fontStyle: node.parentNode.style.fontStyle, fontWeight: node.parentNode.style.fontWeight,
					 textDecoration: node.parentNode.style.textDecoration };
			}
		}
		return null; 
	};
	
	this.getText = function() {
		return m_brkEditor.getElement().innerText;
	};
	
	this.getWidth = function() {
		return m_brkEditor.getWidth();
	};
	
	this.getX = function() {
		return m_brkEditor.getX();
	};
	
	this.getY = function() {
		return m_brkEditor.getY();
	};
	
	this.hasColumnOperations = function(td) {
		td = (td === undefined || td == null) ? getCurrentCell() : td;
		var result = new Array();
		var before = true, after = true, candelete = true;
		if (td != null) {
			var myIndex = getCellIndex(td);
			var table = td.parentNode.parentNode;
			for (var i = 0; i < table.childNodes.length; i++) {
				if (table.childNodes[i] !== td.parentNode) {
					var tr = table.childNodes[i];
					var currentIndex, lastIndex;
					var hasIntersect = false;
					for (var j = 0; j < tr.childNodes.length; j++) {
						currentIndex = getCellIndex(tr.childNodes[j]);
						if (intersectArrays(myIndex, currentIndex)) {
							lastIndex = currentIndex;
							if (!hasIntersect) {
								hasIntersect = true;
								if (myIndex[0] != currentIndex[0]) {
									before = false;
									candelete = false;
								}
							}
						}
					}
					if (lastIndex === undefined || myIndex[myIndex.length - 1] != lastIndex[lastIndex.length - 1]) {
						after = false;
						candelete = false;
					}
				}
			}
			result.push({ before: before, after: after, candelete: candelete });
			return result;
		}
		return null;
	};
	
	this.hasRowOperations = function(td) {
		td = (td === undefined || td == null) ? getCurrentCell() : td;
		var result = new Array();
		var before = true, after = true, candelete = true;
		if (td != null) {
			var tr = td.parentNode;
			for (var i = 0; i < tr.childNodes.length; i++) {
				var rowspan = tr.childNodes[i].getAttribute('rowspan');
				if (rowspan !== undefined && rowspan != null && rowspan != '0' && rowspan != '1') {
					after = false;
					candelete = false;
				} else if (i != tr.childNodes.length - 1) {
					var myIndex = getCellIndex(tr.childNodes[i]);
					var siblingIndex = getCellIndex(tr.childNodes[i + 1]);
					if (siblingIndex[0] - myIndex[myIndex.length - 1] > 1) {
						before = false;
						candelete = false;
						if (after) {
							if (tr.nextSibling != null) {
								myIndex = getCellIndex(tr.nextSibling.childNodes[i]);
								siblingIndex = getCellIndex(tr.nextSibling.childNodes[i + 1]);
								if (siblingIndex[0] - myIndex[myIndex.length - 1] > 1) {
									after = false;
								}
							}
						}
					}
				}
			}
			result.push({ before: before, after: after, candelete: candelete });
			return result;
		}
		return null;
	};
	
	this.hide = function() {
		m_brkEditor.hide();
	};
	
	this.insertAudio = function(src1, src2) {
		var sel = getSelection();
		var range = getRange(sel);
		
		var audio = document.createElement('AUDIO');
		var source1 = document.createElement('SOURCE');
		var embed = document.createElement('EMBED');
		
		setNodeAttribute(audio, "controls", true);
		setNodeAttribute(source1, "src", src1);
		setNodeAttribute(source1, "type", "audio/mpeg");
		setNodeAttribute(embed, "src", src1);
		setNodeAttribute(embed, "height", '50');
		setNodeAttribute(embed, "width", '100');
		
		audio.appendChild(source1);
		
		if (src2 !== undefined && src2 != null) {
			var source2 = document.createElement('SOURCE');
			setNodeAttribute(source2, "src", src2);
			setNodeAttribute(source1, "type", "audio/ogg");
			audio.appendChild(source2);
		}
		
		audio.appendChild(embed);
		
		if (isIE() && range.pasteHTML) {
			range.pasteHTML(audio.outerHTML); 
		}
		else {
			range.insertNode(document.createElement('BR'));
			range.insertNode(audio);
			range.insertNode(document.createElement('BR'));
		}
	};
	
	this.insertHTML = function(html) {
		m_brkEditor.setText(html);
	};
	
	this.insertImage = function(align, alt, border, height, hspace, src, vspace, width, crossorigin) {
		var sel = getSelection();
		var range = getRange(sel);
		var img = getParentNode("img", range);
		
		var update = (img == null) ? false : true;
		if (!update) {
			img = document.createElement("img");
		}
		
		setNodeAttribute(img, "src", src);
		setNodeAttribute(img, "style", "width:" + width + ";height:" + height);
		if (align != "Not Set") { setNodeAttribute(img, "align", align); } else { removeNodeAttribute(img, "align"); }
		setNodeAttribute(img, "border", border);
		setNodeAttribute(img, "alt", alt);
		setNodeAttribute(img, "hspace", hspace);
		setNodeAttribute(img, "vspace", vspace);
		if (crossorigin !== undefined || crossorigin != null) { setNodeAttribute(img, "crossorigin", crossorigin); }
		
		if (!update) {
			if (isIE() && range.pasteHTML) {
				range.pasteHTML(img.outerHTML);
			}
			else {
				//insertNodeAtSelection(img);
				range.insertNode(document.createElement('BR'));
				range.insertNode(img);
				range.insertNode(document.createElement('BR'));
			} 
		}   
	};
	
	this.insertLink = function(name, href, style) {
		var sel = getSelection();
		var range = getRange(sel);
		var lin = null;
		
		if (isIE()) {
			if(sel.type == "Control" && range.length == 1) {	
				range = getTextRange(range(0));
				range.select();
			}
		}

		lin = getParentNode("a", range);
				
		var update = (lin == null) ? false : true;
		if (!update) {
			lin = document.createElement("a");
		}
		
		setNodeAttribute(lin, "href", href);
		setNodeAttribute(lin, "name", name);
		setNodeAttribute(lin, "style", style);
		
		if (!update) { 
			if (isIE()) {	
				if (range.select) {
					range.select();
					lin.innerHTML = range.htmlText;
					range.pasteHTML(lin.outerHTML);
				} else {
					if (range.cloneContents().textContent != '') {
						lin.innerHTML = range.cloneContents().textContent;
					} else {
						lin.innerHTML = name;
					}
					range.deleteContents();
					range.insertNode(lin);
				}  
			} 
			else {			
				/*var node = range.startContainer;	
				var pos = range.startOffset;
				if (node.nodeType != 3) { node = node.childNodes[pos]; }
				if (node !== undefined && node != null && node.tagName != 'BR') {
					lin.appendChild(node); 
				} else {
					lin.innerHTML = sel;
				}
				if (lin.innerHTML == '') { lin.innerHTML = name; }
				insertNodeAtSelection(lin);*/
				if (range.cloneContents().textContent != '') {
					lin.innerHTML = range.cloneContents().textContent;
				} else {
					lin.innerHTML = name;
				}
				range.deleteContents();
				range.insertNode(lin);
			}	
		}
	};
	
	this.insertTable = function(cols, rows, align, cellPadding, cellSpacing, style, width, table) {
		var sel = getSelection();
		var range = getRange(sel);
		
		if (isIE()) {
			if (sel.type == "Control" && range.length == 1) {	
				range = getTextRange(range(0));
				range.select();
			}
		}
		
		if (table === undefined || table == null) {
			table = document.createElement('TABLE');
			
			for (var i = 0; i < rows; i++) {
				var tr = document.createElement("tr");
				for (var j = 0; j < cols; j++){
					var td = document.createElement("td");
					td.innerHTML = "&nbsp;";
					setNodeAttribute(td, "style", style);
					tr.appendChild(td);	
				}
				table.appendChild(tr);
			}
			
			if (isIE() && range.pasteHTML) {
				range.pasteHTML(table.outerHTML);
			}
			else {
				range.insertNode(document.createElement('BR'));
				range.insertNode(table);
				range.insertNode(document.createElement('BR'));
			}
		} 
		
		setNodeAttribute(table, "style", style);
		if (align != null) {
			setNodeAttribute(table, "align", align);	
		}
		setNodeAttribute(table, "cellpadding", cellPadding);
		setNodeAttribute(table, "cellspacing", cellSpacing);
		setNodeAttribute(table, "width", width);
	};
	
	this.insertTableCell = function(mode, node) {
		if (node === undefined || node == null) { node = getCurrentCell(); }
		if (node != null) {
			var style = node.getAttribute('style');
			var td = document.createElement("td");
			td.innerHTML = "&nbsp;";
			if (style != null) { setNodeAttribute(td, "style", style); }
			if (mode == 'before') {
				return node.parentNode.insertBefore(td, node);
			} else {
				return node.parentNode.insertBefore(td, node.nextSibling);
			}
		}
	};
	
	this.insertTableColumn = function(mode, node) {
		if (node === undefined || node == null) { node = getCurrentCell(); }
		if (node != null) {
			var table = node.parentNode.parentNode;
			myIndex = getCellIndex(node);
			for (var i = 0; i < table.childNodes.length; i++) {
				var tr = table.childNodes[i];
				var lastTd = null;
				var hasIntersect = false;
				for (var j = 0; j < tr.childNodes.length; j++) {
					if (intersectArrays(myIndex, getCellIndex(tr.childNodes[j]))) {
						lastTd = tr.childNodes[j];
						if (!hasIntersect && mode =='before') {
							hasIntersect = true;
							this.insertTableCell('before', tr.childNodes[j]);
						}
					}
				}
				if (lastTd != null && mode == 'after') {
					this.insertTableCell('after', lastTd);
				}
			}
		}
	};
	
	this.insertTableRow = function(mode, node) {
		if (node === undefined || node == null) { node = getCurrentCell(); }
		if (node != null) {
			var style = node.getAttribute('style');
			var tr;
			if (node.nodeName == 'TD') {
				tr = node.parentNode;
			} else {
				tr = node;
			}
			var table = tr.parentNode;
			var numCells = 0;
			for (var i = 0; i < table.childNodes[0].childNodes.length; i++) {
				var colspan = table.childNodes[0].childNodes[i].getAttribute('colspan');
				colspan =  (colspan == null) ? 0 : parseInt(colspan);
				if (colspan != 0) { numCells += colspan; } else { numCells++; }
			}
			var newTr = document.createElement('TR');
			for (var i = 0; i < numCells; i++) {
				var td = newTr.insertCell(0);
				if (style != null) { setNodeAttribute(td, "style", style); }
				td.innerHTML = '&nbsp;';
			}
			if (mode == 'before') {
				return table.insertBefore(newTr, tr);
			} else {
				return table.insertBefore(newTr, tr.nextSibling);
			}
		}
	};
	
	this.insertText = function(text) {
		m_brkEditor.getElement().innerText = text;
	};
	
	this.insertVideo = function(src1, src2, height, width) {
		var sel = getSelection();
		var range = getRange(sel);
		
		var video = document.createElement('VIDEO');
		var source1 = document.createElement('SOURCE');
		var embed = document.createElement('EMBED');
		
		setNodeAttribute(video, "controls", true);
		setNodeAttribute(video, "height", height);
		setNodeAttribute(video, "width", width);
		setNodeAttribute(source1, "src", src1);
		setNodeAttribute(source1, "type", "video/mp4");
		setNodeAttribute(embed, "src", src1);
		setNodeAttribute(embed, "height", height);
		setNodeAttribute(embed, "width", width);
		
		video.appendChild(source1);
		
		if (src2 !== undefined && src2 != null) {
			var source2 = document.createElement('SOURCE');
			setNodeAttribute(source2, "src", src2);
			setNodeAttribute(source1, "type", "video/ogg");
			video.appendChild(source2);
		}
		
		video.appendChild(embed);
		
		if (isIE() && range.pasteHTML) {
			range.pasteHTML(video.outerHTML); 
		}
		else {
			range.insertNode(document.createElement('BR'));
			range.insertNode(video);
			range.insertNode(document.createElement('BR'));
		}
	};
	
	this.isVisible = function() {
		return m_brkEditor.isVisible();
	};

	this.mergeCells = function(mode) {
		var td = getCurrentCell();
		if (td != null) {
			if (mode == 'right') {
				var txt = td.nextSibling.innerText;
				var siblingColSpan = td.nextSibling.getAttribute('colspan');
				this.deleteTableCell(td.nextSibling);
				td.innerText = td.innerText + ' ' + txt;
				var colSpan = td.getAttribute('colspan');
				if (colSpan === undefined || colSpan == null || colSpan =='0' || colSpan =='1') {
					if (siblingColSpan === undefined || siblingColSpan == null || siblingColSpan == '0') { setNodeAttribute(td, 'colspan', '2'); } else { setNodeAttribute(td, 'colspan', parseInt(siblingColSpan) + 1); }
				} else {
					if (siblingColSpan === undefined || siblingColSpan == null || siblingColSpan == '0') { setNodeAttribute(td, 'colspan', parseInt(colSpan) + 1); } else { setNodeAttribute(td, 'colspan', parseInt(siblingColSpan) + parseInt(colSpan)); }
				}
			} else {
				var numCells = getCellIndex(td);
				var tr = td.parentNode.nextSibling;
				var rowSpan = td.getAttribute('rowspan');
				rowSpan = (rowSpan === undefined || rowSpan == null || rowSpan =='0' || rowSpan =='1') ? 0 : parseInt(rowSpan);
				for (var i = 0; i < rowSpan - 1; i++) {
					tr = tr.nextSibling;
				}
				var siblingRowSpan = 0;
				var txt = '';
				for (var i = 0; i < tr.childNodes.length; i++) {
					if (intersectArrays(numCells, getCellIndex(tr.childNodes[i]))) {
						siblingRowSpan = tr.childNodes[i].getAttribute('rowspan');
						txt = tr.childNodes[i].innerText;
						this.deleteTableCell(tr.childNodes[i]);
						if (rowSpan == 0) {
							if (siblingRowSpan === undefined || siblingRowSpan == null || siblingRowSpan == '0') { setNodeAttribute(td, 'rowspan', '2'); } else { setNodeAttribute(td, 'rowspan', parseInt(siblingRowSpan) + 1); }
						} else {
							if (siblingRowSpan === undefined || siblingRowSpan == null || siblingRowSpan == '0') { setNodeAttribute(td, 'rowspan', rowSpan + 1); } else { setNodeAttribute(td, 'rowspan', parseInt(siblingRowSpan) + rowSpan); }
						}
						break;
					}
				}
				td.innerText = td.innerText + ' ' + txt;
			}
		}
	};
	
	this.move = function(x, y) {
		m_brkEditor.move(x, y);
	};

	this.queryCommandEnabled = function(cmd) {
		return document.queryCommandEnabled(cmd);
	};
	
	this.queryCommandState = function(cmd) {
		return document.queryCommandState(cmd);
	};

	this.removeChild = function(child) {
	    m_brkEditor.removeChild(child);
	};

	this.removeEvent = function(event, callback) {
	    m_brkEditor.removeEvent(event, callback);
	};

	this.restoreSelection = function(selection) {
		if (window.getSelection) {
			var sel = getSelection();
			sel.removeAllRanges();
			sel.addRange(selection);
		} else {
			selection.select();
		}
	};

	this.saveSelection = function() {
		return getRange(getSelection());
	};

	this.setBackground = function(background) {
		m_brkEditor.setBackground(background);
	};

	this.setBackgroundImage = function(image) {
		m_brkEditor.setBackgroundImage(image);
	};
	
	this.setBackgroundPosition = function(position) {
		m_brkEditor.setBackgroundPosition(position);
	};

	this.setBackgroundSize = function(mode) {
		m_brkEditor.setBackgroundSize(mode);
	};

	this.setBorder = function(color, left, right, top, bottom, roundedCorners) {
	    m_brkEditor.setBorder(color, left, right, top, bottom, roundedCorners);
	};
		
	this.setCursor = function(cursor) {
		m_brkEditor.setCursor(cursor);
	};
	
	this.setFocus = function() {
		m_brkEditor.setFocus();
	};
	
	this.setHeight = function(height) {
		m_brkEditor.setHeight(height);
	};
    
    this.setOnClick = function(callback) {
    	m_brkEditor.getElement().onmouseup = callback;
    };
    
    this.setOnDblClick = function(callback) {
    	m_brkEditor.getElement().ondblclick = callback;
    };
    
    this.setOnKeyUp = function(callback) {
    	m_brkEditor.getElement().onkeyup = callback;
    };
    
    this.setOnRightClick = function(callback) {
    	m_brkEditor.getElement().oncontextmenu = callback; 
    };
    
    this.setOrder = function(order) {
		return m_brkEditor.setOrder(order);
	};
	
	this.setOverflow = function(overflow) {
		m_brkEditor.setOverflow(overflow);
	};
	
	this.setOverflowX = function(overflow) {
		m_brkEditor.setOverflowX(overflow);
	};
	
	this.setOverflowY = function(overflow) {
		m_brkEditor.setOverflowY(overflow);
	};
	
	this.setPadding = function(padding) {
		m_brkEditor.setPadding(padding);
	};
    
    this.setSize = function(width, height) {
		m_brkEditor.setSize(width, height);
	};

	this.setTabIndex = function(index) {
	    m_brkEditor.setTabIndex(index);
	};
	
	this.setText = function(text) {
		m_brkEditor.getElement().innerText = text;
	};
	
	this.setWidth = function(width) {
		m_brkEditor.setWidth(width);
	};

	this.setWordWrap = function() {
		m_brkEditor.setWordWrap();
	};
	
	this.setX = function(x) {
		m_brkEditor.setX(x);
	};
	
	this.setY = function(y) {
		m_brkEditor.setY(y);
	};
	
	this.show = function() {
		m_brkEditor.show();
	};
	
	this.splitCell = function(mode) {
		var td = getCurrentCell();
		if (td != null) {
			var myColSpan = td.getAttribute('colspan');
			var myRowSpan = td.getAttribute('rowspan');
			myColSpan = (myColSpan === undefined || myColSpan == null || myColSpan == '0' || myColSpan == '1') ? 0 : parseInt(myColSpan);
			myRowSpan = (myRowSpan === undefined || myRowSpan == null || myRowSpan == '0' || myRowSpan == '1') ? 0 : parseInt(myRowSpan);
			if (mode == 'h') {
				this.insertTableCell('after');
				if (myColSpan != 0) {
					setNodeAttribute(td, 'colspan', myColSpan - 1);
				} else {
					var myIndex = getCellIndex(td);
					var table = td.parentNode.parentNode;
					for (var i = 0; i < table.childNodes.length; i++) {
						if (td.parentNode !== table.childNodes[i]) {
							for (var j = 0; j < table.childNodes[i].childNodes.length; j++) {
								if (intersectArrays(myIndex, getCellIndex(table.childNodes[i].childNodes[j]))) {
									var colspan = table.childNodes[i].childNodes[j].getAttribute('colspan');
									colspan = (colspan === undefined || colspan == null || colspan == '0') ? 0 : parseInt(colspan);
									if (colspan != 0) { setNodeAttribute(table.childNodes[i].childNodes[j], 'colspan', colspan + 1); } else { setNodeAttribute(table.childNodes[i].childNodes[j], 'colspan', '2'); }
									break;
								}
							}
						}
					}
				}
				if (myRowSpan != 0) { td.nextSibling.setAttribute('rowspan', myRowSpan); }
			} else {
				if (myRowSpan != 0) { 
					setNodeAttribute(td, 'rowspan', myRowSpan - 1);
					var numCells = 0;
					var node = td.previousSibling;
					while (node != null && node.nodeName == 'TD') {
						numCells++;
						node = node.previousSibling;
					}
					var tr = td.parentNode;
					for (var i = 0; i < myRowSpan - 1; i++) {
						tr = tr.nextSibling;
					}
					var next = false;
					while (tr.childNodes[numCells] == null && numCells > 0) {
						numCells--;
						next = true;
					}
					if (!next) { node = this.insertTableCell('before', tr.childNodes[numCells]); } else { node = this.insertTableCell('after', tr.childNodes[numCells]); }
					if (myColSpan != 0) { setNodeAttribute(node, 'colspan', myColSpan); }
				} else { 
					var tr = document.createElement('TR');
					var cell = tr.insertCell(0);
					cell.innerHTML = '&nbsp;';
					var style = td.getAttribute('style');
					if (style != null) { setNodeAttribute(cell, 'style', style); }
					if (myColSpan != 0) { setNodeAttribute(cell, 'colspan', myColSpan); }
					td.parentNode.parentNode.insertBefore(tr, td.parentNode.nextSibling);
					for (var i = 0; i < td.parentNode.childNodes.length; i++) {
						if (td.parentNode.childNodes[i] !== td) { 
							var rowspan = td.parentNode.childNodes[i].getAttribute('rowspan');
							if (rowspan === undefined || rowspan == null || rowspan == '0') { setNodeAttribute(td.parentNode.childNodes[i], 'rowspan', '2'); } else { setNodeAttribute(td.parentNode.childNodes[i], 'rowspan', parseInt(rowspan) + 1); }
						}
					}
					tr = td.parentNode.previousSibling;
					var count = 2;
					while (tr != null) {
						for (var i = 0; i < tr.childNodes.length; i++) {
							var rowspan = tr.childNodes[i].getAttribute('rowspan');
							if (rowspan !== undefined || rowspan != null || rowspan != '0' || rowspan != '1') {
								rowspan = parseInt(rowspan);
								if (rowspan >= count) {
									setNodeAttribute(tr.childNodes[i], 'rowspan', parseInt(rowspan) + 1);
								}
							}
						}
						tr = tr.previousSibling;
						count++;
					}
				}
			}
		}
	};
	
	this.tableProperties = function() {
		var table = getCurrentCell();
		while (table.nodeName != 'TABLE') {
			table = table.parentNode;
		}
		
		var wndTable = new TTableWindow(function() { var tblPro = wndTable.getTableProperties();
			if (tblPro != null) {
				m_this.insertTable(tblPro[0].cols, tblPro[0].rows, tblPro[0].align, tblPro[0].cellPadding, tblPro[0].cellSpacing, tblPro[0].style, tblPro[0].width, table);
			}}, true);
			
		wndTable.show();
	};
};

function TLightTextEditor(width, height) {
	var m_alignment            = 0;
	var m_brkBackground        = new TBrick();
	var m_ddlFonts             = new TDropdownList();
	var m_ddlSizes             = new TDropdownList();
	var m_ebrkEditor           = new TEditableBrick();
	var m_fonts                = new Array();
	var m_height               = (height === undefined || height == null) ? 0 : height;
	var m_onValidationCallback = null;
	var m_styles               = new Array();
	var m_tbEdit               = new TToolBar('Icon', '#ECF1F6');
	var m_timerId              = 0;
	var m_width                = (width === undefined || width == null) ? 0 : width;
	var m_wndSelectColor       = null;
	
	m_brkBackground.setBackground('#AFCCEE');
	m_fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Sans Serif', 'Tahoma', 'Times New Roman', 'Verdana'];
	m_styles = { bold: false, color: '#000000', fontFamily: 'Arial', fontSize: '3', italic: false, underline: false };
	
	var extractNodeValue = function(node) {
		var str = node.toString();
		return str.substring(str.indexOf('>') + 1, str.lastIndexOf('<'));
	};
	
	var onForeColorClick = function(cmd) {
		m_wndSelectColor = new TSelectColorWindow(function() { onCommand(cmd, null); });
		m_wndSelectColor.show();
	};
	
	var onCommand = function(cmd, value) {
		if (cmd == 'forecolor') {
			var color = m_wndSelectColor.getSelectedColor();
			if (color != null) {
				m_styles.color = color;
				m_ebrkEditor.executeCommand(cmd, color);
			}
		} else {
			m_ebrkEditor.executeCommand(cmd, value);
		}
	};
	
	var onFontFamilyChanged = function() {
		var font = extractNodeValue(m_ddlFonts.getText());
		onCommand('fontname', font);
		m_styles.fontFamily = font;
	};
	
	var onFontSizeChanged = function() {
		onCommand('fontsize', m_ddlSizes.getText());
		m_styles.fontSize = m_ddlSizes.getText();
	};
	
	var onMouseDown = function(e) {
		e = e ? e : window.event;
		if (e.target.isContentEditable != true) {
			if (e.preventDefault) {
				e.preventDefault();
			} else if (e.returnValue) {
				e.returnValue = false;
			} else {
				return false;
			}
		}
	};
	
	var onValidate = function() {
		if (m_timerId != 0) {
			clearTimeout(m_timerId);
			m_timerId = 0;
		}
		
		m_onValidationCallback();
		
		m_timerId = setTimeout(onValidate, 250);
	};
	
	this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };

	this.clear = function() {
		m_ebrkEditor.insertHTML('');
	};

    this.getAlignment = function() {
        return m_alignment;
    };
    
    this.getContent = function() {
    	return m_ebrkEditor.getHTML();
    };
    
    this.getHeight = function() {
    	var minHeight = Math.max(m_ddlFonts.getHeight(), m_ddlSizes.getHeight(), m_tbEdit.getHeight()) + 65;
    	
    	if (m_height < minHeight) {
    		m_height = minHeight;
    	}
    	
    	return m_height;
    };
    
    this.getStyles = function() {
    	return m_styles;
    };
    
    this.getText = function() {
    	return m_ebrkEditor.getText();
    };
    
    this.getWidth = function() {
    	var width = m_tbEdit.getWidth() + m_ddlFonts.getWidth() + m_ddlSizes.getWidth() + 4;
    	
    	width += 14;
    	
    	if (m_width < width) {
    		m_width = width;
    	}
    	
    	return m_width;
    };
    
    this.hide = function() {
    	m_brkBackground.hide();
    	m_ddlFonts.hide();
    	m_ddlSizes.hide();
    	m_ebrkEditor.hide();
    	m_tbEdit.hide();
    	
    	if (m_timerId != 0) {
			clearTimeout(m_timerId);
			m_timerId = 0;
		}
    };
    
    this.move = function(x, y) {
    	m_brkBackground.setSize(m_width, m_height);
    	m_brkBackground.move(x, y);
    	
    	m_tbEdit.move(x + 7, y + 7);
    	
    	m_ddlFonts.move(x + 9 + m_tbEdit.getWidth(), y + 7);
    	m_ddlSizes.move(x + m_tbEdit.getWidth() + m_ddlFonts.getWidth() + 11, y + 7);
    	
    	m_ebrkEditor.setSize(m_width - 23, m_height - (Math.max(m_ddlFonts.getHeight(), m_tbEdit.getHeight()) + 28));
    	m_ebrkEditor.move(x + 7, y + Math.max(m_ddlFonts.getHeight(), m_tbEdit.getHeight()) + 12);
    };
    
    this.setContent = function(content) {
    	this.clear();
    	m_ebrkEditor.insertHTML(content);
    	
    	if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
    
    this.setOnValidation = function(callback) {
		m_onValidationCallback = callback;
	};
    
    this.setOrder = function(order) {
    	m_brkBackground.setOrder(order + 1);
    	m_ddlFonts.setOrder(order + 2);
    	m_ddlSizes.setOrder(order + 2);
    	m_ebrkEditor.setOrder(order + 2);
    	m_tbEdit.setOrder(order + 2);
    	
    	return order + 3;
    };
    
    this.setText = function(text) {
    	this.clear();
    	m_ebrkEditor.setText(text);
    	
    	if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
    
    this.show = function() {
    	m_brkBackground.show();
    	m_ddlFonts.show();
    	m_ddlSizes.show();
    	m_ebrkEditor.show();
    	m_tbEdit.show();
    	
    	m_ebrkEditor.setFocus();
    	
    	onCommand('fontname', extractNodeValue(m_ddlFonts.getText()));
		onCommand('fontsize', m_ddlSizes.getText());
		
		if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
	
	m_tbEdit.add('bold', TLang.translate('bold'), 'images/editor/bold.png', 'images/editor/bold_on.png', null, function() { m_styles.bold = !m_styles.bold; onCommand('bold', null); });
	m_tbEdit.add('italic', TLang.translate('italic'), 'images/editor/italic.png', 'images/editor/italic_on.png', null, function() { m_styles.italic = !m_styles.italic; onCommand('italic', null); });
	m_tbEdit.add('underline', TLang.translate('underline'), 'images/editor/underline.png', 'images/editor/underline_on.png', null, function() { m_styles.underline = !m_styles.underline; onCommand('underline', null); });
	m_tbEdit.insertSeparator();
	m_tbEdit.add('justifyleft', TLang.translate('justifyLeft'), 'images/editor/justify_left.png', 'images/editor/justify_left_on.png', null, function() { onCommand('justifyleft', null); });
	m_tbEdit.add('justifycenter', TLang.translate('justifyCenter'), 'images/editor/justify_center.png', 'images/editor/justify_center_on.png', null, function() { onCommand('justifycenter', null); });
	m_tbEdit.add('justifyright', TLang.translate('justifyRight'), 'images/editor/justify_right.png', 'images/editor/justify_right_on.png', null, function() { onCommand('justifyright', null); });
	m_tbEdit.insertSeparator();
	m_tbEdit.add('forecolor', TLang.translate('foreColor'), 'images/editor/forecolor.png', 'images/editor/forecolor_on.png', null, function() { onForeColorClick('forecolor'); });
	
	for (var i = 0; i < m_fonts.length; i++) {
		m_ddlFonts.add(i, "<span style='font-family:" + m_fonts[i] + ";'>" + m_fonts[i] + "</span>");
	}
	m_ddlFonts.setSelectedId('0');
	
	for (var i = 1; i < 7; i++) {
		m_ddlSizes.add(i, i);
		if (i == 6) { m_ddlSizes.add(i + 1, i + 1); }
	}
	m_ddlSizes.setSelectedId('3');
	
	m_ddlFonts.setOnChange(onFontFamilyChanged);
	m_ddlSizes.setOnChange(onFontSizeChanged);
	document.onmousedown = onMouseDown;
};

function TTextEditor(width, height, foldersUrl, filesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveImageUrl) {
	var m_alignment            = 0;
	var m_brkBackground        = new TBrick();
	var m_brkTextPreview       = new TBrick();
	var m_clImage              = new TCommandsList();
	var m_clLink               = new TCommandsList();
	var m_clTable              = new TCommandsList();
	var m_currentView          = 'text';
	var m_ddlFonts             = new TDropdownList();
	var m_ddlSizes             = new TDropdownList();
	var m_ebrkEditor           = new TEditableBrick();
	var m_fonts                = new Array();
	var m_height               = (height === undefined || height == null) ? 0 : height;
	var m_htmlImage            = null;
	var m_onValidationCallback = null;
	var m_previewStyle         = new Array();
	var m_saveCallback         = null;
	var m_selection            = null;
	var m_tbEdit1              = new TToolBar('Icon', '#ECF1F6');
	var m_tbEdit2              = new TToolBar('Icon', '#ECF1F6');
	var m_tbInsert             = new TToolBar('Icon', '#ECF1F6');
	var m_tbStandard           = new TToolBar('Icon', '#ECF1F6');
	var m_this                 = this;
	var m_timerId              = 0;
	var m_txtSample            = new TText('Sample');
	var m_width                = (width === undefined || width == null) ? 0 : width;
	var m_wndAudio             = null;
	var m_wndImage             = null;
	var m_wndLink              = null;
	var m_wndSelectColor       = null;
	var m_wndTable             = null;
	var m_wndVideo             = null;
	
	m_brkBackground.setBackground('#AFCCEE'); // ECF1F6
	m_brkTextPreview.setBackground('#FFFFFF');
	m_brkTextPreview.setBorder('#80B0D0', 1, 1, 1, 1);
	m_brkTextPreview.setSize(204, 79);
	m_fonts = ['Arial', 'Comic Sans MS', 'Courier New', 'Georgia', 'Impact', 'Sans Serif', 'Tahoma', 'Times New Roman', 'Verdana'];
	m_previewStyle.push({ bold: false, italic: false, underline: false, strike: false });
	
	var cellProperties = function() {
		hideLists();
		m_ebrkEditor.cellProperties();
	};
	
	var deleteImage = function() {
		m_ebrkEditor.deleteImage(m_htmlImage);
	};
	
	var deleteTable = function() {
		m_ebrkEditor.deleteTable();
	};
	
	var deleteTableCell = function() {
		m_ebrkEditor.deleteTableCell();
	};
	
	var deleteTableColumn = function() {
		m_ebrkEditor.deleteTableColumn();
	};
	
	var deleteTableRow = function() {
		m_ebrkEditor.deleteTableRow();
	};
	
	var disableToolbars = function() {
		m_tbEdit1.disable();
		m_tbEdit2.disable();
		m_tbInsert.disable();
		m_tbStandard.disable();
		m_tbStandard.enable('view_text');
	};
	
	var enableToolbars = function() {
		m_tbEdit1.enable();
		m_tbEdit2.enable();
		m_tbInsert.enable();
		m_tbStandard.enable();
	};
	
	var extractNodeValue = function(node) {
		var str = node.toString();
		return str.substring(str.indexOf('>') + 1, str.lastIndexOf('<'));
	};
	
	var getStyle = function() {
		if (m_currentView != 'html') {
			hideLists();
			var style = m_ebrkEditor.getSelectedNodeStyle();
			if (style != null) {
				var index = 0;
				for (var i = 0; i < m_fonts.length; i++) {
					if (m_fonts[i].toLowerCase() == style.fontFamily.toLowerCase() || "'" + m_fonts[i].toLowerCase() + "'" == style.fontFamily.toLowerCase()) {
						index = i;
						break;
					}
				}
				m_ddlFonts.setSelectedId(index);
				
				var size = style.fontSize;
				if (size.indexOf('px', 0) != -1) {
					m_ddlSizes.setSelectedItem(TSizeConverter.convertPXtoFontSize(size));
					m_txtSample.setFontSize(size);
				} else {
					m_ddlSizes.setSelectedItem(size);
					m_txtSample.setFontSize(TSizeConverter.convertFontSizeToEM(size));
				}
				
				m_txtSample.setBackgroundColor(style.backColor);
				m_txtSample.setColor(style.color);
				m_txtSample.setFontFamily(m_fonts[index]);
				
				if (style.fontWeight == '700' || style.fontWeight == 'bold') {
					m_previewStyle[0].bold = true;
				} else {
					m_previewStyle[0].bold = false;
				}
				if (style.fontStyle == 'italic') {
					m_previewStyle[0].italic = true;
				} else {
					m_previewStyle[0].italic = false;
				}
				
				if (style.textDecoration.indexOf('underline', 0) != -1) {
					m_previewStyle[0].underline = true;
				} else {
					m_previewStyle[0].underline = false;
				}
				if (style.textDecoration.indexOf('line-through', 0) != -1) {
					m_previewStyle[0].strike = true;
				} else {
					m_previewStyle[0].strike = false;
				}
				
				textSampleEffects();
			} else {
				setStyle();
			}
		}
	};
	
	var hideLists = function() {
		m_clImage.hide();
		m_clLink.hide();
		m_clTable.hide();
	};
	
	var imageProperties = function() {
		document.onmousedown = null;
		m_wndImage = new TImageWindow(foldersUrl, filesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveImageUrl, function() { document.onmousedown = onMouseDown; }, m_htmlImage);
		m_wndImage.show();
	};
	
	var insertAudio = function(ok) { 
		if (ok) {
			m_ebrkEditor.restoreSelection(m_selection);
			m_ebrkEditor.setFocus();
			var audioPro = m_wndAudio.getAudioProperties();
			if (audioPro != null) {
				m_ebrkEditor.insertAudio(audioPro[0].url1, audioPro[0].url2);
			}
		}
		document.onmousedown = onMouseDown;
		setStyle();
	};
	
	var insertImage = function(ok) { 
		if (ok) {
			m_ebrkEditor.restoreSelection(m_selection);
			m_ebrkEditor.setFocus();
			var imgPro = m_wndImage.getImageProperties();
			if (imgPro != null) {
				m_ebrkEditor.insertImage(imgPro[0].align, imgPro[0].alt, imgPro[0].border, imgPro[0].height, imgPro[0].hspace, imgPro[0].url, imgPro[0].vspace, imgPro[0].width);
			}
		}
		document.onmousedown = onMouseDown;
		setStyle();
	};
	
	var insertLink = function(ok) {
		if (ok) {
			m_ebrkEditor.restoreSelection(m_selection);
			m_ebrkEditor.setFocus();
			var linkPro = m_wndLink.getLink();
			if (linkPro != null) {
				m_ebrkEditor.insertLink(linkPro.name, linkPro.url, 'font-family:' + extractNodeValue(m_ddlFonts.getText()) + '; font-size:' + TSizeConverter.convertFontSizeToEM(m_ddlSizes.getText()) + ';');
			}
		}
		document.onmousedown = onMouseDown;
		setStyle();
	};
	
	var insertTable = function(ok) {
		if (ok) {
			m_ebrkEditor.restoreSelection(m_selection);
			m_ebrkEditor.setFocus();
			var tblPro = m_wndTable.getTableProperties();
			if (tblPro != null) {
				m_ebrkEditor.insertTable(tblPro[0].cols, tblPro[0].rows, tblPro[0].align, tblPro[0].cellPadding, tblPro[0].cellSpacing, tblPro[0].style, tblPro[0].width);
			}
		}
		document.onmousedown = onMouseDown;
		setStyle();
	};
	
	var insertTableCell = function(mode) {
		m_ebrkEditor.insertTableCell(mode);
	};
	
	var insertTableColumn = function(mode) {
		m_ebrkEditor.insertTableColumn(mode);
	};
	
	var insertTableRow = function(mode) {
		m_ebrkEditor.insertTableRow(mode);
	};
	
	var insertVideo = function(ok) { 
		if (ok) {
			m_ebrkEditor.restoreSelection(m_selection);
			m_ebrkEditor.setFocus();
			var videoPro = m_wndVideo.getVideoProperties();
			if (videoPro != null) {
				m_ebrkEditor.insertVideo(videoPro[0].url1, videoPro[0].url2, videoPro[0].height, videoPro[0].width);
			}
		}
		document.onmousedown = onMouseDown;
		setStyle();
	};
	
	var mergeTableCells = function(mode) {
		m_ebrkEditor.mergeCells(mode);
	};
	
	var onArrowsKeyUp = function(e) {
		e = e ? e : window.event;
		if (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40) { // left = 37 up = 38 right = 39 down = 40
			getStyle();
			if ((e.keyCode == 37 || e.keyCode == 39) && m_this.getContent() == '<br>') {
				if (e.preventDefault) {
				    e.preventDefault();
				} else if (e.returnValue) {
				    e.returnValue = false;
				} else {
				    return false;
				}
			}
		}
	};
	
	var onBackForeColorClick = function(cmd) {
		hideLists();
		m_wndSelectColor = new TSelectColorWindow(function() { onCommand(cmd, null); });
		m_wndSelectColor.show();
	};
	
	var onCommand = function(cmd, value) {
		hideLists();
		if (cmd == 'forecolor' || cmd == 'backcolor') {
			var color = m_wndSelectColor.getSelectedColor();
			if (color != null) {
				m_ebrkEditor.executeCommand(cmd, color);
				if (cmd == 'forecolor') {
					m_txtSample.setColor(color);
				} else {
					m_txtSample.setBackgroundColor(color);
				}
			}
		} else {
			m_ebrkEditor.executeCommand(cmd, value);
		}
	};
	
	var onFontFamilyChanged = function() {
		onCommand('fontname', extractNodeValue(m_ddlFonts.getText()));
	};
	
	var onFontFamilyOut = function() { 
	    m_txtSample.setFontFamily(extractNodeValue(m_ddlFonts.getText()));
	};
	
	var onFontFamilyOver = function(id) { 
	    m_txtSample.setFontFamily(m_fonts[id]);
	};
	
	var onFontSizeChanged = function() {
		onCommand('fontsize', m_ddlSizes.getText());
	};
	
	var onFontSizeOut = function() { 
	  m_txtSample.setFontSize(TSizeConverter.convertFontSizeToEM(m_ddlSizes.getText()));
	};
	
	var onFontSizeOver = function(id) { 
	  m_txtSample.setFontSize(TSizeConverter.convertFontSizeToEM(id.toString()));
	};
	
	var onInsertAudioClick = function() {
		document.onmousedown = null;
		m_selection = m_ebrkEditor.saveSelection();
		hideLists();
		m_wndAudio = new TAudioWindow(foldersUrl, filesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveImageUrl, insertAudio);
		m_wndAudio.show();
	};
	
	var onInsertImageClick = function() {
		document.onmousedown = null;
		m_selection = m_ebrkEditor.saveSelection();
		hideLists();
		m_wndImage = new TImageWindow(foldersUrl, filesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveImageUrl, insertImage);
		m_wndImage.show();
	};
	
	var onInsertLinkClick = function() {
		document.onmousedown = null;
		m_selection = m_ebrkEditor.saveSelection();
		hideLists();
		m_wndLink = new THyperlinkWindow(insertLink);
		m_wndLink.show();
	};
	
	var onInsertTableClick = function() {
		document.onmousedown = null;
		m_selection = m_ebrkEditor.saveSelection();
		hideLists();
		m_wndTable = new TTableWindow(insertTable);
		m_wndTable.show();
	};
	
	var onInsertVideoClick = function() {
		document.onmousedown = null;
		m_selection = m_ebrkEditor.saveSelection();
		hideLists();
		m_wndVideo = new TVideoWindow(foldersUrl, filesUrl, addMediaUrl, editMediaUrl, deleteMediaUrl, searchUrl, saveImageUrl, insertVideo);
		m_wndVideo.show();
	};
	
	var onMouseDown = function(e) {
		e = e ? e : window.event;
		if (e.target.isContentEditable != true) {
			if (e.preventDefault) {
				e.preventDefault();
			} else if (e.returnValue) {
				e.returnValue = false;
			} else {
				return false;
			}
		}
	};
	
	var onPreviewClick = function() {
		hideLists();
		var win = window.open('', TLang.translate('preview'), 'scrollbars=yes,height=650,width=615');
	    win.document.write('<html><head><title>' +  TLang.translate('preview') + '</title>');
	    win.document.write('</head><body >');
	    win.document.write(m_ebrkEditor.getHTML());
	    win.document.write('</body></html>');
	};
	
	var onPrintClick = function() {
		hideLists();
		var win = window.open('', TLang.translate('print'), 'scrollbars=yes,height=650,width=615');
	    win.document.write('<html><head><title>' + TLang.translate('print') + '</title>');
	    win.document.write('</head><body >');
	    win.document.write(m_ebrkEditor.getHTML());
	    win.document.write('</body></html>');
	
	    win.print();
	    win.close();
	};
	
	var onRightClick = function(e) {
		hideLists();
		e = e ? e : window.event;
		if (e.target.nodeName.toLowerCase() == 'img') {
			m_htmlImage = e.target;
			m_clImage.show(e.clientX, e.clientY);
		} else if (e.target.nodeName.toLowerCase() == 'table' || e.target.nodeName.toLowerCase() == 'tbody' || e.target.nodeName.toLowerCase() == 'tr' || e.target.nodeName.toLowerCase() == 'td') {
			if (!m_ebrkEditor.canMergeCellRight()) { m_clTable.disable('mergeright'); } else { m_clTable.enable('mergeright'); }
			if (!m_ebrkEditor.canMergeCellDown()) { m_clTable.disable('mergedown'); } else { m_clTable.enable('mergedown'); }
			var result = m_ebrkEditor.hasRowOperations();
			if (!result[0].before) { m_clTable.disable('insertrowbefore'); } else { m_clTable.enable('insertrowbefore'); }
			if (!result[0].after) { m_clTable.disable('insertrowafter'); } else { m_clTable.enable('insertrowafter'); }
			if (!result[0].candelete) { m_clTable.disable('deleterow'); } else { m_clTable.enable('deleterow'); }
			
			result = m_ebrkEditor.hasColumnOperations();
			if (!result[0].before) { m_clTable.disable('insertcolumnbefore'); } else { m_clTable.enable('insertcolumnbefore'); }
			if (!result[0].after) { m_clTable.disable('insertcolumnafter'); } else { m_clTable.enable('insertcolumnafter'); }
			if (!result[0].candelete) { m_clTable.disable('deletecolumn'); } else { m_clTable.enable('deletecolumn'); }
			
			m_clTable.show(e.clientX, e.clientY);
		} else if (e.target.nodeName.toLowerCase() == 'a' || e.target.parentNode.nodeName.toLowerCase() == 'a') {
			m_clLink.show(e.clientX, e.clientY);
		} else {
			return;
		}
		
		if (e.preventDefault) {
			e.preventDefault();
		} else if (e.returnValue) {
			e.returnValue = false;
		} else {
			return false;
		}
	};
	
	var onValidate = function() {
		if (m_timerId != 0) {
			clearTimeout(m_timerId);
			m_timerId = 0;
		}
		
		m_onValidationCallback();
		
		m_timerId = setTimeout(onValidate, 250);
	};
	
	var setStyle = function() {
		m_ebrkEditor.executeCommand('fontname', extractNodeValue(m_ddlFonts.getText()));
		m_ebrkEditor.executeCommand('fontsize', m_ddlSizes.getText());
		m_ebrkEditor.executeCommand('forecolor', m_txtSample.getColor());
		m_ebrkEditor.executeCommand('backcolor', m_txtSample.getBackgroundColor());
		
		var bold = m_ebrkEditor.queryCommandState('bold');
		var italic = m_ebrkEditor.queryCommandState('italic');
		var underline = m_ebrkEditor.queryCommandState('underline');
		var strike = m_ebrkEditor.queryCommandState('strikethrough');
		
		if(m_previewStyle[0].bold != bold) {
			m_ebrkEditor.executeCommand('bold', null);
		}
		if(m_previewStyle[0].italic != italic) {
			m_ebrkEditor.executeCommand('italic', null);
		}
		if(m_previewStyle[0].underline != underline) {
			m_ebrkEditor.executeCommand('underline', null);
		}
		if(m_previewStyle[0].strike != strike) {
			m_ebrkEditor.executeCommand('strikethrough', null);
		}
	};
	
	var splitTableCell = function(mode) {
		m_ebrkEditor.splitCell(mode);
	};
	
	var tableProperties = function() {
		m_ebrkEditor.tableProperties();
	};
	
	var textSampleEffects = function() {
		var pre = '';
		var suf = '';
		
		if (m_previewStyle[0].bold) {
			pre += '<b>';
			suf += '</b>';
		}
		if (m_previewStyle[0].italic) {
			pre += '<i>';
			suf += '</i>';
		}
		if (m_previewStyle[0].underline) {
			pre += '<u>';
			suf += '</u>';
		}
		if (m_previewStyle[0].strike) {
			pre += '<strike>';
			suf += '</strike>';
		}
		m_txtSample.setInnerHTML(pre + 'Sample' + suf);
	};
	
	var view = function(mode) {
		hideLists();
		if (mode == 'text') {
			if (m_currentView != 'text') {
				m_currentView = 'text';
				if (isIE()) {
					var iText = m_ebrkEditor.getText();
					m_ebrkEditor.insertHTML(iText);
				} else {
					var html = document.createRange();
			    	html.selectNodeContents(m_ebrkEditor.getEditorElement());
			    	m_ebrkEditor.insertHTML(html);
				}
				enableToolbars();
			}
		} else if (mode == 'html') {
			if (m_currentView != 'html') {
				m_currentView = 'html';
				if (isIE()) {
					var iHtml = m_ebrkEditor.getHTML();
					m_ebrkEditor.insertText(iHtml);
				} else {
					var html = m_ebrkEditor.getHTML();
					html = document.createTextNode(html);
			    	m_ebrkEditor.insertHTML('');
			    	m_ebrkEditor.appendChild(html);
				}
				disableToolbars();
			}
		}
	};
	
	this.alignLeft = function() {
        m_alignment = 1;
    };

    this.alignRight = function() {
        m_alignment = 2;
    };

	this.clear = function() {
		m_ebrkEditor.insertHTML('');
	};

    this.getAlignment = function() {
        return m_alignment;
    };
    
    this.getContent = function() {
    	return m_ebrkEditor.getHTML();
    };
    
    this.getHeight = function() {
    	var ddHeight = Math.max(m_ddlFonts.getHeight(), m_ddlSizes.getHeight());
    	var minHeight = Math.max(m_tbEdit1.getHeight() + m_tbEdit2.getHeight() + m_tbInsert.getHeight() + ddHeight + 6, m_brkTextPreview.getHeight()) + m_tbStandard.getHeight() + 65;
    	
    	if (m_height < minHeight) {
    		m_height = minHeight;
    	}
    	
    	return m_height;
    };
    
    this.getText = function() {
    	return m_ebrkEditor.getText();
    };
    
    this.getWidth = function() {
    	var dropdownsWidth = m_ddlFonts.getWidth() + m_ddlSizes.getWidth() + m_brkTextPreview.getWidth() + 2;
    	var tbStandWidth   = m_tbStandard.getWidth();
    	var tbEdit1Width   = m_tbEdit1.getWidth()  + m_brkTextPreview.getWidth() + 2;
    	var tbEdit2Width   = m_tbEdit2.getWidth() + m_brkTextPreview.getWidth() + 2;
    	var tbInsertWidth  = m_tbInsert.getWidth() + m_brkTextPreview.getWidth() + 2;
    	var width = Math.max(dropdownsWidth, tbEdit1Width, tbEdit2Width, tbStandWidth, tbInsertWidth);
    	
    	width += 14;
    	
    	if (m_width < width) {
    		m_width = width;
    	}
    	
    	return m_width;
    };
    
    this.hide = function() {
    	m_brkBackground.hide();
    	m_brkTextPreview.hide();
    	m_ddlFonts.hide();
    	m_ddlSizes.hide();
    	m_ebrkEditor.hide();
    	m_tbEdit1.hide();
    	m_tbEdit2.hide();
    	m_tbInsert.hide();
    	m_tbStandard.hide();
    	m_txtSample.hide();
    	
    	if (m_timerId != 0) {
			clearTimeout(m_timerId);
			m_timerId = 0;
		}
    };
    
    this.move = function(x, y) {
    	m_brkBackground.setSize(m_width, m_height);
    	m_brkBackground.move(x, y);
    	
    	m_tbStandard.move(x + 7, y + 7);
    	
    	m_ddlFonts.move(x + 7, y + m_tbStandard.getHeight() + 9);
    	m_ddlSizes.move(x + m_ddlFonts.getWidth() + 9, y + m_tbStandard.getHeight() + 9);
    	
    	m_tbEdit1.move(x + 7, y + m_tbStandard.getHeight() + m_ddlFonts.getHeight() + 11);
    	
    	m_tbEdit2.move(x + 7, y + m_tbStandard.getHeight() + m_ddlFonts.getHeight() + m_tbEdit1.getHeight() + 13);
    	
    	m_tbInsert.move(x + 7, y + m_tbStandard.getHeight() + m_ddlFonts.getHeight() + m_tbEdit1.getHeight() + m_tbEdit2.getHeight() + 15);
    	
    	m_ebrkEditor.setSize(m_width - 20, m_height - (m_tbStandard.getHeight() + Math.max(m_ddlFonts.getHeight() + m_tbEdit1.getHeight() + m_tbEdit2.getHeight() + m_tbInsert.getHeight() + 6, m_brkTextPreview.getHeight()) + 31));
    	m_ebrkEditor.move(x + 5, y + m_tbStandard.getHeight() + Math.max(m_ddlFonts.getHeight() + m_tbEdit1.getHeight() + m_tbEdit2.getHeight() + m_tbInsert.getHeight() + 6, m_brkTextPreview.getHeight()) + 16);
    	
    	m_brkTextPreview.move(x + m_tbEdit1.getWidth() + 9, y + m_tbStandard.getHeight() + 9);
    	m_txtSample.move(x + m_tbEdit1.getWidth() + 11, y + m_tbStandard.getHeight() + 11);
    };
    
    this.setContent = function(content) {
    	this.clear();
    	m_ebrkEditor.insertHTML(content);
    	
    	if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
    
    this.setOnValidation = function(callback) {
		m_onValidationCallback = callback;
	};
    
    this.setOrder = function(order) {
    	m_brkBackground.setOrder(order + 1);
    	m_brkTextPreview.setOrder(order + 2);
    	m_ddlFonts.setOrder(order + 2);
    	m_ddlSizes.setOrder(order + 2);
    	m_ebrkEditor.setOrder(order + 2);
    	m_tbEdit1.setOrder(order + 2);
    	m_tbEdit2.setOrder(order + 2);
    	m_tbInsert.setOrder(order + 2);
    	m_tbStandard.setOrder(order + 2);
    	m_txtSample.setOrder(order + 3);
    	
    	return order + 4;
    };
    
    this.setOnSaveCallback = function(callback) {
    	m_saveCallback = callback;
    };
    
    this.setText = function(text) {
    	this.clear();
    	m_ebrkEditor.setText(text);
    	
    	if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
    
    this.show = function() {
    	m_brkBackground.show();
    	m_brkTextPreview.show();
    	m_ddlFonts.show();
    	m_ddlSizes.show();
    	m_ebrkEditor.show();
    	m_tbEdit1.show();
    	m_tbEdit2.show();
    	m_tbInsert.show();
    	m_tbStandard.show();
    	m_txtSample.show();
    	
    	m_ebrkEditor.setFocus();
    	
    	onCommand('fontname', extractNodeValue(m_ddlFonts.getText()));
		onCommand('fontsize', m_ddlSizes.getText());
		
		if (m_onValidationCallback != null) {
			m_timerId = setTimeout(onValidate, 250);
		}
    };
    
    m_tbEdit1.add('bold', TLang.translate('bold'), 'images/editor/bold.png', 'images/editor/bold_on.png', null, function() { m_previewStyle[0].bold = !m_previewStyle[0].bold; onCommand('bold', null); textSampleEffects(); });
	m_tbEdit1.add('italic', TLang.translate('italic'), 'images/editor/italic.png', 'images/editor/italic_on.png', null, function() { m_previewStyle[0].italic = !m_previewStyle[0].italic; onCommand('italic', null); textSampleEffects(); });
	m_tbEdit1.add('underline', TLang.translate('underline'), 'images/editor/underline.png', 'images/editor/underline_on.png', null, function() { m_previewStyle[0].underline = !m_previewStyle[0].underline; onCommand('underline', null); textSampleEffects(); });
	m_tbEdit1.add('strikethrough', TLang.translate('strikeThrough'), 'images/editor/strike.png', 'images/editor/strike_on.png', null, function() { m_previewStyle[0].strike = !m_previewStyle[0].strike; onCommand('strikethrough', null); textSampleEffects(); });
	m_tbEdit1.insertSeparator();
	m_tbEdit1.add('justify', TLang.translate('justify'), 'images/editor/justify.png', 'images/editor/justify_on.png', null, function() { onCommand('justifyfull', null); });
	m_tbEdit1.add('justifyleft', TLang.translate('justifyLeft'), 'images/editor/justify_left.png', 'images/editor/justify_left_on.png', null, function() { onCommand('justifyleft', null); });
	m_tbEdit1.add('justifycenter', TLang.translate('justifyCenter'), 'images/editor/justify_center.png', 'images/editor/justify_center_on.png', null, function() { onCommand('justifycenter', null); });
	m_tbEdit1.add('justifyright', TLang.translate('justifyRight'), 'images/editor/justify_right.png', 'images/editor/justify_right_on.png', null, function() { onCommand('justifyright', null); });
	
	m_tbEdit2.add('subscript', TLang.translate('subscript'), 'images/editor/subscript.png', 'images/editor/subscript_on.png', null, function() { onCommand('subscript', null); });
	m_tbEdit2.add('superscript', TLang.translate('superscript'), 'images/editor/superscript.png', 'images/editor/superscript_on.png', null, function() { onCommand('superscript', null); });
	m_tbEdit2.add('forecolor', TLang.translate('foreColor'), 'images/editor/forecolor.png', 'images/editor/forecolor_on.png', null, function() { onBackForeColorClick('forecolor'); });
	m_tbEdit2.add('backcolor', TLang.translate('backColor'), 'images/editor/backcolor.png', 'images/editor/backcolor_on.png', null, function() { onBackForeColorClick('backcolor'); });
    m_tbEdit2.insertSeparator();
    m_tbEdit2.add('list_unordered', TLang.translate('unorderedList'), 'images/editor/list_unordered.png', 'images/editor/list_unordered_on.png', null, function() { onCommand('insertunorderedlist', null); });
	m_tbEdit2.add('list_ordered', TLang.translate('orderedList'), 'images/editor/list_ordered.png', 'images/editor/list_ordered_on.png', null, function() { onCommand('insertorderedlist', null); });
	m_tbEdit2.add('indent_left', TLang.translate('outdent'), 'images/editor/indent_left.png', 'images/editor/indent_left_on.png', null, function() { onCommand('outdent', null); });
	m_tbEdit2.add('indent_right', TLang.translate('indent'), 'images/editor/indent_right.png', 'images/editor/indent_right_on.png', null, function() { onCommand('indent', null); });
	
    m_tbInsert.add('inserttable', TLang.translate('insertTable'), 'images/editor/insert_table.png', 'images/editor/insert_table_on.png', null, onInsertTableClick);
	m_tbInsert.add('insertimage', TLang.translate('insertImage'), 'images/editor/insert_picture.png', 'images/editor/insert_picture_on.png', null, onInsertImageClick);
	m_tbInsert.add('insertlink', TLang.translate('insertLink'), 'images/editor/insert_hyperlink.png', 'images/editor/insert_hyperlink_on.png', null, onInsertLinkClick);
	m_tbInsert.add('inserthrule', TLang.translate('insertHorizontalRule'), 'images/editor/horizontalrule.png', 'images/editor/horizontalrule_on.png', null, function() { onCommand('inserthorizontalrule', null); });
	m_tbInsert.add('insertaudio', TLang.translate('insertAudio'), 'images/editor/insert_sound.png', 'images/editor/insert_sound_on.png', null, onInsertAudioClick);
	m_tbInsert.add('insertvideo', TLang.translate('insertVideo'), 'images/editor/insert_video.png', 'images/editor/insert_video_on.png', null, onInsertVideoClick);
    
    m_tbStandard.add('save', TLang.translate('save'), 'images/editor/save.png', 'images/editor/save_on.png', null, m_saveCallback);
	m_tbStandard.insertSeparator();
	m_tbStandard.add('word', TLang.translate('openMSWordFile'), 'images/editor/word.png', 'images/editor/word_on.png', null);
	m_tbStandard.insertSeparator();
	m_tbStandard.add('cut', TLang.translate('cut'), 'images/editor/cut.png', 'images/editor/cut_on.png', null, function() { onCommand('cut', null); });
	if (!isIE() && !isIE11()) { m_tbStandard.disable('cut'); }
	m_tbStandard.add('copy', TLang.translate('copy'), 'images/editor/copy.png', 'images/editor/copy_on.png', null, function() { onCommand('copy', null); });
	if (!isIE() && !isIE11()) { m_tbStandard.disable('copy'); }
	m_tbStandard.add('paste', TLang.translate('paste'), 'images/editor/paste.png', 'images/editor/paste_on.png', null, function() { onCommand('paste', null); });
	if (!isIE() && !isIE11()) { m_tbStandard.disable('paste'); }
	m_tbStandard.insertSeparator();
	m_tbStandard.add('undo', TLang.translate('undo'), 'images/editor/undo.png', 'images/editor/undo_on.png', null, function() { onCommand('undo', null); });
	m_tbStandard.add('redo', TLang.translate('redo'), 'images/editor/redo.png', 'images/editor/redo_on.png', null, function() { onCommand('redo', null); });
	m_tbStandard.insertSeparator();
	m_tbStandard.add('print', TLang.translate('print'), 'images/editor/print.png', 'images/editor/print_on.png', null, onPrintClick);
	m_tbStandard.add('preview', TLang.translate('preview'), 'images/editor/preview.png', 'images/editor/preview_on.png', null, onPreviewClick);
	m_tbStandard.insertSeparator();
	m_tbStandard.add('view_source', TLang.translate('viewSource'), 'images/editor/view_source.png', 'images/editor/view_source_on.png', null, function() { view('html'); });
	m_tbStandard.add('view_text', TLang.translate('viewText'), 'images/editor/view_text.png', 'images/editor/view_text_on.png', null, function() { view('text'); });
	m_tbStandard.insertSeparator();
	m_tbStandard.add('help', TLang.translate('help'), 'images/editor/help.png', 'images/editor/help_on.png', null);
	
	m_clImage.add('processimage', TLang.translate('processImage'), null);
	m_clImage.add('deleteimage', TLang.translate('deleteImage'), deleteImage);
	m_clImage.add('imageproperties', TLang.translate('imageProperties'), imageProperties);
	
	m_clLink.add('unlink', TLang.translate('unlink'), function() { onCommand('unlink', null); });
	
	m_clTable.add('cell', TLang.translate('cell'), null);
	m_clTable.add('row', TLang.translate('row'), null);
	m_clTable.add('column', TLang.translate('column'), null);
	m_clTable.add('deletetable', TLang.translate('deleteTable'), deleteTable);
	m_clTable.add('tableproperties', TLang.translate('tableProperties'), tableProperties);
	m_clTable.add('insertcellbefore', TLang.translate('insertCellBefore'), function() { insertTableCell('before'); }, null, 'cell');
	m_clTable.add('insertcellafter', TLang.translate('insertCellAfter'), function() { insertTableCell('after'); }, null, 'cell');
	m_clTable.add('deletecell', TLang.translate('deleteCell'), deleteTableCell, null, 'cell');
	//m_clTable.add('mergecells', 'Merge Cells', null, null, 'cell');
	m_clTable.add('mergeright', TLang.translate('mergeRight'), function() { mergeTableCells('right'); }, null, 'cell');
	m_clTable.add('mergedown', TLang.translate('mergeDown'), function() { mergeTableCells('down'); }, null, 'cell');
	m_clTable.add('splitcellhorizontally', TLang.translate('splitCellHorizontally'), function() { splitTableCell('h'); }, null, 'cell');
	m_clTable.add('splitcellvertically', TLang.translate('splitCellVertically'), function() { splitTableCell('v'); }, null, 'cell');
	m_clTable.add('cellproperties', TLang.translate('cellProperties'), cellProperties, null, 'cell');
	m_clTable.add('insertrowbefore', TLang.translate('insertRowBefore'), function() { insertTableRow('before'); }, null, 'row');
	m_clTable.add('insertrowafter', TLang.translate('insertRowAfter'), function() { insertTableRow('after'); }, null, 'row');
	m_clTable.add('deleterow', TLang.translate('deleteRow'), deleteTableRow, null, 'row');
	m_clTable.add('insertcolumnbefore', TLang.translate('insertColumnBefore'), function() { insertTableColumn('before'); }, null, 'column');
	m_clTable.add('insertcolumnafter', TLang.translate('insertColumnAfter'), function() { insertTableColumn('after'); }, null, 'column');
	m_clTable.add('deletecolumn', TLang.translate('deleteColumn'), deleteTableColumn, null, 'column');
	
	m_ebrkEditor.setOnClick(getStyle);
	m_ebrkEditor.setOnDblClick(getStyle);
	m_ebrkEditor.setOnKeyUp(onArrowsKeyUp);
	m_ebrkEditor.setOnRightClick(onRightClick);
			
	for (var i = 0; i < m_fonts.length; i++) {
		m_ddlFonts.add(i, "<span style='font-family:" + m_fonts[i] + ";'>" + m_fonts[i] + "</span>");
	}
	m_ddlFonts.setSelectedId('0');
	
	for (var i = 1; i < 7; i++) {
		m_ddlSizes.add(i, i);
		if (i == 6) { m_ddlSizes.add(i + 1, i + 1); }
	}
	m_ddlSizes.setSelectedId('3');
	
	m_ddlFonts.setOnChange(onFontFamilyChanged);
	m_ddlFonts.setOnItemOver(onFontFamilyOver);
	m_ddlFonts.setOnItemOut(onFontFamilyOut);
	m_ddlSizes.setOnChange(onFontSizeChanged);
	m_ddlSizes.setOnItemOver(onFontSizeOver);
	m_ddlSizes.setOnItemOut(onFontSizeOut);
	document.onmousedown = onMouseDown;
	//document.onclick = hideLists;
	
	m_txtSample.setFontSize(TSizeConverter.convertFontSizeToEM(m_ddlSizes.getText()));
	m_txtSample.setFontFamily(extractNodeValue(m_ddlFonts.getText()));
};

function TAudioWindow(foldersUrl, audioUrl, addAudioUrl, editAudioUrl, deleteAudioUrl, searchUrl, saveImageUrl, callback) {
	var m_btnBrowse1      = new TButton(TLang.translate('browseServer'));
	var m_btnBrowse2      = new TButton(TLang.translate('browseServer'));
	var m_btnOk           = new TButton(TLang.translate('ok'));
	var m_btnReturn       = new TButton(TLang.translate('cancel'));
	var m_btnUpload       = new TButton(TLang.translate('uploadToServer'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_fileSelected    = false;
	var m_fileUpload      = new TFileUploader(TLang.translate('browse'));
	var m_layCommands     = new THorizontalLayout();
	var m_layTop          = new TGridLayout(3, 2);
	var m_layUpload       = new TGridLayout(4, 2);
	var m_tab             = new TTab();
	var m_txtFile         = new TText(TLang.translate('noFileSelected') + '.');
	var m_txtUploadResult = new TText('');
	var m_url1Validator   = new TEmptyValidator();
	var m_url2Validator   = new TEmptyValidator();
	var m_vtbURL1         = new TValidatableTextBox(380, m_url1Validator);
	var m_vtbURL2         = new TValidatableTextBox(380, m_url2Validator);
	var m_window          = createWindow(TLang.translate('audio'));
	var m_wndFinder       = null;
	
	var onBrowseServerClick = function(whom) {
		if (!m_wndFinder) {
            m_wndFinder = new TFinderWindow(foldersUrl, audioUrl, addAudioUrl, editAudioUrl, deleteAudioUrl, searchUrl, null, saveImageUrl);
        }
		m_wndFinder.setOnFileDblClick(function() { onServerFileSelected(whom); });
        m_wndFinder.show();
	};
	
	var onClientFileSelected = function(files) {
		if (files.length > 0) {
			m_txtFile.setText(files[0].name + ' (' + (files[0].size / 1024) + ' KB)');
			m_fileSelected = true;
			m_window.refresh();
		} else {
			m_txtFile.setText(TLang.translate('noFileSelected') + '.');
			m_fileSelected = false;
		}
		m_txtUploadResult.setText('');
	};
	
	var onFileUpload = function() {
		if (m_fileSelected) {
			m_fileUpload.upload(uploadUrl, onFileUploaded);
		} else {
			m_txtUploadResult.setText(TLang.translate('selectFileFirst') + '.');
			m_window.refresh();
		}
	};
	
	var onFileUploaded = function(response) {
		m_txtUploadResult.setText(response);
		m_window.refresh();
	};
	
	var onOkClick = function() {
		hideModal();
		
		if (m_callback != null) {
			m_callback(true);
		}
	};
	
	var onReturnClick = function() {
        hideModal();
        
        if (m_callback != null) {
			m_callback(false);
		}
    };
	
	var onServerFileSelected = function(whom) {
		var sItems = m_wndFinder.getSelectedItems();
		var url = '';
		var subType = '';
		if(sItems.length) {
			if (sItems[0].type == 'audio') { url = sItems[0].url; subType = sItems[0].type.split('/')[1]; }
		}
		
		if (whom == 1 && (subType == 'mp3' || subType == 'mpeg3' || subType == 'x-mpeg-3')) {
			m_vtbURL1.setValue(url);
		} else if (whom == 2 && subType == 'ogg') {
			m_vtbURL2.setValue(url);
		}
		
		m_wndFinder.hide();
	};
	
	var validateInput = function() { 
		if (!m_url1Validator.validate(m_vtbURL1.getValue())) {
			return false;
		}
		
		if (!m_url2Validator.validate(m_vtbURL2.getValue())) {
			return false;
		}
		
		return true;
	};
	
	this.getAudioProperties = function() {
		if (validateInput()) {
			var audioPro = new Array();
			
			audioPro.push({ url1: m_vtbURL1.getValue(), url2: m_vtbURL2.getValue() });
			return audioPro;
		} 
		return null;
	};
	
	this.show = function() {
        showModal(m_window);
    };
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layTop.setDirection('rtl');
		m_layUpload.setDirection('rtl');
		m_tab.setDirection('rtl');
		m_vtbURL1.setDirection('rtl');
		m_vtbURL2.setDirection('rtl');
	}
	
	m_btnBrowse1.setOnClick(function() { onBrowseServerClick(1); });
	m_btnBrowse2.setOnClick(function() { onBrowseServerClick(2); });
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnUpload.setOnClick(onFileUpload);
	
	m_fileUpload.setOnClick(onClientFileSelected);
	m_vtbURL1.setReadOnly();
	m_vtbURL2.setReadOnly();
	
	m_layTop.setCell(0, 0, new TText('URL1 (mp3)'));
	m_layTop.setCell(1, 0, m_vtbURL1);
	m_layTop.setCell(2, 0, m_btnBrowse1);
	m_layTop.setCell(0, 1, new TText('URL2 (ogg)'));
	m_layTop.setCell(1, 1, m_vtbURL2);
	m_layTop.setCell(2, 1, m_btnBrowse2);
	
	m_layUpload.setCell(0, 0, new TText(TLang.translate('selectFile')));
	m_layUpload.setCell(1, 0, m_fileUpload);
	m_layUpload.setCell(2, 0, m_txtFile);
	m_layUpload.setCell(3, 1, m_btnUpload);
	
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_tab.addTab('audioInfo', TLang.translate('audio'));
	m_tab.addTab('audioUpload', TLang.translate('upload'));
	m_tab.addTabItem('audioInfo', m_layTop);
	m_tab.addTabItem('audioUpload', m_layUpload);
	m_tab.addTabItem('audioUpload', m_txtUploadResult);
	
	m_window.add(m_tab);
	m_window.add(m_layCommands);
};

function TSelectColorWindow(callback) {
	var m_btnReturn   = new TButton(TLang.translate('cancel'));
	var m_btnOk       = new TButton(TLang.translate('ok'));
	var m_callback    = (callback === undefined || callback == null) ? null : callback;
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
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
	}
	
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_colorPicker.setOnSelectColorCallback(onSelectColor);
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_window.add(m_colorPicker);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TImageWindow(foldersUrl, imagesUrl, addImageUrl, editImageUrl, deleteImageUrl, searchUrl, saveImageUrl, callback, image) {
	var m_brkPreview      = new TBrick();
	var m_btnBrowse       = new TButton(TLang.translate('browseServer'));
	var m_btnOk           = new TButton(TLang.translate('ok'));
	var m_btnRefresh      = new TImageButton(30, 30, 'images/editor/refresh.png');
	var m_btnReturn       = new TButton(TLang.translate('cancel'));
	var m_btnUpload       = new TButton(TLang.translate('uploadToServer'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_ddlAlign        = new TDropdownList();
	var m_fileSelected    = false;
	var m_fileUpload      = new TFileUploader(TLang.translate('browse'));
	var m_imgPreview      = null;
	var m_layCommands     = new THorizontalLayout();
	var m_layMain         = new THorizontalLayout();
	var m_layPreview      = new TVerticalLayout();
	var m_layProperties   = new TFormLayout();
	var m_layTop          = new TGridLayout(3, 2);
	var m_layUpload       = new TGridLayout(4, 2);
	var m_me              = (image === undefined || image == null) ? null : image;
	var m_tab             = new TTab();
	var m_tbAlt           = new TTextBox(400);
	var m_tbBorder        = new TTextBox(60);
	var m_tbHeight        = new TTextBox(60);
	var m_tbHSpace        = new TTextBox(60);
	var m_tbVSpace        = new TTextBox(60);
	var m_tbWidth         = new TTextBox(60);
	var m_txtFile         = new TText(TLang.translate('noFileSelected') + '.');
	var m_txtUploadResult = new TText('');
	var m_urlValidator    = new TEmptyValidator();
	var m_vtbURL          = new TValidatableTextBox(380, m_urlValidator);
	var m_window          = createWindow(TLang.translate('image'));
	var m_wndFinder       = null;
	
	var calculateFitImageSize = function(src, maxWidth, maxHeight) {
		var size = getImageSize(src);
		var fitSize = calculateAspectRatioFit(size.width, size.height, maxWidth, maxHeight);
		return { width: Math.floor(fitSize.width), height: Math.floor(fitSize.height) };
	};
	
	var onBrowseServerClick = function() {
		if (!m_wndFinder) {
            m_wndFinder = new TFinderWindow(foldersUrl, imagesUrl, addImageUrl, editImageUrl, deleteImageUrl, searchUrl, null, saveImageUrl);
        }
		m_wndFinder.setOnFileDblClick(onServerFileSelected);
        m_wndFinder.show();
	};
	
	var onClientFileSelected = function(files) {
		if (files.length > 0) {
			m_txtFile.setText(files[0].name + ' (' + (files[0].size / 1024) + ' KB)');
			m_fileSelected = true;
			m_window.refresh();
		} else {
			m_txtFile.setText(TLang.translate('noFileSelected') + '.');
			m_fileSelected = false;
		}
		m_txtUploadResult.setText('');
	};
	
	var onFileUpload = function() {
		if (m_fileSelected) {
			m_fileUpload.upload(uploadUrl, onFileUploaded);
		} else {
			m_txtUploadResult.setText(TLang.translate('selectFileFirst') + '.');
			m_window.refresh();
		}
	};
	
	var onFileUploaded = function(response) {
		m_txtUploadResult.setText(response);
		m_window.refresh();
	};
	
	var onOkClick = function() {
		if (validateInput()) {
			if (m_imgPreview != null) { m_imgPreview.hide(); }
			if (m_me != null) { writeImageProperties(); }
			hideModal();
		
			if (m_callback != null) {
				m_callback(true);
			}
		}
	};
	
	var onRefreshClick = function() {
        if (validateInput()) {
        	var height = 250, width = 300;
        	
			if (m_tbWidth.getValue() != '') {
				width = m_tbWidth.getValue();
			} 
			
			if (m_tbHeight.getValue() != '') {
				height = m_tbHeight.getValue();
			} 
			
			if (m_imgPreview == null) {
				m_imgPreview = new TImage(m_vtbURL.getValue(), width, height, m_brkPreview);
			} else {
				m_imgPreview.setAttribute('src', m_vtbURL.getValue());
				m_imgPreview.setAttribute('style', 'height:' + height + '; width:' + width + ';');
			}
			
			if (m_tbBorder.getValue() != '') {
				m_imgPreview.setAttribute('border', m_tbBorder.getValue() + 'px');
			} else {
				m_imgPreview.setAttribute('border', '0px');
			}
			
			if (m_tbHSpace.getValue() != '') {
				m_imgPreview.setAttribute('hspace', m_tbHSpace.getValue());
			} else {
				m_imgPreview.setAttribute('hspace', '0');
			}
			
			if (m_tbVSpace.getValue() != '') {
				m_imgPreview.setAttribute('vspace', m_tbVSpace.getValue());
			} else {
				m_imgPreview.setAttribute('vspace', '0');
			}
			
			if (m_ddlAlign.getSelectedId() != 0) {
				m_imgPreview.setAttribute('align', m_ddlAlign.getText());
			}
			
			m_imgPreview.show();
		}
    };
	
	var onReturnClick = function() {
        if (m_imgPreview != null) { m_imgPreview.hide(); }
        hideModal();
        
        if (m_callback != null) {
			m_callback(false);
		}
    };
	
	var onSelectedTabChanged = function() {
		if (m_imgPreview != null) {
			if (m_tab.getSelectedTabName() == 'imgInfo') {
				m_imgPreview.show();
			} else {
				m_imgPreview.hide();
			}
		}
	};
	
	var onServerFileSelected = function() {
		var sItems = m_wndFinder.getSelectedItems();
		var url = '';
		var size = null;
		if(sItems.length) {
			var type = sItems[0].type.toLowerCase().split('/');
			if (type[0] == 'image') {
				url = sItems[0].url;
				size = calculateFitImageSize(url, 300, 250);
			}
		}
		if (m_imgPreview != null) {
			m_imgPreview.destroy();
		}
		if (size != null) { 
			m_imgPreview = new TImage(url, size.width, size.height, m_brkPreview);
			m_tbHeight.setValue(size.height);
			m_tbWidth.setValue(size.width);
		} else {
			m_imgPreview = new TImage(url, 300, 250, m_brkPreview);
			m_tbHeight.setValue('250');
			m_tbWidth.setValue('300');
		}
		m_imgPreview.show();
		m_vtbURL.setValue(url);
		m_tbBorder.setValue('0');
		m_tbHSpace.setValue('0');
		m_tbVSpace.setValue('0');
		m_wndFinder.hide();
	};
	
	var readImageProperties = function() {
		m_vtbURL.setValue(m_me.src);
		m_tbAlt.setValue(m_me.alt);
		m_tbWidth.setValue(m_me.width);
		m_tbHeight.setValue(m_me.height);
		var border = m_me.border;
		if (border != '') {
			var index;
			if (index = border.indexOf('px') != -1) {
				border = border.substring(0, index);
			}
		}
		m_tbBorder.setValue(border);
		m_tbHSpace.setValue(m_me.hspace);
		m_tbVSpace.setValue(m_me.vspace);
		if (m_me.align != '' && m_me.align != null) { m_ddlAlign.setSelectedItem(m_me.align); }
		m_imgPreview = new TImage(m_me.src, m_me.width, m_me.height, m_brkPreview);
		m_imgPreview.setAttribute('border', m_me.border);
		m_imgPreview.setAttribute('hspace', m_me.hspace);
		m_imgPreview.setAttribute('vspace', m_me.vspace);
		m_imgPreview.show();
	};
	
	var validateInput = function() { 
		if (!m_urlValidator.validate(m_vtbURL.getValue())) {
			return false;
		}
		
		if (m_tbHeight.getValue() != '' && (!isInt(m_tbHeight.getValue()) || parseInt(m_tbHeight.getValue()) < 0)) {
			m_tbHeight.setBackground('#ff0000');
			return false;
		} else {
			m_tbHeight.setBackground('#ffffff');
		}
		
		if (m_tbWidth.getValue() != '' && (!isInt(m_tbWidth.getValue()) || parseInt(m_tbWidth.getValue()) < 0)) {
			m_tbWidth.setBackground('#ff0000');
			return false;
		} else {
			m_tbWidth.setBackground('#ffffff');
		}
		
		if (m_tbBorder.getValue() != '' && (!isInt(m_tbBorder.getValue()) || parseInt(m_tbBorder.getValue()) < 0)) {
			m_tbBorder.setBackground('#ff0000');
			return false;
		} else {
			m_tbBorder.setBackground('#ffffff');
		}
		
		if (m_tbHSpace.getValue() != '' && (!isInt(m_tbHSpace.getValue()) || parseInt(m_tbHSpace.getValue()) < 0)) {
			m_tbHSpace.setBackground('#ff0000');
			return false; 
		} else {
			m_tbHSpace.setBackground('#ffffff');
		}
		
		if (m_tbVSpace.getValue() != '' && (!isInt(m_tbVSpace.getValue()) || parseInt(m_tbVSpace.getValue()) < 0)) {
			m_tbVSpace.setBackground('#ff0000');
			return false;
		} else {
			m_tbVSpace.setBackground('#ffffff');
		}
		
		return true;
	};
	
	var writeImageProperties = function() {
		if (m_ddlAlign.getText() != 'Not Set') { m_me.align = m_ddlAlign.getText(); }
		
		m_me.alt = m_tbAlt.getValue();
		
		if (m_tbBorder.getValue() != '') {
			m_me.border = m_tbBorder.getValue() + 'px';
		}
			
		if (m_tbHeight.getValue() != '') {
			m_me.style.height = m_tbHeight.getValue() + 'px';
		}
			
		if (m_tbHSpace.getValue() != '') {
			m_me.hspace = m_tbHSpace.getValue();
		}
		
		m_me.src = m_vtbURL.getValue();
			
		if (m_tbVSpace.getValue() != '') {
			m_me.vspace = m_tbVSpace.getValue();
		}
			
		if (m_tbWidth.getValue() != '') {
			m_me.style.width = m_tbWidth.getValue() + 'px';
		}
	};
	
	this.getImageProperties = function() {
		if (validateInput()) {
			var imgPro = new Array();
			var border = '0px';
			var height = 250;
			var hspace = 0;
			var vspace = 0;
			var width = 300;
			
			if (m_tbBorder.getValue() != '') {
				border = m_tbBorder.getValue() + 'px';
			}
			
			if (m_tbHeight.getValue() != '') {
				height = m_tbHeight.getValue();
			}
			
			if (m_tbHSpace.getValue() != '') {
				hspace = m_tbHSpace.getValue();
			}
			
			if (m_tbVSpace.getValue() != '') {
				vspace = m_tbVSpace.getValue();
			}
			
			if (m_tbWidth.getValue() != '') {
				width = m_tbWidth.getValue();
			}
			
			imgPro.push({ align: m_ddlAlign.getText(), alt: m_tbAlt.getValue(), border: border, height: height, width: width, hspace: hspace, vspace: vspace, url: m_vtbURL.getValue() });
			return imgPro;
		} 
		return null;
	};
	
	this.show = function() {
        showModal(m_window);
        m_tbAlt.setFocus();
    };
	
	if (m_me != null) {
		readImageProperties();
	}
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layMain.setDirection('rtl');
		m_layProperties.setDirection('rtl');
		m_layTop.setDirection('rtl');
		m_layUpload.setDirection('rtl');
		m_tab.setDirection('rtl');
		m_tbAlt.setDirection('rtl');
		m_tbBorder.setDirection('rtl');
		m_tbHSpace.setDirection('rtl');
		m_tbHeight.setDirection('rtl');
		m_tbVSpace.setDirection('rtl');
		m_tbWidth.setDirection('rtl');
		m_vtbURL.setDirection('rtl');
	}
	
	m_btnRefresh.setOnClick(onRefreshClick);
	m_btnBrowse.setOnClick(onBrowseServerClick);
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnUpload.setOnClick(onFileUpload);
	
	m_brkPreview.setBackground('#FFFFFF');
	m_brkPreview.setBorder('#80B0D0', 1, 1, 1, 1);
	m_brkPreview.setOverflow('auto');
	m_brkPreview.setSize(300, 250);
	
	m_ddlAlign.add(0, 'Not Set');
	m_ddlAlign.add(1, 'left');
	m_ddlAlign.add(2, 'center');
	m_ddlAlign.add(3, 'right');
	m_ddlAlign.setSelectedId(0);
	
	m_fileUpload.setOnClick(onClientFileSelected);
	m_vtbURL.setReadOnly();
	
	m_layTop.setCell(0, 0, new TText('URL'));
	m_layTop.setCell(1, 0, m_vtbURL);
	m_layTop.setCell(2, 0, m_btnBrowse);
	m_layTop.setCell(0, 1, new TText(TLang.translate('alternativeText')));
	m_layTop.setCell(1, 1, m_tbAlt);
	
	m_layProperties.add(new TText(TLang.translate('width')), m_tbWidth);
	m_layProperties.add(new TText(TLang.translate('height')), m_tbHeight);
	m_layProperties.add(new TText(TLang.translate('border')), m_tbBorder);
	m_layProperties.add(new TText('HSpace'), m_tbHSpace);
	m_layProperties.add(new TText('VSpace'), m_tbVSpace);
	m_layProperties.add(new TText(TLang.translate('alignment')), m_ddlAlign);
	
	m_layPreview.add(new TText(TLang.translate('preview')));
	m_layPreview.add(m_brkPreview);
	m_layPreview.add(m_btnRefresh);
	
	m_layMain.add(m_layProperties);
	m_layMain.add(new THorizontalDelimiter(20));
	m_layMain.add(m_layPreview);
	
	m_layUpload.setCell(0, 0, new TText(TLang.translate('selectFile')));
	m_layUpload.setCell(1, 0, m_fileUpload);
	m_layUpload.setCell(2, 0, m_txtFile);
	m_layUpload.setCell(3, 1, m_btnUpload);
	
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_tab.addTab('imgInfo', TLang.translate('imageInfo'));
	m_tab.addTab('imgUpload', TLang.translate('upload'));
	m_tab.setOnSelectedTabChanged(onSelectedTabChanged);
	m_tab.addTabItem('imgInfo', m_layTop);
	m_tab.addTabItem('imgInfo', m_layMain);
	m_tab.addTabItem('imgUpload', m_layUpload);
	m_tab.addTabItem('imgUpload', m_txtUploadResult);
	
	m_window.add(m_tab);
	m_window.add(m_layCommands);
};

function TCellWindow(cell, callback) {
	var m_backColor      = null;
	var m_borderColor    = null;
	var m_btnOk          = new TButton(TLang.translate('ok'));
	var m_btnCancel      = new TButton(TLang.translate('cancel'));
	var m_btnChooseBackColor   = new TButton(TLang.translate('choose'));
	var m_btnChooseBorderColor = new TButton(TLang.translate('choose'));
	var m_callback       = (callback === undefined || callback == null) ? null : callback;
	var m_ddlHAlign      = new TDropdownList();
	var m_ddlMeasure     = new TDropdownList();
	var m_ddlVAlign      = new TDropdownList();
	var m_ddlWordWrap    = new TDropdownList();
	var m_layCommands    = new THorizontalLayout();
	var m_layMain        = new TGridLayout(6, 3);
	var m_tbBackColor    = new TTextBox(60);
	var m_tbBorderColor  = new TTextBox(60);
	var m_tbHeight       = new TTextBox(60);
	var m_tbWidth        = new TTextBox(60);
	var m_window         = createWindow(TLang.translate('cellProperties'));
	var m_wndSelectColor = null;
	
	var onBackColorClick = function() {
		m_wndSelectColor = new TSelectColorWindow(function() { onColorSelected('back'); });
		m_wndSelectColor.show();
	};
	
	var onBorderColorClick = function() {
		m_wndSelectColor = new TSelectColorWindow(function() { onColorSelected('border'); });
		m_wndSelectColor.show();
	};
	
	var onColorSelected = function(type) {
		var color = m_wndSelectColor.getSelectedColor();
		if (color != null) {
			if (type == 'border') {
				m_borderColor = color;
				m_tbBorderColor.setBackground(color);
			} else {
				m_backColor = color;
				m_tbBackColor.setBackground(color);
			}
		}
	};
	
	var onCancelClick = function() {
		hideModal();
	};
	
	var onOkClick = function() {
		if (validateInput()) {
			setProperties();
			hideModal();
			if (m_callback != null) {
				m_callback();
			}
		}
	};
	
	var setProperties = function() {
		var styles = cell.getAttribute('style');
		var width = false, height = false, border = false, back = false, word = false;
		var style = '';
		if (styles != null) {
			styles = styles.split(";");
			for (var i = 0; i < styles.length; i++) {
				var attributes = styles[i].split(":");
				if (attributes.length == 2) {
					var attr = trim(attributes[0]).toLowerCase();
					var value = trim(attributes[1]).toLowerCase();
					if (attr == 'width' && m_tbWidth.getValue() != '') {
						width = true;
						styles[i] = 'width: ' + m_tbWidth.getValue() + m_ddlMeasure.getText();
					} else if (attr == 'height' && m_tbHeight.getValue() != '') {
						height = true;
						styles[i] = 'height: ' + m_tbHeight.getValue() + 'px';
					} else if ((attr == 'background' || attr == 'background-color') && m_backColor != null) {
						back = true;
						styles[i] = attr + ': ' + m_backColor;
					} else if ((attr == 'border' || attr == 'border-color') && m_borderColor != null) {
						border = true;
						if (attr == 'border') {
							var pos = value.indexOf('rgb');
							if (pos == -1) {
								pos = value .indexOf('#');
							}
							value = value.substring(0, pos);
							styles[i] = 'border: ' + value + m_borderColor;
						} else {
							styles[i] = 'border-color: ' + m_borderColor;
						}
					} else if (attr == 'word-wrap') {
						word = true;
						styles[i] = 'word-wrap: ' + m_ddlWordWrap.getText().toLowerCase();
					}
				}
			}
			
			if (!width && m_tbWidth.getValue() != '') {
				styles.push('width: ' + m_tbWidth.getValue() + m_ddlMeasure.getText());
			}
			if (!height && m_tbHeight.getValue() != '') {
				styles.push('height: ' + m_tbHeight.getValue() + 'px');
			}
			if (!border && m_borderColor != null) {
				styles.push('border-color: ' + m_borderColor);
			}
			if (!back && m_backColor != null) {
				styles.push('background: ' + m_backColor);
			}
			if (!word) {
				styles.push('word-wrap: ' + m_ddlWordWrap.getText().toLowerCase());
			}
			
			for (var i = 0; i < styles.length; i++) {
				style += styles[i] + '; ';
			}
		} else {
			if (m_tbWidth.getValue() != '') {
				style += 'width: ' + m_tbWidth.getValue() + m_ddlMeasure.getText();
			}
			if (m_tbHeight.getValue() != '') {
				style += 'height: ' + m_tbHeight.getValue() + 'px';
			}
			if (m_borderColor != null) {
				style += 'border-color: ' + m_borderColor;
			}
			if (m_backColor != null) {
				style += 'background: ' + m_backColor;
			}
			style += 'word-wrap: ' + m_ddlWordWrap.getText().toLowerCase();
		}
		if (style != '') {
			cell.setAttribute('style', style);
		}
		if (m_ddlHAlign.getSelectedId() != 0) {
			cell.setAttribute('align', m_ddlHAlign.getText());
		}
		if (m_ddlVAlign.getSelectedId() != 0) {
			cell.setAttribute('valign', m_ddlVAlign.getText());
		}
	};
	
	var trim = function(str) {
		return str.replace(/^\s*|\s*$/g,"");
	};
	
	var validateInput = function() {
		if (m_tbHeight.getValue() != '') {
			if (!isInt(m_tbHeight.getValue()) || parseInt(m_tbHeight.getValue()) < 0) {
				m_tbHeight.setBackground('#ff0000');
				return false;
			} else {
				m_tbHeight.setBackground('#ffffff');
			}
		}
		
		if (m_tbWidth.getValue() != '') {
			if (!isInt(m_tbWidth.getValue()) || parseInt(m_tbWidth.getValue()) < 0) {
				m_tbWidth.setBackground('#ff0000');
				return false;
			} else {
				m_tbWidth.setBackground('#ffffff');
			}	
		}
		 
		return true;
	};
	
	this.show = function() {
		showModal(m_window);
		m_tbWidth.setFocus();
	};
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layMain.setDirection('rtl');
		m_tbBackColor.setDirection('rtl');
		m_tbBorderColor.setDirection('rtl');
		m_tbHeight.setDirection('rtl');
		m_tbWidth.setDirection('rtl');
	}
	
	m_btnChooseBackColor.setOnClick(onBackColorClick);
	m_btnChooseBorderColor.setOnClick(onBorderColorClick);
	m_btnCancel.setOnClick(onCancelClick);
	m_btnOk.setOnClick(onOkClick);
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnCancel);
	
	m_tbBackColor.setReadOnly();
	m_tbBorderColor.setReadOnly();
	
	m_ddlHAlign.add(0, 'Not Set');
	m_ddlHAlign.add(1, 'Left');
	m_ddlHAlign.add(2, 'Center');
	m_ddlHAlign.add(3, 'Right');
	m_ddlHAlign.setSelectedId(0);
	m_ddlMeasure.add(0, '%');
	m_ddlMeasure.add(1, 'px');
	m_ddlMeasure.setSelectedId(0);
	m_ddlVAlign.add(0, 'Not Set');
	m_ddlVAlign.add(1, 'Top');
	m_ddlVAlign.add(2, 'Middle');
	m_ddlVAlign.add(3, 'Bottom');
	m_ddlVAlign.setSelectedId(0);
	m_ddlWordWrap.add(0, 'Yes');
	m_ddlWordWrap.add(1, 'No');
	m_ddlWordWrap.setSelectedId(0);
	
	m_layMain.setCell(0, 0, new TText(TLang.translate('width')));
	m_layMain.setCell(1, 0, m_tbWidth);
	m_layMain.setCell(2, 0, m_ddlMeasure);
	m_layMain.setCell(3, 0, new TText(TLang.translate('backColor')));
	m_layMain.setCell(4, 0, m_tbBackColor);
	m_layMain.setCell(5, 0, m_btnChooseBackColor);
	m_layMain.setCell(0, 1, new TText(TLang.translate('height')));
	m_layMain.setCell(1, 1, m_tbHeight);
	m_layMain.setCell(2, 1, new TText('px'));
	m_layMain.setCell(3, 1, new TText(TLang.translate('borderColor')));
	m_layMain.setCell(4, 1, m_tbBorderColor);
	m_layMain.setCell(5, 1, m_btnChooseBorderColor);
	m_layMain.setCell(0, 2, new TText(TLang.translate('wordWrap')));
	m_layMain.setCell(1, 2, m_ddlWordWrap);
	m_layMain.setCell(2, 2, new TText(TLang.translate('horizontalAlign')));
	m_layMain.setCell(3, 2, m_ddlHAlign);
	m_layMain.setCell(4, 2, new TText(TLang.translate('verticalAlign')));
	m_layMain.setCell(5, 2, m_ddlVAlign);
	
	m_window.add(m_layMain);
	m_window.add(m_layCommands);
};

function TTableWindow(callback, update) {
	var m_backColor      = null;
	var m_borderColor    = null;
	var m_btnChooseBackColor   = new TButton(TLang.translate('choose'));
	var m_btnChooseBorderColor = new TButton(TLang.translate('choose'));
	var m_btnOk          = new TButton(TLang.translate('ok'));
	var m_btnReturn      = new TButton(TLang.translate('cancel'));
	var m_callback       = (callback === undefined || callback == null) ? null : callback;
	var m_ddlAlign       = new TDropdownList();
	var m_ddlBorderStyle = new TDropdownList();
	var m_ddlMeasure     = new TDropdownList();
	var m_layCommands    = new THorizontalLayout();
	var m_layGrid        = new TGridLayout(5, 5);
	var m_tbBackColor    = new TTextBox(60);
	var m_tbBorderColor  = new TTextBox(60);
	var m_tbBorderSize   = new TTextBox(60);
	var m_tbCellPadding  = new TTextBox(60);
	var m_tbCellSpacing  = new TTextBox(60);
	var m_tbColumns      = new TTextBox(60);
	var m_tbRows         = new TTextBox(60);
	var m_tbWidth        = new TTextBox(60);
	var m_window         = createWindow(TLang.translate('table'));
	var m_wndSelectColor = null;
	update = (update === undefined || update == null) ? false : update;
	
	var onBackColorClick = function() {
		m_wndSelectColor = new TSelectColorWindow(function() { onColorSelected('back'); });
		m_wndSelectColor.show();
	};
	
	var onBorderColorClick = function() {
		m_wndSelectColor = new TSelectColorWindow(function() { onColorSelected('border'); });
		m_wndSelectColor.show();
	};
	
	var onColorSelected = function(type) {
		var color = m_wndSelectColor.getSelectedColor();
		if (color != null) {
			if (type == 'border') {
				m_borderColor = color;
				m_tbBorderColor.setBackground(color);
			} else {
				m_backColor = color;
				m_tbBackColor.setBackground(color);
			}
		}
	};
	
	var onOkClick = function() {
		if (validateInput()) {
			hideModal();
		
			if (m_callback != null) {
				m_callback(true);
			}
		}
	};
	
	var onReturnClick = function() {
        hideModal();
        if (m_callback != null) {
			m_callback(false);
		}
    };
	
	var validateInput = function() {
		if (!update) {
			if (m_tbRows.getValue() == '' || !isInt(m_tbRows.getValue()) || parseInt(m_tbRows.getValue()) < 0) {
				m_tbRows.setBackground('#ff0000');
				return false;
			} else {
				m_tbRows.setBackground('#ffffff');
			}
			
			if (m_tbColumns.getValue() == '' || !isInt(m_tbColumns.getValue()) || parseInt(m_tbColumns.getValue()) < 0) {
				m_tbColumns.setBackground('#ff0000');
				return false;
			} else {
				m_tbColumns.setBackground('#ffffff');
			}
		}
		
		if (m_tbBorderSize.getValue() == '' || !isInt(m_tbBorderSize.getValue()) || parseInt(m_tbBorderSize.getValue()) < 0) {
			m_tbBorderSize.setBackground('#ff0000');
			return false;
		} else {
			m_tbBorderSize.setBackground('#ffffff');
		}
		
		if (m_tbCellPadding.getValue() == '' || !isInt(m_tbCellPadding.getValue()) || parseInt(m_tbCellPadding.getValue()) < 0) {
			m_tbCellPadding.setBackground('#ff0000');
			return false;
		} else {
			m_tbCellPadding.setBackground('#ffffff');
		}
		 
		if (m_tbCellSpacing.getValue() == '' || !isInt(m_tbCellSpacing.getValue()) || parseInt(m_tbCellSpacing.getValue()) < 0) {
			m_tbCellSpacing.setBackground('#ff0000');
			return false;
		} else {
			m_tbCellSpacing.setBackground('#ffffff');
		}
		
		if (m_tbWidth.getValue() == '' || !isInt(m_tbWidth.getValue()) || parseInt(m_tbWidth.getValue()) < 0) {
			m_tbWidth.setBackground('#ff0000');
			return false;
		} else {
			m_tbWidth.setBackground('#ffffff');
		}
		 
		return true;
	};
	
	this.getTableProperties = function() {
		if (validateInput()) {
			var tblPro = new Array();
			var align = null;
			var style = 'border:' + m_tbBorderSize.getValue() + 'px;';
			var width = m_tbWidth.getValue() + m_ddlMeasure.getText();
			
			if (m_ddlBorderStyle.getText != 'None') {
				style += ' border-style:' + m_ddlBorderStyle.getText().toLowerCase() + ';';
			}
			
			if (m_ddlAlign.getSelectedId() != 0) {
				align = m_ddlAlign.getText().toLowerCase();
			}
			
			if (m_borderColor != null) {
				style += ' border-color:' + m_borderColor + ';';
			}
			
			if (m_backColor != null) {
				style += ' background:' + m_backColor + ';';
			}
			
			tblPro.push({ cols: m_tbColumns.getValue(), rows: m_tbRows.getValue(), cellPadding: m_tbCellPadding.getValue(), cellSpacing: m_tbCellSpacing.getValue(), align: align, width: width, style: style });
			return tblPro;
		} 
		return null;
	};
	
	this.show = function() {
        showModal(m_window);
        m_tbRows.setFocus();
        if (update) {
        	m_tbRows.setValue('');
        	m_tbRows.disable();
        	m_tbColumns.setValue('');
        	m_tbColumns.disable();
        	m_tbCellPadding.setFocus();
        }
    };
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layGrid.setDirection('rtl');
		m_tbBackColor.setDirection('rtl');
		m_tbBorderColor.setDirection('rtl');
		m_tbBorderSize.setDirection('rtl');
		m_tbCellPadding.setDirection('rtl');
		m_tbCellSpacing.setDirection('rtl');
		m_tbColumns.setDirection('rtl');
		m_tbRows.setDirection('rtl');
		m_tbWidth.setDirection('rtl');
	}
	
	m_btnChooseBackColor.setOnClick(onBackColorClick);
	m_btnChooseBorderColor.setOnClick(onBorderColorClick);
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_tbBackColor.setReadOnly();
	m_tbBorderColor.setReadOnly();
	m_tbBorderSize.setValue('0');
	m_tbCellPadding.setValue('0');
	m_tbCellSpacing.setValue('0');
	m_tbColumns.setValue('2');
	m_tbRows.setValue('2');
	m_tbWidth.setValue('100');
	
	m_ddlAlign.add(0, 'Not Set');
	m_ddlAlign.add(1, 'Left');
	m_ddlAlign.add(2, 'Center');
	m_ddlAlign.add(3, 'Right');
	m_ddlAlign.setSelectedId(0);
	m_ddlBorderStyle.add(0, 'None');
	m_ddlBorderStyle.add(1, 'Solid');
	m_ddlBorderStyle.add(2, 'Double');
	m_ddlBorderStyle.add(3, 'Dotted');
	m_ddlBorderStyle.add(4, 'Dashed');
	m_ddlBorderStyle.add(5, 'Groove');
	m_ddlBorderStyle.add(6, 'Ridge');
	m_ddlBorderStyle.add(7, 'Inset');
	m_ddlBorderStyle.add(8, 'Outset');
	m_ddlBorderStyle.setSelectedId(0);
	m_ddlMeasure.add(0, '%');
	m_ddlMeasure.add(1, 'px');
	m_ddlMeasure.setSelectedId(0);
	
	m_layGrid.setCell(0, 0, new TText(TLang.translate('rows')));
	m_layGrid.setCell(1, 0, m_tbRows);
	m_layGrid.setCell(2, 0, new TText(TLang.translate('width')));
	m_layGrid.setCell(3, 0, m_tbWidth);
	m_layGrid.setCell(4, 0, m_ddlMeasure);
	m_layGrid.setCell(0, 1, new TText(TLang.translate('columns')));
	m_layGrid.setCell(1, 1, m_tbColumns);
	m_layGrid.setCell(2, 1, new TText(TLang.translate('alignment')));
	m_layGrid.setCell(3, 1, m_ddlAlign);
	m_layGrid.setCell(0, 2, new TText(TLang.translate('cellPadding')));
	m_layGrid.setCell(1, 2, m_tbCellPadding);
	m_layGrid.setCell(2, 2, new TText(TLang.translate('backColor')));
	m_layGrid.setCell(3, 2, m_tbBackColor);
	m_layGrid.setCell(4, 2, m_btnChooseBackColor);
	m_layGrid.setCell(0, 3, new TText(TLang.translate('cellSpacing')));
	m_layGrid.setCell(1, 3, m_tbCellSpacing);
	m_layGrid.setCell(2, 3, new TText(TLang.translate('borderColor')));
	m_layGrid.setCell(3, 3, m_tbBorderColor);
	m_layGrid.setCell(4, 3, m_btnChooseBorderColor);
	m_layGrid.setCell(0, 4, new TText(TLang.translate('borderSize')));
	m_layGrid.setCell(1, 4, m_tbBorderSize);
	m_layGrid.setCell(2, 4, new TText(TLang.translate('borderStyle')));
	m_layGrid.setCell(3, 4, m_ddlBorderStyle);
	m_layGrid.alignRight();
	
	m_window.add(m_layGrid);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function THyperlinkWindow(callback) {
	var m_btnOk          = new TButton(TLang.translate('ok'));
	var m_btnReturn      = new TButton(TLang.translate('cancel'));
	var m_callback       = (callback === undefined || callback == null) ? null : callback;
	var m_layCommands    = new THorizontalLayout();
	var m_layForm        = new TFormLayout();
	var m_tbURL          = new TTextBox(200);
	var m_tbName         = new TTextBox(100);
	var m_urlValidator   = new TURLValidator();
	var m_window         = createWindow(TLang.translate('hyperlink'));
	
	var onOkClick = function() {
		if (validateInput()) {
			hideModal();
		
			if (m_callback != null) {
				m_callback(true);
			}
		}
	};
	
	var onReturnClick = function() {
        hideModal();
        
        if (m_callback != null) {
			m_callback(false);
		}
    };
	
	var validateInput = function() {
		if (m_tbURL.getValue() == '' || !m_urlValidator.validate(m_tbURL.getValue())) {
			m_tbURL.setBackground('#ff0000');
			return false;
		} else {
			m_tbURL.setBackground('#ffffff');
		}
		
		if (m_tbName.getValue() == '') {
			m_tbName.setBackground('#ff0000');
			return false;
		} else {
			m_tbName.setBackground('#ffffff');
		}
		
		return true;
	};
	
	this.getLink = function() {
		if (validateInput()) {
			return { name: m_tbName.getValue(), url: m_tbURL.getValue() };
		}
		return null;
	};
	
	this.show = function() {
        m_tbURL.setValue('http://www.');
        showModal(m_window);
        m_tbURL.setFocus();
    };
    
    if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layForm.setDirection('rtl');
		m_tbName.setDirection('rtl');
		m_tbURL.setDirection('rtl');
	}
    
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_layForm.add(new TText('URL'), m_tbURL);
	m_layForm.add(new TText('Name'), m_tbName);
	
	m_window.add(m_layForm);
	m_window.add(new TVerticalDelimiter(5));
	m_window.add(m_layCommands);
};

function TVideoWindow(foldersUrl, videoUrl, addVideoUrl, editVideoUrl, deleteVideoUrl, searchUrl, saveImageUrl, callback) {
	var m_btnBrowse1      = new TButton(TLang.translate('browseServer'));
	var m_btnBrowse2      = new TButton(TLang.translate('browseServer'));
	var m_btnOk           = new TButton(TLang.translate('ok'));
	var m_btnReturn       = new TButton(TLang.translate('cancel'));
	var m_btnUpload       = new TButton(TLang.translate('uploadToServer'));
	var m_callback        = (callback === undefined || callback == null) ? null : callback;
	var m_fileSelected    = false;
	var m_fileUpload      = new TFileUploader(TLang.translate('browse'));
	var m_layCommands     = new THorizontalLayout();
	var m_layTop          = new TGridLayout(3, 4);
	var m_layUpload       = new TGridLayout(4, 2);
	var m_tab             = new TTab();
	var m_tbHeight        = new TTextBox(380);
	var m_tbWidth         = new TTextBox(380);
	var m_txtFile         = new TText(TLang.translate('noFileSelected') + '.');
	var m_txtUploadResult = new TText('');
	var m_url1Validator   = new TEmptyValidator();
	var m_url2Validator   = new TEmptyValidator();
	var m_vtbURL1         = new TValidatableTextBox(380, m_url1Validator);
	var m_vtbURL2         = new TValidatableTextBox(380, m_url2Validator);
	var m_window          = createWindow(TLang.translate('video'));
	var m_wndFinder       = null;
	
	var onBrowseServerClick = function(whom) {
		if (!m_wndFinder) {
            m_wndFinder = new TFinderWindow(foldersUrl, videoUrl, addVideoUrl, editVideoUrl, deleteVideoUrl, searchUrl, null, saveImageUrl);
        }
		m_wndFinder.setOnFileDblClick(function() { onServerFileSelected(whom); });
        m_wndFinder.show();
	};
	
	var onClientFileSelected = function(files) {
		if (files.length > 0) {
			m_txtFile.setText(files[0].name + ' (' + (files[0].size / 1024) + ' KB)');
			m_fileSelected = true;
			m_window.refresh();
		} else {
			m_txtFile.setText(TLang.translate('noFileSelected') + '.');
			m_fileSelected = false;
		}
		m_txtUploadResult.setText('');
	};
	
	var onFileUpload = function() {
		if (m_fileSelected) {
			m_fileUpload.upload(uploadUrl, onFileUploaded);
		} else {
			m_txtUploadResult.setText(TLang.translate('selectFileFirst') + '.');
			m_window.refresh();
		}
	};
	
	var onFileUploaded = function(response) {
		m_txtUploadResult.setText(response);
		m_window.refresh();
	};
	
	var onOkClick = function() {
		hideModal();
		
		if (m_callback != null) {
			m_callback(true);
		}
	};
	
	var onReturnClick = function() {
        hideModal();
        
        if (m_callback != null) {
			m_callback(false);
		}
    };
	
	var onServerFileSelected = function(whom) {
		var sItems = m_wndFinder.getSelectedItems();
		var url = '';
		var subType = '';
		if(sItems.length) {
			if (sItems[0].type == 'video') { url = sItems[0].url; subType = sItems[0].type.toLowerCase().split('/')[1]; }
		}
		
		if (whom == 1 && subType == 'mp4') {
			m_vtbURL1.setValue(url);
		} else if (whom == 2 && subType == 'ogg') {
			m_vtbURL2.setValue(url);
		}
		
		m_wndFinder.hide();
	};
	
	var validateInput = function() { 
		if (m_tbHeight.getValue() == '' || !isInt(m_tbHeight.getValue()) || parseInt(m_tbHeight.getValue()) < 0) {
			m_tbHeight.setBackground('#ff0000');
			return false;
		} else {
			m_tbHeight.setBackground('#ffffff');
		}
		
		if (m_tbWidth.getValue() == '' || !isInt(m_tbWidth.getValue()) || parseInt(m_tbWidth.getValue()) < 0) {
			m_tbWidth.setBackground('#ff0000');
			return false;
		} else {
			m_tbWidth.setBackground('#ffffff');
		}
		
		if (!m_url1Validator.validate(m_vtbURL1.getValue())) {
			return false;
		}
		
		if (!m_url2Validator.validate(m_vtbURL2.getValue())) {
			return false;
		}
		
		return true;
	};
	
	this.getVideoProperties = function() {
		if (validateInput()) {
			var videoPro = new Array();
			
			videoPro.push({ url1: m_vtbURL1.getValue(), url2: m_vtbURL2.getValue(), height: m_tbHeight.getValue(), width: m_tbWidth.getValue() });
			return videoPro;
		} 
		return null;
	};
	
	this.show = function() {
        showModal(m_window);
    };
	
	if (TLang.getLanguage() == 'ar') {
		m_layCommands.setDirection('rtl');
		m_layTop.setDirection('rtl');
		m_layUpload.setDirection('rtl');
		m_tab.setDirection('rtl');
		m_tbHeight.setDirection('rtl');
		m_tbWidth.setDirection('rtl');
		m_vtbURL1.setDirection('rtl');
		m_vtbURL2.setDirection('rtl');
	}
	
	m_btnBrowse1.setOnClick(function() { onBrowseServerClick(1); });
	m_btnBrowse2.setOnClick(function() { onBrowseServerClick(2); });
	m_btnReturn.setOnClick(onReturnClick);
	m_btnOk.setOnClick(onOkClick);
	m_btnUpload.setOnClick(onFileUpload);
	
	m_fileUpload.setOnClick(onClientFileSelected);
	m_tbHeight.setValue('240');
	m_tbWidth.setValue('320');
	m_vtbURL1.setReadOnly();
	m_vtbURL2.setReadOnly();
	
	m_layTop.setCell(0, 0, new TText('URL1 (mp4)'));
	m_layTop.setCell(1, 0, m_vtbURL1);
	m_layTop.setCell(2, 0, m_btnBrowse1);
	m_layTop.setCell(0, 1, new TText('URL2 (ogg)'));
	m_layTop.setCell(1, 1, m_vtbURL2);
	m_layTop.setCell(2, 1, m_btnBrowse2);
	m_layTop.setCell(0, 2, new TText(TLang.translate('height')));
	m_layTop.setCell(1, 2, m_tbHeight);
	m_layTop.setCell(2, 2, new TText(''));
	m_layTop.setCell(0, 3, new TText(TLang.translate('width')));
	m_layTop.setCell(1, 3, m_tbWidth);
	m_layTop.setCell(2, 3, new TText(''));
	
	m_layUpload.setCell(0, 0, new TText(TLang.translate('selectFile')));
	m_layUpload.setCell(1, 0, m_fileUpload);
	m_layUpload.setCell(2, 0, m_txtFile);
	m_layUpload.setCell(3, 1, m_btnUpload);
	
	m_layCommands.add(m_btnOk);
	m_layCommands.add(m_btnReturn);
	
	m_tab.addTab('videoInfo', TLang.translate('video'));
	m_tab.addTab('videoUpload', TLang.translate('upload'));
	m_tab.addTabItem('videoInfo', m_layTop);
	m_tab.addTabItem('videoUpload', m_layUpload);
	m_tab.addTabItem('videoUpload', m_txtUploadResult);
	
	m_window.add(m_tab);
	m_window.add(m_layCommands);
};