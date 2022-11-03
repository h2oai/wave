import random
from unicodedata import name
from h2o_wave import app, main, Q, ui

path = "https://images.unsplash.com/photo-1664136535720-ce2cd0087987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"


@app("/demo")
async def serve(q: Q) -> None:
    q.page["grid"] = ui.image_grid_card(box="1 1 6 8", height="100px", images=[
        ui.image(title='Image 1', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=1'),
        ui.image(title='Image 2', path=f'https://via.placeholder.com/640x320/0000FF/808080?text=2'),
        ui.image(title='Image 3', path=f'https://via.placeholder.com/3150x600/FF0000/FFFFFF?text=3'),
        ui.image(title='Image 4', path=f'https://via.placeholder.com/150/FFFF00/000000?text=4'),
        ui.image(title='Image 5', path=f'https://via.placeholder.com/30/000000/FFFFFF/?text=5'),
        ui.image(title='Image 6', path=f'https://via.placeholder.com/800x600/FF0000/FFFFFF?text=6'),
        ui.image(title='Image 7', path=f'https://via.placeholder.com/300x450/FFFF00/000000?text=7'),
        ui.image(title='Image 8', path=f'https://via.placeholder.com/2200x1800/000000/FFFFFF/?text=8'),
        ui.image(title='Image 9', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=9'),
        ui.image(title='Image 10', path=f'https://via.placeholder.com/1150x865/0000FF/808080?text=10'),
        ui.image(title='Image 11', path=f'https://via.placeholder.com/3150x1200/FF0000/FFFFFF?text=11'),
        ui.image(title='Image 12', path=f'https://via.placeholder.com/150/FFFF00/000000?text=12'),
        ui.image(title='Image 13', path=f'https://via.placeholder.com/30/000000/FFFFFF/?text=13'),
        ui.image(title='Image 14', path=f'https://via.placeholder.com/3000x2000/0000FF/808080?text=14'),
        ui.image(title='Image 15', path=f'https://via.placeholder.com/802x600/FF0000/FFFFFF?text=15'),
        ui.image(title='Image 16', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=16'),
        ui.image(title='Image 17', path=f'https://via.placeholder.com/2300x1800/000000/FFFFFF/?text=17'),
        ui.image(title='Image 18', path=f'https://via.placeholder.com/3350x1200/FF0000/FFFFFF?text=18'),
        ui.image(title='Image 19', path=f'https://via.placeholder.com/130/FFFF00/000000?text=19'),
        ui.image(title='Image 20', path=f'https://via.placeholder.com/33/000000/FFFFFF/?text=20'),
        ui.image(title='Image 21', path=f'https://via.placeholder.com/3300x2000/0000FF/808080?text=21'),
        ui.image(title='Image 22', path=f'https://via.placeholder.com/830x600/FF0000/FFFFFF?text=22'),
        ui.image(title='Image 23', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=23'),
        ui.image(title='Image 24', path=f'https://via.placeholder.com/2230x1800/000000/FFFFFF/?text=24'),
        ui.image(title='Image 25', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=25'),
        ui.image(title='Image 26', path=f'https://via.placeholder.com/1150x865/0000FF/808080?text=26'),
        ui.image(title='Image 27', path=f'https://via.placeholder.com/3150x1200/FF0000/FFFFFF?text=27'),
        ui.image(title='Image 28', path=f'https://via.placeholder.com/150/FFFF00/000000?text=28'),
        ui.image(title='Image 29', path=f'https://via.placeholder.com/30/000000/FFFFFF/?text=29'),
        ui.image(title='Image 30', path=f'https://via.placeholder.com/3000x2000/0000FF/808080?text=30'),
        ui.image(title='Image 31', path=f'https://via.placeholder.com/800x600/FF0000/FFFFFF?text=31'),
        ui.image(title='Image 32', path=f'https://via.placeholder.com/800x350/FF0000/FFFFFF?text=32'),
        ui.image(title='Image 33', path=f'https://via.placeholder.com/2200x1800/000000/FFFFFF/?text=33'),
        ui.image(title='Image 34', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=34'),
        ui.image(title='Image 35', path=f'https://via.placeholder.com/1150x865/0000FF/808080?text=35'),
        ui.image(title='Image 36', path=f'https://via.placeholder.com/3150x1200/FF0000/FFFFFF?text=36'),
        ui.image(title='Image 37', path=f'https://via.placeholder.com/150/FFFF00/000000?text=37'),
        ui.image(title='Image 38', path=f'https://via.placeholder.com/30/000000/FFFFFF/?text=38'),
        ui.image(title='Image 39', path=f'https://via.placeholder.com/3000x2000/0000FF/808080?text=39'),
        ui.image(title='Image 40', path=f'https://via.placeholder.com/802x600/FF0000/FFFFFF?text=40'),
        ui.image(title='Image 41', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=41'),
        ui.image(title='Image 42', path=f'https://via.placeholder.com/2300x1800/000000/FFFFFF/?text=42'),
        ui.image(title='Image 43', path=f'https://via.placeholder.com/3350x1200/FF0000/FFFFFF?text=43'),
        ui.image(title='Image 44', path=f'https://via.placeholder.com/130/FFFF00/000000?text=44'),
        ui.image(title='Image 45', path=f'https://via.placeholder.com/33/000000/FFFFFF/?text=45'),
        ui.image(title='Image 46', path=f'https://via.placeholder.com/3300x2000/0000FF/808080?text=46'),
        ui.image(title='Image 47', path=f'https://via.placeholder.com/830x600/FF0000/FFFFFF?text=47'),
        ui.image(title='Image 48', path=f'https://via.placeholder.com/800x550/FF0000/FFFFFF?text=48'),
        ui.image(title='Image 49', path=f'https://via.placeholder.com/2230x1800/000000/FFFFFF/?text=49'),
        # ui.image(title='Image 48', path=f'https://via.placeholder.com/30x450/FFFF00/000000?text=WebsiteBuilders.com'),
    ])

    await q.page.save()