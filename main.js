'use strict';

const searchInput = [];
const keywordIds = [];
const movieResults = [];

function watchForm() {
    console.log('watchForm() ready');
    $('#js-searchForm').submit(e => {
        e.preventDefault();
        searchInput.splice(0, searchInput.length);
        keywordIds.splice(0, keywordIds.length);
        movieResults.splice(0, movieResults.length);
        $('#js-results').html('');
        const userInput = $('#js-searchInput').val();
        console.log('userInput:', userInput);
        refineInput(userInput);
        allRequests();
    });
}

function refineInput(input) {
    console.log('refineInput() executed');
    let inputArray = input
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
    for (let i = 0; i < inputArray.length; i++) {
        if (!stopListLg.includes(inputArray[i])) {
            searchInput.push(inputArray[i]);
        }
    }
    console.log('searchInput:', searchInput);
    if (searchInput.length === 0) {
        $('#js-results').html(`
            <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
        `);
    }
}

async function allRequests() {
    try {
        await getKeywordIds();
        await getMovies();
        await getTrailers();
        displayResults();
    } catch(e) {
        console.log(e);
        $('#js-results').html(`
            <p>Sorry, looks like we're having some technical difficulties! Check console for more info.'</p>
        `);
        if (keywordIds.length === 0) {
            $('#js-results').html(`
                <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
            `);
        }
    }
}

async function getKeywordIds() {
    console.log('getKeywordIds() executed');
    for (let i = 0; i < searchInput.length; i++) {
        const keywordUrl = `https://api.themoviedb.org/3/search/keyword?api_key=771ac5f3dcc248eb6341b155a4ec98f4&query=${searchInput[i]}`;
        console.log(`keywordUrl: ${keywordUrl}`);
        const response =  await fetch(keywordUrl);
        const json = await response.json();
        try {
            keywordIds.push(json.results[0].id);
        } catch {
            console.log(`${searchInput[i]} doesn't return a keyword id`);
        }
    }
    console.log('keywordIds:', keywordIds);
}

async function getMovies() {
    console.log('getMovies() executed');
    for (let i = 0; i < keywordIds.length; i++) {
        let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=771ac5f3dcc248eb6341b155a4ec98f4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${keywordIds[i]}`;
        console.log(`movieUrl: ${movieUrl}`);
        const response = await fetch(movieUrl);
        const json = await response.json();
        filterMovies(json.results);
    }
    movieResults.sort(movie => (movie.popularity));
    console.log('movieResults:', movieResults);
}

function filterMovies(results) {
    console.log('filterMovies() executed');
    for (let i = 0; i < results.length; i++) {
        if (results[i].original_language == "en") {
            movieResults.push(results[i]);
        }
    }
}

async function getTrailers() {
    console.log('getTrailers() executed');
    for (let i = 0; i < movieResults.length; i++) {
        let title = movieResults[i].title.replace(/ /g, '+');
        let trailerUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${title}+movie+trailer&key=AIzaSyB0msEzlGGTsxyzYf6M9ZJhHxjYpuqc34E`;
        console.log(`trailerUrl: ${trailerUrl}`);
        const response = await fetch(trailerUrl);
        const json = await response.json();
        console.log(json);
    }
}

function displayResults() {
    if (movieResults.length > 0) {
        for (let i = 0; i < movieResults.length; i++) {
            let j = i + 1;
            $('#js-results').append(`
                <li>
                    <h3>${j}. ${movieResults[i].title}</h3>
                    <p>${movieResults[i].overview}</p>
                </li>
            `);
        }
    } else {
        $('#js-results').html(`
            <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
        `);
    }
}

$(setPage => {
    console.log('page set');
    watchForm();
}); 
