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

from collections import defaultdict
import setuptools
import os
from pathlib import Path

def get_data_files():
    data_dict = defaultdict(list)

    for f in Path(os.path.join('h2o_wave_university', 'lessons')).rglob('*.py'):
        data_dict[f.parent].append(str(f))
    for f in Path(os.path.join('h2o_wave_university', 'static')).rglob('*.*'):
        data_dict[f.parent].append(str(f))

    return list(data_dict.items())

with open('README.md', 'r') as readme:
    long_description = readme.read()

setuptools.setup(
    name='h2o_wave_university',
    version=os.getenv('VERSION', 'DEV'),
    author='Martin Turoci',
    author_email='martin.turoci@h2o.ai',
    description='Interactive tutorials for learning H2O Wave framework.',
    long_description=long_description,
    long_description_content_type='text/markdown',
    url='https://wave.h2o.ai/',
    packages=['h2o_wave_university'],
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
    install_requires=['h2o-wave>=0.23.1'],
    entry_points=dict(console_scripts=["wave-university = h2o_wave_university.cli:main"]),
)
