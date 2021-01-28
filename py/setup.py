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

with open('README.rst', 'r') as readme:
    long_description = readme.read()

with open('README.md', 'r') as readme_markdown:
    conda_description = readme_markdown.read()

setuptools.setup(
    name='h2o_wave',
    version='0.11.0',
    author='Prithvi Prabhu',
    author_email='prithvi@h2o.ai',
    description='Python driver for H2O Wave Realtime Apps',
    long_description=long_description,
    # conda_description is a hack to read Anaconda description from a file. Not needed for Pypi.
    conda_description=conda_description,
    url='https://h2o.ai/products/h2o-wave',
    packages=setuptools.find_packages(),
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.6',
        'Operating System :: OS Independent',
        'Development Status :: 2 - Pre-Alpha',
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
    python_requires='>=3.6.1',
    install_requires=[
        'Click',
        'httpx==0.16.1',
        'starlette==0.13.8',
        'uvicorn==0.12.2',
    ],
    entry_points=dict(
        console_scripts=["wave = h2o_wave.cli:main"]
    ),
    extras_require=dict(
        ml=['h2o_wave_ml@https://github.com/h2oai/wave-ml/releases/download/v0.1.0/h2o_wave_ml-0.1.0-py3-none-any.whl']
    ),
)
