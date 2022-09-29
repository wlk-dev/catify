// document.body.style.backgroundImage = "url(./assets/image/pexels-karina-badura-6982650.jpg)"

// CREDIT ALL API's
var cardData = {
  name: "gary",
  nat: "",
}

// expected input : YOUR_NAME, COLOR ( drop menu initially, updated to new tech color picker  ) 
// ^^^ check edgecases on invalid name input
var username = $('#user-name-input')
var catifyBtn = $('#submit-user-name')
function onlyLetters(str) {
  return /^[a-zA-Z]+$/.test(str);
}
catifyBtn.on("click", function (event) {
  console.log(event.target)
  console.log(username.val().toLowerCase())


  if (onlyLetters(username.val())){
    cardData.name = username.val().toLowerCase()
    cardData.original_name = username.val()
  } else {alert ("invalid input, use letters only")}
  
  console.log (cardData)
})








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
// REMOVE: Sample data
var cardData = {
    name : "gary",
    nat : "",
}
// TODO: add getter functions to retrieve data


// Util functions
function getRandomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getValidEntry(entry, entries) {
  if (entries.includes(entry)) {
    console.log(entry)
    return entry;
  }
  return getRandomChoice(entries)
}

// API functions
function addCatData(cardData) {
  $.getJSON("assets/json/sorted_breeds.json", (breedData) => {
    let nat = getValidEntry(cardData.nat, breedData.all_codes)
    let catBreed = getRandomChoice(breedData[nat]);
    cardData.cat_img_url = catBreed.image.url;
    cardData.cat_breed = catBreed.name;
    cardData.cat_ref = catBreed;
    cardData.nat = nat;
  });
  return cardData;
}

function getApiFlag( cardData, flag_width="w20" ) {
  cardData.flag_img_url = `https://flagcdn.com/${flag_width}/${cardData.nat}.png`;
  return cardData;
}

//Api for age -agify.io
function getApiAgify(cardData) {
  var requestUrl = `https://api.agify.io?name=${cardData.name}&country_id=${cardData.nat}`;

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
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
      cardData.gender = data.gender
    })
};


// General API flow, encapsulate into flow function
// TODO: add a delay between each API call so we can ensure that the object state has been resolved
getApiNationalize(cardData);
getApiCat(cardData)
getApiAgify(cardData);
getApiGenderize(cardData);
getApiFlag(cardData)

// setTimeout(function()
//   {
//       var a = cardData.age;
//       console.log(a)

//   },
// 100);

