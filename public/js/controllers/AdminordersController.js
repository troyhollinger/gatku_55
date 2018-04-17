app.controller('AdminordersController', ['$scope', 'Order','$http', function($scope, Order, $http) {

	var gatkuOrder = this;
    gatkuOrder.orders = []; 
    gatkuOrder.pageno = 1; 
    gatkuOrder.itemsPerPage = 15; 
    gatkuOrder.getData = function(pageno,start_date, end_date){
        gatkuOrder.orders = [];

        var Url = "/orderall/" + gatkuOrder.itemsPerPage + "/" + pageno;
        try{
            if($scope.order_start_date){
                Url = Url + "/" + $scope.order_start_date;
            }
            if($scope.order_end_date){
                Url = Url + "/" + $scope.order_end_date;
            }
        }catch(e){

        }
        $http.get(Url).success(function(response){
            $scope.orders = response.data;
            gatkuOrder.orders = response.data;
            gatkuOrder.total_count = response.total_count;
        });
    };
    
    gatkuOrder.getData(gatkuOrder.pageno); 
    gatkuOrder.searchOrder = function(){ 
        if($scope.order_start_date){
             gatkuOrder.getData(1, $scope.order_start_date, $scope.order_end_date);    
            }else{
                alert('select start date');
            }
     };


    gatkuOrder.resetDateFilter = function() {
        $scope.order_start_date = ''
        $scope.order_end_date = '';
        gatkuOrder.getData(1, $scope.order_start_date, $scope.order_end_date);
    }
}]);



