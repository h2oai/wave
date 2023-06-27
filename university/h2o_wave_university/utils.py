

from contextlib import closing
import re
import socket


def scan_free_port(port: int):
    while True:
        # If we run out of ports, wrap around.
        if port > 60000:
            port = 10000
        with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
            if sock.connect_ex(('localhost', port)):
                return port
        port += 1


def read_file(p: str) -> str:
    with open(p, encoding='utf-8') as f:
        return f.read()


def atoi(text):
    return int(text) if text.isdigit() else text


def natural_keys(text):
    return [atoi(c) for c in re.split(r'(\d+)', text)]


def strip_comment(line: str) -> str:
    """Returns the content of a line without '#' and ' ' characters

    remove leading '#', but preserve '#' that is part of a tag
    lesson:
    >>> '# #hello '.strip('#').strip()
    '#hello'
    """
    return line.strip('#').strip()
