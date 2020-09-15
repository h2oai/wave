from seleniumbase import BaseCase
from subprocess import PIPE, Popen
from typing import List
import time


class Test(BaseCase):
    # TODO: consider simpler wrappers for trivial selectors:
    # self.click('button[data-test="step1"]') -> self.click('setup1')
    def visit(self, uri: str):
        # TODO: this should be parameterized,
        # consider test of remote deployment
        self.open(f"http://localhost:55555{uri}")


class Process:
    def __init__(self, cmd: List[str]):
        self.cmd = cmd

    def __enter__(self):
        print(f"Invoked decorator with {self.cmd}")
        self.process = Popen(
            self.cmd, stdout=PIPE, bufsize=1, close_fds=True,
            universal_newlines=True
        )
        time.sleep(2)
        return self.process

    def __exit__(self, exc_type, exc_value, exc_traceback):
        print(f"Terminating decorator with {self.cmd}")
        self.process.terminate()


def with_app(app_name: str):
    # TODO: support remote deployment.
    # Same test, different test environments
    def decorator(function):
        def wrapper(*args, **kwargs):
            with Process(["python", f"{app_name}.py"]):
                return function(*args, **kwargs)

        return wrapper

    return decorator
