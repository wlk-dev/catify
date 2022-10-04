// CREDIT ALL API's
// IMPORTANT: ALL API FUNCTIONS MUST TAKE CARD DATA OBJECT AND OUTPUT CARD DATA OBJECT

//ROUGH DRAFT DOM
let mySwiper = $('.swiper-wrapper')


const domElements = $(`
<div class="swiper-slide card">
<div class="card-content">
    <div class="image">
        <img src="./assets/image/image1.jpg" alt="Avatar">
    </div>

    <div class="flags">
        <img class="flag" src="https://flagcdn.com/w20/gb.png" width="20" height="12"></img>
        <!-- Placeholder -->
    </div>

    <div class="userNameCat">
        <span class="userName">Person Name</span>
        <span class="catBreed">cat breed</span>
    </div>
</div>
</div>`
);

mySwiper.append(domElements);


// mySwiper.append(swiperSlide)
//   .append(cardContent)
//   .append(imageDiv)
//   .append(image)







//Theme color pallet
document.addEventListener('coloris:pick', event => {
  //themeColor class(font, welcome)
  setThemeColor(event.detail.color)
  //button background-color
  $("#submit-user-name").css("background-color", event.detail.color)

});


$('#submit-user-name').on("click", function (event) {
  var cardData = {
    name: "",
  }

  event.preventDefault();

  var username = $('#user-name-input')

  if (onlyLetters(username.val())) {
    cardData.name = username.val().toLowerCase()
    cardData.original_name = username.val()
  } else { alert("invalid input, use letters only") }

  cardData.card_color = $("#colorisVal").val() || "red";
  setThemeColor(cardData.card_color)

  const progressBar = document.querySelector('.progress-bar')
  progressBar.setAttribute('id', 'play-animation')
  const disappear = document.getElementById('disappear')
  disappear.style.display = 'none'

  nextPage(cardData);
});

// Util functions
function populateMainCard(cardData) {
  $("#breed-img").attr("src", cardData.cat_img_url)
  $("#cat-breed").text(cardData.cat_breed)
  $("#human-name").text(`${cardData.original_name}, ${cardData.age} years old`)
  $("#gender").text(`Gender: ${cardData.gender === "male" ? "♂" : "♀"}`)
  $("#country-code").text(cardData.cat_origin)
  $("#flag-img").attr("src", cardData.flag_img_url)
  // $("#breed-img").css("background-color", white)
  $("#breed-attr")
  $("#wiki-link").text(cardData.cat_ref.wikipedia_url).attr("href", cardData.cat_ref.wikipedia_url)
}

function setThemeColor(color) {
  let themeColor = $(".themeColor")
  themeColor.css("color", color);
}



function getStored() {
  // data to retrive goes here
  return JSON.parse(localStorage.getItem("stored-objs"))
}

function setStorage(data) {
  // data to store goes here
  localStorage.setItem("stored-objs", JSON.stringify(data))
}

function updateStorage(cardData) {
  let storedData = getStored() || {};
  console.log(`STORING DATA : key=${cardData.name}`)
  storedData[cardData.name] = { name: cardData.original_name, cat_id: cardData.cat_id }
  setStorage(storedData)
}

function getCatObj(cardData, breeds) {
  console.log("Retrieving cat object...", cardData.nat)
  let nat = cardData.nat;
  let catID = !!cardData.cat_id ? cardData.cat_id : "";
  if (catID) {
    for (const idx in breeds[nat]) {
      if (breeds[nat][idx].id === catID) {
        return breeds[nat][idx];
      }
    }
    console.warn("Could not find target_breed of ", catID, " randomly choosing...")
  }
  return getRandomChoice(breeds[nat]);
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
  return /^[a-zA-Z]+$/.test(str); // regex fun
}

// API functions
function getApiCat(cardData) {
  $.getJSON("assets/json/sorted_breeds.json", (breedData) => {
    cardData.nat = getValidEntry(cardData.nat, breedData.all_codes) // Validate our NAT with available NATs
    let catBreed = getCatObj(cardData, breedData);
    cardData.cat_origin = catBreed.origin
    cardData.cat_img_url = catBreed.image.url;
    cardData.cat_breed = catBreed.name;
    cardData.cat_id = catBreed.id
    cardData.cat_ref = catBreed;
  });
  return cardData;
}

function getApiFlag(cardData, flag_width = "w20") {
  cardData.flag_img_url = `https://flagcdn.com/${flag_width}/${cardData.nat.toLowerCase()}.png`;
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
    .catch(function (error) {
      cardData.age = 30
      console.log(error)
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
    .catch(function (error) {
      cardData.nat = ""
      console.log(error)
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
    .catch(function (error) {
      cardData.gender = getRandomChoice(["male", "female"])
      console.log(error)
    })

}

function nextPage(cardData) {
  window.open("result.html?" + new URLSearchParams(cardData), "_self")
}

function catify(cardData, callback) {
  let apis = [getApiCat, getApiAgify, getApiGenderize, getApiFlag];

  getApiNationalize(cardData);

  setTimeout(() => {
    console.log("Retrieved nat data... COUNTRY_CODE:", cardData.nat) // Wait until we get nat data before we run the other API's

    if (!cardData.nat) {
      console.warn("Most likely failed to retrieve nat data in time...\nDefaulting to US")
      cardData.nat = "US"
    }

    for (const idx in apis) {
      let currentAPI = apis[idx];
      currentAPI(cardData);
    }

    // cardData = {
    //   "name": "will",
    //   "original_name": "Will",
    //   "card_color": "#871b1b",
    //   "nat": "GB",
    //   "all_nats": [
    //       {
    //           "country_id": "GB",
    //           "probability": 0.105
    //       },
    //       {
    //           "country_id": "AU",
    //           "probability": 0.065
    //       },
    //       {
    //           "country_id": "US",
    //           "probability": 0.065
    //       },
    //       {
    //           "country_id": "NZ",
    //           "probability": 0.06
    //       },
    //       {
    //           "country_id": "CN",
    //           "probability": 0.052
    //       }
    //   ],
    //   "flag_img_url": "https://flagcdn.com/w20/gb.png",
    //   "cat_origin": "United Kingdom",
    //   "cat_img_url": "https://cdn2.thecatapi.com/images/jvg3XfEdC.jpg",
    //   "cat_breed": "Burmilla",
    //   "cat_id": "buri",
    //   "cat_ref": {
    //       "weight": {
    //           "imperial": "6 - 13",
    //           "metric": "3 - 6"
    //       },
    //       "id": "buri",
    //       "name": "Burmilla",
    //       "cfa_url": "http://cfa.org/Breeds/BreedsAB/Burmilla.aspx",
    //       "vetstreet_url": "http://www.vetstreet.com/cats/burmilla",
    //       "temperament": "Easy Going, Friendly, Intelligent, Lively, Playful, Social",
    //       "origin": "United Kingdom",
    //       "country_codes": "GB",
    //       "country_code": "GB",
    //       "description": "The Burmilla is a fairly placid cat. She tends to be an easy cat to get along with, requiring minimal care. The Burmilla is affectionate and sweet and makes a good companion, the Burmilla is an ideal companion to while away a lonely evening. Loyal, devoted, and affectionate, this cat will stay by its owner, always keeping them company.",
    //       "life_span": "10 - 15",
    //       "indoor": 0,
    //       "lap": 1,
    //       "alt_names": "",
    //       "adaptability": 5,
    //       "affection_level": 5,
    //       "child_friendly": 4,
    //       "dog_friendly": 4,
    //       "energy_level": 3,
    //       "grooming": 3,
    //       "health_issues": 3,
    //       "intelligence": 3,
    //       "shedding_level": 3,
    //       "social_needs": 4,
    //       "stranger_friendly": 3,
    //       "vocalisation": 5,
    //       "experimental": 0,
    //       "hairless": 0,
    //       "natural": 0,
    //       "rare": 0,
    //       "rex": 0,
    //       "suppressed_tail": 0,
    //       "short_legs": 0,
    //       "wikipedia_url": "https://en.wikipedia.org/wiki/Burmilla",
    //       "hypoallergenic": 0,
    //       "reference_image_id": "jvg3XfEdC",
    //       "image": {
    //           "id": "jvg3XfEdC",
    //           "width": 960,
    //           "height": 960,
    //           "url": "https://cdn2.thecatapi.com/images/jvg3XfEdC.jpg"
    //       }
    //   },
    //   "gender": "male",
    //   "age": 49
    // }

    setTimeout(() => {
      console.log("Resolved data...")
      console.log(cardData)
      updateStorage(cardData);
      callback(cardData); // nextPage(cardData)
    }, 100);

  }, 500)

}

