/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//题库管理》选择题题库

'use strict';
App.controller('EvaluationResultsController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();

    $scope.data = {};
    //分页
    $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    $scope.PageSize = $rootScope.PAGINATION_CONFIG.PAGESIZE;
    $scope.maxSize = $rootScope.PAGINATION_CONFIG.MAXSIZE;
    $scope.pageChanged = function () {
        $scope.query();
    };
    $scope.setPage = function () {
        $scope.PageIndex = $scope.toPageNum;
        $scope.query();
    };

    //获取项目
    restful.fetch("/item/getItemListInfo").then(function (res) {
        $scope.projects = res.data;
    });
    //获取段位
    restful.fetch("/common/getExamInfo").then(function (res) {
        $scope.levels = res.data;
    });
    $scope.promotion = $rootScope.PROMOTION_CONFIG;
    
    $scope.beginDatepickerOptions = {
        showWeeks: false
    };
    $scope.endDatepickerOptions = {
        showWeeks: false
    };
    $scope.openBegintime = function () {
        $scope.BegintimeOpened.opened = true;
    };
    $scope.openEndtime = function () {
        $scope.EndtimeOpened.opened = true;
    };
    $scope.BegintimeOpened = {
        opened: false
    };
    $scope.EndtimeOpened = {
        opened: false
    };
    $scope.updateEndDate = function(){
        $scope.endDatepickerOptions.minDate = moment($scope.data.examBegintime*1000).add(1, "days");
    }
    $scope.updateBeginDate = function(){
        $scope.beginDatepickerOptions.maxDate = moment($scope.data.examEndtime*1000).subtract(1,"days");
    }

    //重置
    $scope.reset = function () {
        $scope.data = {};
        $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
        $scope.toPageNum = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    }

    //加载
    $scope.query = function () {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition:$scope.data
        };
        $scope.EvaluationResultPromise = restful.fetch("/techeval/getTechevalInfo", "POST", params).then(function (res) {
            console.log(res)
            if (res.success) {
                $scope.EvaluationResults = res.data.rows;
                $scope.EvaluationResultCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.query();

    $scope.update = function () {
        debugger
        console.info($scope.lineData);
        var modalInstance = $uibModal.open({
            templateUrl: 'Update.html',
            controller: 'UserInfoUpdateController',
            resolve: {
                userInfo: function () {
                    return $scope.UserInfo;
                }
            },
        });
        modalInstance.result.then(function () {
            //close
            $scope.query();
        }, function () {
            //dismissed
            $scope.query();
        })
    }
});

//修改
App.controller("UpdateEvaluationResultsController", function ($scope, $uibModalInstance, userInfo, restful) {
    debugger
    $scope.UserInfo = userInfo;
    $scope.save = function () {
        debugger
        var data = $scope.UserInfo;
        console.info(data);
        var params = {
            user_id:data.user_id,
            hm_u_pwd:data.hm_u_pwd  
        }
        restful.fetch("/userInfo/update", "POST", params).then(function (res) {
            console.info(res.data);
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg;
            }
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});
