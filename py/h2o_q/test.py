import json
import requests

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
            _write(f'.{_js_call(fn, *args, **kwargs)}')
            return self

        return method

    def __enter__(self):
        _write(f'.within(() => {{')
        _indent()
        return _TestSequence()

    def __exit__(self, exc_type, exc_val, exc_tb):
        _dedent()
        _write(f'\n{_tab()}}})')


class _TestSequence:
    def __getattr__(self, fn):
        def method(*args):
            f = f'cy.{fn}'
            _write(f'\n{_tab()}{_js_call(f, *args)}')
            return _TestElement()

        return method


_all_tests = []


def test(f):
    _all_tests.append(f)
    return f


def run_tests():
    suites = dict()
    for f in _all_tests:
        suite_name = f.__module__
        if suite_name not in suites:
            suites[suite_name] = []

        f(_TestSequence())

        test_name = f.__name__
        test_code = _read()

        suites[suite_name].append((test_name, test_code))

    specs = []
    for name, tests in suites.items():
        its = "\n\n".join([f'  it({_js(test_name)}, () => {{\n{test_code}\n  }})' for (test_name, test_code) in tests])
        specs.append(dict(name=name, code=f'context({_js(name)}, () => {{\n{its}\n}})'))

    requests.post("http://localhost:55550/", json=dict(specs=specs))
