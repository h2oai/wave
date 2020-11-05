from h2o_wave import site, data, ui
from h2o_wave.ml import build_model
import datatable as dt

page = site['/predictions']

target = 'Fuel_Price'
train_set = 'walmart_train.csv'
test_set = 'walmart_test.csv'

df_train = dt.fread(train_set)
df_test = dt.fread(test_set)

model = build_model(train_set, target=target)
prediction = model.predict(df_test.to_tuples())

n_train = 50
n_test = df_test.nrows
n_total = n_train + n_test
v = page.add('example', ui.plot_card(
    box='1 1 4 5',
    title='Line',
    data=data('date price', n_total),
    plot=ui.plot([ui.mark(type='line', x_scale='time', x='=date', y='=price', y_min=0)])
))

# We are taking the last `n_train` values from the train set.
values_train = [(df_train[-i, 'Date'], df_train[-i, 'Fuel_Price']) for i in reversed(range(1, n_train + 1))]
values_test = [(df_test[i, 'Date'], prediction[i][0]) for i in range(n_test)]

v.data = values_train + values_test

page.save()
