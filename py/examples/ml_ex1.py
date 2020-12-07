from h2o_wave import main, data, ui, site
from h2o_wave.ml import build_model, save_model, load_model

page = site['/prediction']

train_set = '/Users/geomodular/Datasets/creditcard_train_cat.csv'
test_set = '/Users/geomodular/Datasets/creditcard_test_cat.csv'

# model = build_model(train_set, target='DEFAULT_PAYMENT_NEXT_MONTH', accuracy=1, time=1, interpretability=10)
# save_model(model, './')
model = load_model('./XGBoost_1_AutoML_20201206_144027')
prediction = model.predict(test_set)
# print(prediction)

threshold = 0.5

zero_count = len([1 for p in prediction if p[0] < threshold])
one_count = len([1 for p in prediction if p[0] >= threshold])

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Credit card category',
    data=data('category count', rows=[['0', zero_count], ['1', one_count]]),
    plot=ui.plot([ui.mark(type='interval', x='=category', y='=count', y_min=0)])
))

page.save()
