const quoteType = document.getElementById('quotes-select')
const quoteBtn  = document.getElementById('quote-btn')
const bookBtn = document.getElementById('book-btn')
const searchForm = document.getElementById('search-form')
const feed = document.getElementById('book-feed')
const cancelBtn = document.getElementById('cancel-btn');

let getbooksArr = [] // from api //
let books = [] // put data in obj //

let TBR = JSON.parse(localStorage.getItem("TBR")) || []; // TBR //

let currentBook = JSON.parse(localStorage.getItem("TBR")) || []; // current Book //
document.addEventListener("DOMContentLoaded", renderCurrentBook)

document.addEventListener('click', function(e){
    if (e.target.dataset.add){
        addCurrentBookArr(e.target.dataset.add)
    }
    else if (e.target.dataset.remove){
        removeCurrentBook(e.target.dataset.remove)
    }
})

cancelBtn.addEventListener('click', function() {
    clearSearchResults();
});


 //get random background img from API

fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
		document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
		document.getElementById("author").textContent = `By: Dodi Achmad`
    })

  //get random joke from API

    fetch('https://api.api-ninjas.com/v1/jokes?limit=1', {
        method: 'GET',
        headers: { 'x-api-key': 'tOzL18dZudnMvhgYllD9jw==UIr6j1UEZrvwSPe7' }
      })
            .then(res => res.json()) // parse response as JSON
            .then(data => {
              document.getElementById("meme").innerHTML = `<p>${data[0].joke}</p>`
    
            })
            .catch(err => {
                console.log(`error ${err}`)
            }); 


     //get current time
             
function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

 //get weather from API
navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

const key = 'AIzaSyDSvzkJDgfmb3lo8yP04qN0gw2wdKlxXpY'

searchForm.addEventListener("submit", (e) => { 
    e.preventDefault();
    const searchValue =  document.getElementById('book-value').value.trim()

    if (searchValue) {
        feed.innerHTML = '';
        getbooksArr = [];
        books = []
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchValue}&key=${key}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data.items && data.items.length > 0) { 
                    let booksList = data.items;
                    getbooksArr.push(booksList);
                    for (let bookDetails of getbooksArr) {
                        for (let pickedBookArr of bookDetails) {
                            let info = pickedBookArr.volumeInfo;
                            createBooksArr(info);
                        }
                    }
                    for (let book of books) {
                        renderBook(book);
                    }
                    feed.classList.add('book-feed');
                } else {
                    console.log("No books found for the search query.");
                }
            })
            .catch(err => console.error(err));
    }
    
    
    searchForm.reset();
})


function renderBook(item){
    feed.innerHTML += `
                    <div class="book-el">
                        <img src="${item.cover}" class="book-img">
                        <button class="add-btn icon" data-add="${item.id}"></button
                        </div>
                        `
    }

    function createBooksArr(book) {
        const booksInfo = {
            title: book.title,
            cover: book.imageLinks ? book.imageLinks.thumbnail : '', 
            id: book.industryIdentifiers && book.industryIdentifiers.length > 0 ? book.industryIdentifiers[0].identifier : '' 
        };
    
        books.push(booksInfo);
    }



function addCurrentBookArr(bookId){ 
    const targetBooktObj = books.find(targetBook => targetBook.id === bookId);
    if (targetBooktObj) {
        TBR.push(targetBooktObj);
        localStorage.setItem("TBR", JSON.stringify(TBR));
        currentBook.push(targetBooktObj); 
        renderCurrentBook(); 
    } else {
        console.log("Book not found.");
    }
}


// Current book feed

function renderCurrentBook(){
    let result = '';
    if (currentBook != null && currentBook.length > 0) {
        currentBook.forEach(item => {
            result += `
                <div class="book-el">
                    <img src="${item.cover}" class="book-img">
                    <button class="remove-btn icon" data-remove="${item.id}"></button>
                </div>
            `;
        });
    }else {
        // If currentBook array is empty, display the message
        result = '<p class="current-read">Add your current read!</p>';
    }
    feed.innerHTML = result;
}

   

function removeCurrentBook(bookId){ 
    const index = currentBook.findIndex(item => item.id === bookId);
    if (index !== -1) {
        currentBook.splice(index, 1); 
        localStorage.setItem("TBR", JSON.stringify(currentBook));
        renderCurrentBook(); 
    }
}

function clearSearchResults() {
    feed.innerHTML = ''; 
    renderCurrentBook(); 
}

function reload(item){
    if (item.length === 0) {
        location.reload()
        } 
}




