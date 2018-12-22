//watch form
function watchForm() {
    console.log('watchForm() ready');
    $('#js-zipcodeForm').submit(e => {
        e.preventDefault();
        const userZipcode = $('#js-userZipcode').val();
        console.log(userZipcode);
        getMovies(userZipcode);
    });
}

//get movies
function getMovies(userZipcode) {
    //fandango api key: 6b5nj8uq9qvj9xuqmbec8qmw
    //EBU8HrBe8u
    //endpoint:https://api.themoviedb.org/3/movie/550?api_key=771ac5f3dcc248eb6341b155a4ec98f4
}

//display movies


//set page
$(setPage => {
    console.log('page set');
    watchForm();
}); 