/*
 * @Author: 唐文雍
 * @Date:   2016-05-09 20:52:27
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-07 15:56:26
 */

'use strict';
App.controller('SideNavController', function($scope, Session, msgBus) {

    $scope.init = function(){
        $scope.refuseRoute = Session.$storage.refuseRoute;
    };
    $scope.init();
    $scope.show = function(route){
        return $scope.refuseRoute.indexOf(route)==-1;
    };
    msgBus.onMsg('login', $scope, function() {
        $scope.init();
    });
});
