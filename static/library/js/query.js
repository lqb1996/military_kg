/**
 * Created by lina on 2018/9/8.
 */


function query() {

    var isLogin = getCookie("isLogin")
    console.log(isLogin)


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
    document.querySelector(".panel-types").style.display = "block";
    var entrance = true;
    genTable_entity(s, entrance, "byEntity");

}

function query_ment2ent(s) {
    //清空之前的内容
    document.querySelector(".entity").innerHTML = "";
    document.querySelector(".triple").innerHTML = "";
    document.querySelector(".types").innerHTML = "";

    document.querySelector(".panel-triple").style.display = "none";
    document.querySelector(".panel-types").style.display = "none";
    document.querySelector(".panel-ment2ent").style.display = "block";

    genTable_entity(s, true, "byMention");

}


//____________________________________________________________________________________________
//   triple operarion
function add(_this) {


    _this.innerHTML = "保存";
    var tr=_this.parentNode.parentNode;
    var inputs = tr.querySelectorAll(".query-add-triple");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }
    _this.addEventListener("click", function () {
        var tr=_this.parentNode.parentNode;
        var inputs = tr.querySelectorAll(".query-add-triple");
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

            if (xmlhttp.responseText=='non-editable')
              return ;
            var tableStr = '<table class="panel-table table table-hover">';
            //清空表格内容
            tableStr += '<thead> <tr><th>Subject</th><th>Predicate</th><th>OM</th><th>OE</th> <th>操作</th> <th>操作</th></tr> </thead>'
            //将返回数据拼接为json数组
            var resp = xmlhttp.responseText;

            var jsons = JSON.parse(resp);
            console.log(jsons);
            jsons.sort(sortp);
            console.log(998, jsons);

            var ps = [];
            for (var i = 0; i < jsons.length; i++)
                ps.push(jsons[i].p)

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
                            '<td><a  class="modify_triple" onclick="showModify(this.id,this)"id="_triple' + id + '">修改 </a></td>' +
                            '<td><a  tid="triple' + id + '" subject="' + s + '"' + ' onclick="del(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';
                    } else {//没有OE字段
                        o = o.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                        inner = '<td><a  tid="' + s + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + s + '</a></td>' +
                            '<td>' + p + '</td>' +
                            '<td><input type="hidden" value="' + o + '">' + o + '</td>' +
                            '<td></td>' +//OE
                            '<td><a  class="modify_triple" onclick="showModify(this.id,this)"id="_triple' + id + '">修改 </a></td>' +
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
                                '<span id="modify-desc' + id + '" ><a  style="margin-right:10px" class="modify_triple_desc" onclick="showModifyDesc(this.id,this)"' + '" id="_triple' + id + '">修改 </a></span>' +
                                '<a  class="modify_triple_desc" tid="triple' + id + '" subject="' + s + '"' + ' onclick="delDesc(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a>' +
                                '</div></div> </div> </div> </div> </div>'
                        }

                    }

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

                '<td></td>' + ' <td><a  class="add-triple" onclick="add(this)" >' +
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


function saveEditTd(id,_this) {
     var ptr=_this.parentNode.parentNode;
    var _id = id.substr(7);//删除下划线以及标志triple，获得三元组id
    var inputs = ptr.querySelectorAll("." + id);
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
            // genTable_triple(true, s);
            query_entity(s);
        }
    }

    o = o.replace(/\//g, '*****');
    xmlhttp.open("GET", "/kg/modify/" + _id + "/" + s + "/" + p + "/" + o + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();


}



function showModify(id,_this) {

    // console.log(this);//获得修改标签
    // var id = this.id;//获取三元组的id
     var ptr=_this.parentNode.parentNode;
    // console.log(id);
    var a = ptr.querySelector("#" + id);
    // console.log(a);
    var td = a.parentNode;//td

    // console.log(td);

    var tr = td.parentNode;
    // console.log(tr);

    var a = tr.children; //td的兄弟节点
    // console.log(a);

    var s = a[0].innerText, p = a[1].innerText, om = a[2].innerText, oe = a[3].innerText;
    s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    om = om.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    oe = oe.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    a[0].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + s + "'/>";
    a[1].innerHTML = "<input type='text' name='predicate' class='" + id + "' value='" + p + "'/>";
    a[2].innerHTML = '<input type="text" name="object" class="' + id + '" value=' + "'" + om + "'/>";
    a[3].innerHTML = '<input type="text" name="object" class="' + id + '" value=' + "'" + oe + "'/>";

    td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd(this.id,this);"> 保存 </a>' +
        '<a  id="' + id + '" onclick="resertEditTd(this.id,this);"> 取消 </a>'


}

function resertEditTd(id,_this) {
     var ptr=_this.parentNode.parentNode;
    var inputs = ptr.querySelectorAll("." + id);
    console.log(inputs);
    var a = inputs;
    var s = a[0].value;
    genTable_triple(true, s); //此方法是自己写的，局部刷新页面，重新加载数据
}

//triple DESC operation------------------------------------------------------
function showModifyDesc(id,_this) {
    var panel=_this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    console.log(id);
    var _id = id.substr(7);
    console.log(_id);
    console.log("#subject" + _id);
    s = panel.querySelector("#subject" + _id).innerText;
    p = panel.querySelector("#predicate" + _id).innerText;
    p = p.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
    s = s.replace(/"/g, '&quot;').replace(/'/g, '&apos;');

    var descDiv = panel.querySelector('.desc-content' + _id)
    var content = descDiv.innerHTML;
    descDiv.innerHTML = '<textarea id="object' + _id + '"style="margin: 0px; height: 200px; width: 100%;">' + content + '</textarea>'
    var modifySpan = panel.querySelector('#modify-desc' + _id)
    modifySpan.innerHTML = '<a  style="margin-right:3px" id="' + id + '" onclick="saveEditDesc(this.id,this)";> 保存 </a>' +
        '<a style="margin-right:10px" id="' + id + '" onclick="resertEditDesc(' + "'" + s + "'" + ',this);"> 取消 </a>'


}

function saveEditDesc(id,_this) {
     var panel=_this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    var _id = id.substr(7);//删除下划线以及标志triple，获得三元组id
    s = panel.querySelector("#subject" + _id).innerText;
    p = panel.querySelector("#predicate" + _id).innerText;
    text = panel.querySelector('#object' + _id).value;
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

function resertEditDesc(s,_this) {
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

            if (xmlhttp.responseText!='non-editable') {
                //return ;
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
                    console.log(id);
                    delTd = '<td><a  tid="entity' + id + '" subject="' + id + '"' + ' onclick="del_entity(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td> ';

                    var tr = '<tr>' + inner + delTd + '</tr>';
                    tableStr += tr;
                }

                tableStr = tableStr +
                    ' <tr>' +
                    "<td><input type='hidden' class='query-add-entity' name='subject' value='" + id + "'/></td>" +
                    ' <td><a  class="add-entity" onclick="add_entity(this)" >' +

                    ' 添加</a></td>' +

                    '</tr>';

                tableStr += "</table>";
                var pa = document.querySelector('.parent');
                var div = document.querySelector('.entity');
                div.innerHTML = tableStr;

                //如果是入口，需要生成另外两张表
                console.log("entity res:" + res);
            }
            if (entrance && type == "byEntity") {
                if (res != "[]") {
                    genTable_ment2ent(true, s);
                    genTable_triple(true, s);
                    genTable_types(true,s)
                } else { //空表
                    genTable_ment2ent(false, s);
                    genTable_triple(false, s);
                    genTable_types(false,s)
                }

            } else if (entrance && type == "byMention") {

                ready_ment2ent(true, s);


            }
        }
    }

    xmlhttp.open("GET", "/kg/query_auto_entity/" + s + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();
}




function add_entity(_this) {


     _this.innerHTML = "保存";
    var tr=_this.parentNode.parentNode;
    var inputs = tr.querySelectorAll(".query-add-entity");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }
    tr.querySelector(".add-entity").addEventListener("click", function () {

        var inputs = tr.querySelectorAll(".query-add-entity");
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

            if (xmlhttp.responseText=='non-editable')
             return ;
            // console.log(xmlhttp.responseText);


            var tableStr = '<table class="panel-table table table-hover">';
            //清空表格内容
            tableStr += '<thead> <tr><th>mention</th> <th>entity</th><th>操作</th> <th>操作</th> </tr> </thead>'

            //将返回数据拼接为json数组
            var resp = xmlhttp.responseText;

            var jsons = JSON.parse(resp);
            jsons.sort(sortm)

            var ps = [];
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
                    if ((typeof strategy) == 'undefined')
                        strategy = '';
                    if ((typeof reason) == 'undefined')
                        reason = '';

                    reason = reason.replace(/</g, "&lt;").replace(/>/g, "&gt;"); //再将href中的双引号变回来
                    //console.log(id+s+o+p);
                    
                    id = id.$oid
                    m = m.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    strategy = strategy.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    var inner = '<td>' + m + '</td>' +
                        '<td><a  tid="' + e + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + e + '</a></td>' ;


                    var tr = "";

                    if (m == nowm) {
                        tr = '<tr class="' + 'error' + '">';

                    } else if (ps[i] == ps[i + 1]) { //若当前m与后一行m相同
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


                    tableStr += inner + '<td><a  class="modify_ment2ent" onclick="showModify_ment2ent(this.id,this)"id="_ment2ent' + id + '">修改 </a></td>' +
                        '<td><a  tid="ment2ent' + id + '" subject="' + s + '"' + ' onclick="del_ment2ent(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td></tr> ';

                }
            }
            tableStr +=
                ' <tr>' +
                '<td><input type="hidden" class="query-add-ment2ent" name="subject" value="' + "" + '"/></td>' +
                '<td><input type="hidden" class="query-add-ment2ent" name="entity" /></td>' +
                                '<td></td>' +
                ' <td><a  class="add-ment2ent" onclick="add_ment2ent_table(this)" >' +

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

            if (xmlhttp.responseText=='non-editable')
             return ;
            var tableStr = '<table class="panel-table table table-hover">';
            //清空表格内容
            tableStr += '<thead> <tr><th>mention</th> <th>entity</th><th>操作</th> <th>操作</th> </tr> </thead>'
            //将返回数据拼接为json数组
            var resp = xmlhttp.responseText;
            console.log(resp)

            var jsons = JSON.parse(resp);
            var len = jsons.length;

            jsons.sort(sorte);
            console.log(jsons);

            var ps = [];
            for (var i = 0; i < jsons.length; i++)
                ps.push(jsons[i].e)

            if (exist) {
                var nowe = "", flag = false;
                for (var i = 0; i < jsons.length; i++) {
                    var id = jsons[i]._id, m = jsons[i].m, e = jsons[i].e, strategy = jsons[i].strategy,
                        reason = jsons[i].reason;
                    if ((typeof strategy) == 'undefined')
                        strategy = '';
                    if ((typeof reason) == 'undefined')
                        reason = '';
                    id = id.$oid
                    m = m.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    reason = reason.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                    reason = reason.replace(/</g, "&lt;").replace(/>/g, "&gt;"); //再将href中的双引号变回来
//console.log(id+s+o+p);
                    var inner = '<td>' + m + '</td>' +
                        '<td><a  tid="' + e + '"onclick="query_entity(this.getAttribute(\'tid\'))">' + e + '</a></td>' +

                        '<td><a  class="modify_men2ent" onclick="showModify_ment2ent_ready(this.id,this)" id="_ment2ent' + id + '">修改 </a></td>' +
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
                ' <td><a  class="add-ment2ent" onclick="add_ment2ent(this)" >' +
                ' 添加</a></td>' +

                '</tr>';


            document.querySelector(".ment2ent").innerHTML = tableStr;

        }
    }

    xmlhttp.open("GET", "/kg/query_auto_ment2ent/" + s + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();
}

function showModify_ment2ent(id,_this) {
    var ptr=_this.parentNode.parentNode;
    // console.log(this);//获得修改标签
    // var id = this.id;//获取三元组的id
    console.log(id);
    var a = ptr.querySelector("#" + id);
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
    for (; i < 2; i++) {
        text = a[i].innerText;
        text = text.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + text + "'/>";


    }
    //将编辑改成 保存和取消两个按钮

    td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_ment2ent(this.id,this);"> 保存 </a>' +
        '<a  id="' + id + '" onclick="resertEditTd_ment2ent(this.id,this);"> 取消 </a>'


}


function showModify_ment2ent_ready(id,_this) {

    // console.log(this);//获得修改标签
    // var id = this.id;//获取三元组的id
    var ptr=_this.parentNode.parentNode;
    console.log(id);
    var a = ptr.querySelector("#" + id);
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
    for (; i < 2; i++) {

        text = a[i].innerText;
        text = text.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + text + "'/>";


    }

    //将编辑改成 保存和取消两个按钮

    td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_ment2ent_ready(this.id,this);"> 保存 </a>' +
        '<a  id="' + id + '" onclick="resertEditTd_ment2ent_ready(this.id,this);"> 取消 </a>'


}

function resertEditTd_ment2ent(id,_this) {
    var ptr=_this.parentNode.parentNode;
    console.log(id);
    var inputs = ptr.querySelectorAll("." + id);
    console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
    genTable_ment2ent(true, ent); //此方法是自己写的，局部刷新页面，重新加载数据
}

function resertEditTd_ment2ent_ready(id,_this) {
    var ptr=_this.parentNode.parentNode;
    console.log(id);
    var inputs = ptr.querySelectorAll("." + id);
    console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
    ready_ment2ent(true, s); //此方法是自己写的，局部刷新页面，重新加载数据
}

function saveEditTd_ment2ent(id,_this) {
    var ptr=_this.parentNode.parentNode;
    console.log(id);
    var _id = id.substr(9);//删除下划线，获得三元组id
    var inputs = ptr.querySelectorAll("." + id);
    //console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
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


    xmlhttp.open("GET", "/kg/modify_ment2ent/" + _id + "/" + s + "/" + ent + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();


}

//通过ready方法生成的，渲染页面最上方
function saveEditTd_ment2ent_ready(id,_this) {
    var ptr=_this.parentNode.parentNode;
    console.log(id);
    var _id = id.substr(9);//删除下划线，获得三元组id
    var inputs = ptr.querySelectorAll("." + id);
    //console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
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


        }
    }


    xmlhttp.open("GET", "/kg/modify_ment2ent/" + _id + "/" + s + "/" + ent + "/" , true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();


}

function add_ment2ent(_this) {

var ptr=_this.parentNode.parentNode;
    ptr.querySelector(".add-ment2ent").innerHTML = "保存";
    var inputs = ptr.querySelectorAll(".query-add-ment2ent");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }
    ptr.querySelector(".add-ment2ent").addEventListener("click", function () {

        var inputs = ptr.querySelectorAll(".query-add-ment2ent");
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


            }
        }


        xmlhttp.open("GET", "/kg/add_ment2ent/" + s + "/" + ent + "/" , true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    })
}


function add_ment2ent_table(_this) {

var ptr=_this.parentNode.parentNode;
    ptr.querySelector(".add-ment2ent").innerHTML = "保存";
    var inputs = ptr.querySelectorAll(".query-add-ment2ent");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }
    ptr.querySelector(".add-ment2ent").addEventListener("click", function () {

        var inputs = ptr.querySelectorAll(".query-add-ment2ent");
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

// types op--------------------------------------------------------------------------------------
function genTable_types(exist,s) {


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
         if (xmlhttp.responseText=='non-editable')
             return ;

            var tableStr = '<table class="panel-table table table-hover">';
            //清空表格内容
            tableStr += '<thead> <tr> <th>entity</th><th>type</th><th>操作</th> <th>操作</th> </tr> </thead>'

            //将返回数据拼接为json数组
            var resp = xmlhttp.responseText;

            var jsons = JSON.parse(resp);


            console.log(jsons);
            var len = jsons.length;

            // console.log(exist)
            // if (exist) {
            var nowm = "", flag = false;
            if (exist) {
            for (var i = 0; i < jsons.length; i++) {
                var id = jsons[i]._id, e = jsons[i].entity, t = jsons[i].type;


                id = id.$oid
                e = e.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                t = t.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
                var inner = '<td>' + e + '</td>' +
                    '<td><a  tid="' + e + '">' + t + '</a></td>';


                // var tr = "<tr>"+inner+'</tr>';


                tableStr += '<tr>';


                tableStr += inner + '<td><a  class="modify_types" onclick="showModify_types(this.id,this)"id="_types' + id + '">修改 </a></td>' +
                    '<td><a  tid="types' + id + '" subject="' + s + '"' + ' onclick="del_types(this.getAttribute(' + "'tid'),this.getAttribute('subject'))" + '">删除</a></td></tr> ';

            }
            }
            tableStr +=
                ' <tr>' +
                '<td><input type="hidden" class="query-add-types" name="subject" value="' + "" + '"/></td>' +
                '<td><input type="hidden" class="query-add-types" name="entity" /></td>' +

                '<td></td>' +
                ' <td><a  class="add-types" onclick="add_types_table(this)" >' +

                ' 添加</a></td>' +

                '</tr>';


            tableStr += "</table>";
            var div = document.querySelector(".types");
            div.innerHTML = "";
            div.innerHTML = tableStr;


        }
    }

    xmlhttp.open("GET", "/kg/query_auto_types/" + s + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();
}


function showModify_types(id,_this) {

    // console.log(this);//获得修改标签
    // var id = this.id;//获取三元组的id
    var ptr=_this.parentNode.parentNode;
    // console.log(id);
    var a = ptr.querySelector("#" + id);
    // console.log(id);
    // var a = document.querySelector("#" + id);
    // console.log(a);
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
    for (; i < 2; i++) {
        text = a[i].innerText;
        text = text.replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        a[i].innerHTML = "<input type='text' name='subject' class='" + id + "'value='" + text + "'/>";


    }
    //将编辑改成 保存和取消两个按钮

    td.innerHTML = '<a  id="' + id + '" onclick="saveEditTd_types(this.id,this);"> 保存 </a>' +
        '<a  id="' + id + '" onclick="resertEditTd_types(this.id,this);"> 取消 </a>'


}


function resertEditTd_types(id,_this) {
    var ptr=_this.parentNode.parentNode;
    var inputs = ptr.querySelectorAll("." + id);

    // console.log(id);
    // var inputs = document.querySelectorAll("." + id);
    // console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
    genTable_types(true,s); //此方法是自己写的，局部刷新页面，重新加载数据
}


function saveEditTd_types(id,_this) {
    var ptr=_this.parentNode.parentNode;
    // var _id = id.substr(7);//删除下划线以及标志triple，获得三元组id
    var inputs = ptr.querySelectorAll("." + id);

    console.log(id);
    var _id = id.substr(6);//删除下划线，获得三元组id
    // var inputs = document.querySelectorAll("." + id);
    //console.log(inputs);
    var a = inputs;
    var s = a[0].value, ent = a[1].value;
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
            if (res.indexOf("数据已存在！") == -1) {
                genTable_types(true,s);
            } else {
                 alert(res)
                genTable_types(true,s);
            }
        }
    }


    xmlhttp.open("GET", "/kg/modify_types/" + _id + "/" + s + "/" + ent + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();


}

//通过ready方法生成的，渲染页面最上方

function add_types() {


    document.querySelector(".add-types").innerHTML = "保存";
    var inputs = document.querySelectorAll(".query-add-types");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }
    document.querySelector(".add-types").addEventListener("click", function () {

        var inputs = document.querySelectorAll(".query-add-types");
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
                    ready_types(true,s);
                } else {
                    alert(res)
                    ready_types(true,s);
                }


            }
        }


        xmlhttp.open("GET", "/kg/add_types/" + s + "/" + ent + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    })
}


function add_types_table(_this) {
    _this.innerHTML = "保存";
    var tr=_this.parentNode.parentNode;
    var inputs = tr.querySelectorAll(".query-add-types");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }

   /* document.querySelector(".add-types").innerHTML = "保存";
    var inputs = document.querySelectorAll(".query-add-types");
    for (var i = 0; i < inputs.length; i++) {
        inputs[i].type = "text";
    }*/
   tr.querySelector(".add-types").addEventListener("click", function () {

        var inputs = tr.querySelectorAll(".query-add-types");
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
                if (res.indexOf("数据已存在！") == -1) {
                    genTable_types(true,s);

                } else {
                    alert(res)
                    genTable_types(true,s);
                }
            }
        }


        xmlhttp.open("GET", "/kg/add_types/" + s + "/" + ent + "/", true);
        xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        xmlhttp.send();
    })
}

function del_types(id, s) {
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

            genTable_types(true,s);
        }
    }


    xmlhttp.open("GET", "/kg/remove_types/" + id.substr(5) + "/", true);
    xmlhttp.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xmlhttp.send();
}
