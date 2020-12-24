# Table / Filter
# Enable filtering values for specific columns.
# ---
import random
from datetime import datetime, timedelta
from h2o_wave import  main, app, Q, ui

_id = 0


class Issue:
    def __init__(self, text: str, status: str, progress: float, icon: str, notifications: str, created: str):
        global _id
        _id += 1
        self.id = f'I{_id}'
        self.text = text
        self.status = status
        self.views = 0
        self.progress = progress
        self.icon = icon
        self.notifications = notifications
        self.created = created


issue_descriptions = [
    'Update release notes',
    'Generate software license',
    'Update product documentation',
    'Introduce new tutorials',
    'Rewrite the error handling guide',
    'Navigation links are not working',
    'Set up CICD pipeline',
    'Improve unit tests coverage',
    'Update dependencies',
    'Run the automated test suite',
    'Monitor server utilization',
    'Run deployment on a staging server',
]


def gen_datetime(min_year=1990, max_year=datetime.now().year):
    # generate a datetime in iso format
    start = datetime(min_year, 1, 1, 00, 00, 00)
    years = max_year - min_year + 1
    end = start + timedelta(days=365 * years)
    return (start + (end - start) * random.random()).isoformat()


def notification_status():
    return 'Off' if random.random() > 0.5 else 'On'


def get_icon():
    return 'BoxCheckmarkSolid' if random.random() > 0.5 else 'BoxMultiplySolid'


def issue_status():
    return 'Closed' if random.random() % 2 == 0 else 'Open'


# Create some issues
issues = [
    Issue(
        text=issue,
        status=issue_status(),
        progress=random.random(),
        icon=get_icon(),
        notifications=notification_status(),
        created=gen_datetime()) for issue in issue_descriptions
]

# Create columns for our issue table.
columns = [
    ui.table_column(name='text', label='Issue'),
    ui.table_column(name='status', label='Status', filterable=True),
    ui.table_column(name='notifications', label='Notifications', filterable=True),
    ui.table_column(name='done', label='Done', cell_type=ui.icon_table_cell_type()),
    ui.table_column(name='views', label='Views'),
    ui.table_column(name='progress', label='Progress', cell_type=ui.progress_table_cell_type()),
]


@app('/demo')
async def serve(q: Q):
    q.page['form'] = ui.form_card(box='1 1 -1 11', items=[
        ui.table(
            name='issues',
            columns=columns,
            rows=[ui.table_row(
                name=issue.id,
                cells=[issue.text, issue.status, issue.notifications, issue.icon, str(issue.views), issue.progress]) for
                issue in issues]
        )
    ])
    await q.page.save()
