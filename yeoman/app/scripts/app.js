'use strict';

/*
 * @Author: 唐文雍
 * @Date:   2016-04-15 14:28:07
 * @Last Modified by:   Marte
 * @Last Modified time: 2016-09-09 15:42:31
 */

var App, modules;
modules = ['ngAnimate', 'ngAria', 'ngCookies', 'ngMessages', 'ngResource', 'ngRoute', 'ui.router', 'ngSanitize', 'ui.bootstrap',
    'ngTouch', 'ngProgress', 'ui.select', 'checklist-model', "ajoslin.promise-tracker", 'angularPromiseButtons', 'AdminFilters',
    'AdminService', "ui.bootstrap", "cgBusy", 'ngStorage', 'angular-confirm', 'toastr', 'ngTagsInput', 'naif.base64',
    'ngUpload', 'ui.tree', 'angularMoment', 'ui.bootstrap.datetimepicker'];
App = angular.module('HealthAdminFrontend', modules);

//路由配置
App.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/User/Login');
    $stateProvider.state('dashboard', {
            url: '/',
            templateUrl: 'app/views/main.html'
        })
        .state('login', {
            url: '/User/Login',
            templateUrl: 'app/views/User/Login.html'
        })
        // 用户管理》已注册用户
        .state('RegisteredUsers', {
            url: '/UserManage/RegisteredUsers',
            templateUrl: 'app/views/UserManage/RegisteredUsers.html'
        })
        // 用户管理》已报名用户
        .state('SignedUsers', {
            url: '/UserManage/SignedUsers',
            templateUrl: 'app/views/UserManage/SignedUsers.html'
        })
        // 用户管理》笔试成绩查询
        .state('ExaminationResults', {
            url: '/UserManage/ExaminationResults',
            templateUrl: 'app/views/UserManage/ExaminationResults.html'
        })

    // 题库管理》选择题题库
    .state('ChoiceQuestions', {
            url: '/QuestionsManage/ChoiceQuestions',
            templateUrl: 'app/views/QuestionsManage/ChoiceQuestions.html'
        })
        // 题库管理》判断题题库
        .state('TrueOrFalseQuestions', {
            url: '/QuestionsManage/TrueOrFalseQuestions',
            templateUrl: 'app/views/QuestionsManage/TrueOrFalseQuestions.html'
        })

    // 考试管理》项目设置
    .state('Project', {
            url: '/ExaminationManage/Project',
            templateUrl: 'app/views/ExaminationManage/Project.html'
        })
        // 考试管理》考试设置
        .state('Examination', {
            url: '/ExaminationManage/Examination',
            templateUrl: 'app/views/ExaminationManage/Examination.html'
        })
        // 考试管理》试卷设置
        .state('ExaminationPaper', {
            url: '/ExaminationManage/ExaminationPaper',
            templateUrl: 'app/views/ExaminationManage/ExaminationPaper.html'
        })

    // 技术考评管理》考评点管理
    .state('EvaluationPoint', {
            url: '/EvaluationManage/EvaluationPoint',
            templateUrl: 'app/views/EvaluationManage/EvaluationPoint.html'
        })
        // 技术考评管理》考评员管理
        .state('EvaluationClerk', {
            url: '/EvaluationManage/EvaluationClerk',
            templateUrl: 'app/views/EvaluationManage/EvaluationClerk.html'
        })
        // 技术考评管理》技术考评得分管理
        .state('EvaluationScore', {
            url: '/EvaluationManage/EvaluationScore',
            templateUrl: 'app/views/EvaluationManage/EvaluationScore.html'
        })
        // 技术考评管理》技术考评成绩管理
        .state('EvaluationResults', {
            url: '/EvaluationManage/EvaluationResults',
            templateUrl: 'app/views/EvaluationManage/EvaluationResults.html'
        })

    // 通知管理》通知列表
    .state('Notice', {
        url: '/NoticeManage/Notice',
        templateUrl: 'app/views/NoticeManage/Notice.html'
    })

});

//promise 按钮
App.config(function(angularPromiseButtonsProvider) {
    angularPromiseButtonsProvider.extendConfig({
        spinnerTpl: '<i class="fa fa-spinner" aria-hidden="true"></i>',
        disableBtn: true,
        btnLoadingClass: 'is-loading',
        addClassToCurrentBtnOnly: false,
        disableCurrentBtnOnly: false
    });
});

//toast 对话框
App.config(function(toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        timeOut: 3000,
        newestOnTop: true,
        positionClass: 'toast-top-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});

// http拦截器
App.config(function($httpProvider) {
    $httpProvider.interceptors.push([
        '$injector',
        function($injector) {
            return $injector.get('AuthInterceptor');
        }
    ]);
});

//监控路由变化
App.run(function($state, $rootScope, AuthService) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        //判断是否是不包括头部和侧栏的页面
        $rootScope.isOwnPage = _.contains(["login"], toState.name);
        //路由拦截，无权限则跳转到登录界面
        var nextRoute = toState.name;
        //console.log(nextRoute)
        if (!AuthService.isAuthorized(nextRoute) && !$rootScope.isOwnPage && toState.name != "dashboard") {
            event.preventDefault(); //阻止页面跳转\
            $state.go('login');
        }
    });
});
