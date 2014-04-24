/**
 * Ư�� ���ڿ��� �����ϴ��� ���θ� ��ȯ�Ѵ�.
 */
String.prototype.startsWith = function(str) {
								var p = this.indexOf(str);
								if (p == 0)
									return true;
								return false;
							}

/**
 * Ư�� ���ڿ��� �������� ���θ� ��ȯ�Ѵ�.
 */
String.prototype.endsWith = function(str) {
								var p = this.lastIndexOf(str);
								if (p + str.length == this.length)
									return true;
								return false;
							}
/**
 * String ��ü�� trim�� �յ� ���� ��θ� ���� �� �� �ֵ��� �����Ǹ� �Ѵ�.
 */
String.prototype.trim = function() {
							return this.replace(/(^\s+)|\s+$/g, "");
						}

/**
 * ���ڿ� ��ü�� ���Ͽ� replace All�� �����Ѵ�.
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
	 * ���μ��� Kill
	 * [����]
	 * System.killProcess("iexplore.exe");
	 * param processName ���μ�����
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
	 * ���� IP�� ȹ���Ѵ�.
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


function HashMap()
{
	this.length = 0;
	this.items = new Array();

	for (var i = 0; i < arguments.length; i += 2) {
		if (typeof(arguments[i + 1]) != 'undefined') {
			this.items[arguments[i]] = arguments[i + 1];
			this.length++;
		}
	}
   
	this.remove = function(key)
	{
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

	this.put = function(key, value)
	{
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

	this.containsKey = function(key)
	{
		return typeof(this.items[key]) != 'undefined';
	}

	this.clear = function()
	{
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

Properties.prototype = new HashMap();	//���

///////////////////////////////////////////////////////////////////////////////
/**
 * ���� �����ϴ� ����Ʈ ��ü�̴�.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function List() {
	this.table = new Array();

	/**
	 * ����Ʈ�� �ʱ�ȭ�Ѵ�.
	 */
	this.clear = function() {
		for (var i in this.table) {
			delete this.table[i];
		}
	}

	/**
	 * ��Ҹ� �߰��Ѵ�.
	 * @param o �߰��� ���
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
	 * ��Ҹ� ��ü�Ѵ�.
	 * @param idx �ε���
	 * @param o �߰��� ���
	 * @return Object ������ ����� ���
	 */
	this.set = function(idx, o) {
		var oldval = this.table[idx];
		this.table[idx] = o;
		return oldval;
	}

	/**
	 * ��Ҹ� �����ϰ� �ִ��� ���θ� ��ȯ�Ѵ�.
	 * @param o �׽�Ʈ�� ���
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
	 * ����Ʈ���� �ε����� �ִ� ��ü�� ��ȯ�Ѵ�.
	 * @param idx �ε���
	 * @return ��ü
	 */
	this.get = function(idx) {
		return this.table[idx];	
	}

	/**
	 * ã�����ϴ� ����� �ε�����ȣ�� ��ȯ�ϴ�. ���ٸ� -1�� ��ȯ�Ѵ�.
	 * @param o ã�����ϴ� ���
	 * @return �ε�����ȣ �Ǵ� -1
	 */
	this.indexOf = function(o) {
		for (var i = 0; i < this.table.length; i++) {
			if (this.table[i] == o)
				return i;
		}

		return -1;
	}

	/**
	 * ����Ʈ���� ��Ұ� �ִ��� ���θ� ��ȯ�Ѵ�.
	 * @returns true, false
	 */
	this.isEmpty = function() {
		return (this.table.length == 0) ? true : false;
	}

	/**
	 * ����Ʈ���� ����� ��ȯ�Ѵ�.
	 * @returns ������
	 */
	this.size = function() {
		return this.table.length;
	}

	/**
	 * ����Ʈ���� �ε����� �ش��ϴ� ��Ҹ� �����.
	 * remove(idx)�� �ش��ϸ�
	 * �Ǵ� �ε������� ���� ��ü�� ã�Ƽ� �����.
	 * remove(object)�� �ش��Ѵ�.
	 * �̰��� �Ǵ� ������ �Ķ���� idx�� number Ÿ���ϰ���
	 * ���ڷ� �Ǵ��Ͽ� ó���ϸ�, ��������쿡 ���ڷ� ó���ȴ�.
	 * @param idx �ε�����ȣ �Ǵ� ��ü
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
	 * ����Ʈ���� ���� �迭�� ��ȯ�Ѵ�.
	 * @returns Array of value
	 */
	this.toArray = function() {
		return this.table.slice(0, this.table.length);
	}

	/**
	 * ������ fromIndex�� toIndex ������ �ε����� ��ġ�� 
	 * ��ü���� List ���·� ��ȯ�Ѵ�.
	 * ��, fromIndex�� ��ü�� ���Ե�����, toIndex�� ��ü�� ���ԵǴ� �ʴ´�.
	 * @param fromIndex �����ε���
	 * @param toIndex ���ε���
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
	 * ��ü�� ǥ���ϴ� ���ڿ��� ��ȯ�Ѵ�.
	 * @return String ǥ���Ǵ� ���ڿ�
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
 * ���� �����ϴ� ť ��ü�̴�.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function Queue() {
    /**
	 * ��Ҹ� �߰��Ѵ�.
	 * @param o �߰��� ���
	 */
	this.push = function(o) {
		this.add(o);
	}

	/**
	 * ��Ҹ� ������.
	 * @return ���� ���
	 */
	this.pop = function() {
		var val = this.get(0);
		this.remove(0);

		return val;
	}

	/**
	 * ���� ��Ҹ� Ȯ���Ѵ�.
	 * pop�� ���������, ��Ҹ� �������� �ʴ´�.
	 * @return ���� ���
	 */
	this.peek = function() {
		return this.get(0);
	}
}

Queue.prototype = new List();	//���

///////////////////////////////////////////////////////////////////////////////
/**
 * ���� �����ϴ� ���� ��ü�̴�.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function Stack() {
	/**
	 * ��Ҹ� �߰��Ѵ�.
	 * @param o �߰��� ���
	 */
	this.push = function(o) {
		this.add(o);
	}

	/**
	 * ��Ҹ� ������.
	 * @return ���� ���
	 */
	this.pop = function() {
		var idx = this.size() - 1;
		var val = this.get(idx);
		this.remove(idx);

		return val;
	}

	/**
	 * ���� ��Ҹ� Ȯ���Ѵ�.
	 * pop�� ���������, ��Ҹ� �������� �ʴ´�.
	 * @return ���� ���
	 */
	this.peek = function() {
		var idx = this.size() - 1;
		return this.get(idx);
	}
}

Stack.prototype = new List();	//���
