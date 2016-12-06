/*
 * @Author: 唐文雍
 * @Date:   2016-07-12 16:36:37
 * @Last Modified by:   Marte
 * @Last Modified time: 2016-09-14 10:54:05
 */
//题库管理》选择题题库

'use strict';
App.controller('EvaluationClerkController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory, AreaSelector) {
    $scope.progressbar = ngProgressFactory.createInstance();
    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas) {
        //获取省份
        $scope.provinces = areas;
    });
    $scope.initCity = function(province) {
        if (!province) {
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri, province.city_code).then(function(res) {
            //获取城市
            $scope.cities = res;
        });
    }
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
        $scope.EvaluationClerkPromise = restful.fetch("/teacher/getTeachersInfo", "POST", params).then(function(res) {
            console.log(res)
            if (res.success) {
                $scope.EvaluationClerks = res.data.rows;
                $scope.EvaluationClerkCount = res.data.count;
            }
            $scope.progressbar.complete();
        }, function(rej) {
            console.info(rej);
        });
    };
    $scope.query();

    $scope.add = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'AddEvaluationClerk.html',
            controller: 'AddEvaluationClerkController',
            size: 'lg'
        });
        modalInstance.result.then(function() {
            //close
            $scope.query();
        }, function() {
            //dismissed
            $scope.query();
        })
    }
    $scope.update = function(EvaluationClerk) {
        var modalInstance = $uibModal.open({
            templateUrl: 'UpdateEvaluationClerk.html',
            controller: 'UpdateEvaluationClerkController',
            resolve: {
                EvaluationClerk: function() {
                    return EvaluationClerk;
                }
            },
            size: 'lg'
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
    $scope.remove = function(EvaluationClerk) {
        var params = {
            userId: EvaluationClerk.user_id,
            teacherId: EvaluationClerk.teacher_id
        };
        restful.fetch("/teacher/remove", "POST", params).then(function(res) {
            if (res.success) {
                $scope.query();
            }
        });
    };
   
});


//添加
App.controller("AddEvaluationClerkController", function($scope, $rootScope, $q, $uibModalInstance, restful, AreaSelector, toastr) {
    $scope.isLoading = false;
    $scope.data = { userInfo:{},teacherInfo:{},addressInfo:[]};
    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas) {
        //获取省份
        $scope.provinces = areas;
    });

    $scope.initCity = function(province) {
    	console.log(province);
        if (!province) {
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri, province.city_code).then(function(cities) {
            //获取城市
            $scope.cities = cities;
            $scope.data.userInfo.city_code = null;
            $scope.data.userInfo.school_code = null;
            $scope.schools = null;
        });
        AreaSelector.getNameByCode(areaResourceUri, province.city_code).then(function(res) {
            $scope.provinceName = res;
        });
    }

    $scope.initSchool = function() {
        var params = {
            city_code: $scope.data.userInfo.city_code
        }
        restful.fetch("/common/getSchoolByCity", "GET", params).then(function(res) {
            if (res.success) {
                $scope.schools = res.data;
                $scope.data.userInfo.school_code = null;
            }
        });
        AreaSelector.getNameByCode(areaResourceUri, $scope.data.userInfo.city_code).then(function(res) {
            $scope.cityName = res;
        });
    }
    $scope.initPoint = function() {
        var params = {
            city_code: $scope.data.userInfo.city_code,
            school_code: $scope.data.userInfo.school_code
        }
        restful.fetch("/common/getEvaluationLocation", "GET", params).then(function(res) {
            if (res.success) {
                $scope.points = res.data;
                if($scope.data.teacherInfo&&$scope.data.teacherInfo.el_id){
                    $scope.data.teacherInfo.el_id = null;
                }
            }
        });
    }
    $scope.save = function() {
    	var radioChecked = $('.btnadds');
    	angular.forEach(radioChecked,function(val,index){
			if($(val).prop('checked')){
				$scope.data.userInfo.address =$(val).closest('.form-group').find('input[type=text]').val();
				$scope.address = $scope.data.userInfo.address;
				$scope.checkeds = $(val).prop('checked');
				$scope.data.addressInfo.push({Address:$scope.address,IsDefault:$scope.checkeds});
			}else{
				$scope.NewAddress = $(val).closest('.form-group').find('input[type=text]').val();
				$scope.radioChecked = $(val).prop('checked');
				$scope.data.addressInfo.push({Address:$scope.NewAddress,IsDefault:$scope.radioChecked});
			}
		});
       if($scope.provinceName&&$scope.cityName){
            $scope.data.userInfo.proviencecity_name = $scope.provinceName + "|" + $scope.cityName;
       }
        $scope.data.userInfo.real_sex = parseInt($scope.real_sex);
        restful.fetch("/teacher/add", "POST", $scope.data).then(function(res) {
            console.info(res);
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

    $scope.getImageInfo = function(file, base64) {
        var deferred = $q.defer();
        var type = base64.filetype;
        var code = base64.base64;
        var size = base64.filesize;
        var name = base64.filename;
        var src = "data:" + type + ";base64," + code;
        var img = new Image();
        img.src = src;
        if(!type){
            deferred.reject();
        }
        img.onload = function() {
            var imageInfo = {
                dimension: {
                    width: img.width,
                    height: img.height
                },
                base64: code,
                base64Str: src,
                filetype: type,
                filesize: size,
                filename: name
            }
            deferred.resolve(imageInfo);
        }

        return deferred.promise;
    };

    $scope.$watch('headimage', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.isLoading = true;
            var params = {
                base64Str: newValue.base64Str,
                type: newValue.filetype,
                xy: {
                    width: newValue.dimension.width,
                    height: newValue.dimension.height
                },
                size: newValue.filesize,
                name: newValue.filename
            };
            console.info(params);
            restful.fetch("/common/uploadImg", "POST", params).then(function(res) {
                console.info(res)
                if (res.status === 1) {
                    var image = res.msg;
                    $scope.data.userInfo.headimage_url = image;
                    $scope.imageUrl = image;
                } else {
                    $scope.uploadError = res.msg;
                }
            }, function(rej) {
                toastr.error('上传失败！', 'Error');
            }).finally(function() {
                $scope.isLoading = false;
            });
        }
    }, true);
   /* 
     $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate', 'yyyy-MM-dd'];
    $scope.format = $scope.formats[4];*/
    //最小时间为当前
    /*$scope.dateOptions = {
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1,
        showWeeks: false
    };*/
    
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
  
});

//修改
App.controller("UpdateEvaluationClerkController", function($scope, $uibModalInstance, $q, EvaluationClerk, restful, AreaSelector, toastr) {
    $scope.isLoading = false;
    //当前的用户信息
    $scope.EvaluationClerk = angular.copy(EvaluationClerk);
    console.log($scope.EvaluationClerk);
    $scope.addressIndex = $scope.EvaluationClerk.evaluatoraddresses;
    $scope.arr=[];
   //获取其他地址
    angular.forEach($scope.addressIndex,function(val,index){
    	if(!val.IsDefault){
    		$scope.arr.push(val.Address);
    	}
    });
    $scope.EvaluationClerk.userInfo.pro_code = Math.floor($scope.EvaluationClerk.evaluationlocation.city_code / 100);
    $scope.EvaluationClerk.userInfo.city_code = $scope.EvaluationClerk.evaluationlocation.city_code;
    $scope.EvaluationClerk.teacherInfo = {
        teacher_id:$scope.EvaluationClerk.teacher_id,
        teacher_bankcard:$scope.EvaluationClerk.teacher_bankcard,
        teacher_devidepercent:$scope.EvaluationClerk.teacher_devidepercent,
        el_id:$scope.EvaluationClerk.el_id,
    }
    $scope.imageUrl = $scope.EvaluationClerk.userInfo.headimage_url;

    var areaResourceUri = '/common/getCityInfo';
    AreaSelector.getProvinces(areaResourceUri).then(function(areas) {
        //获取省份
        $scope.provinces = areas;
    });

    AreaSelector.getCitiesByProvinceCode(areaResourceUri, $scope.EvaluationClerk.userInfo.pro_code).then(function(res) {
        $scope.cities = res;
    });
    $scope.initCity = function(province) {
        if (!province) {
            return;
        }
        AreaSelector.getCitiesByProvinceCode(areaResourceUri, province.city_code).then(function(cities) {
            //获取城市
            $scope.cities = cities;
            $scope.EvaluationClerk.userInfo.city_code = null;
            $scope.EvaluationClerk.userInfo.school_code = null;
            $scope.schools = null;
        });
        AreaSelector.getNameByCode(areaResourceUri, province.city_code).then(function(res) {
            $scope.provinceName = res;
        });
    }

    $scope.getSchools = function(){
        restful.fetch("/common/getSchoolByCity", "GET", {
            city_code: $scope.EvaluationClerk.userInfo.city_code
        }).then(function(res) {
            if(res.success){
                $scope.schools = res.data;
            }
        });
    }
    $scope.getSchools();

    $scope.initSchool = function() {
        $scope.getSchools();
        $scope.EvaluationClerk.userInfo.school_code = null;
        AreaSelector.getNameByCode(areaResourceUri, $scope.EvaluationClerk.userInfo.city_code).then(function(res) {
            $scope.cityName = res;
        });
    }

    $scope.getLocations = function(){
        restful.fetch("/common/getEvaluationLocation", "GET", {
            city_code: $scope.EvaluationClerk.userInfo.city_code,
            school_code: $scope.EvaluationClerk.userInfo.school_code
        }).then(function(res) {
            if (res.success) {
                $scope.points = res.data;
            }
        });
    }
    $scope.getLocations();

    $scope.initPoint = function() {
        $scope.getLocations();
        $scope.EvaluationClerk.teacherInfo.el_id = null;
    }
    $scope.save = function() {
    	//console.log($scope.addressInfo,$scope.EvaluationClerk.userInfo);
        if($scope.provinceName&&$scope.cityName){
            $scope.EvaluationClerk.userInfo.proviencecity_name = $scope.provinceName + "|" + $scope.cityName;
        }
        var params = {
            userInfo: $scope.EvaluationClerk.userInfo, 
            teacherInfo: $scope.EvaluationClerk.teacherInfo,
            addressInfo:$scope.EvaluationClerk.evaluatoraddresses
        }
        restful.fetch("/teacher/update", "POST", params).then(function(res) {
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
    $scope.getImageInfo = function(file, base64) {
        var deferred = $q.defer();

        var type = base64.filetype;
        var code = base64.base64;
        var size = base64.filesize;
        var name = base64.filename;
        var src = "data:" + type + ";base64," + code;

        var img = new Image();
        img.src = src;

        if(!type){
            deferred.reject();
        }
        img.onload = function() {
            var imageInfo = {
                dimension: {
                    width: img.width,
                    height: img.height
                },
                base64: code,
                base64Str: src,
                filetype: type,
                filesize: size,
                filename: name
            }
            deferred.resolve(imageInfo);
        }

        return deferred.promise;
    };
    $scope.$watch('headimage', function(newValue, oldValue) {
        if (newValue !== oldValue) {
            $scope.isLoading = true;
            var base64 = newValue.base64;
            var params = {
                base64Str: newValue.base64Str,
                type: newValue.filetype,
                xy: {
                    width: newValue.dimension.width,
                    height: newValue.dimension.height
                },
                size: newValue.filesize,
                name: newValue.filename
            };
            console.info(params)
            restful.fetch("/common/uploadImg", "POST", params).then(function(res) {
                console.info(res)
                if (res.status === 1) {
                    var image = res.msg;
                    $scope.EvaluationClerk.userInfo.headimage_url = image;
                    $scope.imageUrl = image;
                } else {
                    $scope.uploadError = res.msg;
                }
            }, function(rej) {
                toastr.error('上传失败！', 'Error');
            }).finally(function() {
                $scope.isLoading = false;
            });
        }
    }, true);
 
});