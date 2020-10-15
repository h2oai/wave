---
title: Change Log
---

## Versioning

H2O Wave and its Python driver follow [Semantic Versioning](https://semver.org/). Major releases ship every six months (~February and ~August), while minor and patch releases may ship as often as every week. Minor and patch releases should never contain breaking changes.

When referencing the [`h2o-wave` package](https://pypi.org/project/h2o-wave/) from your `requirements.txt` or `setup.py`, you should always use a version constraint such as `>=4.2, <5` (any version 4.2 or greater, but less than 5), since major releases of H2O Wave do include breaking changes.

## Support Policy

For LTS releases, bug fixes are provided for 2 years and security fixes are provided for 3 years. These releases provide the longest window of support and maintenance. For general releases, bug fixes are provided for 6 months and security fixes are provided for 1 year.

## v0.7.0
Oct 15, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.7.0)
- Added
  - Hash navigation using context menus.
  - Allow handling location hash when an open app page is reloaded.
  - Allow pre-selecting a tab in a tab_card.
  - Allow setting a height on the file upload component.
  - Allow justifying buttons left/center/right/spread.
  - Add data-test attribute to all cards for browser testing.
  - New documentation website, gallery, guides and tutorials.
- Changed
  - Fit table height to content height whenever possible.
  - Improve spacing between form components.
  - data-test attribute is set based on the names of cards.
- Fixed
  - Quote CSV data properly while downloading a table component's data.
  - Don't auto-hide axis labels in plots when data is missing.
  - Display labels instead of names when a pickers initial values are set.
  - Handle numeric column sorting in the table component.
  - Handle icon column sorting in the table component.

## v0.6.0
Sep 23, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.6.0)
- Added
  - Apps when launched now automatically use an available free port instead of `55556`.
  - Client-side redirects to URLs and hashes using `meta_card.redirect`.
  - Context menus inside forms: `ui.text_xl()` and `ui.text_l()` now support optional context menus.
  - Plots now support specifying data values for predictable color encoding and legends.
  - `ui.markup` component for rendering HTML inline in forms.
  - `ui.template` component for rendering templated HTML inline in forms.
  - The height of tables can now be controlled using the `height` attribute.
  - Both sorting and group-by now work on the same table column if specified.
  - Lots of examples on how to use `ui.table` sorting, grouping, search, download, etc.
  - Ability to specify which column in a `ui.table` is the primary column, or disable altogether.
- Changed
  - `ui.text()` now unconditionally allows embedded HTML tags.
  - App host now defaults to `127.0.0.1` instead of `localhost`.
  - Footer display in `ui.table` is now inferred from usage and displayed automatically.
  - The `min_width` and `max_width` attributes for table columns are now strings (consistency).
- Fixed
  - Background color rendering bug when page overflows after loading.
  - Render tooltip properly on toolbar command buttons.
  - `ui.table()` rendering bug: remove stray `0`.
  - Python error stack trace, if any, is displayed on top of all other cards on page.

## v0.5.0
Sep 18, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.5.0)
- Added
  - Example for controlling cards with tabs.
  - Cypress test runner for CI.
  - Search, sort, filter, group-by, export and custom cell types for table component.
- Changed
  - Remove semantic validation for stepper component.
- Fixed
  - Value synchronization bug in textbox component.

## v0.4.0
Sep 16, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.4.0)
- Added
  - Trigger attribute to checklist component.
- Changed
  - Allow same min and max values for the range slider component.
  - App tests are now automatically and directly translated to Cypress tests when loaded.
- Fixed
  - Allow removing selected options from the picker component.
  - Render axis title properly when specified.
  - Raise informative error message if attempting to use Numpy objects in components.
- Removed
  - Cypress test bridge removed from server.
  - `run_tests` API.

## v0.3.1
Sep 8, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.3.1)
- Fixed
  - Multiselect dropdown checkboxes do not respond when clicked.

## v0.3.0
Sep 8, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.3.0)
- Added
  - Native plots inside form cards - `ui.visualization()`.
  - Vega plots inside form cards - `ui.vega_visualization()`.

## v0.2.0
Sep 4, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.2.0)
- Added
  - Picker component.
  - Breadcrumbs component.
  - Range slider component.
  - Stepper component.
  - Allow backend to handle changes to textboxes as you type.
  - Select / deselect all controls for multivalued dropdown component.
  - Examples for using plotly plots.
  - Example for updating vega plots.
  - OS-specific installations instructions.
  - Cypress test framework support.
- Fixed
  - Add .exe extension o Windows executable.
  - Percentage formatting in Safari.

## v0.1.4
Aug 10, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.1.4)
- Fixed
  - Frame heights are not respected with total height of frames exceeds containing card size

## v0.1.3
Aug 10, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.1.3)
- Fixed
  - `h2o_wave.ui.link()` now has a `download` attribute to work around a [Firefox bug](https://bugzilla.mozilla.org/show_bug.cgi?id=858538).
  - Race condition in the interactive tour that caused some examples to not preview properly.

## v0.1.2
Aug 7, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.1.2)
- Added
  - API for `h2o_wave.core.Expando` copy, clone and item/attribute deletion.
  - Migration guide.
  - Example for setting browser window title.
  - API and example for Header card: `h2o_wave.ui.header_card()`.
  - Export `h2o_wave.core.Ref` from `h2o_wave`.
  - API and examples for inline frames inside form cards: `h2o_wave.ui.frame()`.
- Changed
  - Renamed env var prefix for settings to `H2O_Q_`.
- Fixed
  - Plot X/Y axis transpose bug.

## v0.1.1
Jul 27, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.1.1)
- Added
  - Options for file type and size to file upload component.
  - API for displaying desktop notifications.
  - Buttons can now submit specific values instead of only True/False.
  - Examples for layout and card sizing.
  - Image card for displaying base64-encoded images.
  - Example for image card.
  - Vector graphics API.
  - Turtle graphics based path generator.
  - Examples for graphics card.
- Fixed
  - Re-rendering performance improvements.

## v0.1.0
Jul 13, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.1.0)
- Added
  - Example for displaying iframe content > 2MB.
  - Example for plotting using matplotlib.
  - Example for plotting using Altair.
  - Example for plotting using Vega.
  - Example for plotting using Bokeh.
  - Example for plotting using custom D3.js Javascript.
  - Example for live dashboard with stats cards.
  - Example for master-detail user interfaces using `ui.table()`.
  - Example for authoring multi-step wizard user interfaces.
  - Unload API: `q.unload()` to delete uploaded files.

## v0.0.7
Jul 12, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.7)
- Added
  - Download API: `q.download()`.
  - Vega-lite support: `ui.vega_card()`.
  - Context menu support to all cards.
  - `refresh` attribute on `meta_card` allows static pages to stop receiving live updates.
  - Passing `-debug` when starting server displays site stats at `/_d/site`.
  - Drag and drop support for file upload component.
  - Template expression support for markdown cards.
  - All APIs and examples documented.
  - All 110 examples now ship with the Sphinx documentation.
  - Documentation now ships with release download.
- Changed
  - API consistency: `ui.vis()` renamed to `ui.plot()`.
  - All stats cards now have descriptive names.
  - API consistency: `ui.mark.mark` renamed to `ui.mark.type`.
  - API consistency: `page.sync()` and `page.push()` renamed to `page.save()`.
- Removed
  - `ui.dashboard_card()` and `ui.notebook_card()`.

## v0.0.6
Jul 6, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.6)
- Added
  - Log network traffic when logging is set to debug mode.
  - Capture and display unhandled exceptions on the UI.
  - Routing using location hash.
  - Toolbar component.
  - Tabs component.
  - Nav component.
  - Upload API: `q.upload()`.
- Changed
  - `q.session` renamed to `q.user`

## v0.0.5
Jun 29, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.5)
- Added
  - Add configure() API to configure environment before launching.

## v0.0.4
Jun 26, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.4)
- Added
  - Multi-user and multi-client support: launch apps in `multicast` or `unicast` modes in addition to `broadcast` mode.
  - Client-specific data can now be stored and accessed via `q.client`, similar to `q.session` and `q.app`.
  - Simpler page referencing: `import site` can be used instead of `site = Site()`.
- Changed
  - Apps now lauch in `unicast` mode by default instead of `broadcast` mode.

## v0.0.3
Jun 19, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.3)
- Added
  - Make `Expando` data structure available for apps.

## v0.0.2
Jun 17, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.0.2)
- Initial version
- v0.0.1
- Package stub
