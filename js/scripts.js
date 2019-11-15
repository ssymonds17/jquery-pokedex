// Wraps repository within IIFE
var pokemonRepository = (function () {
 var repository = [];
 // Creates variable for index 'ul' with pokemonList class
 var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
 /* global $*/

// Adds new Pokemon to var repository
 function add(pokemon) {
   repository.push(pokemon);
 }

// Function used to return Pokemon object array
 function catchAll() {
   return repository;
 }

// Function to search repository for Pokemon
 function search(searchName) {
   repository.filter(function(pokemon) {
     if (pokemon.name === searchName) {
       return pokemon;
     }
  });
 }

// Function to add a list for each Pokemon object
 function addListItem(pokemon) {
   // Define list group
   var $pokemonList = $('.list-group');
   // Create list items
   var $listItem = $('<li></li>');
   // Add 'li' to $pokemonList
   $pokemonList.append($listItem);
   // Create button with class and inner text as pokemon.name
   var $button = $('<button type="button" data-toggle="modal" data-target="#pokemonModal"</button>');
   // Add Pokemon name to button
   $button.text(pokemon.name);
   // Add button to 'li'
   $listItem.append($button);
   // Calls showDetails function when button is clicked
   $button.on('click', function () {
     // showModal(pokemon);
     showDetails(pokemon);
   });
 }

 // // Function to show details of each Pokemon
 function showDetails(pokemon) {
   pokemonRepository.loadDetails(pokemon).then(function () {
     showModal(pokemon);
   });
 }

// Function to load Pokemon list from API
 function loadList() {
   // Replace fetch with Ajax
   return $.ajax(apiUrl, { dataType: 'json' })
   .then(function(item) {
     $.each(item.results, function(index, item) {
       var pokemon = {
         name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
         detailsUrl: item.url
       };
       add(pokemon);
     });
   }).catch(function(error) {
     /* eslint-disable no-console */
     console.write(error);
   });
 }

// Load details of each Pokemon that is clicked
 function loadDetails(item) {
   var url = item.detailsUrl;
   // Changed fetch to ajax
   return $.ajax(url)
   .then(function(details) {
     // Now we add details to the item
     item.imageUrl = details.sprites.front_default;
     item.height = details.height;
     // item.types = Object.keys(details.types);
     if (details.types.length == 2 ) {
			item.types = [details.types[0].type.name, details.types[1].type.name];
		} else {
			item.types = [details.types[0].type.name];
		}
  }).catch(function(error) {
     console.error(error);
   });
 }

 // Function to show modal for Pokemon data
 function showModal(item) {
   // Removes the html from the modal so it is clear when it is reopened
   $('#modal-body').html('');

   var $nameElement = $('h5');
   $nameElement.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));

   var $imageElement = $('<img src="' + item.imageUrl + '">');
   $('div.pokemon-img').html($imageElement);

   $('div.pokemon-height').html('Height: ' + item.height + 'm');

   $('div.pokemon-types').html('Type(s): ' + item.types);
 }

 return {
   add: add,
   catchAll: catchAll,
   addListItem: addListItem,
   search: search,
   showDetails: showDetails,
   loadList: loadList,
   loadDetails: loadDetails,
   showModal: showModal,
 };
})();

// forEach Used To cycle through addListItem function properties
pokemonRepository.loadList().then(function() {
  // Now the data is loaded
  pokemonRepository.catchAll().forEach(function(pokeList) {
    pokemonRepository.addListItem(pokeList);
  });
});
