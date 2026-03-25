import psutil
import time


def get_processes():
    processes = []
    for proc in psutil.process_iter(
        ['pid', 'name', 'cpu_percent', 'memory_info', 'status', 'username', 'create_time', 'num_threads']
    ):
        try:
            info = proc.info
            memory_mb = info['memory_info'].rss / 1024 / 1024 if info['memory_info'] else 0
            uptime_seconds = time.time() - info['create_time'] if info['create_time'] else 0
            processes.append({
                'pid': info['pid'],
                'name': info['name'] or 'unknown',
                'cpu_percent': round(info['cpu_percent'] or 0.0, 1),
                'memory_mb': round(memory_mb, 2),
                'status': info['status'] or 'unknown',
                'username': info['username'] or 'unknown',
                'uptime_seconds': round(uptime_seconds),
                'num_threads': info['num_threads'] or 0,
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return processes


def get_system_stats():
    mem = psutil.virtual_memory()
    cpu_freq = psutil.cpu_freq()
    boot_time = psutil.boot_time()
    return {
        'total_processes': len(psutil.pids()),
        'cpu_percent': psutil.cpu_percent(interval=None),
        'memory_percent': mem.percent,
        'memory_used_gb': round(mem.used / 1024 / 1024 / 1024, 2),
        'memory_total_gb': round(mem.total / 1024 / 1024 / 1024, 2),
        'system_uptime_seconds': round(time.time() - boot_time),
        'cpu_count': psutil.cpu_count(),
        'cpu_freq_mhz': round(cpu_freq.current) if cpu_freq else 0,
    }


def get_process_detail(pid):
    try:
        proc = psutil.Process(pid)
        info = proc.as_dict(
            attrs=['pid', 'name', 'cpu_percent', 'memory_info', 'status', 'username', 'create_time', 'num_threads']
        )
        memory_mb = info['memory_info'].rss / 1024 / 1024 if info['memory_info'] else 0
        uptime_seconds = time.time() - info['create_time'] if info['create_time'] else 0
        return {
            'pid': info['pid'],
            'name': info['name'] or 'unknown',
            'cpu_percent': round(info['cpu_percent'] or 0.0, 1),
            'memory_mb': round(memory_mb, 2),
            'status': info['status'] or 'unknown',
            'username': info['username'] or 'unknown',
            'uptime_seconds': round(uptime_seconds),
            'num_threads': info['num_threads'] or 0,
        }
    except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
        return None
