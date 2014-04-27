WSH(Windows Script Host) javascript wrapper library
===========

WSH는 Windows 플랫폼을 위한 언어 독립적인 스크립팅 호스트로서 
VB 스크립트 및 Javascript 엔진 wsh 스크립트를 모두 제공합니다.
이중 Javascript 엔진에서 Java와 유사하게 사용하기 위해 만들었습니다.

Make Script
------

```javascript
<job id="example">
    <script language="JScript" src="../wsh-works.js"/>
    <script language="JScript">
        var fs = new FileSystem();
        fs.iterateFiles("../lib", function(file) {
                                    println(file.path() + " " + file.size());
                                }
                        );
    </script>
</job>
```

Run Script
------

```sh
cscript sample.wsf
wscript sample.wsf
```

Version
------
0.1

