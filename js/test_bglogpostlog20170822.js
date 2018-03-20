$(function () {
    var channelPostLog = {
        domain: "bglog.bitauto.com",//"192.168.0.149",//
        apidomain: "api.cheyisou.com",// "2016.api.com",//
        bglogId: "",
        DC: null,
        imageUrl: "",
        Init: function (id, name) {
            var e = this;
            e.imageUrl = "http://" + e.domain + "/postlog20170731.gif?";
            e.bglogId = PostLogCookie.getCookie("UserGuid");
            if (e.bglogId.length > 0) {
                e.InitUrl(id, name);
            } else {
                GetbglogId().done(function () {
                    e.bglogId = PostLogCookie.getCookie("UserGuid");
                    e.InitUrl(id, name);
                });
            }
        },
        InitUrl: function (id, name) {
            var url = this.imageUrl;
            try {
                this.DC = this.Methods.DCInit();
                for (var n in this.DC) {
                    if (this.DC[n]) {
                        url += "&" + n + "=" + this.Methods.Escape(this.DC[n], this.Methods.RE)
                    }
                }
                url += "&b=" + this.bglogId;
                if (typeof (id) != "undefined" && typeof (name) != "undefined" && id && name) {
                    url += "&u=" + id + "," + name
                }
                this.imageUrl = url
            } catch (e) { }
        },
        SendLog: function (channel, obj, isexpose) {
            if (this.imageUrl == "") {
                InitPostLogUrl();
            }
            var g = $(obj);
            var url = this.imageUrl;
            try {
                if (typeof (ChannelLOGCollector) != "undefined") {
                    for (var i in ChannelLOGCollector) {
                        if (ChannelLOGCollector[i]) {
                            url += "&" + i + "=" + this.Methods.Escape(ChannelLOGCollector[i], this.Methods.RE)
                        }
                    }
                }
                console.log(channel + "-----" + (g.text() || g.val()));
                if (typeof (channel) != "undefined") {
                    url += "&channel=" + channel
                }
                if (typeof (g.attr("href")) != "undefined") {
                    url += "&linkurl=" + this.Methods.Escape(g.attr("href"), this.Methods.RE);
                }
                if (g[0].tagName.toLowerCase() === "a" && typeof (g.text()) != "undefined") {
                    var title = g.text().replace(/(^\s+)|(\s+$)/g, "");
                    url += "&title=" + this.Methods.Escape(title, this.Methods.RE);
                }
                if (url.length > 2048 && navigator.userAgent.indexOf("MSIE") >= 0) {
                    url = url.substring(0, 2042) + "&sub=1"
                }
                if (typeof (isexpose) != "undefined" && isexpose === 1) {
                    (new Image()).src = url.replace("/postlog.gif?", "/expose.gif?") + "&logts=" + (new Date()).getTime();
                }
                else {
                    if (g.attr("cysRecommend") == "1") {
                        (new Image()).src = this.imageUrl.replace("/postlog.gif?", "/recommend.gif?") + "&logtype=1&rid=" + g.attr("DataRid") + "&channelcode=" + channel + "&position=" + g.attr("DataPosition") + "&engine=" + g.attr("DataEngine") + "&score=" + g.attr("DataScore") + "&datatype=" + g.attr("DataType") + "&logts=" + (new Date()).getTime();
                        (new Image()).src = "http://" + this.apidomain + "/Recommend/RecomClickLog.aspx?ukey=" + this.bglogId + "&rid=" + g.attr("DataRid") + "&ub=" + channel + "&up=" + g.attr("DataPosition") + "&en=" + g.attr("DataEngine") + "&sc=" + g.attr("DataScore") + "&dt=" + g.attr("DataType") + "&logts=" + (new Date()).getTime();
                    }
                    (new Image()).src = url + "&logts=" + (new Date()).getTime();
                }
            } catch (e) {
                console.log(e);
            }
        },
        Methods: {
            DCInit: function () {
                var dc = new Object();
                var ref = window.document.referrer;
                if ((ref != "") && (ref != "-")) {
                    dc.ref = this.Encode(ref);
                }
                var href = document.URL || window.document.URL;
                dc.url = this.Encode(href);
                return dc
            },
            RE: {
                "%09": /\t/g,
                "%20": / /g,
                "%23": /\#/g,
                "%26": /\&/g,
                "%2B": /\+/g,
                "%3F": /\?/g,
                "%5C": /\\/g,
                "%22": /\"/g,
                "%7F": /\x7F/g,
                "%A0": /\xA0/g
            },
            Encode: function (s) {
                return (typeof (encodeURIComponent) == "function") ? encodeURIComponent(s) : escape(s)
            },
            Escape: function (s, rel) {
                if (window.RegExp && typeof (rel) != "undefined") {
                    var retStr = new String(s);
                    for (var r in rel) {
                        retStr = retStr.replace(rel[r], r);
                    }
                    return retStr;
                } else {
                    return escape(s);
                }
            }
        }
    };
    var PostLogCookie = {        
        getCookie: function (name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) {
                return unescape(arr[2])
            }
            return ""
        }
    };
    var InitPostLogUrl = function () {
        if (typeof (Bitauto) != "undefined" && !!Bitauto && typeof (Bitauto.Login) != "undefined" && !!Bitauto.Login) {
            Bitauto.Login.onComplatedHandlers.add("memory once",
                function (loginResult) {
                    if (loginResult.isLogined) {
                        channelPostLog.Init(loginResult.userId, loginResult.userName)
                    } else {
                        channelPostLog.Init()
                    }
                });
        } else {
            channelPostLog.Init()
        }
    },
        InitPostLog = function (event) {
            var channelid = $(this).attr("data-channelid");
            console.log(channelid);
            var realEnt = GetMousedownObj(event.target, event.currentTarget);
            if (realEnt != null)
                channelPostLog.SendLog(channelid, realEnt);
        },
        GetMousedownObj = function (ent, parentobj) {
            var tagname = ent.tagName.toLowerCase();
            var tagtype = ent.type;
            if (tagname === "a" || tagname === "button" || (tagname === "input" && (tagtype === "button" || tagtype === "submit"))) {
                return ent;
            }
            else {
                var eventsData = $.data(ent, 'events') || $._data(ent, 'events');
                if (($(ent).attr("onclick") != null && typeof ($(ent).attr("onclick")) != "undefined") || (eventsData && eventsData.click)) {
                    return ent;
                }
                if (ent === parentobj) {
                    return null;
                }
            }
            return GetMousedownObj(ent.parentNode, parentobj);
        },
        GetbglogId = function () {
            var deferred = $.Deferred();
            var syncUrlArr = ['api.i.yiche.com', 'api.i.bitauto.com', 'api.i.cheyisou.com'];
            var rootdomin = document.domain.split('.').slice(-2).join('.');
            function removeByValue() {
                var count = syncUrlArr.length;
                for (var i = 0; i < count; i++) {
                    if (syncUrlArr[i].indexOf(rootdomin) > -1) {
                        syncUrlArr.splice(i, 1);
                        break;
                    }
                }
            }
            function syncUserGuidCookie() {
                var userguid = PostLogCookie.getCookie("UserGuid");
                deferred.resolve();
                removeByValue();
                var syncDef = [];
                $.each(syncUrlArr, function (i, syncUrl) {
                    syncDef.push($.getScript("http://" + syncUrl + "/clientApi/UserTraceCookie?key=UserGuid&val=" + userguid));
                });
                $.when(syncDef);
            }
            function createSyncCookieUrl() {
                $.getScript("http://api.i." + rootdomin + "/clientApi/UserTraceCookie")
                    .done(syncUserGuidCookie);
            }           
            createSyncCookieUrl();
            setTimeout(function () { deferred.reject(); }, 3000);
            return deferred.promise();
        },
        RecommendShow = function () {
            var datachannel = $("[bglogrecommend]");
            for (var i = 0; i < datachannel.length; i++) {
                var currentobj = $(datachannel[i]),
                    channelid = currentobj.attr("data-channelid");
                var recommend = currentobj.find("[cysrecommend]");
                var count = recommend.length;
                for (var j = 0; j < count; j++) {
                    var g = $(recommend[j]);
                    (new Image()).src = channelPostLog.imageUrl.replace("/postlog.gif?", "/recommend.gif?") + "&logtype=0&rid=" + g.attr("DataRid") + "&channelcode=" + channelid + "&position=" + g.attr("DataPosition") + "&engine=" + g.attr("DataEngine") + "&score=" + g.attr("DataScore") + "&datatype=" + g.attr("DataType") + "&logts=" + (new Date()).getTime();
                }
            }
        },
        InitExpose = function () {
            var hasClick = function (obj, channelid) {
                var g = $(obj);
                var flag = g.attr("data_cyslogclickflag");
                if (flag && flag.split(',').indexOf(channelid) > -1) return true;
                if (flag)
                    g.attr("data_cyslogclickflag", flag + "," + channelid);
                else
                    g.attr("data_cyslogclickflag", channelid);
                return true;
            };
            var datachannel = $("[bglogexpose]");
            var count = datachannel.length;
            for (var i = 0; i < count; i++) {
                var currentobj = $(datachannel[i]),
                    channelid = currentobj.attr("data-channelid"),
                    tagname = currentobj[0].tagName.toLowerCase(),
                    tagtype = currentobj[0].type;
                if (tagname === "a" || tagname === "button" || (tagname === "input" && (tagtype === "button" || tagtype === "submit"))) {
                    hasClick(currentobj, channelid);
                } else {
                    var alist = currentobj.find("a,:button,:submit");
                    var alistcount = alist.length;
                    for (var j = 0; j < alistcount; j++) {
                        hasClick($(alist[j]), channelid);
                    }
                }
            }
        };
    //window.Bglog_Recommend = RecommendShow;
    //window.Bglog_InitPostLog = InitExpose;
    //window.BglogPostLog = function (channelid, obj, isexpose) {
    //    channelPostLog.SendLog(channelid, obj, isexpose);
    //};
    //InitExpose();
    InitPostLogUrl();
    $(document).on("mousedown", "[data-channelid]", InitPostLog);
});