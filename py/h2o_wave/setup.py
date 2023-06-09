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

import setuptools
import os
from glob import glob
from pathlib import Path

curr_dir = os.path.dirname(__file__)

with open(os.path.join(curr_dir, 'README.rst'), 'r') as readme:
    long_description = readme.read()

with open(os.path.join(curr_dir, 'README.md'), 'r') as readme_markdown:
    conda_description = readme_markdown.read()

platform = os.getenv('H2O_WAVE_BUILD_OS', 'darwin')
# VERSION clashes with conda build. Use PKG_VERSION instead.
version = os.getenv('VERSION', os.getenv('PKG_VERSION', 'DEV'))
arch = os.getenv('H2O_WAVE_BUILD_ARCH', 'amd64')
base_path = os.path.join(curr_dir, '..', '..', 'build', f'wave-{version}-{platform}-{arch}')

# Create a metadata file to get easy access to platform/OS arch when needed.
with open(os.path.join(curr_dir, 'h2o_wave', 'metadata.py'), 'w') as f:
    f.write(f'''
# Generated in setup.py.
__platform__ = "{platform}"
__arch__ = "{arch}"
''')


def get_data_files():
    data_dict = {}
    templ_path = os.path.join(curr_dir, 'project_templates')
    data_dict['project_templates'] = [os.path.join(curr_dir, 'project_templates', f) for f in os.listdir(templ_path)]

    if platform != 'any':
        data_dict[''] = glob(os.path.join(base_path, 'waved*'))
        build_path = os.path.join(base_path, 'www')
        for p in Path(build_path).rglob('*'):
            if os.path.isdir(p):
                continue
            *dirs, _ = p.relative_to(build_path).parts
            key = os.path.join('www', *dirs)
            if key in data_dict:
                data_dict[key].append(str(p))
            else:
                data_dict[key] = [str(p)]

    return list(data_dict.items())


setuptools.setup(
    name='h2o_wave',
    version=version,
    author='Prithvi Prabhu',
    author_email='prithvi@h2o.ai',
    description='Python driver for H2O Wave Realtime Apps',
    long_description=long_description,
    conda_description=conda_description,
    url='https://h2o.ai/products/h2o-wave',
    packages=['h2o_wave'],
    package_data={'h2o_wave': ['py.typed']},
    data_files=get_data_files(),
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Operating System :: OS Independent',
        'Development Status :: 5 - Production/Stable',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Topic :: Database',
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Communications :: Chat',
        'Topic :: Scientific/Engineering :: Visualization',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'Topic :: Software Development :: Widget Sets',
        'Topic :: System :: Distributed Computing',
    ],
    python_requires='>=3.7.1',
    install_requires=[
        'Click',
        'inquirer',
        'httpx>=0.16.1',
        'starlette>=0.13.8',
        'uvicorn>=0.17.6',
    ],
    entry_points=dict(
        console_scripts=["wave = h2o_wave.cli:main"]
    ),
    extras_require=dict(
        ml=['h2o_wave_ml']
    ),
)
