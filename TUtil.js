/*
* @Author: wyt
* @Date:   2018-07-17 17:09:13
 * @Last Modified by: wyt
 * @Last Modified time: 2018-07-27 16:02:26
*/
var TUtil = (function () {

    function _mergeObj (defaultObj, obj) {
        for (var key in defaultObj) {
            if (!obj[key]) {
                obj[key] = defaultObj[key];
            }
        }
        return defaultObj;
    }

	function _setCursorPosition (elem, index) {
        var val = elem.value;
        var len = val.length;
        // 超过文本长度直接返回
        if (len < index) return;
        setTimeout(function() {
            elem.focus();
            if (elem.setSelectionRange) { // 标准浏览器
                elem.setSelectionRange(index, index)  ; 
            } else { // IE9-
                var range = elem.createTextRange();
                range.moveStart("character", -len);
                range.moveEnd("character", -len);
                range.moveStart("character", index);
                range.moveEnd("character", 0);
                range.select();
            }
        }, 10);
    }

    function _formatTime (seconds) {
        var day = parseInt(seconds / 60 / 60 / 24);
        var hour = parseInt(seconds / 60 / 60 % 24);
        var minutes = parseInt(seconds / 60 % 60);
        var sec = parseInt(seconds % 60);
        var dayFlag = false;
        var hourFlag = false;
        var minutesFlag = false;
        var secFlag = false;
        dayFlag = day === 0?false:true;
        hourFlag = hour === 0?false:true;
        minutesFlag = minutes === 0?false:true;
        secFlag = sec === 0?false:true;
        function getDayRes () {
            return dayFlag?(day >= 10 ? day + "天": '0' + day + "天"):"";
        }
        function getHourRes () {
            return hourFlag?(hour >= 10 ? hour + "时": '0' + hour + "时"):"";
        }
        function getMinRes () {
            return minutesFlag?(minutes >= 10 ? minutes + "分": '0' + minutes + "分"):"";
        }
        function getSecRes () {
            return secFlag?(sec >= 10 ? sec + "秒": '0' + sec + "秒"):"";
        }
        return  getDayRes() + getHourRes() + getMinRes() + getSecRes();
    }

    function _setTopFixPos (targetDomSelector, triggerFn, backFn) {
        /*
             triggerFn： 触发后的回调函数
             backFn： 返回触发前状态的回调函数
        */
        if(typeof triggerFn!=='function' || typeof backFn!=='function'){
            throw "the type of parameter is wrong !";
        }
        var oTarget = document.querySelector(targetDomSelector);
        var targetOffTop = oTarget.offsetTop;
        window.addEventListener("scroll", function () {
            var targetScrollTop = document.documentElement.scrollTop;
            if(targetScrollTop>=targetOffTop){
                triggerFn();
            }else{
                backFn();
            }
        });
    }

    function _setBottomFixPos (targetDomSelector, triggerFn, backFn) {
        /*
             triggerFn： 触发后的回调函数
             backFn： 返回触发前状态的回调函数
        */
        if(typeof triggerFn!=='function' || typeof backFn!=='function'){
            throw "the type of parameter is wrong !";
        }
        var oTarget = document.querySelector(targetDomSelector);
        var offTop = oTarget.offsetTop;
        var domH = oTarget.offsetHeight;
        var docH = document.documentElement.clientHeight;
        window.addEventListener("scroll", function () {
            var scrollH = document.documentElement.scrollTop;
            if (offTop > docH + scrollH + domH) {
                triggerFn();
            }else{
                backFn();
            }
        });
        
    }

    function EventClass () {
        this.evList = {};
        this.listen = function (type, fn) {
            if (typeof fn !== 'function') return;
            if (!this.evList[type]){
                this.evList[type] = [];
            }
            this.evList[type].push(fn);
        };
        this.trigger = function (type, data, fn) {
            var fns = this.evList[type];
            if (!fns) throw "error: there is no such event name.";
            fns.forEach(function(item, index){
                if (!fn) {
                    fns[index](data);    
                }else{
                    if (item === fn) {
                        fns[index](data); 
                    }
                }
                    
            });
        };
        this.remove = function (type, fn) {
            var fns = this.evList[type];
            if (!fns) {
                throw "error: there is no such event name.";
            }
            if (!fn) {
                fns.length = 0;
            }else{
                fns.forEach(function(item, i){
                    if (item === fn) {
                        fns.splice(i, 1);
                    }
                });
            }
        };
    }

    function _countTime (objConfig) {
        var defaultConfig = {
            secTime: 60,
            afterSecondFn: function () {
                console.log('one seconds passed...');
            },
            timeoutFn: function () {
                console.log('time out.');
            }
        };
        objConfig = objConfig || {};
        _mergeObj(defaultConfig, objConfig);
        var hou, min, sec;
        var timer = setInterval(function(){
            if (objConfig.secTime===0) {
                clearInterval(timer);
                objConfig.timeoutFn();
                return;
            }
            objConfig.secTime -= 1;
            hou = parseInt(objConfig.secTime / 3600);
            min = parseInt(objConfig.secTime / 60) % 60;
            sec = objConfig.secTime % 60;
            objConfig.afterSecondFn(hou, min, sec);
        }, 1000);
        
    }
	function _typeof (val) {
		return Object.prototype.toString.call(val).match(/(?<=\s)(\w+)(?=])/g)[0]
	}

	return {
        EventClass: EventClass,   // 带有数据通信的自定义事件类
		_setCursorPosition: _setCursorPosition,      // 设置输入框光标位置
        _formatTime: _formatTime,     // 将秒转换成对应格式的时间
        _setTopFixPos: _setTopFixPos, // 设置顶部的位置固定
        _setBottomFixPos: _setBottomFixPos,  // 设置底部的位置固定
        _countTime: _countTime,
	_typeof // 判断数据类型 
	};
})();
