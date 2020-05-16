def button(name: str, label='') -> dict:
    return dict(button=dict(name=name, label=label))


def form(name: str, box: str, url: str, items: list) -> dict:
    return dict(
        key=name,
        view='form',
        box=box,
        url=url,
        items=items,
    )
