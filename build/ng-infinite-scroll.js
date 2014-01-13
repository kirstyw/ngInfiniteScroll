var mod;

mod = angular.module('infinite-scroll', []);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, element, attrs) {
        $window = angular.element($window);
        var d = document,
            documentHeight = Math.max(d.documentElement.clientHeight, d.body.scrollHeight, d.documentElement.scrollHeight, d.body.offsetHeight, d.documentElement.offsetHeight),
            scrollEnabled = true,
            checkWhenEnabled = false,
            distanceToTrigger = 200;
        
        var handler = function() {
            var windowHeight = $window.innerHeight || d.documentElement.clientHeight || d.getElementsByTagName('body')[0].clientHeight,
                scrollTop = d.documentElement.scrollTop || d.body.scrollTop,
                top = documentHeight - windowHeight - distanceToTrigger,
                shouldScroll = scrollTop >= top;
        
            if (shouldScroll && scrollEnabled) {
                if ($rootScope.$$phase) {
                    return scope.$eval(attrs.infiniteScroll);
                } else {
                    return scope.$apply(attrs.infiniteScroll);
                }
            } else if (shouldScroll) {
                return checkWhenEnabled = true;
            }
        };
        
        if (!attrs.infiniteScrollDisabled) {
            scope.$watch(attrs.infiniteScrollDisabled, function(value) {
                scrollEnabled = !value;
        
                if(scrollEnabled && checkWhenEnabled) {
                    checkWhenEnabled = false;
        
                    return handler();
                }
            });
        }
        
        $window.bind('scroll', handler);
        
        scope.$on('$destroy', function() {
            return $window.unbind('scroll', handler);
        });
        
        return $timeout((function() {
            if (attrs.infiniteScrollImmediateCheck) {
                if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
                    return handler();
                }
            } else {
                return handler();
            }
        }), 0);
      }
    };
  }
]);
