/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
    pgm.createTable('musics', {
        id: {
            type: 'VARCHAR(30)',
            primaryKey: true
        },
        title: {
            type: 'TEXT',
            notNull: true
        },
        year: {
            type: 'INT',
            notNull: true
        },
        performer: {
            type: 'TEXT',
            notNull: true
        },
        genre: {
            type: 'TEXT',
            notNull: true
        },
        duration: {
            type: 'INT',
            notNull: true
        },
        inserted_at: {
            type: 'TEXT',
            notNull: true
        },
        updated_at: {
            type: 'TEXT',
            notNull: true
        }
    })
}

exports.down = pgm => {
    pgm.dropTable('musics')
}
