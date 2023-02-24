#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from setuptools import find_namespace_packages, setup


def get_long_description():
    return open("README.md", "r", encoding="utf8").read()


setup(
    name="h2o_lightwave_web",
    version=os.getenv('VERSION', 'DEV'),
    url="https://wave.h2o.ai/",
    description="Web assets package for H2O Lightwave apps.",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    author="Martin Turoci",
    author_email="martin.turoci@h2o.ai",
    packages=find_namespace_packages(include=["h2o_lightwave_web*"]),
    python_requires=">=3.7",
    install_requires=[],
    include_package_data=True,
    license_files=('LICENSE',),
    classifiers=[
        'License :: OSI Approved :: Apache Software License',
        'Development Status :: 4 - Beta',
        "Environment :: Web Environment",
        "Intended Audience :: Developers",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Topic :: Internet :: WWW/HTTP",
        'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
        'Topic :: Communications :: Chat',
        'Topic :: Scientific/Engineering :: Visualization',
        'Topic :: Software Development :: Libraries :: Application Frameworks',
        'Topic :: Software Development :: Widget Sets',
        'Topic :: System :: Distributed Computing',
    ],
    project_urls={
        "Documentation": "https://wave.h2o.ai/",
        "Source": "https://github.com/h2oai/wave",
        "Issues": "https://github.com/h2oai/wave/issues",
    },
)
