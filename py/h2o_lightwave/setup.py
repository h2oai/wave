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

with open(os.path.join(os.path.dirname(os.path.realpath(__file__)), 'README.md'), 'r') as readme:
    long_description = readme.read()

version = os.getenv('VERSION', 'DEV')
setuptools.setup(
    name='h2o_lightwave',
    version=version,
    author='Martin Turoci',
    author_email='martin.turoci@h2o.ai',
    description='H2O Wave Python driver for integration with arbitrary python web frameworks.',
    long_description=long_description,
    long_description_content_type="text/markdown",
    url='https://h2o.ai/products/h2o-wave',
    packages=['h2o_lightwave'],
    package_data={'h2o_lightwave': ['py.typed']},
    extras_require=dict(web=[f"h2o_lightwave_web=={version}"]),
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.7',
        'Operating System :: OS Independent',
        'Development Status :: 4 - Beta',
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
    project_urls={
        "Documentation": "https://wave.h2o.ai/",
        "Source": "https://github.com/h2oai/wave",
        "Issues": "https://github.com/h2oai/wave/issues",
    },
)
