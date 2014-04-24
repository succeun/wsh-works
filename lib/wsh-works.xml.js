///////////////////////////////////////////////////////////////////////////////
/**
 * �����ͼ� �Ǵ� XML ������ XSLT�� �̿��Ͽ� ��ȯ ������ ��´�.
 * (����) new XMLTransformer().transform("datasetlist.xsl", resxml);
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function XMLTransformer() {
	this.getXMLDoc = function() {
		var versions = [
             'Msxml2.DOMDocument.6.0',
			 'Msxml2.DOMDocument.5.0',
             'Msxml2.DOMDocument.4.0',
             'Msxml2.DOMDocument.3.0',
             'Msxml2.DOMDocument.2.0',
             'Msxml2.DOMDocument'            
        ];

		xmldoc = null;
		for (var i = 0; i < versions.length; i++) {
			try {
				xmldoc = new ActiveXObject(versions[i]);
				break;
			} catch (e) { }
		}
		return xmldoc;
	}

    /**
	 * xsl ������ �ִ� URL�� ���� XSL�� ����Ͽ�,
	 * XML ���ڿ� �Ǵ� DataSet ��ü�� �����Ͽ�,
	 * ���ϴ� ������ ����� ����.
	 * @param xslurl XSLT ȭ�� �ִ� URL
	 * @param xmlstr XML ���ڿ� �Ǵ� DataSet ��ü
	 * @return ������ ����
	 */
	this.transform = function(xslurl, xmlstr) {
		var stylesheet = null;
		var xmldoc = null;

		stylesheet = this.getXMLDoc();
		stylesheet.async = false;
		stylesheet.validateOnParse = false;
		stylesheet.load(xslurl);
		if (stylesheet.parseError.errorCode != 0)  {
			throw new Error(0, "Parsing XSL Error: " + stylesheet.parseError.reason); 
		}

		if (typeof(xmlstr) == "string" && xmlstr.length > 0) {
			xmldoc = this.getXMLDoc();
			xmldoc.async = false;
			xmldoc.validateOnParse = false;
			xmldoc.loadXML(xmlstr);
			if (xmldoc.parseError.errorCode != 0)  {
				throw new Error(0, "Parsing XSL Error: " + xmldoc.parseError.reason); 
			}
		}

		return xmldoc.transformNode(stylesheet);
	}
}


///////////////////////////////////////////////////////////////////////////////
/**
 * XML ȭ�ϳ��� ��忡 ���Ͽ� XPath�� �̿��Ͽ� ������ ���� �Ͽ�,
 * ����� ���� ���� �� �ִ� Helper Ŭ�����̴�.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 * @param strxml XML ���ڿ� �Ǵ� DOM ��ü
 */
function XMLReferer(strXML)
{
	this.getXMLDoc = function() {
		var versions = [
			 'Msxml2.DOMDocument.6.0',
			 'Msxml2.DOMDocument.5.0',
             'Msxml2.DOMDocument.4.0',
             'Msxml2.DOMDocument.3.0',
             'Msxml2.DOMDocument.2.0',
             'Msxml2.DOMDocument'            
        ];

		xmldoc = null;
		for (var i = 0; i < versions.length; i++) {
			try {
				xmldoc = new ActiveXObject(versions[i]);
				break;
			} catch (e) { }
		}
		return xmldoc;
	}
	
	/**
	 * XML ���Ϸ� ���� �ε��Ѵ�.
	 * @param filename 
	 */
	this.load = function(filename) {
		this.xmlDoc.async = false;
		this.xmlDoc.validateOnParse = false;

		this.xmlDoc.load(filename);
		
		if (this.xmlDoc.parseError.errorCode != 0) {
			throw new Error(0, "Parsing XSL Error: " + this.xmlDoc.parseError.reason); 
		}
		
		this.init(this.xmlDoc.documentElement);
		return this;
	}

	/**
	 * XML ���ڿ��� XML�� �ε��Ѵ�.
	 * @param strxml XML ���ڿ�
	 */
	this.setXML = function(strxml) {
		this.xmlDoc.async = false;
		this.xmlDoc.validateOnParse = false;

		this.xmlDoc.loadXML(strxml);
		
		if (this.xmlDoc.parseError.errorCode != 0) {
			throw new Error(0, "Parsing XSL Error: " + this.xmlDoc.parseError.reason); 
		}
		
		this.init(this.xmlDoc.documentElement);
	}

	/**
	 * DOCUMENT ��ü�� ���Ͽ� �ʱ�ȭ �۾��� �Ѵ�.
	 * @param documentElement
	 */
	this.init = function(documentElement) {
		this._selectedNodeByLookup = documentElement.firstChild;
		this._idx = 0;
		this._markList = new Stack();
	}

    this.xmlDoc = this.getXMLDoc();

	if (strXML != null)	{
		if (typeof(strXML) == "string" && strXML.length > 0)
			this.setXML(strXML);
		else {
			// DOM ��ü�϶�
			this.xmlDoc = strXML;
			this.init(this.xmlDoc.documentElement);
		}
			
	}

	this.setNamespaces = function(namespaces) {
		this.xmlDoc.setProperty("SelectionNamespaces", namespaces);
	}

	/**
	 * XML ���������� �������� ������ ���鼭 ���� �а��� �Ҷ�,
	 * ������������ �� �޼ҵ带 ȣ���Ͽ� �� �θ� ������ ��ġ�� ����Ų��.
	 */
	this.mark = function() {
		var info = new MarkInfo(this._selectedNodeListByLookup, this._selectedNodeByLookup, this._idx);
		this._markList.push(info);
	}

	/**
	 * <code>mark</code>�� �����ѵξ���, �������� �������ö�,
	 * �θ� ������ ��ġ�� �����Ѵ�.
	 */
	this.unmark = function() {
		var info = this._markList.pop();

		this._selectedNodeListByLookup = info._nodelist;
		this._selectedNodeByLookup = info._node;
		this._idx = info._idx;
	}

	/**
	 * �ʱ�ȭ �Ѵ�. �� ���� Document�� �ʱ�ȭ �ϴ°��� �ƴ϶�, <code>lookup</code>����
	 * ã�� �ִ� ������ �ʱ�ȭ�Ѵ�.
	 */
	this.reset = function() {
		this._markList.clear();

		this._selectedNodeListByLookup = null;
		this._selectedNodeByLookup = this.xmlDoc.documentElement.firstChild;
		this._idx = 0;
	}

	/**
	 * ã�� ��� ����Ʈ���� ���� �ε尡 �ִ��� ���θ� ��ȯ�Ѵ�.
	 * ���������� <code>ResultSet</code>�� <code>next</code>�� ����Ѵ�.
	 * @return ���� ����
	 */
	this.next = function() {
		if (this._selectedNodeListByLookup.length <= this._idx)
			return false;
		else {
			this._selectedNodeByLookup = this._selectedNodeListByLookup.item(this._idx++);
			return true;
		}
	}

	/**
	 * Xpath�� �̿��Ͽ� ã���� �ϴ� �ε��� ��ġ�� �����Ѵ�.
	 * ��, Xpath�� �н��� '//'�� ���� �н� ������ ���Ǹ� �Ͽ��� �Ѵ�.
	 * @param xpath �н�����
	 * @return XMLReferer �ش� �н������� �������� �ʴ´ٸ�, null�� ��ȯ�Ѵ�.
	 */
	this.lookup = function(xpath) {
		var nodelist = this._selectedNodeByLookup.selectNodes(xpath);
		if (nodelist.length > 0) {
			this._selectedNodeListByLookup = nodelist;
			this._idx = 0;
			this._selectedNodeByLookup = this._selectedNodeListByLookup.item(this._idx);
			return this;
		}

		return null;
	}

	/**
	 * ���� ���õ� ��带 ��ȯ�Ѵ�.
	 * @return Node
	 */
	this.getSelectedNode = function() {
		return this._selectedNodeByLookup;
	}

	/**
	 * �ش� ��尡 Element ���� ���θ� �Ǻ��Ͽ� �ƴҰ��,
	 * Exception�� ��ȯ�Ѵ�.
	 *
	 * @param node ��� ���
	 */
	this.isElement = function(node) {
		//if (node.nodeTypeString != "element")	// 1: NODE_ELEMENT 
		if (node.nodeType != 1) {	// 1: NODE_ELEMENT 
			throw new Error(0, "'"+node.nodeName + "' is not Element.");
		}
	}

	/**
	 * ���� ���õ� ����� �ش� �Ӽ��� ���� ��ȯ�Ѵ�.
	 * ã�� �Ӽ��� ���� ��� �⺻���� ����ȯ��.
	 * @param attrName ã�� �Ӽ���
	 * @param defaultvalue �⺻��(Default: "")
	 * @return String �Ӽ���
	 */
	this.attribute = this.getString = function(attrName, defaultvalue) {
		if (defaultvalue == null || defaultvalue.length <= 0)
			defaultvalue = "";
		
		var tmpNode = this.getSelectedNode();

		if (tmpNode.nodeType == 2)	// 2: NODE_ATTRIBUTE
			return tmpNode.nodeValue;

		this.isElement(tmpNode);

		var atts = tmpNode.attributes;

		for (var i = 0; i < atts.length; i++) {
			var att = atts[i];

			if (att.nodeName == attrName)
				return att.nodeValue;
		}

		return defaultvalue;
	}

	/**
	 * ���� ���õ� ����� �ش� �ؽ�Ʈ�� ���� ��ȯ�Ѵ�.
	 * ã�� ��尡 ���� ��� �⺻���� ����ȯ��.
	 * @param defaultvalue �⺻��(defalut: "")
	 * @return String �ؽ�Ʈ
	 */
	this.value = this.cdata = this.getText = function(defaultvalue)
	{
		if (defaultvalue == null || defaultvalue.length <= 0)
			defaultvalue = "";

		var tmpNode = this.getSelectedNode();

		if (tmpNode.nodeType == 3)	// NODE_TEXT (3)
			return tmpNode.nodeValue;

		this.isElement(tmpNode);

		var list = tmpNode.childNodes;
		for (var i = 0; i < list.length; i++) {
			var child = list.item(i);

			switch (child.nodeType) {
				case 3 :	// NODE_TEXT (3)
				case 4 :	// NODE_CDATA_SECTION (4)
					var value = child.data.trim();
					if ("" == value && i < list.length - 1)
						continue;
					else
						return value;
			}
		}

		return defaultvalue;
	}

	/**
	 * ���� ���õ� ���� �н����� �ִ� ����� ���� ��ȯ�Ѵ�.
	 * ���࿡ <code>lookup</code>���� ���õǾ� ���� �ʴٸ� -1�� ��ȯ�Ѵ�.
	 * @return int ��ȯ���� ���õ��� �ʾҴٸ� -1�� ��ȯ
	 */
	this.countNode = function() {
		if (this._selectedNodeListByLookup != null)
			return this._selectedNodeListByLookup.length;

		return -1;
	}


	/**
	 * XMLReferer������ mark�� unmark�� ���� ������ ��� ��ü�̴�.
	 * @author Eun Jeong-Ho, silver@intos.biz
	 * @since 2004. 6. 4.
	 */
	function MarkInfo(selectedNodeListByLookup, selectedNodeByLookup, idx)
	{
		this._nodelist = selectedNodeListByLookup;
		this._node = selectedNodeByLookup;
		this._idx = idx;
	}
}