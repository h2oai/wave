//
// THIS FILE IS GENERATED; DO NOT EDIT
//

// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { CardDef } from './editing'

export const cardDefs: CardDef[] = [
  {
    "view": "canvas",
    "icon": "EditCreate",
    "attrs": [
      {
        "name": "box",
        "optional": false,
        "t": "box",
        "value": "{\"zone\":\"Body\"}"
      },
      {
        "name": "title",
        "optional": false,
        "t": "textbox",
        "value": "Untitled Canvas"
      },
      {
        "name": "width",
        "optional": false,
        "t": "spinbox",
        "value": 400,
        "min": 400,
        "max": 2048,
        "step": 50
      },
      {
        "name": "height",
        "optional": false,
        "t": "spinbox",
        "value": 300,
        "min": 300,
        "max": 1536,
        "step": 50
      },
      {
        "name": "data",
        "optional": false,
        "t": "record",
        "value": {}
      }
    ]
  },
  {
    "view": "chat",
    "icon": "OfficeChat",
    "attrs": [
      {
        "name": "box",
        "optional": false,
        "t": "box",
        "value": "{\"zone\":\"Body\"}"
      },
      {
        "name": "title",
        "optional": false,
        "t": "textbox",
        "value": "Untitled Chat"
      },
      {
        "name": "data",
        "optional": false,
        "t": "record",
        "value": {}
      },
      {
        "name": "capacity",
        "optional": true,
        "t": "spinbox",
        "value": 50,
        "min": 10,
        "max": 10000,
        "step": 10
      }
    ]
  },
  {
    "view": "frame",
    "icon": "PageAdd",
    "attrs": [
      {
        "name": "box",
        "optional": false,
        "t": "box",
        "value": "{\"zone\":\"Body\"}"
      },
      {
        "name": "title",
        "optional": false,
        "t": "textbox",
        "value": "Untitled Frame"
      },
      {
        "name": "path",
        "optional": true,
        "t": "textbox",
        "value": ""
      },
      {
        "name": "content",
        "optional": true,
        "t": "textarea",
        "value": ""
      }
    ]
  },
  {
    "view": "markdown",
    "icon": "InsertTextBox",
    "attrs": [
      {
        "name": "box",
        "optional": false,
        "t": "box",
        "value": "{\"zone\":\"Body\"}"
      },
      {
        "name": "title",
        "optional": false,
        "t": "textbox",
        "value": "Untitled Content"
      },
      {
        "name": "content",
        "optional": false,
        "t": "textarea",
        "value": "Hello, World!"
      }
    ]
  },
  {
    "view": "markup",
    "icon": "FileHTML",
    "attrs": [
      {
        "name": "box",
        "optional": false,
        "t": "box",
        "value": "{\"zone\":\"Body\"}"
      },
      {
        "name": "title",
        "optional": false,
        "t": "textbox",
        "value": "Untitled Content"
      },
      {
        "name": "content",
        "optional": false,
        "t": "textarea",
        "value": "<div/>"
      }
    ]
  }
]