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