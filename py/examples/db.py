# WaveDB
# How to use WaveDB, a simple sqlite3 database server that ships with Wave.
# ---

# Before you run this example, start WaveDB (`wavedb`).
# By default, WaveDB listens on port 10100.
#
# To run this example, execute `python db.py`
#
# If your WaveDB instance is configured differently, you might want to set
#   the following environment variables accordingly:
# H2O_WAVEDB_ADDRESS - the ip:port of the database server
# H2O_WAVEDB_ACCESS_KEY_ID - the API access key ID
# H2O_WAVEDB_ACCESS_KEY_SECRET - the API access key secret

import asyncio
from h2o_wave import connect


async def main():
    # Create a database connection
    connection = connect()

    # Access the 'employees' database.
    # A new database is created automatically if it does not exist.
    db = connection["employees"]

    # Execute some statements.
    await db.exec("drop table if exists employee")
    await db.exec("create table employee(empid integer, name text, title text)")

    # Execute a statement and handle errors.
    results, err = await db.exec("insert into employee values(?, ?, ?)", 101, 'Jeffrey Lebowski', 'Slacker')
    if err:
        raise ValueError(err)

    # Execute many statements.
    insert_employee = "insert into employee values(?, ?, ?)"
    await db.exec_many(
        (insert_employee, 102, 'Walter Sobchak', 'Veteran'),
        (insert_employee, 103, 'Donny Kerabatsos', 'Sidekick'),
        (insert_employee, 104, 'Jesus Quintana', 'Bowler'),
        (insert_employee, 105, 'Uli Kunkel', 'Nihilist'),
    )

    # Execute many statements as a transaction.
    await db.exec_atomic(
        (insert_employee, 106, 'Brandt', 'Butler'),
        (insert_employee, 107, 'Maude Lebowski', 'Artist'),
        (insert_employee, 108, 'Franz', 'Nihilist'),
        (insert_employee, 109, 'Kieffer', 'Nihilist'),
    )

    # Read records.
    rows, err = await db.exec("select * from employee")
    if err:
        raise ValueError(err)

    print(rows)

    # Prints:
    #  [
    #     [101, 'Jeffrey Lebowski', 'Slacker'],
    #     [102, 'Walter Sobchak', 'Veteran'],
    #     [103, 'Donny Kerabatsos', 'Sidekick'],
    #     [104, 'Jesus Quintana', 'Bowler'],
    #     [105, 'Uli Kunkel', 'Nihilist'],
    #     [106, 'Brandt', 'Butler'],
    #     [107, 'Maude Lebowski', 'Artist'],
    #     [108, 'Franz', 'Nihilist'],
    #     [109, 'Kieffer', 'Nihilist']
    # ]

    # Clean up.
    await db.exec("drop table employee")

    # Drop the database entirely. Warning: A database is irrecoverable once dropped.
    await db.drop()

    # Close connection.
    await connection.close()


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)
loop.run_until_complete(main())
