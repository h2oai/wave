import signal
import subprocess
import unittest

import requests
from requests.adapters import HTTPAdapter, Retry

from .test_expando import *
from .test_python_server import *
from .test_python_server_async import *

if __name__ == '__main__':
    wave_server_process = None
    try:
        env = os.environ.copy()
        # Turn off excessive logging.
        env['H2O_WAVE_NO_LOG'] = 't'
        wave_server_process = subprocess.Popen(['make', 'run'], cwd='..', preexec_fn=os.setsid, env=env)

        # Wait for server to boot up.
        base_url = env.get('H2O_WAVE_BASE_URL', '/')
        s = requests.Session()
        s.mount('http://', HTTPAdapter(max_retries=Retry(total=5, backoff_factor=2)))
        res = s.get(f'http://localhost:10101{base_url}')

        if res.status_code != 200:
            raise Exception('Failed to start waved')

        # Run the test suite
        unittest.main()
    finally:
        if wave_server_process:
            os.killpg(os.getpgid(wave_server_process.pid), signal.SIGTERM)
