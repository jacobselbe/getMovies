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
    //fandongo api key: 6b5nj8uq9qvj9xuqmbec8qmw
}

//display movies
function displayResults(response1, response2, response3) {
    $('#js-results').html(`
    <p>${response1}</p>
    <p>${response2}</p>
    <p>${response3}</p>
    `);//---------------->temmpory info display
}

//set page
$(setPage => {
    console.log('page set');
    watchForm();
}); 