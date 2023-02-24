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

import json
from typing import Optional, Union


def _clean(d: dict) -> dict:
    return {k: v for k, v in d.items() if v is not None}


def boxes(*args: str) -> str:
    """Create a specification for card's `box` attribute. Indicates where and how to position a card for various layouts.

    Args:
        args: Either the name of the zone to place the card in, or a specification created using the `box()` function.
    Returns:
        A string intended to be used as a card's `box` attribute.
    """
    return json.dumps(args)


def box(zone: str, order: Optional[int] = None, size: Optional[Union[str, int]] = None, width: Optional[str] = None,
        height: Optional[str] = None) -> str:
    """Create a specification for card's `box` attribute. Indicates where and how to position a card.

    Args:
        zone: The name of the zone to place the card in.
        order: An number that determines the position of this card relative to other cards in the same zone. Cards in the same zone are sorted in ascending `order` and then placed left to right (or top to bottom).
        size: A number that indicates the ratio of available width or height occupied by this card. Defaults to 1 if size, width and height are not provided.
        width: The width of this card, e.g. `200px`, `50%`, etc.
        height: The height of this card, e.g. `200px`, `50%`, etc.
    Returns:
        A string intended to be used as a card's `box` attribute.
    """
    if size is not None:
        if not isinstance(size, (int, str)):
            raise ValueError('size must be str or int')
        if isinstance(size, int):
            size = str(size)
    return json.dumps(_clean(dict(zone=zone, order=order, size=size, width=width, height=height)))
