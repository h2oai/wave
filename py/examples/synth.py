import datetime
import random


class FakeSeries:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None):
        self.min = min
        self.max = max
        self.variation = variation
        self.start = random.randint(min, max) if start is None else start
        self.x = self.start

    def next(self):
        x0 = self.x
        x = x0 + (random.random() - 0.5) * self.variation
        if not self.min <= x <= self.max:
            x = self.start
        self.x = x
        dx = 0 if x0 == 0 else 100.0 * (x - x0) / x0
        return x, dx


class FakeTimeSeries:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None, delta_days=1):
        self.series = FakeSeries(min, max, variation, start)
        self.delta_days = delta_days
        self.date = datetime.datetime.utcnow() - datetime.timedelta(days=10 * 365)

    def next(self):
        x, dx = self.series.next()
        self.date = self.date + datetime.timedelta(days=self.delta_days)
        return self.date.isoformat() + 'Z', x, dx


class FakeMultiTimeSeries:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None, delta_days=1, groups=5):
        self.series = [(f'G{c + 1}', FakeTimeSeries(min, max, variation, start, delta_days)) for c in range(groups)]

    def next(self):
        data = []
        for g, series in self.series:
            t, x, dx = series.next()
            data.append((g, t, x, dx))
        return data


class FakeCategoricalSeries:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None):
        self.series = FakeSeries(min, max, variation, start)
        self.i = 0

    def next(self):
        x, dx = self.series.next()
        self.i += 1
        return f'C{self.i}', x, dx


class FakeMultiCategoricalSeries:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None, groups=5):
        self.series = [(f'G{c + 1}', FakeCategoricalSeries(min, max, variation, start)) for c in range(groups)]

    def next(self):
        data = []
        for g, series in self.series:
            c, x, dx = series.next()
            data.append((g, c, x, dx))
        return data


class FakeScatter:
    def __init__(self, min=0.0, max=100.0, variation=10.0, start: int = None):
        self.x = FakeSeries(min, max, variation, start)
        self.y = FakeSeries(min, max, variation, start)

    def next(self):
        x, dx = self.x.next()
        y, dy = self.y.next()
        return x, y


class FakePercent:
    def __init__(self, min=5.0, max=35.0, variation=4.0):
        self.min = min
        self.max = max
        self.variation = variation
        self.x = random.randint(min, max)

    def next(self):
        self.x += random.random() * self.variation
        if self.x >= self.max:
            self.x = self.min
        return self.x, (self.x - self.min) / (self.max - self.min)
