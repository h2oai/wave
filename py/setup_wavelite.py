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
from pathlib import Path

with open('README.rst', 'r') as readme:
    long_description = readme.read()

with open('README.md', 'r') as readme_markdown:
    conda_description = readme_markdown.read()

version = os.getenv('VERSION', 'DEV')

def get_data_files():
    data_dict = {}

    build_path = os.path.join('..', 'ui', 'build')
    for p in Path(build_path).rglob('*'):
        if os.path.isdir(p):
            continue
        *dirs, _ = p.relative_to(build_path).parts
        key = os.path.join('h2o_wavelite', 'www', *dirs)
        if key in data_dict:
            data_dict[key].append(str(p))
        else:
            data_dict[key] = [str(p)]

    return list(data_dict.items())


setuptools.setup(
    name='h2o_wavelite',
    version=version,
    author='Martin Turoci',
    author_email='martin.turoci@h2o.ai',
    description='H2O Wave Python driver for integration with arbitrary python web frameworks.',
    long_description=long_description,
    conda_description=conda_description,
    url='https://h2o.ai/products/h2o-wave',
    packages=['h2o_wavelite'],
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
    python_requires='>=3.7.1'
)
