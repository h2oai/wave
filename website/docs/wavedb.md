---
title: WaveDB
---

**WaveDB** is [SQLite](https://www.sqlite.org/index.html) with a HTTP interface.

It is a ~6MB (~2MB [UPX](https://upx.github.io/)-compressed) self-contained, zero-dependency executable that bundles SQLite 3.35.5 (2021-04-19) with JSON1, RTREE, FTS5, GEOPOLY, STAT4, and SOUNDEX.

If you are already a fan of SQLite, WaveDB acts as a thin HTTP-server wrapper that lets you access your SQLite databases over a network.

WaveDB can be used as a lightweight, cross-platform, installation-free companion SQL database for Wave apps. The `h2o-wave` package includes non-blocking `async` functions to access WaveDB.

Database files managed by WaveDB are 100% interoperable with SQLite, which means you can manage them with the `sqlite3` CLI, backup/restore/transfer them as usual, or use [Litestream](https://litestream.io/) for replication.

## Install

### Linux, OSX, Windows

[Download the executable](https://github.com/h2oai/wave/releases) for your platform. No installation required.

### Other Platforms

Compiling WaveDB on other platforms is easy if you have the [Go](https://golang.org) and C compilers handy (uses [cgo](https://golang.org/cmd/cgo/)):

```sh
git clone --depth 1 https://github.com/h2oai/wave.git
cd wave
go build -o wavedb cmd/wavedb/main.go
```

## Launch

Launch WaveDB (defaults to <http://localhost:10100/>):

```sh
./wavedb
```

```sh
2021/05/07 14:00:41
2021/05/07 14:00:41 ┌────────┐┌────┐ H2O WaveDB
2021/05/07 14:00:41 │  ┐┌┐┐┌─┘│─┐  │ DEV 20210507132041
2021/05/07 14:00:41 │  └┘└┘└─┘└─┘  │ © 2021 H2O.ai, Inc.
2021/05/07 14:00:41 └──────────────┘
2021/05/07 14:00:41
2021/05/07 14:00:41 listening :10100
```

Launch WaveDB on a different port:

```sh
./wavedb -listen :8080
```

Launch WaveDB with verbose logging (useful during development):

```sh
./wavedb -verbose
```

Launch WaveDB with a custom API access key/secret pair:

```sh
./wavedb -access-key-id uzer -access-key-secret pa55word
```

Serve your existing SQLite database files using WaveDB (defaults to current directory):

```sh
./wavedb -dir /path/to/my/db/files
```

## Examples

- [Using WaveDB from a Wave app - A To-do list](https://github.com/h2oai/wave/blob/main/py/examples/db_todo.py)
- [Using WaveDB from a Wave app - Paginated table](https://github.com/h2oai/wave/blob/main/py/examples/table_pagination_wavedb.py)
- [Using WaveDB from a standalone script](https://github.com/h2oai/wave/blob/main/py/examples/db.py)

## Usage

For this example, we'll use the [Chinook Sample Database](https://www.sqlitetutorial.net/sqlite-sample-database/) from [sqlitetutorial.net](https://www.sqlitetutorial.net/).

```sh
$ wget https://www.sqlitetutorial.net/wp-content/uploads/2018/03/chinook.zip
$ unzip chinook.zip
$ ls -l
-rw-r--r-- 1 elp elp  884736 May  7 12:34 chinook.db
-rwxr-xr-x 1 elp elp 9678432 May  7 13:20 wavedb
$ ./wavedb -access-key-id uzer -access-key-secret pa55word
```

### From h2o-wave

The `h2o-wave` Python package provides non-blocking `async` functions to access WaveDB.

```py
from h2o_wave import connect

# Create a database connection
connection = connect(key_id='uzer', key_secret='pa55word')

# Access the 'chinook' database.
# Automatically creates a new database if it does not exist.
db = connection["chinook"]

# Execute a query
results, err = await db.exec('SELECT name, composer FROM tracks LIMIT 5')

# Print results
if err:
    print(err)
else:
    print(results)
```

The query API is simple:

1. `db.exec(...)`: Execute one query.
2. `db.exec_many(...)`: Execute multiple queries.
3. `db.exec_atomic(...)`: Excute multiple queries as a transaction (rollback all on failure)

All three APIs support both DDL (`CREATE`, `ALTER`, `DROP`, etc.) and DML (`SELECT`, `INSERT`, `UPDATE`, etc.) statements:

```py
result, error = db.exec('CREATE TABLE student(name TEXT, age INTEGER)')
result, error = db.exec('INSERT INTO student VALUES ("Alice", 18)')
result, error = db.exec('SELECT name, age FROM student WHERE age > 17')
```

Queries can be parameterized (use on user-supplied input to prevent SQL injection):

```py
result, error = db.exec('INSERT INTO student VALUES (?, ?)', "Bob", 19)
result, error = db.exec('SELECT name, age FROM student WHERE age > ?', 17)
```

You can use any combination of the above in an `exec_many()` to batch all your queries into one request:

```py
results, error = db.exec_many(
    'CREATE TABLE student(name TEXT, age INTEGER)',
    'INSERT INTO student VALUES ("Alice", 18)',
    ('INSERT INTO student VALUES (?, ?)', "Bob", 19),
    'SELECT name, age FROM student WHERE age > 17',
    ('SELECT name, age FROM student WHERE age > ?', 17),
)
```

In the above example, substituting `exec_many()` with `exec_atomic()` executes all the queries in the batch as part of a transaction, rolling back all queries on any failures.

### From curl

Use `curl` to send a query:

```sh
curl -s -u uzer:pa55word -d '{"e":{"d":"chinook", "s":[{"q": "select name, composer from tracks limit 5"}]}}' http://localhost:10100
```

```json
{"r":[[["For Those About To Rock (We Salute You)","Angus Young, Malcolm Young, Brian Johnson"],["Balls to the Wall",null],["Fast As a Shark","F. Baltes, S. Kaufman, U. Dirkscneider \u0026 W. Hoffman"],["Restless and Wild","F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider \u0026 W. Hoffman"],["Princess of the Dawn","Deaffy \u0026 R.A. Smith-Diesel"]]]}
```

Use [jq](https://stedolan.github.io/jq/) to pretty-print the response:

```sh
curl -s -u uzer:pa55word -d '{"e":{"d":"chinook", "s":[{"q": "SELECT name, composer FROM tracks LIMIT 5"}]}}' http://localhost:10100 | jq '.'
```

```js
{
  "r": [
    [
      [
        "For Those About To Rock (We Salute You)",
        "Angus Young, Malcolm Young, Brian Johnson"
      ],
      [
        "Balls to the Wall",
        null
      ],
      [
        "Fast As a Shark",
        "F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman"
      ],
      [
        "Restless and Wild",
        "F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider & W. Hoffman"
      ],
      [
        "Princess of the Dawn",
        "Deaffy & R.A. Smith-Diesel"
      ]
    ]
  ]
}
```

## JSON protocol

### Grammar

```ts
type request = exec_request | drop_request
type reply = exec_reply | drop_reply

type exec_request = { d: database_name, s: statement[], a: atomicity }
type database_name = string
type statement = { q: query, p: parameter[] }
type query = string
type parameter = primitive
type atomicity = 0 | 1

type exec_reply = { r: result[], e: error }
type result = row[]
type row = primitive[]
type error = string

type drop_request = { d: database_name }

type drop_reply = { e: error }

type primitive = number | string | boolean | null
```

### Examples

Sample `exec_request`:

```js
{
  "e": {
    "d": "chinook",
    "s": [
      {
        "q": "select name, composer from tracks limit 5"
      }
    ]
  }
}
```

Sample `reply`:

```js
{
  "r": [
    [
      [
        "For Those About To Rock (We Salute You)",
        "Angus Young, Malcolm Young, Brian Johnson"
      ],
      [
        "Balls to the Wall",
        null
      ],
      [
        "Fast As a Shark",
        "F. Baltes, S. Kaufman, U. Dirkscneider & W. Hoffman"
      ],
      [
        "Restless and Wild",
        "F. Baltes, R.A. Smith-Diesel, S. Kaufman, U. Dirkscneider & W. Hoffman"
      ],
      [
        "Princess of the Dawn",
        "Deaffy & R.A. Smith-Diesel"
      ]
    ]
  ]
}
```

## Deployment

For production deployments:

- Use the `-access-keychain` option to control API keys. [See documentation](security.md#production).
- Use the `-tls-cert-file` and `-tls-key-file` options to enable HTTPS.

```
$ ./wavedb \
    -access-keychain /path/to/keychain \
    -tls-cert-file /path/to/cert-file \
    -tls-key-file /path/to/key-file
```

## Configuration

```
$ ./wavedb -help
Usage of ./wavedb:
  -access-key-id string
     default API access key ID (default "access_key_id")
  -access-key-secret string
     default API access key secret (default "access_key_secret")
  -access-keychain string
     path to file containing API access keys (default ".wave-keychain")
  -benchmark int
     run benchmarks for the given number of iterations
  -dir string
     path to directory containing database (.db) files (default ".")
  -listen string
     listen on this address (default ":10100")
  -tls-cert-file string
     path to certificate file (TLS only)
  -tls-key-file string
     path to private key file (TLS only)
  -verbose
     enable verbose logging
  -version
     print version and exit

```

## Acknowledgements

WaveDB is based on [SQLite](https://www.sqlite.org) and [bvinc/go-sqlite-lite](https://github.com/bvinc/go-sqlite-lite), built with [Go](https://golang.org/). The Python client uses [HTTPX](https://www.python-httpx.org/) under the hood. Thank you to the authors and contributors.

WaveDB can be used from any language or platform that has libraries for HTTP and JSON. The reference implementation of the client is [~75 lines of code](https://github.com/h2oai/wave/blob/main/py/h2o_wave/db.py) if you're interested in porting it to other languages.
