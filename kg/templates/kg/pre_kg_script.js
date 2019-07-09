
    function getCookie(name) {
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
//遍历匹配
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    }
    function showLoginUser() {
        var isLogin = getCookie("isLogin");

        console.log(isLogin);


        var a = document.querySelector('.login-user');
        if (isLogin == 'True') {
            var user = getCookie('username');
            a.innerHTML = user;
//             a['href']="";

        } else {
            a.innerHTML='登陆';

        }
    }
    showLoginUser();

    function showSelectTriple(name) {
        document.querySelector('.triple-needLink').innerHTML = name;

    }

    <!--导入进度-->
    var queryProgressID = null;

    function initUploadProgress() {
        var myProgress = document.getElementById("myProgress");

        var mySpan = document.getElementById("mySpan");

        myProgress.value = 0;

        mySpan.innerText = "";


    }
    function showUploadProgress(initTime) {
        var myProgress = document.getElementById("myProgress");

        var mySpan = document.getElementById("mySpan");

        var value = myProgress.value;

        mySpan.innerText = value + "%";
        var second = 0, minute = 0, hour = 0, milliSecond = 0, preTime = initTime;
        queryProgressID = setInterval(function () {

            value = myProgress.value;

            if (value < 100) {

                var url = "/kg/get_progress/";
                xhr(url, false, function (res) {

                    console.log('导入进度：' + res, parseFloat(res).toFixed(2));

                    var nowVal = ((parseFloat(res) * 100).toFixed());//四舍五入保留两位小数

                    value = nowVal;
                    console.log(value)
                    myProgress.value = value;

                    mySpan.innerText = value + "%";
                    //计时
                    var nowTime = new Date().getTime();
                    var costTime = nowTime - initTime;
                    var intervalCost = nowTime - preTime;
                    console.log(costTime, intervalCost);
                    preTime = nowTime;
                    milliSecond += intervalCost;
                    if (milliSecond >= 1000) {
                        milliSecond -= 1000;
                        second = second + 1;
//                        costTime-=1000;

                    }
                    if (second >= 60) {
                        second = 0;
                        minute = minute + 1;
                    }

                    if (minute >= 60) {
                        minute = 0;
                        hour = hour + 1;
                    }
                    var timerText = hour + '时' + minute + '分' + second + '秒' + milliSecond + '毫秒';
                    document.getElementById('progressTimer').innerHTML = timerText;


                })


            }

            if (value == 100) {

                clearInterval(queryProgressID);

            }

        }, 500);

    }
    function getRadioValue(name) {
        var radios = document.getElementsByName(name);
        var value;
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].checked) {
                value = radios[i].value;
                break;
            }
        }
        return value;
    }
    function browseFile() {
        var file = document.getElementById('inputGroupFile').files[0]
        var fileName = file['name'];
        var panel = document.querySelector('#import-file');
        panel.querySelector('.custom-file-label').innerHTML = fileName;
    }
    function showUploadResults_entities(resp) {

        //清空数据
        document.querySelector('.fixed-count-result').style.display = 'none';
        document.querySelector('.repeat-information').innerHTML = "";
        document.querySelector('.panel-import-repeat').style.display = 'block';
        document.querySelector('.panel-import-update').style.display = 'none';
        document.querySelector('.panel-import-choice').style.display = 'none';
        document.querySelector('.panel-import-link').style.display = 'none';
        document.querySelector('.panel-import-link-s').style.display = 'none';


        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>entity</th> </tr> </thead>'
        //将返回数据拼接为json数组
//        {#                 var resp = xmlhttp.responseText;-->
        var res = resp;

        console.log(res);
        var tjsons = JSON.parse(res)[0];
        console.log(tjsons);
        var existsJson = tjsons.exists, entityNum = tjsons.entityNum;

        var jsons = JSON.parse(existsJson);
        console.log(jsons);
        var len = jsons.length;
        for (var i = 0; i < jsons.length; i++) {
            var lineNo = jsons[i].lineNo, e = jsons[i].entity;
            e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var inner = '<td>' + lineNo + '</td>' + '<td>' + e + '</td>';


            var tr = '<tr>' + inner + '</tr>';
            tableStr += tr;
        }


        tableStr += "</table>";
        //{#                var pa = document.querySelector('.parent');#}
        var div = document.querySelector('.repeat-information');
        div.innerHTML = tableStr;

        document.querySelector('.import-result').style.display = 'block';
        var resHtml = ' <div style="text-align: center; font-size: 20px;color: black;margin-bottom: 30px">\
                                <div>\
                                    <span>新增实体数：</span>' +
            '<span class="blue" id="myEntityCount">' + entityNum + '</span>\
                                </div>\
                            </div>';

        document.querySelector('.import-result').innerHTML = resHtml;
    }
    function showUploadResults_ment2ent(resp) {
        //清空数据
        document.querySelector('.fixed-count-result').style.display = 'none';
        document.querySelector('.panel-import-link').style.display = 'none';
        document.querySelector('.panel-import-link-s').style.display = 'none';
        document.querySelector('.panel-import-choice').style.display = 'none';
//        {#         document.querySelector('.panel-import-link-choices').style.display = 'none';#
//        }

        document.querySelector('.repeat-information').innerHTML = "";
        document.querySelector('.panel-import-repeat').style.display = 'block';
        document.querySelector('.update-information').innerHTML = "";
        document.querySelector('.panel-import-update').style.display = 'none';
//        {#                 var resp = xmlhttp.responseText;#
//        }
        var res = resp;

        console.log(res);
        var jsons = JSON.parse(res)[0];
        console.log(jsons);
        var existsJson = JSON.parse(jsons.exists),
            ment2entNum = jsons.ment2entNum, entityNum = jsons.entityNum;
        console.log(existsJson);
        //显示重复信息----------------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>m</th><th>e</th> </tr> </thead>'

        var len = existsJson.length;
        for (var i = 0; i < len; i++) {
            var lineNo = existsJson[i].lineNo, m = existsJson[i].m, e = existsJson[i].e;
            m = m.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var inner = '<td>' + lineNo + '</td>' + '<td>' + m + '</td>' + '<td>' + e + '</td>';

            var tr = '<tr>' + inner + '</tr>';
            tableStr += tr;
        }


        tableStr += "</table>";
        //<!--                var pa = document.querySelector('.parent');#}
        var div = document.querySelector('.repeat-information');
        div.innerHTML = tableStr;


        document.querySelector('.import-result').style.display = 'block';
        var resHtml = ' <div style="text-align: center; font-size: 20px;color: black;margin-bottom: 30px">\
                                <div>\
                                    <span>新增实体数：</span>' +
            '<span class="blue" id="myEntityCount">' + entityNum + '</span>\
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                                    <span>新增&lt;mention,entity&gt;对：</span>\
                                    <span class="blue" id="myMent2entCount">' + ment2entNum + '</span>\
                                </div>\
                            </div>';

        document.querySelector('.import-result').innerHTML = resHtml;
        //{#        document.querySelector('#myEntityCount').innerHTML=entityNum+'';#}
        //{#        document.querySelector('#myRelationCount').innerHTML=relationNum+'';#}

    }
    function showUploadResults_types(resp) {
        //清空数据
        document.querySelector('.fixed-count-result').style.display = 'none';
        document.querySelector('.panel-import-link').style.display = 'none';
        document.querySelector('.panel-import-link-s').style.display = 'none';
        document.querySelector('.panel-import-choice').style.display = 'none';
//        {#         document.querySelector('.panel-import-link-choices').style.display = 'none';#
//        }

        document.querySelector('.repeat-information').innerHTML = "";
        document.querySelector('.panel-import-repeat').style.display = 'block';
        document.querySelector('.update-information').innerHTML = "";
        document.querySelector('.panel-import-update').style.display = 'none';
//        {#                 var resp = xmlhttp.responseText;#
//        }
        var res = resp;

        console.log(res);
        var jsons = JSON.parse(res)[0];
        console.log(jsons);
        var existsJson = JSON.parse(jsons.exists),
            typeNum = jsons.typeNum, entityNum = jsons.entityNum;
        console.log(existsJson);
        //显示重复信息----------------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>entity</th><th>type</th> </tr> </thead>'

        var len = existsJson.length;
        for (var i = 0; i < len; i++) {
            var lineNo = existsJson[i].lineNo, e = existsJson[i].entity, t = existsJson[i].type;
            t = t.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var inner = '<td>' + lineNo + '</td>' + '<td>' + e + '</td>' + '<td>' + t + '</td>';

            var tr = '<tr>' + inner + '</tr>';
            tableStr += tr;
        }


        tableStr += "</table>";
        //<!--                var pa = document.querySelector('.parent');#}
        var div = document.querySelector('.repeat-information');
        div.innerHTML = tableStr;


        document.querySelector('.import-result').style.display = 'block';
        var resHtml = ' <div style="text-align: center; font-size: 20px;color: black;margin-bottom: 30px">\
                                <div>\
                                    <span>新增实体数：</span>' +
            '<span class="blue" id="myEntityCount">' + entityNum + '</span>\
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                                    <span>新增类型数：</span>\
                                    <span class="blue" id="myTypeCount">' + typeNum + '</span>\
                                </div>\
                            </div>';

        document.querySelector('.import-result').innerHTML = resHtml;
        //{#        document.querySelector('#myEntityCount').innerHTML=entityNum+'';#}
        //{#        document.querySelector('#myRelationCount').innerHTML=relationNum+'';#}

    }
    function getTdSlice(o, len) {
        var l = o.length;

        var oslice = o.slice(0, len - 3) + "...";


        var td = '<td data-container="body" data-toggle="popover" data-placement="bottom"' +
            'data-content="' + o + '">' + oslice + '</td>';
        //{#        var td= '<td>' + oslice + '</td>';#}
        //{#        console.log(td);#}
        return td;
    }
    function getLine(lineNo, s, p, o, type, slink, olink, nowClass) { //type取值为base/file
        var line = "";
        if (o.indexOf("href") != -1) {
            var ld = o.indexOf("=\""), rd = o.indexOf("\">");
            var oe = o.substring(ld + 2, rd);//OE

            var mld = o.indexOf("\">"), mrd = o.lastIndexOf("</a>");
            var om = o.substring(mld + 2, mrd);//OM

//            //{#            console.log(om);#}
            om = om.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            oe = oe.replace(/"/g, '&quot;').replace(/'/g, '&apos;');


            if (type == 'file') {

                var slinkTd, olinkTd;
                if (slink.length == 0) {
                    slinkTd = '<td>' + s + '</td>';
                } else {
                    slinkTd = genLinkTd(slink, 's', s);
                }


                line = '<tr><td>' + lineNo + '</td>' +
                    slinkTd +
                    '<td>' + p + '</td>' +
                    '<td>' + om + '</td>' +
                    '<td>' + oe + '</td>' +
                    ' <td><a  class="add-triple" onclick="add_choice(this)" >' +
                    ' 添加</a></td></tr>';
            } else if (type == 'base') {
                var inner = '<td>' + '已存在' + '</td>' +
                    '<td>' + s + '</td>' +
                    '<td>' + p + '</td>' +
                    '<td>' + om + '</td>' +
                    '<td>' + oe + '</td>' +
                    '<td>' + '' + '</td>';
                line = '<tr class="' + 'red' + '">' + inner + '</tr>';
            }
        }
        else {//没有OE字段
            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var otd = '<td>' + o + '</td>';
            if (o.length > 35)
                otd = getTdSlice(o, 35);
            if (type == 'file') {  //file需要link

                var slinkTd, olinkTd;
                if (slink.length == 0) {
                    slinkTd = '<td>' + s + '</td>';
                } else {
                    slinkTd = genLinkTd(slink, 's', s);
                }
                if (olink.length == 0) {
                    olinkTd = '<td>' + '' + '</td>';
                } else {
                    olinkTd = genLinkTd(olink, 'oe', o);
                }
                var otd = '<td>' + o + '</td>';
                if (o.length > 35)
                    otd = getTdSlice(o, 35);

                var inner = '<td>' + lineNo + '</td>' + slinkTd + '<td>' + p + '</td>' + otd + olinkTd +
                    ' <td><a  class="add-triple" onclick="add_choice_link(this)" >' +
                    ' 添加</a></td></tr>';

                line = '<tr class="' + nowClass + '">' + inner + '</tr>';


                /*{%
                 comment %
                 }
                 line = '<tr><td>' + lineNo + '</td>' +
                 '<td>' + s + '</td>' +
                 '<td>' + p + '</td>' +
                 otd +
                 '<td>' + '' + '</td>' +
                 ' <td><a  class="add-triple" onclick="add_choice(this)" >' +
                 ' 添加</a></td></tr>';
                 {%
                 endcomment %
                 }*/
            } else if (type == 'base') {
                var inner = '<td>' + '已存在' + '</td>' +
                    '<td>' + s + '</td>' +
                    '<td>' + p + '</td>' +
                    otd +
                    '<td>' + '' + '</td>' +
                    '<td>' + '' + '</td>';
                line = '<tr class="' + 'red' + '">' + inner + '</tr>';
            }


        }

        return line;

    }
    function showCountResult(entityNum, relationNum) {
        //{#        document.querySelector('.import-result').style.display = 'block';#}
        document.querySelector('.fixed-count-result').style.display = 'block';
        var resHtml = '<div style="">\
                                <div>\
                                <span class="hide-count-result" onclick="hide_count_result(this)">x</span>\
                                    <span>新增实体数：</span>' +
            '<span class="blue" id="myEntityCount">' + entityNum + '</span>\
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                                    <span>新增关系数：</span>\
                                    <span class="blue" id="myRelationCount">' + relationNum + '</span>\
                                </div>\
                            </div>';

        document.querySelector('.fixed-count-result').innerHTML = resHtml;

    }
    function updateCountResult(res) {

        console.log(res);
        var ecnt = parseInt(document.querySelector('#myEntityCount').innerText);
        var rcnt = parseInt(document.querySelector('#myRelationCount').innerText);
        if (res['add'] == 'true' && res['s'] == 'true') {
            ecnt += 1;
            document.querySelector('#myEntityCount').innerHTML = (ecnt) + '';
        }
        if (res['add'] == 'true' && res['o'] == 'true') {
            ecnt += 1;
            document.querySelector('#myEntityCount').innerHTML = (ecnt) + '';
        }
        if (res['add'] == 'true')
            document.querySelector('#myRelationCount').innerHTML = (rcnt + 1) + '';
    }
    function hide_count_result(_this) {
        _this.parentNode.parentNode.parentNode.style.display = 'none';
    }
    function showRepeat_triples(existsJson) {
        //显示重复信息----------------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>s</th><th>p</th><th>o</th> </tr> </thead>'

        var len = existsJson.length;
        for (var i = 0; i < len; i++) {
            var lineNo = existsJson[i].lineNo, s = existsJson[i].s, p = existsJson[i].p, o = existsJson[i].o;
            s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var inner = '<td>' + lineNo + '</td>' + '<td>' + s + '</td>' + '<td>' + p + '</td>' + '<td>' + o + '</td>';


            var tr = '<tr>' + inner + '</tr>';
            tableStr += tr;
        }


        tableStr += "</table>";
        //{#                var pa = document.querySelector('.parent');#}
        var div = document.querySelector('.repeat-information');
        div.innerHTML = tableStr;

    }
    function showChoice_triples(choicesJson) {
        //显示选择信息------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>s</th><th>p</th><th>om</th><th>oe</th><th>操作</th> </tr> </thead>'
        var ind = 0;
        for (var key in choicesJson) {
            console.log(key);
            var seg = key.split('*****');
            var s = seg[0], p = seg[1];//,lineNo="",o="";
            s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            var dict = choicesJson[key];
            var base = dict['base'], file = dict['file'];
            console.log(base, file);
            for (var i = 0; i < base.length; i++) {
                var b = base[i];
                var lineNo = b['lineNo'], o = b['o'];

                var line = getLine(lineNo, s, p, o, 'base');
                tableStr += line;


            }
            var nowClass = 'choicegroup' + ind;
            //取消按组全选
            nowClass = '';
            for (var i = 0; i < file.length; i++) {
                var f = file[i];
                var lineNo = f['lineNo'], o = f['o'], slink = f['slink'], olink = f['olink'];
                var line = getLine(lineNo, s, p, o, 'file', slink, olink, nowClass);
                tableStr += line;
            }
            ind++;
        }


        tableStr += "</table>";

        var div = document.querySelector('.choices-information');
        div.innerHTML = tableStr;
    }
    function showSelectLink(value, _this, type) {
        //{#       var #}
        //{#                console.log(value);#}
        var li = _this.parentNode.parentNode.parentNode;
        li.querySelector('.dropdown-toggle').innerHTML = value;
        if (type == 's') {
            var tr = li.parentNode.parentNode;
            var klass = tr.getAttribute('class');
            //{#            console.log(tr, klass)#}
            var trs = document.querySelectorAll('.' + klass);
            //{#            console.log(trs);#}
            for (var i = 0; i < trs.length - 1; i++) {//最后一行’添加组‘不必显示
                tr = trs[i];
                tr.querySelector('.dropdown-toggle').innerHTML = value;
            }
        }

    }
    function genLinkTd(list, type, s) { //type分s,oe

        if (type == 'oe') {
//{#            console.log(s);#}

            var defaultshow = '（无）';
            str = '<td>\
                            <li class="dropdown select-tablename">\
                                <span class="dropdown-toggle link-dropdown" data-toggle="dropdown" aria-expanded="false" value="' + s + '">' +
                defaultshow + '</span><b class="caret"></b>\
                                <ul class="dropdown-menu">';

            str += '<li><a value="' + '（无）' + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + '（无）' + '</a></li><li class="divider"></li>';
            for (var i = 0; i < list.length - 1; i++) {

                var li = '<li><a value="' + list[i] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + list[i] + '</a></li><li class="divider"></li>';
                str += li;
            }
            //{#            if (list.length>=2)#}
            str += '<li><a value="' + list[list.length - 1] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + list[list.length - 1] + '</a></li><li class="divider"></li>';
            str += '</ul></li></td>';

            return str;

        } else if (type == 's') {
            str = '<td>\
                            <li class="dropdown select-tablename">\
                                <span class="dropdown-toggle link-dropdown" data-toggle="dropdown" aria-expanded="false" value="' + s + '">' +
                s + '</span><b class="caret"></b>\
                                <ul class="dropdown-menu">';
            //{#            str+='<li><a value="' + s + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this,' + "'s'" + ')";>' + '（无）' + '</a></li><li class="divider"></li>';#}

            for (var i = 0; i < list.length; i++) {

                var li = '<li><a value="' + list[i] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this,' + "'s'" + ')";>' + list[i] + '</a></li><li class="divider"></li>';
                str += li;
            }

            str += ' <li>\
                                        <div class="link-toggle-edit"><input value="' + s + '">\
                                            <button onclick="saveEntityAndUpdate(this,' + '&quot;' + s + '&quot;' + ')">保存</button>\
                                        </div>\
                                    </li>\
                                    <li class="divider"></li>'
            str += '</ul></li></td>';

            return str;

        }
    }
    function genLinkUlInner(list, type, s) { //type分s,oe

        if (type == 'oe') {
            console.log(s);

            var defaultshow = '（无）';
            str = '';

            str += '<li><a value="' + '（无）' + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + '（无）' + '</a></li><li class="divider"></li>';
            for (var i = 0; i < list.length - 1; i++) {

                var li = '<li><a value="' + list[i] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + list[i] + '</a></li><li class="divider"></li>';
                str += li;
            }
//            //{#            if (list.length>=2)#}
            str += '<li><a value="' + list[list.length - 1] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this)";>' + list[list.length - 1] + '</a></li><li class="divider"></li>';
            str += '';

            return str;

        } else if (type == 's') {
            str = '';
            //{#            str+='<li><a value="' + s + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this,' + "'s'" + ')";>' + '（无）' + '</a></li><li class="divider"></li>';#}

            for (var i = 0; i < list.length; i++) {

                var li = '<li><a value="' + list[i] + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this,' + "'s'" + ')";>' + list[i] + '</a></li><li class="divider"></li>';
                str += li;
            }

            str += ' <li>\
                                        <div class="link-toggle-edit"><input value="' + s + '">\
                                            <button onclick="saveEntityAndUpdate(this,' + '&quot;' + s + '&quot;' + ')">保存</button>\
                                        </div>\
                                    </li>\
                                    <li class="divider"></li>'
            str += '';

            return str;

        }
    }


    function saveEntityAndUpdate(_this, s) {
        //<mention,entity>pair  strategy:7  reason :'人工导入'
        var value = _this.parentNode.querySelector('input').value;
        console.log(value);//value=>s s=>mention
        if (value == "") {
            alert("空值！");
            return;
        }
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                console.log(xmlhttp.responseText.indexOf("添加失败"));
                var res = xmlhttp.responseText;
                //添加成功
                if (res.indexOf("添加成功") != -1) {
                    //更新count结果
                    if (res.indexOf("add entity") != -1) {
                        var ecnt = parseInt(document.querySelector('#myEntityCount').innerText);
                        document.querySelector('#myEntityCount').innerHTML = (ecnt + 1) + '';

                        //更新整个组的link候选框
                        var ul = _this.parentNode.parentNode.parentNode;
                        var li = '<li><a value="' + value + '"onclick=' + '"showSelectLink(this.getAttribute(&apos;value&apos;),this,' + "'s'" + ')";>' + value + '</a></li><li class="divider"></li>';

                        var tr = ul.parentNode.parentNode.parentNode;
                        var klass = tr.getAttribute('class');
                        var trs = document.querySelectorAll('.' + klass);
                        for (var i = 0; i < trs.length - 1; i++) { //最后一行’添加组‘不需渲染
                            tr = trs[i];
                            var ul = tr.querySelector('ul');

                            ul.innerHTML = li + ul.innerHTML;
                            //{#                        tr.querySelector('.dropdown-toggle').innerHTML = value;#}
                        }
                    }


                    //td.click();


                    //ready_ment2ent(true, s);
                } else {
                    alert(res);
                    //ready_ment2ent(true, s);
                }


            }
        }


        xmlhttp.open("GET", "/kg/add_ment2ent/" + s + "/" + value + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();


        //{#        var slink = ['复旦大学', '复旦大学1'];#}
        //{#        var slinkTd = genLinkTd(slink, 's', s);#}


    }
    function getLine_link(lineNo, s, p, o, slink, olink, nowClass) { //type取值为base/file
        var line = "";
        if (o.indexOf("href") != -1) {
            var ld = o.indexOf("=\""), rd = o.indexOf("\">");
            var oe = o.substring(ld + 2, rd);//OE

            var mld = o.indexOf("\">"), mrd = o.lastIndexOf("</a>");
            var om = o.substring(mld + 2, mrd);//OM

            //{#            console.log(om);#}
            om = om.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            oe = oe.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var slinkTd, olinkTd;
            slinkTd = genLinkTd(slink, 's', s);

            var otd = '<td>' + om + '</td>';
            if (om.length > 35)
                otd = getTdSlice(om, 35);

            var inner = '<td>' + lineNo + '</td>' + slinkTd + '<td>' + p + '</td>' + otd + '<td>' + oe + '</td>' +
                ' <td><a  class="add-triple" onclick="add_choice_link(this)" >' +
                ' 添加</a></td></tr>';

            var tr = '<tr class="' + nowClass + '">' + inner + '</tr>';
            line = tr;


        }
        else {//没有OE字段
            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var otd = '<td>' + o + '</td>';
            if (o.length > 35)
                otd = getTdSlice(o, 35);


            var slinkTd, olinkTd;

            slinkTd = genLinkTd(slink, 's', s);
            if (olink.length == 0) {
                olinkTd = '<td>' + '' + '</td>';
            } else {
                olinkTd = genLinkTd(olink, 'oe', o);
            }
            var otd = '<td>' + o + '</td>';
            if (o.length > 35)
                otd = getTdSlice(o, 35);

            var inner = '<td>' + lineNo + '</td>' + slinkTd + '<td>' + p + '</td>' + otd + olinkTd +
                ' <td><a  class="add-triple" onclick="add_choice_link(this)" >' +
                ' 添加</a></td></tr>';

            line = '<tr class="' + nowClass + '">' + inner + '</tr>';


        }


        return line;

    }

    function showLink_triples(needLink) {

        //显示选择信息------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>s</th><th>p</th><th>om</th><th>oe</th><th>操作</th> </tr> </thead>';
        var len = needLink.length;
        for (var i = 0; i < len; i++) { //按字典
            var group = needLink[i];
            var nowClass = 'group' + i;
            //{#            console.log(group);#}
            for (var j = 0; j < group.length; j++) {
                //{#                var json=JSON.parse(group[j]);#}
                //{#                console.log(json);#}
                var gp = group[j];
                var lineNo = gp['lineNo'], s = gp['s'], p = gp['p'], o = gp['o'], slink = gp['slink'],
                    olink = gp['olink'];
                s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

                var tr = getLine_link(lineNo, s, p, o, slink, olink, nowClass);
                tableStr += tr;
            }

            var inner = '<td ></td><td></td><td></td><td></td><td></td>' +
                ' <td style="width:100px"><a  class="add-triple" style="color:red" onclick="add_choice_link_group(this)" >' +
                ' 添加组</a></td></tr>';

            var tr = '<tr class="' + nowClass + '">' + inner + '</tr>';
            tableStr += tr;
        }
        tableStr += "</table>";

        var div = document.querySelector('.link-information');
        div.innerHTML = tableStr;


    }
    //s无link 需用户先进行操作
    function showLink_triples_s(needLink_s) {

        //显示选择信息------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>s</th><th>p</th><th>om</th><th>oe</th><th>操作</th> </tr> </thead>'
        var len = needLink_s.length;
        for (var i = 0; i < len; i++) { //按字典
            var group = needLink_s[i];
            var nowClass = 'group_s' + i;
            for (var j = 0; j < group.length; j++) {
                var gp = group[j];
                var lineNo = gp['lineNo'], s = gp['s'], p = gp['p'], o = gp['o'], slink = gp['slink'],
                    olink = gp['olink'];
                s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
//{#                o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');#}

                /*   {%
                 comment %
                 }
                 console.log(lineNo, slink, slink.length, olink, olink.length);
                 //---------------------
                 // -----
                 var slinkTd, olinkTd;
                 slinkTd = genLinkTd(slink, 's', s);

                 if (olink.length == 0) {
                 olinkTd = '<td>' + '' + '</td>';
                 } else {
                 console.log(o);
                 olinkTd = genLinkTd(olink, 'oe', o);
                 }
                 var otd = '<td>' + o + '</td>';
                 if (o.length > 35)
                 otd = getTdSlice(o, 35);

                 var inner = '<td>' + lineNo + '</td>' + slinkTd + '<td>' + p + '</td>' + otd + olinkTd +
                 ' <td><a  class="add-triple" onclick="add_choice_link(this)" >' +
                 ' 添加</a></td></tr>';

                 var tr = '<tr class="' + nowClass + '">' + inner + '</tr>';
                 {%
                 endcomment %
                 }*/

                var tr = getLine_link(lineNo, s, p, o, slink, olink, nowClass);

                tableStr += tr;

            }

            var inner = '<td ></td><td></td><td></td><td></td><td></td>' +
                ' <td style="width:100px"><a  class="add-triple" style="color:red" onclick="add_choice_link_group(this)" >' +
                ' 添加组</a></td></tr>';

            var tr = '<tr class="' + nowClass + '">' + inner + '</tr>';
            tableStr += tr;

        }


        tableStr += "</table>";

        var div = document.querySelector('.link-information-s');
        div.innerHTML = tableStr;


    }

    function showUploadResults_triples(resp) {

        //清空数据
        document.querySelector('.import-result').style.display = 'none';
        document.querySelector('.panel-import-update').style.display = 'none';
        document.querySelector('.repeat-information').innerHTML = "";
        document.querySelector('.panel-import-repeat').style.display = 'block';
        document.querySelector('.choices-information').innerHTML = "";
        document.querySelector('.panel-import-choice').style.display = 'block';
        document.querySelector('.link-information').innerHTML = "";
        document.querySelector('.panel-import-link').style.display = 'block';
        document.querySelector('.link-information-s').innerHTML = "";
        document.querySelector('.panel-import-link-s').style.display = 'block';
        //{#                var resp = xmlhttp.responseText;#}
        var res = resp;

        console.log(res);
        var jsons = JSON.parse(res)[0];
        //{#        console.log(376, jsons);#}
        //{#        console.log(377, jsons.exists);#}
        //{#        console.log(378, jsons.choices);#}
        var existsJson = JSON.parse(jsons.exists), choicesJson = JSON.parse(jsons.choices),
            relationNum = jsons.relationNum, entityNum = jsons.entityNum, needLink = JSON.parse(jsons.needLink),
            needLink_s = JSON.parse(jsons.needLink_s);
        console.log(existsJson);
        console.log(choicesJson);
        console.log(needLink);
        //{#        console.log(choicesJson.length)#}
        //{#        console.log(choicesJson[0])#}

        showRepeat_triples(existsJson);
        showChoice_triples(choicesJson);
        showLink_triples(needLink);//list
        showLink_triples_s(needLink_s);

        showCountResult(entityNum, relationNum);


        //在文件底部执行时 html模块还没有加载好，需要动态执行js代码
        eval('$(function () {$("[data-toggle=' + "'popover']" + '").popover();});');
        //更新link数据
        var drops = document.querySelectorAll('.link-dropdown');
        var len = drops.length;
        for (var i = 0; i < len; i++) {
            drops[i].addEventListener('click', function () {
                //alert();
                var s = this.getAttribute('value');
                var url = "/kg/get_link/" + s + "/";
                _this = this;
                xhr(url, false, function (res) {
                    res = JSON.parse(res);
                    console.log(res);
                    var nowLink = res;
                    console.log(_this);
                    var ul = _this.parentNode.querySelector('ul');
                    var preNum = ul.querySelectorAll('a').length;
                    console.log(nowLink.length, preNum);
                    //更新ul
                    var type;
                    console.log(ul.querySelector('input'));
                    if (ul.querySelector('input') != null) {
                        type = 's';
                    } else {
                        type = 'oe';
                        preNum -= 1; //（无）占一行
                    }
                    if (nowLink.length > preNum) {
                        var inner = genLinkUlInner(nowLink, type, s);

                        ul.innerHTML = inner;


                    }
                })
            })
        }


    }
    function showUploadResults_triples_noLink(resp) {
        //清空数据
        document.querySelector('.fixed-count-result').style.display = 'none';
        document.querySelector('.panel-import-link').style.display = 'none';
        document.querySelector('.panel-import-link-s').style.display = 'none';
        document.querySelector('.panel-import-choice').style.display = 'none';
//        {#         document.querySelector('.panel-import-link-choices').style.display = 'none';#
//        }

        document.querySelector('.repeat-information').innerHTML = "";
        document.querySelector('.panel-import-repeat').style.display = 'block';
        document.querySelector('.update-information').innerHTML = "";
        document.querySelector('.panel-import-update').style.display = 'none';
//        {#                 var resp = xmlhttp.responseText;#
//        }
        var res = resp;

        console.log(res);
        var jsons = JSON.parse(res)[0];
        console.log(jsons);
        var existsJson = JSON.parse(jsons.exists), tripleNum = jsons.tripleNum, entityNum = jsons.entityNum;
        console.log(existsJson);
        //显示重复信息----------------------------------------------------------------------------------
        var tableStr = '<table class="panel-table table table-hover">';
        //清空表格内容
        tableStr += '<thead> <tr><th>lineNo</th>  <th>s</th><th>p</th><th>o</th> </tr> </thead>'

        var len = existsJson.length;
        for (var i = 0; i < len; i++) {
            var lineNo = existsJson[i].lineNo, s = existsJson[i].s, p = existsJson[i].p, o = existsJson[i].o;
            s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

            var inner = '<td>' + lineNo + '</td>' + '<td>' + s + '</td>' + '<td>' + p + '</td>' + '<td>' + o + '</td>';

            var tr = '<tr>' + inner + '</tr>';
            tableStr += tr;
        }


        tableStr += "</table>";
        //<!--                var pa = document.querySelector('.parent');#}
        var div = document.querySelector('.repeat-information');
        div.innerHTML = tableStr;


        document.querySelector('.import-result').style.display = 'block';
        var resHtml = ' <div style="text-align: center; font-size: 20px;color: black;margin-bottom: 30px">\
                                <div>\
                                    <span>新增实体数：</span>' +
            '<span class="blue" id="myEntityCount">' + entityNum + '</span>\
                                    <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>\
                                    <span>新增关系数：</span>\
                                    <span class="blue" id="mytripleCount">' + tripleNum + '</span>\
                                </div>\
                            </div>';

        document.querySelector('.import-result').innerHTML = resHtml;
    }


    function uploadFile() {

        isLogin = getCookie("isLogin")
        console.log(isLogin)


        if (isLogin == 'True') {


            var fileType = getRadioValue('file-type');
            var linkInfo = document.querySelector('.triple-needLink').innerHTML, needLink = 'false';
            if (linkInfo == '（链接）')
                needLink = 'true';
            else
                needLink = 'false';
            console.log(fileType);

            var form = new FormData();


            console.log(document.getElementById('inputGroupFile').files[0]);
            if (typeof (document.getElementById('inputGroupFile').files[0]) == 'undefined') {
                return;
            }
            form.append('file', document.getElementById('inputGroupFile').files[0]);

            //{#            var fileobj = document.getElementById('img').files[0];#}
            //{#            form.append('img', fileobj);#}

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    console.log("sended")
                    var data = xhr.responseText;
                    switch (fileType) {
                        case 'entities':
                            // console.log(data)
                            if (data == '输入数据不合法！') {
                                clearInterval(queryProgressID);
                                alert(data);
                            }

                            else
                                showUploadResults_entities(data)
                            break;
                        case 'ment2ent':

                            console.log(data)
                            if (data == '非二元组！') {
                                clearInterval(queryProgressID);
                                alert(data);
                            }
                            else
                                showUploadResults_ment2ent(data);
                            break;
                        case 'types':

                            console.log(data)
                            if (data == '非三元组！') {
                                clearInterval(queryProgressID);
                                alert(data);
                            }
                            else
                                showUploadResults_types(data);
                            break;
                        case 'triples':
                            console.log(data)
                            if (data == '非三元组！') {
                                clearInterval(queryProgressID);
                                alert(data);
                            }

                            else {

                                if (needLink == 'true')
                                    showUploadResults_triples(data);
                                else
                                    showUploadResults_triples_noLink(data);

                            }

                            break;
                    }
                }
            };
            initUploadProgress();
            var initTime = new Date().getTime();
            showUploadProgress(initTime);
            xhr.open('post', '/kg/upload/' + fileType + '/' + needLink + '/', true);
            xhr.send(form);


        } else {

            window.location.href = "/kg/login";
        }
    }


    function add_choice(_this) {
        //{#        var _this=this;#}
        console.log(_this);
        var tr = _this.parentNode.parentNode;
        var td = tr.children;
        var s = td[1].innerText, p = td[2].innerText, om = td[3].innerText, oe = td[4].innerText;

        //{#         console.log(td[3].getAttribute('data-content'));#}
        if (td[3].getAttribute('data-content') != null)
            om = td[3].getAttribute('data-content');
        if (oe != "") {
            o = '<a href="' + oe + '">' + om + '</a>';
        } else {
            o = om;
        }

        console.log(s, p, o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                res = JSON.parse(xmlhttp.responseText);
                //{#                if (xmlhttp.responseText == 'success') //{#}

                _this.parentNode.innerHTML = "";
                updateCountResult(res);

                //{#                    genTable_triple(true, s);#}
                //ready(s);
            }
        }
        //把/转为*****,传入后台，以免和url中分隔参数的/混合

        o = o.replace(/\//g, '*****');


        xmlhttp.open("GET", "/kg/add_choice/" + s + "/" + p + "/" + o + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();

    }

    function add_choice_desc(_this) {
        console.log(_this);
        var descDiv = _this.parentNode.parentNode;
        var o = descDiv.querySelector('.desc-content').innerText;

        var panel = descDiv.parentNode.parentNode.parentNode;
        var s = panel.querySelector('.subject').innerText, p = panel.querySelector('.predicate').innerText;

        console.log(s, p, o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                if (xmlhttp.responseText == 'success') {
                    _this.parentNode.innerHTML = "";
                }

            }
        }
        //把/转为*****,传入后台，以免和url中分隔参数的/混合

        o = o.replace(/\//g, '*****');


        xmlhttp.open("GET", "/kg/add_choice/" + s + "/" + p + "/" + o + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();

    }
    function add_choice_link(_this) {
        //{#        var _this=this;#}
        console.log(_this);
        var tr = _this.parentNode.parentNode;
        var td = tr.children;
        var s, p = td[2].innerText, om = td[3].innerText, oe;
        console.log(td[3].getAttribute('data-content'));
        if (td[3].getAttribute('data-content') != null) {
            om = td[3].getAttribute('data-content');
        }

        console.log(td[1].querySelector('.caret'));
        console.log(td[4].querySelector('.caret'));
        if (td[1].querySelector('.caret') != null) {
            s = td[1].querySelector('.dropdown-toggle').innerText;
        } else {
            s = td[1].innerText;
        }
        if (td[4].querySelector('.caret') != null) {
            oe = td[4].querySelector('.dropdown-toggle').innerText;
            if (oe == '（无）')
                oe = '';
        } else {
            oe = td[4].innerText; //即“”
        }

        if (oe != "") {
            o = '<a href="' + oe + '">' + om + '</a>';
        } else {
            o = om;
        }
        console.log(s, p, o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                res = JSON.parse(xmlhttp.responseText);
                //{#                if (xmlhttp.responseText == 'success') //{#}
                if (res['add'] == 'false') {
                    alert('数据已存在！');
                } else {
                    _this.parentNode.innerHTML = "";
                    updateCountResult(res);
                }
            }

            //{#                    genTable_triple(true, s);#}
            //ready(s);
        }
        //把/转为*****,传入后台，以免和url中分隔参数的/混合

        o = o.replace(/\//g, '*****');


        xmlhttp.open("GET", "/kg/add_choice/" + s + "/" + p + "/" + o + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();

    }
    function add_choice_link_group(_this) {
        var klass = _this.parentNode.parentNode.getAttribute('class');
        console.log(klass);
        var trs = document.querySelectorAll('.' + klass);
        var len = trs.length;
        console.log(trs, len);
        for (var i = 0; i < len - 1; i++) {
            var tr = trs[i];
            console.log(tr);
            console.log(tr.querySelector('.add-triple'));
            var a = tr.querySelector('.add-triple');
            if (a != null)
                a.click(this);
        }
    }
    function getCookie(name) {
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
//遍历匹配
        for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) {
                return arr[1];
            }
        }
        return "";
    }


    /* function uploadFile() {
     var files = document.getElementById('upload-file').files; //files是文件选择框选择的文件对象数组

     if (files.length == 0) return;

     var form = new FormData(),
     url = "/kg/upload/triples/", //服务器上传地址
     file = files[0];
     form.append('file', file);

     var xhr = new XMLHttpRequest();
     xhr.open("post", url, true);

     //上传进度事件
     xhr.upload.addEventListener("progress", function (result) {
     if (result.lengthComputable) {
     //上传进度
     var percent = (result.loaded / result.total * 100).toFixed(2);
     }
     }, false);

     xhr.addEventListener("readystatechange", function () {
     var result = xhr;
     if (result.status != 200) { //error
     console.log('上传失败', result.status, result.statusText, result.response);
     }
     else if (result.readyState == 4) { //finished
     console.log('上传成功', result);
     }
     });
     xhr.send(form); //开始上传

     }

     */ //{#    document.querySelector(".parent-panel").style.display = "none";#}


    function query() {

        isLogin = getCookie("isLogin")
        console.log(isLogin)

        //{#        var exp = new Date();#}
        //{#        exp.setTime(exp.getTime() + 60 * 500);//过期时间 2分钟#}
        //{#        document.cookie = document.cookie + ";expires=" + exp.toGMTString();#}

        if (isLogin == 'True') {

            var radios = document.getElementsByName("search_by");
            var value;
            for (var i = 0; i < radios.length; i++) {
                if (radios[i].checked) {
                    value = radios[i].value;
                    break;
                }
            }

            document.querySelector(".parent-panel").style.display = "block";
            var s = document.querySelector("#query-content").value;
            switch (value) {

                case "entity":
                    query_entity(s);

                    break;
                case "ment2ent":
                    query_ment2ent(s);
                    break;
            }


        } else {

            window.location.href = "/kg/login";
        }
    }

    function query_entity(s) {

        document.querySelector(".panel-ment2ent").style.display = "block";
        document.querySelector(".panel-triple").style.display = "block";
        var entrance = true;
        genTable_entity(s, entrance, "byEntity");

    }

    function query_ment2ent(s) {
        //清空之前的内容
        document.querySelector(".entity").innerHTML = "";
        document.querySelector(".triple").innerHTML = "";

        document.querySelector(".panel-triple").style.display = "none";
        document.querySelector(".panel-ment2ent").style.display = "block";

        genTable_entity(s, true, "byMention");

    }

    function genTables(entity) {

    }
    //____________________________________________________________________________________________
    //   triple operarion
    function add() {


        document.querySelector(".add-triple").innerHTML = "保存";
        var inputs = document.querySelectorAll(".query-add-triple");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].type = "text";
        }
        document.querySelector(".add-triple").addEventListener("click", function () {

            var inputs = document.querySelectorAll(".query-add-triple");
            var s = inputs[0].value, p = inputs[1].value, om = inputs[2].value, oe = inputs[3].value, o = "";
            console.log(s);
            console.log(p);
            console.log(om + oe);

            if (oe != "") {
                o = '<a href="' + oe + '">' + om + '</a>';
            } else {
                o = om;
            }


            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    console.log(xmlhttp.responseText.indexOf("不存在"));
                    //如果href中的值不存在于entities表中
                    if (xmlhttp.responseText.indexOf("不存在") != -1)
                        alert(xmlhttp.responseText);
                    if ("already exist" == xmlhttp.responseText)
                        alert("数据已存在！")
                    genTable_triple(true, s);
                    //ready(s);
                }
            }
            //把/转为*****,传入后台，以免和url中分隔参数的/混合

            o = o.replace(/\//g, '*****');


            xmlhttp.open("GET", "/kg/add/" + s + "/" + p + "/" + o + "/", true);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        })
    }

    function del(id, s) {
        console.log("s:" + id + ":e");
        id = id.substr(6);//去除id的triple字段
        console.log(s);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);

                genTable_triple(true, s);
            }
        }


        xmlhttp.open("GET", "/kg/remove/" + id + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }

    //局部渲染三元组
    /* function ready(s) {

     console.log("ready" + s);

     var xmlhttp;
     if (window.XMLHttpRequest) {
     // code for IE7+, Firefox, Chrome, Opera, Safari
     xmlhttp = new XMLHttpRequest();
     } else {
     // code for IE6, IE5
     xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
     }

     xmlhttp.onreadystatechange = function () {
     if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
     // console.log(xmlhttp.responseText);
     var table = document.querySelector('.panel-table');
     //清空表格内容
     table.innerHTML = '<thead> <tr><th>subject</th><th>predicate</th><th>object</th> <th>操作</th> <th>操作</th> </tr> </thead>'
     //将返回数据拼接为json数组
     var resp = xmlhttp.responseText;
     var res = "[";
     res += resp;
     res += "]";

     res = res.replace(/ObjectId\(/g, "");
     res = res.replace(/\)/g, "");
     res = res.replace(/\}\{/g, "},{");
     res = res.replace(/'/g, '"');
     //{#                res=res.replace(new RegExp("ObjectId\(","g"),"");#}
     res = res.replace(new RegExp(')', "g"), "");
     res = res.replace(new RegExp(',"g"),"},{");
     // console.log(res);
     var jsons = JSON.parse(res);
     //  console.log(jsons);
     var len = jsons.length;
     for (var i = 0; i < jsons.length; i++) {
     var id = jsons[i]._id, s = jsons[i].subject, p = jsons[i].predicate, o = jsons[i].object;
     //console.log(id+s+o+p);
     var inner = '<td>' + s + '</td>' +
     '<td>' + p + '</td>' +
     '<td>' + o + '</td>' +
     '<td><a  class="modify" onclick="showModify(this.id)"id="_' + id + '">修改 </a></td>' +
     '<td><a  tid="' + id + '" subject="' + s + '"' + ' onclick="del(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';

     var tr = document.createElement("tr");
     tr.innerHTML = inner;
     table.appendChild(tr);
     }


     table.innerHTML = table.innerHTML +
     ' <tr>' +
     '<td><input type="hidden" class="query-add" name="subject" value="' + s + '"/></td>' +

     ' <td><input type="hidden" class="query-add" name="predicate" placeholder="predicate"/></td>' +

     ' <td><input type="hidden" class="query-add" name="object" placeholder="object"/></td>' +
     ' <td><a  class="add-triple" onclick="add()" >' +
     ' 添加</a></td>' +
     '<td></td>' +
     '</tr>';

     //{#  清空查询的其他内容#}
     document.querySelector(".entity").innerHTML = "";
     document.querySelector(".ment2ent").innerHTML = "";
     document.querySelector(".triple").innerHTML = "";

     }
     }

     xmlhttp.open("GET", "/kg/query_auto/" + s + "/", true);
     xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
     xmlhttp.send();
     }

     */
    //按p排序
    function sortp(a, b) {


        if (a.p > b.p) {
            return 1;
        } else if (a.p < b.p) {
            return -1;
        } else {
            return 0;
        }
    }

    function genTable_triple(exist, s) {


        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log(xmlhttp.responseText);
                var tableStr = '<table class="panel-table table table-hover">';
                //清空表格内容
                tableStr += '<thead> <tr><th>Subject</th><th>Predicate</th><th>OM</th><th>OE</th> <th>操作</th> <th>操作</th></tr> </thead>'
                //将返回数据拼接为json数组
                var resp = xmlhttp.responseText;
                var res = "[";
                res += resp;
                res += "]";

                //{#                res = res.replace(/'/g, '"');//单引号转为双引号#}
                //{#                #}
                //单引号转为双引号    {'_id': 'people"s republic of china'} {'_id': 'people"s republic of china'}
                res = res.replace(/\{'/g, '"');
                res = res.replace(/': '/g, '"');
                res = res.replace(/'\}/g, '"');
                res = res.replace(/\}\{/g, "},{");//每个json之间加上逗号


                res = res.replace(/ObjectId\(/g, "");//objectID删除

                res = res.replace(/"\),/g, '",');//objectId的右括号
                res = res.replace(/"\)/g, '"');//objectId的右括号(_id位于最后一个属性)
                //时间戳不满足json
                res = res.replace(/"timestamp":/g, '"timestamp":"');
                res = res.replace(/\), "/g, '","');//时间戳的右括号
                res = res.replace(/\)}/g, ')"}');//时间戳的右括号

                res = res.replace(/href="/g, "href='");//替换掉href中的双引号
                res = res.replace(/">/g, "'>")
                var jsons = JSON.parse(resp);
                console.log(jsons);
                jsons.sort(sortp);
                console.log(998, jsons);

                var ps = [];
                //{#                ps.insert('head')#}
                for (var i = 0; i < jsons.length; i++)
                    ps.push(jsons[i].p)
                //{#                ps.insert('tail')#}
                //{#                print(ps)#}
                var len = jsons.length;


                //如果entity存在，生成表
                if (exist) {

                    var colors = ['color1', 'color2', 'color3'];
                    var colorInd = 0;
                    var nowp = "", flag = false;
                    for (var i = 0; i < jsons.length; i++) {
                        var id = jsons[i]._id, s = jsons[i].s, p = jsons[i].p, o = jsons[i].o;
                        //console.log(id+s+o+p);
                        id = id.$oid

                        //若o中包含href，显示href的值
                        var href = "", inner = "", om = "";
                        var descHtml = ""
                        //<a href="日语">日语</a>
                        if (o.indexOf("href") != -1) {
                            var ld = o.indexOf("=\""), rd = o.indexOf("\">");
                            var oe = o.substring(ld + 2, rd);//OE

                            var mld = o.indexOf("\">"), mrd = o.lastIndexOf("</a>");
                            var om = o.substring(mld + 2, mrd);//OM

                            console.log(om)
                            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            om = om.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            oe = oe.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            inner = '<td><a  tid="' + s + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + s + '</a></td>' +
                                '<td>' + p + '</td>' +
                                '<td>' + om + '</td>' +
                                '<td><input type="hidden" value=\'' + o + '\'><a  tid="' + oe + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + oe + '</a></td>' +
                                '<td><a  class="modify_triple" onclick="showModify(this.id)"id="_triple' + id + '">修改 </a></td>' +
                                '<td><a  tid="triple' + id + '" subject="' + s + '"' + ' onclick="del(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';
                        } else {//没有OE字段
                            o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                            inner = '<td><a  tid="' + s + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + s + '</a></td>' +
                                '<td>' + p + '</td>' +
                                '<td><input type="hidden" value="' + o + '">' + o + '</td>' +
                                '<td></td>' +//OE
                                '<td><a  class="modify_triple" onclick="showModify(this.id)"id="_triple' + id + '">修改 </a></td>' +
                                '<td><a  tid="triple' + id + '" subject="' + s + '"' + ' onclick="del(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';


                            //DESC的值长度大于40 单独分一栏
                            if (o.length > 40) {
                                descHtml = '<div class="panel panel-default">' +
                                    '<div class="panel-heading" data-toggle="collapse" data-parent="#accordion" data-target="#collapseInformation-abstract-' + id + '">' +
                                    '<h4 class="panel-title">' +
                                    '<div class="subject"><a id="subject' + id + '">' + s + '</a></div>' +
                                    '<br>' +
                                    '<div class="predicate" id="predicate' + id + '">' + p + '</div>' +
                                    '</h4>' +
                                    '</div>' +
                                    '<div id="collapseInformation-abstract-' + id + '" class="panel-collapse collapse in">' +
                                    '<div class="panel-body">' +
                                    '<div class="desc-info"> <div class="desc-content' + id + '">' + o +
                                    '</div><div class="operation">' +
                                    '<span id="modify-desc' + id + '" ><a  style="margin-right:10px" class="modify_triple_desc" onclick="showModifyDesc(this.id)"' + '" id="_triple' + id + '">修改 </a></span>' +
                                    '<a  class="modify_triple_desc" tid="triple' + id + '" subject="' + s + '"' + ' onclick="delDesc(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a>' +
                                    '</div></div> </div> </div> </div> </div>'
                            }

                        }
                        //{#                         var flag=false;#}
                        //{##}
                        if (descHtml != "") {
                            tableStr = descHtml + tableStr;
                        } else {
                            var tr = "";

                            if (p == nowp) {
                                tr = '<tr class="' + colors[colorInd] + '">' + inner + '</tr>';

                            } else if (ps[i] == ps[i + 1]) {
                                flag = false;
                                if (flag == false) {
                                    flag = true;
                                    nowp = p;//新的一组
                                    colorInd = (colorInd + 1) % 3;
                                    tr = '<tr class="' + colors[colorInd] + '">' + inner + '</tr>';
                                }

                            } else {
                                flag = false;

                                tr = '<tr>' + inner + '</tr>';
                            }
                            tableStr += tr;

                        }


                    }

                }
                tableStr += ' <tr>' +
                    '<td><input type="hidden" class="query-add-triple" name="subject" /></td>' +

                    ' <td><input type="hidden" class="query-add-triple" name="predicate" placeholder="predicate"/></td>' +

                    ' <td><input type="hidden" class="query-add-triple" name="om" placeholder="om"/></td>' +
                    ' <td><input type="hidden" class="query-add-triple" name="oe" placeholder="oe"/></td>' +

                    '<td></td>' + ' <td><a  class="add-triple" onclick="add()" >' +
                    ' 添加</a></td>' +

                    '</tr>';


                tableStr += "</table>";
                var div = document.querySelector('.triple');
                div.innerHTML = tableStr;

            }
        }

        xmlhttp.open("GET", "/kg/query_auto/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }


    function saveEditTd(id) {
        var _id = id.substr(7);//删除下划线以及标志triple，获得三元组id
        var inputs = document.querySelectorAll("." + id);
        //console.log(inputs);
        var a = inputs;
        var s = inputs[0].value, p = inputs[1].value, om = inputs[2].value, oe = inputs[3].value, o = "";
        console.log(s);
        console.log(p);
        console.log(om + oe);

        if (oe != "") {
            o = '<a href="' + oe + '">' + om + '</a>';
        } else {
            o = om;
        }
        //console.log(s+p+o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                if (xmlhttp.responseText.indexOf("不存在") != -1)
                    alert(xmlhttp.responseText);
                if ("already exist" == xmlhttp.responseText)
                    alert("数据已存在！")
                console.log(s);
                //ready(s);
                genTable_triple(true, s);
            }
        }

        o = o.replace(/\//g, '*****');
        xmlhttp.open("GET", "/kg/modify/" + _id + "/" + s + "/" + p + "/" + o + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();


    }

    function showAdd() {
        var inputs = document.getElementsByClassName("query-add");
        console.log(inputs);

        for (var i = 0; i < 3; i++) {
            var input = inputs[i];
            input.type = "text";
        }
        inputs[3].type = "submit";

    }

    function showModify(id) {

        // console.log(this);//获得修改标签
        // var id = this.id;//获取三元组的id
        console.log(id);
        var a = document.querySelector("#" + id);
        console.log(a);
        var td = a.parentNode;//td

        console.log(td);

        var tr = td.parentNode;
        console.log(tr);

        var a = tr.children; //td的兄弟节点
        console.log(a);

        var s = a[0].innerText, p = a[1].innerText, om = a[2].innerText, oe = a[3].innerText;
        s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        om = om.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        oe = oe.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        a[0].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + s + "'/>";
        a[1].innerHTML = "<input type='text' name='predicate' class='" + id + "' value='" + p + "'/>";
        a[2].innerHTML = '<input type="text" name="object" class="' + id + '" value=' + "'" + om + "'/>";
        a[3].innerHTML = '<input type="text" name="object" class="' + id + '" value=' + "'" + oe + "'/>";

        td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd(this.id);"> 保存 </a>' +
            '<a  id="' + id + '" onclick="resertEditTd(this.id);"> 取消 </a>'


    }

    function resertEditTd(id) {
        console.log(id);
        var inputs = document.querySelectorAll("." + id);
        console.log(inputs);
        var a = inputs;
        var s = a[0].value;
        genTable_triple(true, s); //此方法是自己写的，局部刷新页面，重新加载数据
    }

    //triple DESC operation------------------------------------------------------
    function showModifyDesc(id) {
        console.log(id)
        var _id = id.substr(7)
        console.log(_id);
        console.log("#subject" + _id)
        s = document.querySelector("#subject" + _id).innerText;
        p = document.querySelector("#predicate" + _id).innerText;
        p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        var descDiv = document.querySelector('.desc-content' + _id)
        var content = descDiv.innerHTML;
        descDiv.innerHTML = '<textarea id="object' + _id + '"style="margin: 0px; height: 200px; width: 100%;">' + content + '</textarea>'
        var modifySpan = document.querySelector('#modify-desc' + _id)
        modifySpan.innerHTML = '<a  style="margin-right:3px" id="' + id + '" onclick="saveEditDesc(this.id)";> 保存 </a>' +
            '<a style="margin-right:10px" id="' + id + '" onclick="resertEditDesc(' + "'" + s + "'" + ');"> 取消 </a>'


    }

    function saveEditDesc(id) {
        var _id = id.substr(7);//删除下划线以及标志triple，获得三元组id
        s = document.querySelector("#subject" + _id).innerText;
        p = document.querySelector("#predicate" + _id).innerText;
        text = document.querySelector('#object' + _id).value;
        console.log(text)
        var o = text;

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                if (xmlhttp.responseText.indexOf("不存在") != -1)
                    alert(xmlhttp.responseText);
                if ("already exist" == xmlhttp.responseText)
                    alert("数据已存在！")
                console.log(s);
                //ready(s);
                genTable_triple(true, s);
            }
        }

        o = o.replace(/\//g, '*****');
        xmlhttp.open("GET", "/kg/modify/" + _id + "/" + s + "/" + p + "/" + o + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();

    }

    function resertEditDesc(s) {
        genTable_triple(true, s);
    }

    function delDesc(id, s) {
        console.log("s:" + id + ":e");
        id = id.substr(6);//去除id的triple字段
        console.log(s);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);

                genTable_triple(true, s);
            }
        }


        xmlhttp.open("GET", "/kg/remove/" + id + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }

    //____________________________________________________________________________________________________
    //entity_operation


    function genTable_entity(s, entrance, type) {

        console.log("genTable_entity" + s);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log("xmlhttp.responseText:" + xmlhttp.responseText);
                //var table = document.querySelector('.panel');
                var tableStr = '<table class="panel-table table table-hover">';
                //清空表格内容
                tableStr += '<thead> <tr><th>entity</th>  <th>操作</th> </tr> </thead>'
                //将返回数据拼接为json数组
                var resp = xmlhttp.responseText;
                var res = resp;

                console.log(res);
                var jsons = JSON.parse(res);
                console.log(jsons);
                var len = jsons.length;
                for (var i = 0; i < jsons.length; i++) {
                    var id = jsons[i]._id, e = jsons[i].entity;
                    //console.log(id+s+o+p);
                    e = id;
                    var inner = '<td><a  tid="' + e + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + e + '</a></td>';
                    var delTd = "";

                    id = id.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    //{#                    &apos;#}
                    console.log(id);
                    delTd = '<td><a  tid="entity' + id + '" subject="' + id + '"' + ' onclick="del_entity(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';

                    var tr = '<tr>' + inner + delTd + '</tr>';
                    tableStr += tr;
                }

                tableStr = tableStr +
                    ' <tr>' +
                    "<td><input type='hidden' class='query-add-entity' name='subject' value='" + id + "'/></td>" +
                    ' <td><a  class="add-entity" onclick="add_entity()" >' +

                    ' 添加</a></td>' +

                    '</tr>';

                tableStr += "</table>";
                var pa = document.querySelector('.parent');
                var div = document.querySelector('.entity');
                div.innerHTML = tableStr;

                //如果是入口，需要生成另外两张表
                console.log("entity res:" + res);

                if (entrance && type == "byEntity") {
                    if (res != "[]") {
                        genTable_ment2ent(true, s);
                        genTable_triple(true, s);
                    } else {
                        genTable_ment2ent(false, s);
                        genTable_triple(false, s);
                    }

                } else if (entrance && type == "byMention") {

                    ready_ment2ent(true, s);
                    if (res != "[]") {
                        ready_ment2ent(true, s);
                        //{#                        genTable_triple(true, s);#}
                    } else {
                        ready_ment2ent(false, s);
                        //{#                        genTable_triple(false, s);#}
                    }

                }
            }
        }

        xmlhttp.open("GET", "/kg/query_auto_entity/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }

    function showModify_entity(id) {

        // console.log(this);//获得修改标签
        // var id = this.id;//获取三元组的id
        console.log(id);
        var a = document.querySelector("#" + id);
        console.log(a);
        var td = a.parentNode;//td

        console.log(td);

        var tr = td.parentNode;
        console.log(tr);

        var a = tr.children; //td的兄弟节点
        console.log(a);
        var s = a[0].innerText;

        if (a[0].children.length === 0) {
            a[0].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + a[0].innerText + "'/>";
        }
        //将编辑改成 保存和取消两个按钮

        //{#{% url 'kg:modify_action'  kg.id  %}#}
        td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_entity(this.id);"> 保存 </a>' +
            '<a  id="' + id + '" onclick="resertEditTd_entity(this.id);"> 取消 </a>'


    }

    function resertEditTd_entity(id) {
        console.log(id);
        var inputs = document.querySelectorAll("." + id);
        console.log(inputs);
        var a = inputs;
        var s = a[0].value;
        genTable_entity(s, false); //此方法是自己写的，局部刷新页面，重新加载数据
    }

    function saveEditTd_entity(id) {
        var _id = id//id.substr(1);//删除下划线，获得三元组id
        var inputs = document.querySelectorAll("." + id);
        //console.log(inputs);
        var a = inputs;
        var s = a[0].value;
        //console.log(s+p+o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                if ("already exist" == xmlhttp.responseText)
                    alert("数据已存在！")
                console.log(s);
                //{#                ready_entity(s);#}
                genTable_entity(s, false);
            }
        }


        xmlhttp.open("GET", "/kg/modify_entity/" + _id + "/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();


    }

    function add_entity() {


        document.querySelector(".add-entity").innerHTML = "保存";
        var inputs = document.querySelectorAll(".query-add-entity");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].type = "text";
        }
        document.querySelector(".add-entity").addEventListener("click", function () {

            var inputs = document.querySelectorAll(".query-add-entity");
            var s = inputs[0].value;
            console.log(s);
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);

                    if ("already exist" == xmlhttp.responseText)
                        alert("数据已存在！")
                    genTable_entity(s, false);
                    //{#                                        ready_entity(s);#}
                }
            }


            xmlhttp.open("GET", "/kg/add_entity/" + s + "/", true);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        })
    }

    function del_entity(id, s) {
        // console.log("s:" + id + ":e");
        s = s.replace(/&nbsp/, ' ').replace(/\//g, ""); //空格 /" /'替换回来
        console.log(s);
        console.log(id);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                genTable_entity(s, false);
            }
        }


        xmlhttp.open("GET", "/kg/remove_entity/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }


    //____________________________________________________________________________________________________
    //ment2ent_operation
    //根据entity和mention分别查询,渲染更新ment2ent需要两组函数 genTable&ready

    function sorte(a, b) {
        if (a.e > b.e) {
            return 1;
        } else if (a.e < b.e) {
            return -1;
        } else {
            return 0;
        }
    }

    function sortm(a, b) {
        if (a.m > b.m) {
            return 1;
        } else if (a.m < b.m) {
            return -1;
        } else {
            return 0;
        }
    }

    function genTable_ment2ent(exist, s) {

        //{#        console.log("ready_ment2ent" + s);#}

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log(xmlhttp.responseText);


                var tableStr = '<table class="panel-table table table-hover">';
                //清空表格内容
                tableStr += '<thead> <tr><th>mention</th> <th>entity</th><th>strategy</th><th>reason</th><th>操作</th> <th>操作</th> </tr> </thead>'

                //将返回数据拼接为json数组
                var resp = xmlhttp.responseText;

                var jsons = JSON.parse(resp);
                jsons.sort(sortm)

                var ps = [];
                //{#                ps.insert('head')#}
                for (var i = 0; i < jsons.length; i++)
                    ps.push(jsons[i].m)

                console.log(jsons);
                var len = jsons.length;

                console.log(exist)
                if (exist) {
                    var nowm = "", flag = false;
                    for (var i = 0; i < jsons.length; i++) {
                        var id = jsons[i]._id, m = jsons[i].m, e = jsons[i].e, strategy = jsons[i].strategy,
                            reason = jsons[i].reason;
                        reason = reason.replace(/</g, "&lt;").replace(/>/g, "&gt;"); //再将href中的双引号变回来
                        //console.log(id+s+o+p);
                        id = id.$oid
                        m = m.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        reason = reason.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        var inner = '<td>' + m + '</td>' +
                            '<td><a  tid="' + e + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + e + '</a></td>' +
                            '<td>' + strategy + '</td>' +
                            '<td>' + reason + '</td>';


                        var tr = "";

                        if (m == nowm) {
                            tr = '<tr class="' + 'error' + '">';

                        } else if (ps[i] == ps[i + 1]) {
                            flag = false;
                            if (flag == false) {
                                flag = true;
                                nowm = m;//新的一组

                                tr = '<tr class="' + 'error' + '">';
                            }

                        } else {
                            flag = false;

                            tr = '<tr>';
                        }
                        tableStr += tr;


                        tableStr += inner + '<td><a  class="modify_ment2ent" onclick="showModify_ment2ent(this.id)"id="_ment2ent' + id + '">修改 </a></td>' +
                            '<td><a  tid="ment2ent' + id + '" subject="' + s + '"' + ' onclick="del_ment2ent(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td></tr> ';

                    }
                }
                tableStr +=
                    ' <tr>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="subject" value="' + "" + '"/></td>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="entity" /></td>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="strategy" value="' + "" + '"/></td>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="reason" /></td>' +
                    '<td></td>' +
                    ' <td><a  class="add-ment2ent" onclick="add_ment2ent_table()" >' +

                    ' 添加</a></td>' +

                    '</tr>';


                tableStr += "</table>";
                var div = document.querySelector(".ment2ent");
                div.innerHTML = tableStr;


            }
        }

        xmlhttp.open("GET", "/kg/query_auto_ment2ent_entity/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }


    function ready_ment2ent(exist, s) {

        console.log("ready_ment2ent" + exist + s);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                // console.log(xmlhttp.responseText);
                var tableStr = '<table class="panel-table table table-hover">';
                //清空表格内容
                tableStr += '<thead> <tr><th>mention</th> <th>entity</th><th>操作</th> <th>操作</th> </tr> </thead>'
                //将返回数据拼接为json数组
                var resp = xmlhttp.responseText;
                console.log(resp)

                var jsons = JSON.parse(resp);
                //{#                  console.log(jsons);#}
                var len = jsons.length;

                jsons.sort(sorte);
                console.log(jsons);

                var ps = [];
                //{#                ps.insert('head')#}
                for (var i = 0; i < jsons.length; i++)
                    ps.push(jsons[i].e)

                if (exist) {
                    var nowe = "", flag = false;
                    for (var i = 0; i < jsons.length; i++) {
                        var id = jsons[i]._id, m = jsons[i].m, e = jsons[i].e;

                        id = id.$oid
                        m = m.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

                        var inner = '<td>' + m + '</td>' +
                            '<td><a  tid="' + e + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + e + '</a></td>' +

                            '<td><a  class="modify_men2ent" onclick="showModify_ment2ent_ready(this.id)" id="_ment2ent' + id + '">修改 </a></td>' +
                            '<td><a  tid="ment2ent' + id + '" subject="' + m + '"' + ' onclick="del_ment2ent_ready(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';


                        var tr = "";

                        if (e == nowe) {
                            tr = '<tr class="' + 'error' + '">';

                        } else if (ps[i] == ps[i + 1]) {
                            flag = false;
                            if (flag == false) {
                                flag = true;
                                nowe = e;//新的一组

                                tr = '<tr class="' + 'error' + '">';
                            }

                        } else {
                            flag = false;

                            tr = '<tr>';
                        }
                        tableStr += tr;
                        tableStr += inner + '</tr>';
                    }
                }

                tableStr = tableStr +
                    ' <tr>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="subject" value="' + "" + '"/></td>' +
                    '<td><input type="hidden" class="query-add-ment2ent" name="entity" /></td>' +

                    '<td></td>' +
                    ' <td><a  class="add-ment2ent" onclick="add_ment2ent()" >' +
                    ' 添加</a></td>' +

                    '</tr>';


                //{#  清空查询的其他内容#}
                document.querySelector(".ment2ent").innerHTML = tableStr;
                //{#                 document.querySelector(".triple").innerHTML = "";#}

            }
        }

        xmlhttp.open("GET", "/kg/query_auto_ment2ent/" + s + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }

    function showModify_ment2ent(id) {

        // console.log(this);//获得修改标签
        // var id = this.id;//获取三元组的id
        console.log(id);
        var a = document.querySelector("#" + id);
        console.log(a);
        var td = a.parentNode;//td

        console.log(td);

        var tr = td.parentNode;
        console.log(tr);
        // b=tr;
        //  var b = //document.querySelector().parent(); //td
        var a = tr.children; //td的兄弟节点
        console.log(a);
        var s = a[0].innerText;
        var i = 0;
        for (; i < 4; i++) {
            text = a[i].innerText;
            text = text.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + text + "'/>";

            //{#            #}
            //{#            if (text.indexOf("'") != -1) {//若包含单引号#}
            //{#                a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value=" + a[i].innerText + "/>";#}
            //{##}
            //{#            } else //{#}
            //{#                a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + a[i].innerText + "'/>";#}
            //{##}
            //{#            }#}
        }
        //将编辑改成 保存和取消两个按钮

        //{#{% url 'kg:modify_action'  kg.id  %}#}
        td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_ment2ent(this.id);"> 保存 </a>' +
            '<a  id="' + id + '" onclick="resertEditTd_ment2ent(this.id);"> 取消 </a>'


    }


    function showModify_ment2ent_ready(id) {

        // console.log(this);//获得修改标签
        // var id = this.id;//获取三元组的id
        console.log(id);
        var a = document.querySelector("#" + id);
        console.log(a);
        var td = a.parentNode;//td

        console.log(td);

        var tr = td.parentNode;
        console.log(tr);
        // b=tr;
        //  var b = //document.querySelector().parent(); //td
        var a = tr.children; //td的兄弟节点
        console.log(a);
        var s = a[0].innerText;

        //{#        if (a[0].children.length === 0) //{#}

        var i = 0;
        for (; i < 4; i++) {

            text = a[i].innerText;
            text = text.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
            a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + text + "'/>";

            //{#            text = a[i].innerText;#}
            //{#            if (text.indexOf("'") != -1) {//若包含单引号#}
            //{#                a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value=\"" + a[i].innerText + "\"/>";#}
            //{##}
            //{#            } else //{#}
            //{#                a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + a[i].innerText + "'/>";#}
            //{##}
            //{#            }#}
        }

        //将编辑改成 保存和取消两个按钮

        //{#{% url 'kg:modify_action'  kg.id  %}#}
        td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_ment2ent_ready(this.id);"> 保存 </a>' +
            '<a  id="' + id + '" onclick="resertEditTd_ment2ent_ready(this.id);"> 取消 </a>'


    }

    function resertEditTd_ment2ent(id) {
        console.log(id);
        var inputs = document.querySelectorAll("." + id);
        console.log(inputs);
        var a = inputs;
        var s = a[0].value, ent = a[1].value;
        genTable_ment2ent(true, ent); //此方法是自己写的，局部刷新页面，重新加载数据
    }

    function resertEditTd_ment2ent_ready(id) {
        console.log(id);
        var inputs = document.querySelectorAll("." + id);
        console.log(inputs);
        var a = inputs;
        var s = a[0].value, ent = a[1].value;
        ready_ment2ent(true, s); //此方法是自己写的，局部刷新页面，重新加载数据
    }

    function saveEditTd_ment2ent(id) {
        console.log(id);
        var _id = id.substr(9);//删除下划线，获得三元组id
        var inputs = document.querySelectorAll("." + id);
        //console.log(inputs);
        var a = inputs;
        var s = a[0].value, ent = a[1].value, strategy = a[2].value, reason = a[3].value;
        //console.log(s+p+o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);
                var res = xmlhttp.responseText
                if (res.indexOf("修改成功") != -1) {
                    genTable_ment2ent(true, ent);
                } else {
                    alert(res)
                    genTable_ment2ent(true, ent);
                }
            }
        }


        xmlhttp.open("GET", "/kg/modify_ment2ent/" + _id + "/" + s + "/" + ent + "/" + strategy + "/" + reason + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();


    }

    //通过ready方法生成的，渲染页面最上方
    function saveEditTd_ment2ent_ready(id) {
        console.log(id);
        var _id = id.substr(9);//删除下划线，获得三元组id
        var inputs = document.querySelectorAll("." + id);
        //console.log(inputs);
        var a = inputs;
        var s = a[0].value, ent = a[1].value, strategy = a[2].value, reason = a[3].value;
        //console.log(s+p+o);

        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var res = xmlhttp.responseText

                if (res.indexOf("修改成功") != -1) {
                    ready_ment2ent(true, s);
                } else {
                    alert(res)
                    ready_ment2ent(true, s);
                }


                //{#                ready_ment2ent(true, s);#}
            }
        }


        xmlhttp.open("GET", "/kg/modify_ment2ent/" + _id + "/" + s + "/" + ent + "/" + strategy + "/" + reason + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();


    }

    function add_ment2ent() {


        document.querySelector(".add-ment2ent").innerHTML = "保存";
        var inputs = document.querySelectorAll(".query-add-ment2ent");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].type = "text";
        }
        document.querySelector(".add-ment2ent").addEventListener("click", function () {

            var inputs = document.querySelectorAll(".query-add-ment2ent");
            var s = inputs[0].value, ent = inputs[1].value;
            console.log(s);
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    console.log(xmlhttp.responseText.indexOf("添加失败"));
                    var res = xmlhttp.responseText;
                    if (res.indexOf("添加成功") != -1) {
                        ready_ment2ent(true, s);
                    } else {
                        alert(res)
                        ready_ment2ent(true, s);
                    }
                    //{#                    else if ("already exist" == xmlhttp.responseText)#}
                    //{#                        alert("数据已存在！")#}
                    //{##}
                    //{#                     else if(xmlhttp.responseText.indexOf("添加失败")!=-1)#}
                    //{#                         alert(xmlhttp.responseText)#}

                }
            }


            xmlhttp.open("GET", "/kg/add_ment2ent/" + s + "/" + ent + "/", true);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        })
    }


    function add_ment2ent_table() {


        document.querySelector(".add-ment2ent").innerHTML = "保存";
        var inputs = document.querySelectorAll(".query-add-ment2ent");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].type = "text";
        }
        document.querySelector(".add-ment2ent").addEventListener("click", function () {

            var inputs = document.querySelectorAll(".query-add-ment2ent");
            var s = inputs[0].value, ent = inputs[1].value;
            console.log(s);
            var xmlhttp;
            if (window.XMLHttpRequest) {
                // code for IE7+, Firefox, Chrome, Opera, Safari
                xmlhttp = new XMLHttpRequest();
            } else {
                // code for IE6, IE5
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText);
                    console.log(xmlhttp.responseText.indexOf("添加失败"));
                    var res = xmlhttp.responseText;
                    if (res.indexOf("添加成功") != -1) {
                        genTable_ment2ent(true, ent);

                    } else {
                        alert(res)
                        genTable_ment2ent(true, ent);
                    }
                }
            }


            xmlhttp.open("GET", "/kg/add_ment2ent/" + s + "/" + ent + "/", true);
            xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xmlhttp.send();
        })
    }

    function del_ment2ent(id, s) {
        // console.log();

        console.log(s);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);

                genTable_ment2ent(true, s);
            }
        }


        xmlhttp.open("GET", "/kg/remove_ment2ent/" + id.substr(8) + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }

    function del_ment2ent_ready(id, s) {
        // console.log();

        console.log(s);
        var xmlhttp;
        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText);

                ready_ment2ent(true, s);
            }
        }


        xmlhttp.open("GET", "/kg/remove_ment2ent/" + id.substr(8) + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    }
