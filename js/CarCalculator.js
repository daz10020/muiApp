var checkedClass = "jsq-item-check jsq-item-checked";
var uncheckedClass = "jsq-item-check";
var shangPai = 0;


//格式化前的税价
var taxPriceList = { "shoufu": 0, "acquisitionTax": 0, "jiaoQiangX": 0, "cheChuanTax": 0, "commonTotal": 0, "diSanZheX": 0, "cheSunShiX": 0, "buJiX": 0, "quanCheX": 0, "boLiX": 0, "ziRanX": 0, "engineX": 0, "cheShenX": 0, "siJiX": 0, "chengKeX": 0, "shangYeXian": 0, "totalPrice": 0 };


//获取车型信息
function loadCarInfoData(carId) {
    $.ajax({
        url: "/handlers/GetCarPriceJson.ashx?carid=" + carId,
        cache: false,
        success: function () {
            $("#topLayer").hide();
            $("#select_carname").html("" + tempInfo.YearType + "款 " + tempInfo.SerialShowName + " " + tempInfo.Name + "");
            $("#luochePrice").val(formatCurrency(tempInfo.CarReferPrice * 10000));
            $("#startCal").attr("href", "/CalcAutoCashTool.aspx/?carid=" + tempInfo.ID);
            $("#container").show();
            $("#master_container,#carinfo_container").hide();
        }
    });
}
//购置税
function calcAcquisitionTax() {
    var acquisitionTax = parseFloat($("#hidCarPrice").val()) / (1 + 0.17);
    taxPriceList.acquisitionTax = Math.round(acquisitionTax * 0.1);
    if (exhaustforfloat == "" || parseFloat(exhaustforfloat) == 0) {
        taxPriceList.acquisitionTax = 0;
        $("#gouZhiShuiDesc").text("免征购置税");
    } else {
        if (parseFloat(exhaustforfloat) <= 1.6) {
            var beginTime = new Date('2017/01/01 00:00:00').getTime();
            var endTime = new Date('2017/12/31 23:59:59').getTime();
            var currentDate = new Date().getTime();
            if (currentDate > beginTime && currentDate < endTime) {
                taxPriceList.acquisitionTax = Math.round(acquisitionTax * 0.075);
            }
        }
        $("#gouZhiShuiDesc").text("");
    }
    acquisitionTax = formatCurrency(taxPriceList.acquisitionTax);
    $('#gouZhiShui').html(acquisitionTax);
}
//上牌费用

//交强险
var is6ZuoYiXia = true;
function calcCompulsory() {
    var content = $("#zuoWeiSDl").find(".current").find("p").text();
    if ($("#hidCarPrice").val() == "0") {
        taxPriceList.jiaoQiangX = 0;
        $("#jiaoQiangX").html("0");
    } else {
        if (content == "家用6座以下") {
            is6ZuoYiXia = true;
            taxPriceList.jiaoQiangX = 950;
            $("#jiaoQiangX").html("950");
        } else {
            is6ZuoYiXia = false;
            taxPriceList.jiaoQiangX = 1100;
            $("#jiaoQiangX").html("1,100");
        }
    }
}

//======================车船使用税 start==============================
//车船使用税信息
var vehicleAndVesselTaxInfos = {
    1: {
        Level: 1,
        MinDisplacement: 0,
        MaxDisplacement: 1.0,
        DisplacementDescription: "1.0L(含)以下",
        Tax: 300
    },
    2: {
        Level: 2,
        MinDisplacement: 1.0,
        MaxDisplacement: 1.6,
        DisplacementDescription: "1.0-1.6L(含)",
        Tax: 420,
        IsDefault: true
    },
    3: {
        Level: 3,
        MinDisplacement: 1.6,
        MaxDisplacement: 2.0,
        DisplacementDescription: "1.6-2.0L(含)",
        Tax: 480
    },
    4: {
        Level: 4,
        MinDisplacement: 2.0,
        MaxDisplacement: 2.5,
        DisplacementDescription: "2.0-2.5L(含)",
        Tax: 900
    },
    5: {
        Level: 5,
        MinDisplacement: 2.5,
        MaxDisplacement: 3.0,
        DisplacementDescription: "2.5-3.0L(含)",
        Tax: 1920
    },
    6: {
        Level: 6,
        MinDisplacement: 3.0,
        MaxDisplacement: 4.0,
        DisplacementDescription: "3.0-4.0L(含)",
        Tax: 3480
    },
    7: {
        Level: 7,
        MinDisplacement: 4.0,
        MaxDisplacement: Number.MAX_VALUE,
        DisplacementDescription: "4.0L以上",
        Tax: 5280
    }
};

//根据排量获得车船使用税信息
function GetVehicleAndVesselTaxInfo(dispplacement) {
    for (var taxLevel in vehicleAndVesselTaxInfos) {
        if (dispplacement > vehicleAndVesselTaxInfos[taxLevel].MinDisplacement
            && dispplacement <= vehicleAndVesselTaxInfos[taxLevel].MaxDisplacement) {
            return vehicleAndVesselTaxInfos[taxLevel];
        }
    }
}
//车船使用税减免信息(免征 减半)
var vehicleAndVesselTaxRelief;
//排量
var exhaustforfloat;
//车船使用税
function CalculateVehicleAndVesselTax() {
    if ($("#hidCarPrice").val() == "0") {
        taxPriceList.cheChuanTax = 0;
        $('#cheChuanTax').html("0");
    } else {
        var idValue = $("#cheChuanDl").find(".current").find("p").attr("id");
        var taxLevel = idValue.substr(4);
        var vehicleAndVesselTaxValue = vehicleAndVesselTaxInfos[taxLevel].Tax;
        //车船使用税一般只能缴纳当年的，按月计算
        //vehicleAndVesselTaxValue = vehicleAndVesselTaxValue * (12 - new Date().getMonth()) / 12;
        //计算车船使用税减免
        if (vehicleAndVesselTaxRelief == "免征") {
            vehicleAndVesselTaxValue = 0;
        }
        else if (vehicleAndVesselTaxRelief == "减半") {
            vehicleAndVesselTaxValue = vehicleAndVesselTaxValue / 2;
        }
        taxPriceList.cheChuanTax = Math.ceil(vehicleAndVesselTaxValue);
        vehicleAndVesselTaxValue = formatCurrency(taxPriceList.cheChuanTax);
        $('#cheChuanTax').html(vehicleAndVesselTaxValue);
    }
}
//======================车船使用税 end==============================

//必要花费 小计
function calcEssentialCost() {
    var commonTotal = 0;
    commonTotal += taxPriceList.acquisitionTax;
    if (shangPai == 0) { //光标在文本框中 backspace也需要实时计算
        commonTotal += 0;
    } else {
        commonTotal += shangPai;
    }
    if (taxPriceList.cheChuanTax == 0) { //光标在文本框中 backspace也需要实时计算
        commonTotal += 0;
    } else {
        commonTotal += taxPriceList.cheChuanTax;
    }
    commonTotal += taxPriceList.jiaoQiangX;
    taxPriceList.commonTotal = commonTotal;
    $("#biYaoHuaFei1").html(formatCurrency(commonTotal));
    $("#biYaoHuaFei2").html(formatCurrency(commonTotal));
}

//======================商业险 start==============================
//第三责任险
function calcTPL() {
    var isDiSanZheXCheck = $("#chkDiSanZheX").attr("class") == checkedClass;
    if ($("#hidCarPrice").val() == "0") {
        if (isDiSanZheXCheck) {
            $("#liDiSanZheX").attr("class", "jsq-item-click");
        } else {
            $("#liDiSanZheX").attr("class", "");
        }
        taxPriceList.diSanZheX = 0;
        $("#diSanZheX").html("0");
        var idValue1 = $("#diSanZheXDl").find(".current").find("p").attr("id");
        idValue1 = idValue1.substr(4);
        switch (idValue1) {
            case "50000":
                $("#diSanZhePeiFu").text("赔付5万");
                break;
            case "100000":
                $("#diSanZhePeiFu").text("赔付10万");
                break;
            case "200000":
                $("#diSanZhePeiFu").text("赔付20万");
                break;
            case "500000":
                $("#diSanZhePeiFu").text("赔付50万");
                break;
            case "1000000":
                $("#diSanZhePeiFu").text("赔付100万");
                break;
            default:
                $("#diSanZhePeiFu").text("赔付5万");
                break;
        }

    } else {
        if (isDiSanZheXCheck) {
            var jdata1 = { j5: 710, j10: 1026, j20: 1270, j50: 1721, j100: 2242 };//6座以下
            var jdata2 = { j5: 659, j10: 928, j20: 1131, j50: 1507, j100: 1963 }; //6座及以上
            var idValue = $("#diSanZheXDl").find(".current").find("p").attr("id");
            idValue = idValue.substr(4);
            var jdata = is6ZuoYiXia ? jdata1 : jdata2;
            var reuslt;
            switch (idValue) {
                case "50000":
                    reuslt = jdata["j5"];
                    $("#diSanZhePeiFu").text("赔付5万");
                    break;
                case "100000":
                    reuslt = jdata["j10"];
                    $("#diSanZhePeiFu").text("赔付10万");
                    break;
                case "200000":
                    reuslt = jdata["j20"];
                    $("#diSanZhePeiFu").text("赔付20万");
                    break;
                case "500000":
                    reuslt = jdata["j50"];
                    $("#diSanZhePeiFu").text("赔付50万");
                    break;
                case "1000000":
                    reuslt = jdata["j100"];
                    $("#diSanZhePeiFu").text("赔付100万");
                    break;
                default:
                    reuslt = jdata["j5"];
                    $("#diSanZhePeiFu").text("赔付5万");
                    break;
            }
            taxPriceList.diSanZheX = reuslt;
            $("#diSanZheX").html(formatCurrency(reuslt));
            $("#liDiSanZheX").attr("class", "jsq-item-click");
            $("#liBuJiX").attr("class", "");
        } else {
            taxPriceList.diSanZheX = 0;
            $("#diSanZheX").html("0");
            $("#liDiSanZheX").attr("class", "");
        }
    }
}
//车辆损失险
function calcCarDamage() {
    if ($("#hidCarPrice").val() == "0") {
        taxPriceList.cheSunShiX = 0;
        $('#cheSunShiX').html("0");
    } else {
        if ($("#chkCheSunShiX").attr("class") == checkedClass) {
            var rate = 0.0095;
            var baseCost = 285;
            //没选车
            if (parseInt($("#hidCarID").val()) <= 0) {
                if (!is6ZuoYiXia) { //6座及以上
                    rate = 0.009;
                    baseCost = 342;
                }
            } else { //选车
                var seatNum = $("#hidSeatNum").val();
                if (!is6ZuoYiXia) { //6座及以上
                    if (seatNum >= 6 && seatNum < 10) {
                        rate = 0.009;
                        baseCost = 342;
                    } else if (seatNum >= 10 && seatNum < 20) {
                        rate = 0.0095;
                        baseCost = 342;
                    } else if (seatNum >= 20) {
                        rate = 0.0095;
                        baseCost = 357;
                    } else { //车本身座位数小于6 但又选择了6座以上
                        rate = 0.009;
                        baseCost = 342;
                    }
                }
            }
            var result = Math.round(parseInt($("#hidCarPrice").val()) * rate + baseCost);
            taxPriceList.cheSunShiX = result;
            $("#cheSunShiX").html(formatCurrency(result));
            //$("#liBoLiX").attr("class", "jsq-item-click");
            //$("#liCheShenX").attr("class", "jsq-item-click");
        } else {
            taxPriceList.cheSunShiX = 0;
            $('#cheSunShiX').html("0");
        }
    }
}
//不计免赔特约险
function calcAbatement() {
    var isSunShiCheck = $("#chkCheSunShiX").attr("class") == checkedClass;
    var isDiSanZheCheck = $("#chkDiSanZheX").attr("class") == checkedClass;
    var isBuJiCheck = $("#chkBuJiX").attr("class") == checkedClass;

    if ($("#hidCarPrice").val() == "0") {

        if (isSunShiCheck && isDiSanZheCheck) {
            $("#liBuJiX").attr("class", "");
        } else {
            $('#chkBuJiX').attr("class", uncheckedClass);
            $("#liBuJiX").attr("class", "jsq-item-click-gray");
        }
        taxPriceList.buJiX = 0;
        $("#buJiX").html("0");
    } else {
        if (isSunShiCheck && isDiSanZheCheck) {
            $("#liBuJiX").attr("class", "");
            if (isBuJiCheck) {
                var total = taxPriceList.cheSunShiX + taxPriceList.diSanZheX;
                total = Math.round(total * 0.2);
                taxPriceList.buJiX = total;
                $("#buJiX").html(formatCurrency(total));
            } else {
                taxPriceList.buJiX = 0;
                $("#buJiX").html("0");
            }
        }
        else {
            $('#chkBuJiX').attr("class", uncheckedClass);
            taxPriceList.buJiX = 0;
            $("#buJiX").html("0");
            $("#liBuJiX").attr("class", "jsq-item-click-gray");
        }
    }
}
//全车盗抢险
function calcCarTheft() {
    var isQuanCheX = $("#chkQuanCheX").attr("class") == checkedClass;
    var isCheSunShiX = $("#chkCheSunShiX").attr("class") == checkedClass;

    if ($("#hidCarPrice").val() == "0") {
        if (isCheSunShiX) {
            $("#liQuanCheX").attr("class", "");
        } else {
            $('#chkQuanCheX').attr("class", uncheckedClass);
            $("#liQuanCheX").attr("class", "jsq-item-click-gray");
        }

        taxPriceList.quanCheX = 0;
        $("#quanCheX").html("0");
    } else {
        if (isCheSunShiX) {
            $("#liQuanCheX").attr("class", "");
            if (isQuanCheX) {
                if (!is6ZuoYiXia) //6座及以上
                {
                    var result = Math.round(parseInt($("#hidCarPrice").val()) * 0.0044 + 140);
                    taxPriceList.quanCheX = result;
                    $("#quanCheX").html(formatCurrency(result));
                } else {
                    var total = Math.round(parseInt($("#hidCarPrice").val()) * 0.0049 + 120);
                    taxPriceList.quanCheX = total;
                    $("#quanCheX").html(formatCurrency(total));
                }
            } else {
                taxPriceList.quanCheX = 0;
                $("#quanCheX").html("0");
            }
        } else {
            $('#chkQuanCheX').attr("class", uncheckedClass);
            taxPriceList.quanCheX = 0;
            $("#quanCheX").html("0");
            $("#liQuanCheX").attr("class", "jsq-item-click-gray");
        }
    }
}
//玻璃单独破碎险
function calcBreakageOfGlass() {
    var isSunShiXCheck = $("#chkCheSunShiX").attr("class") == checkedClass;
    var isBoLiXCheck = $("#chkBoLiX").attr("class") == checkedClass;

    if ($("#hidCarPrice").val() == "0") {
        if (isSunShiXCheck) {
            if (isBoLiXCheck) {
                $("#liBoLiX").attr("class", "jsq-item-click");
            } else {
                $("#liBoLiX").attr("class", "");
            }
        } else {
            $('#chkBoLiX').attr("class", uncheckedClass);
            $("#liBoLiX").attr("class", "jsq-item-click-gray");
        }
        taxPriceList.boLiX = 0;
        $("#boLiX").html("0");
        var content1 = $("#boLiXDl").find(".current").find("p").text();
        if (content1 == "进口")//进口
        {
            $("#boLiPeiFu").text("进口玻璃");
        }
        if (content1 == "国产")//国产
        {
            $("#boLiPeiFu").text("国产玻璃");
        }
    } else {
        if (isSunShiXCheck) {
            if (isBoLiXCheck) {
                $("#liBoLiX").attr("class", "jsq-item-click");
                var content = $("#boLiXDl").find(".current").find("p").text();
                if (content == "进口")//进口
                {
                    $("#boLiPeiFu").text("进口玻璃");
                    if (!is6ZuoYiXia) { //6-10座客车
                        taxPriceList.boLiX = Math.round(parseInt($("#hidCarPrice").val()) * 0.003);
                        $("#boLiX").html(formatCurrency(taxPriceList.boLiX));
                    } else {
                        taxPriceList.boLiX = Math.round(parseInt($("#hidCarPrice").val()) * 0.0031);
                        $("#boLiX").html(formatCurrency(taxPriceList.boLiX));
                    }
                }
                if (content == "国产")//国产
                {
                    $("#boLiPeiFu").text("国产玻璃");
                    taxPriceList.boLiX = Math.round(parseInt($("#hidCarPrice").val()) * 0.0019);
                    $("#boLiX").html(formatCurrency(taxPriceList.boLiX));
                }
            } else {
                taxPriceList.boLiX = 0;
                $("#liBoLiX").attr("class", "");
                $("#boLiX").html("0");
            }
        } else {
            $('#chkBoLiX').attr("class", uncheckedClass);
            taxPriceList.boLiX = 0;
            $("#boLiX").html("0");
            $("#liBoLiX").attr("class", "jsq-item-click-gray");
        }
    }
}

//自燃损失险
function calcSelfignite() {
    if ($("#hidCarPrice").val() == "0") {
        taxPriceList.ziRanX = 0;
        $("#ziRanX").html("0");
    } else {
        var isZiRanCheck = $("#chkZiRanX").attr("class") == checkedClass;
        if (!isZiRanCheck) {
            taxPriceList.ziRanX = 0;
            $("#ziRanX").html("0");
            $("#liZiRanX").attr("class", "");
        } else {
            taxPriceList.ziRanX = Math.round(parseInt($("#hidCarPrice").val()) * 0.0015);
            $('#ziRanX').html(formatCurrency(taxPriceList.ziRanX));
            $("#liZiRanX").attr("class", "");
        }
    }
}

//发动机特别损失险(车损险*5%)

function calcCarEngineDamage() {
    var isEngineXCheck = $("#chkEngineX").attr("class") == checkedClass;
    var isSunShiXCheck = $("#chkCheSunShiX").attr("class") == checkedClass;

    if ($("#hidCarPrice").val() == "0") {
        if (isSunShiXCheck) {
            $("#liEngineX").attr("class", "");
        } else {
            $("#chkEngineX").attr("class", uncheckedClass);
            $("#liEngineX").attr("class", "jsq-item-click-gray");
        }
        taxPriceList.engineX = 0;
        $("#engineX").html("0");
    } else {
        if (isSunShiXCheck) {
            $("#liEngineX").attr("class", "");
            if (isEngineXCheck) {
                var cDamage = taxPriceList.cheSunShiX * 0.05;
                taxPriceList.engineX = Math.round(cDamage);
                $("#engineX").html(formatCurrency(taxPriceList.engineX));
            } else {
                taxPriceList.engineX = 0;
                $("#engineX").html("0");
            }
        } else {
            $("#chkEngineX").attr("class", uncheckedClass);
            taxPriceList.engineX = 0;
            $("#engineX").html("0");
            $("#liEngineX").attr("class", "jsq-item-click-gray");
        }
    }
}

//车身划痕险
function calcCarDamageDW() {
    var isSunShiXCheck = $("#chkCheSunShiX").attr("class") == checkedClass;
    var isCheShenXCheck = $("#chkCheShenX").attr("class") == checkedClass;
    if ($("#hidCarPrice").val() == "0") {
        if (isSunShiXCheck) {
            if (isCheShenXCheck) {
                $("#liCheShenX").attr("class", "jsq-item-click");
            } else {
                $("#liCheShenX").attr("class", "");
            }
        } else {
            $('#chkCheShenX').attr("class", uncheckedClass);
            $("#liCheShenX").attr("class", "jsq-item-click-gray");
        }
        taxPriceList.cheShenX = 0;
        $("#cheShenX").html("0");
        var vv = $("#cheShenXDl").find(".current").find("p").attr("id");
        vv = vv.substr(4);
        switch (vv) {
            case "2000":
                $("#cheShenPeiFu").text("赔付2千");
                break;
            case "5000":
                $("#cheShenPeiFu").text("赔付5千");
                break;
            case "10000":
                $("#cheShenPeiFu").text("赔付1万");
                break;
            case "20000":
                $("#cheShenPeiFu").text("赔付2万");
                break;
            default:
                break;
        }
    } else {
        if (isSunShiXCheck) {
            if (isCheShenXCheck) {
                $("#liCheShenX").attr("class", "jsq-item-click");
                var jdata1 = { j2000: 400, j5000: 570, j10000: 760, j20000: 1140 };
                var jdata2 = { j2000: 850, j5000: 1100, j10000: 1500, j20000: 2250 };
                var jdata3 = { j2000: 585, j5000: 900, j10000: 1170, j20000: 1780 };

                var money = parseInt($("#hidCarPrice").val());
                var jdata;
                if (money < 300000) {
                    jdata = jdata1;
                } else if (money > 500000) {
                    jdata = jdata2;
                } else {
                    jdata = jdata3;
                }
                var result = 0;
                var v = $("#cheShenXDl").find(".current").find("p").attr("id");
                v = v.substr(4);
                switch (v) {
                    case "2000":
                        $("#cheShenPeiFu").text("赔付2千");
                        result = jdata["j2000"];
                        break;
                    case "5000":
                        $("#cheShenPeiFu").text("赔付5千");
                        result = jdata["j5000"];
                        break;
                    case "10000":
                        $("#cheShenPeiFu").text("赔付1万");
                        result = jdata["j10000"];
                        break;
                    case "20000":
                        $("#cheShenPeiFu").text("赔付2万");
                        result = jdata["j20000"];
                        break;
                    default:
                        break;
                }
                taxPriceList.cheShenX = result;
                $("#cheShenX").html(formatCurrency(result));
            } else {
                taxPriceList.cheShenX = 0;
                $("#liCheShenX").attr("class", "");
                $("#cheShenX").html("0");
            }
        } else {
            $('#chkCheShenX').attr("class", uncheckedClass);
            taxPriceList.cheShenX = 0;
            $("#cheShenX").html("0");
            $("#liCheShenX").attr("class", "jsq-item-click-gray");
        }
    }
}

//司机责任险
function calcLimitofDriver() {
    var isSiJiXCheck = $("#chkSiJiX").attr("class") == checkedClass;
    if ($("#hidCarPrice").val() == "0") {
        if (isSiJiXCheck) {
            $("#liSiJiX").attr("class", "jsq-item-click");
        } else {
            $("#liSiJiX").attr("class", "");
        }
        taxPriceList.siJiX = 0;
        $("#siJiX").html("0");
        var idValue1 = $("#siJiXDl").find(".current").find("p").attr("id");
        idValue1 = idValue1.substr(4);
        switch (idValue1) {
            case "10000":
                $("#sijiPeiFu").text("赔付1万");
                break;
            case "20000":
                $("#sijiPeiFu").text("赔付2万");
                break;
            case "30000":
                $("#sijiPeiFu").text("赔付3万");
                break;
            case "40000":
                $("#sijiPeiFu").text("赔付4万");
                break;
            case "50000":
                $("#sijiPeiFu").text("赔付5万");
                break;
            default:
                break;
        }
    } else {
        if (isSiJiXCheck) {
            var idValue = $("#siJiXDl").find(".current").find("p").attr("id");
            idValue = idValue.substr(4);
            switch (idValue) {
                case "10000":
                    $("#sijiPeiFu").text("赔付1万");
                    break;
                case "20000":
                    $("#sijiPeiFu").text("赔付2万");
                    break;
                case "30000":
                    $("#sijiPeiFu").text("赔付3万");
                    break;
                case "40000":
                    $("#sijiPeiFu").text("赔付4万");
                    break;
                case "50000":
                    $("#sijiPeiFu").text("赔付5万");
                    break;
                default:
                    break;
            }
            if (is6ZuoYiXia) { //6座以下
                //所选金额*费率*（座位数-1）。如果没有座位数，则*4
                taxPriceList.siJiX = Math.round(idValue * 0.0042);
                $("#siJiX").html(formatCurrency(taxPriceList.siJiX));
            } else {
                taxPriceList.siJiX = Math.round(idValue * 0.004);
                $("#siJiX").html(formatCurrency(taxPriceList.siJiX));
            }
            $("#liSiJiX").attr("class", "jsq-item-click");
        } else {
            taxPriceList.siJiX = 0;
            $("#siJiX").html("0");
            $("#liSiJiX").attr("class", "");
        }
    }
}

//乘客责任险（//所选金额*费率*（座位数-1）。如果没有座位数，则*4）
function calcLimitofPassenger() {
    var isChengKeXCheck = $("#chkChengKeX").attr("class") == checkedClass;
    if ($("#hidCarPrice").val() == "0") {
        if (isChengKeXCheck) {
            $("#liChengKeX").attr("class", "jsq-item-click");
        } else {
            $("#liChengKeX").attr("class", "");
        }
        taxPriceList.chengKeX = 0;
        $("#chengKeX").html("0");
        var idValue1 = $("#chengKeXDl").find(".current").find("p").attr("id");
        idValue1 = idValue1.substr(4);
        switch (idValue1) {
            case "10000":
                $("#chengkePeiFu").text("赔付1万");
                break;
            case "20000":
                $("#chengkePeiFu").text("赔付2万");
                break;
            case "30000":
                $("#chengkePeiFu").text("赔付3万");
                break;
            case "40000":
                $("#chengkePeiFu").text("赔付4万");
                break;
            case "50000":
                $("#chengkePeiFu").text("赔付5万");
                break;
            default:
                break;
        }
    } else {

        if (isChengKeXCheck) {
            var idValue = $("#chengKeXDl").find(".current").find("p").attr("id");
            idValue = idValue.substr(4);
            switch (idValue) {
                case "10000":
                    $("#chengkePeiFu").text("赔付1万");
                    break;
                case "20000":
                    $("#chengkePeiFu").text("赔付2万");
                    break;
                case "30000":
                    $("#chengkePeiFu").text("赔付3万");
                    break;
                case "40000":
                    $("#chengkePeiFu").text("赔付4万");
                    break;
                case "50000":
                    $("#chengkePeiFu").text("赔付5万");
                    break;
                default:
                    break;
            }
            var seatNum = $("#hidSeatNum").val();
            var calCount;
            if (seatNum < 4) {  //小于四座看做没有座位数
                calCount = 4;
            } else {
                calCount = seatNum - 1;
            }
            if (is6ZuoYiXia) { //6座以下
                taxPriceList.chengKeX = Math.round(idValue * 0.0027 * calCount);
                $("#chengKeX").html(formatCurrency(taxPriceList.chengKeX));
            } else {
                taxPriceList.chengKeX = Math.round(idValue * 0.0026 * calCount);
                $("#chengKeX").html(formatCurrency(taxPriceList.chengKeX));
            }
            $("#liChengKeX").attr("class", "jsq-item-click");
        } else {
            taxPriceList.chengKeX = 0;
            $("#chengKeX").html("0");
            $("#liChengKeX").attr("class", "");
        }
    }
}

//商业保险小计
function calcCommonTotal() {
    var commonTotal = 0;
    if ($("#chkDiSanZheX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.diSanZheX;
    }
    if ($("#chkCheSunShiX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.cheSunShiX;
    }
    if ($("#chkBuJiX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.buJiX;
    }
    if ($("#chkQuanCheX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.quanCheX;
    }
    if ($("#chkBoLiX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.boLiX;
    }
    if ($("#chkZiRanX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.ziRanX;
    }
    if ($("#chkEngineX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.engineX;
    }
    if ($("#chkCheShenX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.cheShenX;
    }
    if ($("#chkSiJiX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.siJiX;
    }
    if ($("#chkChengKeX").attr("class") == checkedClass) {
        commonTotal += taxPriceList.chengKeX;
    }
    taxPriceList.shangYeXian = Math.round(commonTotal);
    $("#shangYeXian1").html(formatCurrency(taxPriceList.shangYeXian));
    $("#shangYeXian2").html(formatCurrency(taxPriceList.shangYeXian));
}

//======================商业险 end==============================

//计算全款
function calcTotal() {
    taxPriceList.totalPrice = parseInt($("#hidCarPrice").val()) + taxPriceList.commonTotal + taxPriceList.shangYeXian;
    $("#totalPrice").html(formatCurrency(taxPriceList.totalPrice));
    if ($("#totalPriceLayer")) {
        $("#totalPriceLayer").html(formatCurrency(taxPriceList.totalPrice));
    }

    if ($("#totalPriceBottom")) {
        $("#totalPriceBottom").html(formatCurrency(taxPriceList.totalPrice));
    }
}

//检查车价格
function checkMoneyValidation() {
    //var money = $('#luochePrice2').val();
    //if (isNaN(money)) {
    //	alert("请输入数字!");
    //	$('#luochePrice2').val("").focus();
    //	return false;
    //}
    //if (parseInt(money) == 0 || money == "") {
    //	return false;
    //}
    //if (parseInt(money) != 0 && (parseInt(money) < 20000 || parseInt(money) > 99999999)) {
    //	alert("请输入正确的价格！");
    //	$('#luochePrice2').val("").focus();
    //	return false;
    //}
    //return true;
}

function GetCarInfo(carId) {
    $.ajax({
        url: "/handlers/GetCarInfoForCalcTools.ashx?type=jsonwithname&carId=" + carId,
        cache: true,
        async: false,
        dataType: "script",
        success: function () {
            if (typeof tmpCarInfo == "undefined")
                return;
            var json = tmpCarInfo;
            //设置车款金额
            //$("#show_money").val(Math.round(json.referPrice * 10000));
            //$(".selected-car span").html();
            //车船使用税
            //var rdoVehicleTax = $("#show_chechuantax");

            //座位数
            $("#hidSeatNum").val(json.seatNum);
            if (json.seatNum != "0" && json.seatNum >= 6) {
                $("#zuoWeiSDl dd").attr("class", "");
                $("#zuoWeiSDl dd").eq(1).attr("class", "current");
            }
            else {
                $("#zuoWeiSDl dd").attr("class", "");
                $("#zuoWeiSDl dd").eq(0).attr("class", "current");
            }
            //是否国产
            if (json.isGuoChan == "" || json.isGuoChan == "True") {
                $("#boLiXDl dd").attr("class", "");
                $("#boLiXDl dd").eq(0).attr("class", "current");
            }
            else {
                $("#boLiXDl dd").attr("class", "");
                $("#boLiXDl dd").eq(1).attr("class", "current");
            }
            //根据排量选择车船税的级别
            exhaustforfloat = json.exhaustforfloat;
            var vehicleAndVesselTaxInfo = GetVehicleAndVesselTaxInfo(exhaustforfloat);
            if (typeof vehicleAndVesselTaxInfo != "undefined") {
                $("#cheChuanDl dd").attr("class", "");
                $("#cheChuanDl dd").eq(vehicleAndVesselTaxInfo.Level - 1).attr("class", "current");
            }
            //车船使用税减免信息
            vehicleAndVesselTaxRelief = json.traveltax;
        }
    });
}

//设置连接地址
function setCalcToolUrl(carIdOrPrice, paraValue) {
    //var is6zuo = $("input[name='r_jiaoqiang']").eq(0).attr("checked");
    //var compulsoryIdx = is6zuo ? 0 : 1;
    //if (carId > 0)
    //	$(".m-tabs a").each(function () {
    //		var url = $(this).attr("href");
    //		var paraIndex = url.indexOf("?");
    //		if (paraIndex > 0)
    //			url = url.substring(0, paraIndex);
    //		if ($(this).html() == "保险计算")
    //			url += "?CarPrice=" + $("#show_money").val() + "&CompulsoryIdx=" + compulsoryIdx;
    //		else
    //			url += "?carid=" + carId;
    //		$(this).attr("href", url);
    //	});
    if (carIdOrPrice == "caridAndPrice") {
        $("#quankuanUrl").attr("href", "/gouchejisuanqi/?carid=" + paraValue + "&carprice=" + $("#hidCarPrice").val());
        $("#daikuanUrl").attr("href", "/qichedaikuanjisuanqi/?carid=" + paraValue + "&carprice=" + $("#hidCarPrice").val());
        $("#baoxianUrl").attr("href", "/qichebaoxianjisuan/?carid=" + paraValue + "&carprice=" + $("#hidCarPrice").val());
    } else {
        if (carIdOrPrice == "carPrice") {
            $("#quankuanUrl").attr("href", "/gouchejisuanqi/?carprice=" + paraValue);
            $("#daikuanUrl").attr("href", "/qichedaikuanjisuanqi/?carprice=" + paraValue);
            $("#baoxianUrl").attr("href", "/qichebaoxianjisuan/?carprice=" + paraValue);
        } else {
            $("#quankuanUrl").attr("href", "/gouchejisuanqi/?carid=" + paraValue);
            $("#daikuanUrl").attr("href", "/qichedaikuanjisuanqi/?carid=" + paraValue);
            $("#baoxianUrl").attr("href", "/qichebaoxianjisuan/?carid=" + paraValue);
        }
    }
}
//==========================通用方法=================================



//4.784->4784
function GetIntValue(num) {
    num = num.toString().replace(/\,/g, '');
    return parseInt(num);
}
//格式化字符串占位符
function formatString() {
    if (arguments.length == 0)
        return null;
    var str = arguments[0];
    var obj = arguments[1];
    for (var key in obj) {
        var re = new RegExp('\\{' + key + '\\}', 'gi');
        str = str.replace(re, obj[key]);
    }
    return str;
}
//格式化千位符(6701->6,701)
function formatCurrency(num) {
    if (num == null || num == undefined) return "0";
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num)) num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    num = Math.floor(num / 100).toString();
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3) ; i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + num);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//==========================汽车贷款=================================
//首付款：首付金额+必要花费+商业保险 首付金额=购车价格×首付比例
function calcDownPayments() {
    var shoufu = $("#shoufuDiv a.current").eq(0).html().trim();
    var result = 0;
    switch (shoufu) {
        case "30%": result = 0.3; break;
        case "40%": result = 0.4; break;
        case "50%": result = 0.5; break;
        case "60%": result = 0.6; break;
        default: break;
    }
    taxPriceList.shoufu = Math.round(parseInt($("#hidCarPrice").val()) * result);
    var shoufuTotal = formatCurrency(taxPriceList.shoufu + taxPriceList.commonTotal + taxPriceList.shangYeXian);
    $("#shoufu").html(shoufuTotal);
    $("#shoufuLayer").html(shoufuTotal);
    $("#shoufuBottom").html(shoufuTotal);
}
//贷款额
function calcLoanValue() {
    var years = parseInt($("#yearDiv a.current").eq(0).html().trim());
    var loanMonths = years * 12;
    $("#yueShu").text(loanMonths);
    $("#yueShuLayer").text(loanMonths);
    $("#yueShuBottom").text(loanMonths);
    if (!isHaveLoanRate) {
        switch (years) {
            case 1:
                $("#loanRate").attr("value", "6.31");
                break;
            case 2:
            case 3:
                $("#loanRate").attr("value", "6.4");
                break;
            case 4:
            case 5:
                $("#loanRate").attr("value", "6.65");
                break;
            default:
                break;
        }
    }
}
//月供
function calcMonthPayments() {
    var loanMonths = parseInt($("#yueShu").text());
    var loanRate = $("#loanRate").val();
    var yearRate = loanRate / 100;
    var monthPercent = yearRate / 12;
    var loanValue = parseInt($("#hidCarPrice").val()) - taxPriceList.shoufu;
    if (loanRate == 0) {
        result = Math.round(loanValue / loanMonths);
    }
    else {
        var fenzi = loanValue * monthPercent * Math.pow((1 + monthPercent), loanMonths);
        var fenmu = (Math.pow((1 + monthPercent), loanMonths) - 1);
        var result = 0;
        if (fenmu != 0) {
            result = Math.round(fenzi / fenmu);
        }
    }
    $("#yueGong").text(formatCurrency(result));
    $("#yueGongLayer").text(formatCurrency(result));
    $("#yueGongBottom").text(formatCurrency(result));

    //利息 月供*月数-贷款金额
    var lixi = 0;
    if (loanRate > 0) {
        lixi = result * loanMonths - loanValue;
    }
    $("#liXi").text(formatCurrency(lixi));
    $("#liXiLayer").text(formatCurrency(lixi));
    $("#liXiBottom").text(formatCurrency(lixi));
}


//=========================保险=====================================
//官方指导价
function calcCompany() {
    var companyTotal = taxPriceList.jiaoQiangX + taxPriceList.shangYeXian;
    $("#guanFangPrice").html(formatCurrency(companyTotal));
}
//计算市场报价
function calcMarket() {
    var marketTotal = taxPriceList.jiaoQiangX + (taxPriceList.shangYeXian * 0.9);
    marketTotal = Math.round(marketTotal);
    $("#marketPrice").html(formatCurrency(marketTotal));
    $("#marketPrice1").html(formatCurrency(marketTotal));
    $("#marketPriceBottom").html(formatCurrency(marketTotal));
}
