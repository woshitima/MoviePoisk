const form = document.querySelector('form')
const input = document.querySelector('#search')
const yearInput = document.querySelector('#year')
const movieMonth = document.querySelector('#month')
const output = document.querySelector('#output')
const filter = document.querySelector('#filter')

const API = 'https://kinopoiskapiunofficial.tech/api/'
const GET_ALL_FILMS = API + 'v2.2/films'
const GET_BY_NAME = API + 'v2.1/films/search-by-keyword?keyword='

const key = '34783845-4eb5-4f92-bceb-9e4ed06842f2'
const headers = {
    'X-API-KEY': key,
    'Content-Type': 'application/json',
}

const movieDetails = document.createElement('div')
movieDetails.className = 'details'

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

months.forEach(m => {
    const option = document.createElement('option')
    option.textContent = m
    movieMonth.append(option)

})

const fetchAllFilms = () => {
    fetch(GET_ALL_FILMS, {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        // .then(data => console.log(data.items)) // data == json
        .then(data => renderAllFilms(data.items))
        .catch(err => console.log(err))
}

const fetchFilmsByName = (e) => {
    e.preventDefault()
    if (!input.value.trim().length) return
    fetch(GET_BY_NAME + input.value + '&page=1', {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(data => {
            renderAllFilms(data.films)
            console.log((data.films))
        })
        .catch(err => console.log(err))
    input.value = ''
}

const fetchFilmByDate = () => {
    if (!movieMonth || !yearInput.value.trim().length || yearInput.value.length < 4) {
        alert('Insufficient filters!')
        return
    }
    fetch((GET_ALL_FILMS + `/premieres?year=${yearInput.value}&month=${movieMonth.value}`), {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(data => renderAllFilms(data.items))
        .catch(err => console.log(err))
}

const fetchFilmDetails = (id) => {
    fetch((GET_ALL_FILMS + `/${id}`), {
        method: 'GET',
        headers
    })
        .then(res => res.json())
        .then(data => renderFilmDetails(data))
        .catch(err => console.log(err))
}

const renderAllFilms = (data) => {
    console.log(data);

    output.innerHTML = ''
    data && data.length > 0 ?
        data.map(el => {
            const card = document.createElement('div')
            card.className = 'card'

            const image = document.createElement('img')
            image.style.cursor = 'pointer'
            image.src = el.posterUrl
            image.alt = `Poster of ${el.nameOriginal}`

            const title = document.createElement('h2')
            title.textContent = el.nameOriginal || el.nameRu || el.nameEn

            const yearNgenre = document.createElement('span')
            yearNgenre.textContent = `${el.year}, ${el.genres[0].genre}`

            card.addEventListener('click', () => {
                fetchFilmDetails(el.kinopoiskId || el.filmId)
            })

            card.append(image, title, yearNgenre)
            output.append(card)
        })
        :
        output.innerHTML = `<h1>Movies not found</h1>`
}

const renderFilmDetails = (film) => {
    output.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'details-container';

    const image = document.createElement('img');
    image.src = film.posterUrl;
    image.alt = `Poster of ${film.nameOriginal || film.nameRu || film.nameEn}`;

    const content = document.createElement('div');
    content.className = 'details-content';

    const title = document.createElement('h2');
    title.textContent = `${film.nameOriginal || film.nameRu || film.nameEn} (${film.year})`;

    const rating = document.createElement('h3')
    rating.textContent = `Rating: ${film.ratingImdb || film.ratingKinopoisk}`

    const genres = document.createElement('h4')
    genres.textContent = film.genres[0].genre

    const description = document.createElement('p');
    description.textContent = film.description || 'No description available.';

    const linkToOriginal = document.createElement('a');
    linkToOriginal.href = film.webUrl;
    linkToOriginal.target = '_blank';
    linkToOriginal.textContent = 'More details...';

    content.append(title, rating, genres, description, linkToOriginal);
    wrapper.append(image, content);
    output.append(wrapper);
};


form.addEventListener('submit', fetchFilmsByName)

filter.addEventListener('click', fetchFilmByDate)

fetchAllFilms()