$(function() {
	// 回顶部
	$(window).scroll( function() { 
		if($(this).scrollTop() >= 100 ){
			$("#scrollTop").show();
		} else {
			$("#scrollTop").hide();
		}
	} );
	
	if($(window).scrollTop() >= 100 ){
		$("#scrollTop").show();
	} else {
		$("#scrollTop").hide();
	}
	
	$("#scrollTop").click(function(){$(window).scrollTop(0);return false;});
	
	
	// 回车绑定查询按钮
	$('[name="search_header"]').on('keydown', function (e) {
        var key = e.which;
        if (key == 13 ) {
            e.preventDefault();
            search_form.action = jflyfox.BASE_PATH + "front/tags/"+ $('[name="search_header"]').val();
    		search_form.submit();
        }
    });
	
	$('#search_btn').on('click', function (e) {
		search_form.action = jflyfox.BASE_PATH + "front/tags/"+ $('[name="search_header"]').val();
		search_form.submit();
    });
	
	
	// 评论数获取
	comment.count();
});

/**
 * 评论
 */
comment = {
	/**
	 * 删除评论
	 * 
	 * @param comment_id
	 */
	oper_del:function(comment_id,article_id){
		if(window.confirm('你确定要删除该评论吗？')){
			jQuery.ajax({
				type:'POST',
				url:jflyfox.BASE_PATH + 'front/comment/del',
				data:"model.id=" + comment_id + "&model.article_id=" + article_id,
				success:function(data){
					if(data.status==1){
						$('#comment_'+comment_id+'_'+article_id).remove();
						
						var count = parseInt($('[name="count_comment"]').val());
						$('[name="count_comment"]').val(count - 1);
						$('#count_comment_show').html("评论(" + (count - 1) + ")");
					} else {
						alert('删除失败：'+data.msg);
					}
					$('[name="comment"]').val('');
				},
				error:function(html){
					var flag = (typeof console != 'undefined');
					if(flag) console.log("服务器忙，提交数据失败，代码:" +html.status+ "，请联系管理员！");
					alert("服务器忙，提交数据失败，请联系管理员！");
				}
			});
		}
	}
	/**
	 * 保存评论: 内容 文章id 回复人id 文章创建人id 文章题目
	 */
	,oper_save:function(comment_content,article_id,reply_userid,create_id , article_title){
		article_title = article_title || '';
		var urlParams = "model.content=" + comment_content + "&model.article_id=" + article_id 
			+ "&model.reply_userid=" + reply_userid+ "&model.create_id=" + create_id;
		
		jQuery.ajax({
			type:'POST',
			url:jflyfox.BASE_PATH + 'front/comment/save',
			data:urlParams,
			success:function(data){
			if(data.status==1){
				var createTime = data.create_time;
				var comment_id = data.comment_id;
				var title_url = data.title_url||'';
				var username = data.create_name;
				var reply_username = data.reply_username; 
				title_url = (title_url=='')?(jflyfox.BASE_PATH + 'static/images/user/user.png'):title_url;
				
				var htmlText = '<div class="comment-item" id=comment_'+ comment_id + '_' + article_id + '>';
				htmlText += '<div class="item-top">';
				htmlText += '<a href="#"><img alt="" width="32" height="32" alt="头像" class="img_radius" src="'+title_url+'" /></a>';
				
				if(article_title != ''){
					htmlText += '<a href="front/article/'+ article_id +'#article_comment" target="_blank" class="user-name">'+article_title+'</a>';
					htmlText += '<span class="comment-txt">文章中</span>';
				}
				
				htmlText += '<a href="#" class="user-name">'+username+'</a>';
				// 回复
				if(reply_userid > 0 ) { 
					htmlText += '<span style="float: left;margin-right: 10px;">回复</span>';
					htmlText += '<a href="#" class="user-name">' + reply_username + '</a>';
					htmlText += '<br>';
				}
				
				htmlText += '<div style="float:none;line-height: 24px;overflow: visible;">';
				htmlText += '<span>'+comment_content+'</span>';
				htmlText += '</div></div>';
				htmlText += '<div class="item-bottom">';
				htmlText += '<span>'+createTime+'</span>';
				htmlText += '<a href="javascript:comment.oper_del(' + comment_id + ',' + article_id +');" style="float: right;">删除</a>';
				htmlText += '</div></div>';		
				$('.comment-list').prepend(htmlText);
				
				var count = parseInt($('[name="count_comment"]').val());
				$('[name="count_comment"]').val(count + 1);
				$('#count_comment_show').html("评论(" + (count + 1) + ")");
				
			} else {
				alert('保存失败：'+data.msg);
			}
			$('[name="comment"]').val('');
			},
			error:function(html){
			var flag = (typeof console != 'undefined');
			if(flag) console.log("服务器忙，提交数据失败，代码:" +html.status+ "，请联系管理员！");
			alert("服务器忙，提交数据失败，请联系管理员！");
			}
		});
		
	}
	,count:function(){
		if ($("#mymessage").length <= 0){  
			return;
		}
		
		jQuery.ajax({
			type:'POST',
			url:jflyfox.BASE_PATH + 'front/comment/count',
			success:function(data){
				if(data.status==1){
					if(data.count > 0 ){
						$('#mymessage').hide();
						$('#mymessage').html('我的消息（'+data.count+'）');
						$('#mymessage').css('font-weight','bold');
						$('#mymessage').css('color','green');
						$('#mymessage').show(500);
					} else {
						// 如果已经读过，那么恢复初始化
						if($('#mymessage').text() != '我的消息') {
							$('#mymessage').text('我的消息');
							$('#mymessage').css('font-weight','');
							$('#mymessage').css('color','#454545');							
						}
					}
				} else {
					console_log('获取评论失败：'+data.msg);
				}
			},
			error:function(html){
				var flag = (typeof console != 'undefined');
				if(flag) console.log("服务器忙，提交数据失败，代码:" +html.status+ "，请联系管理员！");
				// alert("服务器忙，提交数据失败，请联系管理员！");
			}
		});
		// 压力太大了就改大点
		window.setTimeout('comment.count()',600*1000);
	}
	
};


/**
 * 文章喜欢
 */
articlelike = {
	click:function(article_id){
		if($('#articlelike_'+article_id).hasClass('glyphicon-heart-empty')){
			articlelike.yes(article_id);
		} else {
			articlelike.no(article_id);
		}
	}
	/**
	 * 喜欢
	 * 
	 * @param article_id
	 */
	,yes:function(article_id){
		jQuery.ajax({
			type:'POST',
			url:jflyfox.BASE_PATH + 'front/articlelike/yes/'+article_id,
			success:function(data){
				if(data.status==1){
					$('#articlelike_'+article_id).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
					$('#articlelike_'+article_id).attr("title","取消喜欢");
				} else {
					alert('失败：'+data.msg);
				}
			},
			error:function(html){
				var flag = (typeof console != 'undefined');
				if(flag) console.log("服务器忙，提交数据失败，代码:" +html.status+ "，请联系管理员！");
				alert("服务器忙，提交数据失败，请联系管理员！");
			}
		});
	}

	/**
	 * 取消喜欢
	 * 
	 * @param article_id
	 */
	,no:function(article_id){
		jQuery.ajax({
			type:'POST',
			url:jflyfox.BASE_PATH + 'front/articlelike/no/'+article_id,
			success:function(data){
				if(data.status==1){
					$('#articlelike_'+article_id).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
					$('#articlelike_'+article_id).attr("title","喜欢");
				} else {
					alert('失败：'+data.msg);
				}
			},
			error:function(html){
				var flag = (typeof console != 'undefined');
				if(flag) console.log("服务器忙，提交数据失败，代码:" +html.status+ "，请联系管理员！");
				alert("服务器忙，提交数据失败，请联系管理员！");
			}
		});
	}
	
	
};


function delblog(id) {
	var url = jflyfox.BASE_PATH + 'front/person/delblog/'+id;
	var title = '确认要删除该博文？';
	Confirm(title, function() {
		form1.action = url;
		form1.submit();
	});
}

/*
*图片文字滚动扩展包 
*版本：v1.2
*编码：utf-8版本
*作者：cici
*email：chengds@ifeng.com
*日期：2009-4-15
*/

/*
container:滚动的容器ID
btnPrevious：上一步按钮的ID
btnNext：下一步按钮的ID
*/
function ifeng_Scroll(container,btnPrevious,btnNext)
{
	////////////////对外接口/////////////////////////
	this.IsAutoScroll = true; //是否自动滚动 
	this.IsSmoothScroll= true;//是否平滑连续滚动 平滑滚动:true 间隔滚动:false
	this.PauseTime = 1000;//间隔滚动时每次滚动间隔的时间。单位：毫秒。建议值：100--3000 适用于间隔滚动。
	this.Direction = "N"; //滚动方向.向东：E，向北：N
	this.ControllerType = "click";//上一个和下一个按钮事件的触发方式:click为点击触发滚动 否则就是 鼠标按住按钮触发滚动。支持click 和mousedown两种模式
	this.BackCall = null;//回调函数 滚动到末尾时执行
	this.Step = 1;//步长 可以理解为速度1--10
	////////////////对外接口/////////////////////////
	
	this.Speed = 10;
	this.container = container;

    this.NextButton = this.$(btnNext);
    this.PreviousButton = this.$(btnPrevious);
    this.ScrollElement = this.$(container);
	
	this.UlElement = this.$(container).getElementsByTagName('ul')[0];//ul元素
	this.UlElement.innerHTML+=this.UlElement.innerHTML;

	this.UlSpace ;//ul的实际宽度
	this.LiSpace;
}
ifeng_Scroll.prototype = {
    lastpos: 0,
    curPos: 0,
    curTimeoutId: null,
    curIntervalScrollTimeoutId: null,
    ScrollElementPos: 0,
    $: function (element) {
        return document.getElementById(element);
    },
    Init: function () {
        this.UlSpace = this.Direction == "E" ? this.UlElement.offsetWidth : this.UlElement.offsetHeight; //ul的实际宽度
        if (this.LiSpace <= 0 || this.LiSpace == null) {
            this.LiSpace = parseInt(this.UlSpace/this.UlElement.getElementsByTagName('li').length);
        }
        
        this.UlSpace = this.LiSpace * this.UlElement.getElementsByTagName('li').length;
        this.Direction == "E" ? this.$(this.container).style.width = this.UlSpace + "px" : this.$(this.container).style.height = this.UlSpace + "px";
        //        this.Direction = "20px";
        //设置基础样式
        this.ScrollElement.style.overflow = "visible";
        this.ScrollElement.parentNode.style.overflow = "hidden";
        this.Direction == "E" ? this.ScrollElement.style.width = "10000px" : this.ScrollElement.style.height = "10000px";
        this.UlElement.style.float = "left";

        this.ScrollType = this.Direction == "E" ? "left" : "top";
        this.Bind(this, this.PreviousButton, this.ControllerType, "Pre");
        this.Bind(this, this.NextButton, this.ControllerType, "Next");

        this.ScrollElement.onmouseover = this.GetFunction(this, "MouseOver");
        this.ScrollElement.onmouseout = this.GetFunction(this, "MouseOut");
    },
    Reset: function () {
        this.Pause();
        this.ScrollElement.style[this.ScrollType] = '0px';
    },
    Bind: function (_this, el, type, param) {
        if (el) {
            if (type == "click") {
                el.onclick = this.GetFunction(this, param);
            }
            else {
                el.onmousedown = this.GetFunction(this, "MouseDown", param);
                el.onmouseup = this.GetFunction(this, "MouseUp");
            }
            el.onmouseover = this.GetFunction(this, "MouseOver");
            el.onmouseout = this.GetFunction(this, "MouseOut");
        }
    },
    Start: function () {
        if (!this.IsAutoScroll) return;
        if (this.IsSmoothScroll) {
            this.SmoothScroll();
        }
        else {
            this.IntervalScroll();
        }
    },
    Pause: function () {
        clearTimeout(this.curTimeoutId);
        clearTimeout(this.curIntervalScrollTimeoutId);
    },
    MouseOver: function () {
        clearTimeout(this.mouseoutTimeoutId);
        this.mouseoverTimeoutId = setTimeout(this.GetFunction(this, "Pause"), 10);
    },
    MouseOut: function () {
        clearTimeout(this.mouseoverTimeoutId);
        this.mouseoutTimeoutId = setTimeout(this.GetFunction(this, "Start"), 10);
    },
    MouseDown: function (direction) {
        var _step;
        var _to;
        if (direction == "Pre") {
            _step = this.Step * 2;
            curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
            if (!curPos) curPos = 0;
            if (curPos == 0) {
                this.ScrollElement.style[this.ScrollType] = -this.UlSpace / 2 + "px";
                this.curPos = -this.UlSpace / 2;
            }
            _to = 0;
        }
        else {
            _step = -this.Step * 2;
            _to = -this.UlSpace / 2;
        }
        moveParams = { from: this.curPos, to: _to, step: _step, controller: "MouseDown:" + direction, callback: this.GetFunction(this, "ScrollFinish") };
        this.RunScroll(moveParams);
    },
    MouseUp: function () {
        clearTimeout(this.curTimeoutId);
    },
    Pre: function () {
        var curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
        if (!curPos) curPos = 0;
        var _to;
        if (curPos == 0) {
            this.ScrollElement.style[this.ScrollType] = -this.UlSpace / 2 + "px";
            this.curPos = -this.UlSpace / 2;
            _to = -this.UlSpace / 2 + this.LiSpace;
        }
        else {
            _to = this.curPos % this.LiSpace == 0 ? this.curPos + this.LiSpace : parseInt(this.curPos / this.LiSpace) * this.LiSpace;
        }
        moveParams = { from: this.curPos, to: _to, step: this.Step * 2, controller: "Previous", callback: this.GetFunction(this, "ScrollFinish") };
        this.RunScroll(moveParams);
    },
    Next: function () {
        _to = this.curPos % this.LiSpace == 0 ? this.curPos - this.LiSpace : (parseInt(this.curPos / this.LiSpace) - 1) * this.LiSpace;
        moveParams = { from: this.curPos, to: _to, step: -this.Step * 2, controller: "Next", callback: this.GetFunction(this, "ScrollFinish") };
        this.RunScroll(moveParams);
    },
    IntervalScroll: function () {
        var _to = parseInt(this.curPos / this.LiSpace) * this.LiSpace - this.LiSpace;
        var moveParams = { from: this.curPos, to: _to, step: -this.Step, controller: "IntervalScroll", callback: this.GetFunction(this, "ScrollFinish") };
        this.RunScroll(moveParams);
    },
    SmoothScroll: function () {
        var _to = -this.UlSpace / 2;
        var moveParams = { from: this.curPos, to: _to, step: -this.Step, controller: "SmoothScroll", callback: this.GetFunction(this, "ScrollFinish") };
        this.RunScroll(moveParams);
    },
    RunScroll: function (params) {
        this.Scroll(params);
    },
    Scroll: function (param) {
        var step = Math.abs(param.to - this.curPos) < Math.abs(param.step) ? param.to - this.curPos : param.step;
        this.ScrollElement.style[this.ScrollType] = (param.from + step) + "px";
        this.curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
        clearTimeout(this.curTimeoutId);
        if (this.curPos != param.to) {
            var moveParams = { from: this.curPos, to: param.to, step: param.step, controller: param.controller, callback: param.callback };
            this.curTimeoutId = setTimeout(this.GetFunction(this, "Scroll", moveParams), this.Speed);
        }
        else {
            if (param.callback) param.callback();
            if (param.controller == "SmoothScroll")
            { this.SmoothScroll(); }
            else if (param.controller == "IntervalScroll") {
                if (this.curIntervalScrollTimeoutId) clearTimeout(this.curIntervalScrollTimeoutId);
                this.curIntervalScrollTimeoutId = setTimeout(this.GetFunction(this, "IntervalScroll"), this.PauseTime);
            }
            else if (param.controller.indexOf("MouseDown") != -1) {
                derection = param.controller.split(':')[1];
                this.MouseDown(derection);
            }
        }
    },
    ScrollFinish: function () {
        if (this.curPos <= -this.UlSpace / 2) {
            this.ScrollElement.style[this.ScrollType] = "0px";
        }
        else if (this.curPos >= 0) {
            this.ScrollElement.style[this.ScrollType] = -this.UlSpace / 2 + "px";
        }
        this.curPos = parseInt(this.ScrollElement.style[this.ScrollType]);
        if (this.BackCall) this.BackCall();
    },
    GetFunction: function (variable, method, param) {
        return function () {
            variable[method](param);
        }
    }
}
