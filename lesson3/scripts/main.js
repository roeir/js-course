(function () {
    const url = 'https://jsonplaceholder.typicode.com';
    const albums = '/albums';
    const photos = '/photos';

    const form = document.querySelector('.app-form');
    const input = form.querySelector('.app__input');
    const albumsNode = document.querySelector('.content');
    form.addEventListener('submit', loadAlbumsWithPhotos);

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
                .then(addPhotosToAlbums(albums))
                .then(resolve)
                .catch(reject);
        })
    }

    function addPhotosToAlbums(albums) {
        return function (photos) {
            return albums.map((album, index) => {
                album['photos'] = photos[index];
                return album;
            })
        }
    }

    function getPhotos(album) {
        const albumId = album.id;
        return fetch(url + photos + '?albumId=' + albumId);
    }
    
    function getAlbums(userId) {
        return fetch(url + albums + '?userId=' + userId);
    }
    
    function allToJson(responses) {
        return Promise.all(responses.map(toJson));
    }
    
    function toJson(res) {
        return res.json()
    }


})();