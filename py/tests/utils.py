import sys
import difflib
import json

def make_card(**props):
    d = {}
    b = []
    for k, v in props.items():
        # HACK
        if isinstance(v, dict) and len(v) == 1 and ('__c__' in v or '__f__' in v or '__m__' in v):
            d['~' + k] = len(b)
            buf = dict()
            for k2, v2 in v.items():
                buf[k2[2]] = v2
                break
            b.append(buf)
        else:
            d[k] = v
    return dict(d=d, b=b) if len(b) else dict(d=d)

def make_form_card(buf):
    return {
    "p": {
      "c": {
        "card1": {
          "b": [ buf ],
          "d": {
            "box": "1 1 1 1",
            "items": [
              {
                "visualization": {
                  "data": {},
                  "name": "my_plot",
                  "plot": {
                    "marks": [
                      {
                        "type": "interval",
                        "x": "=profession",
                        "y": "=salary",
                        "y_min": 0
                      }
                    ]
                  }
                }
              }
            ],
            "view": "form",
            "~items.0.visualization.data": 0
            }
          }
        }
      },
    }


def make_map_buf(fields, data): return {'__m__': dict(f=fields, d=data)}


def make_fix_buf(fields, data): return {'__f__': dict(f=fields, d=data, n=len(data))}


def make_cyc_buf(fields, data, i): return {'__c__': dict(f=fields, d=data, i=i, n=len(data))}


def make_page(**cards) -> dict: return dict(p=dict(c=cards))


def dump_for_comparison(x: dict): return json.dumps(x, indent=2, sort_keys=True).splitlines(keepends=True)


def compare(actual: dict, expected: dict) -> bool:
    a = dump_for_comparison(actual)
    b = dump_for_comparison(expected)
    if a == b:
        return True

    diff = difflib.Differ().compare(a, b)
    sys.stdout.write('\n------------------- Actual --------------------\n')
    sys.stdout.writelines(a)
    sys.stdout.write('\n------------------- Expected --------------------\n')
    sys.stdout.writelines(b)
    sys.stdout.write('\n------------------- Diff --------------------\n')
    sys.stdout.writelines(diff)
    return False

def read_file(path: str):
    with open(path, 'r') as f:
        return f.read()


sample_fields = ['a', 'b', 'c']