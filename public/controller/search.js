wikiReaderApp.controller('SearchController', function ($scope) {

    var wiki = new Wikipedia('en');
    
    $scope.results = [];

    $scope.search = function (searchTerm) {
        wiki.searchFor(searchTerm, function(data) {
            window.test = data;
            console.log("result:", data);
        });
    };
});