// document.body.style.backgroundImage = "url(./assets/image/pexels-karina-badura-6982650.jpg)"

// CREDIT ALL API's

// expected input : YOUR_NAME, COLOR ( drop menu initially, updated to new tech color picker  ) 
// ^^^ check edgecases on invalid name input





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

//Global Variables:

// var cardData = {
//   name : "gary",
//   cat_id : "hbro"
// }



//Theme color pallet
document.addEventListener('coloris:pick', event => {
    //themeColor class(font, welcome)
    setThemeColor(event.detail.color)
    //button background-color
    $("#submit-user-name").css("background-color", event.detail.color)
  });


$('#submit-user-name').on("click", function (event) {
  var cardData = {
    name : "",
  }

  event.preventDefault();

  var username = $('#user-name-input')

  if (onlyLetters(username.val())){
    cardData.name = username.val().toLowerCase()
    cardData.original_name = username.val()
  } else {alert ("invalid input, use letters only")}

  cardData.card_color = $("#colorisVal").val() || "red";
  setThemeColor(cardData.card_color)

  const progressBar = document.querySelector('.progress-bar')
  progressBar.setAttribute('id', 'play-animation')
  const disappear = document.getElementById('disappear')
  disappear.style.display = 'none'

  // catify( cardData, nextPage );

  nextPage( cardData );
});

// Util functions
function setThemeColor ( color ) {
  let themeColor = $(".themeColor")
  themeColor.css("color", color);
}

function getStored (){
  // data to retrive goes here
  return JSON.parse(localStorage.getItem("stored-objs"))
}

function setStorage (data){
  // data to store goes here
  localStorage.setItem("stored-objs",JSON.stringify(data))
}

function updateStorage ( cardData ) {
  let storedData = getStored() || [];
  storedData.push( {name : cardData.original_name, cat_id : cardData.cat_id} )
  setStorage( storedData )
}

function getCatObj (cardData, breeds) {
  console.log("Retrieving cat object...", cardData.nat)
  let nat = cardData.nat;
  let catID = !!cardData.cat_id ? cardData.cat_id : "";
  if ( catID ) {
    for ( const idx in breeds[nat] ) {
      if ( breeds[nat][idx].id === catID ) {
        return breeds[nat][idx];
      }
    }
    console.warn("Could not find target_breed of ", catID, " randomly choosing...")
  }
  return getRandomChoice( breeds[nat] );
}

function getRandomChoice(array) {
  console.log("Choosing random value from array : ", array)
  return array[Math.floor(Math.random() * array.length)];
}

function getValidEntry(entry, entries) {
  console.log(`Validating entry of ${entry} from entries : ${entries} result : ${entries.includes(entry)}`)
  if (entries.includes(entry)) {
    return entry;
  }
  return getRandomChoice(entries)
}

function onlyLetters(str) {
  return /^[a-zA-Z]+$/.test(str);
}

// API functions
function getApiCat(cardData) {
  $.getJSON("assets/json/sorted_breeds.json", (breedData) => {
    cardData.nat = getValidEntry(cardData.nat, breedData.all_codes) // Validate our NAT with available NATs
    let catBreed = getCatObj( cardData, breedData );
    cardData.cat_img_url = catBreed.image.url;
    cardData.cat_breed = catBreed.name;
    cardData.cat_id = catBreed.id
    cardData.cat_ref = catBreed;
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

function nextPage ( cardData ) {
  window.open( "result.html?" + new URLSearchParams( cardData ), "_self" )
}

function catify( cardData, callback ) {
  let apis = [ getApiCat, getApiAgify, getApiGenderize, getApiFlag ];

  getApiNationalize( cardData );

  setTimeout( () => {
    console.log("Retrieved nat data... COUNTRY_CODE:", cardData.nat) // Wait until we get nat data before we run the other API's

    if (!cardData.nat) {
      console.warn( "Most likely failed to retrieve nat data in time...\nDefaulting to US" )
      cardData.nat = "US"
    }

    for ( const idx in apis ) {
      let currentAPI = apis[idx];
      currentAPI( cardData );
    }

    setTimeout( () => {
      console.log("Resolved data...")
      updateStorage( cardData );
      callback(cardData); // nextPage(cardData)
    }, 100 );

  },500)

}

