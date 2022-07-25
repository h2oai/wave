from h2o_wave import main, app, Q, ui


@app('/')
async def serve(q: Q):
    print(f'Access: \n{q.auth.access_token}')
    print(f'Refresh: \n{q.auth.refresh_token}')
    await q.sleep(70)
    await q.auth.force_token_refresh()
    print(f'Access: \n{q.auth.access_token}')
    print(f'Refresh: \n{q.auth.refresh_token}')
    await q.page.save()
