//展示百科页面
function show_page(){
$("#button_page").attr("class", "input04");
$("#button_res").attr("class", "input03");
$("#baike_content").attr("class", "div08");
var data = $("#hide_page").val();
obj=eval("(" + data + ")");
$("#baike_content").html(obj.baike_content);
}


//展示抽取结果
function show_res(){
$("#button_page").attr("class", "input03");
$("#button_res").attr("class", "input04");
$("#baike_content").attr("class", "div03");
var data = $("#hide_res").val();
obj=eval("(" + data + ")");
//$("#baike_content").html("<div class='div04'></div><div class='div05' id='title_name'></div><table cellpadding='0px'  cellspacing='0px' id='resolution_res'><tr><td style='width: 15%;'><h2>segement</h2></td><td style='width: 10%;'><h2>key</h2></td><td><h2>value</h2></td></tr></table>");
$("#baike_content").html("<div class='div04'></div><div class='div05' id='title_name'></div><table cellpadding='0px'  cellspacing='0px' id='resolution_res'><tr><td style='width: 15%;'><h2>key</h2></td><td><h2>value</h2></td></tr></table>");
$("#title_name").text(obj.baike_resolution.title_name);
$.each(obj.baike_resolution, function(key, item) {
    if(key != "title_name"){
        //获取最后一行的data-id(标识行)
        var htmlList = '';
        var i = 0;
        var idx = 0;
        var rowIndex = $("#resolution_res tr:last").attr("data-row");
        for(i in item){
        if (rowIndex == "" || rowIndex == null) {
            rowIndex = parseInt(1);
        } else {
            rowIndex = parseInt(rowIndex) + 1;
        }
//        if(i > 0){
//            htmlList += '<tr data-row=' + rowIndex + '>';
//        }
//        else{
//            idx = rowIndex
//        }
            htmlList += '<tr data-row=' + rowIndex + '>';
//            htmlList += '<td style="text-align:center">' + item[i][0] + '</td>';
            htmlList += '<td style="text-align:center">' + item[i][0] + '</td>';
            htmlList += '<td style="text-align:left">' + item[i][1] + '</td>';
            htmlList += '</tr>';
        }
//        htmlList = '<tr data-row=' + idx + '><td rowspan="'+ (Number(i)+1) +'" style="text-align:center;">' + key + '</td>' + htmlList;
    }
    //在行最后添加数据
    $("#resolution_res tr:last").after(htmlList);

    htmlList = '';
    //初始化行
});
}


function get_baike(){
var u = $("#baike_url").val();
$('#hide_page').val("");
$.ajax({
        type:"GET",
        url:"/kg/baike/page/?keyword=" + u,
        dataType:"json",
            charset:"UTF-8",
        success:function(data){
            $('#hide_page').val(JSON.stringify(data));
            try{
                show_page();
            }
            catch(err)
            {
                console.log(err);
            }
            //获取抽取结果
            $.ajax({
            type:"GET",
            url:"/kg/baike/extract/?keyword=" + u,
            dataType:"json",
                charset:"UTF-8",
            success:function(res){
                $('#hide_res').val(JSON.stringify(res));
            },
            error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
            }
                });
        },
        error:function(jqXHR){
           alert("发生错误："+ jqXHR.status);
        }
});
}