/*
 * @Author: 唐文雍
 * @Date:   2016-07-12 16:36:37
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-12 18:59:20
 */
//题库管理》选择题题库

'use strict';
App.controller('ProjectController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();
    //加载
    $scope.query = function() {
        $scope.progressbar.start();
        $scope.ProjectPromise = restful.fetch("/item/getItemListInfo", "GET").then(function(res) {
            console.log(res)
            if (res.success) {
                $scope.Projects = res.data;
                $scope.ProjectCount = res.count;
            }
            $scope.progressbar.complete();
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.query();
    $scope.add = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'AddProject.html',
            controller: 'AddProjectController',
        });
        modalInstance.result.then(function() {
            //close
            $scope.query();
        }, function() {
            //dismissed
            $scope.query();
        })
    }
    $scope.update = function(project) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateProject.html',
            controller: 'UpdateProjectController',
            resolve: {
                project: function() {
                    return project;
                }
            },
        });
        modalInstance.result.then(function() {
            //close
            $scope.query();
        }, function() {
            //dismissed
            $scope.query();
        })
    }
    //删除
    $scope.remove = function(id) {
        restful.fetch("/item/remove", "GET", {
            id: id
        }).then(function(res) {
            if (res.success) {
                $scope.query();
            }
        });
    };
});
//添加
App.controller("AddProjectController", function($scope, $uibModalInstance, restful) {
    $scope.data = {};
    $scope.save = function() {
        restful.fetch("/item/add", "POST", $scope.data).then(function(res) {
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg;
            }
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.close = function() {
        $uibModalInstance.dismiss('close');
    };
});
//修改
App.controller("UpdateProjectController", function($scope, $uibModalInstance, project, restful) {
    $scope.data = angular.copy(project);
    $scope.save = function() {
        restful.fetch("/item/update", "POST", $scope.data).then(function(res) {
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg;
            }
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.close = function() {
        $uibModalInstance.dismiss('close');
    };
});
