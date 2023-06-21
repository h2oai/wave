import asyncio


async def pipe(r: asyncio.StreamReader, w: asyncio.StreamWriter) -> None:
    while True:
        data = await r.read(4096)
        if not data:
            break
        w.write(data)
        await w.drain()


async def listen_on_socket(local_host: str, local_port: int, remote_host: str, remote_port: int) -> None:
    while True:
        try:
            local_reader, local_writer = await asyncio.open_connection(local_host, local_port)
            remote_reader, remote_writer = await asyncio.open_connection(remote_host, remote_port, ssl=True)

            await asyncio.gather(pipe(local_reader, remote_writer), pipe(remote_reader, local_writer))

        # Swallow exceptions and reconnect.
        except Exception:
            pass
        finally:
            local_writer.close()
            remote_writer.close()
