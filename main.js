'use strict';

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
    const finalInput = [];
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
    getKeywordIds(finalInput);
}

function getKeywordIds(finalInput) {
    console.log('getKeywordIds() executed');
    const movieResults = [];
    for (let i = 0; i < finalInput.length; i++) {
        let r = i + 1;
        let keywordUrl = `https://api.themoviedb.org/3/search/keyword?api_key=771ac5f3dcc248eb6341b155a4ec98f4&query=${finalInput[i]}`;
        console.log(`keywordUrl${r}: ${keywordUrl}`);
        fetch(keywordUrl)
            .then(response => response.json())
            .then(responseJson => getMovies(responseJson.results[0].id, i, movieResults))
            .catch(error => {
                console.log(error);
                $('#js-results').html(`
                    <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
                `);
            });
    }
}

function getMovies(id, i, results) {
    let movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=771ac5f3dcc248eb6341b155a4ec98f4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${id}`;
    let r = i + 1;
    console.log(`movieUrl${r}: ${movieUrl}`);
    fetch(movieUrl)
        .then(response => response.json())
        .then(responseJson => filterMovies(responseJson.results, results))
        .catch(error => console.log(error));
}

function filterMovies(response, results) {
    for (let i = 0; i < response.length; i++) {
        if (response[i].original_language == "en") {
            results.push(response[i]);
        }
    }
    results.sort(movie => (movie.popularity));
    console.log(results);
    displayResults(results);
}

function displayResults(results) {
    $('#js-results').html('');
    for (let i = 0; i < results.length; i++) {
        let r = i + 1;
        $('#js-results').append(`
            <p>${r}. ${results[i].title}</p>
        `);
    }
}

$(setPage => {
    console.log('page set');
    watchForm();
}); 
