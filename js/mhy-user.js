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
function getuserinfo() {
	$.ajax({
		type: "post",
		url: myUrl + "login/member",
		async: true,
		data: {
			uid: localStorage.xnuid
		},
		success: function(json) {
			console.log(json);
			if(json.status == 1) {
				$.ajax({
					type: "GET",
					url: myUrl + "brand/life",
					data: {
						uid: localStorage.xnuid
					},
					timeout: 10000,
					dataType: "json",
					success: function(data) {
						console.log(data);
						if(data.status == 1) {
							$("#unlog #lifepass").html(data.day);
							$("#unlog #lifeleft").html(data.num);
						} else if(data.status == 0) {
							mui.toast("获取生活助手消息失败");
						}
					},
					error: function(msg) {
						console.log("错误", "连接服务器异常");
					}
				});
				localStorage.setItem("xnuid", json.userinfo.uid); //用户ID
				localStorage.setItem("xnusername", json.userinfo.username); //用户昵称
				localStorage.setItem("xnuserpic", json.userinfo.userpic); //用户头像
				localStorage.setItem("xntotalbonus", json.userinfo.total_bonus); //百分比
				localStorage.setItem("xntelephone", json.userinfo.telephone); //电话号码
				localStorage.setItem("xncard", json.userinfo.card); //优惠券个数
				localStorage.setItem("xnlevel", json.userinfo.access_token); //会员类型
				localStorage.setItem("xncategory", json.userinfo.category); //登录方式显示头像
				localStorage.setItem("xncash_points", json.userinfo.cash_points); //距多少积分升级
				localStorage.setItem("xnpoints", json.userinfo.money); //积分
				$("#headImage").attr("src", imgUrl + json.userinfo.userpic);
				if(localStorage.xncategory == 1) {
					$("#headImage").attr("src", localStorage.xnuserpic);
				} else {
					$("#headImage").attr("src", imgUrl + localStorage.xnuserpic);
				}
				$("#head img").attr("src", imgUrl + json.userinfo.userpic);
				if(localStorage.xncategory == 1) {
					$("#head img").attr("src", localStorage.xnuserpic);
				} else {
					$("#head img").attr("src", imgUrl + localStorage.xnuserpic);
				}

				$("#nickname").text(json.userinfo.username);
				$("#username").text(json.userinfo.username);
				$("#tel").text(json.userinfo.telephone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'));
				$("#le").text(json.userinfo.access_token);
				$(".linee").show();
				$(".diste").show();
				$("#diste").text("距下一等级还需" + localStorage.xncash_points + "积分");
				$("#ticketnum").text(localStorage.xncard);
				$("#points").text(localStorage.xnpoints);

				if(localStorage.xnlevel == "普通会员") {
					$("#le").addClass('le1');
				}

				if(localStorage.xnlevel == "黄金会员") {
					$("#le").addClass('le2');
				}

				if(localStorage.xnlevel == "白金会员") {
					$("#le").addClass('le3');
				}

				$(".le-line").css("width", localStorage.xntotalbonus + "%");

				if(json.userinfo.wechat_openid) {
					$("#weixin").text("已绑定");
				} else {
					$("#weixin").text("未绑定");
				}
				if(json.userinfo.openid) {
					$("#qq").text("已绑定");
				} else {
					$("#qq").text("未绑定");
				}

			} else if(json.status == 0) {
				mui.toast("个人信息加载失败");
			}
		},
		error: function(msg) {
			console.log("错误", "连接服务器异常");
		}
	});
}

//修改昵称
function changeName() {
	var oldname = $("#nickname").text();
	$("#changeUserName").val(oldname);
	$('.model').css('display', 'block');
	$('.confi').click(function() {
		var username = $("#changeUserName").val();
		if(username == "" || username == undefined) {
			mui.toast("请输入用户名");
		} else {
			$.ajax({
				type: "POST",
				url: myUrl + "login/username",
				data: {
					name: username,
					uid: localStorage.xnuid
				},
				timeout: 10000,
				dataType: "json",
				success: function(msg) {
					if(msg.status == 1) {
						mui.toast(msg.info);
						localStorage.setItem("xnusername", username);
						$("#nickname").text(username);

						var parentWin = plus.webview.getWebviewById(plus.runtime.appid);
						parentWin.evalJS("getuserinfo()");

					} else {
						mui.toast(msg.info);
					}
					$('.model').css('display', 'none');
				},
				error: function(msg) {
					console.log("错误", "连接服务器异常");
				}
			});
		}
	});
	$('.dels').click(function() {
		$('.model').css('display', 'none');
	})
}

//获取验证码
function getcode() {
	var tel = $("#tel").val();
	if(tel == "") {
		mui.toast("请输入手机号码");
		return false;
	}
	$.ajax({
		type: "post",
		url: myUrl + "login/sms",
		async: true,
		data: {
			mobile: tel
		},
		success: function(msg) {
			console.log(msg);
			timer();
		}
	});

}

//刷新  购物车
function refreshView() {
	window.location.reload();
}

//倒计时
function timer() {
	var time = 60;
	var timer = setInterval(function() {
		if(time < 1) {
			clearInterval(timer);
			$("#send").html('获取验证码');
			$("#send").css('background', '#034895');
			$("#send").attr("onclick", "sendcode()");
			return;
		}
		$("#send").html(time + '\'\'后重新获取');
		$("#send").css('background', '#DCDCDC');
		time--;
	}, 1000);
}

//绑定手机号		
function donebindphone(a, b) {

	var tel = $("#tel").val();
	var code = $("#yzm").val();
	if(tel == "" || tel == undefined) {
		mui.toast("请输入手机号码");
		$("#send").attr("onclick", "sendcode()");
		return;
	}
	if(!(myreg.test(tel))) {
		mui.toast("请输入正确的手机号码");
		$("#send").attr("onclick", "sendcode()");
		return;
	}
	if(code == "" || code == undefined) {
		mui.toast("请输入验证码");
		return;
	}

	if(request("check") == 1) {
		$.ajax({
			type: "post",
			url: myUrl + "login/editphone",
			async: true,
			data: {
				telephone: tel,
				code: code,
				oldtelephone: b,
			},
			success: function(msg) {
				console.log(msg);
				if(msg.status = 1) {
					localStorage.setItem("xntelephone", tel);
					mui.toast(msg.info);
					setTimeout("mui.back()", 600);
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
	} else {
		$.ajax({
			type: "post",
			url: myUrl + "login/bindtel",
			async: true,
			data: {
				telephone: tel,
				code: code,
				uid: localStorage.xnuid
			},
			success: function(msg) {
				console.log(msg);
				if(msg.status = 1) {
					mui.toast(msg.info);
					setTimeout("mui.back()", 600);
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

}

var popstatus = "0";

//签到
function signedpop() {
	if(localStorage.xnuid) {
		$.ajax({
			type: "GET",
			url: myUrl + "weather/sign",
			data: {
				uid: localStorage.xnuid
			},
			//				timeout: 10000,
			dataType: "json",
			success: function(json) {
				var day = json.list.day;
				console.log(day);
				if(day == 1) {
					$("#sign1").attr("src", "image/79.png");
				}
				if(day == 2) {
					$("#sign1").attr("src", "image/79.png");
					$("#sign2").attr("src", "image/79.png");
				}
				if(day == 3) {
					$("#sign1").attr("src", "image/79.png");
					$("#sign2").attr("src", "image/79.png");
					$("#sign3").attr("src", "image/79.png");
				}
				if(day == 4) {
					$("#sign1").attr("src", "image/79.png");
					$("#sign2").attr("src", "image/79.png");
					$("#sign3").attr("src", "image/79.png");
					$("#sign4").attr("src", "image/79.png");
				}
				if(day == 5) {
					$("#sign1").attr("src", "image/79.png");
					$("#sign2").attr("src", "image/79.png");
					$("#sign3").attr("src", "image/79.png");
					$("#sign4").attr("src", "image/79.png");
					$("#sign5").attr("src", "image/79.png");
				}
				if(day == 6) {
					$("#sign1").attr("src", "image/79.png");
					$("#sign2").attr("src", "image/79.png");
					$("#sign3").attr("src", "image/79.png");
					$("#sign4").attr("src", "image/79.png");
					$("#sign5").attr("src", "image/79.png");
					$("#sign6").attr("src", "image/78.png");
				}
				$("#signnum").text(day);
				mui.toast(json.info);
			},
			error: function(msg) {
				console.log("错误", "连接服务器异常");
			}
		});
		if($("#popsign").css("display") == "none") {

			$('html, body').animate({
				scrollTop: 0
			}, 200);
			$('body').css("overflow", "hidden");
		}
		if($("#popsign").css("display") == "block") {

			$('body').css("overflow", "scroll");
		}
		mui('#popsign').popover('toggle');
		$(".mui-active").click(function() {

			$('body').css("overflow", "scroll");
		})
	} else {
		mui.toast('请登录之后再签到！');
		openW('page/login.html');
	}

}

function sendcode() {
	$("#send").removeAttr("onclick");
	var tel = $("#tel").val();
	if(tel == "" || tel == undefined) {
		mui.toast("请输入手机号码");
		$("#send").attr("onclick", "sendcode()");
		return;
	} else if(!(myreg.test(tel))) {
		mui.toast("请输入正确的手机号码");
		$("#send").attr("onclick", "sendcode()");
		return;
	} else {
		getcode(tel);
	}
}