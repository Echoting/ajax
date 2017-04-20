/**
 * author:ruile@staff.sina.com.cn 2016年2月24日
 * 正文页 广告 feedpush
 */

(function(){
    var isUC = false,
        isQQ = false,
        is360 = false,
        isBaidu = false;
    var $artical_tjyd = $('[sax-type="proxy"]');

    var prtl = 'https:' == window.location.protocol ? 'https://': 'http://';
    var prtln = 'https:' == window.location.protocol ? 'ns': 'n';
    var ismjsHTTPS = 'https:' == window.location.protocol ? 'https://mjss.sinaimg.cn' : 'http://mjs.sinaimg.cn';
    var feed_default = ismjsHTTPS +'/wap/online/cms/article/formal/images/img/feed_default.jpg';
    var lazyLoadImgConfig ={
        lz1X1:ismjsHTTPS+'/wap/online/home/v7/images/lz1X1.jpg',
        lz2X1:ismjsHTTPS+'/wap/online/home/v7/images/lz2X1.jpg',
        lz4X3:ismjsHTTPS+'/wap/online/home/v7/images/lz4X3.jpg',
        lz148X125:ismjsHTTPS+'/wap/online/home/v7/images/lz148X125.jpg'
    };
    var feedPush = {
        dataLength: 0,        
        init: function () {
            this._ua = this._getUA();
            this.channelPushs = $artical_tjyd;
            this.dataLength = $artical_tjyd.length;
            isUC = this._isUCCheck();
            isQQ = this._isQQBrowserCheck();
            isBaidu = this._isBaiduBrowserCheck();
            is360 = this._is360BrowserCheck();
            
            if(window["kandianPushs"]){
                
                this.kandianPushs = window["kandianPushs"];
                this.kdDataLen = window["kandianPushs"].length;
                
            }
        },
        //淡出效果(含淡出到指定透明度)
        fadeOut:function (elem, speed, opacity){
            /*
             * 参数说明
             * elem==>需要淡入的元素
             * speed==>淡入速度,正整数(可选)
             * opacity==>淡入到指定的透明度,0~100(可选)
             */
            speed = speed || 20;
            opacity = opacity || 0;
            //初始化透明度变化值为0
            var val = 20;
            //循环将透明值以5递减,即淡出效果
            (function(){
                feedPush.SetOpacity(elem, val);
                val -= 5;
                if (val >= opacity) {

                    //每隔speed时间执行一次函数本事，实现慢慢变化的效果
                    setTimeout(arguments.callee, speed);
                }else if (val < 0) {
                    //元素透明度为0后隐藏元素
                    elem.style.display = 'none';
                }
            })();
        },
        SetOpacity: function(ev, v){
            ev.filters ? ev.style.filter = 'alpha(opacity=' + v + ')' : ev.style.opacity = v / 100;
        },
        searchKeyWords:function(){
            var keywords = ['奥运','金牌','冠军'];
            $("[name=keywords]").each(function(index,item){
                console.log(index,item);
                var str = $(item).attr("content");
                var i = 0,
                    len = keywords.length;
                for(;i<len;i++){
                    if( str.indexOf(keywords[i])>0 ){
                        feedPush.insertAnimation();
                        return;
                    }
                   
                }

            });
        },
        insertAnimation:function(){
            if( $('.lmt_w') && $('.lmt_w').length > 0){
                var _src = $('.lmt_w').find('.lmt_img')[0].getAttribute('src');
                var img = new Image();
                img.onload = function(){
                    setTimeout(function(){
                        feedPush.fadeOut($('.lmt_w')[0],5);
                    },8*1000);

                    $(document).on('click','.lmt_c_w',function(){
                        feedPush.fadeOut($('.lmt_w')[0],5);
                        return;
                    });
                }
                img.src = _src;
            }
        },
        bindEvent:function(){
            $(document).on("click tap",".gifImg",function(e){
                var imgWrap = $(e.target).parents(".carditems_list_dd");
                var gifWrap = imgWrap.find(".hide");

                if(imgWrap.children().hasClass('carditems_gifImg') && imgWrap.children().hasClass('j_link')){
                    location.href = imgWrap.prev()[0].href;
                }
                if(gifWrap.hasClass('carditems_gifImg') && gifWrap.hasClass('hide')){            
                    gifWrap.removeClass("hide");
                    imgWrap.children().first().addClass("hide");
                    gifWrap.addClass('j_link');
                    return;
                }
            });            
            $(document).on("tap click",".vedioWrap",function(e){
                if(e.target.width >0){
                    var imgWidth = $(e.target).width();
                }else{
                    var imgWidth = 400;
                }
                var $vid = $(e.target).parents(".f_card_pic").next();
                $vid.children().first().height(imgWidth/2+'px');
                //console.log(imgWidth/2+'px');
                $vid.prev().addClass("hide");
                $vid.removeClass("hide").addClass("playing");
                $vid.children().first()[0].play();
            });
            $(document).on("tap click",".vedioBtn",function(e){
                if(e.target.width >0){
                    var imgWidth = $(e.target).parents(".f_card_pic").find(".vedioWrap").children().first().width();
                }else{
                    var imgWidth = 400;
                }
                
                var $vid = $(e.target).parents(".f_card_pic").next();
                $vid.children().first().height(imgWidth/2+'px');
                //console.log(imgWidth/2+'px');
                $vid.prev().addClass("hide");
                $vid.removeClass("hide").addClass("playing");
                $vid.children().first()[0].play();
            });
            $(document).on("tap click",".teljc",function(e){
                var pv_src = $(e.target).data('teljc');
                feedPush.sendPv(pv_src);
            });

        },
        _getUA: function(){            
            //alert((navigator.userAgent).toLowerCase());
            return (navigator.userAgent).toLowerCase();
        },
        _isUCCheck: function(){
            var ua = this._ua;
            var ret = false;            
            ret = ua.indexOf("ucbrowser") > -1 && ua.indexOf("iphone") == -1;             
            return ret;
        },
        _isQQBrowserCheck: function(){
            var ua = this._ua;
            var ret = false;            
            ret = ua.indexOf("qqbrowser") > -1 && ua.indexOf("iphone") == -1;            
            return ret;
        },
        _isBaiduBrowserCheck: function(){
            var ua = this._ua;
            var ret = false;            
            ret = ua.indexOf("baidu") > -1 && ua.indexOf("iphone") == -1;            
            return ret;
        },
        _is360BrowserCheck: function(){
            var ua = this._ua;
            var ret = false;            
            ret = ua.indexOf("360 aphone") > -1 && ua.indexOf("iphone") == -1;            
            return ret;
        },
        sendPv:function(pv) {
            if(pv && !sinaSax.isBlank(pv)){
                var img = sinaSax.creatElement("img", {src: pv});
                $("#sax_pv_count").append(img);
            }
        },
        push:function(){
            var str = '',
            i = 0,
            len = this.kandianPushs.length;
            if (!document.querySelector('#sax_dom_storage')) {
                var divPiece = document.createElement('div');
                divPiece.id = 'sax_dom_storage';
                divPiece.style.display = 'none';
            } else {
                var divPiece = document.querySelector('#sax_dom_storage');
            }
            for (; i < len; i++) {

                if (this.kandianPushs[i]['pushed']) {
                    continue;
                }

                if (this.kandianPushs[i].caIndex <= $("#j_oWrap #j_container").children().length ) {
                    str += this.kandianPushs[i]['domHTML'];
                    this.kandianPushs[i]['pushed'] = 1;
                }
            }

            divPiece.innerHTML = str;
            document.body.appendChild(divPiece);
            sinaSax.init();
        },
        insertCardPush:function(dom){//渲染回来的数据
            
            if(dom.innerHTML && dom.getAttribute("data-pos")){
                var pos = dom.getAttribute("data-pos");
                $("#j_oWrap #j_container").children().eq(pos-2).after(dom);
            }
            
        },
        createWordsScript:function (tar,html,pvStr,scriptSrc,flag){
            if(scriptSrc){
                var _script = sinaSax.creatElement("script", {"type": "text/javascript","src":scriptSrc});
            }else{
                var _script = sinaSax.creatElement("script", {"type": "text/javascript"});
                 
            }
            if(html != ''){
                _script.innerHTML = html;
            }
            

            if(pvStr){
                var img = sinaSax.creatElement("img", {'src': pvStr+'&r='+Math.random()});
                if($("#sax_pv_count").length > 0 ){
                    $("#sax_pv_count").append(img);
                }else{
                    tar.appendChild(img);
                }
            }
            
            tar.appendChild(_script);
            if(flag != false){
                    sinaSax.callback('triggerDomIimit',[tar]);
            }
        
        }
    }
    
    

    var proxy_column_feed = {
        vid:[],
        getCommStr: function (data) {
            var $comment_total = data['comment_total'];
            var $comm_str = (data['adtype'] == '01' ? ($comment_total == 0 ? '' : $comment_total) : $comment_total);
            return $comm_str == 0 ? '' : $comm_str;
        },
        temp31: function (dom, data) {
            var arr=[];
            arr.push('<a href="' + data['url'] + '">');
            arr.push('<dl class="clearfix f_card">');
            arr.push('<dt class="j_art_lazy f_card_dt" data-src="'+data['img']['u']+'" data-lazy-type="img_bg" style="background-image:url('+feed_default+')"></dt>');
            arr.push('<dd class="f_card_dd">');
            arr.push('<h3 class="title">' + data['title'] + '</h3>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('</div></dd></dl></a>');
            dom.innerHTML = arr.join('');
        },
        temp32: function (dom, data) { //正文无此模板
            var arr=[];
            arr.push('<a href="' + data['url'] + '">');
            arr.push('<dl class="clearfix f_card">');
            arr.push('<dt class="carditems_list_dt"><img src="' + data['img']['u'] + '" alt="' + data['title'] + '"><span class="video_tips">&nbsp;</span></dt>');
            arr.push('<dd class="carditems_list_dd">');
            arr.push('<h3 class="carditems_list_h3 title pic_t_44">' + data['title'] + '</h3>');
            arr.push('<p class="carditems_list_op">');
            arr.push('<span class="op_ico op_patronage_tips fl">广告</span>');
            arr.push('<span class="op_ico num_ico fr">' + this.getCommStr(data) + '</span>');
            arr.push('</p></dd></dl></a>');
            dom.innerHTML = arr.join('');
        },
        temp33: function (dom, data) {//wap组图模板   templateid为33
            var arr=[];
                arr.push('<a href="' + data['url'] + '">');
                arr.push('<dl class="clearfix f_card default">');
                arr.push('<dd class="f_card_dd">');
                arr.push('<h3 class="f_card_h3 title ellipsis">' + data['title'] + '</h3>');

                arr.push('<ul class="f_card_pic f_card_pic_ul">');
                if(data['images'].length >= 3){
                    arr.push('<li><img  class="j_art_lazy" src="'+feed_default+'" data-src="' + data['images'][0]['u'] + '" alt="' + data['title'] + '" /></li>');
                    arr.push('<li><img  class="j_art_lazy" src="'+feed_default+'" data-src="' + data['images'][1]['u'] + '" alt="' + data['title'] + '" /></li>');
                    arr.push('<li><img  class="j_art_lazy" src="'+feed_default+'" data-src="' + data['images'][2]['u'] + '" alt="' + data['title'] + '" /></li>');
                }
                arr.push('</ul>');
                arr.push('<div class="mark_count">');
                arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
                arr.push('</div>');
                arr.push('</dd></dl></a>');
            dom.innerHTML = arr.join('');
        },
        temp34: function (dom, data) {
            var arr=[];
            arr.push('<a href="' + data['url'] + '">');
            arr.push('<dl class="clearfix f_card">');
            arr.push('<dd class="carditems_list_dd">');
            arr.push('<h3 class="carditems_list_h3 title">' + data['title'] + '</h3>');
            arr.push('<h4 class="carditems_list_h4">' + data['intro'] + '</h4>');
            arr.push('<p class="carditems_list_op">');
            arr.push('<span class="op_ico op_patronage_tips fl recom_blue">广告</span>');
            arr.push('<span class="op_ico num_ico fr">' + this.getCommStr(data) + '</span>');
            arr.push('</p></dd></dl></a>');
            dom.innerHTML = arr.join('');
        },
        temp35: function (dom, data) {//wap大图模板   templateid为35
            var arr=[];
                arr.push('<a href="' + data['url'] + '">');
                arr.push('<dl class="f_card clearfix">');
                arr.push('<dd class="f_card_dd">');
                arr.push('<h3 class="f_card_h3 ellipsis title">' + data['title'] + '</h3>');
                arr.push('<p class="f_card_pic re_flex"><img class="j_art_lazy" src="'+lazyLoadImgConfig.lz2X1+'" data-src="' + data['img']['u'] + '" alt="' + data['title'] + '"></p>');
                arr.push('<div class="mark_count">');
                arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
                arr.push('<p class="f_card_p_ad">' + data['weibourl'] + '</p>');
                arr.push('</div></dd></dl></a>');            
            dom.innerHTML = arr.join('');
        },
        temp36: function (dom, data) {
            var arr=[];
            arr.push('<div class="card_phone_box">');
            arr.push('<a href="' + data['url'] + '">');

            arr.push('<dl class="f_card clearfix">');
            arr.push('<dt class="j_art_lazy f_card_dt" data-src="'+data['img']['u']+'" data-lazy-type="img_bg" style="background-image:url('+feed_default+')"></dt>');
            arr.push('<dd class="f_card_dd">');
            arr.push('<h3 class="intro_h3 title">' + data['title'] + '</h3>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('</div></dd></dl></a>');
            arr.push('<a href="tel:' + data['tel'] + '" data-teljc="' + data['namonitor']['tel'] + '" class="card_zz_list_btn zz_phonebtn teljc">电话号码</a>');
            arr.push('</div>');
            //arr.push('<a href="tel:' + data['tel'] + '" data-teljc="' + data['namonitor']['tel'] + '" class="icon_phone_18 teljc"></a>');           
            dom.innerHTML = arr.join('');
        },
        temp37: function (dom, data) {
            var arr=[];
            arr.push('<div class="card_zz_list ">');
            arr.push('<a href="' + data['url'] + '">');           
            arr.push('<dl class="clearfix f_card">');
            arr.push('<dt class="j_art_lazy f_card_dt" data-src="'+data['img']['u']+'" data-lazy-type="img_bg" style="background-image:url('+feed_default+')"></dt>');
            arr.push('<dd class="f_card_dd">');
            arr.push('<h3 class="intro_h3 title">' + data['title'] + '</h3>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('</div>');
            arr.push('<p class="card_zz_list_btn zz_downloadbtn"></p>'); 
            arr.push('</dd></dl></a></div>');          
            dom.innerHTML = arr.join('');
        },
        temp38: function (dom, data) {
            var arr=[];
            var $upscheme = data['scheme'].replace('://', '');
            arr.push('<a href="javascript:void(0);" class="j_appentrance" data-type="' + $upscheme + '" data-schemejc="' + data['namonitor']['scheme'] + '" data-newsid="" data-downloadurl="' + data['download'] + '" data-downloadjc="' + data['namonitor']['download'] + '">');
            arr.push('<div class="card_zz_list">');
            arr.push('<dl class="f_card clearfix">');
            arr.push('<dt class="j_art_lazy f_card_dt" data-src="'+data['img']['u']+'" data-lazy-type="img_bg" style="background-image:url('+feed_default+')"></dt>');
            arr.push('<dd class="f_card_dd">');
            arr.push('<h3 class="intro_h3 title">' + data['title'] + '</h3>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('</div>');
            arr.push('<p class="card_zz_list_btn zz_openbtn"></p></dd></dl></div></a>');
            if (!window.apiCallbackFunction) {
                var script = document.createElement('script');
                script.src = ismjsHTTPS+'/wap/public/generalize/appentrance/201504141720/callup.min.js';
                document.getElementsByTagName("body")[0].appendChild(script);
            }
            dom.innerHTML = arr.join('');
        },
        temp40: function (dom, data) {
            var arr=[];
            arr.push('<dl class="f_card clearfix gifImg">');
            arr.push('<a href="' + data['url'] + '"><h3 class="carditems_list_h3 intro_h3 title">'+ data['title'] +'</h3></a>');
            arr.push('<dd class="f_card_pic carditems_list_dd">');
            arr.push('<p class=" carditems_gifImg">');
            arr.push('<img class="j_art_lazy" src="'+lazyLoadImgConfig.lz2X1+'" data-src="'+data['images'][0]['u']+'" alt="' + data['title'] + '">');
            arr.push('<span class="s_gifImg">点击查看动图</span><span class="gif_loading_wrap hide"><span class="gif_loading">|&nbsp;|</span><i>加载中</i></span></p>');
            arr.push('<p class="carditems_gifImg hide"><img class="carditems_gifImg_img j_art_lazy" src="'+lazyLoadImgConfig.lz2X1+'" data-src="'+data['images'][1]['u']+'" alt="' + data['title'] + '"></p>');
            arr.push('</dd>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('<p class="f_card_p_ad">' + data['weibourl'] + '</p>');
            arr.push('</div></dl>');
            dom.innerHTML = arr.join('');
        },
        temp42: function (dom, data) {           
            var arr=[];
            arr.push('<dl class="clearfix f_card bc_color">');
            arr.push('<dd class="f_card_dd"  data-videojc="'+data['play']+'">');
            arr.push('<a href="' + data['url'] + '"><h3 class="f_card_h3 ellipsis title">' + data['title'] + '</h3></a>');
            arr.push('<p class="f_card_pic posi_rel">');
            arr.push('<a href="javascript:;" class="vedioWrap"><img class="j_art_lazy" src="'+lazyLoadImgConfig.lz2X1+'" data-src="' + data['img']['u'] + '" alt="' + data['title'] + '"></a>');
            arr.push('<span class="vedioBtn">'); 
            arr.push('<img src="'+prtl+prtln+'.sinaimg.cn/default/d1c9d4ed/20151217/veido_play.png" style="width:60px;height:60px"/>');
            if(isUC || isQQ || isBaidu || is360){

            }
            else{
                arr.push('<span class="video_des">点击全屏播放</span>');        
            }  
            arr.push('</span>');
            arr.push('<a href="' + data['url'] + '"><span  class="video_info">点击查看详情<i class="icon_op"></i></span></a>');              
            arr.push('</p><p class="f_card_pic_ad hide" vid="'+data['vid']+'" id="vid'+data['vid']+'">');
            arr.push('</p>');
            arr.push('<div class="mark_count">');
            arr.push('<mark class="recommend_btn recom_blue">广告</mark>');
            arr.push('</div></dd></dl>');
            dom.innerHTML = arr.join('');

            //var vid = 'vid'+data['vid'];
            this.vid.push('vid'+data['vid']);
            var ajaxUrl = prtl+"interface.sina.cn/video/wap/videoinfo.d.json?"+"vid="+data['vid'];
            
            jsonpLele({
                timeout:10000,
                error : function(e){
                    console.log("error: "+e);
                },
                success : function(data){
                    if(data.data.baseUrl === '' || data.data == ""){
                        console.log("没有视频数据");
                    }else{
                        url = data.data.baseUrl;
                        var tar_wrap = document.querySelector('#'+proxy_column_feed.vid[proxy_column_feed.vid.length-1]);
                        tar_wrap.innerHTML = '<video src="'+url+'" controls="controls" preload="none"></video>';  
                        $(window).trigger('loadedVideo');   
                    }
                             
                },
                url:ajaxUrl,
                callback : 'callback',
                data : {}
            });
            
        }
    };
    
    
    var storage =  {
        set: function (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function (key) {
            return JSON.parse(localStorage.getItem(key));
        }
    }
    
    function jsonpLele(json) {//跨域请求函数
        json.data = json.data || {};
        json.timeout = json.timeout || 0;
        json.callback = json.callback || 'jsoncallback';
          //jsonp
        var fnName = 'jsonp_' + Math.random();
        fnName = fnName.replace('.', '');

        window[fnName] = function(result) {
            clearTimeout(jsonp_timer);
            json.success && json.success(result);
            json.complete && json.complete();

            oHead.removeChild(oS);
            window[fnName] = null;

            
        };

        json.data[json.callback] = fnName;

        var arr = [];
        for (var i in json.data) {
            arr.push(i + '=' + encodeURIComponent(json.data[i]));
        }
        var sData = '&' + arr.join('&');
        var oS = document.createElement('script');
        oS.src = json.url + sData;
        var oHead = document.getElementsByTagName('head')[0];
        oHead.appendChild(oS);
        if (json.timeout) {
            var jsonp_timer = setTimeout(function() {
              
                json.error && json.error();
                json.complete && json.complete();
                oHead.removeChild(oS);
                window[fnName] = null;
            },
            json.timeout);

        }
    }

    function listenV(videoDom){
       //console.log(proxy_column_feed.vid);
        var i = 0,
            count = 0,
            len = proxy_column_feed.vid.length,
            wrapRel = document.getElementsByClassName("j_article_relevent")[0];
        if(typeof wrapRel != "undefined"){
            var  video = wrapRel.getElementsByTagName('video');
            if(typeof video != "undefined" && video.length>0 ){
                for(;i<len;i++){
                    video[i].addEventListener("play",function(){
                        sendVideoPv(this);
                        //console.log(111);
                    });
                    video[i] .addEventListener("pause",function(){//暂停时，回到初始状态：“点击详情显示”
                        this.parentNode.previousSibling.className = "f_card_pic posi_rel";
                        this.parentNode.className = "f_card_pic_ad hide";
                        //console.log(222);
                    });
                }
            }
            else{
                
                $(window).on('loadedVideo',function(){
                    listenV();
                });
            }
        }
           
        
    } 
    function sendVideoPv(videoDom){
        if(videoDom.readyState !== 1){
            var src = $(videoDom).parents(".f_card_dd").data("videojc");
            feedPush.sendPv(src);
        }   
    }

    
    function saxWordsline(){
        var r = Math.random();
        //script标签的内容
        var str001 = prtl+'zzy.mipujia.com/ry3a1ece92f2c2f331db046a92f0b03ae645f7d70d3aac32ed12.js?r='+r;//01
        var str002 = prtl+'new1.200218.com/gq3a1ecf91f3cbf63edb10759cf3b065bf05b08c5c75e13eef.js?r='+r;//02
        var str003 = prtl+'wxccpf1.star-media.cn/kf3a1ecf99ffc2ff38db096888a2ee31bd1bf1c90529af3ce71b382599abe6.js?r='+r;//03
        var str004 = prtl+'new1.200218.com/gl3a1ecf95f5c3ff3edb10759cf3b065bf05b08c5c75e13eef.js?r='+r;//04
        var str005 = prtl+'zzy.mipujia.com/xf3a1ece92f2c2f23ddb046a92f0b03ae645f7d70d3aac32ed12.js?r='+r;//05
        var str006 = 'https://d6.mobaders.com/s/f/5858e374738b10cbc4ba6cbf?r='+r;//06
        //img标签的内容
        var pv01 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzMg%3D%3D';
        var pv02 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzMw%3D%3D';
        var pv03 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzNA%3D%3D';
        var pv04 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzNQ%3D%3D';
        var pv05 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzNg%3D%3D';
        var pv06 = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNDAzNw%3D%3D';
        //对应给每一个data-id的里面创建一个div来放置动态创建的script标签和img标签
        $('[data-id=PDPS000000059757]')[0].innerHTML='<div id="ry3a1ece92f2c2f331db046a92f0b03ae645f7d70d3aac32ed12"></div>';//01
        $('[data-id=PDPS000000059758]')[0].innerHTML='<div id="gq3a1ecf91f3cbf63edb10759cf3b065bf05b08c5c75e13eef"></div>';//02
        $('[data-id=PDPS000000059759]')[0].innerHTML='<div id="kf3a1ecf99ffc2ff38db096888a2ee31bd1bf1c90529af3ce71b382599abe6"></div>';//03
        $('[data-id=PDPS000000059760]')[0].innerHTML='<div id="gl3a1ecf95f5c3ff3edb10759cf3b065bf05b08c5c75e13eef"></div>';//04
        $('[data-id=PDPS000000059761]')[0].innerHTML='<div id="xf3a1ece92f2c2f23ddb046a92f0b03ae645f7d70d3aac32ed12"></div>';//05
        $('[data-id=PDPS000000059762]')[0].innerHTML='<div id="ad_210101" style="padding-top:10px"><div></div></div>';//06
        //动态的创建script标签和img标签
        feedPush.createWordsScript($('[data-id=PDPS000000059757]')[0],'',pv01,undefined);
        feedPush.createWordsScript($('[data-id=PDPS000000059757]')[0],'',undefined,str001);
        
        feedPush.createWordsScript($('[data-id=PDPS000000059758]')[0],'',pv02,undefined);
        feedPush.createWordsScript($('[data-id=PDPS000000059758]')[0],'',undefined,str002);

        feedPush.createWordsScript($('[data-id=PDPS000000059760]')[0],'',pv04,undefined);
        feedPush.createWordsScript($('[data-id=PDPS000000059760]')[0],'',undefined,str004);

        feedPush.createWordsScript($('[data-id=PDPS000000059761]')[0],'',pv05,undefined);
        feedPush.createWordsScript($('[data-id=PDPS000000059761]')[0],'',undefined,str005);

        var _date=new Date;
        var _month=_date.getMonth()+1;
        var _day = _date.getDate();
        var _hour = _date.getHours();
        if(  _month >= 3){

            feedPush.createWordsScript($('[data-id=PDPS000000059762]')[0],'',pv06,undefined);
            feedPush.createWordsScript($('[data-id=PDPS000000059762]')[0],'',undefined,str006);

            feedPush.createWordsScript($('[data-id=PDPS000000059759]')[0],'',pv03,undefined);
            feedPush.createWordsScript($('[data-id=PDPS000000059759]')[0],'',undefined,str003);
        }


        
    }
    function motuFun(){
        var tar = document.body;
        feedPush.createWordsScript(tar,'',undefined,prtl+'libs.baidu.com/jquery/1.9.1/jquery.min.js',false);
        
        feedPush.createWordsScript(tar,'',undefined,prtl+'115.28.73.13:8080/turn/turn.js',false);
        
    }
    
    
   sinaSax.bind('triggerDomIimit',function (dom){
        dom.style.maxHeight="90px";
        //dom.style.width= document.body.clientWidth-40 +"px";
        dom.style.overflow = "hidden";
    });


    feedPush.init();
    if($(".j_sax").length != 0 ){
        var sina_lmt_pdps = $('.j_lmt_w')[0].getAttribute('data-id');
        if(window.location.host.indexOf('top') ==  -1 ){
            
            window.onload = function(){
                //motuFun();
                saxWordsline();
            }
        }
    }
    listenV();
    feedPush.bindEvent();
    //wordslineIlimit();
    sinaSax.bind('proxy', function (dom, data) {
        switch (parseInt(data['templateid'])) {
            case 31:
                proxy_column_feed.temp31(dom, data);
                break;
            case 32:
                proxy_column_feed.temp32(dom, data);
                break;
            case 33:
                proxy_column_feed.temp33(dom, data);
                break;
            case 34:
                proxy_column_feed.temp34(dom, data);
                break;
            case 35:
                proxy_column_feed.temp35(dom, data);
                break;
            case 36:
                proxy_column_feed.temp36(dom, data);
                break;
            case 37:
                proxy_column_feed.temp37(dom, data);
                break;
            case 38:
                proxy_column_feed.temp38(dom, data);
                break;
            case 40:
                proxy_column_feed.temp40(dom, data);
                break;
            case 42:
                proxy_column_feed.temp42(dom, data);
                break;
            default :
                break;
        }
        
        feedPush.insertCardPush(dom);
        if(window["kandianPushs"]){
            sina && sina.fireEvent('addLazyNode', ['relevent',dom]);//触发正文懒加载
        }else{
            sina && sina.fireEvent('addLazyNode', []);//触发正文懒加载
        }
    });
    sinaSax.bind('insertSucc',function(dom){
        switch(dom.getAttribute('data-id')){
            case sina_lmt_pdps :
                feedPush.insertAnimation();  
                break;

            default:
                break;
        }
    });
    sinaSax.bind('nullData', function (dom) {
        // console.log(dom);
        if(dom.getAttribute('data-id') ==='PDPS000000059890' && $(".j_sax").length != 0 && window.location.host.indexOf('top') ==  -1){
            var r = Math.random();
            var _date=new Date;
            var _month=_date.getMonth()+1;
            var _day = _date.getDate();
            var _hour = _date.getHours();
            if(  _month == 3 && (_day >= 16 && _day <= 29)){
                var _src = prtl+'yun.duiba.com.cn/static/jssdk/media-2.2.0.min.js?r='+r;
                var _saxpv = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxNTIxOA%3D%3D';
                
                feedPush.createWordsScript($('[data-spec=hot-pic-tb]')[0],'',_saxpv,undefined);
                feedPush.createWordsScript($('[data-spec=hot-pic-tb]')[0],'',undefined,_src);
                //<script src="//yun.duiba.com.cn/static/jssdk/media-2.1.0.min.js"></script>
                //feedPush.createWordsScript($('[data-spec=hot-pic-tb]')[0],'',pv06,undefined);  
                setTimeout(function(){
                    TuiaMedia({
                      container:'[data-spec=hot-pic-tb]',//需要将广告放入的位置,写法和JQuery一样
                      app_key:'uZvDRUfe1CQBu1XnmQL1JHfLo1v',//媒体app_key
                      adslot_id:'558',//广告位ID
                      success:function(res){
                        //广告成功加载后的回调方法
                        console.log(res)
                      }
                    })    
                },2000);
                       
            }
            else{
                var _src = prtl+'d1.sina.com.cn/xingyue1/liuxingyue/ali3/mm_15890324_8176878_30034679.js?uuid=wap_article_cutpic&r='+r;//
                var _saxpv = prtl+'sax.sina.com.cn/view?type=nonstd&t=REowMDAxMDE2MQ%3D%3D';
                $('[data-spec=hot-pic-tb]')[0].innerHTML='<a style="display:none!important" id="tanx-a-mm_15890324_8176878_30034679"></a>';
                feedPush.createWordsScript($('[data-spec=hot-pic-tb]')[0],'',_saxpv,undefined);
                feedPush.createWordsScript($('[data-spec=hot-pic-tb]')[0],'',undefined,_src);//创建script
            }
            $('[data-spec=hot-pic-tb]').css('max-height',$('[data-spec=hot-pic-jd]').height());
        }
    });
    sinaSax.bind("error", function (e) {
        //console.log(e,"E")
    });
    sinaSax.bind('ajaxMoreLoadSax',function(e){   //sinaSax.callback('ajaxMoreLoadSax');
        feedPush.push();//异步请求符合条件的广告数据
    });
})();

 