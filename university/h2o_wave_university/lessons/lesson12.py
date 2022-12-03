# Lesson 12: Theming
# # Add some nice colors!
# Although we think Wave looks good, it may not suit everybody's taste so we introduced a mechanism to
# change your app colors in a simple yet powerful way.
# 
# You can either pick one of our [predefined themes](https://wave.h2o.ai/docs/color-theming) or
# [create a new one](https://wave.h2o.ai/docs/color-theming#custom-user-defined-themes) by picking a few main colors.
# 
# The theme is configured in "meta_card", that we introduced in [lesson3](#lesson3).
# 
# See [docs](https://wave.h2o.ai/docs/arguments) for more info.
# ## Your task
# Try changing the theme.
# ---
from h2o_wave import main, app, Q, ui


@app('/demo')
async def serve(q: Q):
    q.page['meta'] = ui.meta_card(box='', theme='h2o-dark')
    q.page['hello'] = ui.markdown_card(box='1 1 3 1', title='Markdown card', content='Hello World!')
    await q.page.save()
