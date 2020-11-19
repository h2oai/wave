from h2o_wave import site, data, ui
from h2o_wave.ml import build_model
import datatable as dt

page = site['/predictions']

train_set = '/Users/geomodular/Datasets/walmart_small_train.csv'
test_set = '/Users/geomodular/Datasets/walmart_small_test.csv'

model = build_model(train_set, target='Weekly_Sales')
prediction = model.predict(test_set)

df_train = dt.fread(train_set)
df_test = dt.fread(test_set)

# We are taking the last 50 values from the train set.
values_train = df_train[-50:, ['Date', 'Weekly_Sales']].to_tuples()
# And continue using next values from test set.
values_test = [(df_test[i, 'Date'], prediction[i][0]) for i in range(df_test.nrows)]

v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line',
    data=data('date sales', rows=values_train + values_test),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=sales', y_min=0)])
))

page.save()
