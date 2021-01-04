import datetime
import random

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
        i = 0 if i == k else i + 1


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
            x = random.randint(min, max)
        yield x


sample_title = generate_title()
sample_term = generate_term()
sample_caption = generate_caption()
sample_amount = generate_amount()
sample_dollars = generate_dollars()
sample_percent = generate_percent()
sample_icon = generate_sequence(['ExerciseTracker', 'Glasses', 'Cafe', 'Bullseye', 'Guitar', 'Game', 'Headset'])
sample_color = generate_sequence(['$blue', '$red'])
