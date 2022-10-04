# Catify
By William, Mariam, Tarek & Dong 


## Description

Catify is a tool designed to Catify the users’ information based on their name and theme color. Catify uses data from many different origins to gather information and provide the user a prediction of their age, gender and nationalization. In addition, Catify will present the user the most compatible cat to them based on the data gathered. 

Users will enjoy comparing previously searched data and will also have the advantage of reading more information about their cat breed. 

The motivation behind this project was to build a fun interactive game that leverages various APIs.

We faced several challenges in this particular project. Right off the bat, our project incorporates a user input form (username). We decided to use an additional technology called Coloris, which was challenging to build an event listener on since it’s not a traditional form. We referenced the manufacture’s documents to resolve the issue. From there, our project takes both the name and the coloris RBG value and passes it through to four APIs which was also a challenging work follow because of the timing of the API requests. To overcome that, we wrote a timeout function that allows the APIs results to come in the appropriate order. Lastly, we used additional animations on our logos to create a great user experience.                           
                            

## Installation 
This code does not require any installation. The HTMLs, JavaScrip files, CSS and images are provided. You can simply click the URL for the finished product.

## Usage 

Catify is very simple and straight forward to use, as shown in the screenshot, user will enter their name and preferred theme color and click submit. User will be redirected to second page with results and displayed in the main card. user will have to option to click "Home" link on the left top of the page and will be sent back to the input page where they can enter another name and click submit again. user will see a new set of data and the previously entered data will be pushed down to the bottom card. User will have an arrow option on both sides of the page to switch between card data. user also will have the option to click on a link that will direct them to Wikipedia page with information about the specific breed. 


## Credits 

[Gender API](https://genderize.io/?ref=apilist.fun)

[Age API](https://agify.io/)

[Nationality API](https://nationalize.io/)

[Cat API](https://thecatapi.com/)

[Flag API](https://flagpedia.net/download/api)


## License 

MIT License

Copyright (c) 2022 will

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


## features 

Our tech stack consists of bootstrap html to create two sperate pages. The first page uses two input forms, one for username and the other for user color which was a new technology called Coloris. From there, the data is fed to an object that calls on four different APIs. We used a timeout function to better control the order of the API requests and results. The data is then stored into an object which populates the result, a user generated card. In addition, as the user plays additional times, the data saves to local storage and creates “saved cards” dynamically at the bottom of the page using JQuery. We then used an additional technology called Swiper as well as various animations to enhance the user interface.