var URL = {
    encodeURL : function(str) {  
                var str = str;  
                 str = "".concat(str);  
                    
                var s0, i, s, u;  
                s0 = "";                // encoded str  
                for (i = 0; i < str.length; i++){   // scan the source  
                    s = str.charAt(i);  
                    u = str.charCodeAt(i);          // get unicode of the char  
                    if (s == " "){s0 += "+";}       // SP should be converted to "+"  
                    else {  
                        if ( u == 0x2a || u == 0x2d || u == 0x2e || u == 0x5f || ((u >= 0x30) && (u <= 0x39)) || ((u >= 0x41) && (u <= 0x5a)) || ((u >= 0x61) && (u <= 0x7a))){       // check for escape  
                            s0 = s0 + s;            // don't escape  
                        }  
                        else {                  // escape  
                            if ((u >= 0x0) && (u <= 0x7f)){     // single byte format  
                                s = "0"+u.toString(16);  
                                s0 += "%"+ s.substr(s.length-2);  
                            }  
                            else if (u > 0x1fffff){     // quaternary byte format (extended)  
                                s0 += "%" + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);  
                                s0 += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);  
                                s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);  
                                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);  
                            }  
                            else if (u > 0x7ff){        // triple byte format  
                                s0 += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);  
                                s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);  
                                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);  
                            }  
                            else {                      // double byte format  
                                s0 += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);  
                                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);  
                            }  
                        }  
                    }  
                }  
                return s0;  
               
            },  
                
               
            /*  Function Equivalent to java.net.URLDecoder.decode(String, "UTF-8")  
                Copyright (C) 2002, Cresc Corp.  
                Version: 1.0  
               
            */ 
               
    decodeURL : function(str) {  
                var s0, i, j, s, ss, u, n, f;  
                s0 = "";                // decoded str  
                for (i = 0; i < str.length; i++){   // scan the source str  
                    s = str.charAt(i);  
                    if (s == "+"){s0 += " ";}       // "+" should be changed to SP  
                    else {  
                        if (s != "%"){s0 += s;}     // add an unescaped char  
                        else{               // escape sequence decoding  
                            u = 0;          // unicode of the character  
                            f = 1;          // escape flag, zero means end of this sequence  
                            while (true) {  
                                ss = "";        // local str to parse as int  
                                    for (j = 0; j < 2; j++ ) {  // get two maximum hex characters for parse  
                                        sss = str.charAt(++i);  
                                        if (((sss >= "0") && (sss <= "9")) || ((sss >= "a") && (sss <= "f"))  || ((sss >= "A") && (sss <= "F"))) {  
                                            ss += sss;      // if hex, add the hex character  
                                        } else {--i; break;}    // not a hex char., exit the loop  
                                    }  
                                n = parseInt(ss, 16);           // parse the hex str as byte  
                                if (n <= 0x7f){u = n; f = 1;}   // single byte format  
                                if ((n >= 0xc0) && (n <= 0xdf)){u = n & 0x1f; f = 2;}   // double byte format  
                                if ((n >= 0xe0) && (n <= 0xef)){u = n & 0x0f; f = 3;}   // triple byte format  
                                if ((n >= 0xf0) && (n <= 0xf7)){u = n & 0x07; f = 4;}   // quaternary byte format (extended)  
                                if ((n >= 0x80) && (n <= 0xbf)){u = (u << 6) + (n & 0x3f); --f;}         // not a first, shift and add 6 lower bits  
                                if (f <= 1){break;}         // end of the utf byte sequence  
                                if (str.charAt(i + 1) == "%"){ i++ ;}                   // test for the next shift byte  
                                else {break;}                   // abnormal, format error  
                            }  
                        s0 += String.fromCharCode(u);           // add the escaped character  
                        }  
                    }  
                }  
                return s0;  
            }  
}


var Base64 = {
    base64EncodeChars : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    base64DecodeChars : new Array(
                      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                      -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
                      52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
                      -1, 0, 1, 2, 3,  4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                      15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
                      -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                      41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1),
    encode : function(str) {
                var i, len, c1, c2, c3;
                len = str.length;
                i = 0;
                var out = new StringBuffer();

                while(i < len) {
                    c1 = str.charCodeAt(i++) & 0xff;
                    if(i == len) {
                       out.append(this.base64EncodeChars.charAt(c1 >> 2));
                       out.append(this.base64EncodeChars.charAt((c1 & 0x3) << 4));
                       out.append("==");
                       break;
                    }
                    c2 = str.charCodeAt(i++);
                    if(i == len) {
                       out.append(this.base64EncodeChars.charAt(c1 >> 2));
                       out.append(this.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4)));
                       out.append(this.base64EncodeChars.charAt((c2 & 0xF) << 2));
                       out.append("=");
                       break;
                    }
                    c3 = str.charCodeAt(i++);
                    out.append(this.base64EncodeChars.charAt(c1 >> 2));
                    out.append(this.base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4)));
                    out.append(this.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6)));
                    out.append(this.base64EncodeChars.charAt(c3 & 0x3F));
                }
                return out.toString();
            },

    decode : function(str) {
                var c1, c2, c3, c4, i, len;
                len = str.length;
                i = 0;
                var out = new StringBuffer();
                
                while(i < len) {
                    /* c1 */
                    do {
                       c1 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    } 
                    while(i < len && c1 == -1);
                    
                    if(c1 == -1)
                       break;
                    
                    /* c2 */
                    do {
                       c2 = this.base64DecodeChars[str.charCodeAt(i++) & 0xff];
                    }
                    while(i < len && c2 == -1);
                    
                    if(c2 == -1)
                       break;
                    out.append(String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4)));
                    
                    /* c3 */
                    do {
                        c3 = str.charCodeAt(i++) & 0xff;
                        if(c3 == 61)
                            return out;
                        c3 = this.base64DecodeChars[c3];
                    }
                    while(i < len && c3 == -1);
                    
                    if(c3 == -1)
                       break;
                    out.append(String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2)));
                    
                    /* c4 */
                    do {
                        c4 = str.charCodeAt(i++) & 0xff;
                        if(c4 == 61)
                            return out;
                      c4 = this.base64DecodeChars[c4];
                    } 
                    while(i < len && c4 == -1);
                    
                    if(c4 == -1)
                       break;
                    
                    out.append(String.fromCharCode(((c3 & 0x03) << 6) | c4));
              }
              return out.toString();
            },

    utf16to8 : function(str) {
                var i, len, c;
                var out = new StringBuffer();
                len = str.length;
                for(i = 0; i < len; i++) 
                {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007F)) 
                    {
                        out += str.charAt(i);
                    }
                    else if (c > 0x07FF) 
                    {
                        out.append(String.fromCharCode(0xE0 | ((c >> 12) & 0x0F)));
                        out.append(String.fromCharCode(0x80 | ((c >> 6) & 0x3F)));
                        out.append(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
                    }
                    else 
                    {
                        out.append(String.fromCharCode(0xC0 | ((c >> 6) & 0x1F)));
                        out.append(String.fromCharCode(0x80 | ((c >> 0) & 0x3F)));
                    }
                }
                return out.toString();
            },

    utf8to16 : function(str) {
                var i, len, c;
                var char2, char3;
                var out = new StringBuffer();
                len = str.length;
                i = 0;
                while(i < len) 
                {
                    c = str.charCodeAt(i++);
                    switch(c >> 4)
                    {
                        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                            // 0xxxxxxx
                            out.append(str.charAt(i-1));
                            break;
                        case 12: case 13:
                            // 110x xxxx  10xx xxxx
                            char2 = str.charCodeAt(i++);
                            out.append(String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F)));
                            break;
                        case 14:
                            // 1110 xxxx 10xx xxxx 10xx xxxx
                            char2 = str.charCodeAt(i++);
                            char3 = str.charCodeAt(i++);
                            out.append(String.fromCharCode(((c & 0x0F) << 12) |
                            ((char2 & 0x3F) << 6) |
                            ((char3 & 0x3F) << 0)));
                            break;
                    }
                }

                return out.toString();
            }
}

function Connection() {    // XMLHTTP을 이용하여 서버통신 기본적으로 싱크동작한다.
    this.versions = [
             'Msxml2.XMLHTTP.5.0',
             'Msxml2.XMLHTTP.4.0',
             'Msxml2.XMLHTTP.3.0',
             'Msxml2.XMLHTTP',
             'Microsoft.XMLHttp'             
        ];

    this.xmlHttp = null;
    for (var i = 0; i < this.versions.length; i++) {
        try {
            this.xmlHttp = new ActiveXObject(this.versions[i]);
            break;
        } catch (e) { }
    }

    if (this.xmlHttp == null)    
        throw new Error('This sytem does not support XMLHttpRequest');

    this.async = false;    // Sync(false), Async(true)
    this.success = false;
    this.state = new State(this, this.xmlHttp);

    /**
     * 통신 성공여부를 반환한다.
     * @return  성공여부
     */
    this.isSuccess = function() {
        return this.success;
    };
    
    /**
     * 통신의 모드를 Async로 설정한다.
     * @param isAsync Async(true), Sync(false)
     */
    this.setAsync = function(async) {
        this.async = async;
    };

    /**
     * 통신 모드를 반환한다.
     * @return Async(true), Sync(false)
     */ 
    this.isAsync = function() {
        return this.async;
    };

    /**
     * 서버로 데이터셋을 전송한다.
     * @param url 전송 대상 URL
     * @param postdata POST로 넘길 데이터 (default: null)
     * @param content_type Content-Type (default: "application/x-www-form-urlencoded")
     *        "text/xml", "multipart/form-data"
     */
    this.call = function(url, postdata, content_type) {
        this.success = false;
        this.xmlHttp.abort();
        this.xmlHttp.onreadystatechange = this.state.onreadystatechange;

        if (postdata != null && typeof(postdata) != "string") {    // 문자열이 아닌 배열이라면,
            postdata = this.getURLData(postdata);
        }

        if (postdata != null && postdata.length > 0)
            this.xmlHttp.open ("POST", url, this.async);
        else
            this.xmlHttp.open ("GET", url, this.async);

        if (content_type == null || content_type.length <= 0)
            content_type = "application/x-www-form-urlencoded";
        this.xmlHttp.setRequestHeader("Content-Type", content_type);
        
        if (postdata != null && postdata.length > 0)
            this.xmlHttp.send(postdata);
        else
            this.xmlHttp.send();
    };

    /**
     * 요청 Header에 값을 설정한다.
     * @param key 키
     * @param value 값
     */
    this.setRequestHeader = function(key, value) {
        this.xmlHttp.setRequestHeader(key, value);
    }

    /**
     * 현재 통신을 닫는다.
     */
    this.close = function() {
        this.xmlHttp = null;
        this.state = null;
    };

    /**
     * 현재 통신을 중단한다.
     */
    this.abort = function() {
        this.xmlHttp.abort();
    };

    /**
     * 통신이 완료되었는지 여부를 반환한다.
     * @return 완료여부
     */
    this.getLoaded = function() {
        return this.xmlHttp.readyState == 4;
    };

    /**
     * 통신이 진행중인지 여부를 반환한다.
     * @return 진행여부
     */
    this.getLoading = function() {
        return this.xmlHttp.readyState < 4;
    };

    /**
     * 일반 텍스트로 가져온다.
     * @return 일반 문자열
     */
    this.getText = function() {
        return this.xmlHttp.responseText;
    };

    /**
     * 통신으로 획득한 XML DOCUMENT를 반환한다.
     * @return XMLDOCUMENT
     */
    this.getXml = function() {
        return this.xmlHttp.responseXML;
    };

    /**
     * XMLHTTP 통신 객체를 반환한다.
     * @return XMLHTTP
     */
    this.getXmlHttp = function() {
        return this.xmlHttp;
    };

    /**
     * HTTP 통신이 정상적으로 이루어 졌는지 여부를 반환한다.
     * @return 정상 통신 여부
     */
    this.getError = function() {
        return this.xmlHttp.status != 200;
    };

    function State(conn, xmlHttp) {
        this.onreadystatechange = function() {
            if(xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    conn.success = true;
                    if (conn.successMethod != null)
                        conn.successMethod();
                } else {
                    conn.success = false;
                    if (conn.errorMethod != null)
                        conn.errorMethod();
                }
            } else if(xmlHttp.readyState == 1) {
                //
            } else {
                //
            }
        }
    };

    /**
     * Array 맵 객체에서 POST로 넘기기 위한 스트링을 만들기 위해 값과 데이터를 뽑아낸다.
     * @param buffer StringBuffer
     * @param element input 객체
     * @param isLastElement 마지막 객체인지 여부
     */
    this.getURLData = function(arrays) {
        var buf = new StringBuffer();
        for (var key in arrays) {
            var value = arrays[key];
            buf.append(URL.encodeURL(key)).append("=").append(URL.encodeURL(value)); 
            buf.append("&");
        }
        return buf.toString();
    }
}




function Uploader() {
    this.xmlhttp = new ActiveXObject("Msxml2.ServerXMLHTTP.3.0");
    this.xmlhttp.setOption(0, 0);
    this.xmlhttp.setOption(1, true);

    this.readBinaryFile = function(sPath) {
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 1;
        stream.Open();
        stream.LoadFromFile(sPath);
        var readBinaryFile = stream.Read();
        stream.Close();
        delete stream;
        return readBinaryFile;
    }

    this._successFunc_ = null;
    this._failFunc_ = null;

    this.state = new State(this, this.xmlhttp);

    this.onreadystatechange = function() {
        if(this.xmlhttp.readyState == 4) {
            if (this.xmlhttp.status == 200) {
                _successFunc_(this.xmlhttp);
            } else {
                _failFunc_(this.xmlhttp);
            }
        }
    }

    this.send = function(url, filepath, successFunc, failFunc) {
        this._successFunc_ = successFunc;
        this._failFunc_ = failFunc;

        this.xmlhttp.onreadystatechange = this.state.onreadystatechange;

        this.xmlhttp.open("POST",url,false);
        this.xmlhttp.send(this.readBinaryFile(filepath));
    }

    function State(obj, xmlhttp) {
        this.onreadystatechange = function() {
            if(xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    if (obj._successFunc_ != null)
                        obj._successFunc_(xmlhttp);
                } else {
                    if (obj._failFunc_ != null)
                        obj._failFunc_(xmlhttp);
                }
            } else if(xmlhttp.readyState == 1) {
                //
            } else {
                //
            }
        }
    };
}

function Downloader() {
    this.xmlhttp = new ActiveXObject("Msxml2.ServerXMLHTTP.3.0");
    this.xmlhttp.setOption(0, 0);
    this.xmlhttp.setOption(1, true);

    this.readBinaryStream = function(path, data) {
        var stream = new ActiveXObject("ADODB.Stream");
        stream.Type = 1;
        stream.Open();
        stream.Write(data);
        stream.SaveToFile(path);
        stream.Close();
        delete stream;
    }

    this._successFunc_ = null;
    this._failFunc_ = null;

    this.state = new State(this, this.xmlhttp);

    this.onreadystatechange = function() {
        if(this.xmlhttp.readyState == 4) {
            if (this.xmlhttp.status == 200) {
                _successFunc_(this.xmlhttp);
            } else {
                _failFunc_(this.xmlhttp);
            }
        }
    }
    /**
     * 해당 URL로 부터 다운로드 하여, 주어진 Path로 저장한다.
     * [예제]
     * var downloader = new Downloader();
     * downloader.receive(url, path, function(xmlhttp) { }, function(xmlhttp) { WScript.Echo("파일을 다운로드할 수 없습니다.") });
     * @param url 다운로드할 URL
     * @param path 저장할 Path
     * @param successFunc 성공시 호출할 함수
     * @param failFunc 실패시 호출할 함수
     */
    this.receive = function(url, path, successFunc, failFunc) {
        this._successFunc_ = successFunc;
        this._failFunc_ = failFunc;

        this.xmlhttp.onreadystatechange = this.state.onreadystatechange;

        this.xmlhttp.open("GET",url,false);
        this.xmlhttp.send();
        this.readBinaryStream(path, this.xmlhttp.responseBody);
    }

    function State(obj, xmlhttp) {
        this.onreadystatechange = function() {
            if(xmlhttp.readyState == 4) {
                if (xmlhttp.status == 200) {
                    if (obj._successFunc_ != null)
                        obj._successFunc_(xmlhttp);
                } else {
                    if (obj._failFunc_ != null)
                        obj._failFunc_(xmlhttp);
                }
            } else if(xmlhttp.readyState == 1) {
                //
            } else {
                //
            }
        }
    }
}

