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

package wave

import (
	"testing"

	"github.com/h2oai/wave/pkg/assert"
)

func textItem(name, content string) any {
	return map[string]any{"text": map[string]any{"name": name, "content": content}}
}

func textContent(c *Card, i int) any {
	return c.data["items"].([]any)[i].(map[string]any)["text"].(map[string]any)["content"]
}

func TestByNameUpdateInitialItems(t *testing.T) {
	eq, _, _ := assert.Assert(t)
	c := loadCard(nil, CardD{D: map[string]any{
		"view":  "form",
		"items": []any{textItem("text_clicked", "Clicked: Nothing")},
	}})

	c.set([]string{"text_clicked", "content"}, "Clicked:")
	eq(textContent(c, 0), "Clicked:")
}

func TestByNameUpdateAfterItemsReplaced(t *testing.T) {
	eq, _, _ := assert.Assert(t)
	c := loadCard(nil, CardD{D: map[string]any{
		"view":  "form",
		"items": []any{textItem("text_clicked", "Clicked: Nothing")},
	}})

	c.set([]string{"items"}, []any{textItem("text_clicked", "Clicked: fox")})
	c.set([]string{"text_clicked", "content"}, "Clicked:")
	eq(textContent(c, 0), "Clicked:")
}

func TestByNameUpdateAfterItemsSetOnEmptyCard(t *testing.T) {
	eq, _, _ := assert.Assert(t)
	c := loadCard(nil, CardD{D: map[string]any{"view": "form", "items": []any{}}})

	c.set([]string{"items"}, []any{textItem("textbox3", "old")})
	c.set([]string{"textbox3", "content"}, "new")
	eq(textContent(c, 0), "new")
}
