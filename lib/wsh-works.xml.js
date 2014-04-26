///////////////////////////////////////////////////////////////////////////////
/**
 * 데이터셋 또는 XML 문서를 XSLT를 이용하여 변환 문서를 얻는다.
 * (예제) new XMLTransformer().transform("datasetlist.xsl", resxml);
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
     * xsl 문서가 있는 URL로 부터 XSL를 취득하여,
     * XML 문자열 또는 DataSet 객체를 융합하여,
     * 원하는 문서를 만들어 낸다.
     * @param xslurl XSLT 화일 있는 URL
     * @param xmlstr XML 문자열 또는 DataSet 객체
     * @return 생성된 문서
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
 * XML 화일내의 노드에 대하여 XPath를 이용하여 접근을 쉽게 하여,
 * 저장된 값을 읽을 수 있는 Helper 클래스이다.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 * @param strxml XML 문자열 또는 DOM 객체
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
     * XML 파일로 부터 로드한다.
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
     * XML 문자열을 XML로 로드한다.
     * @param strxml XML 문자열
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
     * DOCUMENT 객체에 대하여 초기화 작업을 한다.
     * @param documentElement
     */
    this.init = function(documentElement) {
        this._selectedNodeByLookup = documentElement.firstChild;
        this._idx = 0;
        this._markList = new Stack();
    }

    this.xmlDoc = this.getXMLDoc();

    if (strXML != null)    {
        if (typeof(strXML) == "string" && strXML.length > 0)
            this.setXML(strXML);
        else {
            // DOM 객체일때
            this.xmlDoc = strXML;
            this.init(this.xmlDoc.documentElement);
        }
            
    }

    this.setNamespaces = function(namespaces) {
        this.xmlDoc.setProperty("SelectionNamespaces", namespaces);
    }

    /**
     * XML 문서내에서 루프내의 루프를 돌면서 값을 읽고자 할때,
     * 루프돌기전에 이 메소드를 호출하여 전 부모 루프의 위치를 기억시킨다.
     */
    this.mark = function() {
        var info = new MarkInfo(this._selectedNodeListByLookup, this._selectedNodeByLookup, this._idx);
        this._markList.push(info);
    }

    /**
     * <code>mark</code>로 기억시켜두었던, 루프에서 빠져나올때,
     * 부모 루프의 위치로 복귀한다.
     */
    this.unmark = function() {
        var info = this._markList.pop();

        this._selectedNodeListByLookup = info._nodelist;
        this._selectedNodeByLookup = info._node;
        this._idx = info._idx;
    }

    /**
     * 초기화 한다. 단 읽은 Document를 초기화 하는것이 아니라, <code>lookup</code>으로
     * 찾고 있던 정보를 초기화한다.
     */
    this.reset = function() {
        this._markList.clear();

        this._selectedNodeListByLookup = null;
        this._selectedNodeByLookup = this.xmlDoc.documentElement.firstChild;
        this._idx = 0;
    }

    /**
     * 찾은 노드 리스트에서 다음 로드가 있는지 여부를 반환한다.
     * 참고적으로 <code>ResultSet</code>의 <code>next</code>와 비슷한다.
     * @return 존재 여부
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
     * Xpath를 이용하여 찾고자 하는 로드의 위치를 설정한다.
     * 단, Xpath의 패스중 '//'와 같은 패스 정보는 주의를 하여야 한다.
     * @param xpath 패스정보
     * @return XMLReferer 해당 패스정보가 존재하지 않는다면, null을 반환한다.
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
     * 현재 선택된 노드를 반환한다.
     * @return Node
     */
    this.getSelectedNode = function() {
        return this._selectedNodeByLookup;
    }

    /**
     * 해당 노드가 Element 인지 여부를 판별하여 아닐경우,
     * Exception을 반환한다.
     *
     * @param node 대상 노드
     */
    this.isElement = function(node) {
        //if (node.nodeTypeString != "element")    // 1: NODE_ELEMENT 
        if (node.nodeType != 1) {    // 1: NODE_ELEMENT 
            throw new Error(0, "'"+node.nodeName + "' is not Element.");
        }
    }

    /**
     * 현재 선택된 노드의 해당 속성의 값을 반환한다.
     * 찾는 속성가 없을 경우 기본값을 반한환다.
     * @param attrName 찾는 속성명
     * @param defaultvalue 기본값(Default: "")
     * @return String 속성값
     */
    this.attribute = this.getString = function(attrName, defaultvalue) {
        if (defaultvalue == null || defaultvalue.length <= 0)
            defaultvalue = "";
        
        var tmpNode = this.getSelectedNode();

        if (tmpNode.nodeType == 2)    // 2: NODE_ATTRIBUTE
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
     * 현재 선택된 노드의 해당 텍스트의 값을 반환한다.
     * 찾는 노드가 없을 경우 기본값을 반한환다.
     * @param defaultvalue 기본값(defalut: "")
     * @return String 텍스트
     */
    this.value = this.cdata = this.getText = function(defaultvalue)
    {
        if (defaultvalue == null || defaultvalue.length <= 0)
            defaultvalue = "";

        var tmpNode = this.getSelectedNode();

        if (tmpNode.nodeType == 3)    // NODE_TEXT (3)
            return tmpNode.nodeValue;

        this.isElement(tmpNode);

        var list = tmpNode.childNodes;
        for (var i = 0; i < list.length; i++) {
            var child = list.item(i);

            switch (child.nodeType) {
                case 3 :    // NODE_TEXT (3)
                case 4 :    // NODE_CDATA_SECTION (4)
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
     * 현재 선택된 같은 패스내에 있는 노드의 수를 반환한다.
     * 만약에 <code>lookup</code>으로 선택되어 있지 않다면 -1을 반환한다.
     * @return int 반환갯수 선택되지 않았다면 -1을 반환
     */
    this.countNode = function() {
        if (this._selectedNodeListByLookup != null)
            return this._selectedNodeListByLookup.length;

        return -1;
    }


    /**
     * XMLReferer내에서 mark와 unmark를 위한 정보를 담는 객체이다.
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