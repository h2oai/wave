# Native Plots
# Make plots with native Wave.
# In this example, we show a selective of native plots.
# ---

import pandas as pd
from h2o_wave import main, app, data, Q, ui


values = pd.DataFrame([
    ('US', 'C1', '2010-12-14', 18, 20.22, 4, 0, 10),
    ('UK', 'C1', '2010-12-14', 21, 23.82, 6, 10, 20),
    ('US', 'C2', '2010-12-15', 24, 28.56, 10, 20, 30),
    ('UK', 'C2', '2010-12-15', 16, 18.57, 7, 30, 40),
    ('US', 'C3', '2010-12-16', 25, 28.45, 6, 40, 50),
    ('UK', 'C3', '2010-12-16', 28, 34.25, 5, 50, 60),
    ('US', 'C4', '2010-12-17', 27, 30.12, 2, 60, 70),
    ('UK', 'C4', '2010-12-17', 24, 25.67, 5, 70, 80),
    ('US', 'C5', '2010-12-18', 19, 23.78, 3, 80, 90),
    ('UK', 'C5', '2010-12-18', 17, 20.74, 8, 90, 100),
    ('US', 'C6', '2010-12-19', 18, 20.76, 4, 100, 110),
    ('UK', 'C6', '2010-12-19', 25, 29.98, 2, 110, 120),
    ('US', 'C7', '2010-12-20', 21, 24.82, 6, 120, 130),
    ('UK', 'C7', '2010-12-20', 26, 30.12, 5, 130, 140),
    ('US', 'C8', '2010-12-21', 16, 17.34, 8, 140, 150),
    ('UK', 'C8', '2010-12-21', 23, 26.67, 10, 150, 160),
    ('US', 'C9', '2010-12-22', 15, 17.78, 3, 160, 170),
    ('UK', 'C9', '2010-12-22', 18, 20.43, 7, 170, 180),
    ('US', 'C10', '2010-12-23', 19, 23.54, 5, 180, 190),
    ('UK', 'C10', '2010-12-23', 16, 18.23, 4, 190, 200)],
    columns=['country', 'product', 'date', 'price', 'performance', 'discount','min_amount', 'max_amount'])


# Transposed grouped bar plot
# Add labels to bars with label parameters
grouped_bar = ui.plot_card(
    box='1 1 3 4',
    title='Product Price by Country',
    data=data(fields=['country', 'product', 'price'], rows=list(zip(values['country'], values['product'], values['price']))),
    plot=ui.plot([ui.mark(type='interval', x='=price', y='=product', color='=country', dodge='auto', y_min=0, x_title='Price',
                          y_title='Product', label='=price', label_offset=0, label_position='middle', label_rotation='0',
                          label_fill_color='#333333', label_font_weight='bold', label_stroke_color='#fff', label_stroke_size=2)]))


# Area plot with a line
# Select a color by adding it to ui.mark color='#333333'
# Try curve='smooth' for a smooth line over the area, or a smooth area
area_plot = ui.plot_card(
    box='4 1 4 4',
    title='Price over Time',
    data=data(fields=['date', 'price'], rows=list(zip(values['date'], values['price']))),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price', y_min=0, x_title='Date', y_title='Price'),
                  ui.mark(type='line', x='=date', y='=price')])
)

# Grouped Area Plot
# Add stack='auto' for a stacked area plot
grouped_area = ui.plot_card(
    box='8 1 4 4',
    title='Price over Time by Country',
    data=data(fields=['country', 'date', 'price'], rows=list(zip(values['country'],values['date'], values['price']))),
    plot=ui.plot([ui.mark(type='area', x_scale='time', x='=date', y='=price', color='=country', y_min=0, x_title='Date', y_title='Price')])
)


# Histogram
histogram = ui.plot_card(
    box='1 5 4 4',
    title='Price per Number of Products',
    data=data(fields=['price', 'min_amount', 'max_amount'], rows=list(zip(values['price'],values['min_amount'], values['max_amount']))),
    plot=ui.plot([ui.mark(type='interval', y='=price', x1='=min_amount', x2='=max_amount', y_min=0, x_title='Amount', y_title='Price')]))


# Stacked bar plot
# Add annotations by passing additional u.mark elements.
stacked_bar = ui.plot_card(
    box='5 5 4 4',
    title='Product Price by Country',
    data=data(fields=['country', 'product', 'price'], rows=list(zip(values['country'], values['product'], values['price']))),
    plot=ui.plot([ui.mark(type='interval', x='=product', y='=price', color='=country', stack='auto', x_title='Product', y_title='Price'),
                  ui.mark(x='C4', y=26.5, label='Product Average Price', label_fill_color='#333333',
                          label_font_weight='bold', label_stroke_color='#fff', label_stroke_size=2),
                  ui.mark(x='C7', label='Best Seller', label_fill_color='#333333',
                          label_font_weight='bold', label_stroke_color='#fff', label_stroke_size=2),
                  ui.mark(y=20, label='Average Price', label_fill_color='#333333',
                          label_font_weight='bold', label_stroke_color='#fff', label_stroke_size=2),
                  ui.mark(x='C8', x0='C6', label='vertical region'),
                  ui.mark(y=15, y0=20, label='horizontal region')]))

# Polar bar plot
# Over available coordinates: coord='helix'; coord='theta'
polar_plot = ui.plot_card(
    box='9 5 3 4',
    title='Product Price by Country',
    data=data(fields=['country', 'product', 'price'], rows=list(zip(values['country'], values['product'], values['price']))),
    plot=ui.plot([ui.mark(coord='polar', type='interval',x='=product', y='=price', color='=country', stack='auto', y_min=0)]))


# Custom Point Plot
# In point plots you can change the shape of the points per group with shape_range='circle square'
point_plot = ui.plot_card(
    box='1 9 5 4',
    title='Performance by Price and Discount',
    data=data(fields=['price', 'performance', 'discount'], rows=list(zip(values['price'], values['performance'], values['discount']))),
    plot=ui.plot([ui.mark(type='point', x='=price', y='=performance', size='=discount', size_range='4 30',
                          fill_color='#eb4559', stroke_color='#eb4559', stroke_size=1, fill_opacity=0.3,
                          stroke_opacity=1, x_title='Price', y_title='Performance')]))

# Heatmap
heatmap = ui.plot_card(
    box='6 9 -1 4',
    title='Product Price by Country',
    data=data(fields=['country', 'product', 'price'], rows=list(zip(values['country'], values['product'], values['price']))),
    plot=ui.plot([ui.mark(type='polygon', x='=country', y='=product', color='=price',
                          color_range='#fee8c8 #fdbb84 #e34a33', x_title='Country', y_title='Product')]))


@app('/demo')
async def serve(q: Q):
    q.page.add('grouped_bar', grouped_bar)
    q.page.add('stacked_bar', stacked_bar)
    q.page.add('area_plot', area_plot)
    q.page.add('grouped_area', grouped_area)
    q.page.add('histogram', histogram)
    q.page.add('polar', polar_plot)
    q.page.add('point', point_plot)
    q.page.add('heatmap', heatmap)
    await q.page.save()
