/**
 * 특정 문자열로 시작하는지 여부를 반환한다.
 */
String.prototype.startsWith = function(str) {
                                var p = this.indexOf(str);
                                if (p == 0)
                                    return true;
                                return false;
                            }

/**
 * 특정 문자열로 끝나는지 여부를 반환한다.
 */
String.prototype.endsWith = function(str) {
                                var p = this.lastIndexOf(str);
                                if (p + str.length == this.length)
                                    return true;
                                return false;
                            }
/**
 * String 객체의 trim을 앞뒤 공백 모두를 제거 할 수 있도록 재정의를 한다.
 */
String.prototype.trim = function() {
                            return this.replace(/(^\s+)|\s+$/g, "");
                        }

/**
 * 문자열 전체에 대하여 replace All을 수행한다.
 */
String.prototype.replaceAll = function(from, to){
                                return this.replace(new RegExp(from, "g"), to);
                            }

function println(str) {
    System.println(str);
}

var System = {
    desktopPath : function() {
                    var wsh = new ActiveXObject("WScript.Shell");
                    return wsh.SpecialFolders.Item("Desktop");
                },
    homePath : function(){
                    var WshShell = new ActiveXObject("WScript.Shell");
                    var WshSysEnv = WshShell.Environment("PROCESS");
                    var HOMEPATH = WshSysEnv("HOMEPATH");
                    return HOMEPATH;
		        },
    
    PROCESS_RUNNING : 0,

    exec : function(command) {
                var wsh = new ActiveXObject("WScript.Shell");
                return new Exec(wsh.Exec(command));

                function Exec(wshScriptExec) {
                    this.wse = wshScriptExec;
                    
                    this.exitCode = function() {
                        return this.wse.ExitCode;
                    }

                    this.processID = function() {
                        return this.wse.ProcessID;
                    }

                    this.status = function() {
                        return this.wse.Status;
                    }
                    
                    this.stdErr = function() {
                        return this.wse.StdErr;
                    }

                    this.stdErr = function() {
                        return this.wse.StdErr;
                    }

                    this.stdIn = function() {
                        return this.wse.stdIn;
                    }

                    this.stdOut = function() {
                        return this.wse.stdOut;
                    }

                    this.terminate = function() {
                        this.wse.Terminate();
                    }
                }
            },

    sleep : function(time) {
                WScript.Sleep(time);
            },
    
    println : function(str) {
        var value = String(str);
        WScript.Echo(value);
    },
    
    /**
     * 프로세스 Kill
     * [예제]
     * System.killProcess("iexplore.exe");
     * param processName 프로세스명
     */
    killProcess : function(processName) {
        var computer = '.';
        var WMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + computer + "\\root\\cimv2");
        var processList = WMIService.ExecQuery("Select * From Win32_Process Where Name = '"+processName+"'");
        //WScript.Echo('Found ' + processList.Count + ' processes.');
        var enumr = new Enumerator(processList);
        while (!enumr.atEnd()) {
            enumr.item().Terminate();
            enumr.moveNext();
        }
    },
    
    /**
     * 로컬 IP를 획득한다.
     */
    getLocalIP : function() {
        var computer = '.';
        var WMIService = GetObject("winmgmts:{impersonationLevel=impersonate}!\\\\" + computer + "\\root\\cimv2");
        var netConfigSet = WMIService.ExecQuery("SELECT * FROM Win32_NetworkAdapterConfiguration");
        var enumr = new Enumerator(netConfigSet);
        while (!enumr.atEnd()) {
            if (enumr.item().IPAddress != null) {
                var ipAddresses = enumr.item().IPAddress.toArray();
                for (k = 0; k < ipAddresses.length; k++) {
                    return ipAddresses[k];
                }
            }
            enumr.moveNext();
        }
    },

    sleep : function(millsec) {
        WScript.Sleep(millsec);
    }
}

function StringBuffer() {
    this.buffer = new Array();
    
    this.append = function(str) {
        this.buffer[this.buffer.length] = str;
        return this;
    }

    this.toString = function() {
        return this.buffer.join("");
    }
    
    this.clear = function() {
        for (var i in this.buffer) {
            delete this.buffer[i];
        }
    }

    this.length = function() {
        var len = 0;
        for(var i = 0 ; i < this.buffer.length ; i++) {
            if (this.buffer[i] != null)
                len += this.buffer[i].length;
        }
        return len;
    }

    this.charAt = function(index) {
        var idx = index;
        for(var i = 0 ; i < this.buffer.length ; i++) {
            if (this.buffer[i] != null) {
                if (idx <= this.buffer[i].length - 1)
                    return String(this.buffer[i]).charAt(idx);
                else
                    idx -= this.buffer[i].length;
            }
        }
        return null;
    }

    this.substring = function(start, end) {
        var s = this.toString();
        if (end != null && end > 0 && end > start)
            return s.substring(start, end);
        else
            return s.substring(start);
    }
}


function HashMap() {
    this.length = 0;
    this.items = new Array();

    for (var i = 0; i < arguments.length; i += 2) {
        if (typeof(arguments[i + 1]) != 'undefined') {
            this.items[arguments[i]] = arguments[i + 1];
            this.length++;
        }
    }
   
    this.remove = function(key) {
        var tmp;
        if (typeof(this.items[key]) != 'undefined') {
            this.length--;
            var tmp = this.items[key];
            delete this.items[key];
        }
       
        return tmp;
    }

    this.get = function(key) {
        return this.items[key];
    }

    this.put = function(key, value) {
        var tmp;
        if (typeof(value) != 'undefined') {
            if (typeof(this.items[key]) == 'undefined') {
                this.length++;
            }
            else {
                tmp = this.items[key];
            }

            this.items[key] = value;
        }
       
        return tmp;
    }

    this.containsKey = function(key) {
        return typeof(this.items[key]) != 'undefined';
    }

    this.clear = function() {
        for (var i in this.items) {
            delete this.items[i];
        }

        this.length = 0;
    }
}


function Iterator(values) {
    this.enums = new Enumerator(values);
    this.enums.moveFirst();

    this.hasNext = function() {
        return !this.enums.atEnd();
    }

    this.next = function() {
        var value = this.enums.item();
        this.enums.moveNext();
        return value;
    }
}


function Properties() {
    this.load = function(filename) {
        var fso = new ActiveXObject("Scripting.FileSystemObject");

        var file = fso.OpenTextFile(filename, 1);

        while (!file.AtEndOfStream){
            var line = file.ReadLine();
            if (line != null && line.length > 0)
            {
                line = line.replace(/#.+$/g, "");
                line = line.trim();
                var p = line.indexOf("=");
                if (p > - 1) {
                    var key = line.substring(0, p).trim();
                    var value = line.substring(p + 1, line.length).trim();
                    this.put(key, value);
                }
            }
        }
    }
}

Properties.prototype = new HashMap();    //상속

///////////////////////////////////////////////////////////////////////////////
/**
 * 값을 저장하는 리스트 객체이다.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function List() {
    this.table = new Array();

    /**
     * 리스트을 초기화한다.
     */
    this.clear = function() {
        for (var i in this.table) {
            delete this.table[i];
        }
    }

    /**
     * 요소를 추가한다.
     * @param o 추가할 요소
     */
    this.add = function(idx, o) {
        if (o == null) {
            var o = idx;
            this.table[this.table.length] = o;
        } else {
            this.table[idx] = o;
        }
    }

    /**
     * 요소를 교체한다.
     * @param idx 인덱스
     * @param o 추가할 요소
     * @return Object 기존에 저장된 요소
     */
    this.set = function(idx, o) {
        var oldval = this.table[idx];
        this.table[idx] = o;
        return oldval;
    }

    /**
     * 요소를 포함하고 있는지 여부를 반환한다.
     * @param o 테스트할 요소
     * @return true, false
     */
    this.contains = function(o) {
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i] == o)
                return true;
        }

        return false;
    }

    /**
     * 리스트내에 인덱스에 있는 객체를 반환한다.
     * @param idx 인덱스
     * @return 객체
     */
    this.get = function(idx) {
        return this.table[idx];    
    }

    /**
     * 찾고자하는 요소의 인덱스번호를 반환하다. 없다면 -1을 반환한다.
     * @param o 찾고자하는 요소
     * @return 인덱스번호 또는 -1
     */
    this.indexOf = function(o) {
        for (var i = 0; i < this.table.length; i++) {
            if (this.table[i] == o)
                return i;
        }

        return -1;
    }

    /**
     * 리스트내에 요소가 있는지 여부를 반환한다.
     * @returns true, false
     */
    this.isEmpty = function() {
        return (this.table.length == 0) ? true : false;
    }

    /**
     * 리스트내에 사이즈를 반환한다.
     * @returns 사이즈
     */
    this.size = function() {
        return this.table.length;
    }

    /**
     * 리스트내의 인덱스에 해당하는 요소를 지운다.
     * remove(idx)에 해당하며
     * 또는 인덱스내에 같은 객체를 찾아서 지운다.
     * remove(object)에 해당한다.
     * 이것의 판단 기준은 파라미터 idx가 number 타입일경우는
     * 전자로 판단하여 처리하며, 나머지경우에 후자로 처리된다.
     * @param idx 인덱스번호 또는 객체
     */
    this.remove = function(idx) {
        if (typeof(idx) == "number") {
            var bit1 = this.table.splice(0, idx);
            var bit2 = this.table.splice(idx + 1, this.table.length);

            this.table = bit1.concat(bit2);
        } else {
            var o = idx;
            for (var i = 0; i < this.table.length; i++) {
                if (this.table[i] == o)
                    this.remove(i);
            }
        }
    }

    /**
     * 리스트안의 값을 배열로 반환한다.
     * @returns Array of value
     */
    this.toArray = function() {
        return this.table.slice(0, this.table.length);
    }

    /**
     * 지정된 fromIndex와 toIndex 사이의 인덱스에 위치한 
     * 객체들을 List 형태로 반환한다.
     * 단, fromIndex의 객체는 포함되지만, toIndex의 객체는 포함되는 않는다.
     * @param fromIndex 시작인덱스
     * @param toIndex 끝인덱스
     * @param List
     */
    this.subList = function(fromIndex, toIndex) {
        var list = new List();
        for (var i = fromIndex; i < toIndex; i++) {
            list.add(this.table[i]);
        }
        
        return list;
    }

    /**
     * 객체를 표현하는 문자열을 반환한다.
     * @return String 표현되는 문자열
     */
    this.toString = function() {
        var buf = new StringBuffer();
        buf.append("{");
        for (var i = 0; i < this.table.length - 1; i++) {
            var val = this.table[i];
            buf.append(val.toString()).append(",");
        }
        buf.append(this.table[this.table.length - 1]).append("}");
        return buf.toString();
    }
}


///////////////////////////////////////////////////////////////////////////////
/**
 * 값을 저장하는 큐 객체이다.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function Queue() {
    /**
     * 요소를 추가한다.
     * @param o 추가할 요소
     */
    this.push = function(o) {
        this.add(o);
    }

    /**
     * 요소를 빼낸다.
     * @return 빼낸 요소
     */
    this.pop = function() {
        var val = this.get(0);
        this.remove(0);

        return val;
    }

    /**
     * 맨위 요소를 확인한다.
     * pop과 비슷하지만, 요소를 지우지는 않는다.
     * @return 빼낸 요소
     */
    this.peek = function() {
        return this.get(0);
    }
}

Queue.prototype = new List();    //상속

///////////////////////////////////////////////////////////////////////////////
/**
 * 값을 저장하는 스택 객체이다.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function Stack() {
    /**
     * 요소를 추가한다.
     * @param o 추가할 요소
     */
    this.push = function(o) {
        this.add(o);
    }

    /**
     * 요소를 빼낸다.
     * @return 빼낸 요소
     */
    this.pop = function() {
        var idx = this.size() - 1;
        var val = this.get(idx);
        this.remove(idx);

        return val;
    }

    /**
     * 맨위 요소를 확인한다.
     * pop과 비슷하지만, 요소를 지우지는 않는다.
     * @return 빼낸 요소
     */
    this.peek = function() {
        var idx = this.size() - 1;
        return this.get(idx);
    }
}

Stack.prototype = new List();    //상속
