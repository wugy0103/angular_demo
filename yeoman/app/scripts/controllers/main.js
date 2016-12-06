'use strict';

/*
 * @Author: 唐文雍
 * @Date:   2016-04-15 14:28:07
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-05-23 12:06:54
 */

App.controller('MainController', function($scope, $state, AuthService) {
    if (!AuthService.isAuthenticated('dashboard')){
        $state.go('login');
    }
});
