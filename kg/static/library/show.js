//非结构化知识抽取
function get_non_structure_data(){
var h1_label = "<h1>非结构化知识抽取</h1><br/>"
var w = "200px"
$('#progressbar3').LineProgressbar({
        duration: 30000,
		percentage: 100
	});
    $.ajax({
        type:"GET",
        url:"/kg/non_structure/get/",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                 obj=eval("("+data+")");
             }
             var h = obj.non_structure_content.replace(/{/g,"<label>")
             h = h.replace(/}/g,"</label>")
             var t1 = window.setInterval(function(){
             var e = $('#progressbar3').find(".percentCount").html();
             if(e=="100%"){
           $("#non_structure_content").html(h);
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}
//知识表示学习
function get_vector(){
$('#progressbar5').LineProgressbar({
        duration: 10,
		percentage: 90
	});
var name = $("#vector_name").val();
$.ajax({
        type:"GET",
        url:"/kg/vector/get?name="+name,
        dataType:"json",
        timeout : 500000,
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("("+data+")");
             }
//             var h;
           $("#show_vector").html("<label>"+obj.vector_content+"</label>");
           $("#show_vector").attr({
                "class": "shadow panel panel-default parent-panel",
                "style": "padding:15px"
                    });
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}
//多源知识融合


function show_mix(){
$("#mix_button").hide();
var h1_label = "<h1>多源知识融合</h1><br/>"
var w = "200px"
$('#progressbar4').LineProgressbar({
        duration: 30000,
		percentage: 100
	});
$.ajax({
        type:"GET",
        url:"/kg/mix/get/",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("(" + data + ")");
             }
             $('#mixs_dict').val(JSON.stringify(obj));
             $('#mixs_index').val(0);
             var h = h1_label + "名称为<label>" + obj.ms[0].mysql_name + "</label>实体属性冲突，需进行融合,融合属性为<label>" + obj.ms[0].pro + "</label></br>请选择：</br>";
             for(i in obj.ms[0].mysql_pro_dict){
             h = h + "<input type='radio' name='selections' value=i><lable>"+ (Number(i)+1) + "、" + obj.ms[0].mysql_pro_dict[i]+"</lable></br>"
             }
             var t1 = window.setInterval(function(){
             var e = $('#progressbar4').find(".percentCount").html();
             if(e=="100%"){
         $("#mix_content").html(h);
             $("#mix_button").show();
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}


function upload_mix(){
var h1_label = "<h1>多源知识融合</h1><br/>";
var data = $("#mixs_dict").val();
var index = Number($("#mixs_index").val())+1;
$("#mixs_index").val(index);
if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("(" + data + ")");
             }
             if(index<obj.ms.length){
var h = h1_label + "名称为<label>" + obj.ms[index].mysql_name + "</label>实体属性冲突，需进行融合,融合属性为<label>" + obj.ms[index].pro + "</label></br>请选择：</br>";
             for(i in obj.ms[index].mysql_pro_dict){
             h = h + "<input type='radio' name='selections' value=i><lable>"+ (Number(i)+1) + "、" + obj.ms[index].mysql_pro_dict[i]+"</lable></br>"
             }
             }else{
             var h = h1_label + "知识融合完毕！"
             }
         $("#mix_content").html(h);
}
//半结构化知识融合
function half_equipment(){
var h1_label = "<h1>装备信息抽取</h1><br/>"
var w = "200px"
$('#progressbar1').LineProgressbar({
        duration: 13000,
		percentage: 100
	});
$.ajax({
        type:"GET",
        url:"/kg/half_structure/equipment",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("("+data+")");
             }
             var h = h1_label + "<table border='0'>";
             for(i in obj.equ){
             h = h + "<tr><td width='"+w+"'>" + obj.equ[i].subject_name + "</td><td width='"+w+"'>" + obj.equ[i].relation + "</td><td width='"+w+"'>" + obj.equ[i].object_name + "</td></tr>"
             }
             h += "</table>"
             var t1 = window.setInterval(function(){
             var e = $('#progressbar1').find(".percentCount").html();
             if(e=="100%"){
         $("#half_structure_content").html(h);
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}


function get_baike(){
var h1_label = "<h1>百科知识抽取</h1><br/>"
var w = "200px"
$('#progressbar2').LineProgressbar({
        duration: 3000,
		percentage: 100
	});
$.ajax({
        type:"GET",
        url:"/kg/baike/get/",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("("+data+")");
             }
             h1_label += obj.bk
             var t1 = window.setInterval(function(){
             var e = $('#progressbar2').find(".percentCount").html();
             if(e=="100%"){
         $("#baike_content").html(h1_label);
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}


function half_extract(){
var h1_label = "<h1>环球军事网半结构化信息</h1><br/>"
var w = "200px"
$('#progressbar1').LineProgressbar({
        duration: 8000,
		percentage: 100
	});
$.ajax({
        type:"GET",
        url:"/kg/half_structure/extract",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("("+data+")");
             }
             h1_label += obj.ext
             var t1 = window.setInterval(function(){
             var e = $('#progressbar1').find(".percentCount").html();
             if(e=="100%"){
         $("#half_structure_content").html(h1_label);
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}

function half_syn(){
var h1_label = "<h1>同义词生成</h1><br/>"
var w = "200px"
$('#progressbar1').LineProgressbar({
        duration: 600,
		percentage: 100
	});
$.ajax({
        type:"GET",
        url:"/kg/half_structure/syn",
        dataType:"json",
        success:function(data){
             var obj;
             //判断是否是json格式
             if((typeof data=='object')&&data.constructor==Object){
                 obj=data;
             }else{
                obj=eval("("+data+")");
             }
             var h = h1_label;
             for(i in obj.syn){
             h = h + "<label>" + obj.syn[i].name + "</label>的同型号指代为[";
             for(j in obj.syn[i].detail){
             if(j!=0){
             h += ','
             }
             h = h + "<label>" + obj.syn[i].detail[j] + "</label>"

             }
             h += ']<br/>'
             }
//             h += obj.syn;
             var t1 = window.setInterval(function(){
             var e = $('#progressbar1').find(".percentCount").html();
             if(e=="100%"){
         $("#half_structure_content").html(h);
             window.clearInterval(t1);
             }
             },1000);
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}

