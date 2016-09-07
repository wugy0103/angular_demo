/*
* @Author: wuguoyuan
* @Date:   2016-09-08 00:05:10
* @Last Modified by:   wuguoyuan
* @Last Modified time: 2016-09-08 01:26:10
*/
(function(angular){
  var app = angular.module('myApp.service',[]);
  app.service('myService',['$window',function($window){
    var storage = $window.localStorage;
    var str = storage.getItem('todos');
    var arr = JSON.parse(str||'[]');
    this.get = function(){
      return arr;
    }
    this.add = function(newTask){
      var id;
      if(arr.length<=0){
        arr = [];
        id=0;
      }else {
        id = arr[arr.length-1].id+1;
      }
      arr.push({
        id:id,name:newTask,completed:false
      })
      this.save()
    }
    this.remove = function(id){
      angular.forEach(arr,function(data,index){
        if(data.id == id){
          arr.splice(index,1);
          this.save()
          return; 
        }
      })
    }
    this.save = function(){
      var arr_str = JSON.stringify(arr);
      storage.setItem('todos',arr_str)
    }
    var status = true;
    this.toggleAll = function(){
      angular.forEach(arr,function(data,index){
        data.completed = status;
      })
      this.save()
      status = !status;
    }
    this.clear = function(){
      var tmp =[];
      angular.forEach(arr,function(data,index){
        if(data.completed==false){
          tmp.push(data);
        }
      })
      arr = tmp;
      this.save()
    }
    this.getUnCompleted = function(){
       var count=0;
      angular.forEach(arr,function(data){
        if(data.completed==false){
          count++;
        }
      })  
      return count;       
    }



  }])
})(angular)