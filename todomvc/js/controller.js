/*
* @Author: wuguoyuan
* @Date:   2016-09-07 23:55:11
* @Last Modified by:   wuguoyuan
* @Last Modified time: 2016-09-08 01:28:50
*/
(function(angular){
  var app = angular.module('myApp.controller',['myApp.service'])
  app.controller("todoController",["$scope","$location","myService",function($scope,$location,myService){
    // 数据展示
    $scope.tasks = myService.get();

    // 删除数据
    $scope.remove = myService.remove;

    //添加任务
    $scope.newTask = "";
    $scope.add = function(){
      if(!$scope.newTask){
        return;
      }
      myService.add($scope.newTask)
      $scope.newTask = "";
    }

    //编辑
    $scope.isEditingId = -1;
    $scope.edit = function(id){
      $scope.isEditingId = id;
    }
    $scope.save = function(){
      $scope.isEditingId = -1;
      myService.save()
    }

    // 切换任务是否完成的状态
    $scope.$watch('tasks',function(newV,oldV){
      myService.save()
    },true)

    // 批量切换任务状态
    
    $scope.toggleAll = myService.toggleAll()

    //清除以完成的
    $scope.clear = myService.clear
    // $scope.getIsShow = function(){
    //  angular.forEach($scope.tasks,function(data,index){
    //    if(data.completed){
    //      return true;
    //    }
    //  })
    //  return false;
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
        $scope.getUnCompleted = myService.getUnCompleted

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











})(angular)

