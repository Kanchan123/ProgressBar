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