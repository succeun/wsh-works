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
        
        // 컬럼명 또는 인덱스
        this.get = this.value = this.getValue = function(nameOrIndex) {
            return this.rs(nameOrIndex);
        }
    }
}

