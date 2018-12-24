'use strict';

const finalInput = [];
const movieResults = [];

function watchForm() {
    console.log('watchForm() ready');
    $('#js-searchForm').submit(e => {
        e.preventDefault();
        const searchInput = $('#js-searchInput').val();
        console.log(searchInput);
        refineInput(searchInput);
    });
}

function refineInput(searchInput) {
    console.log('refineInput() executed');
    let inputArray = searchInput
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
    for (let i = 0; i < inputArray.length; i++) {
        if (!stopListLg.includes(inputArray[i])) {
            finalInput.push(inputArray[i]);
        }
    }
    console.log(finalInput);
    getKeywordIds();
}

function getKeywordIds() {
    console.log('getKeywordIds() executed');
    for (let i = 0; i < finalInput.length; i++) {
        let keywordUrl = `https://api.themoviedb.org/3/search/keyword?api_key=771ac5f3dcc248eb6341b155a4ec98f4&query=${finalInput[i]}`;
        console.log(`keywordUrl${i}: ${keywordUrl}`);
        fetch(keywordUrl)
            .then(response => response.json())
            .then(responseJson => getMovies(responseJson.results[0].id, i))
            .catch(error => console.log(error));
    }
}

function getMovies(id, i) {
    let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=771ac5f3dcc248eb6341b155a4ec98f4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${id}`;
    console.log(`movieUrl${i}: ${movieUrl}`);
    fetch(movieUrl)
        .then(response => response.json())
        .then(responseJson => filterMovies(responseJson.results))
        .catch(error => console.log(error));
}

function filterMovies(response) {
    for (let i = 0; i < response.length; i++) {
        movieResults.push(response[i]);
    }
    movieResults.sort(movie => (movie.popularity));
    console.log(movieResults);
    displayResults();
}

function displayResults() {
    $('#js-results').html('');
    for (let i = 0; i < movieResults.length; i++) {
        let r = i + 1;
        $('#js-results').append(`
            <p>${r}. ${movieResults[i].title}</p>
        `);
    }
}

$(setPage => {
    console.log('page set');
    watchForm();
}); 
