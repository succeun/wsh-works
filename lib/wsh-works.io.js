function FileSystem() {
    this.fso = new ActiveXObject("Scripting.FileSystemObject");

    this.dir = function(foldername) {
        return new File(this.fso, this.fso.GetFolder(foldername), true);
    }

    this.file = function(filename) {
        return new File(this.fso, this.fso.GetFile(filename), false);
    }

    this.exists = function(foldernameOrfilename) {
        var isDirectory = false;
        try {
            var folder = this.fso.GetFolder(foldernameOrfilename);
            isDirectory = true;
        }
        catch (e) {
            isDirectory = false;
        }

        if (isDirectory)
            return this.fso.FolderExists(foldernameOrfilename);
        else
            return this.fso.FileExists(foldernameOrfilename);    
    }

    this.availableSpace = function(drivename) {    // 드라이브의 가용용량을 반환한다. Ex) C: -> C
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
         * 파일 및 디렉토리 목록을 반환한다.
         * filter function이 주어질 경우, 주어진 이름 필터링을 할 수 있다.
         * @param filterfnc function(name) { return true; } 형태를 취한다.
         * @return 목록
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
                var ts = null;
                if (arguments.length > 1)
                    this.file.OpenAsTextStream(ForWriting, arguments[1]);
                else
                    this.file.OpenAsTextStream(ForWriting, TristateUseDefault);
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

        this.textUTF8 = function() {
            //Setter
            if (arguments.length > 0) {
                var fs = new ActiveXObject("ADODB.Stream");
                fs.Type = 2; // Specify stream type
                fs.Charset = "utf-8";
                fs.Open();
                fs.WriteText(arguments[0]);
                fs.SaveToFile(this.file.Path ,2);
            } else {
                //Getter
                var fs = new ActiveXObject("ADODB.Stream");
                fs.Charset = "utf-8";
                fs.Open();
                fs.LoadFromFile(this.file.Path);
                return fs.ReadText();
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

