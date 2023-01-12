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

from h2o_wave import AsyncSite
import httpx

from .utils import read_file


# TODO: Add cleanup (site.unload) to tests that upload files.
class TestPythonServerAsync(unittest.IsolatedAsyncioTestCase):
    def __init__(self, methodName: str = ...) -> None:
        super().__init__(methodName)
        self.site = AsyncSite()

    async def test_file_server(self):
        f1 = 'temp_file1.txt'
        with open(f1, 'w') as f:
            f.writelines([f'line {i + 1}' for i in range(10)])
        paths = await self.site.upload([f1])
        f2 = 'temp_file2.txt'
        f2 = await self.site.download(paths[0], f2)
        s1 = read_file(f1)
        s2 = read_file(f2)
        os.remove(f1)
        os.remove(f2)
        assert s1 == s2

    async def test_public_dir(self):
        base_url = os.getenv('H2O_WAVE_BASE_URL', '/')
        p = await self.site.download(f'{base_url}assets/brand/h2o.svg', 'h2o.svg')
        svg = read_file(p)
        os.remove(p)
        assert svg.index('<svg') == 0

    async def test_cache(self):
        d1 = dict(foo='bar', qux=42)
        await self.site.cache.set('test', 'data', d1)
        keys = await self.site.cache.keys('test')
        assert len(keys) == 1
        assert keys[0] == 'data'
        d2 = await self.site.cache.get('test', 'data')
        assert isinstance(d2, dict)
        assert d2['foo'] == d1['foo']
        assert d2['qux'] == d1['qux']

    async def test_multipart_server(self):
        file_handle = open('../assets/brand/wave.svg', 'rb')
        p = await self.site.uplink('test_stream', 'image/svg+xml', file_handle)
        await self.site.unlink('test_stream')
        file_handle.close()
        assert len(p) > 0

    async def test_upload_dir(self):
        upload_path, = await self.site.upload_dir(os.path.join('tests', 'test_folder'))
        download_path = await self.site.download(f'{upload_path}/dir1/test.txt', 'test.txt')
        txt = read_file(download_path)
        os.remove(download_path)
        assert len(txt) > 0

    async def test_deleting_files(self):
        base_url = os.getenv('H2O_WAVE_BASE_URL', '/')
        upload_path, = await self.site.upload([os.path.join('tests', 'test_folder', 'dir1', 'test.txt')])
        assert base_url in upload_path
        res = httpx.get(f'http://localhost:10101{upload_path}')
        assert res.status_code == 200
        await self.site.unload(upload_path)
        res = httpx.get(f'http://localhost:10101{upload_path}')
        assert res.status_code == 404
