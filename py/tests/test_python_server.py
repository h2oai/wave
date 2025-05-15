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
import unittest

from h2o_wave import Expando, data, site, ui
import httpx

from .utils import (compare, make_card, make_cyc_buf, make_fix_buf, make_form_card,
                    make_map_buf, make_page, read_file, sample_fields)

base_url = os.getenv('H2O_WAVE_BASE_URL', '/')


# TODO: Add cleanup (site.unload) to tests that upload files.
class TestPythonServer(unittest.TestCase):
    def test_new_empty_card(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict()
        page.save()
        assert compare(page.load(), make_page(card1=make_card()))


    def test_new_card_with_props(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(s="foo", i=42, f=4.2, bt=True, bf=False, n=None)
        page.save()
        assert compare(page.load(), make_page(card1=make_card(s="foo", i=42, f=4.2, bt=True, bf=False)))

    def test_new_card_with_map_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields))
        page.save()
        assert compare(page.load(), make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data={}))))

    def test_form_card_with_map_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields))
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows={}),
            ),
        ])
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(m=dict(d={}, f=['a', 'b', 'c']))))

    def test_form_card_with_map_buf_update(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields))
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows={}),
            ),
        ])
        page.save()
        page['card1'].my_plot.data['foo'] = [1,2,3]
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(m=dict(d={'foo': [1,2,3]}, f=['a', 'b', 'c']))))

    def test_new_card_with_fix_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields, size=3))
        page.save()
        assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(fields=sample_fields, data=[None] * 3))))


    def test_form_card_with_fix_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows=[None] * 3),
            ),
        ])
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(f=dict(d=[None] * 3, f=['a', 'b', 'c'], n =3))))


    def test_form_card_with_fix_buf_update(self):
        page = site['/test']
        page.drop()
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows=[None] * 3),
            ),
        ])
        page.save()
        page['card1'].my_plot.data[0] = [1,2,3]
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(f=dict(d=[[1,2,3], None, None], f=['a', 'b', 'c'], n =3))))


    def test_form_card_with_cyc_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows=[None] * 3, size=-3),
            ),
        ])
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(c=dict(d=[None, None, None], f=['a', 'b', 'c'], n=3, i=0))))


    def test_form_card_with_cyc_buf_update(self):
        page = site['/test']
        page.drop()
        page['card1'] = ui.form_card(box='1 1 1 1', items=[
            ui.visualization(
                name='my_plot',
                plot=ui.plot([ui.mark(type='interval', x='=profession', y='=salary', y_min=0)]),
                data=data(fields=sample_fields, rows=[None] * 3, size=-3),
            ),
        ])
        page.save()
        page['card1'].my_plot.data[-1] = [1,2,3]
        page.save()
        assert compare(page.load(), make_form_card(buf=dict(c=dict(d=[[1,2,3], None, None], f=['a', 'b', 'c'], n=3, i=1))))


    def test_new_card_with_cyc_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields, size=-3))
        page.save()
        assert compare(page.load(),
                      make_page(card1=make_card(data=make_cyc_buf(fields=sample_fields, data=[None] * 3, i=0))))


    def test_load_card_with_map_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields, rows=dict(foo=[1, 2, 3])))
        page.save()
        assert compare(page.load(),
                      make_page(card1=make_card(data=make_map_buf(fields=sample_fields, data=dict(foo=[1, 2, 3])))))


    def test_load_card_with_fix_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields, rows=[[1, 2, 3]]))
        page.save()
        assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(fields=sample_fields, data=[[1, 2, 3]]))))


    def test_load_card_with_cyc_buf(self):
        page = site['/test']
        page.drop()
        page['card1'] = dict(data=data(fields=sample_fields, rows=[[1, 2, 3]], size=-10))
        page.save()
        assert compare(page.load(),
                      make_page(card1=make_card(data=make_cyc_buf(fields=sample_fields, data=[[1, 2, 3]], i=0))))


    def test_prop_set(self):
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


    def test_map_prop_set(self):
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


    def test_map_prop_set_deep(self):
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


    def test_array_prop_set(self):
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


    def test_array_prop_set_deep(self):
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


    def test_map_buf_init(self):
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


    def test_map_buf_write(self):
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


    def test_fix_buf_init(self):
        page = site['/test']
        page.drop()
        c = page.add('card1', dict(data=data(fields=sample_fields, size=3)))
        c.data = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
        page.save()
        assert compare(page.load(), make_page(card1=make_card(data=make_fix_buf(
            fields=sample_fields,
            data=[[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        ))))


    def test_fix_buf_write(self):
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


    def test_cyc_buf_init(self):
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


    def test_cyc_buf_write(self):
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

    def test_proxy(self):
        # waved -proxy must be set
        url = 'https://wave.h2o.ai'
        response = Expando(site.proxy('get', url))
        if response.error:
            assert False
        else:
            result = Expando(response.result)
            assert result.code == 400
            assert len(result.headers) > 0

    def test_file_server(self):
        f1 = 'temp_file1.txt'
        with open(f1, 'w') as f:
            f.writelines([f'line {i + 1}' for i in range(10)])
        paths = site.upload([f1])
        f2 = 'temp_file2.txt'
        f2 = site.download(paths[0], f2)
        s1 = read_file(f1)
        s2 = read_file(f2)
        os.remove(f1)
        os.remove(f2)
        assert s1 == s2

    def test_public_dir(self):
        p = site.download(f'{base_url}assets/brand/h2o.svg', 'h2o.svg')
        svg = read_file(p)
        os.remove(p)
        assert svg.index('<svg') == 0

    def test_cache(self):
        d1 = dict(foo='bar', qux=42)
        site.cache.set('test', 'data', d1)
        keys = site.cache.keys('test')
        assert len(keys) == 1
        assert keys[0] == 'data'
        d2 = site.cache.get('test', 'data')
        assert isinstance(d2, dict)
        assert d2['foo'] == d1['foo']
        assert d2['qux'] == d1['qux']

    def test_multipart_server(self):
        file_handle = open('../assets/brand/wave.svg', 'rb')
        p = site.uplink('test_stream', 'image/svg+xml', file_handle)
        site.unlink('test_stream')
        file_handle.close()
        assert len(p) > 0

    def test_upload_dir(self):
        upload_path, = site.upload_dir(os.path.join('tests', 'test_folder'))
        download_path = site.download(f'{upload_path}/dir1/test.txt', 'test.txt')
        txt = read_file(download_path)
        os.remove(download_path)
        assert len(txt) > 0

    def test_deleting_files(self):
        upload_path, = site.upload([os.path.join('tests', 'test_folder', 'dir1', 'test.txt')])
        res = httpx.get(f'http://localhost:10101{upload_path}')
        assert res.status_code == 200
        site.unload(upload_path)
        res = httpx.get(f'http://localhost:10101{upload_path}')
        assert res.status_code == 404
