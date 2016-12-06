/*
 * @Author: 唐文雍
 * @Date:   2016-05-04 17:26:02
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-07 16:21:23
 */

'use strict';
App.controller('UserLoginController', function($scope, $rootScope, $state, AuthService, Session, msgBus, $http, restful,$interval) {
    //初始时将之前登录过的信息清空
    $scope.load = function() {
        Session.destroy();
      //判断是否需要通过短信验证码登录
      restful.fetch("userInfo/trueOrFalse","get").then(function (data) {
      	
        $scope.credentials.msgflag =!!data.msg;
          
      });
    };
    $scope.credentials = {
        username: '',
        pwd: '',
        phone: '',
        code: '',
        msgflag:''
    };
    $scope.error = "";

    // 获取验证码

    $scope.getCode = function($event) {
    	
	        var $ = angular.element;
	        var $btn = $('#verify');
	        if ($btn.hasClass('disabled')) {
	            return false;
	        };
	        $btn.html('正在发送中...').addClass('disabled');
	        restful.fetch("userInfo/loginForMobCode", "POST", $scope.credentials)
	            .then(function(data) {
	               if (data.success) {
	                    var time = 60;
	                    $btn.html('发送成功');
	                    $scope.error = "";
	                    $scope.credentials.phone = data.phone;
	                    var timer = $interval(function() {
	                        time--;
	                        $btn.html(time + '秒再次获取');
	                        if (time <= 0) {
	                            $interval.cancel(timer);
	                            $btn.html('获取验证码').removeClass('disabled');
	                        }
	
	                    }, 1000);
	                    return;
	                }else{
	                	 $btn.html('获取验证码').removeClass('disabled');
						 $scope.error = data.msg || "超时或获取验证码失败";
	                }
	              
	            });
    
    	};

     //获取验证码--end
    $scope.login = function(credentials) {
    	
    	console.log(credentials);
        $scope.loginPromise = AuthService.login(credentials).then(function(data) {
            if (!!data.userName) {
                msgBus.emitMsg("login");
                $state.go('dashboard');
            } else {
                $scope.error = data.msg || "超时或验证码错误";
            }
        });

    };


});

