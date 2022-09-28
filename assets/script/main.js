// CREDIT ALL API's

// expected input : YOUR_NAME, COLOR ( drop menu initially, updated to new tech color picker  ) 
// ^^^ check edgecases on invalid name input

// initial object 
// {
//     name : user_name
// }

// get nationality, based on name : https://nationalize.io/ ( save all country id's and probablities )
// save highest probablity of nationality as main nationality
// get age, basedon name and nationality : https://agify.io/ 
// get gender, based on name and nationality : https://genderize.io/ ( use localization )

// save this to local vvv
// dictionary of country_id to an array of cat objects ( randomly choose from array )
// use this to get breed_id ^^^
// use breed_id to get the image and other information

// expected output
// { 
//     name : usr_name,
//     card_color, color,
//     nat : main_nationality,
//     all_nats : all_nationalities,
//     flag : flag_url,
//     age : age,
//     gender : gender
//     cat_img_url : url,
//     breed_name : cat_breed,
//     ref : cat_obj,
//  }


// IMPORTANT: ALL API FUNCTIONS MUST TAKE CARD DATA OBJECT AND OUTPUT CARD DATA OBJECT
// TODO: add getter functions to retrieve data
var cardData = {
    name : "gary",
    nat : "US",
    // function : getCatImgURL instead
}

function getRandomChoice( array ) {
    return array[ Math.floor(Math.random() * array.length) ];
}

function getValidEntry ( entry, entries ) {
    if ( entries.includes(entry) ) {
        return entry;
    }
    return getRandomChoice(entries)
}

function addCatData ( cardData ) {
    $.getJSON("assets/json/sorted_breeds.json", (breedData) => {
       let catBreed = getRandomChoice( breedData[ getValidEntry(cardData.nat, breedData.all_codes) ] );
       cardData.cat_img_url = catBreed.image.url;
       cardData.cat_breed = catBreed.name;
       cardData.cat_ref = catBreed;
    });
    return cardData;
}