import sys
import difflib
import json
from telesync import Site, Page, Data

all_tests = []
only_tests = []


def test(f):
    all_tests.append(f)
    return f


def test_only(f):
    only_tests.append(f)
    return f


def run_tests():
    site = Site('localhost', 55555, 'admin', 'admin')
    tests = only_tests if len(only_tests) else all_tests
    for t in tests:
        print(t.__name__)
        page = site['/test']
        page.drop()
        t(page)


def make_card(**props):
    d = {}
    for k, v in props.items():
        if isinstance(v, dict) and len(v) == 1 and ('__c__' in v or '__f__' in v or '__m__' in v):
            d['#' + k] = v
        else:
            d[k] = v
    return dict(d=d)


def make_map_buf(fields, data): return {'__m__': dict(f=fields, d=data)}


def make_fix_buf(fields, data): return {'__f__': dict(f=fields, d=data)}


def make_cyc_buf(fields, data, i): return {'__c__': dict(f=fields, d=data, i=i)}


def make_page(**cards) -> dict: return dict(p=dict(c=cards), c=None, d=None)


def dump_for_comparison(x: dict): return json.dumps(x, indent=2, sort_keys=True).splitlines(keepends=True)


def expect(actual: dict, expected: dict):
    a = dump_for_comparison(actual)
    b = dump_for_comparison(expected)
    if a != b:
        diff = difflib.Differ().compare(a, b)
        sys.stdout.write('\n------------------- Actual --------------------\n')
        sys.stdout.writelines(a)
        sys.stdout.write('\n------------------- Expected --------------------\n')
        sys.stdout.writelines(b)
        sys.stdout.write('\n------------------- Diff --------------------\n')
        sys.stdout.writelines(diff)
        raise ValueError('actual != expected')


sample_fields = ['a', 'b', 'c']


@test
def test_new_empty_card(page: Page):
    page.add(dict(key='card1'))
    page.save()
    expect(page.load(), make_page(card1=make_card()))


@test
def test_new_card_with_props(page: Page):
    page.add(dict(key='card1', s="foo", i=42, f=4.2, bt=True, bf=False, n=None))
    page.save()
    expect(page.load(), make_page(card1=make_card(s="foo", i=42, f=4.2, bt=True, bf=False)))


@test
def test_new_card_with_map_buf(page: Page):
    page.add(dict(key='card1', data=Data(fields=sample_fields)))
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data={}))))


@test
def test_new_card_with_fix_buf(page: Page):
    page.add(dict(key='card1', data=Data(fields=sample_fields, size=3)))
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(fields=sample_fields, data=[None] * 3))))


@test
def test_new_card_with_cyc_buf(page: Page):
    page.add(dict(key='card1', data=Data(fields=sample_fields, size=-3)))
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(fields=sample_fields, data=[None] * 3, i=0))))


@test
def test_prop_set(page: Page):
    page.add(dict(key='card1'))
    page.save()

    c = page['card1']
    c.s = "foo"
    c.i = 42
    c.f = 4.2
    c.bt = True
    c.bf = False
    page.save()
    expect(page.load(), make_page(card1=make_card(s="foo", i=42, f=4.2, bt=True, bf=False)))

    c.s = "bar"
    c.i = 420
    c.f = 40.2
    page.save()
    expect(page.load(), make_page(card1=make_card(s="bar", i=420, f=40.2, bt=True, bf=False)))


@test
def test_map_prop_set(page: Page):
    page.add(dict(key='card1', m=dict(s="foo")))
    page.save()

    c = page['card1']
    c.m.s = "bar"
    page.save()
    expect(page.load(), make_page(card1=make_card(m=dict(s="bar"))))

    c.m.s = None
    c.m.s2 = "bar"
    page.save()
    expect(page.load(), make_page(card1=make_card(m=dict(s2="bar"))))


@test
def test_map_prop_set_deep(page: Page):
    page.add(dict(key='card1', m=dict(m=dict(m=dict(s="foo")))))
    page.save()

    c = page['card1']
    c.m.m.m.s = "bar"
    page.save()
    expect(page.load(), make_page(card1=make_card(m=dict(m=dict(m=dict(s="bar"))))))

    c.m.m.m = dict(answer=42)
    page.save()
    expect(page.load(), make_page(card1=make_card(m=dict(m=dict(m=dict(answer=42))))))


@test
def test_array_prop_set(page: Page):
    page.add(dict(key='card1', a=[1, 2, 3]))
    page.save()

    c = page['card1']
    c.a[2] = 33
    page.save()
    expect(page.load(), make_page(card1=make_card(a=[1, 2, 33])))

    c.a[33] = 100  # index out of bounds
    expect(page.load(), make_page(card1=make_card(a=[1, 2, 33])))


@test
def test_array_prop_set_deep(page: Page):
    page.add(dict(key='card1', a=[[[[42]]]]))
    page.save()

    c = page['card1']
    c.a[0][0][0][0] = 420
    page.save()
    expect(page.load(), make_page(card1=make_card(a=[[[[420]]]])))

    c.a[0][0][0] = [42, 420]
    page.save()
    expect(page.load(), make_page(card1=make_card(a=[[[[42, 420]]]])))


@test
def test_map_buf_init(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields)))
    c.data = dict(foo=[1, 2, 3], bar=[4, 5, 6], baz=[7, 8, 9])
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 8, 9],
    )))))


@test
def test_map_buf_write(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields)))
    c.data.foo = [1, 2, 3]
    c.data.bar = [4, 5, 6]
    c.data.baz = [7, 8, 9]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 8, 9],
    )))))

    c.data.baz[1] = 42
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 42, 9],
    )))))

    c.data.baz[1] = [41, 42, 43]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, [41, 42, 43], 9],
    )))))

    c.data.baz[1][1] = 999
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, [41, 999, 43], 9],
    )))))


@test
def test_fix_buf_init(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields, size=3)))
    c.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    ))))


@test
def test_fix_buf_write(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields, size=3)))
    c.data[0] = [1, 2, 3]
    c.data[1] = [4, 5, 6]
    c.data[2] = [7, 8, 9]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    ))))

    c.data[2][1] = 42
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 42, 9]],
    ))))

    c.data[2][1] = [41, 42, 43]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, [41, 42, 43], 9]],
    ))))

    c.data[2][1][1] = 999
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, [41, 999, 43], 9]],
    ))))


@test
def test_cyc_buf_init(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields, size=-3)))
    c.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]  # insert 4 instead of 3; should circle back
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [4, 5, 6], [7, 8, 9]],
        i=1,
    ))))


@test
def test_cyc_buf_write(page: Page):
    c = page.add(dict(key='card1', data=Data(fields=sample_fields, size=-3)))
    c.data[0] = [1, 2, 3]
    c.data[1] = [4, 5, 6]
    c.data[2] = [7, 8, 9]
    c.data[100] = [10, 11, 12]  # keys don't matter
    c.data[101] = [13, 14, 15]  # keys don't matter
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, 8, 9]],
        i=2,
    ))))

    c.data[2][1] = 42
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, 42, 9]],
        i=2,
    ))))

    c.data[2][1] = [41, 42, 43]
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, [41, 42, 43], 9]],
        i=2,
    ))))

    c.data[2][1][1] = 999
    page.save()
    expect(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, [41, 999, 43], 9]],
        i=2,
    ))))


run_tests()
