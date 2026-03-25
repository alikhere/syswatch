import eventlet
from flask import request
from flask_socketio import emit
from session_manager import get_session, update_preferences
from process_collector import get_processes, get_system_stats

_sid_to_session = {}
_active_tasks = {}


def register_handlers(socketio):

    @socketio.on('connect')
    def handle_connect():
        pass

    @socketio.on('connect_session')
    def handle_connect_session(data):
        session_id = data.get('session_id')
        session = get_session(session_id)
        if not session:
            emit('error', {'message': 'Invalid session'})
            return

        sid = request.sid
        _sid_to_session[sid] = session_id
        emit('connected', session)

        def stream_updates(current_sid, current_session_id):
            while current_sid in _sid_to_session:
                current_session = get_session(current_session_id)
                if current_session and not current_session['preferences'].get('paused'):
                    processes = get_processes()
                    stats = get_system_stats()
                    socketio.emit(
                        'process_update',
                        {'processes': processes, 'stats': stats, 'session_id': current_session_id},
                        to=current_sid,
                    )
                eventlet.sleep(2)

        task = eventlet.spawn(stream_updates, sid, session_id)
        _active_tasks[sid] = task

    @socketio.on('disconnect')
    def handle_disconnect():
        sid = request.sid
        _sid_to_session.pop(sid, None)
        task = _active_tasks.pop(sid, None)
        if task:
            task.kill()

    @socketio.on('update_preferences')
    def handle_update_preferences(data):
        session_id = data.get('session_id')
        preferences = data.get('preferences', {})
        session = update_preferences(session_id, preferences)
        if session:
            emit('preferences_updated', session)

    @socketio.on('pause_stream')
    def handle_pause_stream(data):
        session_id = data.get('session_id')
        paused = data.get('paused', False)
        update_preferences(session_id, {'paused': paused})

    @socketio.on('request_snapshot')
    def handle_request_snapshot(data):
        session_id = data.get('session_id')
        session = get_session(session_id)
        if session:
            processes = get_processes()
            stats = get_system_stats()
            emit('process_update', {
                'processes': processes,
                'stats': stats,
                'session_id': session_id,
            })
