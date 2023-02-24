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
Python package `h2o_lightwave` provides a Python driver for H2O Wave.

H2O Lightwave is a lightweight, pure-Python version of [H2O Wave](https://wave.h2o.ai/)
that can be embedded in popular async web frameworks like FastAPI, Starlette, etc.

In other words, H2O Lightwave works without the Wave server.
"""

from .core import Ref, data, pack, Expando, expando_to_dict, clone_expando, copy_expando
from .server import Q, wave_serve
from .routing import on, handle_on
from .types import *
from .version import __version__

__author__ = 'Martin Turoci'
