# Lesson 1: Hello World!
# # Welcome to H2O Wave!
# You have come to our interactive Wave University app (which is also built using Wave btw) that aims
# to equip you with the base concepts necessary for developing Wave apps/scripts.
# 
# The university is divided into a list of modules that you can access by clicking on a dropdown in the header.
# Throughout the university, you will find a series of lessons and small exercises for you to complete.
# You can navigate through them using **Previous** button to go to the previous lesson,
# **Next** to go to the next lesson.
# 
# These example programs demonstrate different aspects of Wave
# and are meant to be starting points for your own experimentation so do not hesitate to edit the code blocks and play around. The preview should reload automatically.
# ## More info
# We also encourage you to visit our [docs](https://wave.h2o.ai/) together with these lessons to get even deeper knowledge.
# ## Questions
# In case of any questions, you can reach us at either [Discord](https://discord.com/invite/V8GZFAy3WM) or [Github Discussions](https://github.com/h2oai/wave/discussions).
# ## Let's get started
# Our Hello World example is a simple [Wave script](https://wave.h2o.ai/docs/scripts) that renders a single card - Wave basic building block. The program consists of the following steps:
# * Import the necessary python modules.
# * Register a page at `/demo` path.
# * Render a markdown card.
# * Save the page - send our python UI changes to the server.
# ## Your Task
# Try changing the content and title attributes to something different and observe the changes!

# ---
# Import `Site` and the `ui` module from the `h2o_wave` package
from h2o_wave import site, ui

# Get the web page at route '/demo'.
# If you're running this example on your local machine,
# this page will refer to http://localhost:10101/demo.
page = site['/demo']

# Add a Markdown card named `hello` to the page.
page['hello'] = ui.markdown_card(
    box='1 1 2 2',
    title='Hello World!',
    content='And now for something completely different!',
)

# Finally, sync the page to send our changes to the server.
page.save()
