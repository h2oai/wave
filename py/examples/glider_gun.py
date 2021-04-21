# Graphics / Glider Gun
# Use the #graphics API to play Conway's Game of Life - Gosper's Glider Gun
# https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
# ---
import time
from copy import deepcopy
from h2o_wave import site, ui, graphics as g


def get_neighbors(row, col):
    neighbors = [
        (r, c) for r in range(row - 1, row + 2) for c in range(col - 1, col + 2)
    ]
    neighbors.remove((row, col))
    return neighbors


def get_num_living(grid_state, neighbors):
    return sum([grid_state.get(x, 0) for x in neighbors])


def evaluate_grid(grid_state):
    new_grid_state = deepcopy(grid_state)
    for cell, state in grid_state.items():
        neighbors = get_neighbors(*cell)
        n_living = get_num_living(grid_state, neighbors)
        if state == 0 and n_living == 3:
            new_grid_state[cell] = 1
        elif state == 1:
            if not 1 < n_living < 4:
                new_grid_state[cell] = 0
    return new_grid_state


def get_empty_state(n_rows, n_cols):
    return {(r, c): 0 for r in range(n_rows) for c in range(n_cols)}


def apply_start_state(grid_state, pattern):
    for x in pattern:
        grid_state[x] = 1
    return grid_state


def update_grid(page, grid_state, n_rows, n_cols, background):
    scene = page['game'].scene
    for row in range(n_rows):
        for col in range(n_cols):
            if grid_state[(row, col)] == 1:
                g.draw(scene[f'cell_{row}_{col}'], fill='black')
            else:
                g.draw(scene[f'cell_{row}_{col}'], fill=background)
    page.save()


def create_grid(n_rows, n_cols, fill, width, height, stroke, stroke_width):
    grid = {}
    for row in range(n_rows):
        for col in range(n_cols):
            grid[f'cell_{row}_{col}'] = g.rect(
                x=col * width,
                y=row * height,
                width=width,
                height=height,
                fill=fill,
                stroke=stroke,
                stroke_width=stroke_width,
            )
    return grid


def render(pattern):
    page = site['/demo']

    page_cols = 4
    page_rows = 5

    box_width = 134
    box_height = 76
    gap = 15

    max_width = box_width * page_cols + (page_cols - 1) * gap
    max_height = box_height * page_rows + (page_rows - 1) * gap

    width = 10
    height = 10

    grid_cols = max_width // width
    grid_rows = max_height // height

    background = 'whitesmoke'
    stroke = 'gainsboro'
    stroke_width = 1

    grid = create_grid(
        grid_rows, grid_cols, background, width, height, stroke, stroke_width
    )
    page['game'] = ui.graphics_card(
        box=f'1 1 {page_cols} {page_rows}',
        view_box=f'0 0 {max_width} {max_height}',
        width='100%',
        height='100%',
        scene=g.scene(**grid),
    )

    grid_state = get_empty_state(grid_rows, grid_cols)
    update_grid(page, grid_state, grid_rows, grid_cols, background)

    grid_state = apply_start_state(grid_state, pattern)

    update_grid(page, grid_state, grid_rows, grid_cols, background)

    while True:
        time.sleep(0.1)
        new_grid_state = evaluate_grid(grid_state)
        update_grid(page, new_grid_state, grid_rows, grid_cols, background)
        grid_state = new_grid_state


def make_glider_gun(r, c):
    return [
        (r, c + 24),
        (r + 1, c + 22),
        (r + 1, c + 24),
        (r + 2, c + 12),
        (r + 2, c + 13),
        (r + 2, c + 20),
        (r + 2, c + 21),
        (r + 2, c + 34),
        (r + 2, c + 35),
        (r + 3, c + 11),
        (r + 3, c + 15),
        (r + 3, c + 20),
        (r + 3, c + 21),
        (r + 3, c + 34),
        (r + 3, c + 35),
        (r + 4, c + 0),
        (r + 4, c + 1),
        (r + 4, c + 10),
        (r + 4, c + 16),
        (r + 4, c + 20),
        (r + 4, c + 21),
        (r + 5, c + 0),
        (r + 5, c + 1),
        (r + 5, c + 10),
        (r + 5, c + 14),
        (r + 5, c + 16),
        (r + 5, c + 17),
        (r + 5, c + 22),
        (r + 5, c + 24),
        (r + 6, c + 10),
        (r + 6, c + 16),
        (r + 6, c + 24),
        (r + 7, c + 11),
        (r + 7, c + 15),
        (r + 8, c + 12),
        (r + 8, c + 13),
    ]


render(make_glider_gun(2, 2))
