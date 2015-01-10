app.controller('ArticleController', ['$scope', '$location', '$routeParams', '$sce', '$anchorScroll',
    function ($scope, $location, $routeParams, $sce) {

        var wiki = new Wikipedia(app.settings.language);
        var linkRegex = new RegExp('href="/wiki/(((?!").)+)', 'g');
        var hashRegex = new RegExp('href="#(((?!").)+)', 'g');

        $scope.articleName = $routeParams.articleName;
        $scope.pageClass = 'page-article';

        
        // Scroll smoothly to the top.
        $('body').animate({
            scrollTop: '0'
        }, $('body').scrollTop());

        
        // If the article name isn't specified, go back to search.
        if (!$scope.articleName) {
            $location.path('/');
        }

        
        // Load the article from the Wikipedia module.
        wiki.getArticle($scope.articleName, function (response) {
            if (!response) {
                $scope.error = true;
                $scope.$apply();
                return;
            }
            
            // Set the article content.
            $scope.content = $sce.trustAsHtml(adjustLinks(response.text['*']));
            $scope.$apply();
            
            // Adjust the images afterwards.
            setTimeout(function () {
                adjustImages()
            }, 0);
        });

        
        /**
        *   Cleans up the links in the article content.
        *   Some links would crash if they get clicked.
        */
        function adjustLinks(html) {
            
            // Fix the table of contents links
            html = html.replace(hashRegex, "href=\"javascript: document.getElementById('$1').scrollIntoView();");
            
            // Fix all Wikipedia internal links.
            html = html.replace(linkRegex, 'href="#/article/$1');
            
            return html;
        }

        /**
        *   Set the link around all image to the full size image.
        */
        function adjustImages() {
            var article = $('#article');
            var regex = new RegExp("/((?!/).)+$|/thumb", "g");

            article.find('img').each(function (i, e) {
                $(e).parent('a')
                    .attr('href', e.src.replace(regex, ''));
            });
        }
}]);