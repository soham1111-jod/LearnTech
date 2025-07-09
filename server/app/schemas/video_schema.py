from marshmallow import Schema, fields

class VideoSchema(Schema):
    _id = fields.Str(dump_only=True)
    title = fields.Str(required=True)
    description = fields.Str()
    videoId = fields.Str(required=True)
    playlistId = fields.Str()
    type = fields.Str()
    duration = fields.Str()
    summary = fields.Str() 