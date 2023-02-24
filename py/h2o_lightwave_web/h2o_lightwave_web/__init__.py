# Copyright 2022 H2O.ai, Inc.
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

from .version import __version__

import pathlib
import os
import re

web_directory = str(pathlib.Path(__file__).parent / 'www')


# TODO: Inject web_files to this file during build time. No need to read index.html at runtime.
def get_web_files(prefix: str = '') -> str:
    if prefix:
        if not prefix.endswith('/'):
            prefix += '/'
        if prefix.startswith('/'):
            prefix = prefix[1:]

    web_files = []
    with open(os.path.join(web_directory, 'index.html'), 'r') as f:
        for line in f:
            stripped_line = line.strip()
            if re.search(r'(\.js|\.css)(\'|\")', stripped_line):
                web_files.append(stripped_line.replace('wave-static/', f'{prefix}wave-static/'))
    web_files = '\n'.join(web_files)

    return web_files
