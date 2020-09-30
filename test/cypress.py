#!/usr/bin/env python
import logging
import os
from argparse import ArgumentParser, ArgumentTypeError
from shutil import rmtree
from subprocess import PIPE, Popen
from tempfile import mkdtemp
from time import sleep
from typing import Dict, List, Optional


class Process:
    def __init__(self, cmd: List[str], env: Dict[str, str] = {}, sleep_time=5):
        self.cmd = cmd
        process_env = os.environ.copy()
        process_env.update(env)
        self.env = process_env
        self.sleep_time = sleep_time

    def __enter__(self):
        logging.debug(f"Running command {' '.join(self.cmd)}")
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
        self.process.terminate()


class TempDir:
    def __init__(self, parent_dir):
        self.parent_dir = parent_dir

    def __enter__(self):
        self.dir_name = mkdtemp(dir=self.parent_dir)
        logging.debug(f"Created temporary directory {self.dir_name}")
        return self.dir_name

    def __exit__(self, exc_type, exc_value, exc_traceback):
        logging.debug(f"Deleting temporary directory {self.dir_name}")
        rmtree(self.dir_name)


def run_app_with_test(
    app_file: str,
    test_dir: str,
    sleep_time: int,
    browser: Optional[str],
    start_qd: bool,
    **kwargs
):
    def do_run():
        with TempDir(os.path.join(test_dir, "cypress/integration")) as spec_dir:
            with Process(
                cmd=["python", app_file],
                env={"CYPRESS_INTEGRATION_TEST_DIR": spec_dir},
                sleep_time=sleep_time,
            ):
                specs = [f for f in os.listdir(spec_dir) if f.endswith(".spec.js")]
                if not specs:
                    logging.warning(
                        f"No cypress specs generated in {spec_dir}, "
                        f"does {app_file} has any tests defined?"
                    )
                    return
                app_name = os.path.splitext(os.path.basename(app_file))[0]
                cypress = "./node_modules/cypress/bin/cypress"
                browser_arg = f"--browser {browser}" if browser else ""
                logging.info(f"Starting cypress to run spec(s): {specs}")
                os.chdir(test_dir)
                os.system(
                    f"{cypress} run --spec {spec_dir}/*.spec.js "
                    f"--reporter junit {browser_arg} "
                    f'--reporter-options "mochaFile=cypress/reports/{app_name}.xml"'
                )

    if start_qd:
        parent_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
        qd_path = os.path.join(parent_path, 'qd')
        web_dir = os.path.join(parent_path, 'ui/build')
        with Process(cmd=[qd_path, "-web-dir", web_dir], sleep_time=sleep_time):
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


def main():
    parser = ArgumentParser(description="Cypress test runner for Q apps")
    parser.add_argument(
        "-t",
        "--test-dir",
        help="test directory where cypress is installed",
        default=".",
        type=dir_argument,
    )
    parser.add_argument(
        "-s",
        "--seconds",
        help="how long should the test wait for app to start",
        type=int,
        default=5,
        dest="sleep_time"
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
        help="which browser cypress should use",
    )

    parser.add_argument("-q", "--start-qd", default=False, action="store_true")

    parser.add_argument("app_file", help="Q app python file", type=file_argument)
    args = parser.parse_args()
    logging.basicConfig(
        level=args.log_level.upper(),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    )
    run_app_with_test(**vars(args))


if __name__ == "__main__":
    main()
