---
title: Breadcrumbs 
keywords:
  -  breadcrumbs
custom_edit_url: null
---

Breadcrumbs should be used as a navigational aid in your app or site. They indicate the current page’s location within a hierarchy and help the user understand where they are in relation to the rest of that hierarchy.  They also afford one-click access to higher levels of that hierarchy. Breadcrumbs are typically placed, in horizontal form, under the masthead or navigation of an experience, above the primary content area.

You can see the API for [ui.breadcrumbs_card](/docs/api/ui#breadcrumbs_card) or check the interactive example in the Tour app.

```py
q.page['breadcrumbs'] = ui.breadcrumbs_card(box='1 1 3 1', items=[
    ui.breadcrumb(name='#menu', label='Menu'),
    ui.breadcrumb(name='#submenu', label='Submenu'),
    ui.breadcrumb(name='#subsubmenu', label='Subsubmenu'),
])
```
