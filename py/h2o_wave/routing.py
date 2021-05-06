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

from typing import Optional, Callable
import asyncio
import logging
from starlette.routing import compile_path
from .core import expando_to_dict
from .server import Q

logger = logging.getLogger(__name__)

_arg_handlers = {}  # dictionary of arg name => [(predicate, handler)]
_path_handlers = []


def _add_handler(arg: str, func: Callable, predicate: Optional[Callable]):
    if arg not in _arg_handlers:
        _arg_handlers[arg] = handlers = []
    else:
        handlers = _arg_handlers[arg]
    handlers.append((predicate, func,))


def on(arg: str = None, predicate: Optional[Callable] = None):
    """
    Indicate that a function is a query handler that should be invoked when `q.args` contains an argument that matches a specific name or pattern or value.

    Examples:
    A function annotated with `@on('foo')` is invoked whenever `q.args['foo']` is found and the value is truthy.
    A function annotated with `@on('foo', lambda x: x is False)` is invoked whenever `q.args['foo']` is False.
    A function annotated with `@on('foo', lambda x: isinstance(x, bool)` is invoked whenever `q.args['foo']` is True or False.
    A function annotated with `@on('foo', lambda x: 42 <= x <= 420)` is invoked whenever `q.args['foo']` between 42 and 420.
    A function annotated with `@on('#foo')` is invoked whenever `q.args['#']` equals 'foo'.
    A function annotated with `@on('#foo/bar')` is invoked whenever `q.args['#']` equals 'foo/bar'.
    A function annotated with `@on('#foo/&lcub;fruit&rcub;')` is invoked whenever `q.args['#']` matches 'foo/apple', 'foo/orange', etc. The parameter 'fruit' is passed to the function (in this case, 'apple', 'orange', etc.)

    Parameters in patterns (indicated within curly braces) can be converted to `str`, `int`, `float` or `uuid.UUID` instances by suffixing the parameters with `str`, `int`, `float` or `uuid`, respectively.

    Examples:
    - `user_id:int`: `user_id` is converted to an integer.
    - `amount:float`: `amount` is converted to a float.
    - `id:uuid`: `id` is converted to a `uuid.UUID`.

    Args:
        arg: The name of the `q.arg` argument (in case of plain arguments) or a pattern (in case of hash arguments, or `q.args['#']`). If not provided, the `q.arg` argument is assumed to be the same as the name of the function.
        predicate: A function (or lambda) to test the value of the argument. If provided, the query handler is invoked if the function returns a truthy value.
    """

    def wrap(func):
        func_name = func.__name__
        if not asyncio.iscoroutinefunction(func):
            raise ValueError(f'@on function {func_name} must be async')
        if predicate:
            if not callable(predicate):
                raise ValueError('@on predicate must be callable')
        if isinstance(arg, str) and len(arg):
            if arg.startswith('#'):
                rx, _, conv = compile_path(arg[1:])
                _path_handlers.append((rx, conv, func))
            else:
                _add_handler(arg, func, predicate)
        else:
            _add_handler(func_name, func, predicate)
        logger.debug(f'Registered event handler {func_name}')
        return func

    return wrap


async def handle_on(q: Q) -> bool:
    """
    Handle the query using a query handler (a function annotated with `@on()`).

    Args:
        q: The query context.

    Returns:
        True if a matching query handler was found and invoked, else False.
    """
    args = expando_to_dict(q.args)
    for arg in args:
        arg_value = q.args[arg]
        if arg == '#':
            for rx, conv, func in _path_handlers:
                match = rx.match(arg_value)
                if match:
                    params = match.groupdict()
                    for key, value in params.items():
                        params[key] = conv[key].convert(value)
                    if len(params):
                        await func(q, **params)
                    else:
                        await func(q)
                    return True
        else:
            entries = _arg_handlers.get(arg)
            if entries:
                for entry in entries:
                    predicate, func = entry
                    if predicate:
                        if predicate(arg_value):
                            await func(q)
                            return True
                    else:
                        if arg_value:
                            await func(q)
                            return True
    return False
