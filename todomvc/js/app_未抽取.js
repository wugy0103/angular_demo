(function (window,angular) {
	'use strict';
	var app = angular.module("myApp",[]);
	app.controller("todoController",["$scope","$location",function($scope,$location){
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

		//添加任务
		$scope.newTask = "";
		$scope.add = function(){
			if(!$scope.newTask){
				return;
			}
			var id;
			if($scope.tasks.length<=0){
				$scope.tasks = [];
				id=0;
			}else {
				id = $scope.tasks[$scope.tasks.length-1].id+1;
			}
			$scope.tasks.push({
				id:id,name:$scope.newTask,completed:false
			})
			$scope.newTask = "";
		}

		//编辑
		$scope.isEditingId = -1;
		$scope.edit = function(id){
			$scope.isEditingId = id;
		}
		$scope.save = function(){
			$scope.isEditingId = -1;
		}

		// 批量切换任务状态
		var status = true;
		$scope.toggleAll = function(){
			angular.forEach($scope.tasks,function(data,index){
				data.completed = status;
			})
			status = !status;
		}

		//清除以完成的
		$scope.clear = function(){
			var tmp =[];
			angular.forEach($scope.tasks,function(data,index){
				if(data.completed==false){
					tmp.push(data);
				}
			})
			$scope.tasks = tmp;
		}
		// $scope.getIsShow = function(){
		// 	angular.forEach($scope.tasks,function(data,index){
		// 		if(data.completed){
		// 			return true;
		// 		}
		// 	})
		// 	return false;
		// }
		// forEach不能跳出循环
		// 隐藏或显示清除按钮。
        $scope.getIsShow = function() {
            // 遍历数据，判断数据是否有已完成的
            for (var i = 0; i < $scope.tasks.length; i++) {
                var item = $scope.tasks[i];
                if (item.completed) {
                    return true;
                }
            }
            return false;
        }

        // 显示未完成任务数
        $scope.getUnCompleted = function(){
        	var count=0;
			angular.forEach($scope.tasks,function(data){
				if(data.completed==false){
					count++;
				}
			})  
			return count;      	
        }

        //切换不同状态任务的显示
        $scope.isComoleted = {};
        $scope.loca = $location;
        $scope.$watch("loca.url()",function(newV,oldV){
        	switch(newV){
        		case '/active':
        		$scope.isCompleted = {completed:false};
        		break;
        		case '/completed':
        		$scope.isCompleted = {completed:true};
        		break;
        		default:
        		$scope.isCompleted = {};
        		break;
        	}
        })


	}])

})(window,angular);
