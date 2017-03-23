'use strict';

(function () {
    const url = 'https://jsonplaceholder.typicode.com';
    const albums = '/albums';
    const photos = '/photos';

    const form = document.querySelector('.app-form');
    const input = form.querySelector('.app__input');
    const albumsNode = document.querySelector('.content');
    form.addEventListener('submit', loadAlbumsWithPhotos);

    const toJson = R.invoker(0, 'json');

    const allToJson = R.compose(
        R.bind(Promise.all, Promise),
        R.map(toJson)
    );

    const getAlbums = R.compose(
        fetch,
        R.concat(url + albums + '?userId=')
    );

    const getPhotos = R.compose(
        fetch,
        R.concat(url + photos + '?albumId='),
        R.prop('id')
    );

    const addPhotosToAlbums = R.zipWith(
        R.set(R.lensProp('photos'))
    );

    function loadAlbumsWithPhotos(event) {
        event.preventDefault();

        const userId = parseInt(input.value);

        getAlbums(userId)
            .then(toJson)
            .then(combineWithPhotos)
            .then(renderAlbums)
            .catch((error) => {
                throw new Error (error.message);
            });
    }

    function renderAlbums(albums) {
        albumsNode.innerHTML = albums.map(album => {

            const commentsHtml = album.photos.map((photo => {
                return `
                <li>
                    <a href="${photo.url}">
                        ${photo.title}
                    </a>
                </li>`
            })).join('');

            return `
            <article class="album">
                <h2 class="album__title">
                    ${album.title}
                </h2>
                <ul class="album__photos">
                    ${commentsHtml}
                </ul>
            </article>`
        }).join('');
    }

    function combineWithPhotos(albums) {
        const photoReqs = albums.map(getPhotos);

        return new Promise((resolve, reject) => {
            Promise.all(photoReqs)
                .then(allToJson)
                .then(addPhotosToAlbums(R.__, albums))
                .then(resolve)
                .catch(reject);
        })
    }
})();