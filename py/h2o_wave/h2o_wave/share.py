import socket
import ssl
from threading import Thread


def pipe(s1: socket.socket, s2: socket.socket) -> None:
    while True:
        data = s1.recv(4096)
        s2.sendall(data)
        # Client disconnected.
        if not data:
            return


def listen_on_socket(local_ip: str, local_port: int, remote_host: str, remote_port: int) -> None:
    while True:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as local_socket:
            local_socket.connect((local_ip, local_port))
            remote_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            with ssl.wrap_socket(remote_socket) as remote_socket:
                remote_socket.connect((remote_host, remote_port))

                remote_local = Thread(target=pipe, args=(remote_socket, local_socket))
                local_remote = Thread(target=pipe, args=(local_socket, remote_socket))

                remote_local.start()
                local_remote.start()
                remote_local.join()
                local_remote.join()
