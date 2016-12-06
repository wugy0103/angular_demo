/*
 * @Author: 唐文雍
 * @Date:   2016-05-09 21:17:22
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-07 16:21:53
 */

'use strict';
App.controller('HeaderController', function($scope, $state, restful, Session, msgBus) {

    msgBus.onMsg('login', $scope, function() {
        $scope.init();
    });
    $scope.init = function(){
        $scope.userName = Session.$storage.userName;
    };
    $scope.init();
    $scope.logout = function() {
        restful.fetch("/userInfo/logout","POST").then(function(res) {
            if(res.status == 1){
                $state.go('login');
            }
        }, function(rej) {
            console.info(rej);
        });
    };
});
