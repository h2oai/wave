import asyncio


async def pipe(r: asyncio.StreamReader, w: asyncio.StreamWriter) -> None:
    while True:
        data = await r.read(4096)
        if not data:
            break
        w.write(data)
        await w.drain()


async def listen_on_socket(local_host: str, local_port: int, remote_host: str, remote_port: int, id: str) -> None:
    local_reader, local_writer = None, None
    remote_reader, remote_writer = None, None
    retries = 0
    while True:
        if retries > 5:
            break
        try:
            local_reader, local_writer = await asyncio.open_connection(local_host, local_port)
            remote_reader, remote_writer = await asyncio.open_connection(remote_host, remote_port, ssl=True)
            remote_writer.write(f'__h2o_leap__ {id}\n'.encode())

            retries = 0
            await asyncio.gather(pipe(local_reader, remote_writer), pipe(remote_reader, local_writer))

        # Swallow exceptions and reconnect.
        except Exception:
            retries += 1
        finally:
            if local_writer:
                local_writer.close()
            if remote_writer:
                remote_writer.close()
