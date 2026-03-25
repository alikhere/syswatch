from flask import Blueprint, request, jsonify
from session_manager import create_session, get_session, delete_session, update_preferences
from process_collector import get_processes, get_system_stats, get_process_detail

api_blueprint = Blueprint('api', __name__)


@api_blueprint.route('/api/session', methods=['POST'])
def create_new_session():
    session = create_session()
    return jsonify(session), 201


@api_blueprint.route('/api/session/<session_id>', methods=['GET'])
def get_existing_session(session_id):
    session = get_session(session_id)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(session)


@api_blueprint.route('/api/session/<session_id>', methods=['DELETE'])
def delete_existing_session(session_id):
    deleted = delete_session(session_id)
    if not deleted:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify({'message': 'Session deleted'})


@api_blueprint.route('/api/session/<session_id>/preferences', methods=['POST'])
def update_session_preferences(session_id):
    preferences = request.json or {}
    session = update_preferences(session_id, preferences)
    if not session:
        return jsonify({'error': 'Session not found'}), 404
    return jsonify(session)


@api_blueprint.route('/api/processes', methods=['GET'])
def get_all_processes():
    session_id = request.args.get('session_id')
    if not session_id or not get_session(session_id):
        return jsonify({'error': 'Valid session_id required'}), 400
    processes = get_processes()
    return jsonify(processes)


@api_blueprint.route('/api/processes/<int:pid>', methods=['GET'])
def get_process(pid):
    process = get_process_detail(pid)
    if not process:
        return jsonify({'error': 'Process not found'}), 404
    return jsonify(process)


@api_blueprint.route('/api/stats', methods=['GET'])
def get_stats():
    stats = get_system_stats()
    return jsonify(stats)
