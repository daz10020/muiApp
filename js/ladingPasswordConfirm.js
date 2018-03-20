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
					
					var name = request("name");
					var price = request("price");
					var goodid = request("goodid");
					var num = $(".num").val();
					var total = $(".much span").text();
					$.ajax({
						type:"post",
						url:myUrl +"member/index",
						async:true,
						data: {
							uid:localStorage.xnuid,
							total:total,
							name:name,
							quantity:num,
							goods_id:goodid,
							paypass:check_pass_word
						},
						success:function(msg) {
							console.log(msg);
							mui.toast(msg.info);
							if(msg.status == 1){
   								localStorage.setItem("xnpoints",msg.money);	
   								localStorage.setItem('order_arr',JSON.stringify(msg.list));
   								openW('order_details.html');
   								
							} else {
								window.location.reload();
							}
						}
					});
				
				
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