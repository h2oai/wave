# Final lesson: Make
# # Next steps
# The best way to learn is by doing. Once you have an idea of the app
# you would like to build, start and refer our [docs](https://wave.h2o.ai/) along the way.
# 
# If you get stuck, reach out at either [Discord](https://discord.com/invite/V8GZFAy3WM) or [Github Discussions](https://github.com/h2oai/wave/discussions).
# 
# Tip: If you want to make your Wave development experience smoother and give yourself a head start,
# we suggest using either our [VSCode extension](https://marketplace.visualstudio.com/items?itemName=h2oai.h2o-wave)
# or [Jetbrains plugin](https://plugins.jetbrains.com/plugin/18530-h2o-wave) depending on your preferred IDE.
# ---
from h2o_wave import site, ui

page = site['/demo']

page['hello'] = ui.markdown_card(
    box='1 1 2 2',
    title='Make',
    content='Ready, set, go!',
)

page.save()
