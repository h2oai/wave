# Context Menu
# Display a context menu on a card.
# #context_menu
# ---
import json
from h2o_wave import main, app, Q, ui, data

# Vega lite spec for a bar plot, defaults to linear scale.
spec_linear_scale = json.dumps(dict(
    mark='bar',
    encoding=dict(
        x=dict(field='a', type='ordinal'),
        y=dict(field='b', type='quantitative')
    )
))

# Vega lite spec for a bar plot, log scaled.
spec_log_scale = json.dumps(dict(
    mark='bar',
    encoding=dict(
        x=dict(field='a', type='ordinal'),
        y=dict(field='b', type='quantitative', scale=dict(type='log'))
    )
))

# Data for our plot.
plot_data = data(fields=["a", "b"], rows=[
    ["A", 28], ["B", 55], ["C", 43],
    ["D", 91], ["E", 81], ["F", 53],
    ["G", 19], ["H", 87], ["I", 52]
])

# Create a couple of context menu commands.
log_scale_command = ui.command(
    name='to_log_scale',
    label='Log Scale',
    icon='LineChart',
)
linear_scale_command = ui.command(
    name='to_linear_scale',
    label='Linear Scale',
    icon='LineChart',
)


@app('/demo')
async def serve(q: Q):
    if q.client.plot_added:  # Have we already added a plot?
        example = q.page['example']
        if q.args.to_log_scale:
            # Change to log scale
            example.title = 'Plot (Log Scale)',
            example.specification = spec_log_scale
            example.commands = [linear_scale_command]
        else:
            # Change to linear scale
            example.title = 'Plot (Linear Scale)',
            example.specification = spec_linear_scale
            example.commands = [log_scale_command]
    else:  # Add a new plot
        q.page['example'] = ui.vega_card(
            box='1 1 2 4',
            title='Plot (Linear Scale)',
            specification=spec_linear_scale,
            data=plot_data,
            commands=[log_scale_command],
        )
        # Flag to indicate that we've added a plot
        q.client.plot_added = True

    await q.page.save()
