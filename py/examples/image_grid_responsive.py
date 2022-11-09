import random
from unicodedata import name
from h2o_wave import app, main, Q, ui

path = "https://images.unsplash.com/photo-1664136535720-ce2cd0087987?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80"

def get_random_hex():
    return '%02x%02x%02x' % (random.randrange(0, 255), random.randrange(0, 255), random.randrange(0, 255))

@app("/demo")
async def serve(q: Q) -> None:
    q.page['meta'] = ui.meta_card(box='', layouts=[
        ui.layout(
            breakpoint='xs',
            zones=[
                ui.zone('content', size='calc(100vh - 80px)', direction=ui.ZoneDirection.ROW,)
            ]
        )
    ])
    q.page["grid"] = ui.image_grid_card(box='content', height='500px', images=[
        ui.image(title='Image 1', path=f'https://via.placeholder.com/300x200/{get_random_hex()}/FFFFFF?text=1'),
        ui.image(title='Image 2', path=f'https://via.placeholder.com/320x320/{get_random_hex()}/FFFFFF?text=2'),
        ui.image(title='Image 3', path=f'https://via.placeholder.com/150x100/{get_random_hex()}/FFFFFF?text=3'),
        ui.image(title='Image 4', path=f'https://via.placeholder.com/150/{get_random_hex()}/000000?text=4'),
        ui.image(title='Image 5', path=f'https://via.placeholder.com/300/{get_random_hex()}/FFFFFF/?text=5'),
        ui.image(title='Image 6', path=f'https://via.placeholder.com/600x400/{get_random_hex()}/FFFFFF?text=6'),
        ui.image(title='Image 7', path=f'https://via.placeholder.com/400x600/{get_random_hex()}/000000?text=7'),
        ui.image(title='Image 8', path=f'https://via.placeholder.com/220x180/{get_random_hex()}/FFFFFF/?text=8'),
        ui.image(title='Image 9', path=f'https://via.placeholder.com/600x450/{get_random_hex()}/FFFFFF?text=9'),
        ui.image(title='Image 10', path=f'https://via.placeholder.com/400x300/{get_random_hex()}/FFFFFF?text=10'),
        ui.image(title='Image 11', path=f'https://via.placeholder.com/315x120/{get_random_hex()}/FFFFFF?text=11'),
        ui.image(title='Image 12', path=f'https://via.placeholder.com/150/{get_random_hex()}/000000?text=12'),
        ui.image(title='Image 13', path=f'https://via.placeholder.com/30/{get_random_hex()}/FFFFFF/?text=13'),
        ui.image(title='Image 14', path=f'https://via.placeholder.com/600x400/{get_random_hex()}/FFFFFF?text=14'),
        ui.image(title='Image 15', path=f'https://via.placeholder.com/802x600/{get_random_hex()}/FFFFFF?text=15'),
        ui.image(title='Image 16', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=16'),
        ui.image(title='Image 17', path=f'https://via.placeholder.com/230x180/{get_random_hex()}/FFFFFF/?text=17'),
        ui.image(title='Image 18', path=f'https://via.placeholder.com/335x120/{get_random_hex()}/FFFFFF?text=18'),
        ui.image(title='Image 19', path=f'https://via.placeholder.com/130/{get_random_hex()}/000000?text=19'),
        ui.image(title='Image 20', path=f'https://via.placeholder.com/33/{get_random_hex()}/FFFFFF/?text=20'),
        ui.image(title='Image 21', path=f'https://via.placeholder.com/330x200/{get_random_hex()}/FFFFFF?text=21'),
        ui.image(title='Image 22', path=f'https://via.placeholder.com/830x600/{get_random_hex()}/FFFFFF?text=22'),
        ui.image(title='Image 23', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=23'),
        ui.image(title='Image 24', path=f'https://via.placeholder.com/230x180/{get_random_hex()}/FFFFFF/?text=24'),
        ui.image(title='Image 25', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=25'),
        ui.image(title='Image 26', path=f'https://via.placeholder.com/720x460/{get_random_hex()}/FFFFFF?text=26'),
        ui.image(title='Image 27', path=f'https://via.placeholder.com/315x120/{get_random_hex()}/FFFFFF?text=27'),
        ui.image(title='Image 28', path=f'https://via.placeholder.com/150/{get_random_hex()}/000000?text=28'),
        ui.image(title='Image 29', path=f'https://via.placeholder.com/30/{get_random_hex()}/FFFFFF/?text=29'),
        ui.image(title='Image 30', path=f'https://via.placeholder.com/300x200/{get_random_hex()}/FFFFFF?text=30'),
        ui.image(title='Image 31', path=f'https://via.placeholder.com/800x600/{get_random_hex()}/FFFFFF?text=31'),
        ui.image(title='Image 32', path=f'https://via.placeholder.com/800x350/{get_random_hex()}/FFFFFF?text=32'),
        ui.image(title='Image 33', path=f'https://via.placeholder.com/220x180/{get_random_hex()}/FFFFFF/?text=33'),
        ui.image(title='Image 34', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=34'),
        ui.image(title='Image 35', path=f'https://via.placeholder.com/860x/540FF/FFFFFF?text=35'),
        ui.image(title='Image 36', path=f'https://via.placeholder.com/315x120/{get_random_hex()}/FFFFFF?text=36'),
        ui.image(title='Image 37', path=f'https://via.placeholder.com/150/{get_random_hex()}/000000?text=37'),
        ui.image(title='Image 38', path=f'https://via.placeholder.com/30/{get_random_hex()}/FFFFFF/?text=38'),
        ui.image(title='Image 39', path=f'https://via.placeholder.com/300x200/{get_random_hex()}/FFFFFF?text=39'),
        ui.image(title='Image 40', path=f'https://via.placeholder.com/802x600/{get_random_hex()}/FFFFFF?text=40'),
        ui.image(title='Image 41', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=41'),
        ui.image(title='Image 42', path=f'https://via.placeholder.com/230x180/{get_random_hex()}/FFFFFF/?text=42'),
        ui.image(title='Image 43', path=f'https://via.placeholder.com/335x120/{get_random_hex()}/FFFFFF?text=43'),
        ui.image(title='Image 44', path=f'https://via.placeholder.com/130/{get_random_hex()}/000000?text=44'),
        ui.image(title='Image 45', path=f'https://via.placeholder.com/33/{get_random_hex()}/FFFFFF/?text=45'),
        ui.image(title='Image 46', path=f'https://via.placeholder.com/330x200/{get_random_hex()}/FFFFFF?text=46'),
        ui.image(title='Image 47', path=f'https://via.placeholder.com/830x600/{get_random_hex()}/FFFFFF?text=47'),
        ui.image(title='Image 48', path=f'https://via.placeholder.com/800x550/{get_random_hex()}/FFFFFF?text=48'),
        ui.image(title='Image 49', path=f'https://via.placeholder.com/223x180/{get_random_hex()}/FFFFFF/?text=49'),
        # ui.image(title='Image 48', path=f'https://via.placeholder.com/{get_random_hex()}/FFFF00/000000?text=WebsiteBuilders.com'),
    ])

    await q.page.save()