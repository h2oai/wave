# Plot / Plotly
# Use #plotly to create plots. Also demonstrates how to provide live control over plots.
# #plot
# ---

import numpy as np
from plotly import graph_objects as go
from plotly import io as pio

from h2o_wave import ui, main, app, Q

np.random.seed(19680801)


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:  # First visit
        q.client.initialized = True
        q.client.points = 25
        q.client.plotly_controls = False

        q.page['controls'] = ui.form_card(
            box='1 1 4 2',
            items=[
                ui.slider(name='points', label='Points', min=5, max=50, step=1, value=q.client.points, trigger=True),
                ui.toggle(name='plotly_controls', label='Plotly Controls', trigger=True),
            ]
        )
        q.page['plot'] = ui.frame_card(box='1 3 4 5', title='', content='')

    if q.args.points:
        q.client.points = q.args.points

    if q.args.plotly_controls is not None:
        q.client.plotly_controls = q.args.plotly_controls

    n = q.client.points

    # Create plot with plotly
    fig = go.Figure(data=go.Scatter(
        x=np.random.rand(n),
        y=np.random.rand(n),
        mode='markers',
        marker=dict(size=(8 * np.random.rand(n)) ** 2,
                    color=np.random.rand(n)),
        opacity=0.8,
    ))
    _ = fig.update_layout(
        margin=dict(l=10, r=10, t=10, b=10),
        paper_bgcolor='rgb(255, 255, 255)',
        plot_bgcolor='rgb(255, 255, 255)',
    )
    config = {'scrollZoom': q.client.plotly_controls,
              'showLink': q.client.plotly_controls,
              'displayModeBar': q.client.plotly_controls}
    html = pio.to_html(fig, validate=False, include_plotlyjs='cdn', config=config)

    q.page['plot'].content = html

    # Save page
    await q.page.save()
