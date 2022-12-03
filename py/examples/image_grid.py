# Image Grid
# Use an image grid card to display a grid of images with automatic resizing
# ---
from h2o_wave import site, ui


img1 = ui.image(title='img1', path='https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3BkMTktMy0yNTYxNGEuanBn.jpg?s=G1Eiw7aluCeb62BkbCdMv0f5HaqqSYYM43a-2f0qgSQ', width="250")
img2 = ui.image(title='img2', path='https://upload.wikimedia.org/wikipedia/commons/a/a2/1121098-pink-nature-wallpaper-1920x1080-lockscreen.jpg', width="250")
img3 = ui.image(title='img3', path='https://upload.wikimedia.org/wikipedia/commons/a/a9/Hubble_Stows_a_Pocketful_of_Stars_-_Flickr_-_NASA_Goddard_Photo_and_Video.jpg', width="550")

page = site['/demo']

page['im1'] = ui.form_card(box='1 1 2 2', items=[img1,])
page['im2'] = ui.form_card(box='3 1 2 2', items=[img2])
page['im3'] = ui.form_card(box='1 3 4 4', items=[img3])

page['grid'] = ui.image_grid(box='1 3 4 4', cols=2, images=[img1, img2, img3, img1, img2, img3])


page.save()
