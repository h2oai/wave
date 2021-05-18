# Plot / Bokeh / Widgets
# Embed Bokeh widgets with script callbacks
# ---

# Original source: https://docs.bokeh.org/en/latest/docs/user_guide/interaction/callbacks.html#customjs-for-selections

import json
from random import random
from h2o_wave import main, app, Q, ui, data
from bokeh.resources import CDN
from bokeh.layouts import row
from bokeh.models import ColumnDataSource, CustomJS
from bokeh.plotting import figure, output_file, show
from bokeh.embed import json_item


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.client.initialized = True

        # Create a plot
        x = [random() for x in range(500)]
        y = [random() for y in range(500)]

        s1 = ColumnDataSource(data=dict(x=x, y=y))
        p1 = figure(plot_width=400, plot_height=400, tools="lasso_select", title="Select Here")
        p1.circle('x', 'y', source=s1, alpha=0.6)

        s2 = ColumnDataSource(data=dict(x=[], y=[]))
        p2 = figure(plot_width=400, plot_height=400, x_range=(0, 1), y_range=(0, 1), tools="", title="Watch Here")
        p2.circle('x', 'y', source=s2, alpha=0.6)

        s1.selected.js_on_change(
            'indices',
            CustomJS(
                args=dict(s1=s1, s2=s2),
                code="""
                var indices = cb_obj.indices;
                var d1 = s1.data;
                var d2 = s2.data;
                d2['x'] = []
                d2['y'] = []
                for (var i = 0; i < indices.length; i++) {
                  d2['x'].push(d1['x'][indices[i]])
                  d2['y'].push(d1['y'][indices[i]])
                }
                s2.change.emit();

                // Send the selected indices to the Wave app via an event.
                // Here, 
                // - The first argument, 'the_plot', is some name to uniquely identify the source of the event.
                // - The second argument, 'selected', is some name to uniquely identify the type of event.
                // - The third argument is any arbitrary data to be sent as part of the event.
                // Ordinarily, we would just call wave.emit('the_plot', 'selected', indices), but this particular
                //   example triggers events every time the indices change (which is several times per second), 
                //   so we use a 'debounced' version of 'emit()' that waits for a second before emitting an event.
                // Here, 'emit_debounced()' is not part of the Wave API, but custom-built for this example - see
                //   the inline_script's 'content' below.
                emit_debounced('the_plot', 'selected', indices);
                // The indices will be accessible to the Wave app using 'q.events.the_plot.selected'.
                """
            )
        )

        layout = row(p1, p2)

        # Serialize the plot as JSON.
        # See https://docs.bokeh.org/en/latest/docs/user_guide/embed.html#json-items
        plot_id = 'my_plot'
        plot_data = json.dumps(json_item(layout, plot_id))

        q.page['meta'] = ui.meta_card(
            box='',
            # Import Bokeh Javascript libraries from CDN
            scripts=[ui.script(path=f) for f in CDN.js_files],
            # Execute custom Javascript
            script=ui.inline_script(
                # The inline script does two things:
                content=f'''
                // 1. Create a debounced version of `wave.emit()` and make it accessible to Bokeh's event handler.
                // window.emit_debounced() is the name of new, debounced (calmer) version of wave.emit() that waits 
                //  for 1000ms before emitting an event.
                window.emit_debounced=window.wave.debounce(1000, window.wave.emit); 
                
                // 2. Make Bokeh render the plot.
                Bokeh.embed.embed_item({plot_data});
                ''',
                # Ensure that the Bokeh Javascript library is loaded
                requires=['Bokeh'],
                # Ensure that the target HTML container element is available
                targets=[plot_id],
            ),
        )
        q.page['plot'] = ui.markup_card(
            box='1 1 6 6',
            title='',
            content=f'<div id="{plot_id}"></div>',
        )
        q.page['details'] = ui.markdown_card(
            box='1 7 6 2',
            title='Selected Marks',
            content='Nothing selected.',
        )
    else:
        if q.events.the_plot.selected:
            q.page['details'].content = f'You selected {q.events.the_plot.selected}'

    await q.page.save()
