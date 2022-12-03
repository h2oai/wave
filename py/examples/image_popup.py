# Image / Popup
# Display a popup with the large image after clicking on the #image. It's recommended to use a smaller image for `path` and larger (higher quality) image for the `path_popup`.
# ---
from h2o_wave import site, ui

page = site['/demo']
page['example'] = ui.image_card(
    box='1 1 3 4',
    title='Image popup',
    path='https://via.placeholder.com/600x400', 
    path_popup='https://via.placeholder.com/1200x800'
)

page.save()