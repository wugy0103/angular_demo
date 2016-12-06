/*
 * @Author: 唐文雍
 * @Date:   2016-07-12 16:36:37
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-12 18:59:20
 */
//通知管理》

'use strict';
App.controller('NoticeController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
    $scope.progressbar = ngProgressFactory.createInstance();

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

    //加载
    $scope.query = function() {
        $scope.progressbar.start();
        var params = {
            PageIndex: parseInt($scope.PageIndex),
            PageSize: parseInt($scope.PageSize),
            condition: $scope.data
        };
        $scope.NoticePromise = restful.fetch("/announcement/getAnnouncementInfo", "POST", params).then(function(res) {
            console.log(res)
            if (res.success) {
                $scope.Notices = res.data.rows;
                $scope.NoticeCount = res.data.count;
            }
            $scope.progressbar.complete();
        });
    };
    $scope.query();

    //添加
    $scope.add = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'AddNotice.html',
                controller: 'NoticesAddController'
            });
            modalInstance.result.then(function() {
                //close
                $scope.query();
            }, function() {
                //dismissed
                $scope.query();
            })
        }
        //修改
    $scope.update = function(Notice) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateNotice.html',
            controller: 'NoticesUpdateController',
            resolve: {
                Notice: function() {
                    return Notice;
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
        restful.fetch("/announcement/remove", "POST", {
            id: [id]
        }).then(function(res) {
            if (res.success) {
                $scope.query();
            }
        });
    };
});

//添加
App.controller("NoticesAddController", function($scope, $rootScope, $uibModalInstance, toastr, $timeout, restful) {
    $scope.data = {};
    $scope.save = function() {
        restful.fetch("/announcement/add", "POST", $scope.data).then(function(res) {
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg.message;
            }
        });
    };
    $scope.close = function() {
        $uibModalInstance.dismiss('close');
    };
});

//修改
App.controller("NoticesUpdateController", function($scope, $uibModalInstance, Notice, restful) {
    $scope.Notice = angular.copy(Notice);
    $scope.save = function() {
        restful.fetch("/announcement/update", "POST", $scope.Notice).then(function(res) {
            if (res.success) {
                $uibModalInstance.dismiss('success');
            } else {
                $scope.error = res.msg;
            }
        });
    };
    $scope.close = function() {
        $uibModalInstance.dismiss('close');
    };
});
