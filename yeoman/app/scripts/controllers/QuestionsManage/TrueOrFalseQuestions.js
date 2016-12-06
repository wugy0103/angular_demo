/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//题库管理》判断题题库

'use strict';
App.controller('TrueOrFalseQuestionsController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
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

    $scope.question = $rootScope.QUESTION_CONFIG;
    //重置
    $scope.reset = function () {
        $scope.data = {};
        $scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
        $scope.toPageNum = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
    }

    //全选
    $scope.toggleAll = function() {
        var toggleStatus = $scope.isAllSelected;
        angular.forEach($scope.TrueOrFalseQuestions, function(item){
            item.selected = toggleStatus;
        });
    }
    //单选
    $scope.optionToggled = function(){
        $scope.isAllSelected = $scope.TrueOrFalseQuestions.every(function(item){
            return item.selected;
        })
    }

    //加载
    $scope.query = function () {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition:$scope.data
        };
        $scope.TrueOrFalseQuestionPromise = restful.fetch("/trueorfalsequestion/getTrueOrFalseQuestionInfo", "POST", params).then(function (res) {
            console.log(res)
            if (res.success) {
                $scope.TrueOrFalseQuestions = res.data.rows;
                $scope.TrueOrFalseQuestionCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.query();

    //添加
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'AddTrueOrFalseQuestion.html',
            controller: 'AddTrueOrFalseQuestionController',
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
    //编辑
    $scope.update = function (TrueOrFalseQuestion) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateTrueOrFalseQuestion.html',
            controller: 'UpdateTrueOrFalseQuestionController',
            resolve: {
                TrueOrFalseQuestion: function () {
                    return TrueOrFalseQuestion;
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
    //导入
    $scope.import = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'ImportTrueOrFalseQuestion.html',
            controller: 'ImportTrueOrFalseQuestionController'
        });
        modalInstance.result.then(function () {
            //close
            $scope.query();
        }, function () {
            //dismissed
            $scope.query();
        })
    }
    //删除
    $scope.remove = function () {
        var data = [];
        angular.forEach($scope.TrueOrFalseQuestions, function(item){
            if(item.selected){
                data.push(item.tf_id);
            }
        });
        restful.fetch("/trueorfalsequestion/remove", "POST", {id:data}).then(function (res) {
            if (res.success) {
                $scope.isAllSelected = false;
                $scope.query();
            } else {
                $scope.error = res.msg.message;
            }
        });
    }
});

//添加
App.controller("AddTrueOrFalseQuestionController", function ($scope, $uibModalInstance, restful) {
    $scope.data = {};
    $scope.save = function () {
        console.info($scope.data)
        restful.fetch("/trueorfalsequestion/add", "POST", $scope.data).then(function (res) {
            console.info(res);
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
});

//修改
App.controller("UpdateTrueOrFalseQuestionController", function ($scope, $uibModalInstance, TrueOrFalseQuestion, restful) {
    $scope.TrueOrFalseQuestion = angular.copy(TrueOrFalseQuestion);
    console.info($scope.TrueOrFalseQuestion)
    $scope.save = function () {
        restful.fetch("/trueorfalsequestion/update", "POST", $scope.TrueOrFalseQuestion).then(function (res) {
            console.info(res);
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg.message;
            }
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});

//导入
App.controller("ImportTrueOrFalseQuestionController", function ($scope, $rootScope, $uibModalInstance, restful, toastr) {
    $scope.TrueOrFalseQuestionExcel = "/excel/TrueOrFalseQuestion.xlsx";
    $scope.data = {};
    $scope.uploadComplete = function(res) {
        console.info(res)
        if(res.status){
            $scope.data.fileName = res.msg;
            $scope.message = "上传成功";
            $scope.error = "";
        }else{
            $scope.error = res.msg;
        }
    };
    $scope.save = function () {
        restful.fetch("/trueorfalsequestion/excelImport", "POST", $scope.data).then(function (res) {
            if (res.success) {
                toastr.success('导入成功！', 'Success');
                $uibModalInstance.dismiss('success');
            } else {
                toastr.error(res.msg, 'Error');
                $scope.error = res.msg;
                $scope.message = "";
            }
        });
    };
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});