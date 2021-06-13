const mapDBtoModel = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt,
    updatedAt
}) = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    inserted_at: insertedAt,
    updated_at: updatedAt
})

module.exports = mapDBtoModel
