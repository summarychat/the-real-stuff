from datetime import datetime
from flask import Flask, request, flash, url_for, redirect, \
     render_template, abort
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy.orm
from cockroachdb.sqlalchemy import run_transaction
import json
from flask_cors import CORS, cross_origin

DATABASE = {
    'drivername': 'cockroachdb',
    'host': 'localhost',
    'port': '26257',
    'username': 'root',
    'database': 'context'
}

app = Flask(__name__, static_url_path='')
CORS(app)
app.config.from_pyfile('hello.cfg')
db = SQLAlchemy(app)
sessionmaker = sqlalchemy.orm.sessionmaker(db.engine)
session = sessionmaker()

class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column('msg_id', db.Integer, primary_key=True)
    channel = db.Column("channel", db.String)
    name = db.Column("name", db.String)
    message = db.Column("message", db.String)
    timestamp = db.Column("timestamp", db.DateTime)

    def __init__(self, channel, name, message, scores, timestamp):
        self.channel = channel
        self.name = name
        self.message = message
        self.timestamp = datetime.utcnow()

    def diction(self):
        d ={}
        d['channel'] = self.channel
        d['message'] = self.message
        d['name'] = self.name
        return d

class Event(db.Model):
    __tablename__ = 'events'
    id = db.Column('event_id', db.Integer, primary_key=True)
    channel = db.Column("channel", db.String)
    name = db.Column("name", db.String)
    message = db.Column("message", db.String)
    links = db.Column("links", db.String)
    timestamp = db.Column("timestamp", db.DateTime)

    def __init__(self, channel, name, message, links, timestamp):
        self.channel = channel
        self.name = name
        self.message = message
        self.links = links
        self.timestamp = timestamp
    
    def diction(self):
        d ={}
        d['channel'] = self.channel
        d['message'] = self.message
        d['name'] = self.name
        d['links'] = self.links
        return d


@app.route('/')
def show_all():
    return app.send_static_file('index.html')


@app.route('/messages/<chat>', methods=['GET'])
def message_json(chat):
    session = sessionmaker()
    result = session.query(Message).filter(Message.channel == chat).order_by("timestamp desc").limit(50).all()
    return json.dumps([row.diction() for row in result])

@app.route('/events/<chat>', methods=['GET'])
def event_json(chat):
    session = sessionmaker()
    inter = session.query(Event).filter(Event.channel == chat).order_by("timestamp desc")[-5:].all()
    return json.dumps([row.diction() for row in inter])

@app.route('/<path:path>')
def static_file(path):
    return app.send_static_file(path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)