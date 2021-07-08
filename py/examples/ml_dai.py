# WaveML / DAI
# Build Wave Models for training and prediction of classification or regression using Driverless AI.
# ---
import os

from h2o_wave import main, app, Q, copy_expando, ui
from h2o_wave_ml import build_model, ModelType
from h2o_wave_ml.utils import list_dai_instances

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

STEAM_URL = os.environ.get('STEAM_URL')
MLOPS_URL = os.environ.get('MLOPS_URL')

DATASET_TEXT = '''The sample dataset used is the
    <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_wine.html" target="_blank">wine dataset</a>.'''
STEAM_TEXT = f'''No Driverless AI instances available. You may create one in 
    <a href="{STEAM_URL}/#/driverless/instances" target="_blank">AI Engines</a> and refresh the page.'''


@app('/demo')
async def serve(q: Q):
    if 'H2O_CLOUD_ENVIRONMENT' not in os.environ:
        # show appropriate message if app is not running on cloud
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text('''This example requires access to Driverless AI running on
                    <a href="https://h2oai.github.io/h2o-ai-cloud" target="_blank">H2O AI Hybrid Cloud</a> 
                    and does not support standalone app instances.'''),
                ui.text('''Sign up at <a href="https://h2o.ai/free" target="_blank">https://h2o.ai/free</a>
                    to run apps on cloud.''')
            ]
        )
    elif q.args.train:
        # get DAI instance name
        copy_expando(q.args, q.client)

        for dai_instance in q.client.dai_instances:
            if dai_instance['id'] == int(q.client.dai_instance_id):
                dai_instance_name = dai_instance['name']

        # set DAI model details
        q.client.model_details = f'''**Driverless AI Experiment:**
            <a href="{STEAM_URL}/oidc-login-start?forward=/proxy/driverless/{q.client.dai_instance_id}/openid/callback" target="_blank">{dai_instance_name}</a>'''

        # show training progress and details
        q.page['example'].items = [
            ui.text(content=DATASET_TEXT),
            ui.dropdown(
                name='dai_instance_id',
                label='Select Driverless AI instance',
                choices=q.client.choices_dai_instances,
                value=q.client.dai_instance_id,
                required=True),
            ui.buttons(items=[
                ui.button(name='train', label='Train', primary=True, disabled=True),
                ui.button(name='predict', label='Predict', primary=True, disabled=True)
            ]),
            ui.progress(label='Training in progress...', caption='This can take a few minutes...'),
            ui.text(content=q.client.model_details)
        ]
        await q.page.save()

        # train WaveML Model using Driverless AI
        q.client.wave_model = await q.run(
            build_model,
            train_df=q.client.train_df,
            target_column='target',
            model_type=ModelType.DAI,
            refresh_token=q.auth.refresh_token,
            _steam_dai_instance_name=dai_instance_name,
            _dai_accuracy=1,
            _dai_time=1,
            _dai_interpretability=10
        )

        # update DAI model details
        project_id = q.client.wave_model.project_id
        q.client.model_details += f'''<br />**MLOps Deployment:**
            <a href="{MLOPS_URL}/projects/{project_id}" target="_blank">{project_id}'''

        # show prediction option
        q.page['example'].items = [
            ui.text(content=DATASET_TEXT),
            ui.dropdown(
                name='dai_instance_id',
                label='Select Driverless AI instance',
                choices=q.client.choices_dai_instances,
                value=q.client.dai_instance_id,
                required=True),
            ui.buttons(items=[
                ui.button(name='train', label='Train', primary=True),
                ui.button(name='predict', label='Predict', primary=True)
            ]),
            ui.message_bar(type='success', text='Training successfully completed!'),
            ui.text(content=q.client.model_details)
        ]
    elif q.args.predict:
        # predict on test data
        preds = q.client.wave_model.predict(test_df=q.client.test_df)

        # show predictions
        q.page['example'].items = [
            ui.text(content=DATASET_TEXT),
            ui.dropdown(
                name='dai_instance_id',
                label='Select Driverless AI instance',
                choices=q.client.choices_dai_instances,
                value=q.client.dai_instance_id,
                required=True),
            ui.buttons(items=[
                ui.button(name='train', label='Train', primary=True),
                ui.button(name='predict', label='Predict', primary=True)
            ]),
            ui.message_bar(type='success', text='Prediction successfully completed!'),
            ui.text(content=q.client.model_details),
            ui.text(content=f'**Example predictions:** <br />{preds[0]} <br /> {preds[1]} <br /> {preds[2]}')
        ]
    else:
        # prepare sample train and test dataframes
        data = load_wine(as_frame=True)['frame']
        q.client.train_df, q.client.test_df = train_test_split(data, train_size=0.8)

        # DAI instances
        q.client.dai_instances = list_dai_instances(refresh_token=q.auth.refresh_token)
        q.client.choices_dai_instances = [
            ui.choice(
                name=str(x['id']),
                label=f'{x["name"]} ({x["status"].capitalize()})',
                disabled=False if x['status'] == 'running' else True
            ) for x in q.client.dai_instances
        ]

        running_dai_instances = [x['id'] for x in q.client.dai_instances if x['status'] == 'running']
        if len(running_dai_instances) == 0:
            disable_training = True
            q.client.dai_instance_id = ''
        else:
            disable_training = False
            q.client.dai_instance_id = str(running_dai_instances[0])

        # display ui
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text(content=DATASET_TEXT),
                ui.dropdown(
                    name='dai_instance_id',
                    label='Select Driverless AI instance',
                    choices=q.client.choices_dai_instances,
                    value=q.client.dai_instance_id,
                    required=True),
                ui.text(content=STEAM_TEXT, visible=disable_training),
                ui.buttons(items=[
                    ui.button(name='train', label='Train', primary=True, disabled=disable_training),
                    ui.button(name='predict', label='Predict', primary=True, disabled=True),
                ]),
                ui.message_bar(type='warning', text='Training will take a few seconds')
            ]
        )

    await q.page.save()
