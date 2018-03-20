var myreg = /1[3458]{1}\d{9}$/;
	
//返回刷新页面
window.addEventListener('customEvent', function(event) {
    // mui.fire()传过来的额外的参数，在event.detail中；
    var detail = event.detail;
    // var param = detail.param;
    // 执行相应的ajax或者操作DOM等操作
    window.location.reload();
});


//获取个人信息
function getuserinfo(){
	$.ajax({
		type: "post",
		url: myUrl + "seller/info",
		async: true,
		data: {
			uid: localStorage.xnbusinessuid
		},
		success: function(json) {
			console.log(json);
			if (json.status == 1) {
           		localStorage.setItem("xnbusinessuid",json.userinfo.uid);
           		localStorage.setItem("xnbusinessusername",json.userinfo.username);
           		localStorage.setItem("xnbusinesstelephone",json.userinfo.telephone);
           		localStorage.setItem("xnbusinessmoney",json.userinfo.money);
           		localStorage.setItem("xnbusinessbrand_id",json.userinfo.brand_id);
           		$("#nickname").text(json.userinfo.username);
           		var tel = json.userinfo.telephone;
           		$("#tel").text(tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
           		
            }else if (json.status == 0) {
           		mui.toast("个人信息加载失败");
            }
		},
		error: function (msg) {
            console.log("错误", "连接服务器异常");
        }
	});
}




//商家端手机号登录
function bussideaccountlogin(){
	var tel = $("#tel").val();
	var pwd = $("#yzm").val();
	if(tel == ""){
		mui.toast("请输入手机号码");
		return;
	}else if(!myreg.test(tel)){
		mui.toast("请输入正确的手机号码");
		return;
	}else if(pwd == ""){
		mui.toast("请输入密码");
		return;
	}else {
		$.ajax({
			type: "post",
			url: myUrl + "seller/login",
			async: true,
			data: {
				telephone: tel,
				password: pwd
			},
			success: function(json) {
				console.log(json);
				if (json.status == 1) {
	           		mui.toast(json.info);
	           		localStorage.setItem("xnbusinessuid",json.userinfo.uid);
	           		localStorage.setItem("xnbusinessusername",json.userinfo.username);
	           		localStorage.setItem("xnbusinesstelephone",json.userinfo.telephone);
	           		localStorage.setItem("xnbusinessmoney",json.userinfo.money);
	   				localStorage.setItem("xnbusinessbrand_id",json.userinfo.brand_id);
//	   				openW("bussidehome.html");
//					var parentWin = plus.webview.getWebviewById('HBuilder');
//					parentWin.evalJS("getuidlogin()");
//	   				mui.back();
	   				
	            }else{
	           		mui.toast(json.info);
	            }
			},
			error: function (msg) {
	            console.log("错误", "连接服务器异常");
	        }
		});
	}
	
}



//获取验证码
function getcode(){
	var tel = $("#tel").val();
	if(tel == ""){
		mui.toast("请输入手机号码");
		return false;
	}
	$.ajax({
		type:"post",
		url:myUrl +"login/sms",
		async:true,
		data: {
			mobile:tel
		},
		success:function(msg) {
			alert(tel);
			console.log(msg);
			timer();
		}
	});
	
}


//倒计时
function timer(){
	var time = 5;
	var timer = setInterval(function() {
		if(time < 1) {
			clearInterval(timer);
			$("#send").html('获取验证码');
			$("#send").css('background','#034895');
			$("#send").attr("onclick","sendcode()");
			return;
		}
		$("#send").html(time + '\'\'后重新获取');
		$("#send").css('background','#DCDCDC');
		time--;
	}, 1000);
}





//修改昵称
function changeName() {
	var oldname = $("#nickname").text();
	$("#changeUserName").val(oldname);
	$('.model').css('display', 'block');
	$('.confi').click(function() {
		var username = $("#changeUserName").val();
		if(username == "" || username == undefined){
			mui.toast("请输入用户名");
		}else{
			$.ajax({
		        type: "POST",
		        url: myUrl + "seller/username",
		        data: {
		            name: username,
		            uid: localStorage.xnuid
		        },
		        timeout: 10000,
		        dataType: "json",
		        success: function (msg) {
	           		if(msg.status == 1){
	           			mui.toast(msg.info);
	           			localStorage.setItem("xnbusinessusername",username);
						$("#nickname").text(username);
	           		}else{
	           			mui.toast(msg.info);
	           		}
					$('.model').css('display', 'none');
		        },
		        error: function (msg) {
		            console.log("错误", "连接服务器异常");
		        }
		    });
		}
	});
	$('.dels').click(function() {
		$('.model').css('display', 'none');
	})
}

function sendcode(){
	$("#send").removeAttr("onclick");
	var tel = $("#tel").val();
	if(tel == "" || tel == undefined){
		mui.toast("请输入手机号码");
		$("#send").attr("onclick","sendcode()");
		return;
	}else if(!(myreg.test(tel))) {
		mui.toast("请输入正确的手机号码");
		$("#send").attr("onclick","sendcode()");
		return;
	}else {
		getcode(tel);	
	}
}


//绑定手机号		
function donebindphone(a){
						
	var tel = $("#tel").val();
	var code = $("#yzm").val();
	if(tel == "" || tel == undefined){
		mui.toast("请输入手机号码");
		$("#send").attr("onclick","sendcode()");
		return;
	}
	if(!(myreg.test(tel))) {
		mui.toast("请输入正确的手机号码");
		$("#send").attr("onclick","sendcode()");
		return;
	}
	if(code == "" || code == undefined){
		mui.toast("请输入验证码");
		return;
	}
	
	$.ajax({
		type:"post",
		url:myUrl +"seller/editphone",
		async:true,
		data: {
			telephone: tel,
			code: code,
			oldtelephone: a,
		},
		success:function(msg) {
			console.log(msg);
			if(msg.status  = 1) {
				mui.toast(msg.info);
				localStorage.setItem("xnbusinesstelephone",tel);
				setTimeout("mui.back()",600);
				var old_back = mui.back;
				mui.back = function() {
				    // 获取目标口窗口对象
				    var target = plus.webview.getWebviewById(plus.webview.currentWebview().opener().id);
				    // 执行相应的事件
				    mui.fire(target, 'customEvent', {});
				    // 执行关闭
				    old_back();
				};
			} else {
				mui.toast(msg.info);
			}
		}
	});
}




