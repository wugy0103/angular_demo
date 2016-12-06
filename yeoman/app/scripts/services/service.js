/*
 * @Author: 唐文雍
 * @Date:   2016-04-17 11:51:44
 * @Last Modified by:   Marte
 * @Last Modified time: 2016-09-08 14:21:22
 */

'use strict';
angular.module("AdminService", [])
    .factory("restful", function($http) {
        var promise;
        return {
            get: function(resource, _id) {
                promise = $http.get(resource + _id + '/').then(function(response) {
                    return response.data;
                });
                return promise;
            },
            query: function(resource, params) {//查询
                params = (typeof params) !== 'undefined' ? params : {};//params 请求参数，将在URL上被拼接成？key=value
              
                promise = $http({ url: resource, method: "GET", params: params })
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            remove: function(resource, _id) {
                promise = $http({ url: resource + _id + '/?type=all', method: "DELETE" })
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            update: function(resource, _id, data) {//跟新
                promise = $http({ url: resource + _id + '/', method: "PATCH", data: data })//  数据，将被放入请求内发送至服务器
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            save: function(resource, data) {
                promise = $http({ url: resource, method: "POST", data: data })
                    .then(function(response) {
                        return response.data;
                    });
                return promise;
            },
            fetch: function(resource, method, params) {
                var setMethod = typeof(method) == "undefined" ? "GET" : method;
                var paramsObj = method=="POST" ? {} : params;
                var config = {
                    url: resource,
                    method: setMethod,
                    data: params,
                    params: paramsObj
                };
                //console.log(config);
                promise = $http(config)
                    .then(function(response) {
                    	//console.log(response);
                        return response.data;
                    });
                return promise;
            }
        };
    })
    .factory('AuthService', function($http, Session) {
        var authService = {};
          authService.login = function(credentials) {
            //登录，成功后返回用户名
            if(credentials.msgflag){
              return $http
                .post('/userInfo/VerificationCode', credentials)
                .then(function(res) {
                  console.log(res.data)
                  if (res.data.success == true) {
                    Session.create(res.data.userName, res.data.data);
                  }
                  return res.data;
                });
            }else {
              return $http
                .post('/userInfo/login', credentials)
                .then(function(res) {
                  console.log(res.data)
                  if (res.data.success == true) {
                    Session.create(res.data.userName, res.data.data);
                  }
                  return res.data;
                });
            }

        };   
        authService.isAuthenticated = function() {
            //是否登录，返回true或者false
            return !!Session.$storage.userName;
        };

        authService.isAuthorized = function(nextRoute) {
            //是否有权限，返回true或者false
            var refuseRoute = Session.$storage.refuseRoute;
            if (refuseRoute) {
                return (authService.isAuthenticated() && refuseRoute.indexOf(nextRoute) == -1);
            } else {
                return authService.isAuthenticated();
            }

        };
        return authService;
    })
    .service('Session', function($sessionStorage) {
        this.$storage = $sessionStorage;
        this.create = function(userName, refuseRoute) {
            this.$storage.userName = userName;
            this.$storage.refuseRoute = refuseRoute;
        };
        this.destroy = function() {
            delete this.$storage.userName;
            delete this.$storage.refuseRoute;
        };
        return this;
    })
    .factory('AuthInterceptor', function($injector, $q) {
        // http拦截器
        return {
            response: function(response) {
                var errorNum = response.data.status;
                if (errorNum == 401 || errorNum == 403 || errorNum == 417) {
                    // 401 未登陆
                    // 403 已登录但拒绝访问
                    // 417 登陆超时，session过期
                    // 暂时全部跳转到登录界面
                    $injector.get('$state').go("login");
                }
                return $q.resolve(response);
            }
        };
    })
    .factory('msgBus', function($rootScope) {
        //供controller之间通讯，用法参考login页面和header
        var msgBus = {};
        msgBus.emitMsg = function(msg) {
            $rootScope.$emit(msg);
        };
        msgBus.onMsg = function(msg, scope, func) {
            var unbind = $rootScope.$on(msg, func);
            scope.$on('$destroy', unbind);
        };
        return msgBus;
    })
    .factory('AreaSelector', function($http, $localStorage, $q) {
        //省市联动
        var selector = {
            getAreas: function(resource) {
                //获取所有数据，优先从localStorage读取
                var areas = $localStorage.areas;
                if(typeof areas=== "undefined"){
                    return $http({ url: resource, method: "GET"}).then(function(response) {
                        areas = response.data.data;
                        $localStorage.areas = areas;
                        return areas;
                    });
                }else{
                    var defer = $q.defer();
                    defer.resolve(areas);
                    return defer.promise;
                }
            },
            getProvinces: function(resource) {
                //获取所有省份
                return selector.getAreas(resource).then(function(areas){
                    var provinces = [];
                    for (var i = areas.length - 1; i >= 0; i--) {
                        var current = areas[i];
                        if(current.city_level === 1){
                            provinces.push(current);
                        }
                    }
                    return provinces;
                });
            },
            getCitiesByProvinceCode: function(resource, ProvinceCode) {
                //根据省份code获取所有城市
                return selector.getAreas(resource).then(function(areas){
                    var cities = [];
                    for (var i = areas.length - 1; i >= 0; i--) {
                        var current = areas[i];
                        if(current.city_parentcode == ProvinceCode){
                            cities.push(current);
                        }
                    }
                    return cities;
                });
            },
            getNameByCode: function(resource, code){
                //根据省市code获取省市名称
                return selector.getAreas(resource).then(function(areas){
                    for (var i = areas.length - 1; i >= 0; i--) {
                        var current = areas[i];
                        if(current.city_code == code){
                            return current.city_name;
                        }
                    }
                })
            }
        };
        return selector;
    })
    .factory('ImageInfo', function($q){
        //获取file image 的信息，依赖angular-base64-upload
        var deferred = $q.defer();
        var info = {
            getInfo:function(base64, key){
                this._getInfoByKey(base64, key).then(function(imageInfo){
                    if(imageInfo){
                        deferred.resolve(imageInfo);
                    }
                });
                return deferred.promise;
            },
            _getInfoByKey: function(base64, key){
                var d = $q.defer();
                var type = base64.filetype;
                var code = base64.base64;
                var size = base64.filesize;
                var name = base64.filename;
                var src = "data:" + type + ";base64," + code;

                var img = new Image();
                img.src = src;
                img.onload = function() {
                    var imageInfos = {
                        dimension: {
                            width: img.width,
                            height: img.height
                        },
                        width:img.width,
                        height:img.height,
                        base64: code,
                        base64Str: src,
                        filetype: type,
                        filesize: size,
                        filename: name,
                    }
                    if(key){
                        d.resolve(imageInfos[key]);
                    }else{
                        d.resolve(imageInfos);
                    }
                }
                return d.promise;
            }
        };
        return info;
    })
