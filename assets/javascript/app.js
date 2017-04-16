var topics = ["Trending", "My Little Pony", "Steven Universe", "One Punch Man", "Markiplier", "Frozen", "Zootopia", "Anime",
						"Programming", "Cats", "Dogs", "Family Guy", "American Dad", "The Simpsons", "Futurama", "Memes", 
						"Erick Rivas", "Seth Gibson", "Ke Yang"];

var queryURL = "http://api.giphy.com/v1/gifs/search?q=";
var querySearchTerm = "";
var queryURLEnding = "&api_key=dc6zaTOxFJmzC&limit=10";
const MAX_NUM_ITEMS_PER_ROW = 12;

// initialization and event listeners
$(document).ready(initialize);
$(document).on("click",".result",displayGifs);
$(document).on("click",".gif",function()
	{
		// swap out the still for the moving and the moving for the still
		if($(this).data("isMoving") == false)
		{
			$(this).attr("src",$(this).data("moving"));
			$(this).data("isMoving", true);
		}

		else
		{
			$(this).attr("src",$(this).data("still"));
			$(this).data("isMoving", false);
		}
	});

// initialization
function initialize()
{
	var resultsSection = $("#search-results");
	var newDiv = $("<div>");
	newDiv.attr("class","results row");
	var divCount = newDiv.length;
	for(var i = 0; i < topics.length; i++)
	{
		// if there are too many spans on the row
		if(newDiv.children().length == MAX_NUM_ITEMS_PER_ROW)
		{
			// add it and make a new one
			resultsSection.append(newDiv);
			newDiv = $("<div>");
			newDiv.attr("class","results row");
		}

		// make a new span for the topic
		var newSpan = $("<span>");
		newSpan.attr("class","bg-info result");
		newSpan.attr("data-name", topics[i]);
		newSpan.html(topics[i]);
		newDiv.append(newSpan);
	}

	resultsSection.append(newDiv);

	// add a listener to the submit button
	$("#submit-btn").on("click", function(event)
	{
		event.preventDefault();
		var resultsSection = $("#search-results");

		// create the new topic
		var newTopic = $("#search-bar").val().trim();
		topics.push(newTopic);
		var newSpan = $("<span>");
		newSpan.attr("class","bg-info result");
		newSpan.attr("data-name", newTopic);
		newSpan.html(newTopic);

		var oldDiv = resultsSection.children().last();

		// if the previous last div is full, then make a new one
		if(oldDiv.children().length == MAX_NUM_ITEMS_PER_ROW)
		{
			var newDiv = $("<div>");
			newDiv.attr("class","results row");
			newDiv.append(newSpan);
			resultsSection.append(newDiv);
		}

		// otherwise just add it to the old div
		else
		{
			oldDiv.append(newSpan);
		}
	});
}

// turn a string with spaces into a string with +'s
function parseString(string)
{
	var parsedVersion = "";
	for(var i = 0; i < string.length; i++)
	{
		if(string[i] != " ")
			parsedVersion += string[i];
		else
			parsedVersion += "+";
	}
	return parsedVersion;
}

// display the Gifs onscreen
function displayGifs()
{

	// let the user know which topic is selected
	var spans = $(".results").children();

	// because it returns the element as a regular element, use normal javascript to change it
	for(var i = 0; i < spans.length; i++)
	{
		spans[i].className = "bg-info result";
	}

	$(this).attr("class", "bg-primary result");

	// get the full query url
	var searchTerm = $(this).data("name");
	querySearchTerm = parseString(searchTerm);
	$.ajax(
	{
		url : queryURL + querySearchTerm + queryURLEnding,
		method : "GET"
	}).done(function(response)
	{
		// clear the main content
		// testing this to see if it will erase the event listener for starting and stopping the gifs
		var mainContent = $("#mainContent");
		mainContent.empty();

		// and display each gif
		for(var i = 0; i < response.data.length; i++)
		{
			var newGifDiv = $("<div>");
			var newImg = $("<img>");
			// so that I don't have to keep asking, I'm just storing each link in a data-attribute
			var stillLink = response.data[i].images.fixed_height_still.url;
			var movingLink = response.data[i].images.fixed_height.url;
			newImg.data("moving", movingLink);
			newImg.data("still", stillLink);
			newImg.data("isMoving", false);
			newImg.attr("src", stillLink);
			newImg.attr("class", "gif");
			newGifDiv.attr("class", "imgBlock");
			var width = parseInt(response.data[i].images.fixed_height.width) + 20;
			newGifDiv.css("width", width.toString() + "px");
			newGifDiv.html("<p>Rating: " + response.data[i].rating.toUpperCase() + "</p>");
			newGifDiv.prepend(newImg);
			mainContent.append(newGifDiv);
		}
	});
}