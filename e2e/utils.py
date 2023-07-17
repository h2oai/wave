import os
import subprocess
from typing import Dict, Optional

import requests
from requests.adapters import HTTPAdapter, Retry


cwd = os.path.join(os.path.dirname(__file__))
wave_executable = os.path.join(cwd, 'venv', 'bin', 'wave')
s = requests.Session()
s.mount('http://', HTTPAdapter(max_retries=Retry(total=5, backoff_factor=2)))


def start_waved(env: Optional[Dict[str, str]] = None):
    waved_cwd = os.path.join(os.path.dirname(__file__), '..')
    args = ['go', 'run', 'cmd/wave/main.go', '-web-dir', './ui/build', '-public-dir', '/assets/@./assets']

    waved_p = subprocess.Popen(args=args, cwd=waved_cwd, env=env, start_new_session=True)

    if waved_p.returncode is not None:
        raise Exception('Failed to start waved')

    res = s.get(f'http://localhost:10101/{os.environ.get("H2O_WAVE_BASE_URL", "/")}')
    if res.status_code != 200:
        raise Exception('Failed to start waved')

    return waved_p


class AppRunner(object):
    def __init__(self, code: str):
        self.code = code

    def __enter__(self):
        with open('tmp.py', 'w') as f:
            f.write(self.code)
        self.p = subprocess.Popen([wave_executable, 'run', 'tmp.py', '--no-reload'])
        if s.get('http://localhost:8000').status_code != 405:
            self.__exit__(None, None, None)
            raise Exception('Failed to start the app')

    def __exit__(self, exc_type, exc_val, exc_tb):
        os.remove('tmp.py')
        self.p.kill()
