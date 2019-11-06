// Wraps repository within IIFE
var pokemonRepository = (function () {
 var repository = [];
 // Creates variable for index 'ul' with pokemonList class
 var $pokemonList = $('ul');
 var $modalContainer = $('#modal-container');
 var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

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
   // create 'li'
   var $listItem = $('<li></li>');
   // Add 'li' to $pokemonList
   $pokemonList.append($listItem);
   // Create button with class and inner text as pokemon.name
   var $button = $('<button>');
   // Add inner text to button
   $button.text(pokemon.name);
   // Add class to button
   $button.addClass('pokemon-name');
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

   // $modalContainer.empty();
   $modalContainer.html('');

   var $modal = $('<div class="modal"></div>');

   var $closeButtonElement = $('<button class="modal-close">Close</button');
   $closeButtonElement.on('click', function() {
     hideModal();
   })

   var $nameElement = $('<h1>');
   $nameElement.html(item.name.charAt(0).toUpperCase() + item.name.slice(1));

   var $imageElement = $('<img src="' + item.imageUrl + '">');
   $imageElement.addClass('modal-img');

   var $heightElement = $('<p>Height: ' + item.height + 'm</p>');

   var $typesElement = $('<p>Type(s): ' + item.types + '</p>');

   $modal.append($closeButtonElement);
   $modal.append($nameElement);
   $modal.append($imageElement);
   $modal.append($heightElement);
   $modal.append($typesElement);
   $modalContainer.append($modal);

   $modalContainer.addClass('is-visible');
 }

// Function to close the modal
 function hideModal() {
   $modalContainer.removeClass('is-visible');
 }

// Press escape key to close modal
 $(document).on('keydown', function(event)  {
   if (event.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
       hideModal();
     }
   });

// Click outside of the modal to close the modal
$modalContainer.on('click', function(event) {
  // Since this is also triggered when clicking INSIDE the modal
  // I only want the modal to close if the user clicks directly on the overlay
  var target = event.target;
  if (event.target === this) {
    hideModal();
  }
});

 return {
   add: add,
   catchAll: catchAll,
   addListItem: addListItem,
   search: search,
   showDetails: showDetails,
   loadList: loadList,
   loadDetails: loadDetails,
   showModal: showModal,
   hideModal: hideModal
 };
})();

// forEach Used To cycle through addListItem function properties
pokemonRepository.loadList().then(function() {
  // Now the data is loaded
  pokemonRepository.catchAll().forEach(function(pokeList) {
    pokemonRepository.addListItem(pokeList);
  });
});
