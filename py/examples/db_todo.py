# WaveDB / To-do App
# A multi-user To-do list application using WaveDB for data management.
# This example is very similar to the todo.py example, except that this
#   example uses WaveDB instead of an in-memory list.
# ---
from h2o_wave import main, app, Q, ui, connect, WaveDB, expando_to_dict


# A simple class that represents a to-do item.
class TodoItem:
    def __init__(self, id, label, done):
        self.id = id
        self.label = label
        self.done = done


async def setup_db() -> WaveDB:
    db = connect()['todo']
    _, err = await db.exec_atomic(
        """
        create table if not exists todo (
            id integer primary key,
            user text not null,
            label text not null,
            done integer not null default 0
        )
        """
    )
    if err:
        raise RuntimeError(f'Failed setting up database: {err}')
    return db


@app('/demo')
async def serve(q: Q):
    if q.app.db is None:
        q.app.db = await setup_db()

    if q.args.new_todo:  # Display an input form.
        await new_todo(q)
    elif q.args.add_todo:  # Add an item.
        await add_todo(q)
    else:  # Show all items.
        await show_todos(q)


async def show_todos(q: Q):
    # Get items for this user.
    db: WaveDB = q.app.db

    # Check if we have any updates, i.e. the user has checked/unchecked any item.
    updates = []
    for key, done in expando_to_dict(q.args).items():
        # We've named each todo item `todo_{id}' (e.g. todo_42, todo_43, and so on)
        # So identify the todo items from their 'todo_' prefix, then extract the ids from the names.
        if key.startswith('todo_'):
            _, id = key.split('_', 1)
            updates.append(('update todo set done=? where id=?', 1 if done else 0, int(id)))

    # If we have updates, update our database.
    if len(updates):
        _, err = await db.exec_many(*updates)
        if err:
            raise RuntimeError(f'Failed updating todos: {err}')

    # Fetch latest todos for our user
    rows, err = await db.exec('select id, label, done from todo where user=?', q.auth.subject)
    if err:
        raise RuntimeError(f'Failed fetching todos: {err}')
    todos = [TodoItem(id, label, done) for id, label, done in rows]

    # Create done/not-done checkboxes.
    done = [ui.checkbox(name=f'todo_{todo.id}', label=todo.label, value=True, trigger=True) for todo in todos if
            todo.done]
    not_done = [ui.checkbox(name=f'todo_{todo.id}', label=todo.label, trigger=True) for todo in todos if not todo.done]

    # Display list
    q.page['form'] = ui.form_card(box='1 1 4 10', items=[
        ui.text_l('To Do'),
        ui.button(name='new_todo', label='Add To Do...', primary=True),
        *not_done,
        *([ui.separator('Done')] if len(done) else []),
        *done,
    ])
    await q.page.save()


async def add_todo(q: Q):
    # Insert a new item
    db: WaveDB = q.app.db
    _, err = await db.exec('insert into todo (user, label) values (? , ?)', q.auth.subject, q.args.label or 'Untitled')
    if err:
        raise RuntimeError(f'Failed inserting todo: {err}')

    # Go back to our list.
    await show_todos(q)


async def new_todo(q: Q):
    # Display an input form
    q.page['form'] = ui.form_card(box='1 1 4 10', items=[
        ui.text_l('Add To Do'),
        ui.textbox(name='label', label='What needs to be done?', multiline=True),
        ui.buttons([
            ui.button(name='add_todo', label='Add', primary=True),
            ui.button(name='show_todos', label='Back'),
        ]),
    ])
    await q.page.save()
