import eventlet
eventlet.monkey_patch()

from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from routes import api_blueprint
from socket_handlers import register_handlers

app = Flask(__name__)
app.config['SECRET_KEY'] = 'syswatch-secret-key-change-in-prod'

CORS(app, origins='*')

socketio = SocketIO(app, cors_allowed_origins='*', async_mode='eventlet')

app.register_blueprint(api_blueprint)
register_handlers(socketio)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
