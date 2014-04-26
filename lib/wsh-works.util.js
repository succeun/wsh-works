///////////////////////////////////////////////////////////////////////////////
/**
 * 소요 시간 측정을 위한 유틸 클래스이다.
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 4.
 */
function StopWatch() {
    this._startTime = -1;
    this._stopTime = -1;

    /**
     * 시간 측정을 시작한다.
     */
    this.start = function() {
        this._startTime = new Date().getTime();
    }

    /**
     * 시간 측정을 종료한다.
     */
    this.stop = function() {
        this._stopTime = new Date().getTime();
    }

    /**
     * 시간측정을 리셋한다.
     */
    this.reset = function() {
        this._startTime = -1;
        this._stopTime = -1;
    }

    /**
     * 소요시간을 반환한다.
     * @param 소요시간
     */
    this.getTime = function() {
        if (this._stopTime == -1)
            return (new Date.getTime() - this._startTime);
        else
            return (this._stopTime - this._startTime);
    }

    /**
     * 걸리시간을 millisencods로 계산하여 문자열로 반환한다.
     * @param 문자열
     */
    this.toString = function() {
        var time = this.getTime();
        var milliseconds = time;

        return milliseconds + "ms";
    }

    /**
     * 걸리시간을 hour, minutes, seconds, milliseconds로 계산하여 문자열로 반환한다.
     * @param 문자열
     */
    this.getTimeString = function() {
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
 * 서버에 XML과 같은 형태의 Configuration 정보를 가져와 사용한다.
 * config.xml 형태에서 root 태그는 아래와 같이 config로 싸여야 한다.
 * <config>
 *      <logger>
 *        <regexp-text></regexp-text>
 *        <daemon-enable>true</daemon-enable>
 *        <trace-location>true</trace-location>
 *        <sql-trace-enable>true</sql-trace-enable>
 *      </logger>
 * </config>
 *
 * 사용 방법은,
 * <script>
 *        var enable = Configuration.lookup("/logger").get("sql-trace-enable");
 * </script>
 * @author Eun Jeong-Ho, silver@intos.biz
 * @since 2004. 6. 24.
 */
function Configuration() {
    if (Configuration._singleton != null)
        return Configuration._singleton;

    Configuration._singleton = this;


    this.filename;

    var fs = new FileSystem();
    var file = fs.file(Configuration.filename);
    this.refer = new XMLReferer(file.text());
    
    /**
     * 경로를 설정한다.
     * @param path 경로 ex) /fileserver/ip
     */
    this.lookup = function(path) {
        this.refer.lookup(path);        
        return this;
    };

    /**
     * 설정을 가져온다.
     * 만약 없는 키값이나, 에러 발생시 기본값을 반환한다.
     * @param name 속성 키값
     * @param defaultvalue 기본값(default: "");
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
 * 인스턴스를 가져온다.
 */
Configuration.getInstance = function() {
    return new Configuration();
}

/**
 * 기본적인 config.xml이 아닌 다른 xml을 사용시 url을 설정한다.
 * @param url
 */
Configuration.file = function(filename) {
    Configuration.filename = filename;
}

