var appRoot = angular.module('progressbar', ['ui.router']);

appRoot.config([ '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
    "use strict";
  $urlRouterProvider.otherwise('/');
  //
  // Now set up the states
  $stateProvider
    .state('progressBarList', {
      url: '/',
      templateUrl: "templates/mainViews/progressBarList.html"
    });
}]);
appRoot.controller('ProgressBarController',[ '$scope', '$rootScope', 'progressBarListApi', function($scope, $rootScope, progressBarListApi){

    "use strict";
    
    $scope.progresBarList = [];
    $scope.buttonList = [];
    $scope.limitValue = 0;
    progressBarListApi.getProgressBarListData().then(
    function(response){
        $scope.progresBarList = response && response.bars? response.bars:[];
        $scope.buttonList = response && response.buttons? response.buttons:[];
        $scope.limitValue = response && response.limit? response.limit:0;
        console.log('response:',response);
    },
    function(error){
        console.log(error);
    }
    );
    var selectedIndex = 0;
    $scope.$watch('selectedProgressBar', function(newVal, oldVal){
        if(!newVal && newVal === oldVal){
          return;  
        }
        var temp = newVal.replace('Progress Bar ','');
        selectedIndex = parseInt(temp);
        console.log('$scope.selectedProgressBar:',$scope.selectedProgressBar,selectedIndex);
        
    });
    $scope.changeProgressBar = function(value){
        if($scope.selectedProgressBar){
            $scope.progresBarList[selectedIndex] = $scope.progresBarList[selectedIndex]*1 + parseInt(value);
            console.log('$scope.progresBarList[selectedIndex]',$scope.progresBarList[selectedIndex]);
        }
    };
}]);
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
appRoot.service('progressBarListApi',['$http', '$q', function($http, $q){
    "use strict";
    this.getProgressBarListData = function(){
        var defer = $q.defer();
            $http.get('http://pb-api.herokuapp.com/bars')
            .then(
                function(data){
                    if(data.data){
                       defer.resolve(data.data);
                    }else{
                        defer.reject("No data Available");
                    }
                },function(err){
                    defer.reject("No data Available");
                });
        
        return defer.promise;
    };
}]);