/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   Marte
* @Last Modified time: 2016-09-08 21:33:24
*/
//题库管理》选择题题库

'use strict';
App.controller('ExaminationController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
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

    //加载
    $scope.query = function () {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition:$scope.data
        };
        $scope.ExaminationPromise = restful.fetch("/examsetting/getExamsettingListInfo", "GET", params).then(function (res) {
            if (res.success) {
                $scope.Examinations = res.data;
            }
            $scope.progressbar.complete();
        });
    };
    $scope.query();

    $scope.update = function(Examination) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateExamination.html',
            controller: 'UpdateExaminationController',
            resolve: {
                Examination: function () {
                    return Examination;
                }
            },
            size: 'lg'
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
App.controller("UpdateExaminationController", function ($scope, $uibModalInstance, Examination, restful) {
    $scope.Examination = angular.copy(Examination);
    $scope.Examination.enrollstart =$scope.Examination.es_enrollstart * 1000;
    $scope.Examination.enrollend =$scope.Examination.es_enrollend * 1000;
    $scope.Examination.examstart =$scope.Examination.es_examstart * 1000;
    $scope.Examination.examend =$scope.Examination.es_examend * 1000;
    $scope.onEnrollstartSeleted = function (newDate, oldDate) {
        $scope.Examination.enrollstart = new Date(newDate).getTime();
    }
    $scope.onEnrollendSeleted = function (newDate, oldDate) {
        $scope.Examination.enrollend = new Date(newDate).getTime();
    }
    $scope.onExamstartSeleted = function (newDate, oldDate) {
        $scope.Examination.examstart = new Date(newDate).getTime();
    }
    $scope.onExamendSeleted = function (newDate, oldDate) {
        $scope.Examination.examend = new Date(newDate).getTime();
    }
    $scope.save = function () {
        $scope.Examination.es_enrollstart =$scope.Examination.enrollstart / 1000;
        $scope.Examination.es_enrollend =$scope.Examination.enrollend / 1000;
        $scope.Examination.es_examstart =$scope.Examination.examstart / 1000;
        $scope.Examination.es_examend =$scope.Examination.examend / 1000;
        restful.fetch("/examsetting/update", "POST", $scope.Examination).then(function (res) {
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg.message;
            }
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
    $scope.valid = true;
    $scope.$watch('Examination', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            if ($scope.Examination.enrollstart>$scope.Examination.enrollend) {
                $scope.error = "报名开始时间必须小于报名结束时间";
                $scope.valid = false;
            }else if($scope.Examination.examstart>$scope.Examination.examend){
                $scope.error = "考试开始时间必须小于考试结束时间";
                $scope.valid = false;
            }else if($scope.Examination.examstart<$scope.Examination.enrollstart){
                $scope.error = "考试开始时间必须大于等于报名开始时间";
                $scope.valid = false;
            }else{
                $scope.error = "";
                $scope.valid = true;
            }
        }
    }, true);
});
