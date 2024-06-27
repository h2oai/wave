import datetime
import random

branch_coverage = {
    "example_function_1": False,  # if branch
    "example_function_2": False,  # else branch
    "generate_sequence_branch_reset": False,  # if branch for resetting i
    "generate_sequence_branch_increment": False  # else branch for incrementing i
}

lorem_ipsum = (
    'ab', 'accusamus', 'accusantium', 'ad', 'adipisci', 'alias', 'aliquam', 'aliquid', 'amet', 'animi', 'aperiam',
    'architecto', 'asperiores', 'aspernatur', 'assumenda', 'at', 'atque', 'aut', 'autem', 'beatae', 'blanditiis',
    'commodi', 'consectetur', 'consequatur', 'consequuntur', 'corporis', 'corrupti', 'culpa', 'cumque', 'cupiditate',
    'debitis', 'delectus', 'deleniti', 'deserunt', 'dicta', 'dignissimos', 'distinctio', 'dolor', 'dolore', 'dolorem',
    'doloremque', 'dolores', 'doloribus', 'dolorum', 'ducimus', 'ea', 'eaque', 'earum', 'eius', 'eligendi', 'enim',
    'eos', 'error', 'esse', 'est', 'et', 'eum', 'eveniet', 'ex', 'excepturi', 'exercitationem', 'expedita', 'explicabo',
    'facere', 'facilis', 'fuga', 'fugiat', 'fugit', 'harum', 'hic', 'id', 'illo', 'illum', 'impedit', 'in', 'incidunt',
    'inventore', 'ipsa', 'ipsam', 'ipsum', 'iste', 'itaque', 'iure', 'iusto', 'labore', 'laboriosam', 'laborum',
    'laudantium', 'libero', 'magnam', 'magni', 'maiores', 'maxime', 'minima', 'minus', 'modi', 'molestiae', 'molestias',
    'mollitia', 'nam', 'natus', 'necessitatibus', 'nemo', 'neque', 'nesciunt', 'nihil', 'nisi', 'nobis', 'non',
    'nostrum', 'nulla', 'numquam', 'occaecati', 'odio', 'odit', 'officia', 'officiis', 'omnis', 'optio', 'pariatur',
    'perferendis', 'perspiciatis', 'placeat', 'porro', 'possimus', 'praesentium', 'provident', 'quae', 'quaerat',
    'quam', 'quas', 'quasi', 'qui', 'quia', 'quibusdam', 'quidem', 'quis', 'quisquam', 'quo', 'quod', 'quos', 'ratione',
    'recusandae', 'reiciendis', 'rem', 'repellat', 'repellendus', 'reprehenderit', 'repudiandae', 'rerum', 'saepe',
    'sapiente', 'sed', 'sequi', 'similique', 'sint', 'sit', 'soluta', 'sunt', 'suscipit', 'tempora', 'tempore',
    'temporibus', 'tenetur', 'totam', 'ullam', 'unde', 'ut', 'vel', 'velit', 'veniam', 'veritatis', 'vero', 'vitae',
    'voluptas', 'voluptate', 'voluptatem', 'voluptates', 'voluptatibus', 'voluptatum',
)

lorem_terms = [w for w in lorem_ipsum if len(w) > 7]


def generate_title(word_count=3):
    while True:
        sentence = ' '.join(random.choices(lorem_ipsum, k=word_count))
        yield sentence.title()


def generate_term():
    while True:
        yield random.choice(lorem_terms).capitalize()


def generate_caption(word_count=8):
    while True:
        sentence = ' '.join(random.choices(lorem_ipsum, k=word_count))
        yield f'{sentence.capitalize()}.'


def generate_amount(min=1000, max=10000):
    while True:
        yield f'{random.randint(min, max):,}'


def generate_dollars(min=1000, max=9000):
    d = max - min
    while True:
        yield f'${min + d * random.random():,.2f}'


def generate_percent(min=-10, max=10):
    d = max - min
    while True:
        yield f'{min + d * random.random():.2f}%'


def generate_random_choice(choices):
    while True:
        yield random.choice(choices)


def generate_sequence(choices):
    k = len(choices) - 1
    i = 0
    while True:
        yield choices[i]
        if i == k:
            branch_coverage["generate_sequence_branch_reset"] = True
            i = 0
        else:
            branch_coverage["generate_sequence_branch_increment"] = True
            i += 1


def generate_time_series(days: int):
    d = datetime.datetime.utcnow() - datetime.timedelta(days=days - 1)
    day = datetime.timedelta(days=1)
    while True:
        d += day
        yield f'{d.isoformat()}Z'


def generate_random_walk(min=0, max=100, variation=0.1):
    dx = (max - min) * variation
    x = random.randint(min, max)
    while True:
        x += int((random.random() - 0.5) * dx)
        if not min <= x <= max:
            branch_coverage["example_function_1"] = True
            x = random.randint(min, max)
        else:
            branch_coverage["example_function_2"] = True
        yield x

def print_coverage():
    total_branches = len(branch_coverage)
    hit_branches = sum(branch_coverage.values())
    coverage_percentage = (hit_branches / total_branches) * 100
    for branch, hit in branch_coverage.items():
        print(f"{branch} was {'hit' if hit else 'not hit'}")
    print(f"Branch coverage: {coverage_percentage:.2f}%")


print_coverage()

def test_generate_random_walk_partial():
    sample_random_walk = generate_random_walk(min=0, max=100)
    for _ in range(1):  # Smaller number to ensure partial coverage
        next(sample_random_walk)
    print("After partial coverage test:")
    print_coverage()

def test_generate_random_walk_full():
    sample_random_walk = generate_random_walk(min=0, max=100)
    for _ in range(50):  # Larger number to ensure full coverage
        value = next(sample_random_walk)
        # Force both branches to execute by adjusting min and max
        if value < 50:
            sample_random_walk = generate_random_walk(min=0, max=49)
        else:
            sample_random_walk = generate_random_walk(min=51, max=100)
    print("After full coverage test:")
    print_coverage()

def test_generate_sequence_partial():
    sample_sequence = generate_sequence(['ExerciseTracker', 'Glasses', 'Cafe', 'Bullseye', 'Guitar', 'Game', 'Headset'])
    for _ in range(3):  # Smaller number to ensure partial coverage
        next(sample_sequence)
    print("After partial coverage test for generate_sequence:")
    print_coverage()

def test_generate_sequence_full():
    sample_sequence = generate_sequence(['ExerciseTracker', 'Glasses', 'Cafe', 'Bullseye', 'Guitar', 'Game', 'Headset'])
    for _ in range(10):  # Larger number to ensure full coverage
        next(sample_sequence)
    print("After full coverage test for generate_sequence:")
    print_coverage()

test_generate_random_walk_partial()
test_generate_random_walk_full()
test_generate_sequence_partial()
test_generate_sequence_full()

sample_title = generate_title()
sample_term = generate_term()
sample_caption = generate_caption()
sample_amount = generate_amount()
sample_dollars = generate_dollars()
sample_percent = generate_percent()
sample_icon = generate_sequence(['ExerciseTracker', 'Glasses', 'Cafe', 'Bullseye', 'Guitar', 'Game', 'Headset'])
sample_color = generate_sequence(['$blue', '$red'])
