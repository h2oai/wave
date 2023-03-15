import signal
import subprocess
import time
import os
import requests
from requests.adapters import HTTPAdapter, Retry


cwd = os.path.join(os.path.dirname(__file__))

kc_p = subprocess.Popen(['docker', 'build', '-t', 'keycloak', '-f', 'keycloak.dockerfile', '.'], cwd=cwd)
kc_p.communicate()

if kc_p.returncode != 0:
    raise Exception('Failed to build keycloak image')

kc_p = subprocess.Popen(['docker', 'run', '--rm' '-p', '8080:8080', 'keycloak:latest'], cwd=cwd)

# Wait for keycloak to start
time.sleep(10)

waved_p = None
try:
    s = requests.Session()
    s.mount('http://', HTTPAdapter(max_retries=Retry(total=5, backoff_factor=2)))
    res = s.get('http://localhost:8080/realms/master/.well-known/openid-configuration')

    if res.status_code != 200 and res.status_code != 302:
        raise Exception('Failed to start keycloak')

    # Start waved
    waved_cwd = os.path.join(os.path.dirname(__file__), '..')
    args = ['go', 'run', 'cmd/wave/main.go', '-web-dir', './ui/build', '-public-dir', '/assets/@./assets']
    env = os.environ.copy()
    env['H2O_WAVE_OIDC_PROVIDER_URL'] = 'http://localhost:8080/realms/master'
    env['H2O_WAVE_OIDC_REDIRECT_URL'] = 'http://localhost:10101/_auth/callback'
    env['H2O_WAVE_OIDC_CLIENT_ID'] = 'wave'
    env['H2O_WAVE_OIDC_CLIENT_SECRET'] = 'YBuOaJYbHYkKrtuFglPcBjp9JlwfIaQy'

    waved_p = subprocess.Popen(args=args, cwd=waved_cwd, env=env)
    time.sleep(2)
    if waved_p.returncode is not None:
        raise Exception('Failed to start waved')

    test_p = subprocess.Popen(['./venv/bin/pytest', 'test_keycloak.py'], cwd=cwd)
    test_p.communicate()
    if test_p.returncode != 0:
        raise Exception('Failed to run test_keycloak.py')

except Exception as e:
    print(e)
finally:
    if waved_p:
        os.killpg(os.getpgid(waved_p.pid), signal.SIGTERM)
    if kc_p:
        kc_p.send_signal(signal.SIGINT)
