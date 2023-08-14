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
from inspect import signature
import logging
from starlette.routing import compile_path
from .core import expando_to_dict
from .server import Q

logger = logging.getLogger(__name__)

_event_handlers = {}  # dictionary of event_source => [(event_type, predicate, handler)]
_arg_handlers = {}  # dictionary of arg_name => [(predicate, handler)]
_path_handlers = []
_arg_with_params_handlers = []
_handle_on_deprecated_warning_printed = False


def _get_arity(func: Callable) -> int:
    return len(signature(func).parameters)


def _add_handler(arg: str, func: Callable, predicate: Optional[Callable]):
    if arg not in _arg_handlers:
        _arg_handlers[arg] = handlers = []
    else:
        handlers = _arg_handlers[arg]
    handlers.append((predicate, func, _get_arity(func)))


def _add_event_handler(source: str, event: str, func: Callable, predicate: Optional[Callable]):
    if source not in _event_handlers:
        _event_handlers[source] = handlers = []
    else:
        handlers = _event_handlers[source]
    handlers.append((event, predicate, func, _get_arity(func)))


def on(arg: str = None, predicate: Optional[Callable] = None):
    """
    Indicate that a function is a query handler that should be invoked when `q.args` or `q.events` contains an argument that matches a specific name or pattern or value.

    Examples:
    A function annotated with `@on('foo')` is invoked whenever `q.args.foo` is found and the value is truthy.
    A function annotated with `@on('foo', lambda x: x is False)` is invoked whenever `q.args.foo` is False.
    A function annotated with `@on('foo', lambda x: isinstance(x, bool)` is invoked whenever `q.args.foo` is True or False.
    A function annotated with `@on('foo', lambda x: 42 <= x <= 420)` is invoked whenever `q.args.foo` between 42 and 420.
    A function annotated with `@on('foo.bar')` is invoked whenever `q.events.foo.bar` is found and the value is truthy.
    A function annotated with `@on('foo.bar', lambda x: x is False)` is invoked whenever `q.events.foo.bar` is False.
    A function annotated with `@on('foo.bar', lambda x: isinstance(x, bool)` is invoked whenever `q.events.foo.bar` is True or False.
    A function annotated with `@on('foo.bar', lambda x: 42 <= x <= 420)` is invoked whenever `q.events.foo.bar` between 42 and 420.
    A function annotated with `@on('#foo')` is invoked whenever `q.args['#']` equals 'foo'.
    A function annotated with `@on('#foo/bar')` is invoked whenever `q.args['#']` equals 'foo/bar'.
    A function annotated with `@on('#foo/{"{fruit}"}')` is invoked whenever `q.args['#']` matches 'foo/apple', 'foo/orange', etc. The parameter 'fruit' is passed to the function (in this case, 'apple', 'orange', etc.)

    Parameters in patterns (indicated within curly braces) can be converted to `str`, `int`, `float` or `uuid.UUID` instances by suffixing the parameters with `str`, `int`, `float` or `uuid`, respectively.

    Examples:
    - `user_id:int`: `user_id` is converted to an integer.
    - `amount:float`: `amount` is converted to a float.
    - `id:uuid`: `id` is converted to a `uuid.UUID`.

    Args:
        arg: The name of the `q.arg` argument (in case of plain arguments) or the event_source.event_type (in case of events) or a pattern (in case of hash arguments, or `q.args['#']`). If not provided, the `q.arg` argument is assumed to be the same as the name of the function.
        predicate: A function (or lambda) to test the value of the argument. If provided, the query handler is invoked if the function returns a truthy value.
    """

    def wrap(func):
        func_name = func.__name__

        # This check fails in Cythonized apps.
        # Related:
        # - https://bugs.python.org/issue38225
        # - https://github.com/cython/cython/issues/2273
        # if not asyncio.iscoroutinefunction(func):
        #    raise ValueError(f"@on function '{func_name}' must be async")

        if predicate and not callable(predicate):
            raise ValueError(f"@on predicate must be callable for '{func_name}'")
        if isinstance(arg, str) and len(arg):
            if arg.startswith('#'):  # location hash
                rx, _, conv = compile_path(arg[1:])
                _path_handlers.append((rx, conv, func, _get_arity(func)))
            elif '.' in arg:  # event
                source, event = arg.split('.', 1)
                if not len(source):
                    raise ValueError(f"@on event source cannot be empty in '{arg}' for '{func_name}'")
                if not len(event):
                    raise ValueError(f"@on event type cannot be empty in '{arg}' for '{func_name}'")
                _add_event_handler(source, event, func, predicate)
            elif "{" in arg and "}" in arg:
                rx, _, conv = compile_path(arg)
                _arg_with_params_handlers.append((predicate, func, _get_arity(func), rx, conv))
            else:
                _add_handler(arg, func, predicate)
        else:
            _add_handler(func_name, func, predicate)
        logger.debug(f'Registered event handler for {func_name}')
        return func

    return wrap


async def _invoke_handler(func: Callable, arity: int, q: Q, arg: any, **params: any):
    if arity == 0:
        await func()
    elif arity == 1:
        await func(q)
    elif len(params) == 0:
        await func(q, arg)
    elif arity == len(params) + 1:
        await func(q, **params)
    else:
        await func(q, arg, **params)


async def _match_predicate(predicate: Callable, func: Callable, arity: int, q: Q, arg: any, **params: any) -> bool:
    if predicate:
        if predicate(arg):
            await _invoke_handler(func, arity, q, arg, **params)
            return True
    else:
        if arg is not None:
            await _invoke_handler(func, arity, q, arg, **params)
            return True
    return False


async def run_on(q: Q) -> bool:
    """
    Handle the query using a query handler (a function annotated with `@on()`).

    Args:
        q: The query context.

    Returns:
        True if a matching query handler was found and invoked, else False.
    """
    submitted = str(q.args['__wave_submission_name__'])

    # Event handlers.
    for event_source in expando_to_dict(q.events):
        for entry in _event_handlers.get(event_source, []):
            event_type, predicate, func, arity = entry
            event = q.events[event_source]
            if event_type in event:
                arg_value = event[event_type]
                if await _match_predicate(predicate, func, arity, q, arg_value):
                    return True

    # Hash handlers.
    if submitted == '#':
        for rx, conv, func, arity in _path_handlers:
            match = rx.match(q.args[submitted])
            if match:
                params = match.groupdict()
                for key, value in params.items():
                    params[key] = conv[key].convert(value)
                if len(params):
                    if arity <= 1:
                        await _invoke_handler(func, arity, q, None)
                    else:
                        await func(q, **params)
                else:
                    await _invoke_handler(func, arity, q, None)
                return True

    # Arg handlers.
    for entry in _arg_handlers.get(submitted, []):
        predicate, func, arity = entry
        if await _match_predicate(predicate, func, arity, q, q.args[submitted]):
            return True
    for predicate, func, arity, rx, conv in _arg_with_params_handlers:
        match = rx.match(submitted)
        if match:
            params = match.groupdict()
            for key, value in params.items():
                params[key] = conv[key].convert(value)
            if await _match_predicate(predicate, func, arity, q, q.args[submitted], **params):
                return True

    return False


async def handle_on(q: Q) -> bool:
    """
    DEPRECATED: Handle the query using a query handler (a function annotated with `@on()`).

    Args:
        q: The query context.

    Returns:
        True if a matching query handler was found and invoked, else False.
    """
    global _handle_on_deprecated_warning_printed
    if not _handle_on_deprecated_warning_printed:
        print('\033[93m' + 'WARNING: handle_on() is deprecated, use run_on() instead.' + '\033[0m')
        _handle_on_deprecated_warning_printed = True

    event_sources = expando_to_dict(q.events)
    for event_source in event_sources:
        event = q.events[event_source]
        entries = _event_handlers.get(event_source)
        if entries:
            for entry in entries:
                event_type, predicate, func, arity = entry
                if event_type in event:
                    arg_value = event[event_type]
                    if await _match_predicate(predicate, func, arity, q, arg_value):
                        return True

    args = expando_to_dict(q.args)
    for arg in args:
        arg_value = q.args[arg]
        if arg == '#':
            for rx, conv, func, arity in _path_handlers:
                match = rx.match(arg_value)
                if match:
                    params = match.groupdict()
                    for key, value in params.items():
                        params[key] = conv[key].convert(value)
                    if len(params):
                        if arity <= 1:
                            await _invoke_handler(func, arity, q, None)
                        else:
                            await func(q, **params)
                    else:
                        await _invoke_handler(func, arity, q, None)
                    return True
        else:
            entries = _arg_handlers.get(arg)
            if entries:
                for entry in entries:
                    predicate, func, arity = entry
                    if await _match_predicate(predicate, func, arity, q, arg_value):
                        return True
    return False
