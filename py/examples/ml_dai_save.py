# WaveML / DAI / Save
# Save and load Wave Models built using Driverless AI.
# ---
import os

from h2o_wave import main, app, Q, copy_expando, ui
from h2o_wave_ml import build_model, get_model, ModelType
from h2o_wave_ml.utils import list_dai_instances

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

STEAM_URL = os.environ.get('STEAM_URL')
MLOPS_URL = os.environ.get('MLOPS_URL')

DATASET_TEXT = '''The sample dataset used is the
    <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_wine.html" target="_blank">wine dataset</a>.'''
STEAM_TEXT = f'''No Driverless AI instances available. You may create one in 
    <a href="{STEAM_URL}/#/driverless/instances" target="_blank">AI Engines</a> and refresh the page.'''


def dai_experiment_url(instance_id: str, instance_name: str):
    # URL link to Driverless AI experiment
    return f'''**Driverless AI Experiment:**
        <a href="{STEAM_URL}/oidc-login-start?forward=/proxy/driverless/{instance_id}/openid/callback" target="_blank">{instance_name}</a>'''


def mlops_deployment_url(project_id: str):
    # URL link to MLOps deployment
    return f'**MLOps Deployment:** <a href="{MLOPS_URL}/projects/{project_id}" target="_blank">{project_id}'


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
        ui.text(content=DATASET_TEXT),
        ui.dropdown(name='dai_instance_id', label='Select Driverless AI instance', value=q.client.dai_instance_id,
                    choices=q.client.choices_dai_instances, required=True),
        ui.text(content=STEAM_TEXT, visible=q.client.disable_training),
        ui.buttons(items=[
            ui.button(name='train', label='Train', primary=True, disabled=q.client.disable_training),
            ui.button(name='predict', label='Predict', primary=True, disabled=True),
        ])
    ]


def form_training_progress(q: Q):
    # display when model training is in progress
    return [
        ui.text(content=DATASET_TEXT),
        ui.dropdown(name='dai_instance_id', label='Select Driverless AI instance', value=q.client.dai_instance_id,
                    choices=q.client.choices_dai_instances, required=True),
        ui.buttons(items=[
            ui.button(name='train', label='Train', primary=True, disabled=True),
            ui.button(name='predict', label='Predict', primary=True, disabled=True)
        ]),
        ui.progress(label='Training in progress...', caption='This can take a few minutes...'),
        ui.text(content=q.client.model_details)
    ]


def form_training_completed(q: Q):
    # display when model training is completed
    return [
        ui.text(content=DATASET_TEXT),
        ui.dropdown(name='dai_instance_id', label='Select Driverless AI instance', value=q.client.dai_instance_id,
                    choices=q.client.choices_dai_instances, required=True),
        ui.buttons(items=[
            ui.button(name='train', label='Train', primary=True),
            ui.button(name='predict', label='Predict', primary=True)
        ]),
        ui.message_bar(type='success', text='Training successfully completed!'),
        ui.text(content=q.client.model_details)
    ]


def form_prediction_completed(q: Q):
    # display when model prediction is completed
    return [
        ui.text(content=DATASET_TEXT),
        ui.dropdown(name='dai_instance_id', label='Select Driverless AI instance', value=q.client.dai_instance_id,
                    choices=q.client.choices_dai_instances, required=True),
        ui.buttons(items=[
            ui.button(name='train', label='Train', primary=True),
            ui.button(name='predict', label='Predict', primary=True)
        ]),
        ui.message_bar(type='success', text='Prediction successfully completed!'),
        ui.text(content=q.client.model_details),
        ui.text(content=f'''**Example predictions:** <br />
            {q.client.preds[0]} <br /> {q.client.preds[1]} <br /> {q.client.preds[2]}''')
    ]


@app('/demo')
async def serve(q: Q):
    if 'H2O_CLOUD_ENVIRONMENT' not in os.environ:
        # show appropriate message if app is not running on cloud
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=form_unsupported()
        )
    elif q.args.train:
        # get DAI instance name
        copy_expando(q.args, q.client)

        for dai_instance in q.client.dai_instances:
            if dai_instance['id'] == int(q.client.dai_instance_id):
                q.client.dai_instance_name = dai_instance['name']

        # set DAI model details
        q.client.model_details = dai_experiment_url(q.client.dai_instance_id, q.client.dai_instance_name)

        # show training progress and details
        q.page['example'].items = form_training_progress(q)
        await q.page.save()

        # train WaveML Model using Driverless AI
        wave_model = await q.run(
            func=build_model,
            train_df=q.client.train_df,
            target_column='target',
            model_type=ModelType.DAI,
            refresh_token=q.auth.refresh_token,
            _steam_dai_instance_name=q.client.dai_instance_name,
            _dai_accuracy=1,
            _dai_time=1,
            _dai_interpretability=10
        )

        # update and save DAI model details
        q.client.project_id = wave_model.project_id
        q.client.endpoint_url = wave_model.endpoint_url
        q.client.model_details += f'<br />{mlops_deployment_url(q.client.project_id)}'

        # show prediction option
        q.page['example'].items = form_training_completed(q)
    elif q.args.predict:
        # load model from it's endpoint URL
        wave_model = get_model(endpoint_url=q.client.endpoint_url, refresh_token=q.auth.refresh_token)

        # predict on test data
        q.client.preds = wave_model.predict(test_df=q.client.test_df)

        # show predictions
        q.page['example'].items = form_prediction_completed(q)
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
                disabled=x['status'] != 'running'
            ) for x in q.client.dai_instances
        ]

        running_dai_instances = [x['id'] for x in q.client.dai_instances if x['status'] == 'running']
        q.client.disable_training = False if running_dai_instances else True
        q.client.dai_instance_id = str(running_dai_instances[0]) if running_dai_instances else ''

        # display ui
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=form_default(q)
        )

    await q.page.save()
