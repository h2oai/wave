# WaveML / DAI / Instances
# List the Driverless AI instances of the user on Steam.
# ---
import os

from h2o_wave import main, app, Q, ui
from h2o_wave_ml.utils import list_dai_instances

STEAM_URL = os.environ.get('STEAM_URL')
STEAM_TEXT = f'''No Driverless AI instances available. You may create one in 
    <a href="{STEAM_URL}/#/driverless/instances" target="_blank">AI Engines</a> and refresh the page.'''

ICON_MAP = {
    'created': 'Blocked2Solid',
    'starting': 'Blocked2Solid',
    'running': 'CompletedSolid',
    'unreachable': 'AlertSolid',
    'failed': 'AlertSolid',
    'stopping': 'Blocked2Solid',
    'stopped': 'Blocked2Solid',
    'terminating': 'Blocked2Solid',
    'terminated': 'Blocked2Solid'
}


def dai_instances_table(dai_instances: list):
    # dai instances in ui.table
    return ui.table(
        name='table_dai',
        columns=[
            ui.table_column(name='id', label='Id', min_width='50px', max_width='51px', link=False),
            ui.table_column(name='name', label='Name', link=False),
            ui.table_column(name='status', label='Status', cell_type=ui.icon_table_cell_type(color='#CDDD38'),
                            link=False),
            ui.table_column(name='description', label='Description', link=False),
            ui.table_column(name='version', label='Version', link=False)
        ],
        rows=[
            ui.table_row(str(i), [
                str(dai_instances[i]['id']),
                dai_instances[i]['name'],
                ICON_MAP[dai_instances[i]['status']],
                dai_instances[i]['status'],
                dai_instances[i]['version']
            ]) for i in range(len(dai_instances))
        ]
    )


def form_unsupported():
    # display when app is not running on cloud
    return [
        ui.text('''This example requires access to Driverless AI running on
            <a href="https://h2oai.github.io/h2o-ai-cloud" target="_blank">H2O AI Hybrid Cloud</a> 
            and does not support standalone app instances.'''),
        ui.text('''Sign up at <a href="https://h2o.ai/free" target="_blank">https://h2o.ai/free</a>
            to run apps on cloud.''')
    ]


def form_default(q: Q):
    # display when app is initialized
    return [
        ui.label(label='List of Driverless AI instances'),
        dai_instances_table(dai_instances=q.client.dai_instances)
    ]


@app('/demo')
async def serve(q: Q):
    if 'H2O_CLOUD_ENVIRONMENT' not in os.environ:
        # show appropriate message if app is not running on cloud
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=form_unsupported()
        )
    else:
        # DAI instances
        q.client.dai_instances = list_dai_instances(refresh_token=q.auth.refresh_token)

        # display ui
        if q.client.dai_instances:
            q.page['example'] = ui.form_card(
                box='1 1 -1 -1',
                items=form_default(q)
            )
        else:
            q.page['example'] = ui.form_card(
                box='1 1 -1 -1',
                items=[ui.text(content=STEAM_TEXT)]
            )

    await q.page.save()
