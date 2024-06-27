import datetime
import random

# Initialize coverage tracking global variable
branch_coverage = {
    "FakeSeries_within_range": False,  # Branch when the value is within the specified range
    "FakeSeries_out_of_range": False,  # Branch when the value is out of the specified range
    "FakePercent_within_max": False,   # Branch when the value is within the max range
    "FakePercent_exceeds_max": False   # Branch when the value exceeds the max range
}

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
            branch_coverage["FakeSeries_out_of_range"] = True
            x = self.start
        else:
            branch_coverage["FakeSeries_within_range"] = True
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
            branch_coverage["FakePercent_exceeds_max"] = True
            self.x = self.min
        else:
            branch_coverage["FakePercent_within_max"] = True
        return self.x, (self.x - self.min) / (self.max - self.min)

def print_coverage(branch_prefix):
    relevant_branches = {k: v for k, v in branch_coverage.items() if k.startswith(branch_prefix)}
    total_branches = len(relevant_branches)
    hit_branches = sum(relevant_branches.values())
    coverage_percentage = (hit_branches / total_branches) * 100
    for branch, hit in relevant_branches.items():
        print(f"{branch} was {'hit' if hit else 'not hit'}")
    print(f"Branch coverage for {branch_prefix}: {coverage_percentage:.2f}%\n")

# Partial and Full Test Cases for Coverage
def test_FakeSeries_partial():
    # Partial coverage test: Only some branches are hit
    fs = FakeSeries(min=0, max=100, variation=10, start=50)
    for _ in range(1):  # Smaller number to ensure partial coverage
        fs.next()
    print("After partial coverage test for FakeSeries:")
    print_coverage("FakeSeries")

def test_FakeSeries_full():
    # Full coverage test: All branches are hit
    fs = FakeSeries(min=0, max=100, variation=200, start=50)
    for _ in range(50):  # Larger number to ensure full coverage
        fs.next()
    print("After full coverage test for FakeSeries:")
    print_coverage("FakeSeries")

def test_FakePercent_partial():
    # Partial coverage test: Only some branches are hit
    fp = FakePercent(min=5, max=35, variation=4)
    for _ in range(1):  # Smaller number to ensure partial coverage
        fp.next()
    print("After partial coverage test for FakePercent:")
    print_coverage("FakePercent")

def test_FakePercent_full():
    # Full coverage test: All branches are hit
    fp = FakePercent(min=5, max=35, variation=40)
    for _ in range(50):  # Larger number to ensure full coverage
        fp.next()
    print("After full coverage test for FakePercent:")
    print_coverage("FakePercent")

# Run the tests
test_FakeSeries_partial()
test_FakeSeries_full()
test_FakePercent_partial()
test_FakePercent_full()
