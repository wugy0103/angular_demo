/*
 * @Author: 唐文雍
 * @Date:   2016-07-12 16:36:37
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-12 18:59:20
 */
//用户管理》已注册用户

'use strict';
App.controller('RegisteredUsersController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory, AreaSelector) {
    $scope.progressbar = ngProgressFactory.createInstance();

    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas){
        //获取省份
        $scope.provinces = areas;
    });
    $scope.initCity = function (province) {
        if(!province){
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri,province.city_code).then(function (res) {
            //获取城市
            $scope.cities = res;
        });
    }
    restful.fetch("/common/getSchoolType", "GET").then(function(res) {
        if (res.success) {
            $scope.schoolType = res.data;
        }
    });

    $scope.data = {};
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function() {
        $scope.query();
    };
    $scope.setPage = function() {
        $scope.PageIndex = $scope.toPageNum;
        $scope.query();
    };

    //重置
    $scope.reset = function() {
        $scope.data = {};
        $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
        $scope.toPageNum = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    }
    $scope.export = function () {
        $scope.query();
    };

    //加载
    $scope.query = function() {
        $scope.progressbar.start();//进度条
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition: $scope.data
        };
        console.info(params)
        $scope.RegisteredUserPromise = restful.fetch("/userInfo/getUserInfo", "POST", params).then(function(res) {
            console.log(res)
            if (res.success) {
                $scope.RegisteredUsers = res.data.rows;
                $scope.RegisteredUserCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.query();

    //弹窗显示用户信息
    $scope.detail = function(userInfo) {
        var modalInstance = $uibModal.open({
            templateUrl: 'RegisteredUserDetail.html',
            controller: 'RegisteredUserDetailController',
            size: 'md',
            resolve: {
                userInfo: function() {
                    return userInfo;
                }
            },
        });
        modalInstance.result.then(function() {
            //close
            //$scope.query();
        }, function() {
            //dismissed
            //$scope.query();
        })
    }
});

App.controller("RegisteredUserDetailController", function($scope, $uibModalInstance, restful, userInfo) {
    //获取用户的信息
    $scope.userInfo = userInfo;
    console.info($scope.userInfo)
    var params = {
        id: $scope.userInfo.user_id
    };
    restful.fetch("/userInfo/getUserInfoById", "GET", params).then(function(res) {
        console.info(res)
        if (res.success) {
            $scope.projectAndLevel = res.data;
        }
    });

    $scope.close = function() {
        $uibModalInstance.dismiss('close');
    };
});
