import time
from copy import deepcopy
from h2o_wave import site, ui, graphics as g

# Initialize coverage tracking global variable
branch_coverage = {
    "cell_dead_becomes_alive": False,  # Branch when a dead cell becomes alive
    "cell_alive_stays_alive": False,   # Branch when an alive cell stays alive
    "cell_alive_becomes_dead": False   # Branch when an alive cell becomes dead
}

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
            branch_coverage["cell_dead_becomes_alive"] = True
            new_grid_state[cell] = 1
        elif state == 1:
            if not 1 < n_living < 4:
                branch_coverage["cell_alive_becomes_dead"] = True
                new_grid_state[cell] = 0
            else:
                branch_coverage["cell_alive_stays_alive"] = True
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

def print_coverage():
    total_branches = len(branch_coverage)
    hit_branches = sum(branch_coverage.values())
    coverage_percentage = (hit_branches / total_branches) * 100
    for branch, hit in branch_coverage.items():
        print(f"{branch} was {'hit' if hit else 'not hit'}")
    print(f"Branch coverage: {coverage_percentage:.2f}%")

# Partial and Full Test Cases for Coverage
def test_evaluate_grid_partial():
    # Partial coverage test: Only some branches are hit
    grid_state = {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 0}
    evaluate_grid(grid_state)
    print("After partial coverage test:")
    print_coverage()

def test_evaluate_grid_full():
    # Full coverage test: All branches are hit
    # Dead cell becomes alive
    grid_state = {(0, 0): 0, (0, 1): 1, (1, 0): 1, (1, 1): 1}
    evaluate_grid(grid_state)
    # Alive cell stays alive
    grid_state = {(0, 0): 1, (0, 1): 1, (1, 0): 1, (1, 1): 0}
    evaluate_grid(grid_state)
    # Alive cell becomes dead
    grid_state = {(0, 0): 1, (0, 1): 0, (1, 0): 0, (1, 1): 0}
    evaluate_grid(grid_state)
    print("After full coverage test:")
    print_coverage()

# Run the tests
print_coverage()
test_evaluate_grid_partial()
test_evaluate_grid_full()

# Render the glider gun pattern
# render(make_glider_gun(2, 2))
