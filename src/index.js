require('dotenv').config()

const Hapi = require('@hapi/hapi')
const Jwt = require('@hapi/jwt')
const Inert = require('@hapi/inert')
const path = require('path')

// songs
const songs = require('./api/songs')
const SongsService = require('./services/postgres/songsService')
const SongsValidator = require('./validator/songs')

// users
const users = require('./api/users')
const UsersService = require('./services/postgres/UsersService')
const UsersValidator = require('./validator/users')

// playlist
const playlists = require('./api/playlists')
const PlaylistsService = require('./services/postgres/PlaylistsService')
const PlaylistsValidator = require('./validator/playlists')

// authentications
const authentications = require('./api/authentications')
const AuthenticationsService = require('./services/postgres/AuthenticationsService')
const TokenManager = require('./tokenize/TokenManager')
const AuthenticationsValidator = require('./validator/authentications')

// collaborations
const collaborations = require('./api/collaborations')
const CollaborationsService = require('./services/postgres/CollaborationsService')
const CollaborationsValidator = require('./validator/collaborations')

// exports
const _exports = require('./api/exports')
const ProducerService = require('./services/rabbitmq/ProducerService')
const ExportsValidator = require('./validator/exports')

// uploads
const uploads = require('./api/uploads')
const StorageService = require('./services/storage/StorageService')
const UploadsValidator = require('./validator/uploads')

// cache
const CacheService = require('./services/redis/CacheService')

// ClientError
const ClientError = require('./exceptions/ClientError');

(async () => {
    const cacheService = new CacheService()
    const songsService = new SongsService()
    const usersService = new UsersService()
    const collaborationsService = new CollaborationsService()
    const authenticationsService = new AuthenticationsService()
    const playlistsService = new PlaylistsService(collaborationsService, cacheService)
    const storageService = new StorageService(path.resolve(__dirname, 'api/uploads/file/pictures'))
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*']
            }
        }
    })

    await server.register([
        {
            plugin: Jwt
        },
        {
            plugin: Inert
        }
    ])

    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id
            }
        })
    })

    await server.register([
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator
            }
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator
            }
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator
            }
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator
            }
        },
        {
            plugin: _exports,
            options: {
                ProducerService,
                playlistsService,
                validator: ExportsValidator
            }
        },
        {
            plugin: uploads,
            options: {
                service: storageService,
                validator: UploadsValidator
            }
        }
    ])

    server.ext('onPreResponse', (request, h) => {
        const { response } = request

        if (response instanceof ClientError) {
            const newResponse = h.response({
                status: 'fail',
                message: response.message
            })
            newResponse.code(response.statusCode)
            return newResponse
        }

        // if (response instanceof Error) {
        //     const newResponse = h.response({
        //         status: 'error',
        //         message: 'Maaf, terjadi kegagalan pada server kami.'
        //     })
        //     newResponse.code(500)
        //     console.log(response)
        //     return newResponse
        // }

        return response.continue || response
    })

    await server.start()
    console.log(`Server berjalan pada ${server.info.uri}`)
})()
