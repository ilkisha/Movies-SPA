function addEventListeners() {
    let navigationTemplate = Handlebars.compile(document.getElementById('navigation-template').innerHTML);
    let movieCardTemplate = Handlebars.compile(document.getElementById('movie-card-template').innerHTML);
    Handlebars.registerPartial('navigation-template', navigationTemplate);
    Handlebars.registerPartial('movie-card', movieCardTemplate);

    navigate(location.pathname === '/' ? 'home' : location.pathname.slice(1));
}

function navigateHandler(e) {
    e.preventDefault();
    let path = '';
    let tagName = e.target.tagName;
    if (tagName !== 'A' && tagName !== 'BUTTON') {
        return;
    }

    if(tagName === 'BUTTON' && e.target.parentNode.tagName === 'A') {
        path = e.target.parentNode.href;
    } else {
        path = e.target.href;
    }

    let url = new URL(path);

    navigate(url.pathname.slice(1));
}

function onRegisterSubmit(e) {
    e.preventDefault();
    let formData = new FormData(document.forms['register-form']);
    let email = formData.get('email');
    let password = formData.get('password');
    let repeatPassword = formData.get('repeatPassword');

    if (password === repeatPassword) {
        authService.register(email, password)
            .then(data => {
               navigate('home');
            });
    }

}

function onLoginSubmit(e) {
    e.preventDefault();
    let formData = new FormData(document.forms['login-form']);
    let email = formData.get('email');
    let password = formData.get('password');

    authService.login(email, password)
        .then(data => {
            navigate('home');
        });
}

function onAddMovieSubmit(e) {
    e.preventDefault();
    let formData = new FormData(document.forms['add-movie-form']);
    let title = formData.get('title');
    let description = formData.get('description');
    let imageUrl = formData.get('imageUrl');

    movieService.add({
        title,
        description,
        imageUrl,
        creator: authService.getData().email,
        likes: JSON.stringify({})
    }).then(res => {
        navigate('home');
    })
}

function deleteMovie(e, id) {
    e.preventDefault();

    movieService.deleteMovie(id)
        .then(res => {
            navigate('home');
        });
}

function likeMovie(e, id) {
    e.preventDefault();

    movieService.getOne(id)
        .then(res => {
            let email = authService.getData().email;
            let userId = authService.getData().localId;

            let likes = JSON.parse(res.likes);
            likes[userId] = email;
            res['likes'] = JSON.stringify(likes);

            movieService.like(id, res)
                .then(res => {
                    navigate(`details/${id}`);
                })
        })

}

function onEditMovieSubmit(e, id) {
    e.preventDefault();

    let formData = new FormData(document.forms['edit-movie-form']);
    let title = formData.get('title');
    let description = formData.get('description');
    let imageUrl = formData.get('imageUrl');

    movieService.editMovie(id, {
        title,
        description,
        imageUrl
    })
        .then(res => {
            navigate(`details/${id}`);
    })
}

addEventListeners();