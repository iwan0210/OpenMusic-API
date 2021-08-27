class PlaylistsHandler {
    constructor (service, validator) {
        this._service = service
        this._validator = validator

        this.postPlaylistHandler = this.postPlaylistHandler.bind(this)
        this.getPlaylistsHandler = this.getPlaylistsHandler.bind(this)
        this.deletePlaylistByIdHandler = this.deletePlaylistByIdHandler.bind(this)
        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this)
        this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this)
        this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this)
    }

    async postPlaylistHandler (request, h) {
        this._validator.validatePostPlaylistPayload(request.payload)
        const { name } = request.payload
        const { id: credentialId } = request.auth.credentials

        const playlistId = await this._service.addPlaylist({ name, owner: credentialId })

        const response = h.response({
            status: 'success',
            message: 'Playlist berhasil ditambahkan',
            data: {
                playlistId
            }
        })
        response.code(201)
        return response
    }

    async getPlaylistsHandler (request) {
        const { id: credentialId } = request.auth.credentials

        const playlists = await this._service.getPlaylists(credentialId)

        return {
            status: 'success',
            data: {
                playlists
            }
        }
    }

    async deletePlaylistByIdHandler (request) {
        const { playlistId } = request.params
        const { id: credentialId } = request.auth.credentials

        await this._service.verifyPlaylistOwner(playlistId, credentialId)
        await this._service.deletePlaylistById(playlistId)

        return {
            status: 'success',
            message: 'Playlist berhasil dihapus'
        }
    }

    async postPlaylistSongHandler (request, h) {
        this._validator.validatePostPlaylistSongPayload(request.payload)
        const { playlistId } = request.params
        const { songId } = request.payload
        const { id: credentialId } = request.auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)
        await this._service.addPlaylistSong(playlistId, songId)

        const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan ke playlist'
        })
        response.code(201)
        return response
    }

    async getPlaylistSongsHandler (request) {
        const { playlistId } = request.params
        const { id: credentialId } = request.auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)

        const songs = await this._service.getPlaylistSongs(playlistId)

        return {
            status: 'success',
            data: {
                songs
            }
        }
    }

    async deletePlaylistSongHandler (request) {
        const { playlistId } = request.params
        const { songId } = request.payload
        const { id: credentialId } = request.auth.credentials

        await this._service.verifyPlaylistAccess(playlistId, credentialId)
        await this._service.deletePlaylistSong(playlistId, songId)

        return {
            status: 'success',
            message: 'Lagu berhasil dihapus dari playlist'
        }
    }
}

module.exports = PlaylistsHandler
