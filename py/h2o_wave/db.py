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

from typing import Tuple, List, Optional, Dict

import httpx

from .core import marshal, unmarshal


def _new_stmt(query: str, params: List) -> Dict:
    if not isinstance(query, str):
        raise ValueError(f'query must be str; got {type(query)}')
    for param in params:
        if param is not None and not isinstance(param, (int, float, str)):
            raise ValueError(f'SQL parameter must be one of int, float, str or None; got {type(param)}')
    return dict(query=query, params=None if len(params) == 0 else params)


def _new_exec_request(database: str, statements: List[Dict], atomic: bool) -> Dict:
    if not isinstance(database, str):
        raise ValueError(f'database must be str; got {type(database)}')
    return dict(database=database, statements=statements, atomic=atomic)


def _new_db_request(exec: Optional[Dict] = None) -> Dict:
    return dict(exec=exec)


class TeleDBError(Exception):
    """
    Represents a remote exception thrown by the TeleDB database server.
    """
    pass


class TeleDB:
    """
    Represents a TeleDB database client.
    """

    def __init__(self, address: str, key_id: str, key_secret: str):
        """
        Create a new client instance.

        Args:
            address: database address
            key_id: access key id
            key_secret: access key secret
        """
        self._address = address
        self._http = httpx.AsyncClient(
            auth=(key_id, key_secret),
            headers={'Content-type': 'application/json'},
            verify=False,
        )

    def __getitem__(self, name: str):
        """
        Returns a connector to a database with the given name.

        Args:
            name: the database name
        Returns:
            a connector instance
        """
        return _DB(self, name)

    async def _call(self, req: dict) -> dict:
        res = await self._http.post(self._address, content=marshal(req))
        if res.status_code != 200:
            raise TeleDBError(f'Request failed (code={res.status_code}): {res.text}')
        return unmarshal(res.text)


class _DB:
    """
    Represents a database connector.
    """

    def __init__(self, db: TeleDB, name: str):
        self._db = db
        self._name = name

    async def exec(self, sql: str, *params) -> Tuple[Optional[List[List]], Optional[str]]:
        """
        Execute a single SQL statement. Parameters are optional.

        Returns a (result, error) tuple, where result is a 2-dimensional list in
        row-major order, and error is a string error message, if any.
        The result will be None if the error is not None.
        Therefore, always check if there is an error before attempting to use the result.

        Args:
            sql: SQL statement
            params: Parameters to the SQL statement, one of str, int, float or None
        Returns:
            A (result, error) tuple

        Example:

        result, err = db.exec(sql)
        if err:
            print(error)
            return
        print(result)

        result, error = db.exec('CREATE TABLE student(name TEXT, age INTEGER)')
        result, error = db.exec('INSERT INTO student VALUES ("Alice", 18)')
        result, error = db.exec('INSERT INTO student VALUES (?, ?)', "Bob", 19)
        result, error = db.exec('SELECT name, age FROM student WHERE age > 17')
        result, error = db.exec('SELECT name, age FROM student WHERE age > ?', 17)
        """
        r, err = await self._exec([(sql, *params)])
        if err:
            return None, err
        return r[0], None

    async def exec_many(self, *args) -> Tuple[Optional[List[List[List]]], Optional[str]]:
        """
        Execute multiple SQL statements.

        Returns a (results, error) tuple, where results is a list of results from each statement,
        and error is a string error message, if any.
        The results will be None if the error is not None.
        Therefore, always check if there is an error before attempting to use the results.

        Args:
            args: SQL statements
        Returns:
            a (results, error) tuple

        Example:

        results, error = db.exec_many(
            'CREATE TABLE student(name TEXT, age INTEGER)',
            'INSERT INTO student VALUES ("Alice", 18)',
            ('INSERT INTO student VALUES (?, ?)', "Bob", 19),
            'SELECT name, age FROM student WHERE age > 17',
            ('SELECT name, age FROM student WHERE age > ?', 17),
        )
        if err:
            print(error)
            return
        print(results)

        """
        return await self._exec(list(args))

    async def exec_atomic(self, *args) -> Tuple[Optional[List[List[List]]], Optional[str]]:
        """
        Same as exec_may(), but use a transaction. Rollback if any statement fails.
        """
        return await self._exec(list(args), atomic=True)

    async def _exec(self, args: list, atomic=False) -> Tuple[Optional[List[List[List]]], Optional[str]]:
        if len(args) == 0:
            raise ValueError('Want at least one SQL query, got none')

        statements: List[Dict] = []
        for arg in args:
            if isinstance(arg, str):
                arg = [arg]
            elif isinstance(arg, tuple):
                arg = list(arg)
            elif isinstance(arg, list):
                pass
            else:
                raise ValueError('Want SQL string or statement tuple')

            if len(arg) == 0:
                raise ValueError('Want statement, got empty tuple/list')
            statements.append(_new_stmt(arg[0], arg[1:]))

        req = _new_db_request(exec=_new_exec_request(self._name, statements, atomic))
        res = await self._db._call(req)
        result, err = res.get('result'), res.get('error')
        if err:
            return None, err
        return result.get('results'), None
