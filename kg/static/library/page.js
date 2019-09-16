function getPagesTarget(page,numberFound,line_size){
	
	$("#footerul").empty();
	var pages = 1;
	
	// make up select pages
	var Maxpages = Math.ceil(numberFound / line_size);

	var prepage = parseInt((page / 10)-1) * 10+1;//前一页
	var postpage = parseInt(((page - 1) / 10 + 1)) * 10 + 1;
	var uppage = (parseInt((new Number(page - 1) / 10)) + 1) * 10;
	
	if (page > 10) {
		$("#footerul").append("<span title='上一页' style='width:50px'><a href=\"#\"  style='width:50px' onclick=\"searchTarget("+ prepage+ ")\">上一页</a></span>");
	}else{
		$("#footerul").append("<span class='disabled' title='上一页' style='width:50px'>上一页</span>");
	}

	for (pages = parseInt(((page - 1) / 10)) * 10 + 1; pages <= uppage && pages <= Maxpages; pages++) {
		
		if(pages == page){
			$("#footerul").append("<span class='current'><a onclick=\"searchTarget("+ pages+ ")\">" + pages + "</a></span>");
		}else{
			$("#footerul").append("<span><a onclick=\"searchTarget("+ pages+ ")\">" + pages + "</a></span>");
		}
		
		
	}// for

	if (postpage <= Maxpages) {
		$("#footerul").append("<span style='width:50px'><a style='width:50px' onclick=\"searchTarget("+ postpage+ ")\">下一页</a></span>");
	}else{
		$("#footerul").append("<span style='width:50px'class='disabled' title='下一页'>下一页</span>");
	}
}

function getPagesEvent(page,numberFound,line_size){
	
	$("#footerul").empty();
	var pages = 1;
	
	// make up select pages
	var Maxpages = Math.ceil(numberFound / line_size);

	var prepage = parseInt((page / 10)-1) * 10+1;//前一页
	var postpage = parseInt(((page - 1) / 10 + 1)) * 10 + 1;
	var uppage = (parseInt((new Number(page - 1) / 10)) + 1) * 10;
	
	if (page > 10) {
		$("#footerul").append("<span title='上一页' style='width:50px'><a href=\"#\"  style='width:50px' onclick=\"searchEvent("+ prepage+ ")\">上一页</a></span>");
	}else{
		$("#footerul").append("<span class='disabled' title='上一页' style='width:50px'>上一页</span>");
	}

	for (pages = parseInt(((page - 1) / 10)) * 10 + 1; pages <= uppage && pages <= Maxpages; pages++) {
		
		if(pages == page){
			$("#footerul").append("<span class='current'><a onclick=\"searchEvent("+ pages+ ")\">" + pages + "</a></span>");
		}else{
			$("#footerul").append("<span><a onclick=\"searchEvent("+ pages+ ")\">" + pages + "</a></span>");
		}
		
		
	}// for

	if (postpage <= Maxpages) {
		$("#footerul").append("<span style='width:50px'><a style='width:50px' onclick=\"searchEvent("+ postpage+ ")\">下一页</a></span>");
	}else{
		$("#footerul").append("<span style='width:50px'class='disabled' title='下一页'>下一页</span>");
	}
}