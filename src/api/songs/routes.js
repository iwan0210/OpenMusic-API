const routes = (handler) => [
    {
        method: 'POST',
        path: '/songs',
        handler: handler.postSongHandler
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongsHandler
    },
    {
        method: 'GET',
        path: '/songs',
        handler: handler.getSongByIdHandler
    },
    {
        method: 'PUT',
        path: '/songs',
        handler: handler.putSongByIdHandler
    },
    {
        method: 'DELETE',
        path: '/songs',
        handler: handler.deleteSongbyIdHandler
    }

]

module.exports = routes
