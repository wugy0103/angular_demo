/*
 * @Author: 唐文雍
 * @Date:   2016-04-27 18:27:43
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-01 17:22:16
 * 站点常量配置
 */

'use strict';

App.run(function($rootScope) {
    //服务器地址
    //$rootScope.BASEURL = "http://183.3.138.130:8089/";
    $rootScope.BASEURL = "http://img.healthmall.tv";

    //图片服务器地址
    $rootScope.PHOTOS = "http://img.healthmall.me/photos/";

    //分页配置
    $rootScope.PAGINATION_CONFIG = {
        PAGEINDEX: "1", //默认当前页数
        PAGESIZE: "20", //每页显示多少条
        MAXSIZE: "10" //最多显示的分页按钮数
    };

    //订单状态：-1 退款成功、 0 前往支付、1 报名成功、2 已取消
    $rootScope.ORDER_CONFIG = [{
        STATUS: -1,
        NAME: "退款成功"
    }, {
        STATUS: 0,
        NAME: "前往支付"
    }, {
        STATUS: 1,
        NAME: "报名成功"
    }, {
        STATUS: 2,
        NAME: "已取消"
    }];

    //题型： 是否必选（1为必选，0为非必选）
    $rootScope.QUESTION_CONFIG = [{
        STATUS: 1,
        NAME: "必选"
    }, {
        STATUS: 0,
        NAME: "非必选"
    }];

    //晋段成绩： 是否合格（1为合格，0为不合格）
    $rootScope.RESULT_CONFIG = [{
        STATUS: 1,
        NAME: "合格"
    }, {
        STATUS: 0,
        NAME: "不合格"
    }];

    //晋段状态： 是否合格（1为合格，0为不合格）
    $rootScope.PROMOTION_CONFIG = [{
        STATUS: 1,
        NAME: "通过或降级通过"
    }, {
        STATUS: 0,
        NAME: "未通过"
    }];

    //正则验证
    $rootScope.PATTERN_CONFIG = {
        //手机号
        TEL: /^1\d{10}$/,
        //身份证号
        IDCARD: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
    }
});
