app.controller('VideoController', ['$scope', '$sce', function($scope, $sce) {

	$scope.videos = [

		{
			link : '//www.youtube.com/embed/qRm0BheSR_Q',
			title : 'Spearfishing with GATKU Polespears',
			shortTitle : 'At the Bahamas',
			description : 'Video blog by Ted from Ted\'s Holdover about a hunting trip to the Bahama\'s using a GATKU Polespear.'
		},
		{
			link : '//www.youtube.com/embed/aspLQ0hPoo0',
			title : 'Break Away Setup',
			shortTitle : 'Break Away Setup',
			description : 'How to rig your own SLIP-TIP with break away system -'
		},
		{
			link : '//www.youtube.com/embed/xxbnO8oa72k',
			title : 'Carp Killers',
			shortTitle : 'Carp Killers',
			description : 'Michael Dong and Dustin McIntyre tour Lake Mead to exterminate the invasive carp. The local ecosystem thanks them. All fish were killed with GAT-KU hybrid polespears.'
		},
		{
			link : '//www.youtube.com/embed/CvRSkoTYq3s',
			title : 'GATKU Gen-2 Polespears go to Baja',
			shortTitle : 'GATKU Gone Baja',
			description : 'Ryan Gattoni takes GATKU hybrid polespears south of the border in this short video.'
		},
		{
			link : '//www.youtube.com/embed/8-eQhtrsdu8',
			title : 'Nautilus Review',
			shortTitle : 'Nautilus Review',
			description : 'Video review of the GATKU Gen 2 Hybrid Polespear by Nautilus Spearfishing.'
		},
		{
			link : '//www.youtube.com/embed/F3FEIE7rFsw',
			title : 'Spearfishing in the Exumas',
			shortTitle : 'In the Exumas',
			description : 'Hunting Tiger Groupers and a close encounter with a shark. Video by Eric Poeltl. GATKU Polespear + Slip-Tip head used.'
		}
	];

	$scope.activeVideo = {};

	$scope.init = function() {

		$scope.setActiveVideo(0);
		ResponsiveVideo.init();	

	}

	$scope.setActiveVideo = function(index) {

		var embedToBeTrusted = String($scope.videos[index].link);

		$scope.activeVideo = $scope.videos[index];
		$scope.activeVideo.link = $sce.trustAsResourceUrl(embedToBeTrusted);

	}

	$scope.init();

}]);