from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)
api = Api(app)


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    score = db.Column(db.Integer)

    def __repr__(self):
        return '<Player %s>' % self.name


class PlayerSchema(ma.Schema):
    class Meta:
        fields = ("id", "name", "score")


player_schema = PlayerSchema()
players_schema = PlayerSchema(many=True)


class PlayerListResource(Resource):
    def get(self):
        players = Player.query.all()
        return players_schema.dump(players)

    def post(self):
        new_player = Player(
            name=request.json['name'],
            score=request.json['score']
        )
        db.session.add(new_player)
        db.session.commit()
        return player_schema.dump(new_player)


class PlayerResourceId(Resource):
    def get(self, player_id):
        player = Player.query.get_or_404(player_id)
        return player_schema.dump(player)

    def put(self, player_id):
        player = Player.query.get_or_404(player_id)

        if 'name' in request.json:
            player.name = request.json['name']
        if 'score' in request.json:
            player.score = request.json['score']

        db.session.commit()
        return player_schema.dump(player)

    def delete(self, player_id):
        player = Player.query.get_or_404(player_id)
        db.session.delete(player)
        db.session.commit()
        return '', 204



class PlayerResourceName(Resource):
    def get(self, player_name):
        player = Player.query.filter_by(name=player_name).first()
        return player_schema.dump(player)

    def put(self, player_name):
        player = Player.query.filter_by(name=player_name).first()

        if 'name' in request.json:
            player.name = request.json['name']
        if 'score' in request.json:
            player.score = request.json['score']

        db.session.commit()
        return player_schema.dump(player)

    def delete(self, player_name):
        player = Player.query.filter_by(name=player_name).first()
        db.session.delete(player)
        db.session.commit()
        return '', 204       


api.add_resource(PlayerListResource, '/players')
api.add_resource(PlayerResourceId, '/player-id/<int:player_id>')
api.add_resource(PlayerResourceName, '/player-name/<string:player_name>')

if __name__ == '__main__':
    app.run(debug=True)
