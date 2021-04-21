#!/usr/bin/env python
import logging
import os
from pathlib import Path
from argparse import ArgumentParser, ArgumentTypeError
import re
from shutil import rmtree
from subprocess import PIPE, Popen, TimeoutExpired
from tempfile import mkdtemp
from time import sleep
from typing import Dict, List, Optional


class Process:
    def __init__(self, cmd: List[str], env: Dict[str, str] = {}, sleep_time=5):
        self.cmd = cmd
        self.cmdline = ' '.join([str(c) for c in self.cmd])
        process_env = os.environ.copy()
        process_env.update(env)
        self.env = process_env
        self.sleep_time = sleep_time

    def __enter__(self):
        logging.debug(f"Running command {self.cmdline}")
        self.process = Popen(
            self.cmd,
            stdout=PIPE,
            bufsize=1,
            close_fds=True,
            universal_newlines=True,
            env=self.env,
        )
        logging.debug(f"Waiting {self.sleep_time} seconds for process to wake up")
        sleep(self.sleep_time)
        return self.process

    def __exit__(self, exc_type, exc_value, exc_traceback):
        try:
            logging.debug(f"Terminating command {self.cmdline}")
            self.process.terminate()
            self.process.wait(timeout=self.sleep_time)
        except TimeoutExpired:
            logging.debug(f"Killing process{self.cmdline}")
            self.process.kill()


class TempDir:
    def __init__(self, parent_dir: Path):
        self.parent_dir = parent_dir

    def __enter__(self):
        self.dir_name = mkdtemp(dir=self.parent_dir)
        logging.debug(f"Created temporary directory {self.dir_name}")
        return self.dir_name

    def __exit__(self, exc_type, exc_value, exc_traceback):
        logging.debug(f"Deleting temporary directory {self.dir_name}")
        rmtree(self.dir_name)


def run_app_with_test(
    app_module: Optional[str],
    test_dir: str,
    delay: int,
    browser: Optional[str],
    start_wave: Optional[str],
    wave_web_dir: Optional[str],
    **kwargs
):
    def do_run():
        with TempDir(test_dir / "cypress/integration") as spec_dir:
            cmd = ["wave", "run", app_module]
            with Process(
                cmd=cmd,
                env={"CYPRESS_INTEGRATION_TEST_DIR": spec_dir},
                sleep_time=delay,
            ):
                specs = [f for f in os.listdir(spec_dir) if f.endswith(".spec.js")]
                if not specs:
                    logging.warning(
                        f"No cypress specs generated in {spec_dir}, "
                        f"does {app_module} has any tests defined?"
                    )
                    return
                cypress = "./node_modules/cypress/bin/cypress"
                browser_arg = f"--browser {browser}" if browser else ""
                logging.info(f"Starting cypress to run spec(s): {specs}")
                os.chdir(test_dir)
                os.system(
                    f"{cypress} run --spec {spec_dir}/*.spec.js "
                    f"--reporter junit {browser_arg} "
                    f'--reporter-options "mochaFile=cypress/reports/{app_module}.xml"'
                )

    if start_wave:
        cmd = [str(start_wave), "-web-dir", str(wave_web_dir)] if wave_web_dir else [start_wave]
        with Process(cmd=cmd, sleep_time=delay):
            do_run()
    else:
        do_run()


def file_argument(file_name: str):
    if os.path.exists(file_name) and os.path.isfile(file_name):
        return os.path.abspath(file_name)
    raise ArgumentTypeError(f"file not found: {file_name}")


def dir_argument(dir_name: str):
    if os.path.exists(dir_name) and os.path.isdir(dir_name):
        return os.path.abspath(dir_name)
    raise ArgumentTypeError(f"directory not found: {dir_name}")


def test_path() -> Path: return Path(__file__).parent.resolve()


def wave_root() -> Path: return (test_path() / '..').resolve()


def default_web_dir() -> Path:
    root = wave_root()
    www = root / "www"
    return www if www.exists() else root / "ui/build"


def default_wave_path() -> Path:
    wave_bin = wave_root() / "waved"
    return wave_bin if wave_bin.is_file() else None


def main():
    parser = ArgumentParser(description="Cypress test runner for Wave apps")
    parser.add_argument(
        "-t",
        "--test-dir",
        help="test directory where cypress is installed",
        default=test_path(),
        type=Path,
    )
    parser.add_argument(
        "-d",
        "--delay",
        help="how long should the test wait for app to start",
        type=int,
        default=5,
    )
    parser.add_argument(
        "-l",
        "--log-level",
        help="log level",
        default="info",
    )
    parser.add_argument(
        "-b",
        "--browser",
        help=(
            "runs Cypress in the browser with the given name."
            " if a filesystem path is supplied, Cypress will "
            "attempt to use the browser at that path."
        ),
    )
    parser.add_argument(
        "-w",
        "--start-wave",
        nargs="?",
        const=default_wave_path(),
        default=None,
        metavar="wave_path",
        help="start Wave before running the tests, optionally from the given path"
    )
    parser.add_argument(
        "-wd",
        "--wave-web-dir",
        default=default_web_dir(),
        help='directory to serve Wave web assets from (default "./www")',
    )
    parser.add_argument(
        "-m",
        "--app-module",
        required=True,
        help="python module with wave app",
        type=str,
    )

    args = parser.parse_args()
    logging.basicConfig(
        level=args.log_level.upper(),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    run_app_with_test(**vars(args))


if __name__ == "__main__":
    main()
