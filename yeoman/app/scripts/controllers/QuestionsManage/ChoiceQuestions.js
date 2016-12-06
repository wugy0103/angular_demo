/*
 * @Author: 唐文雍
 * @Date:   2016-07-12 16:36:37
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-12 18:59:20
 */
//题库管理》选择题题库

'use strict';
App.controller('ChoiceQuestionsController', function($scope, $log, $rootScope, $http, $uibModal, restful, ngProgressFactory) {
	$scope.progressbar = ngProgressFactory.createInstance();
	
	$scope.data = {};
	$scope.error = '';
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
	$scope.question = $rootScope.QUESTION_CONFIG;
	//重置
	$scope.reset = function() {
			$scope.data = {};
			$scope.PageIndex = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
			$scope.toPageNum = $rootScope.PAGINATION_CONFIG.PAGEINDEX;
		}
		//全选
	$scope.toggleAll = function() {
			var toggleStatus = $scope.isAllSelected;
			angular.forEach($scope.ChoiceQuestions, function(item) {
				item.selected = toggleStatus;
			});
		}
		//单选
	$scope.optionToggled = function() {
			$scope.isAllSelected = $scope.ChoiceQuestions.every(function(item) {
				return item.selected;
			})
		}
		//加载
	$scope.query = function() {
		$scope.progressbar.start();
		var params = {
			PageIndex: parseInt($scope.PageIndex),
			PageSize: parseInt($scope.PageSize),
			condition: $scope.data
		};
		$scope.ChoiceQuestionPromise = restful.fetch("/choicequestion/getChoiceQuestionInfo", "POST", params).then(function(res) {
			if(res.success) {
				$scope.ChoiceQuestions = res.data.rows;
				$scope.ChoiceQuestionCount = res.data.count;
			}
			$scope.progressbar.complete();
		});
	};
	$scope.query();

	//添加
	$scope.add = function() {
			var modalInstance = $uibModal.open({
				templateUrl: 'AddChoiceQuetion.html',
				controller: 'AddChoiceQuetionController',
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
		//编辑
	$scope.update = function(ChoiceQuestion) {
			var modalInstance = $uibModal.open({
				templateUrl: 'UpdateChoiceQuetion.html',
				controller: 'UpdateChoiceQuetionController',
				resolve: {
					ChoiceQuestion: function() {
						return ChoiceQuestion;
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
		//导入
	$scope.import = function() {
			var modalInstance = $uibModal.open({
				templateUrl: 'ImportChoiceQuetion.html',
				controller: 'ImportChoiceQuetionController'
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
	$scope.remove = function() {
		var data = [];
		angular.forEach($scope.ChoiceQuestions, function(item) {
			if(item.selected) {
				data.push(item.cq_cqid);
			}
		});
		restful.fetch("/choicequestion/remove", "POST", {
			id: data
		}).then(function(res) {
			console.info(res);
			if(res.success) {
				$scope.isAllSelected = false;
				$scope.query();
			} else {
				$scope.error = res.msg.message;
			}
		});
	}
});

//添加
App.controller("AddChoiceQuetionController", function($scope, $rootScope, $uibModalInstance, restful,mySer) {
	$scope.moulderData = {};
	//data.cq_title;data.cq_optiona;data.cq_optionb;data.cq_optionc;data.cq_optiond
	//判断是否拟题
	$scope.titleFocus = function(){
		$scope.tare = document.querySelector('#titleText').value;
		if($scope.tare == ''){
			$scope.error = "您还没有拟定题目";
		}else{
			$scope.error='';
		}
	}
	//答案判断
	$scope.changeTit = function(str,value){
		$scope.error = mySer.method(str,value,$scope.moulderData);
	}
	
	
	$scope.save = function() {
		if($scope.error == ''){
			restful.fetch("/choicequestion/add", "POST", $rootScope.moulderData).then(function(res) {
			console.info(res);
				if(res.success) {
					$uibModalInstance.dismiss('success');
				} else {
					$scope.error = res.msg.message;
				}
			});
		}
		
	};
	$scope.close = function() {
		$uibModalInstance.dismiss('close');
	};
});

//修改
App.controller("UpdateChoiceQuetionController", ['$scope','$rootScope','$uibModalInstance','ChoiceQuestion','restful','mySer',function($scope,$rootScope,$uibModalInstance, ChoiceQuestion, restful,mySer) {
	
	$scope.ChoiceQuestion = angular.copy(ChoiceQuestion);
	$scope.changeTit = function(str,value){
		$scope.error = mySer.method(str,value,$scope.ChoiceQuestion);
	}
	//判断选项
	
	$scope.save = function() {
		if($scope.error == ''){
			restful.fetch("/choicequestion/update", "POST", $scope.ChoiceQuestion).then(function(res) {
				console.info(res.data);
				if(res.success) {
					$uibModalInstance.dismiss('success');
				} else {
					$scope.error = res.msg.message;
				}
			}, function(rej) {
				console.info(rej);
				});
		}
		
	};
	$scope.close = function() {
		$uibModalInstance.dismiss('close');
	};
}]);

//导入
App.controller("ImportChoiceQuetionController", function($scope, $rootScope, $uibModalInstance, restful, toastr) {
	$scope.ChoiceQuestionExcel = "/excel/ChoiceQuestion.xlsx";
	$scope.data = {};
	$scope.uploadComplete = function(res) {
		console.info(res)
		if(res.status) {
			$scope.data.fileName = res.msg;
			$scope.message = "上传成功";
			$scope.error = "";
		} else {
			$scope.error = res.msg;
		}
	};
	$scope.save = function() {
		restful.fetch("/choicequestion/excelImport", "POST", $scope.data).then(function(res) {
			if(res.success) {
				toastr.success('导入成功！', 'Success');
				$uibModalInstance.dismiss('success');
			} else {
				toastr.error(res.msg, 'Error');
				$scope.error = res.msg;
				$scope.message = "";
			}
		});
	};
	$scope.close = function() {
		$uibModalInstance.dismiss('close');
	};
});


App.service('mySer',[function(){
	
	return {
		
		method:function(option,value,ChoiceQuestion){
			switch(option){
				case 'cq_title':
					return titie(value,ChoiceQuestion);
				break;
				
				case 'cq_optiona':
					return optiona(value,ChoiceQuestion);
				break;
				
				case 'cq_optionb':
					return optionb(value,ChoiceQuestion);
				break;
				
				case 'cq_optionc':
					return optionc(value,ChoiceQuestion);
				break;
				
				case 'cq_optiond':
					return optiond(value,ChoiceQuestion);
				break;
				
			};
			function titie(val,question){
				var error = '';
				if(val == question.cq_optiona || val == question.cq_optionb || val == question.cq_optionc ||val == question.cq_optiond){
					error = "题目不能与答案相同哦";
					return error;
				}else{
					error = '';
					return error;
				}
				
			};
			function optiona(val,question){
				var error = '';
				if(val == question.cq_title){
					error = "答案不能与题目相同";
					return error;
				}else if(val == question.cq_optionb || val == question.cq_optionc ||val == question.cq_optiond){
					error = '答案不能重复';
					return error;
				}else{
					error = '';
					return error;
				}
				
			};
			function optionb(val,question){
				var error = '';
				if(val == question.cq_title){
					error = "答案不能与题目相同";
					return error;
				}else if(val == question.cq_optiona || val == question.cq_optionc ||val == question.cq_optiond){
					error = '答案不能重复';
					return error;
				}else{
					error = '';
					return error;
				}
				
			};
			function optionc(val,question){
				var error = '';
				if(val == question.cq_title){
					error = "答案不能与题目相同";
					return error;
				}else if(val == question.cq_optiona || val == question.cq_optionb ||val == question.cq_optiond){
					error = '答案不能重复';
					return error;
				}else{
					error = '';
					return error;
				}
				
			};
			function optiond(val,question){
				var error = '';
				if(val == question.cq_title){
					error = "答案不能与题目相同";
					return error;
				}else if(val == question.cq_optiona || val == question.cq_optionc ||val == question.cq_optionb){
					error = '答案不能重复';
					return error;
				}else{
					error = '';
					return error;
				}
				
			};
			
		}
		
	}
}])
