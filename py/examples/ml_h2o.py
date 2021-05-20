# WaveML / H2O-3
# Use H2O-3 Automated Machine Learning model for training and prediction of classification or regression models.
# ---
from h2o_wave import main, app, Q, ui, copy_expando
from h2o_wave_ml import build_model, ModelType

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split


@app('/demo')
async def serve(q: Q):
    if q.args.train:
        # train H2O-3 AutoML model
        q.client.wave_model = build_model(train_df=q.client.train, target_column='target',
                                     model_type=ModelType.H2O3, _h2o3_max_runtime_secs=5, _h2o3_nfolds=2
        )
        model_id = q.client.wave_model.model.model_id
        accuracy = round(1 - q.client.wave_model.model.mean_per_class_error(), 2)

        # show training details and prediction option
        q.page['example'].items[1].buttons.items[1].button.disabled = False
        q.page['example'].items[2].message_bar.type = 'success'
        q.page['example'].items[2].message_bar.text = 'Training successfully completed!'
        q.page['example'].items[3].text.content = f'''**H2O AutoML model id:** {model_id} <br />
            **Accuracy:** {accuracy}%'''
        q.page['example'].items[4].text.content = ''
    elif q.args.predict:
        # predict on test data
        preds = q.client.wave_model.predict(test_df=q.client.test)
        q.page['example'].items[2].message_bar.text = 'Prediction successfully completed!'
        q.page['example'].items[4].text.content = f'''**First 3 predictions:** <br />
            {preds[0]} <br /> {preds[1]} <br /> {preds[2]}'''
    else:
        # prepare sample train and test dataframes
        data = load_wine(as_frame=True)['frame']
        q.client.train, q.client.test = train_test_split(data, train_size=0.8)

        # display ui
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text(content='''The sample dataset used is the
                    <a href="https://scikit-learn.org/stable/modules/generated/sklearn.datasets.load_wine.html" target="_blank">wine dataset</a>.'''),
                ui.buttons(items=[
                    ui.button(name='train', label='Train', primary=True),
                    ui.button(name='predict', label='Predict', primary=True, disabled=True),
                ]),
                ui.message_bar(type='warning', text='Training will take a few seconds'),
                ui.text(content=''),
                ui.text(content='')
            ]
        )

    await q.page.save()
