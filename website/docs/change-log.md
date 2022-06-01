---
title: Change Log
---

## Versioning

H2O Wave and its Python driver follow [Semantic Versioning](https://semver.org/). Major releases ship every six months (~February and ~August), while minor and patch releases may ship as often as every week. Minor and patch releases should never contain breaking changes.

When referencing the [`h2o-wave` package](https://pypi.org/project/h2o-wave/) from your `requirements.txt` or `setup.py`, you should always use a version constraint such as `>=4.2, <5` (any version 4.2 or greater, but less than 5), since major releases of H2O Wave do include breaking changes.

## Support Policy

For LTS releases, bug fixes are provided for 2 years and security fixes are provided for 3 years. These releases provide the longest window of support and maintenance. For general releases, bug fixes are provided for 6 months and security fixes are provided for 1 year.

## v0.22.0

May 31, 2022 - [Download](https://github.com/h2oai/wave/releases/tag/v0.22.0)

- Added
  - New: `required` attribute for combobox.
  - New: `path` attribute for button.
  - New: `python.defaultInterpreter` option can be used to configure VSCode extension as well.
  - New: `readonly` attribute for `ui.text_annotator`.
  - New: Command menu for `ui.table`.
  - New: Multi select combobox.
  - New: More R support.
  - New: Markdown support in `ui.table`.
  - New: Additional params to be passed during OIDC auth.
  - New: Display additional info on plot tooltips.
  - New: Single link markdown text q.args.submission.
  - New: Full URL printed to the console during app launch.
  - New: Fire `dismissed` event when `ui.notification_bar` is closed.
  - New: Image annotator.
  - New: Text annotator can handle unknown tags without breaking. Ignores them.
  - New: Inactivity timeout for auth session.
  - New: Allow turning off `ui.notification_bar` closing timeout by setting it to `-1`.
  - New: `oidc-post-logout-redirect-url` server config option. Thanks @henrycs!
  - Docs: HTTP request example.
  - Docs: More explanation to layout `size` attribute.
  - Docs: Improved R examples.
  - Docs: Explicitly require a button when using a compact file upload.
  - Docs: Add a note about not yet supported `icon` attr in `ui.tall_stats`.
- Changed
  - Display table sort icons only when the sort is active.
  - Plot examples use hardcoded data instead of `synth.py`.
  - docs: Handle clicks in table example.
  - `ui.message_bar` height reduced.
  - App code in Tour app is now editable in browser.
- Fixed
  - Show placeholder in dialog dropdown.
  - Use seconds instead of milliseconds in `ui.notification_bar`.
  - Use correct md table syntax in hash_routing example.
  - Allow specifying value for masked textbox.
  - Remove unnecessary scrollbar from `ui.stats`.
  - Make Tour app work in cloud env.
  - Remove multiline textbox scrollbar when height is set.
  - Remove unnecessary scrollbar from `ui.menu`.
  - Escape dollar signs in VSCode extension app template snippets.
  - Remove unnecessary scrollbars in header.
  - Remove unwanted overflow in `ui.dropdown`.
  - Make text annotator split text by not only spaces, but by any non-alphabetic char.

## v0.21.0

April 13, 2022 - [Download](https://github.com/h2oai/wave/releases/tag/v0.21.0)

## 📢📢 Important notice

Wave **drops python 3.6 support** as it has reached it's [EOL](https://endoflife.date/python).

### Deprecation

- wide_article_preview.caption in favor of wide_article_preview.content

### Change of behavior

- `ui.nav_card.value` is controllable, same as in 0.19

- Added
  - New: Add tooltip to NavItem.
  - New: Add select/deselect all to table filter menu.
  - New: Add tags to form card.
  - New: Box plots.
  - New: Notification bar.
  - New: Use non-branded svg icons instead of font ones.
  - New: **M1 Mac support** for Wave server.
  - New: Add `cell_overflow` to table column.
  - New: Allow plot interactions: `zoom`, `brush`, `drag-move`.
  - New: Allow specifying custom table groups.
  - New: Add `closable` prop to `ui.side_panel`.
  - New: Server-side paginated table.
  - Docs: Overlay section (dialog, sidepanel, notification bar).
  - Docs: Plots section.
  - Docs: VSCode debugging.
  - Docs: Icons section.
- Changed
  - Redesign messagebar.
  - Side panel is no longer closable by default. Specify `closable=True` if you want to have the X button present.
  - **Deprecated** wide_article_preview.caption in favor of wide_article_preview.content.
  - **Python 3.6 support dropped**
- Fixed
  - Handle colon in $H2O_WAVE_ISTEN properly. Thanks @swt2c!
  - Make header items clickable when secondary items are specified.
  - Do not format table group by title if cell is a valid date, but data_type is not date.
  - Provide correct autocomplete in PyCharm for q.events.
  - Make table filter icon clickable.
  - Improve dialog color contrast for h2o-dark theme.
  - Allow using commands in header_card.
  - Do not expand table filter menu when column right-clicked.
  - Kill hanging waved process when app fails to start.
  - Use UTC time for plot time scales.
  - Fix datepicker in Safari.
  - Adjust label color for raised cards.
  - Respect dropdown width when tooltip is set.
  - Remove header/sidebar primary color saturation.
  - Allow sorting of grouped by rows.
- Performance
  - Lazy load 3rd party JS modules if possible.
  - Speed up PyCharm plugin autocomplete parsing.
  - Allow gzip compression for static assets.

## v0.20.0

January 28, 2022 - [Download](https://github.com/h2oai/wave/releases/tag/v0.20.0)

- Added
  - New: Run `wave fetch` to download examples and tour locally.
  - New: Base URL support.
  - New: Menu component.
  - New: TallStats card.
  - New: Post card.
  - New: Preview card.
  - New: WideArticlePreview card.
  - New: Add `items`, `secondary_items` and `color` to header.
  - New: Add `items` to footer.
  - New: Add `image`, `persona`, `secondary_items` and `color` to navigation.
  - New: More official themes.
  - New: Add `value` to facepile component.
  - New: Add `popup` to dropdown component.
  - New: Add `trigger` to combobox component.
  - New: Add `inline` to choice group.
  - New: Add `blocking` to side panel.
  - New: Add `spellcheck` to textbox.
  - New: Add `height` to profile card.
  - Docs: New widgets section.
  - Docs: Color theming guide.
- Changed
  - **The Wave server is now included in the Python distribution.**
  - **Starting apps using `wave run` now automatically starts the Wave Server.**
  - Scrollbars now respect the active theme.
  - Tall and wide info cards now support markdown for the `caption` attribute.
  - Info cards are now clickable only when `name` attribute is not empty.
  - Improve Wave Tour app header by providing logo and important links.
- Fixed
  - Fix handling decimal point for `ui.spinbox` component.
  - Respect UTC time when selecting date via `ui.datepicker`.
  - Swatch color picker now shows selected color upon clicking correctly.
  - Fix incorrect links across API docs.

## v0.19.0

October 29, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.19.0)

- Added
  - Make examples in Tour searchable.
  - New: Copyable text component.
  - New: Add badges/tags to table rows.
  - New: Facepile component.
  - Apps now receive a system-wide `@system.logout` event when a user logs out.
  - Add custom HTTP response headers using `-http-headers-file`.
  - Performance: Wave daemon AOF logging is disabled if `-no-log` is set.
  - Performance: Wave daemon content store is disabled if `-no-store` is set.
  - Performance: Skip writes to content store for unicast apps.
  - Performance: Use LRU cache to speed up API authorization.
  - New: Compact version of file upload component.
  - New: Profile card for displaying user profiles.
  - New: Article card for long-form articles.
  - New: Tall article preview card.
  - New: Annotator component.
  - Add min/max date constraints to date picker component.
  - New: Tall info card.
  - Improve wide info card design.
  - New: Wide pie chart.
  - New: Wide plot card.
  - User defined themes.
  - Plots are now theme-able.
  - New: H2O Dark Theme.
  - Add more justification options to ui.inline().
- Changed
  - Dropdowns now display a dialog with filtering for 100+ choices.
- Fixed
  - Respect `H2O_WAVE_APP_ADDRESS` in Wave CLI.
  - Expand spinbox input to available space when tooltip is specified.
  - Fix Neon theme disabled state colors.
  - Adjust selected rect stroke on plots.
  - Adjust plot text color for upgraded G2.
  - Adjust Hover color contrast on stat table.
  - Fix url in graphics example.
  - Fix plot regressions caused by G2 upgrade.

## v0.18.0

September 18, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.18.0)

- Added
  - Persona component.
  - Add support for streaming/multipart endpoints.
  - Read command line args from env if available.
  - Allow public/private directories to be hosted by the Wave daemon.
  - Side panel component.
  - Custom inline / external CSS support.
  - Allow controlling width of form items.
  - Icon button component.
  - Allow submitting text phrases within markdown.
  - Allow using markdown / HTML within message bar.
  - Add inline prop to checklist component.
  - Add trigger attribute for spinbox component.
  - OIDC: Update default scopes and add `-oidc-scopes` command line argument.
- Changed
  - Sort table group titles by default when grouped.
  - Range slider replaced with native Fluent component.
  - Report HTTP error 413 instead of 500 if request is too large.
  - Disable async function validation (failed under Cython).
- Fixed
  - Submit range slider values on releasing mouse.
  - Datepicker color contrast for date selection.
  - Unify ui.picker label with th rest of the form components, add 'required' prop to picker.
  - Expander ignoring expanded attr on initial render.
  - Prevent floating-point precision display in spinbox.
  - Redirect only once, not on every render.
  - Stretch slider for available space within `ui.inline` and `ui.section`.
  - Update form items client side if possible instead of recreate on data change.
  - Meta redirect for Firefox.
  - Set location hash when script events are triggered.
  - Download files in new tab to prevent FF dropping WS connection.
  - Increase tab card min height to prevent overflow.
  - Safari title overflow in grey dashboard.
  - Ensure that first column in tables functions properly when non-text.

## v0.17.0

June 30, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.17.0)

- Added
  - The location hash (`q.args['#']`) is now always available, regardless of whether it has changed.
  - `@on()` annotations now support handling events.
  - `@on()` handlers can now have 0-n formal parameters, and are supplied arguments accordingly.
  - `ui.inline_script()` can use CSS selectors (e.g. `#foo`, `.foo`, `table > td.foo`) as targets.

## v0.16.0

May 24, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.16.0)

- Added
  - *New* Ability to load and execute third party Javascript libraries at runtime.
  - WaveDB: Add `-benchmark` command line flag for running benchmarks.
  - WaveDB: Add example for database-backed to-do list app.
  - WaveML: Add several examples demonstrating configuring, building, saving models, including hyperparameter tuning and SHAP.
- Changed
  - Upgrade Cypress (test framework) to 7.2.0.
  - Make (anon) subject ID and username available in development mode.
  - Closable dialogs now emit a `dismissed` event when closed.
- Fixed
  - WaveDB: Return empty array instead of `None` if resultset is empty.

## v0.15.0

May 7, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.15.0)

- Added
  - *New:* WaveDB: a companion database to Wave apps, based on SQLite 3.
  - More routing power: Match multiple routing conditions using `@on` predicates.
  - New card: `ui.wide_info_card()`.
  - New component: `ui.image()`, similar in behavior to the image card.
- Changed
  - The Wave Tour now uses a responsive layout.
  - Display underlying error in the file upload component on failures.
  - Set a default label for the upload button in the file upload component.
- Fixed
  - Submit toolbar command value when clicked, if available.
  - Make Wave Tour work when server and tour are launched on separate machines / docker containers.
  - Fix Card/component deserialization (`Card.load()`).
  - Use latest static assets in front-end when the server is upgraded.

## v0.14.1

Apr 29, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.14.1)

- Fixed
  - Allow file uploads if auth is disabled (assume development mode).

## v0.14.0

Apr 28, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.14.0)

- Added
  - *New:* The Wave server now provides command line utilities for managing access key/secret pairs (see Security docs).
  - Python app servers only process requests originating from the Wave server.
  - Add `-max-request-size` to control maximum allowed HTTP request size.
  - Add `-max-cache-request-size` to control maximum allowed cache request size.
  - Add `-max-proxy-request-size` to control maximum allowed proxy request size.
  - Add `-max-proxy-response-size` to control maximum allowed proxy response size.
  - Add tutorial on local development using OIDC / Keycloak.
  - Allow skipping OIDC login if required when `-oidc-skip-login` is set.
  - Add version/author dunders to Python module.
  - Set `id_token_hint` for OIDC using Okta during logout.
- Changed
  - Buttons are not special-cased / displayed in a dialog's footer anymore.
  - Don't automatically zoom into plots on mouse scroll.
  - The defauult (development-time) user name/subject are now `anonymous`/`anonymous`.
  - Login/logout endpoints are now `_auth/login` and `_auth/logout` instead of `_login` and `_logout`.
  - File uploads from UI are disabled if auth is not enabled.
  - Proxy is enabled only if `-proxy` is set.
  - IDE (experimental/in-progress) is enabled only if `-ide` is set.
  - Browser-browser communication is enabled only if `-editable` (experimental) is set.
  - All open browser tabs redirect to login when a user logs out of any tab.
  - Wave docs are now hosted at <https://wave.h2o.ai/>
- Fixed
  - All known security issues fixed/closed.
  - Display overflow menu in table footer only when space-constrained.
  - Trigger plot events only if marks are selected.
  - Submit a toolbar command's value instead of `True`, if available.
  - Refresh OIDC access token during WS communication if expired.
  - Use unique OIDC subject ID instead of preferred-username for sync'ing UIs.

## v0.13.0

Mar 5, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.13.0)

- Added
  - *New:* Start the server with `-editable` to allow visitors to edit pages - turns the Wave server into a realtime collaborative wiki.
  - *New:* Add a whiteboard (`ui.canvas_card()`) to a page to enable collaborative drawing between the page's visitors.
  - *New:* Add a chat room (`ui.chat_card()`) to a page to enable discussions between the page's visitors.
  - Checkpointing: Save and restore application and session state on restart.
- Changed
  - Display Wave logo on empty pages instead of spinner.
  - Reduce size of h2o_wave wheel file.
- Fixed
  - Display scrollbars if content overflows in flex layout.
  - Fix flex layout viz rendering issues in Safari.
  - Fix form layout issues in Safari.
  - Improve tab_card example.
  - Improve visual design of footer in uitable.
  - Invalidate page when layouts or a card's box is changed.
  - Make stats cards not overflow 1-unit high zones.
  - Prevent iframes from overlapping other elements in forms.
  - Remove hard-coded "main" default zone in flex layouts.
  
## v0.12.1

Feb 12, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.12.1)

- Fixed
  - Fix `ui.frame()` overlapping other components inside a form card.
  - Fix form card component layout issues in Safari.
  - Improve layout of stats cards when 1-unit high.

## v0.12.0

Feb 3, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.12.0)

- Added
  - Add `on` and `handle_on` APIs for query-handling and routing.
  - Add support for usage tracking via Google Analytics.
  - Use `H2O_WAVE_APP_MODE` environment variable to determine app sync behavior (as an alternative to `@app(mode=...)`).
  - Add experimental support for switching theme to a dark-mode "neon" theme.
- Changed
  - Stricter type validation for ui.* API parameters.
  - Stricter validation for non-empty strings when required (name of components, etc.)
- Fixed
  - Center breadcrumbs vertically in alloted space.
  - Fix breakages in Cypress test runner.
  - Fix `ui.frame()` sizing in Safari.
  - Fix rendering in Safari for cards that display circular progress bars.
  - Allow special characters in column names while using template strings for `ui.plot()`.

## v0.11.0

Jan 15, 2021 - [Download](https://github.com/h2oai/wave/releases/tag/v0.11.0)

- Added
  - Make all cards render responsively in both grid and flex layouts.
  - Add demo application that showcases various dashboards using flexible/responsive layouts.
  - Add `ui.stats()` and `ui.stat()` for displaying metrics inline in forms.
  - Add `ui.section_card()` to demarcate sections on a page, with optional nested components.
  - Add `ui.stat_list_card()` to display lists of metrics, with optional icons and links.
  - Add `ui.stat_table_card()` to display tables of metrics, with optional icons and links.
  - Add `ui.inline()` to nest and display components horizontally inside a form.
  - Add `ui.footer_card()` to display footers at the bottom of pages.
  - Allow form cards to have titles.
  - Allow disabling nav items.
  - Add support for color variable in plot color ranges.
  - Add support for color variable in plot shape/text fills and strokes.
  - Allow tabs inside forms to trigger hash change navigation.
  - Allow a tab card's selected tab to be accessed using the card's name.
  - Publish `h2o-wave` package to Conda.
  - Example for displaying background task completion using a progress bar.
  - Example for displaying Pandas frames as markdown tables.
  - Example for plotting Pandas frames.
  - OIDC refresh token is now accessible in the Python client.
  - Make documentation searchable.
  - Add table of contents for all Wave examples.
  - Add tags to all examples; show tag on an index page.
- Changed
  - Stats cards now dynamically resize to fit card size.
  - Picker now displays suggestion list in advance.
  - Center breadcrumbs vertically in flex layouts.
  - Plot cards now dynamically resize to fit.
  - Improve markdown rendering consistency across components.
  - Center tabs vertically when used in flex layouts.
  - Display tab cards without a background/padding.
  - Display toolbar cards without a background/padding.
  - Vega cards now dynamically resize to fit.
  - Improve spacing between components contained in an expander.
- Fixed
  - Fix Wave tour on Windows.
  - Fix responsive layout in Safari.
  - Fix bug where `--no-reload` of apps was using incorrect port.
  - Fix client-side warnings when using components nested recursively.
  - Close dialogs properly when the top X button is clicked.

## v0.10.0

Nov 29, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.10.0)

- Added
  - Add support for responsive layouts.
  - Add support for modal dialogs.
  - Add ability to handle events from UI (`q.events`).
  - Allow handling mark selection events on plots.
  - Allow apps to handle server startup/shutdown events via `on_startup` and `on_shutdown` hooks.
  - Allow color picker to submit values immediately when changed (`trigger` attribute).
  - Allow collapsing nav items during initialization.
  - Handle display and sorting of numeric and time valued columns in `ui.table()`.
  - Allow links/link-buttons to open links in new windows/tabs.
  - API now ships with enums for functions expecting predefined constants as parameters.
  - Read OIDC flags from env vars when available.
  - Automatically refresh OAuth2 access token in the background if expired.
  - Allow accessing OIDC access tokens in Python client.
  - Allow icons on navigation items.
  - Automatically transpose columns to rows in `data()` if not packed.
  - Allow adjust multiline textbox height.
  - Allow picker to submit values immediately when changed (`trigger` attribute).
  - Treat `wave run foo/bar/baz.py` as `wave run foo.bar.baz`.
  - Allow selecting nav links during initialization.

- Changed
  - Cards display a "raised" effect on mouse over; Header, tab, toolbar and navbar have alternate styles.
  - Display loading spinner automatically when a request is in flight.
  - Mark `ui.command(data=...)` as deprecated (use `ui.command(value=...)` instead, similar to `ui.button(...)`.)
  - Remove redundant `ui.*` API for discriminated unions (`ui.component()`, etc.),
  - Add column headers to CSVs downloaded from `ui.table()`; remove row names.
  - Change default Wave server port from 55555 to 10101 (55555 is special on OSX Big Sur).
  - Center image in image card and preserve aspect ratio.

- Fixed
  - Improve ability of `ui.frame()` and `ui.frame_card()` to handle large HTML content.
  - Fix tour on Windows.
  - Use ellipsis on long column labels in `ui.table()`.

## v0.9.1

Oct 28, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.9.1)

- Fixed
  - Make `wave run` behave identical to `python -m h2o_wave run`.

## v0.9.0

Oct 28, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.9.0)

- Added
  - ASGI compatibility: Wave apps can now be run using an ASGI server.
  - `@app` decorator to identify primary query handler in an app.
  - Live-reload for apps.
  - New `wave` CLI and `wave run` command.
  - `q.run()` and `q.exec()` APIs for running background tasks.
  - Display server version/build at startup.
  - `AsyncSite` for updating other pages from an app without blocking the main thread.
  - Drop or clear pages from a site using `del site[route]`.
- Changed
  - All HTTP calls now use non-blocking asyncio using the `httpx` library.
  - `listen()` is deprecated.
  - `H2O_WAVE_INTERNAL_ADDRESS` and `H2O_WAVE_EXTERNAL_ADDRESS` are deprecated.
  - An app's UI is now cleared when an app crashes or is terminated.
  - All examples migrated to use `@app` instead of `listen()`.
  - Server binary renamed to `waved` (as in `wave` daemon).
  - Apps using `@app` must be run using `wave run`.
- Fixed
  - Performance and concurrency improvements across the board.
  - Stability improvements to the Wave Tour.

## v0.8.1

Oct 26, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.8.1)

- Fixed
  - Enable `visible` properly on `text_*` components.
  - Fix checkbox value unchecking.
  - Improve stepper component layout.

## v0.8.0

Oct 20, 2020 - [Download](https://github.com/h2oai/wave/releases/tag/v0.8.0)

- Added
  - Escape Cypress test functions using leading underscore `_` if they overlap with Python reserved keywords.
  - Add data-test attribute to all form components for browser testing.
  - Add `trigger` property to the date picker component.
  - Allow pre-selecting rows in the table component.
  - Add `visible` property to all components to show/hide them on demand.
  - Add support for OpenID Connect (OIDC).
  - Add documentation on security.
- Fixed
  - Default HTML page title set to *Wave*.
  - Make % heights work properly for frames inside forms.

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
