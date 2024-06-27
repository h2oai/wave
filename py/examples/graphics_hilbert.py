from h2o_wave import ui, main, app, Q, graphics as g

# Initialize coverage tracking global variable
branch_coverage = {
    "base_case": False,          # Branch for the base case (depth == 0)
    "recursive_case_1": False,   # First recursive call
    "recursive_case_2": False,   # Second recursive call
    "recursive_case_3": False,   # Third recursive call
    "recursive_case_4": False    # Fourth recursive call
}

def hilbert(t: g.Turtle, width: float, depth: int, reverse=False):  # recursive
    angle = -90 if reverse else 90

    if depth == 0:
        branch_coverage["base_case"] = True
        t.f(width).r(angle).f(width).r(angle).f(width)
        return

    side = width * ((2 ** depth) - 1) / float((2 ** (depth + 1)) - 1)
    edge = width - 2 * side

    t.r(angle)
    hilbert(t, side, depth - 1, not reverse)
    branch_coverage["recursive_case_1"] = True
    t.r(angle).f(edge)
    hilbert(t, side, depth - 1, reverse)
    branch_coverage["recursive_case_2"] = True
    t.l(angle).f(edge).l(angle)
    hilbert(t, side, depth - 1, reverse)
    branch_coverage["recursive_case_3"] = True
    t.f(edge).r(angle)
    hilbert(t, side, depth - 1, not reverse)
    branch_coverage["recursive_case_4"] = True
    t.r(angle)

def make_hilbert_curve(width: float, depth: int):
    t = g.turtle().f(0).pd()
    hilbert(t, width, depth)
    return t.d()

@app('/demo')
async def serve(q: Q):
    hilbert_curve = make_hilbert_curve(300, q.args.depth or 5)

    if not q.client.initialized:
        q.page['curve'] = ui.graphics_card(
            box='1 1 4 6', view_box='0 0 300 300', width='100%', height='100%',
            scene=g.scene(
                hilbert_curve=g.path(d=hilbert_curve, fill='none', stroke='#333')
            ),
        )
        q.page['form'] = ui.form_card(
            box='1 7 4 1', items=[
                ui.slider(name='depth', label='Play with this Hilbert curve!', min=1, max=6, value=5, trigger=True),
            ],
        )
        q.client.initialized = True
    else:
        g.draw(q.page['curve'].scene.hilbert_curve, d=hilbert_curve)

    await q.page.save()

def print_coverage():
    total_branches = len(branch_coverage)
    hit_branches = sum(branch_coverage.values())
    coverage_percentage = (hit_branches / total_branches) * 100
    for branch, hit in branch_coverage.items():
        print(f"{branch} was {'hit' if hit else 'not hit'}")
    print(f"Branch coverage: {coverage_percentage:.2f}%")

# Partial and Full Test Cases for Coverage
def test_hilbert_partial():
    # Partial coverage test: Only some branches are hit
    t = g.turtle().f(0).pd()
    hilbert(t, 100, 0)  # Base case
    hilbert(t, 100, 1)  # Simple recursive case
    print("After partial coverage test:")
    print_coverage()

def test_hilbert_full():
    # Full coverage test: All branches are hit
    t = g.turtle().f(0).pd()
    hilbert(t, 100, 2)  # Ensure all recursive branches are hit
    print("After full coverage test:")
    print_coverage()

# Run the tests
print_coverage()
test_hilbert_partial()
test_hilbert_full()
