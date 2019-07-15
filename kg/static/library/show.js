//非结构化知识抽取
function get_non_structure_data(){
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
           $("#non_structure_content").html(h);
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
function upload_mix(){
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
$('#progressbar2').LineProgressbar({
		percentage: 50
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

