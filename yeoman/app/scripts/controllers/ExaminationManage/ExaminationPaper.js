/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//题库管理》选择题题库

'use strict';
App.controller('ExaminationPaperController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();
    $scope.data = {};
    //加载
    $scope.query = function () {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition:$scope.data
        };
        $scope.ExaminationPaperPromise = restful.fetch("/exampapersetting/getExampapersettingInfo", "GET", params).then(function (res) {
            if (res.success) {
                console.info(res);
                $scope.ExaminationPapers = res.data;
            }
            $scope.progressbar.complete();
        });
    };
    $scope.query();

    $scope.update = function(ExaminationPaper) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateExaminationPaper.html',
            controller: 'UpdateExaminationPaperController',
            resolve: {
                ExaminationPaper: function () {
                    return ExaminationPaper;
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
App.controller("UpdateExaminationPaperController", function ($scope, $uibModalInstance, ExaminationPaper, restful) {
    $scope.ExaminationPaper = angular.copy(ExaminationPaper);
    $scope.save = function () {
        console.info(JSON.stringify($scope.ExaminationPaper))
        restful.fetch("/exampapersetting/updateAll", "POST", [$scope.ExaminationPaper]).then(function (res) {
            console.info(res)
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
    $scope.getQuestionCount = function(){
        //题目总数
        $scope.ExaminationPaper.totalquestion = $scope.ExaminationPaper.pp_cqrequiredcount+
                                                $scope.ExaminationPaper.pp_cqcount+
                                                $scope.ExaminationPaper.pp_tfreqiuredcount+
                                                $scope.ExaminationPaper.pp_tfcount;
    };
    $scope.getQuestionCount();
    //总分
    $scope.ExaminationPaper.pp_totalscore = Math.round($scope.ExaminationPaper.totalquestion * $scope.ExaminationPaper.pp_score);
    $scope.$watch('ExaminationPaper', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.getQuestionCount();
            //每题分数
            $scope.ExaminationPaper.pp_score = ($scope.ExaminationPaper.pp_totalscore/$scope.ExaminationPaper.totalquestion).toFixed(2);
        }
    }, true);
});
