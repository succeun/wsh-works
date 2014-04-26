function Excel() {
    this.excel = new ActiveXObject("Excel.Application");

    this.books = function (filename) {
        var fs = new FileSystem();
        var isExist = fs.exists(filename);
        if (isExist) {
            this.excel.Workbooks.Open(filename, false, false);
            return new Book(this.excel.ActiveWorkbook, false, filename);
        } else {
            var workbook = this.excel.Workbooks.Add();
            return new Book(workbook, true, filename);
        }
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

    function Book(workBook, isNew, filename) {
        this.book = workBook;
        this.isNew = isNew;
        this.filename = filename;
        
        this.book.Saved = true;    // 저장 가능토록 설정

        this.sheets = function(index) {
            if (index == null) {    // index가 없다면, 전체 Collections을 반환
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
            this.book.Close(true);    // 기본적으로 변경되면 덮어쓰게 함
        }
        
        this.save = function() {
            if (this.isNew) {
                println(this.filename);
                this.book.SaveAs(this.filename);
            } else {
                this.book.Save();
            }
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
            if (typeof(xy) == "number") {    // xy가 일반 숫자인 x와 두번째 y값이 들어오면 x,y 좌표로 반환한다.
                var x = xy;
                return new Cell(this.sheet.Cells(x, y));
            }
            
            var re = new RegExp("([a-zA-Z~]+)([0-9~]+)","ig");
            var arr = re.exec(xy);
            var column = RegExp.$1;            // Column
            var row = RegExp.$2;            // Row
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

        this.color = function() {    // 5 : blue
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



// 샘플
// var reg = new Registry();
// var sub_key = "SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\빵집_is1";
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

    this.HKCR = 0x80000000;    // HKEY_CLASSES_ROOT
    this.HKCU = 0x80000001;    // HKEY_CURRENT_USER
    this.HKLM = 0x80000002;    // HKEY_LOCAL_MACHINE
    this.HKUS = 0x80000003;    // HKEY_USERS
    this.HKCC = 0x80000005;    // HKEY_CURRENT_CONFIG

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
        return    out;
    },

    this.EnumKey = function(hkey, key) {
        var out_param = this.do_method("EnumKey", hkey, key);
        var names = [];
        if(out_param.sNames != null)
        {
            names = out_param.sNames.toArray();
        }
        return    names;
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

        return    {
            Names: value_names,
            Types: value_types
        };
    },

    this.GetStringValue = function(hkey, key, name) {
        // REG_SZ
        var out_param = this.do_method("GetStringValue", hkey, key, name);

        // 존재하지 않으면 null
        return out_param.sValue;
    },

    this.GetExpandedStringValue = function(hkey, key, name) {
        // REG_EXPAND_SZ
        var out_param = this.do_method("GetExpandedStringValue", hkey, key, name);

        // 존재하지 않으면 null
        return out_param.sValue;
    },

    this.GetDWORDValue = function(hkey, key, name) {
        // REG_DWORD
        var out_param = this.do_method("GetDWORDValue", hkey, key, name);

        // 존재하지 않으면 null
        return out_param.uValue;
    }
}