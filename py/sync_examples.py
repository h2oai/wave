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

import json
import os.path
import re
from collections import defaultdict
from typing import List, Tuple

example_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), 'examples'))
website_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), os.pardir, 'website'))


class Example:
    def __init__(self, filename: str, title: str, description: str, tags: List[str], code: str):
        self.name = os.path.splitext(filename)[0]
        self.slug = self.name.replace('_', '-')
        self.filename = filename
        self.title = title
        self.subtitle = description.split('\n')[0].strip()
        self.description = description
        self.tags = tags
        self.code = code

    def to_md(self):
        if self.tags:
            tags_meta = '\n'.join(['  - ' + x for x in self.tags])
            links = []
            for t in self.tags:
                links.append(f"<a href={{useBaseUrl('docs/examples/tags#{t}')}}>{t}</a>")
            tags_links = '  '.join(links)
            header = f"""---
title: {self.title}
keywords:
{tags_meta}
custom_edit_url: null
---
import useBaseUrl from '@docusaurus/useBaseUrl';

        """
            footer = f"""
**Tags**:  {tags_links}
            """
        else:
            header = f"""---
title: {self.title}
custom_edit_url: null
---
        """
            footer = ""

        body = f"""
{self.description}
<div className='cover' style={{{{ backgroundImage: 'url(' + require('./assets/{self.slug}.png').default + ')' }}}} />

```py
{self.code}
```
        """
        return header + body + footer


def read_lines(p: str) -> List[str]:
    with open(p) as f:
        return f.readlines()


def read_file(p: str) -> str:
    with open(p) as f:
        return f.read()


def write_file(p: str, txt: str) -> str:
    with open(p, 'w') as f:
        f.write(txt)
    return txt


def strip_comment(line: str) -> str:
    """Returns the content of a line without '#' and ' ' characters
    remove leading '#', but preserve '#' that is part of a tag
    example:
    >>> '# #hello '.strip('#').strip()
    '#hello'
    """
    return line.strip('#').strip()


def parse_tags(description: str) -> Tuple[str, List[str]]:
    """Creates tags from description.
    Accepts a description containing tags and returns a (new_description, tags) tuple.
    The convention for tags:
    1. Any valid twitter hashtag
    For example, accept a description in any of the following forms
    1. Use a checklist to group a set of related checkboxes. #form #checkbox #checklist
    2. Use a checklist to group a set of related checkboxes.
       #form #checkbox #checklist
    3. Use a #checklist to group a set of related checkboxes.
       #form #checkbox
    and return
    ('Use a checklist to group a set of related checkboxes.', ['checkbox', 'checklist', 'form']). The list of tags will
    be sorted and all tags will be converted to lowercase.
    Args:
        description: Complete description of an example.
    Returns:
        A tuple of new_description and a sorted list of tags. new_description is created by removing the '#' characters
        from the description.
    """
    hashtag_regex_pattern = r"(\s+)#(\w*[a-zA-Z]+\w*)\b"
    pattern = re.compile(hashtag_regex_pattern)
    matches = pattern.findall(' ' + description)

    # Retrieve tags from the matches
    tags = sorted(list(set([x[-1].lower() for x in matches])))

    # Remove the '#' before the tags in description
    new_d = pattern.sub(r'\1\2', ' ' + description)

    # Remove the last line in description if it has only tags
    *lines, last_line = new_d.strip().splitlines()
    last_line_has_tags_only = len(last_line.strip()) > 1 and all([x.strip().lower() in tags for x in last_line.split()])
    if last_line_has_tags_only:
        # Return all lines except the last line
        return '\n'.join(lines), tags

    # Remove the last sentence if it has only tags
    *sentences, last_sentence = last_line.split('. ')
    last_sentence_has_tags_only = len(last_sentence.strip()) > 1 and all(
        [x.strip().lower() in tags for x in last_sentence.split()])
    if last_sentence_has_tags_only:
        # Return all lines and all sentences in the last line except the last sentence
        lines.extend(sentences)
        return '\n'.join(lines) + '.', tags

    # Return the complete description
    lines.append(last_line)
    return '\n'.join(lines), tags


def load_example(filename: str) -> Example:
    contents = read_file(os.path.join(example_dir, filename))
    parts = contents.split('---', maxsplit=1)
    header, code = parts[0].strip().splitlines(), parts[1].strip()
    title, description = strip_comment(header[0]), [strip_comment(x) for x in header[1:]]
    new_description, tags = parse_tags('\n'.join(description))
    return Example(filename, title, new_description, tags, code)


def make_toc(examples: List[Example]):
    return '''---
title: All Examples
slug: /examples/all
custom_edit_url: null
---
import useBaseUrl from '@docusaurus/useBaseUrl';

''' + '\n\n'.join([f"- <a href={{useBaseUrl('docs/examples/{e.slug}')}}>{e.title}</a>: {e.subtitle}" for e in examples])


def make_gallery_thumbnail(e: Example):
    return f"<a className='thumbnail' href={{useBaseUrl('docs/examples/{e.slug}')}}><div style={{{{backgroundImage:'url(' + require('./assets/{e.slug}.png').default + ')'}}}}></div>{e.title}</a>"  # noqa: E501


def make_gallery(examples: List[Example]):
    return '''---
title: Gallery
slug: /examples
custom_edit_url: null
---
import useBaseUrl from '@docusaurus/useBaseUrl';

''' + '\n' + '\n\n'.join([make_gallery_thumbnail(e) for e in examples])


def make_tag_group(tag: str, examples: List[Example]) -> str:
    sub_heading = f'### {tag}\n'
    example_links = []
    for e in examples:
        example_links.append(f"<a href={{useBaseUrl('docs/examples/{e.slug}')}}>{e.title}</a>")
    return sub_heading + '  '.join(example_links) + '\n'


def index_examples(examples: List[Example]):
    tags_dict = defaultdict(list)
    for e in examples:
        for t in e.tags:
            tags_dict[t].append(e)
    # Sort all tags and examples under each tag alphabetically
    return sorted([(t, sorted(e, key=lambda x: x.title)) for t, e in tags_dict.items()])


def make_examples_by_tag(examples: List[Example]):
    tags = index_examples(examples)
    return '''---
title: Examples by Tag
slug: /examples/tags
custom_edit_url: null
---
import useBaseUrl from '@docusaurus/useBaseUrl';

''' + '\n' + '\n\n'.join([make_tag_group(t, e) for t, e in tags])


def read_filenames(src: str):
    return [line.strip() for line in read_lines(os.path.join(example_dir, src)) if
            not line.strip().startswith('#')]


def main():
    filenames = read_filenames('tour.conf') + read_filenames('web_only.conf')

    examples = [load_example(filename) for filename in filenames]

    example_md_dir = os.path.join(website_dir, 'docs', 'examples')
    thumbnail_dir = os.path.join(example_md_dir, 'assets')

    for f in os.listdir(example_md_dir):
        if f.endswith('.md'):
            os.remove(os.path.join(example_md_dir, f))

    for e in examples:
        md = e.to_md()
        write_file(os.path.join(example_md_dir, f'{e.slug}.md'), md)
        if not os.path.exists(os.path.join(thumbnail_dir, f'{e.slug}.png')):
            print(f'*** ALERT: no thumbnail found for example "{e.slug}"')

    example_items = [dict(slug=e.slug) for e in examples]
    example_items.insert(0, dict(slug='index'))
    example_items.insert(1, dict(slug='all'))
    example_items.insert(2, dict(slug='tags'))
    write_file(os.path.join(website_dir, 'examples.js'), f'module.exports={json.dumps(example_items)}')
    write_file(os.path.join(example_md_dir, 'index.md'), make_gallery(examples))
    write_file(os.path.join(example_md_dir, 'all.md'), make_toc(examples))
    write_file(os.path.join(example_md_dir, 'tags.md'), make_examples_by_tag(examples))


if __name__ == '__main__':
    main()
