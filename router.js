const routes = {
    'home': 'home-template',
    'login': 'login-form-template',
    'register': 'register-form-template',
    'add-movie': 'add-movie-template',
    'details': 'movie-details-template'
}

const router = async (fullPath) => {
    let [path, id, param] = fullPath.split('/');
    let app = document.getElementById('app');
    let templateData = authService.getData();
    let templateId = routes[path];

    switch (path) {
        case 'home':
            templateData.movies = await movieService.getAll();
            break;
        case 'logout':
            authService.logout();
            navigate('home');
            return;
        case 'details':
            let movieDetails = await movieService.getOne(id);
            let movieLikesObject = JSON.parse(movieDetails.likes);
            let userId = templateData.localId;
            let isCreator = templateData.email === movieDetails.creator;
            let isLiked = movieLikesObject.hasOwnProperty(userId);
            let countLikes = Object.keys(movieLikesObject).length;

            Object.assign(templateData, movieDetails, {id}, {isCreator}, {isLiked}, {countLikes});

            if(param === 'edit'){
                templateId = 'edit-movie-template';
            }

            break;
        default:
            break;
    }

    let template = Handlebars.compile(document.getElementById(templateId).innerHTML);
    app.innerHTML = template(templateData);
}

const navigate = (path) => {
    history.pushState({}, '', '/' + path);
    router(path);
}