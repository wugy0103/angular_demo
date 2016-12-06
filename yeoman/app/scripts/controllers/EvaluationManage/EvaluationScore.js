/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//题库管理》选择题题库

'use strict';
App.controller('EvaluationScoreController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
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
        $scope.EvaluationScorePromise = restful.fetch("/techevaluationsetting/getTechevaluationSettingInfo", "GET", params).then(function (res) {
            console.log(res)
            if (res.success) {
                $scope.EvaluationScores = res.data;
            }
            $scope.progressbar.complete();
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.query();

    $scope.update = function (EvaluationScore) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateEvaluationScore.html',
            controller: 'UpdateEvaluationScoreController',
            resolve: {
                EvaluationScore: function () {
                    return EvaluationScore;
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
App.controller("UpdateEvaluationScoreController", function ($scope, $uibModalInstance, EvaluationScore, restful) {
    $scope.EvaluationScore = angular.copy(EvaluationScore);
    $scope.save = function () {
        console.info($scope.EvaluationScore)
        restful.fetch("/techevaluationsetting/update", "POST", $scope.EvaluationScore).then(function (res) {
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
