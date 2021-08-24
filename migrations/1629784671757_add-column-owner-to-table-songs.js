exports.up = pgm => {
    pgm.addColumn('songs', {
        owner: {
            type: 'VARCHAR(50)'
        }
    })

    pgm.addConstraint('songs', 'fk_songs.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE')
}

exports.down = pgm => {
    pgm.dropConstraint('songs', 'fk_songs.owner_users.id')
    pgm.dropColumn('songs', 'owner')
}
