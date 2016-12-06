/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//用户管理》用户管理》笔试成绩查询

'use strict';
App.controller('ExaminationResultsController', function($scope, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
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

    //重置
    $scope.reset = function () {
        $scope.data = {};
        $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
        $scope.toPageNum = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    }
   
    //获取项目
    restful.fetch("/item/getItemListInfo").then(function (res) {
        $scope.projects = res.data;
    });
    //获取段位
    restful.fetch("/common/getExamInfo").then(function (res) {
        $scope.levels = res.data;
    });
    $scope.result = $rootScope.RESULT_CONFIG;

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
        $scope.beginDatepickerOptions.maxDate = moment($scope.data.examEndtime*1000).subtract(1, "days");
    }

    //加载
    $scope.query = function () {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition:$scope.data
        };
        console.info(params)
        $scope.ExaminationResultPromise = restful.fetch("/examscore/getExamScoreInfo", "POST", params).then(function (res) {
            if (res.success) {
                console.info(res)
                $scope.ExaminationResults = res.data.rows;
                $scope.ExaminationResultCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.query();
});