// THIS FILE IS GENERATED. DO NOT EDIT.

import { it, expect } from "./config"

it("should render hello_world correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#hello_world', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`hello_world-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render todo correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#todo', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`todo-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render wizard correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#wizard', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`wizard-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render issue_tracker correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#issue_tracker', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`issue_tracker-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render dashboard correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#dashboard', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`dashboard-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_small correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_small', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_small-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_large correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_large', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_large-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_wide_gauge correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_wide_gauge', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_wide_gauge-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_tall_gauge correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_tall_gauge', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_tall_gauge-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_wide_bar correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_wide_bar', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_wide_bar-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_large_bar correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_large_bar', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_large_bar-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_small_series_area correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_small_series_area', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_small_series_area-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_small_series_interval correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_small_series_interval', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_small_series_interval-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_wide_series_area correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_wide_series_area', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_wide_series_area-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_wide_series_interval correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_wide_series_interval', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_wide_series_interval-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_tall_series_area correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_tall_series_area', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_tall_series_area-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stat_tall_series_interval correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stat_tall_series_interval', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stat_tall_series_interval-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render layout correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#layout', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`layout-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render layout_size correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#layout_size', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`layout_size-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render layout_responsive correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#layout_responsive', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`layout_responsive-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render text correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#text', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`text-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render text_sizes correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#text_sizes', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`text_sizes-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render label correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#label', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`label-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render link correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#link', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`link-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render progress correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#progress', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`progress-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render progress_update correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#progress_update', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`progress_update-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render message_bar correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#message_bar', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`message_bar-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render textbox correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#textbox', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`textbox-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render textbox_trigger correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#textbox_trigger', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`textbox_trigger-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render button correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#button', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`button-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render buttons correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#buttons', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`buttons-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render checkbox correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#checkbox', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`checkbox-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render checklist correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#checklist', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`checklist-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render picker correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#picker', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`picker-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render picker_selection correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#picker_selection', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`picker_selection-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render dropdown correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#dropdown', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`dropdown-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render choice_group correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#choice_group', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`choice_group-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render combobox correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#combobox', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`combobox-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render toggle correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#toggle', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`toggle-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render spinbox correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#spinbox', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`spinbox-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render slider correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#slider', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`slider-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render range_slider correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#range_slider', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`range_slider-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render date_picker correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#date_picker', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`date_picker-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render date_picker_trigger correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#date_picker_trigger', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`date_picker_trigger-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render color_picker correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#color_picker', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`color_picker-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render swatch_picker correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#swatch_picker', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`swatch_picker-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render tabs correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#tabs', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`tabs-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render separator correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#separator', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`separator-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render file_upload correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#file_upload', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`file_upload-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form_frame correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form_frame', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form_frame-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form_frame_path correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form_frame_path', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form_frame_path-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form_menu correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form_menu', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form_menu-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form_template correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form_template', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form_template-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render form_markup correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#form_markup', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`form_markup-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render stepper correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#stepper', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`stepper-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_markdown correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_markdown', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_markdown-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_markdown_pandas correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_markdown_pandas', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_markdown_pandas-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_sort correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_sort', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_sort-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_search correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_search', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_search-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_filter correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_filter', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_filter-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_filter_backend correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_filter_backend', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_filter_backend-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_download correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_download', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_download-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_groupby correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_groupby', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_groupby-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render table_select correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#table_select', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`table_select-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render image correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#image', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`image-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render frame correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#frame', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`frame-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render frame_path correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#frame_path', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`frame_path-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render template correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#template', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`template-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render template_data correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#template_data', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`template_data-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render markdown correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#markdown', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`markdown-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render markdown_data correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#markdown_data', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`markdown_data-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render markup correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#markup', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`markup-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render nav correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#nav', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`nav-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render toolbar correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#toolbar', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`toolbar-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render tab correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#tab', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`tab-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render tab_link correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#tab_link', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`tab_link-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render tab_delete correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#tab_delete', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`tab_delete-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render breadcrumbs correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#breadcrumbs', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`breadcrumbs-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render header correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#header', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`header-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render hash_routing correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#hash_routing', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`hash_routing-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render toolbar_routing correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#toolbar_routing', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`toolbar_routing-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render tab_routing correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#tab_routing', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`tab_routing-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render card_menu correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#card_menu', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`card_menu-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_shapes correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_shapes', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_shapes-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_sizes correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_sizes', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_sizes-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_map correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_map', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_map-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_groups correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_groups', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_groups-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_annotation correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_annotation', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_annotation-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_point_custom correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_point_custom', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_point_custom-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_groups correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_groups', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_groups-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_groups_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_groups_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_groups_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_labels correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_labels', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_labels-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_range correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_range', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_range-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_range_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_range_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_range_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_stacked correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_stacked', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_stacked-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_stacked_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_stacked_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_stacked_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_stacked_grouped correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_stacked_grouped', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_stacked_grouped-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_stacked_grouped_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_stacked_grouped_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_stacked_grouped_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_polar correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_polar', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_polar-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_polar_stacked correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_polar_stacked', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_polar_stacked-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_theta correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_theta', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_theta-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_helix correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_helix', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_helix-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_annotation correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_annotation', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_annotation-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_interval_annotation_transpose correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_interval_annotation_transpose', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_interval_annotation_transpose-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_groups correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_groups', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_groups-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_smooth correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_smooth', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_smooth-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_step correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_step', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_step-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_step_after correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_step_after', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_step_after-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_step_before correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_step_before', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_step_before-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_labels correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_labels', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_labels-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_labels_stroked correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_labels_stroked', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_labels_stroked-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_labels_no_overlap correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_labels_no_overlap', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_labels_no_overlap-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_line_annotation correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_line_annotation', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_line_annotation-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_path correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_path', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_path-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_path_point correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_path_point', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_path_point-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_path_smooth correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_path_smooth', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_path_smooth-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_groups correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_groups', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_groups-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_negative correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_negative', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_negative-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_range correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_range', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_range-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_smooth correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_smooth', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_smooth-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_stacked correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_stacked', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_stacked-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_line correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_line', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_line-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_line_smooth correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_line_smooth', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_line_smooth-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_area_line_groups correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_area_line_groups', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_area_line_groups-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_polygon correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_polygon', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_polygon-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_histogram correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_histogram', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_histogram-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_axis_title correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_axis_title', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_axis_title-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_form correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_form', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_form-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_app correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_app', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_app-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_events correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_events', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_events-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_pandas correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_pandas', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_pandas-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_vegalite correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_vegalite', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_vegalite-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_vegalite_update correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_vegalite_update', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_vegalite_update-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_vegalite_form correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_vegalite_form', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_vegalite_form-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_altair correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_altair', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_altair-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_bokeh correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_bokeh', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_bokeh-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_matplotlib correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_matplotlib', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_matplotlib-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_plotly correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_plotly', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_plotly-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render plot_d3 correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#plot_d3', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`plot_d3-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render pixel_art correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#pixel_art', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`pixel_art-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render upload correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#upload', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`upload-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render upload_async correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#upload_async', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`upload_async-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render upload_ui correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#upload_ui', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`upload_ui-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render upload_download correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#upload_download', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`upload_download-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_dialog correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_dialog', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_dialog-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_title correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_title', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_title-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_icon correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_icon', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_icon-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_notification correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_notification', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_notification-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_refresh correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_refresh', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_refresh-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_redirect correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_redirect', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_redirect-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render meta_theme correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#meta_theme', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`meta_theme-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render counter_global correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#counter_global', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`counter_global-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render counter_broadcast correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#counter_broadcast', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`counter_broadcast-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render counter_multicast correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#counter_multicast', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`counter_multicast-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render counter_unicast correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#counter_unicast', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`counter_unicast-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render background correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#background', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`background-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render background_executor correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#background_executor', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`background_executor-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render background_progress correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#background_progress', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`background_progress-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render site_async correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#site_async', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`site_async-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_primitives correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_primitives', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_primitives-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_spline correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_spline', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_spline-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_clock correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_clock', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_clock-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_path correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_path', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_path-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_turtle correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_turtle', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_turtle-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render graphics_hilbert correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#graphics_hilbert', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`graphics_hilbert-${browserName}.png`, { threshold: 0.2 })
})
  
it("should render glider_gun correctly", async ({ page, browserName }) => {
  await page.goto('http://localhost:10101/tour#glider_gun', { waitUntil: 'networkidle' })
  // Wait till everything loads
  await new Promise((res) => setTimeout(() => res('Resolved'), 2000))
  const screenshot = await page.screenshot()
  expect(screenshot).toMatchSnapshot(`glider_gun-${browserName}.png`, { threshold: 0.2 })
})
  