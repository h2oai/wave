# Meta / Script
# Load external Javascript libraries.
# ---

from h2o_wave import site, ui

# This example displays animated text using using anime.js (https://animejs.com/).
# Original example by Tobias Ahlin https://tobiasahlin.com/moving-letters/#2

page = site['/demo']

html = '''
<style>
.anim {
  font-weight: 900;
  font-size: 3.5em;
  color: #e8500d;
}
.anim .letter {
  display: inline-block;
  line-height: 1em;
}
</style>

<h1 id="animation" class="anim">Moving Letters!</h1>
'''

script = '''
// Wrap every letter in a span
var textWrapper = document.querySelector('.anim');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.anim .letter',
    scale: [4,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 950,
    delay: (el, i) => 70*i
  }).add({
    targets: '.anim',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });
'''

# Add a placeholder for the animation.
page['example'] = ui.markup_card(
    box='1 1 10 8',
    title='Animation',
    content=html,
)

# Add the script to the page.
page['meta'] = ui.meta_card(
    box='',
    # Load anime.js
    scripts=[ui.script(path='https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js')],
    script=ui.inline_script(
        # The Javascript code for this script.
        content=script,
        # Execute this script only if the 'anime' library is available.
        requires=['anime'],
        # Execute this script only if the 'animation' element is available.
        targets=['animation'],
    ))

page.save()
