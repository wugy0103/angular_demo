/*
* @Author: 唐文雍
* @Date:   2016-07-12 16:36:37
* @Last Modified by:   唐文雍
* @Last Modified time: 2016-07-12 18:59:20
*/
//题库管理》选择题题库

'use strict';
App.controller('EvaluationPointController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory, AreaSelector) {
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
        $scope.EvaluationPointPromise = restful.fetch("/evaluationlocation/getEvaluationLocationInfo", "POST", params).then(function (res) {
            console.log(res)
            if (res.success) {
                $scope.EvaluationPoints = res.data.rows;
                $scope.EvaluationPointCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function (rej) {
            console.info(rej);
        });
    };
    $scope.query();
    $scope.showClerk = function (EvaluationPointID) {
        var modalInstance = $uibModal.open({
            templateUrl: 'Clerks.html',
            controller: 'ClerkController',
            resolve: {
                EvaluationPointID: function () {
                    return EvaluationPointID;
                }
            },
        });
    }
    $scope.add = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'AddEvaluationPoint.html',
            controller: 'AddEvaluationPointController',
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
    $scope.update = function (EvaluationPoint) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateEvaluationPoint.html',
            controller: 'UpdateEvaluationPointController',
            resolve: {
                EvaluationPoint: function () {
                    return EvaluationPoint;
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
    //删除
    $scope.remove = function(id) {
        var params = {
            id: [id]
        };
        restful.fetch("/evaluationlocation/remove", "POST", params).then(function(res) {
            if (res.success) {
                $scope.query();
            }
        });
    };
    //导入
    $scope.import = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'ImportEvaluationPoint.html',
            controller: 'ImportEvaluationPointController'
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
//查看
App.controller("ClerkController", function ($scope, $uibModalInstance, EvaluationPointID, restful) {
    console.info(EvaluationPointID);
    restful.fetch("/evaluationlocation/getInfoByElid", "GET", {id:EvaluationPointID}).then(function (res) {
        console.info(res);
        if (res.success) {
            $scope.clerks = res.data[0].teachers;
        } else {
            $scope.error = res.msg.message;
        }
    });
    $scope.close = function () {
        $uibModalInstance.dismiss('close');
    };
});
//添加
App.controller("AddEvaluationPointController", function ($scope, $uibModalInstance, restful, AreaSelector) {
    $scope.EvaluationPoint = {};
    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas){
        //获取省份
        $scope.provinces = areas;
    });

    $scope.initCity = function (province) {
        if(!province){
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri,province.city_code).then(function (cities) {
            //获取城市
            $scope.cities = cities;
            $scope.EvaluationPoint.city_code = null;
            $scope.EvaluationPoint.school_code = null;
            $scope.schools = null;
            $scope.EvaluationPoint.school_type = null;
        });
        AreaSelector.getNameByCode(areaResourceUri, province.city_code).then(function(res) {
            $scope.provinceName = res;
        });
    }

    $scope.initSchool = function () {
        var params = {
            school_typeid: $scope.EvaluationPoint.school_type,
            city_code: $scope.EvaluationPoint.city_code
        }
        restful.fetch("/common/getSchoolByCity", "GET", params).then(function(res) {
            if (res.success) {
                $scope.schools = res.data;
                $scope.EvaluationPoint.school_code = null;
            }
        });
        AreaSelector.getNameByCode(areaResourceUri, $scope.EvaluationPoint.city_code).then(function(res) {
            $scope.cityName = res;
        });
    }
    restful.fetch("/common/getSchoolType", "GET").then(function(res) {
        if (res.success) {
            $scope.schoolType = res.data;
        }
    });
    $scope.save = function () {
        if($scope.provinceName&&$scope.cityName){
            $scope.EvaluationPoint.city_name = $scope.provinceName + "|" + $scope.cityName;
        }
        restful.fetch("/evaluationlocation/add", "POST", $scope.EvaluationPoint).then(function (res) {
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

//修改
App.controller("UpdateEvaluationPointController", function ($scope, $uibModalInstance, EvaluationPoint, restful, AreaSelector) {
    $scope.EvaluationPoint = angular.copy(EvaluationPoint);
    $scope.EvaluationPoint.school_type = $scope.EvaluationPoint.school.schooltype.schooltype_id;
    $scope.EvaluationPoint.pro_code = Math.floor($scope.EvaluationPoint.city_code/100);
    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas){
        //获取省份
        $scope.provinces = areas;
    });

    AreaSelector.getCitiesByProvinceCode(areaResourceUri, $scope.EvaluationPoint.pro_code).then(function(res) {
        $scope.cities = res;
    });
    $scope.initCity = function (province) {
        if(!province){
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri,province.city_code).then(function (cities) {
            //获取城市
            $scope.cities = cities;
            $scope.EvaluationPoint.city_code = null;
            $scope.EvaluationPoint.school_code = null;
            $scope.schools = null;
            $scope.EvaluationPoint.school_type = null;
        });
        AreaSelector.getNameByCode(areaResourceUri, province.city_code).then(function(res) {
            $scope.provinceName = res;
        });
    }
    $scope.getSchools = function(){
        restful.fetch("/common/getSchoolByCity","GET", {
            city_code:$scope.EvaluationPoint.city_code,
            school_typeid: $scope.EvaluationPoint.school_type
        }).then(function(res) {
            if(res.success){
                $scope.schools = res.data;
            }
        });
    }
    $scope.getSchools();

    $scope.initSchool = function () {
        $scope.getSchools();
        $scope.EvaluationPoint.school_code = null;
        AreaSelector.getNameByCode(areaResourceUri, $scope.EvaluationPoint.city_code).then(function(res) {
            $scope.cityName = res;
        });
    }
    restful.fetch("/common/getSchoolType", "GET").then(function(res) {
        if (res.success) {
            $scope.schoolType = res.data;
        }
    });
    $scope.save = function () {
        if($scope.provinceName&&$scope.cityName){
            $scope.EvaluationPoint.city_name = $scope.provinceName + "|" + $scope.cityName;
        }
        restful.fetch("/evaluationlocation/update", "POST", $scope.EvaluationPoint).then(function (res) {
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

//导入
App.controller("ImportEvaluationPointController", function ($scope, $rootScope, $uibModalInstance, restful,toastr) {
    $scope.EvaluationPointExcel = "/excel/EvaluationPoint.xlsx";
    $scope.data = {};
    $scope.uploadComplete = function(res) {
        if(res.status){
            $scope.data.fileName = res.msg;
            $scope.message = "上传成功";
            $scope.error = "";
        }else{
            $scope.error = res.msg;
        }
    };
    $scope.save = function () {
        restful.fetch("/evaluationlocation/excelImport", "POST", $scope.data).then(function (res) {
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