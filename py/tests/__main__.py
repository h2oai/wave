import asyncio
import signal
import subprocess
import unittest
import httpx
import os
import platform

# HACK: Using urllib3 import side-effect to resolve "ResourceWarning: unclosed transport" in python>=3.9 versions.
import urllib3

from .test_expando import *
from .test_python_server import *
from .test_python_server_async import *
from .test_routing import *

if __name__ == '__main__':
    waved_p = None
    try:
        env = os.environ.copy()
        # Turn off excessive logging.
        env['H2O_WAVE_NO_LOG'] = 't'
        args = ['go', 'run', 'cmd/wave/main.go', '-web-dir', './ui/build', '-public-dir', '/assets/@./assets', '-proxy']
        waved_p = subprocess.Popen(args, cwd='..', env=env, start_new_session=True)

        # Wait for server to boot up.
        base_url = env.get('H2O_WAVE_BASE_URL', '/')
        res = httpx.Client(transport=httpx.HTTPTransport(retries=5)).get(f'http://localhost:10101{base_url}')

        if res.status_code != 200:
            raise Exception('Failed to start waved')

        # Run the test suite
        if platform.system() == 'Windows':
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
            asyncio.run(unittest.main())
        else:
            unittest.main()
    finally:
        if waved_p:
            if platform.system() == 'Windows':
                o = subprocess.check_output(['netstat', '-ano'])
                for line in o.decode('utf-8').splitlines():
                    if '10101' in line and 'LISTEN' in line:
                        subprocess.Popen(['taskkill', '/F', '/PID', line.split()[4]]).communicate()
                        break
            else:
                os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)
