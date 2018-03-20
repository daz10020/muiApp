$(function() {
	var check_pass_word = '';
	var passwords = $('#password').get(0);
	$(function() {
		var div = '\
        <div id="key" >\
            <ul id="keyboard" >\
                <li class="symbol"><span class="off">1</span></li>\
                <li class="symbol"><span class="off">2</span></li>\
                <li class="symbol btn_number_"><span class="off">3</span></li>\
                <li class="tab"><span class="off">4</span></li>\
                <li class="symbol"><span class="off">5</span></li>\
                <li class="symbol btn_number_"><span class="off">6</span></li>\
                <li class="tab"><span class="off">7</span></li>\
                <li class="symbol"><span class="off">8</span></li>\
                <li class="symbol btn_number_"><span class="off">9</span></li>\
              	<li class="cancle "></li>\
                <li class="symbol"><span class="off">0</span></li>\
                 <li class="delete lastitem btn_number_">删除</li>\
            </ul>\
        </div>\
        ';
		var character, index = 0;
		$("input.pass").attr("disabled", true);
		$("#password").attr("disabled", true);
		$("#keyboardDIV").html(div);
		$('#keyboard li').click(function() {
			if($(this).hasClass('delete')) {
				$(passwords.elements[--index % 6]).val('');
				if($(passwords.elements[0]).val() == '') {
					index = 0;
				}
				return false;
			}
			if($(this).hasClass('cancle')) {
				parentDialog.close();
				return false;
			}
			if($(this).hasClass('symbol') || $(this).hasClass('tab')) {
				character = $(this).text();
				$(passwords.elements[index++ % 6]).val(character);
				if($(passwords.elements[5]).val() != '') {
					index = 0;
				}
				if($(passwords.elements[5]).val() != '') {
					var temp_rePass_word = '';
					for(var i = 0; i < passwords.elements.length; i++) {
						temp_rePass_word += $(passwords.elements[i]).val();
					}
					check_pass_word = temp_rePass_word;
					var action = 'modify';
//					alert(check_pass_word);
					$("#pwd").val(check_pass_word);
					$("#save").click(function() {
						var Npwd = check_pass_word;
						if(Npwd == "" || Npwd == undefined) {
							mui.toast("请输入新密码");
						} else {
							$.ajax({
								type: "post",
								url: myUrl + "login/editpaypass",
								async: true,
								data: {
									payword: Npwd,
									uid: localStorage.xnuid
								},
								success: function(msg) {
									console.log(msg);
									mui.toast(msg.info);
									if(msg.status == 1) {
										var wvs = plus.webview.all();　　 //所有窗口对象 
										var launch = plus.webview.getLaunchWebview();　　 //首页窗口对象 
										var self = plus.webview.currentWebview();　　 //当前窗口对象 
										for(var i = 0, len = wvs.length; i < len; i++) {　　　 // 首页以及当前窗口对象，不关闭； 
											if(wvs[i].id === launch.id || wvs[i].id === self.id || wvs[i].id === localStorage.homeWebId) {　　　　　　　　 //选定某一页不关wvs[i].id === localStorage.homeWebId 
												continue;
											} else {
												wvs[i].close('none');　　 //关闭中间的窗口对象，为防止闪屏，不使用动画效果； 
											}
										}　　 // 此时，窗口对象只剩下首页以及当前窗口，直接关闭当前窗口即可； 
										self.close('slide-out-right');
										mui.back();
									} else {
										window.location.reload();
									}
								}
							});
						}
					})

				}
			}
			return false;
		});
	});
	(function() {
		function tabForward(e) {
			e = e || window.event;
			var target = e.target || e.srcElement;
			if(target.value.length === target.maxLength) {
				var form = target.form;
				for(var i = 0, len = form.elements.length - 1; i < len; i++) {
					if(form.elements[i] === target) {
						if(form.elements[i++]) {
							form.elements[i++].focus();
						}
						break;
					}
				}
			}
		}
		var form = document.getElementById("password");
		form.addEventListener("keyup", tabForward, false);
	})();
})