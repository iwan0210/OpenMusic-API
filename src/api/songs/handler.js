class SongsHandler {
    constructor (service, validator) {
        this._service = service
        this._validator = validator

        this.postSongHandler = this.postSongHandler.bind(this)
        this.getSongsHandler = this.getSongsHandler.bind(this)
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this)
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this)
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this)
    }
}

module.exports = SongsHandler
