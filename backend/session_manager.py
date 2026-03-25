import uuid
import time

_sessions = {}


def create_session():
    session_id = str(uuid.uuid4())
    now = time.time()
    _sessions[session_id] = {
        'session_id': session_id,
        'created_at': now,
        'last_seen': now,
        'preferences': {
            'filter_text': '',
            'sort_column': 'cpu_percent',
            'sort_direction': 'desc',
            'status_filter': 'all',
            'paused': False,
        },
    }
    return _sessions[session_id]


def get_session(session_id):
    session = _sessions.get(session_id)
    if session:
        session['last_seen'] = time.time()
    return session


def update_session(session_id, updates):
    if session_id not in _sessions:
        return None
    _sessions[session_id].update(updates)
    _sessions[session_id]['last_seen'] = time.time()
    return _sessions[session_id]


def update_preferences(session_id, preferences):
    if session_id not in _sessions:
        return None
    _sessions[session_id]['preferences'].update(preferences)
    _sessions[session_id]['last_seen'] = time.time()
    return _sessions[session_id]


def delete_session(session_id):
    return _sessions.pop(session_id, None)


def cleanup_old_sessions():
    now = time.time()
    expired = [sid for sid, s in list(_sessions.items()) if now - s['last_seen'] > 3600]
    for sid in expired:
        del _sessions[sid]
    return len(expired)
