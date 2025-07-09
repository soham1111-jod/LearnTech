from marshmallow import Schema, fields

class PlaylistSchema(Schema):
    _id = fields.Str(dump_only=True)
    name = fields.Str(required=True)
    active = fields.Bool()
    description = fields.Str() 