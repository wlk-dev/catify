// document.body.style.backgroundImage = "url(./assets/image/pexels-karina-badura-6982650.jpg)"

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
    nat : "",
}


// Util functions
function getRandomChoice( array ) {
    return array[ Math.floor(Math.random() * array.length) ];
}

function getValidEntry ( entry, entries ) {
    if ( entries.includes(entry) ) {
        console.log(entry)
        return entry;
    }
    return getRandomChoice(entries)
}


// API functions
function addCatData ( cardData ) {
    $.getJSON("assets/json/sorted_breeds.json", (breedData) => {
        let nat = getValidEntry(cardData.nat, breedData.all_codes)
        let catBreed = getRandomChoice( breedData[ nat ] );
        cardData.cat_img_url = catBreed.image.url;
        cardData.cat_breed = catBreed.name;
        cardData.cat_ref = catBreed;
        cardData.nat = nat;
    });
    return cardData;
}


//Api for age -agify.io
function getApiAgify(cardData) {

  var requestUrl = `https://api.agify.io?name=${cardData.name}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data)
      // console.log(data.age)
      cardData.age = data.age
    })
};

//Api for Nationality -nationalize.io
function getApiNationalize(cardData) {

  var requestUrl = `https://api.nationalize.io?name=${cardData.name}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // console.log(data)
      // console.log(data.country[0].country_id)
      cardData.nat = data.country[0].country_id
      cardData.all_nats = data.country


     
    })
};

//Api for Gender -genderize.io/
function getApiGenderize(cardData) {

  var requestUrl = `https://api.genderize.io?name=${cardData.name}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      // console.log(data.gender)
      cardData.gender = data.gender

    })
};


getApiAgify(cardData);
getApiNationalize(cardData);
getApiGenderize(cardData);

console.log(cardData);

