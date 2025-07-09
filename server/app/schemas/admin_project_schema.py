from marshmallow import Schema, fields, validate

class ProjectSchema(Schema):
    title = fields.Str(required=True, validate=validate.Length(min=1))
    description = fields.Str(required=True, validate=validate.Length(min=1))
    tech_stack = fields.List(fields.Str(), required=True)
    github_url = fields.Url(required=True)
    demo_url = fields.Url(required=True)
    linkedin = fields.Url(required=True)
    status = fields.Str(validate=validate.OneOf(["pending", "approved"]))
    created_at = fields.DateTime() 