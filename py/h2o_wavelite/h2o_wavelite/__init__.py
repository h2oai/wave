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

"""
Python package `h2o_wave` provides the Python driver for H2O Wave.

H2O Wave is a lightweight software stack for programming interactive web applications
entirely in Python (no HTML/Javascript/CSS required).

It is designed to make it fast, fun and easy to build low-latency, realtime,
collaborative, web-based applications. It ships batteries-included with
a suite of form and data visualization components for rapidly prototyping
analytical and decision-support applications.

Wave's components work in conjunction with the Wave relay server that facilitates
realtime state synchronization between Python and web browsers.


.. include:: ../docs/index.md
"""
from .core import Ref, data, pack, Expando, expando_to_dict, clone_expando, copy_expando
from .server import Q, wave_serve
from .routing import on, handle_on
from .types import *
from .version import __version__

__author__ = 'Prithvi Prabhu'

__pdoc__ = {
    'cli': False,
    'ide': False,
}