import os
import subprocess
import sys


def main():
    env = os.environ.copy()
    env['H2O_WAVE_PUBLIC_DIR'] = '/assets/@./h2o_wave_university/static/'
    try:
        subprocess.Popen(['wave', 'run', 'h2o_wave_university.university', '--no-reload'], cwd=sys.exec_prefix, env=env).communicate()
    except KeyboardInterrupt:
        pass
    