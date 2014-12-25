app.controller('ArticleController', ['$scope', '$location', '$routeParams', '$sce',
    function ($scope, $location, $routeParams, $sce) {
        
        var wiki = new Wikipedia('en');
        $scope.articleName = $routeParams.articleName;
        
        if ($scope.articleName) {
            wiki.getArticleContent($scope.articleName, function (html) {
                $scope.content = $sce.trustAsHtml(html);
                $scope.$apply();
            });
        }
}]);