app.controller('SearchController', ['$scope', '$location', '$routeParams', '$route',
    function ($scope, $location, $routeParams, $route) {
        var wiki = new Wikipedia(app.settings.language);
        var keypressTimeout = null;
        var requestStarted = null;

        $scope.searchText = $routeParams.articleName || '';
        $scope.results = [];
        $scope.pageClass = 'page-search';

        // Auto focus the input box.
        setTimeout(function () {
            $('#search input')[0].select();
        }, 500);

        // Start search of the url contains a search text.
        if ($scope.searchText) {
            search($scope.searchText, 10);
        }

        $scope.search = function (searchTerm) {
            if (keypressTimeout)
                clearTimeout(keypressTimeout);

            search(searchTerm, 20)
        };

        // Check the user input and begin search automatically if the input seems OK.
        $scope.keypress = function (userInput, $event) {
            if (keypressTimeout)
                clearTimeout(keypressTimeout);

            if ($event.which < 32) {
                return;
            }

            keypressTimeout = setTimeout(function () {
                if ($scope.searchText.length > 2) {
                    search($scope.searchText);
                }
            }, 300);
        }

        /**
        *   Opens an article.
        */
        $scope.open = function (articleName) {
            $location.path("/article/" + articleName);
        };

        /**
        *   Searches for the user input and updates the url.
        */
        function search(searchTerm, limit) {
            searchTerm = searchTerm.trim();
            requestStarted = new Date();

            $location.path("/search/" + $scope.searchText);

            if ($scope.result && $scope.result.searchText === searchTerm)
                return;

            wiki.searchFor(searchTerm, limit, function (data) {
                $scope.result = {
                    searchText: searchTerm,
                    list: data,
                    time: new Date() - requestStarted
                };

                $scope.$apply();
            });
        };

        // If the url was changed because a new search text was entered,
        // the application doesn't need to update the whole page.
        var lastRoute = $route.current;
        $scope.$on('$locationChangeSuccess', function (event) {
            if ($route.current.templateUrl == '/view/search')
                $route.current = lastRoute;
        });
}]);