# Meta / Script / Callback
# Handle events from external Javascript libraries.
# ---
import json
import random
import math
from h2o_wave import main, app, Q, ui

# Create some data for a random graph
node_count = 100
edge_count = 500
nodes = [
    dict(id=f'n{i}', label=f'Node {i}', x=random.random(), y=random.random(), size=random.random(), color='#ff0000')
    for i in range(node_count)]

edges = [dict(id=f'e{i}', source=f'n{math.floor(random.random() * node_count)}',
              target=f'n{math.floor(random.random() * node_count)}', size=random.random(), color='#666') for i in
         range(edge_count)]

graph_data = dict(nodes=nodes, edges=edges)

# Serialize graph data to Javascript / JSON.
graph_data_js = f'const graph = {json.dumps(graph_data)};'

# Define a script that uses Sigma.js to render our graph.
render_graph = graph_data_js + '''
const s = new sigma({ graph: graph, container: 'graph' });
s.bind('clickNode', (e) => { 
  // Emit an event when a node is clicked.
  // All three arguments are arbitrary.
  // Here, we use:
  // - 'graph' to indicate the source of the event.
  // - 'node_clicked' to indicate the type of event.
  // - the third argument can be a string, number, boolean or any complex structure, like { foo: 'bar', qux: 42 }
  // In Python, q.events.graph.node_clicked will be set to the ID of the clicked node.
  wave.emit('graph', 'node_clicked', e.data.node.id); 
});
'''


@app('/demo')
async def serve(q: Q):
    if not q.client.initialized:
        q.page['meta'] = ui.meta_card(
            box='',
            # Load Sigma.js
            scripts=[ui.script(path='https://cdnjs.cloudflare.com/ajax/libs/sigma.js/1.2.1/sigma.min.js')],
            # Call Javascript to render our graph using Sigma.js.
            script=ui.inline_script(
                content=render_graph,
                # Ensure that Sigma.js is available before running our script.
                requires=['sigma'],
                # Ensure that the 'graph' element is available before running our script.
                targets=['graph']
            )
        )
        # Add a placeholder named 'graph' to house our rendered graph.
        q.page['vis'] = ui.markup_card(
            box='1 1 6 8',
            title='Select a node',
            content='<div id="graph" style="width: 800px; height: 500px;"/>'
        )
        # Add another card to display which node was selected.
        q.page['details'] = ui.markdown_card(
            box='1 9 6 1',
            title='',
            content='The selected node will be displayed here.',
        )
        q.client.initialized = True
    else:
        if q.events.graph:
            selected_node = q.events.graph.node_clicked
            if selected_node:
                q.page['details'].content = f'You clicked on node {selected_node}'

    await q.page.save()
