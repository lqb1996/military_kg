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
