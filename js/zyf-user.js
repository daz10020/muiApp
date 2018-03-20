var pcname = "",
	pcdname = "",
	cateid = "",
	longitude = "",
	latitude = "",
	sort = 1,
	page = 1,
	totalpage = 1;
/**
 * 首页 - 生活助手
 * @implementer	zyf
 * @creater		耿思民
 * @url			/api/brand/life
 * @method		get
 * @param		uid
 * @response	{"num":1,"day":8,"status":1,"info":"获取成功！"}
 */
function getindexlifeinfo() {
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
}

/**
 * 首页 - 获取省市对应区
 * @implementer	zyf
 * @creater		zyf
 * @url			js/pcd.json
 * @method		get
 * @param		
 * @response	
 */
var privname, cityName;

function getdistfromPC() {
	$.ajax({
		type: "GET",
		url: "./js/pcd.json",
		data: {},
		timeout: 10000,
		dataType: "json",
		success: function(data) {
			$(data).each(function(i, n) {
				if(n.name == privname) {
					$(n.city).each(function(i, n) {
						if(n.name == cityName) {
							$("#distlist .mui-table-view-cell").off("click");
							$("#distlist").empty();
							var item1 = '<li class="mui-table-view-cell active"data-aname="全城" data-aid="">全城</li>';
							$("#distlist").append(item1);
							$(n.area).each(function(i, n) {
								var item = '<li class="mui-table-view-cell" data-aname="' + n + '">' + n + '</li>';
								$("#distlist").append(item);
							});
							$("#distlist .mui-table-view-cell").on("click", function() {
								$("#distlist .active").removeClass("active");
								$(this).addClass("active");
								$("#bar0").text($(this).data("aname"));
								pcdname = pcname + $(this).data("aname");
								localStorage.pcdname = pcdname;
								mui('#popdist').popover("toggle");
								page = 1;
								sort = 1;
								getstorelist();
							});
						}
					});
				}
			});
		},
		error: function(msg) {
			console.log("错误", "连接服务器异常");
		}
	});
}

function thirdBar() {
	$("#sortlist .mui-table-view-cell").on("click", function() {
		$("#sortlist .active").removeClass("active");
		$(this).addClass("active");
		$("#bar2").text($(this).text());
		sort = $(this).data("sort");
		mui('#popleave').popover("toggle");
		page = 1;
		sort = 1;
		getstorelist();
	});
}
/**
 * 首页 - 门店列表（商家服务分类）
 * @implementer	zyf
 * @creater		耿思民
 * @url			/api/brand/category
 * @method		get
 * @param		
 * @response	
 */
var catelist;

function getmerchantcatelist() {
	$.ajax({
		type: "GET",
		url: myUrl + "brand/category",
		data: {},
		timeout: 10000,
		dataType: "json",
		success: function(data) {
			if(data.status == 1) {
				catelist = data.catelist;
				//				$("#catelist1 .mui-table-view-cell").off("click");
				//				$("#catelist2 .mui-table-view-cell").off("click");
				$("#catelist1").empty();
				$("#catelist2").empty();
				var item1 = '<li class="mui-table-view-cell active" data-cpid="">全部分类</li>';
				$("#catelist1").append(item1);
				$(data.catelist).each(function(i, n) {
					var item = '<li class="mui-table-view-cell" data-cpid="' + n.category_id + '">' + n.category_name + '</li>';
					$("#catelist1").append(item);
				});
				$("#catelist1 .mui-table-view-cell").on("click", function() {
					$("#catelist1 .active").removeClass("active");
					$(this).addClass("active");
					$("#catelist2").empty();
					var cpid = $(this).data("cpid");
					if(cpid == "") {
						cateid = cpid;
						mui('#popcat').popover("toggle");
						$("#bar1").text('全部分类');
						page = 1;
						sort = 1;
						getstorelist();
					} else {
						$(data.catelist).each(function(i, n) {
							if(n.category_id == cpid) {
								$(n.category_list).each(function(i, n) {
									var items = '<li class="mui-table-view-cell" data-csid="' + n.category_id + '">' + n.category_name + '</li>';
									$("#catelist2").append(items);
								});
								$("#catelist2 .mui-table-view-cell").on("click", function() {
									$("#catelist2 .active").removeClass("active");
									$(this).addClass("active");
									$("#bar1").text($(this).text());
									cateid = $(this).data("csid");
									mui('#popcat').popover("toggle");
									page = 1;
									sort = 1;
									getstorelist();
								});
							}
						});
					}
				});
			} else if(json.status == 0) {
				mui.toast("获取门店列表失败");
			}
		},
		error: function(msg) {
			console.log("错误", "连接服务器异常");
		}
	});
}

/**
 * 首页 - 门店列表
 * @implementer	zyf
 * @creater		耿思民
 * @url			/api/brand/index
 * @method		post
 * @param		page		页码
 * @param		longitude	经度
 * @param		latitude	纬度
 * @param		cityinfo	省市区名
 * @param		categorybrand_id	服务项目
 * @param		sort		排序
 */

function getstorelist(rtfoj) {
	$.ajax({
		type: "post",
		url: myUrl + "brand/index",
		data: {
			page: page,
			longitude: longitude,
			latitude: latitude,
			cityinfo: pcdname,
			categorybrand_id: cateid,
			sort: sort
		},
		timeout: 10000,
		dataType: "json",
		success: function(data) {
			console.log("indexstorelist", data);
			if(data.status == 1) {
				if(page == 1) {
					$("#brandlists").empty();
				}
				page++;
				totalpage = data.total_page;
				$(data.brandlist).each(function(i, n) {
					var range = "";
					switch(n.star) {
						case 0:
							range = "28_5.png";
							break;
						case 1:
							range = "28_4.png";
							break;
						case 2:
							range = "28_3.png";
							break;
						case 3:
							range = "28_2.png";
							break;
						case 4:
							range = "28_1.png";
							break;
						case 5:
							range = "28.png";
							break;
					}
					var item = '<div class="items" data-sid="' + n.brand_id + '" onclick="gobranddetail(this)">' +
						'<div class="img"><img src="' + imgUrl + n.brand_image + '" /></div>' +
						'<div class="details">' +
						'<div class="name">' + n.brand_name + '</div>' +
						'<div class="wash"></div>' +
						'<div class="count" style="background:none">' +
						'<img src="./image/' + range + '" class="mui-pull-left" style="width: 100%; max-width: 100px; margin-top: 1px;">' + n.star + '分</div>' +
						'<div class="status">' + n.switchh+'</div>' +
						'<div class="now">最近' + n.sale + '单</div>' +
						'<div class="addr">' + n.address + '</div>' +
						'<div class="distance">' + n.formatted + 'km</div>' +
						'</div>' +
						'</div>';
					$("#brandlists").append(item);
					if(n.type == "精洗") {
						$('.wash').addClass(' jingxi');
					} else {
						$('.wash').addClass(' puxi');
					}
				});
			} else if(data.status == 0) {

			}
			if(rtfoj) {
				rtfoj.endPullUpToRefresh();
			}
		},
		error: function(msg) {
			if(rtfoj) {
				rtfoj.endPullUpToRefresh();
			}
			console.log("错误", "连接服务器异常");
		}
	});
}

/**
 * 门店详情
 * @implementer	zyf
 * @creater		耿思民
 * @url			/api/brand/info
 * @method		post
 * @param		brand_id	门店id
 */
function getbranddetail() {
	$.ajax({
		type: "post",
		url: myUrl + "brand/info",
		data: {
			brand_id: brandid
		},
		timeout: 10000,
		dataType: "json",
		success: function(data) {
			console.log(data);
			if(data.status == 1) {
				$("#bimg").attr("src", imgUrl + data.brandlist[0].brand_image);
				$("#btitle").text(data.brandlist[0].brand_name);
				$("#bstat").text(data.brandlist[0].switch);
				switch(data.brandlist[0].star) {
					case 0:
						$("#bstar").attr("src", "../image/28_5.png");
						$("#brange").text("0分");
						break;
					case 1:
						$("#bstar").attr("src", "../image/28_4.png");
						$("#brange").text("1分");
						break;
					case 2:
						$("#bstar").attr("src", "../image/28_3.png");
						$("#brange").text("2分");
						break;
					case 3:
						$("#bstar").attr("src", "../image/28_2.png");
						$("#brange").text("3分");
						break;
					case 4:
						$("#bstar").attr("src", "../image/28_1.png");
						$("#brange").text("4分");
						break;
					case 5:
						$("#bstar").attr("src", "../image/28.png");
						$("#brange").text("5分");
						break;
				}
				$("#servtime").text(data.brandlist[0].opentime + " - " + data.brandlist[0].endtime);
				$("#baddr").text(data.brandlist[0].address);
				$(data.brandlist[0].brandcategory).each(function(i, n) {
					var item = '<div class="mui-row mui-content-padded">' +
						'<h5 class="marg-left mui-pull-left">' + n.name + '</h5>' +
						'<h5 class="mui-pull-right">积分</h5>' +
						'<h5 class="fred mui-pull-right">' + n.jifen + '</h5>' +
						'</div>';
					$("#catelist").append(item);
				});
				$(data.brandlist[0].brand_photo).each(function(i, n) {
					if(i == 0 || i == 3) {
						createelement(i);
					}
					var item = '<div class="mui-col-sm-4 mui-col-xs-4">' +
						'<img src="' + imgUrl + n.src + '" style="width: 90%;" />' +
						'</div>';
					if(i < 3) {
						$("#bimglistbl0").append(item);
					} else {
						$("#bimglistbl3").append(item);
					}
				});
				$("#bctype").text(data.brandlist[0].star + "分");
				$("#emnene").click(function() {
					openW('storeevos.html?brand_id=' + data.brandlist[0].brand_id);
				});
				$("#bdes").text(data.brandlist[0].des);
				sessionStorage.fbdetailbid = data.brandlist[0].brand_id;

			} else if(data.status == 0) {
				mui.toast("获取门店详情失败");
			}
		},
		error: function(msg) {
			console.log("错误", "连接服务器异常");
		}
	});
}

function createelement(i) {
	var item = '<div class="mui-slider-item">' +
		'<div class="mui-row mui-content-padded" id="bimglistbl' + i + '">' +
		'</div>' +
		'</div>';
	$("#bimglist").append(item);
}