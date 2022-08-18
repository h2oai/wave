import signal
import subprocess
import time
import unittest

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
        time.sleep(2)
        # Run the test suite
        unittest.main()
    finally:
        if wave_server_process:
            os.killpg(os.getpgid(wave_server_process.pid), signal.SIGTERM)
