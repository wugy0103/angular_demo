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
				id:1,name:"睡觉",completed:false
			},
			{
				id:2,name:"打豆豆",completed:false
			},
			{
				id:3,name:"学习",completed:true
			}
		];

		// 删除数据
		$scope.remove = function(id){
			angular.forEach($scope.tasks,function(data,index){
				if(data.id == id){
					$scope.tasks.splice(index,1);
				}
				return; 
			})
		}


	}])

})(window,angular);
