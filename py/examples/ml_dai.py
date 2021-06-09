# WaveML / DAI
# Build Wave Models for training and prediction of classification or regression using Driverless AI.
# ---
import os

from h2o_wave import main, app, Q, ui
from h2o_wave_ml import build_model, ModelType
from h2o_wave_ml.utils import list_dai_instances

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split

STEAM_URL = os.environ.get('STEAM_URL')
MLOPS_URL = os.environ.get('MLOPS_URL')


@app('/demo')
async def serve(q: Q):
    if 'H2_CLOUD_ENVIRONMENT' not in os.environ:
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
        for dai_instance in q.client.dai_instances:
            if dai_instance['id'] == int(q.args.dai_instance_id):
                dai_instance_name = dai_instance['name']

        model_details = f'''**Driverless AI Experiment:**
            <a href="{STEAM_URL}/oidc-login-start?forward=/proxy/driverless/{q.args.dai_instance_id}/openid/callback" target="_blank">{dai_instance_name}</a>'''

        # show training progress and details
        q.page['example'].items[1].dropdown.value = q.args.dai_instance_id
        q.page['example'].items[3].buttons.visible = False
        q.page['example'].items[4].message_bar.type = 'info'
        q.page['example'].items[4].message_bar.text = 'Training in progress...'
        q.page['example'].items[5].progress.visible = True
        q.page['example'].items[6].text.content = model_details
        q.page['example'].items[7].text.content = ''
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

        project_id = q.client.wave_model.project_id
        model_details += f'''<br />**MLOps Deployment:**
            <a href="{MLOPS_URL}/projects/{project_id}" target="_blank">{project_id}'''

        # show prediction option
        q.page['example'].items[3].buttons.visible = True
        q.page['example'].items[3].buttons.items[1].button.disabled = False
        q.page['example'].items[4].message_bar.type = 'success'
        q.page['example'].items[4].message_bar.text = 'Training successfully completed!'
        q.page['example'].items[5].progress.visible = False
        q.page['example'].items[6].text.content = model_details
    elif q.args.predict:
        # predict on test data
        preds = q.client.wave_model.predict(test_df=q.client.test_df)

        # show predictions
        q.page['example'].items[4].message_bar.text = 'Prediction successfully completed!'
        q.page['example'].items[7].text.content = f'''**Example predictions:** <br />
            {preds[0]} <br /> {preds[1]} <br /> {preds[2]}'''
    else:
        # prepare sample train and test dataframes
        data = load_wine(as_frame=True)['frame']
        q.client.train_df, q.client.test_df = train_test_split(data, train_size=0.8)

        # DAI instances
        q.client.dai_instances = list_dai_instances(refresh_token=q.auth.refresh_token)
        choices_dai_instances = [
            ui.choice(
                name=str(x['id']),
                label=f'{x["name"]} ({x["status"].capitalize()})',
                disabled=False if x['status'] == 'running' else True
            ) for x in q.client.dai_instances
        ]

        running_dai_instances = [x['id'] for x in q.client.dai_instances if x['status'] == 'running']
        if len(running_dai_instances) == 0:
            disable_training = True
            dai_instance_id = ''
        else:
            disable_training = False
            dai_instance_id = str(running_dai_instances[0])

        # display ui
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text(content='''The sample dataset used is the
                    <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_wine.html" target="_blank">wine dataset</a>.'''),
                ui.dropdown(
                    name='dai_instance_id',
                    label='Select Driverless AI instance',
                    choices=choices_dai_instances,
                    value=dai_instance_id,
                    required=True),
                ui.text(
                    content=f'''No Driverless AI instances available. You may create one in 
                        <a href="{STEAM_URL}/#/driverless/instances" target="_blank">AI Engines</a> and 
                        refresh the page.''',
                    visible=disable_training),
                ui.buttons(items=[
                    ui.button(name='train', label='Train', primary=True, disabled=disable_training),
                    ui.button(name='predict', label='Predict', primary=True, disabled=True),
                ]),
                ui.message_bar(type='warning', text='Training will take a few seconds'),
                ui.progress(label='This can take a few minutes...', visible=False),
                ui.text(content=''),
                ui.text(content='')
            ]
        )

    await q.page.save()
