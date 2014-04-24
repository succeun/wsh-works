/* ========================================================================= 
 * WSH-Works is WSH(Windows Script Host) javascript wrapper library
 *  (c) 2009-2014 Jeong-Ho, Eun
 * =========================================================================
 *
 * Copyright (c) 2011 Naz Hamid (nazhamid.com/weighshift.com)
 *  
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * ========================================================================= */
 
function Excel() {
	this.excel = new ActiveXObject("Excel.Application");

	this.books = function (filename) {
		this.excel.Workbooks.Open(filename, false, false);
		return new Book(this.excel.ActiveWorkbook);
	}

	this.visible = function(value) {
		//Setter
		if (arguments.length > 0)
		{
			this.excel.Visible = arguments[0];
		} else {
			//Getter
			return this.excel.Visible;
		}
	}

	this.quit = function() {
		this.excel.Quit();
	}

	function Book(workBook) {
		this.book = workBook;
		
		this.book.Saved = true;	// ���� ������� ����

		this.sheets = function(index) {
			if (index == null) {	// index�� ���ٸ�, ��ü Collections�� ��ȯ
				var cnt = this.book.Worksheets.Count;
				var colls = new Array();
				for (var i = 0; i < cnt; i++) {
					colls[i] = new Sheet(this.book.Worksheets(i + 1));
				}
				return colls;
			} else {
				if (index <= 0)	
					throw new Error('Index is bigger than 0');
				return new Sheet(this.book.Worksheets(index));
			}
		}

		this.sheetsCount = function() {
			return this.book.Worksheets.Count;
		}

		this.close = function() {
			this.book.Close(true);	// �⺻������ ����Ǹ� ����� ��
		}
		
		this.save = function() {
			this.book.Save();
		}

		this.saveAs = function(filename) {
			this.book.SaveAs(filename);
		}

		this.name = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.book.Name = arguments[0];
			} else {
				//Getter
				return this.book.Name;
			}
		}

		this.toString = function() {
			return "Book: "+ this.book.Name;
		}
	}


	function Sheet(workSheet) {
		this.sheet = workSheet;

		this.name = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.sheet.Name = arguments[0];
			} else {
				//Getter
				return this.sheet.Name;
			}
		}
		
		this.cells = function(xy, y) {
			if (typeof(xy) == "number") {	// xy�� �Ϲ� ������ x�� �ι�° y���� ������ x,y ��ǥ�� ��ȯ�Ѵ�.
				var x = xy;
				return new Cell(this.sheet.Cells(x, y));
			}
			
			var re = new RegExp("([a-zA-Z~]+)([0-9~]+)","ig");
			var arr = re.exec(xy);
			var column = RegExp.$1;			// Column
            var row = RegExp.$2;			// Row
			column = this.itos(column);
			row = parseInt(row);
			return new Cell(this.sheet.Cells(row, column), xy);
		}

		this.itos = function(value) {
			var ASCII =  {"A":65, "B":66, "C":67, "D":68, "E":69, "F":70, "G":71, 
						  "H":72, "I":73, "J":74, "K":75, "L":76, "M":77, "N":78,
						  "O":79, "P":80, "Q":81, "R":82, "S":83, "T":84, "U":85, 
						  "V":86, "W":87, "X":88, "Y":89, "Z":90};

			var str = value.toUpperCase();
			var x = 0;
			for (var i = 0; i < str.length; i++)
			{
				var j = (ASCII[ str.charAt(str.length - 1 - i) ] - 64);
				x += j + i * 26;
			}

			return x;
		}

		this.toString = function() {
			return "Sheet: " + this.sheet.Name;
		}
	}

	function Cell(cell, xy) {
		this.cell = cell;
		this.xy = xy;
		
		this.value = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.cell.value = arguments[0];
			} else {
				//Getter
				return this.cell.value;
			}
		}

		this.getValue = function() {
			return this.cell.value;
		}

		this.setValue = function(value) {
			return this.cell.value = value;
		}

		this.color = function() {	// 5 : blue
			//Setter
			if (arguments.length > 0)
			{
				this.cell.Interior.colorIndex = arguments[0];
			} else {
				//Getter
				return this.cell.Interior.colorIndex;
			}
		}

		this.font = function() {
			return new Font(this.cell);
		}
		
		this.toString = function() {
			return "Cell: " + this.xy;
		}
	}

	function Font(cell) {
		this.cell = cell;

		this.bold = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.cell.Font.Bold = arguments[0];
			} else {
				//Getter
				return this.cell.Font.Bold;
			}
		}

		this.name = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.cell.Font.Name = arguments[0];
			} else {
				//Getter
				return this.cell.Font.Name;
			}
		}

		this.size = function() {
			//Setter
			if (arguments.length > 0)
			{
				this.cell.Font.Size = arguments[0];
			} else {
				//Getter
				return this.cell.Font.Size;
			}
		}
	}

}



function InternetExplorer() {
	this.ie = new ActiveXObject("InternetExplorer.Application");

	this.nevigate = function(url) {
		this.ie.Navigate(url);
	}

	this.quit = function() {
		this.ie.Quit();
	}

	this.visible = function(value) {
		if (value == null)
			return this.ie.Visible;
		else
			this.ie.Visible = value;
	}

	this.addressBar = function(value) {
		if (value == null)
			return this.ie.addressBar;
		else
			this.ie.addressBar = value;
	}
	
	this.menuBar = function(value) {
		if (value == null)
			return this.ie.MenuBar;
		else
			this.ie.MenuBar = value;
	}
	
	this.statusBar = function(value) {
		if (value == null)
			return this.ie.StatusBar;
		else
			this.ie.StatusBar = value;
	}

	this.toolBar = function(value) {
		if (value == null)
			return this.ie.ToolBar;
		else
			this.ie.ToolBar = value;
	}
}



// ����
// var reg = new Registry();
// var sub_key = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\����_is1";
// var value_name = "UninstallString";
// var val = reg.GetExpandedStringValue(reg.HKLM, sub_key, value_name);
// WScript.Echo(val);

function Registry(computer) {
	if(!computer) {
		computer = ".";
	}

	var locator = new ActiveXObject("WbemScripting.SWbemLocator");
	var server = locator.ConnectServer(computer, "root\\default");
	this.stdregprov = server.Get("StdRegProv");

	this.HKCR = 0x80000000;	// HKEY_CLASSES_ROOT
	this.HKCU = 0x80000001;	// HKEY_CURRENT_USER
	this.HKLM = 0x80000002;	// HKEY_LOCAL_MACHINE
	this.HKUS = 0x80000003;	// HKEY_USERS
	this.HKCC = 0x80000005;	// HKEY_CURRENT_CONFIG

	this.REG_SZ = 1;
	this.REG_EXPAND_SZ = 2;
	this.REG_BINARY = 3;
	this.REG_DWORD = 4;
	this.REG_MULTI_SZ = 7;

	this.do_method = function(method_name, hkey, key, value_name) {
		var in_param = this.stdregprov.Methods_.Item(method_name).InParameters.SpawnInstance_();
		in_param.hDefKey = hkey;
		in_param.sSubKeyName = key;
		if(value_name != null)
		{
			in_param.sValueName = value_name;
		}
		var out = this.stdregprov.ExecMethod_(method_name, in_param);
		return	out;
	},

	this.EnumKey = function(hkey, key) {
		var out_param = this.do_method("EnumKey", hkey, key);
		var names = [];
		if(out_param.sNames != null)
		{
			names = out_param.sNames.toArray();
		}
		return	names;
	},

	this.EnumValues = function(hkey, key) {
		var out_param = this.do_method("EnumValues", hkey, key);
		var value_names = [];
		if(out_param.sNames != null)
		{
			value_names = out_param.sNames.toArray();
		}
		var value_types = [];
		if(out_param.Types != null)
		{
			value_types = out_param.Types.toArray();
		}

		return	{
			Names: value_names,
			Types: value_types
		};
	},

	this.GetStringValue = function(hkey, key, name) {
		// REG_SZ
		var out_param = this.do_method("GetStringValue", hkey, key, name);

		// �������� ������ null
		return out_param.sValue;
	},

	this.GetExpandedStringValue = function(hkey, key, name) {
		// REG_EXPAND_SZ
		var out_param = this.do_method("GetExpandedStringValue", hkey, key, name);

		// �������� ������ null
		return out_param.sValue;
	},

	this.GetDWORDValue = function(hkey, key, name) {
		// REG_DWORD
		var out_param = this.do_method("GetDWORDValue", hkey, key, name);

		// �������� ������ null
		return out_param.uValue;
	}
}/**
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
// http://msdn.microsoft.com/en-us/library/ms678086(VS.85).aspx

function ODBC(dsnName, userId, password) {
	this.conn = new ActiveXObject("ADODB.Connection");

	this.dsn = dsnName;
	this.id = userId;
	this.pwd = password;
	this.query = "DSN=" + this.dsn + ";UID=" + this.id + ";PWD=" + this.pwd;

	this.dsnName = function() {
		//Setter
		if (arguments.length > 0) {
			this.dsn = arguments[0];
		} else {
			//Getter
			return this.dsn;
		}
	}

	this.userId = function() {
		//Setter
		if (arguments.length > 0) {
			this.id = arguments[0];
		} else {
			//Getter
			return this.id;
		}
	}

	this.password = function() {
		//Setter
		if (arguments.length > 0) {
			this.pwd = arguments[0];
		} else {
			//Getter
			return this.pwd;
		}
	}

	this.connect = function() {
		this.conn.Open(this.query);
		return this;
	}

	this.execute = function(sql, hash) {
		if (hash == null)
			return new ResultSet(this.conn.Execute(sql));
		else {
			var pattern = /\$\{([a-zA-Z_][a-zA-Z0-9_\x5F]*)\}/g;
			var query = sql;
			var match;
			while ((match = pattern.exec(query)) != null) {
				var key = match[1];
				var value = hash[key];
				query = query.substring(0, match.index) + value + query.substring(match.lastIndex, query.length);
			}
			return new ResultSet(this.conn.Execute(query));
		}
	}

	this.close = function() {
		if (this.conn != null)
			this.conn.Close();
	}

	function ResultSet(rs) {
		this.rs = rs;
		if (!this.rs.EOF) {
			rs.MoveFirst();
		}

		this.isFirst = true;

		this.close = function() {
			if (this.rs != null)
				this.rs.Close();
		}

		this.next = function() {
			if (this.isFirst)
				this.isFirst = false;
			else
				this.rs.MoveNext();
			return !this.rs.EOF;
		}
		
		// �÷��� �Ǵ� �ε���
		this.get = this.value = this.getValue = function(nameOrIndex) {
			return this.rs(nameOrIndex);
		}
	}
}

function FileSystem() {
	this.fso = new ActiveXObject("Scripting.FileSystemObject");

	this.dir = function(foldername) {
		return new File(this.fso, this.fso.getfolder(foldername), true);
	}

	this.file = function(foldername) {
		return new File(this.fso, this.fso.GetFile(foldername), false);
	}

	this.availableSpace = function(drivename) {	// ����̺��� ����뷮�� ��ȯ�Ѵ�. Ex) C: -> C
		var drives = new Enumerator(this.fso.drives);
		for (; !drives.atEnd(); drives.moveNext()) {
			var drive = drives.item();
			if (drive.IsReady && drive.DriveLetter == drivename) {
				return drive.AvailableSpace;
			}
		}

		throw new Error("Not exists " + drivename + ".");
	}

	this.getFSO = function() {
		return this.fso;
	}

	this.iterateFiles = function(foldername, func) {
		var list = this.dir(foldername).list();
		var enums = new Enumerator(list);
		enums.moveFirst();

		while (!enums.atEnd()) {
			var file = enums.item();
			if (file.isFile()) {
				func(file);
			} else { 
				this.iterateFiles(file.path(), func);	
			}
			enums.moveNext();
		}
	}

	this.iterateDirs = function(foldername, func) {
		var list = this.dir(foldername).list();
		var enums = new Enumerator(list);
		enums.moveFirst();

		while (!enums.atEnd()) {
			var dir = enums.item();
			if (dir.isDir()) {
				func(dir);
				this.iterateDirs(dir.path(), func);	
			}
			enums.moveNext();
		}
	}

	function File(fso, file, isDirectory) {
		this.fso = fso;
		this.file = file;
		this.isDirectory = isDirectory;
		
		this.raw = function() {
			return this.file;
		}
		
		this.name = function() {
			return this.file.Name;
		}

		this.path = function() {
			return this.file.Path;
		}

		this.size = function() {
			return this.file.Size;
		}

		this.isDir = function() {
			return this.isDirectory;
		}

		this.isFile = function() {
			return !this.isDirectory;
		}

		this.files = function() {
			var children = new Enumerator(this.file.files);
			var files = new Array();
			var i = 0;
		    for (; !children.atEnd(); children.moveNext()) {
				files[i++] = new File(this.fso, children.item(), false);
			}
			return files;
		}

		this.dirs = function() {
			var children = new Enumerator(this.file.SubFolders);
			var dirs = new Array();
			var i = 0;
		    for (; !children.atEnd(); children.moveNext()) {
				dirs[i++] = new File(this.fso, children.item(), true);
			}
			return dirs;
		}
		
		/**
		 * ���� �� ���丮 ����� ��ȯ�Ѵ�.
		 * filter function�� �־��� ���, �־��� �̸� ���͸��� �� �� �ִ�.
		 * @param filterfnc function(name) { return true; } ���¸� ���Ѵ�.
		 * @return ���
		 */
		this.list = function(filterfnc) {
			var children = new Enumerator(this.file.files);
			var files = new Array();
			var i = 0;
		    for (; !children.atEnd(); children.moveNext()) {
				if (filterfnc != null) { 
					var name = children.item().name;
					if (filterfnc(name))
					{
						files[i++] = new File(this.fso, children.item(), false);
					}
				} else {
					files[i++] = new File(this.fso, children.item(), false);
				}
			}

			children = new Enumerator(this.file.SubFolders);
			for (; !children.atEnd(); children.moveNext()) {
				if (filterfnc != null) { 
					var name = children.item().name;
					if (filterfnc(name))
					{
						files[i++] = new File(this.fso, children.item(), true);
					}
				} else {
					files[i++] = new File(this.fso, children.item(), true);
				}
			}
			return files;
		}

		this.toString = function() {
			return this.file.Path;
		}

		this.text = function() {
			//Setter
			if (arguments.length > 0) {
				var ForReading = 1, ForWriting = 2, ForAppending = 8;
				var TristateUseDefault = -2 /* System Default */, TristateTrue = -1 /* Unicode */, TristateFalse = 0 /* ASSCII */;
				var ts = this.file.OpenAsTextStream(ForWriting, TristateUseDefault);
				ts.WriteLine(arguments[0]);
				ts.Close();
			} else {
				//Getter
				var ForReading = 1, ForWriting = 2, ForAppending = 8;
				var file = this.fso.OpenTextFile(this.file.Path, ForReading);
				if (file.AtEndOfStream)
					return "";
				else
					return file.ReadAll();
			}
		}

		this.parent = function() {
			return new File(this.fso, this.file.parentFolder, true);
		}

		this.remove = function(force) {
			if (this.isDirectory)
				this.fso.DeleteFolder(this.name);
			else
				this.file.Delete(force);
		}

		this.move = function(tofilename) {
			this.fso.Move(this.name);
		}

		this.exists = function() {
			if (this.isDirectory)
				return this.fso.FolderExists(this.file.Path);
			else
				return this.fso.FileExists(this.file.Path);	
		}

		this.createFile = function(name) {
			this.fso.CreateTextFile(name, true);
			var f = this.fso.GetFile(name);
			return new File(this.fso, f, false);
		}
		
		this.createDir = function(name) {
			var f = this.fso.CreateFolder(name);
			return new File(this.fso, f, true);
		}


		this.copy = function(targetfileanme) {
			this.file.copy(targetfileanme);
		}
		
		this.rename = function(fileanme) {
			this.file.Rename(fileanme);
		}

		this.dateCreated = function() {
			if (this.isDirectory) {
				if (this.file.IsRootFolder)
					throw new Error('This is Root folder.');	
			}
			return this.file.DateCreated;
		}

		this.dateLastAccessed = function() {
			if (this.isDirectory) {
				if (this.file.IsRootFolder)
					throw new Error('This is Root folder.');	
			}
			return this.file.DateLastAccessed;				
		}

		this.dateLastModified = function() {
			if (this.isDirectory) {
				if (this.file.IsRootFolder)
					throw new Error('This is Root folder.');	
			}
			return this.file.DateLastModified;				
		}
	}
}

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

function Connection() {	// XMLHTTP�� �̿��Ͽ� ������� �⺻������ ��ũ�����Ѵ�.
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

	this.async = false;	// Sync(false), Async(true)
	this.success = false;
	this.state = new State(this, this.xmlHttp);

	/**
	 * ��� �������θ� ��ȯ�Ѵ�.
	 * @return  ��������
	 */
	this.isSuccess = function() {
		return this.success;
	};
	
	/**
	 * ����� ��带 Async�� �����Ѵ�.
	 * @param isAsync Async(true), Sync(false)
	 */
	this.setAsync = function(async) {
		this.async = async;
	};

	/**
	 * ��� ��带 ��ȯ�Ѵ�.
	 * @return Async(true), Sync(false)
	 */ 
	this.isAsync = function() {
		return this.async;
	};

	/**
	 * ������ �����ͼ��� �����Ѵ�.
	 * @param url ���� ��� URL
	 * @param postdata POST�� �ѱ� ������ (default: null)
	 * @param content_type Content-Type (default: "application/x-www-form-urlencoded")
	 *        "text/xml", "multipart/form-data"
	 */
	this.call = function(url, postdata, content_type) {
		this.success = false;
		this.xmlHttp.abort();
		this.xmlHttp.onreadystatechange = this.state.onreadystatechange;

		if (postdata != null && typeof(postdata) != "string") {	// ���ڿ��� �ƴ� �迭�̶��,
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
	 * ��û Header�� ���� �����Ѵ�.
	 * @param key Ű
	 * @param value ��
	 */
	this.setRequestHeader = function(key, value) {
		this.xmlHttp.setRequestHeader(key, value);
	}

	/**
	 * ���� ����� �ݴ´�.
	 */
	this.close = function() {
		this.xmlHttp = null;
		this.state = null;
	};

	/**
	 * ���� ����� �ߴ��Ѵ�.
	 */
	this.abort = function() {
		this.xmlHttp.abort();
	};

	/**
	 * ����� �Ϸ�Ǿ����� ���θ� ��ȯ�Ѵ�.
	 * @return �ϷῩ��
	 */
	this.getLoaded = function() {
		return this.xmlHttp.readyState == 4;
	};

	/**
	 * ����� ���������� ���θ� ��ȯ�Ѵ�.
	 * @return ���࿩��
	 */
	this.getLoading = function() {
		return this.xmlHttp.readyState < 4;
	};

	/**
	 * �Ϲ� �ؽ�Ʈ�� �����´�.
	 * @return �Ϲ� ���ڿ�
	 */
	this.getText = function() {
		return this.xmlHttp.responseText;
	};

	/**
	 * ������� ȹ���� XML DOCUMENT�� ��ȯ�Ѵ�.
	 * @return XMLDOCUMENT
	 */
	this.getXml = function() {
		return this.xmlHttp.responseXML;
	};

	/**
	 * XMLHTTP ��� ��ü�� ��ȯ�Ѵ�.
	 * @return XMLHTTP
	 */
	this.getXmlHttp = function() {
		return this.xmlHttp;
	};

	/**
	 * HTTP ����� ���������� �̷�� ������ ���θ� ��ȯ�Ѵ�.
	 * @return ���� ��� ����
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
	 * Array �� ��ü���� POST�� �ѱ�� ���� ��Ʈ���� ����� ���� ���� �����͸� �̾Ƴ���.
	 * @param buffer StringBuffer
	 * @param element input ��ü
	 * @param isLastElement ������ ��ü���� ����
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
	 * �ش� URL�� ���� �ٿ�ε� �Ͽ�, �־��� Path�� �����Ѵ�.
	 * [����]
	 * var downloader = new Downloader();
	 * downloader.receive(url, path, function(xmlhttp) { }, function(xmlhttp) { WScript.Echo("������ �ٿ�ε��� �� �����ϴ�.") });
	 * @param url �ٿ�ε��� URL
	 * @param path ������ Path
	 * @param successFunc ������ ȣ���� �Լ�
	 * @param failFunc ���н� ȣ���� �Լ�
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

///////////////////////////////////////////////////////////////////////////////
/**
 * �ҿ� �ð� ������ ���� ��ƿ Ŭ�����̴�.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function StopWatch()
{
    this._startTime = -1;
	this._stopTime = -1;

	/**
	 * �ð� ������ �����Ѵ�.
	 */
	this.start = function()
	{
		this._startTime = new Date().getTime();
	}

	/**
	 * �ð� ������ �����Ѵ�.
	 */
	this.stop = function()
	{
		this._stopTime = new Date().getTime();
	}

	/**
	 * �ð������� �����Ѵ�.
	 */
	this.reset = function()
	{
		this._startTime = -1;
		this._stopTime = -1;
	}

	/**
	 * �ҿ�ð��� ��ȯ�Ѵ�.
	 * @param �ҿ�ð�
	 */
	this.getTime = function()
	{
		if (this._stopTime == -1)
			return (new Date.getTime() - this._startTime);
		else
			return (this._stopTime - this._startTime);
	}

	/**
	 * �ɸ��ð��� millisencods�� ����Ͽ� ���ڿ��� ��ȯ�Ѵ�.
	 * @param ���ڿ�
	 */
	this.toString = function()
	{
		var time = this.getTime();
		var milliseconds = time;

		return milliseconds + "ms";
	}

	/**
	 * �ɸ��ð��� hour, minutes, seconds, milliseconds�� ����Ͽ� ���ڿ��� ��ȯ�Ѵ�.
	 * @param ���ڿ�
	 */
	this.getTimeString = function()
	{
		var HIM = 60 * 60 * 1000;
		var MIM = 60 * 1000;
		var hours;
		var minutes;
		var seconds;
		var milliseconds;
		var time = this.getTime();
		hours = time / HIM;
		time = time - (hours * HIM);
		minutes = time / MIM;
		time = time - (minutes * MIM);
		seconds = time / 1000;
		time = time - (seconds * 1000);
		milliseconds = time;

		return hours + "h:" + minutes + "m:" + seconds + "s:" + milliseconds + "ms";
	}
}

///////////////////////////////////////////////////////////////////////////////
/**
 * ������ XML�� ���� ������ Configuration ������ ������ ����Ѵ�.
 * config.xml ���¿��� root �±״� �Ʒ��� ���� config�� �ο��� �Ѵ�.
 * <config>
 *	  <logger>
 *		<regexp-text></regexp-text>
 *		<daemon-enable>true</daemon-enable>
 *		<trace-location>true</trace-location>
 *		<sql-trace-enable>true</sql-trace-enable>
 *	  </logger>
 * </config>
 *
 * ��� �����,
 * <script>
 *		var enable = Configuration.lookup("/logger").get("sql-trace-enable");
 * </script>
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 24.
 */
function Configuration()
{
	if (Configuration._singleton != null)
        return Configuration._singleton;

	Configuration._singleton = this;


	this.filename;

    var fs = new FileSystem();
	var file = fs.file(Configuration.filename);
	this.refer = new XMLReferer(file.text());
	
	/**
	 * ��θ� �����Ѵ�.
	 * @param path ��� ex) /fileserver/ip
	 */
	this.lookup = function(path) {
		this.refer.lookup(path);		
		return this;
	};

	/**
	 * ������ �����´�.
	 * ���� ���� Ű���̳�, ���� �߻��� �⺻���� ��ȯ�Ѵ�.
	 * @param name �Ӽ� Ű��
	 * @param defaultvalue �⺻��(default: "");
	 */
	this.get = function(name, defaultvalue) {
		try {
			this.refer.mark();
			this.refer.lookup(name);
			var value = this.refer.getText();
			this.refer.unmark();
			return value;
		} catch(e) {
			if (defaultvalue != null)
				return defaultvalue;
			else
				return "";
		}
	}
}

/**
 * �ν��Ͻ��� �����´�.
 */
Configuration.getInstance = function() {
    return new Configuration();
}

/**
 * �⺻���� config.xml�� �ƴ� �ٸ� xml�� ���� url�� �����Ѵ�.
 * @param url
 */
Configuration.file = function(filename)
{
	Configuration.filename = filename;
}///////////////////////////////////////////////////////////////////////////////
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
