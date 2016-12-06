/*
 * @Author: 唐文雍
 * @Date:   2016-04-17 11:25:27
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-04-27 23:48:25
 */

'use strict';

angular.module('AdminFilters', [])
    .filter('sumOfValue', function() {
        //ng-repeat 行内的某列求和，保留两位小数
        return function(data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v, k) {
                sum = sum + parseFloat(v[key] == null ? 0 : v[key]);
            });
            return ((sum*100)/100).toFixed(2);
        }
    })
    .filter('sumOfPercentageValue', function() {
        //ng-repeat 行内的某列百分数求和,保留一位小数
        return function(data, key) {
            if (angular.isUndefined(data) && angular.isUndefined(key))
                return 0;
            var sum = 0;

            angular.forEach(data, function(v, k) {
                sum = sum + parseFloat(v[key] == null ? 0 : v[key]);
            });
            return (sum*100).toFixed(2);
        }
    })
    .filter('totalSumPriceQty', function() {
        //ng-repeat 行内的单价*数量求和
        return function(data, key1, key2) {
            if (angular.isUndefined(data) && angular.isUndefined(key1) && angular.isUndefined(key2))
                return 0;

            var sum = 0;
            angular.forEach(data, function(v, k) {
                sum = sum + (parseInt(v[key1]) * parseInt(v[key2]));
            });
            return sum;
        }
    })
    .filter('removeBlankItems', function() {
        return function(inputArray) {
            var outArray = [];
            for (var i = 0; i < inputArray.length; i++) {
                if (inputArray[i].length != 0) {
                    outArray.push(inputArray[i]);
                }
            }
            return outArray;
        };
    })
    .filter('getStringByIndex', function(){
        return function (string, separator, index) {
            //string:字符串；separator:分离符号；index:要获取的值的索引
            var i = index || 0;
            var s = separator || "|";
            if(!string||!string.indexOf(i)){
                return string;
            }
            var array = string.split(s);
            return array[i];
        }
    })