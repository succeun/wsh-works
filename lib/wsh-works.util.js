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
}