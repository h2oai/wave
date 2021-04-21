# Plot / Pandas
# Plot Pandas dataframes.
# ---
from h2o_wave import site, data, ui
import pandas as pd
import numpy as np

page = site['/demo']

n = 100
df = pd.DataFrame(dict(
    length=np.random.rand(n),
    width=np.random.rand(n),
    data_type=np.random.choice(a=['Train', 'Test'], size=n, p=[0.8, 0.2])
))

# Plot two numeric columns by each other and color based on a third, categorical column
page['scatter'] = ui.plot_card(
    box='1 1 4 5',
    title='Scatter Plot from Dataframe',
    data=data(
        fields=df.columns.tolist(),
        rows=df.values.tolist(),
        pack=True,
    ),
    plot=ui.plot(marks=[ui.mark(
        type='point',
        x='=length', x_title='Length',
        y='=width', y_title='Width',
        color='=data_type', shape='circle',
    )])
)

# Aggregate the data in pandas and plot a bar chart of the average value of one column by some other column
df_agg = df.groupby(['data_type']).mean().reset_index()
page['bar'] = ui.plot_card(
    box='1 6 4 5',
    title='Bar Plot from Aggregated Dataframe',
    data=data(
        fields=df_agg.columns.tolist(),
        rows=df_agg.values.tolist(),
        pack=True,
    ),
    plot=ui.plot(marks=[ui.mark(
        type='interval',
        x='=data_type', x_title='Modeling Data Type',
        y='=length', y_title='Length',
    )])
)

page.save()
