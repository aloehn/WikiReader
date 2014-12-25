app.controller('SearchController', ['$scope', '$location', '$routeParams',
    function ($scope, $location, $routeParams) {
        var wiki = new Wikipedia('en');
        var keypressTimeout = null;
        var requestStarted = null;
        $scope.searchText = $routeParams.articleName;
        $scope.results = [];

        setTimeout(function () {
            $('#search input')[0].select();
        }, 500);

        if ($scope.searchText) {
            search($scope.searchText, 20);
        }

        $scope.search = function (searchTerm) {
            if (keypressTimeout)
                clearTimeout(keypressTimeout);

            $location.path("/search/" + searchTerm);
        };

        $scope.keypress = function (userInput, $event) {
            if (keypressTimeout)
                clearTimeout(keypressTimeout);

            console.log($event.which);

            switch ($event.which) {
            case 38: // arrow up
                moveSelection(-1);
                break;
            case 40: // arrow down
                moveSelection(1);
                break;
            case 13: // Enter
                if ($scope.result.selected) {
                    setTimeout(function () {
                        $scope.result.selected.trigger('click');
                    }, 0);
                    $event.preventDefault();
                }
            }

            if ($event.which < 32) {
                return;
            }

            keypressTimeout = setTimeout(function () {
                if ($scope.searchText.length > 2) {
                    search($scope.searchText);
                }
            }, 300);
        }

        $scope.open = function (articleName) {
            $location.path("/article/" + articleName);
        };


        function search(searchTerm, limit) {
            searchTerm = searchTerm.trim();
            requestStarted = new Date();

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

        $scope.unselect = function() {
            if ($scope.result.selected) {
                $scope.result.selected.removeClass('selected');
                $scope.result.selectedIndex = 0;
            }
        };

        function moveSelection(step) {
            var index = 0;
            var result = $scope.result;
            if (!result)
                return;

            if (result.elements) {
                index = result.selectedIndex;
                var selected = result.selected || result.elements.eq(index);
                selected.removeClass('selected');
                index += step;
                index = Math.max(index, 0);
                index = Math.min(index, result.elements.length - 1);
            } else {
                result.elements = $('#results a');
            }

            result.selected = result.elements.eq(index)
                .addClass('selected');
            result.selectedIndex = index;
        }
}]);