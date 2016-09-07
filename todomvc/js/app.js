(function (window,angular) {
	'use strict';
	var app = angular.module("myApp",[]);
	app.controller("todoController",["$scope",function($scope){
		// 数据展示
		$scope.tasks = [
			{
				id:0,name:"吃饭",completed:true
			},
			{
				id:0,name:"睡觉",completed:false
			},
			{
				id:0,name:"打豆豆",completed:false
			},
			{
				id:0,name:"学习",completed:true
			}
		]
	}])

})(window,angular);
