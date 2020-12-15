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

import os
import os.path
import json

_nest_depth = 2


def _indent():
    global _nest_depth
    _nest_depth += 1


def _dedent():
    global _nest_depth
    _nest_depth -= 1


def _tab(): return '  ' * _nest_depth


_code = []


def _write(line: str): _code.append(line)


def _read() -> str:
    code = ''.join(_code)
    _code.clear()
    return code


def _js(x: any): return json.dumps(x)  # TODO handle types properly


def _js_call(fn, *args, **kwargs):
    params = ', '.join([_js(x) for x in args])
    if len(kwargs) > 0:
        kvs = ', '.join([f'{k}: {_js(v)}' for k, v in kwargs.items()])
        params += f', {{{kvs}}}'
    return f'{fn}({params})'


class _TestElement:
    def __getattr__(self, fn):
        def method(*args, **kwargs):
            _write(f'.{_js_call(fn.lstrip("_"), *args, **kwargs)}')
            return self
        return method

    def __enter__(self):
        _write('.within(() => {')
        _indent()
        return Cypress()

    def __exit__(self, exc_type, exc_val, exc_tb):
        _dedent()
        _write(f'\n{_tab()}}})')


class Cypress:
    """Represents a Cypress test translator.
    """

    def run(self, f):
        """ Includes all steps from the given test into the current test.

        Args:
            f: A Python function containing Cypress test steps.
        """
        f(self)

    def __getattr__(self, fn):
        def method(*args):
            f = f'cy.{fn}'
            _write(f'\n{_tab()}{_js_call(f, *args)}')
            return _TestElement()

        return method


_cypress_dir = os.environ.get('CYPRESS_INTEGRATION_TEST_DIR')


def cypress(description: str):
    def tag(f):
        if _cypress_dir:
            _translate_test(description, f)
        return f

    return tag


def _translate_test(description: str, f):
    f(Cypress())
    code = _read()

    test_name = f.__name__
    test_filename = f'{f.__module__}.{test_name}.spec.js'
    test_body = f'describe({_js(description)}, () => {{\nit({_js(test_name)}, () => {{\n{code}\n  }})\n}})'
    with open(os.path.join(_cypress_dir, test_filename), 'w', encoding='utf-8') as js_file:
        js_file.write(test_body)
