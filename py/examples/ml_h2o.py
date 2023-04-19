# WaveML / H2O-3
# Build Wave Models for training and prediction of classification or regression using H2O-3 AutoML.
# ---
from h2o_wave import main, app, Q, ui
from h2o_wave_ml import build_model, ModelType

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split


@app('/demo')
async def serve(q: Q):
    if q.args.train:
        # train WaveML Model using H2O-3 AutoML
        q.client.wave_model = build_model(
            train_df=q.client.train_df,
            target_column='target',
            model_type=ModelType.H2O3,
            _h2o3_max_runtime_secs=5,
            _h2o3_nfolds=2
        )
        model_id = q.client.wave_model.model.model_id
        accuracy = round(100 - q.client.wave_model.model.mean_per_class_error() * 100, 2)

        # show training details and prediction option
        q.page['example'].predict.disabled = False
        q.page['example'].message.type = 'success'
        q.page['example'].message.text = 'Training successfully completed!'
        q.page['example'].model_id.content = f'''**H2O AutoML model id:** {model_id} <br />
            **Accuracy:** {accuracy}%'''
        q.page['example'].example_predictions.content = ''
    elif q.args.predict:
        # predict on test data
        preds = q.client.wave_model.predict(test_df=q.client.test_df)

        # show predictions
        q.page['example'].message.text = 'Prediction successfully completed!'
        q.page['example'].example_predictions.content = f'''**Example predictions:** <br />
            {preds[0]} <br /> {preds[1]} <br /> {preds[2]}'''
    else:
        # prepare sample train and test dataframes
        data = load_wine(as_frame=True)['frame']
        q.client.train_df, q.client.test_df = train_test_split(data, train_size=0.8)

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
                ui.message_bar(name='message', type='warning', text='Training will take a few seconds'),
                ui.text(name='model_id', content=''),
                ui.text(name='example_predictions', content='')
            ]
        )

    await q.page.save()
