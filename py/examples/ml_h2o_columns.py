# WaveML / H2O-3 / Columns
# Configure categorical columns, feature columns, drop columns for Wave Models built using H2O-3 AutoML.
# ---
from h2o_wave import main, app, Q, ui, copy_expando
from h2o_wave_ml import build_model, ModelType

from sklearn.datasets import load_wine
from sklearn.model_selection import train_test_split


@app('/demo')
async def serve(q: Q):
    if q.args.train:
        # train H2O-3 AutoML model
        if q.args.select_type == 'features':
            q.client.model = build_model(train_file_path='wine_train.csv', target_column='target',
                                         categorical_columns=q.args.categorical_columns, feature_columns=q.args.select_columns,
                                         model_type=ModelType.H2O3, _h2o3_max_runtime_secs=5, _h2o3_nfolds=0
            )
        elif q.args.select_type == 'drop':
            q.client.model = build_model(train_file_path='wine_train.csv', target_column='target',
                                         categorical_columns=q.args.categorical_columns, drop_columns=q.args.drop_columns,
                                         model_type=ModelType.H2O3, _h2o3_max_runtime_secs=5, _h2o3_nfolds=0
            )
        else:
            q.client.model = build_model(train_file_path='wine_train.csv', target_column='target',
                                         categorical_columns=q.args.categorical_columns, model_type=ModelType.H2O3,
                                         _h2o3_max_runtime_secs=5, _h2o3_nfolds=0
            )

        # show prediction option
        q.page['example'].visible = True
        q.page['example'].items[5].message_bar.type = 'success'
        q.page['example'].items[5].message_bar.text = 'Training successfully completed!'
        q.page['example'].items[6].separator.visible = True
        q.page['example'].items[7].text.visible = True
        q.page['example'].items[8].button.visible = True
        q.page['example'].items[9].message_bar.visible = False
    elif q.args.predict:
        # predict on test data
        preds = q.client.model.predict(file_path='wine_test.csv')
        q.page['example'].items[9].message_bar.visible = True
    else:
        # prepare sample train and test datasets
        data = load_wine(as_frame=True)['frame']
        train, test = train_test_split(data, train_size=0.8)
        train.to_csv('wine_train.csv', index=False)
        test.to_csv('wine_test.csv', index=False)

        # display ui
        column_choices = [ui.choice(name=str(col), label=str(col)) for col in train.columns.values if col != 'target']
        select_choices = [ui.choice(name='features', label='Features'), ui.choice(name='drop', label='Drop')]

        q.page['example'] = ui.form_card(
            box='1 1 -1 -1',
            items=[
                ui.text(content='A sample train dataset is prepared in *./wine_train.csv*'),
                ui.dropdown(name='categorical_columns', label='Select categorical columns', values=[], choices=column_choices),
                ui.dropdown(name='select_columns', label='Select features / drop columns', values=[], choices=column_choices),
                ui.choice_group(name='select_type', label='Features / Drop', choices=select_choices),
                ui.button(name='train', label='Train', primary=True),
                ui.message_bar(type='warning', text='Training will take a few seconds'),
                ui.separator(visible=False),
                ui.text(content='A sample test dataset is prepared in *./wine_test.csv*', visible=False),
                ui.button(name='predict', label='Predict', primary=True, visible=False),
                ui.message_bar(type='success', text='Prediction successfully completed!', visible=False)
            ]
        )

    await q.page.save()
