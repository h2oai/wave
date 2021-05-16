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
        q.client.model = build_model(train_file_path='wine_train.csv', target_column='target',
                                     model_type=ModelType.H2O3, _h2o3_max_runtime_secs=5, _h2o3_nfolds=0
        )

        # show prediction option
        q.page['example'].visible = True
        q.page['example'].items[2].message_bar.type = 'success'
        q.page['example'].items[2].message_bar.text = 'Training successfully completed!'
        q.page['example'].items[3].separator.visible = True
        q.page['example'].items[4].text.visible = True
        q.page['example'].items[5].button.visible = True
        q.page['example'].items[6].message_bar.visible = False
    elif q.args.predict:
        # predict on test data
        preds = q.client.model.predict(file_path='wine_test.csv')
        q.page['example'].items[6].message_bar.visible = True
    else:
        # prepare sample train and test datasets
        data = load_wine(as_frame=True)['frame']
        train, test = train_test_split(data, train_size=0.8)
        train.to_csv('wine_train.csv', index=False)
        test.to_csv('wine_test.csv', index=False)

        # display ui
        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text(content='A sample train dataset is prepared in *./wine_train.csv*'),
                ui.button(name='train', label='Train', primary=True),
                ui.message_bar(type='warning', text='Training will take a few seconds'),
                ui.separator(visible=False),
                ui.text(content='A sample test dataset is prepared in *./wine_test.csv*', visible=False),
                ui.button(name='predict', label='Predict', primary=True, visible=False),
                ui.message_bar(type='success', text='Prediction successfully completed!', visible=False)
            ]
        )

    await q.page.save()
