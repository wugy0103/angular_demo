/*
 * @Author: 唐文雍
 * @Date:   2016-04-20 22:10:28
 * @Last Modified by:   唐文雍
 * @Last Modified time: 2016-07-11 17:51:16
 */

'use strict';
App.directive('percentage', function() {
    //百分比
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$formatters.push(function(modelValue) {
                return parseFloat((modelValue * 100).toFixed(2));
            });
            ctrl.$parsers.push(function(viewValue) {
                return (viewValue / 100).toFixed(4);
            });
        }
    };
});
App.directive('dateToTimestamp',function(){
    //日期转为短时间戳
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl){
            ctrl.$parsers.push(function(viewValue){
                return Math.floor(new Date(viewValue).getTime()/1000);
            })
        }
    }
});
App.directive('datetimeTransform', function($filter, $timeout){
    //时间戳和时间互转
    return {
        restrict: 'A',
        require: 'ngModel',
        scope:{
            format: '@'
        },
        link: function(scope, element, attr, ctrl){
            var datetimeFormat = scope.format;
            ctrl.$formatters.push(function (modelValue){
                var datetime = isNaN(modelValue) ? modelValue : new Date(modelValue);
                return $filter('date')(datetime, datetimeFormat);
            });
            ctrl.$parsers.push(function (viewValue){
                var datetime = new Date(viewValue).getTime();
                return datetime;
            });
        }
    }
});
App.directive('stringToNumber', function() {
    //字符串转数字
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            ctrl.$formatters.push(function(modelValue) {
                return parseFloat(modelValue, 10);
            });
            ctrl.$parsers.push(function(viewValue) {
                return '' + viewValue;
            });
        }
    };
});
App.directive('lowerThan', function() {
    //inpuit a要小于某个值
    var link = function($scope, $element, $attrs, ctrl) {

        var validate = function(viewValue) {
            var comparisonModel = $attrs.lowerThan;

            if (!viewValue || !comparisonModel) {
                // It's valid because we have nothing to compare against
                ctrl.$setValidity('lowerThan', true);
            }

            if (!viewValue && !comparisonModel) {
                //NaN，可留空
                ctrl.$setValidity('lowerThan', true);
            } else {
                // It's valid if model is lower than the model we're comparing against
                ctrl.$setValidity('lowerThan', parseInt(viewValue, 10) < parseInt(comparisonModel, 10));
            }
            return viewValue;
        };

        ctrl.$parsers.unshift(validate);
        ctrl.$formatters.push(validate);

        $attrs.$observe('lowerThan', function(comparisonModel) {
            return validate(ctrl.$viewValue);
        });

    };

    return {
        require: 'ngModel',
        link: link
    };

});
App.directive('focusOnFirstInvalidInput', function() {
    //提交表单时，如有验证不通过的表单即将焦点定在第一个invalid input
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.on('submit', function() {
                var firstInvalid = element[0].querySelector('.ng-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            });
        }
    };
});
App.directive('setClassWhenAtTop', function($window) {
    //当某个元素滚动到顶部时，设置class, 用法如 set-class-when-at-top="fix-to-top"
    var $win = angular.element($window);
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            var topClass = attr.setClassWhenAtTop,
                offsetTop = element.offset().top;
            $win.on('scroll', function(e) {
                if ($win.scrollTop() >= offsetTop) {
                    element.addClass(topClass);
                } else {
                    element.removeClass(topClass);
                }
            });
        }
    };
});
App.directive('ignoreMouseWheel', function($rootScope) {
    //禁用鼠标滚动，用在type=number的标签上
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            element.bind('mousewheel', function(event) {
                element.blur();
            });
        }
    }
});
App.directive('activeLink', function($location) {
    //路由改变时，给菜单栏 对应的链接父元素加上active
    return {
        restrict: 'A',
        replace: false,
        link: function(scope, elem) {
            scope.$on("$stateChangeStart", function() {
                var hrefs = ['/#' + $location.path(),
                    '#' + $location.path(), //html5: false
                    $location.path()
                ]; //html5: true
                angular.forEach(elem.find('a'), function(a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');
                    };
                });
            });
        }
    }
});
App.directive('ngEnter', function() {
    //回车键，ng-enter='doSomething()'
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
App.directive('imageViewer', function($window) {
    //图片查看器, 依赖viewer.js插件
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var Viewer = $window.Viewer;
            var options = {
                navbar: false,
                zoomRatio: 0.3,
                show: function(e) {
                    //本身viewer部分的html是追加在目标img后面，不能全屏浏览，暂时办法为：移动viewer html到body
                    $("body").append($(".viewer-container"));

                    //暂时不需要以下这些按钮，所以去掉
                    $(".viewer-container .viewer-prev,.viewer-play,.viewer-next,.viewer-reset,.viewer-flip-horizontal,.viewer-flip-vertical").remove();

                    var viewerCanvas = $(".viewer-canvas");
                    viewerCanvas.on('mousedown', function(evt) {
                        viewerCanvas.on('mouseup mousemove', function handler(evt) {
                            console.info(evt.type);
                            if (evt.type === 'mouseup') {
                                // 点击，关闭
                                viewer.hide();
                            } else {
                                // 拖拽
                            }
                            viewerCanvas.off('mouseup mousemove', handler);
                        });
                    });
                }
            };
            var dom = $(element).context;
            var viewer = new Viewer(dom, options);
        },
    };
});
App.directive('toggleMenu', function() {
    //左侧菜单伸缩
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.click(function() {
                $(this).parent().children('ul.tree').toggle(200);
                $(this).children('i.pull-right').toggleClass('fa-angle-right fa-angle-down');
            });
        }
    }
});
App.directive('booleanToNumber', function() {
    //布尔值转数字，数字转布尔值
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$formatters.push(function(modelValue) {
                return modelValue === 1 ? true : false;
            });
            ctrl.$parsers.push(function(viewValue) {
                return viewValue === true ? 1 : 0;
            });
        }
    };
});
App.directive('hideParent', function($timeout){
    //当子元素的内容为空时，隐藏父元素，本项目用在侧栏菜单
    return {
        restrict: 'A',
        link: function(scope, element, attr, ctrl){
            $timeout(function(){
                var childLength = element.find(attr.hideParent+":first").children().length;
                if(!childLength){
                    element.hide();
                }else{
                    element.show();
                }
            });
        }
    }
});
