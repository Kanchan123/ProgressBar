appRoot.directive('progressBar',[function(){
    "use strict";
    return{
      restrict: 'AE',
      scope:{
          limitValue: '=',
          progressValue: '='
      },
      templateUrl: '/templates/partials/progressBar.html',
      link: function(scope, element, attr){
          scope.percentage = 0;
          var initProgressBar = function(){
              scope.percentage = parseInt((scope.progressValue*1 / scope.limitValue*1)  * 100);
              console.log('percentage:',scope.percentage,scope.progressValue,scope.limitValue);
              if(scope.percentage<=100){
                  $(element).find('.progress-bars').css('width', scope.percentage+'%');
                  $(element).find('.progress-bars').css('background-color', 'rgba(0,0,255,.1)');
              }else{
                  $(element).find('.progress-bars').css('width', '100%');
                  $(element).find('.progress-bars').css('background-color', 'rgba(255,0,0,1)');
              }
          };
          initProgressBar();
          scope.$watch('progressValue', function(newVal, oldVal){
              if(newVal === oldVal){
                  return;
              }
              initProgressBar();
          });
          
      }
    };
}]);