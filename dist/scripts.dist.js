var pokemonRepository=function(){var t=[],e="https://pokeapi.co/api/v2/pokemon/?limit=150";function n(e){t.push(e)}function o(t){pokemonRepository.loadDetails(t).then(function(){a(t)})}function a(t){$("#modal-body").html(""),$("h5").html(t.name.charAt(0).toUpperCase()+t.name.slice(1));var e=$('<img src="'+t.imageUrl+'">');$("div.pokemon-img").html(e),$("div.pokemon-height").html("Height: "+t.height+"m"),$("div.pokemon-types").html("Type(s): "+t.types)}return{add:n,catchAll:function(){return t},addListItem:function(t){var e=$(".list-group"),n=$("<li></li>");e.append(n);var a=$('<button type="button" data-toggle="modal" data-target="#pokemonModal"</button>');a.text(t.name),n.append(a),a.on("click",function(){o(t)})},search:function(e){t.filter(function(t){if(t.name===e)return t})},showDetails:o,loadList:function(){return $.ajax(e,{dataType:"json"}).then(function(t){$.each(t.results,function(t,e){n({name:e.name.charAt(0).toUpperCase()+e.name.slice(1),detailsUrl:e.url})})}).catch(function(t){console.write(t)})},loadDetails:function(t){var e=t.detailsUrl;return $.ajax(e).then(function(e){t.imageUrl=e.sprites.front_default,t.height=e.height,2==e.types.length?t.types=[e.types[0].type.name,e.types[1].type.name]:t.types=[e.types[0].type.name]}).catch(function(t){console.error(t)})},showModal:a}}();pokemonRepository.loadList().then(function(){pokemonRepository.catchAll().forEach(function(t){pokemonRepository.addListItem(t)})});
