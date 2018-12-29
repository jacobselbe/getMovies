'use strict';

//wait for form to be submited and refine input
function watchForm() {
    // console.log('watchForm() ready');
    $('#js-searchForm').submit(e => {
        e.preventDefault();
        $('#js-results').html('');
        const userInput = $('#js-searchInput').val();
        refineInput(userInput);
    });
}

//sanitize input
function refineInput(input) {
    // console.log('refineInput() executed');
    const finalInput = [];
    let inputArray = input
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
    for (let i = 0; i < inputArray.length; i++) {
        if (!stopListLg.includes(inputArray[i]) && !finalInput.includes(inputArray[i])) {
            finalInput.push(inputArray[i]);
        }
    }
    // console.log(finalInput);
    if (finalInput.length > 0) {
        if (finalInput.length < 11) {
            getMovieKeywordIds(finalInput);
        } else {
            $('#js-results').html(`
                <p>Sorry, that is a bit much. Please be a little more concise with your description.</p>
            `);
        }
    } else {
        $('#js-results').html(`
            <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description.</p>
        `);
    }
}

//get keyword ids from api
function getMovieKeywordIds(input) {
    // console.log('getMovieKeywordIds() executed');
    const ids = [];
    for (let i = 0; i < input.length; i++) {
        const keywordUrl = `https://api.themoviedb.org/3/search/keyword?api_key=771ac5f3dcc248eb6341b155a4ec98f4&query=${input[i]}`;
        fetch(keywordUrl)
            .then(response => response.json())
            .then(responseJson => responseJson.results.forEach(kw => ids.push(kw.id)))
            .then(function () {
                if (i === input.length - 1) {
                    // console.log(ids);
                    if (ids.length === 0) {
                        $('#js-results').html(`
                            <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
                        `);
                    }
                    getMovieData(ids);
                }
            })
            .catch(error => {
                console.log(error);
                $('#js-results').html(`
                    <p>Sorry we're having some technical difficulties!</p>
                `);
            });
    }
}

//get movie data from api with the ids
function getMovieData(ids) {
    // console.log('getMovieData() executed');
    const allMovies = [];
    for (let i = 0; i < ids.length; i++) {
        const movieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=771ac5f3dcc248eb6341b155a4ec98f4&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&with_keywords=${ids[i]}`;
        fetch(movieUrl)
            .then(response => response.json())
            .then(responseJson => responseJson.results.forEach(movie => allMovies.push(movie)))
            .then(function () {
                if (i === ids.length - 1) {
                    const topMovies = allMovies.sort(movie => (movie.popularity)).slice(0, 6);
                    if (topMovies.length === 0) {
                        $('#js-results').html(`
                            <p>Sorry, looks like we need a little more to go on than that. Please enter a little more description!</p>
                        `);
                    }
                    displayMovieData(topMovies);
                    getTrailers(topMovies);
                }
            })
            .catch(error => {
                console.log(error);
                $('#js-results').html(`
                    <p>Sorry we're having some technical difficulties!</p>
                `);
            });
    }
}

//updates DOM with movie data - no trailers yet
function displayMovieData(results) {
    // console.log('displayMovieData() executed');
    $('#js-homePage').addClass('hidden');
    $('#js-resultTop').removeClass('hidden');
    watchBackBtn();
    $('#js-results').html('');
    for (let i = 0; i < results.length; i++) {
        console.log(results[i]);
        let j = i + 1;
        $('#js-results').append(`
            <li id="js-movieNumber${j}">
                <h3>${j}. ${results[i].title}</h3>
            </li>
        `);
    }
}

//get movie video from youtube API
function getTrailers(movies) {
    // console.log('getTrailers() executed');
    for (let i = 0; i < movies.length; i++) {
        const title = movies[i].title.replace(/ /g, '+');
        const trailerUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${title}+movie+trailer&type=video&key=AIzaSyB0msEzlGGTsxyzYf6M9ZJhHxjYpuqc34E`;
        fetch(trailerUrl)
            .then(response => response.json())
            .then(responseJson => displayTrailer(responseJson.items[0], i))
            .catch(error => {
                console.log(error);
                $('?????????????').html(`
                    <p>Trailer/picture not available</p>
                `);
            });
    }
}

//update DOM with trailer from youtube
function displayTrailer(movie, i) {
    // console.log('displayTrailer() executed');
    // console.log(movie);
    let j = i + 1;
    $(`#js-movieNumber${j}`).append(`
        <input type="image" id="js-playTrailer${j}" src="${movie.snippet.thumbnails.high.url}" alt="${movie.snippet.title}" class="grow">
    `);
    $(`#js-playTrailer${j}`).click(e => {
        $(`#js-movieNumber${j}`).html(`
            <iframe width="180" height="135" src="https://www.youtube.com/embed/${movie.id.videoId}?autoplay=1" frameborder="0" allowfullscreen">
            </iframe>
        `);
    });
}

//waiting for back button to be clicked and returning to home page
function watchBackBtn() {
    // console.log('watchBackBtn() ready');
    $('#js-backBtn').click(e => {
        $('#js-results').html('');
        $('#js-resultTop').addClass('hidden');
        $('#js-homePage').removeClass('hidden');
        $('#js-searchInput').val('');
    });
}

$(watchForm()); 