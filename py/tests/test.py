# Copyright 2020 H2O.ai, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
import os
import sys
import difflib
import json

import httpx

from h2o_wave import site, Page, data, Expando


def make_card(**props):
    d = {}
    b = []
    for k, v in props.items():
        # HACK
        if isinstance(v, dict) and len(v) == 1 and ('__c__' in v or '__f__' in v or '__m__' in v):
            d['~' + k] = len(b)
            buf = dict()
            for k2, v2 in v.items():
                buf[k2[2]] = v2
                break
            b.append(buf)
        else:
            d[k] = v
    return dict(d=d, b=b) if len(b) else dict(d=d)


def make_map_buf(fields, data): return {'__m__': dict(f=fields, d=data)}


def make_fix_buf(fields, data): return {'__f__': dict(f=fields, d=data, n=len(data))}


def make_cyc_buf(fields, data, i): return {'__c__': dict(f=fields, d=data, i=i, n=len(data))}


def make_page(**cards) -> dict: return dict(p=dict(c=cards))


def dump_for_comparison(x: dict): return json.dumps(x, indent=2, sort_keys=True).splitlines(keepends=True)


def compare(actual: dict, expected: dict) -> bool:
    a = dump_for_comparison(actual)
    b = dump_for_comparison(expected)
    if a == b:
        return True

    diff = difflib.Differ().compare(a, b)
    sys.stdout.write('\n------------------- Actual --------------------\n')
    sys.stdout.writelines(a)
    sys.stdout.write('\n------------------- Expected --------------------\n')
    sys.stdout.writelines(b)
    sys.stdout.write('\n------------------- Diff --------------------\n')
    sys.stdout.writelines(diff)
    return False


sample_fields = ['a', 'b', 'c']


def test_new_empty_card():
    page = site['/test']
    page.drop()
    page['card1'] = dict()
    page.save()
    assert compare(page.load(), make_page(card1=make_card()))


def test_new_card_with_props():
    page = site['/test']
    page.drop()
    page['card1'] = dict(s="foo", i=42, f=4.2, bt=True, bf=False, n=None)
    page.save()
    assert compare(page.load(), make_page(card1=make_card(s="foo", i=42, f=4.2, bt=True, bf=False)))


def test_new_card_with_map_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields))
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data={}))))


def test_new_card_with_fix_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields, size=3))
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(fields=sample_fields, data=[None] * 3))))


def test_new_card_with_cyc_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields, size=-3))
    page.save()
    assert compare(page.load(),
                   make_page(card1=make_card(data=make_cyc_buf(fields=sample_fields, data=[None] * 3, i=0))))


def test_load_card_with_map_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields, rows=dict(foo=[1, 2, 3])))
    page.save()
    assert compare(page.load(),
                   make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(foo=[1, 2, 3])))))


def test_load_card_with_fix_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields, rows=[[1, 2, 3]]))
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(fields=sample_fields, data=[[1, 2, 3]]))))


def test_load_card_with_cyc_buf():
    page = site['/test']
    page.drop()
    page['card1'] = dict(data=data(fields=sample_fields, rows=[[1, 2, 3]], size=-10))
    page.save()
    assert compare(page.load(),
                   make_page(card1=make_card(data=make_cyc_buf(fields=sample_fields, data=[[1, 2, 3]], i=0))))


def test_prop_set():
    page = site['/test']
    page.drop()
    page['card1'] = dict()
    page.save()

    c = page['card1']
    c.s = "foo"
    c.i = 42
    c.f = 4.2
    c.bt = True
    c.bf = False
    page.save()
    assert compare(page.load(), make_page(card1=make_card(s="foo", i=42, f=4.2, bt=True, bf=False)))

    c.s = "bar"
    c.i = 420
    c.f = 40.2
    page.save()
    assert compare(page.load(), make_page(card1=make_card(s="bar", i=420, f=40.2, bt=True, bf=False)))


def test_map_prop_set():
    page = site['/test']
    page.drop()
    page['card1'] = dict(m=dict(s="foo"))
    page.save()

    c = page['card1']
    c.m.s = "bar"
    page.save()
    assert compare(page.load(), make_page(card1=make_card(m=dict(s="bar"))))

    c.m.s = None
    c.m.s2 = "bar"
    page.save()
    assert compare(page.load(), make_page(card1=make_card(m=dict(s2="bar"))))


def test_map_prop_set_deep():
    page = site['/test']
    page.drop()
    page['card1'] = dict(m=dict(m=dict(m=dict(s="foo"))))
    page.save()

    c = page['card1']
    c.m.m.m.s = "bar"
    page.save()
    assert compare(page.load(), make_page(card1=make_card(m=dict(m=dict(m=dict(s="bar"))))))

    c.m.m.m = dict(answer=42)
    page.save()
    assert compare(page.load(), make_page(card1=make_card(m=dict(m=dict(m=dict(answer=42))))))


def test_array_prop_set():
    page = site['/test']
    page.drop()
    page['card1'] = dict(a=[1, 2, 3])
    page.save()

    c = page['card1']
    c.a[2] = 33
    page.save()
    assert compare(page.load(), make_page(card1=make_card(a=[1, 2, 33])))

    c.a[33] = 100  # index out of bounds
    assert compare(page.load(), make_page(card1=make_card(a=[1, 2, 33])))


def test_array_prop_set_deep():
    page = site['/test']
    page.drop()
    page['card1'] = dict(a=[[[[42]]]])
    page.save()

    c = page['card1']
    c.a[0][0][0][0] = 420
    page.save()
    assert compare(page.load(), make_page(card1=make_card(a=[[[[420]]]])))

    c.a[0][0][0] = [42, 420]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(a=[[[[42, 420]]]])))


def test_map_buf_init():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields)))
    c.data = dict(foo=[1, 2, 3], bar=[4, 5, 6], baz=[7, 8, 9])
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 8, 9],
    )))))


def test_map_buf_write():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields)))
    c.data.foo = [1, 2, 3]
    c.data.bar = [4, 5, 6]
    c.data.baz = [7, 8, 9]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 8, 9],
    )))))

    c.data.baz[1] = 42
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, 42, 9],
    )))))

    c.data.baz[1] = [41, 42, 43]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, [41, 42, 43], 9],
    )))))

    c.data.baz[1][1] = 999
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(
        foo=[1, 2, 3],
        bar=[4, 5, 6],
        baz=[7, [41, 999, 43], 9],
    )))))


def test_fix_buf_init():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields, size=3)))
    c.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    ))))


def test_fix_buf_write():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields, size=3)))
    c.data[0] = [1, 2, 3]
    c.data[1] = [4, 5, 6]
    c.data[2] = [7, 8, 9]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
    ))))

    c.data[2][1] = 42
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, 42, 9]],
    ))))

    c.data[2][1] = [41, 42, 43]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, [41, 42, 43], 9]],
    ))))

    c.data[2][1][1] = 999
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
        fields=sample_fields,
        data=[[1, 2, 3], [4, 5, 6], [7, [41, 999, 43], 9]],
    ))))


def test_cyc_buf_init():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields, size=-3)))
    c.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]]  # insert 4 instead of 3; should circle back
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [4, 5, 6], [7, 8, 9]],
        i=1,
    ))))


def test_cyc_buf_write():
    page = site['/test']
    page.drop()
    c = page.add('card1', dict(data=data(fields=sample_fields, size=-3)))
    c.data[0] = [1, 2, 3]
    c.data[1] = [4, 5, 6]
    c.data[2] = [7, 8, 9]
    c.data[100] = [10, 11, 12]  # keys don't matter
    c.data[101] = [13, 14, 15]  # keys don't matter
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, 8, 9]],
        i=2,
    ))))

    c.data[2][1] = 42
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, 42, 9]],
        i=2,
    ))))

    c.data[2][1] = [41, 42, 43]
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, [41, 42, 43], 9]],
        i=2,
    ))))

    c.data[2][1][1] = 999
    page.save()
    assert compare(page.load(), make_page(card1=make_card(data=make_cyc_buf(
        fields=sample_fields,
        data=[[10, 11, 12], [13, 14, 15], [7, [41, 999, 43], 9]],
        i=2,
    ))))


def test_proxy():
    # waved -proxy must be set
    url = 'https://wave.h2o.ai'
    response = Expando(site.proxy('get', url))
    if response.error:
        assert False
    else:
        result = Expando(response.result)
        assert result.code == 400
        assert len(result.headers) > 0


def _read_file(path: str):
    with open(path, 'r') as f:
        return f.read()


def test_file_server():
    f1 = 'temp_file1.txt'
    with open(f1, 'w') as f:
        f.writelines([f'line {i + 1}' for i in range(10)])
    paths = site.upload([f1])
    f2 = 'temp_file2.txt'
    f2 = site.download(paths[0], f2)
    s1 = _read_file(f1)
    s2 = _read_file(f2)
    os.remove(f1)
    os.remove(f2)
    assert s1 == s2


def test_public_dir():
    base_url = os.getenv('H2O_WAVE_BASE_URL', '/')
    p = site.download(f'{base_url}assets/brand/h2o.svg', 'h2o.svg')
    svg = _read_file(p)
    os.remove(p)
    assert svg.index('<svg') == 0
