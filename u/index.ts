import { Card, connect, on, Page, WaveEventType, WaveMessageType } from 'h2o-wave'
import * as Handlebars from 'handlebars'

const
  dump = Handlebars.compile(`<pre>{{{state}}}</pre>`),
  init = () => {
    let
      _render = dump,
      _pause = false
    const
      root = document.getElementById('root'),
      state: { [name: string]: any } = {},
      stringify = (x: any) => ({ state: JSON.stringify(x, null, 2) }),
      render = () => {
        if (_pause) return
        if (root) root.innerHTML = _render(_render === dump ? stringify(state) : state)
      },
      handlePage = (page: Page) => {
        _pause = true
        page.list().forEach(card => {
          handleCard(card)
          on(card.changed, () => handleCard(card))
        })
        _pause = false
        render()
      },
      handleCard = (card: Card) => {
        if (card.name === '__meta__') {
          const template = card.state.template as string
          if (template) _render = Handlebars.compile(template)
        }
        state[card.name] = card.state
        render()
      }
    connect(e => {
      switch (e.t) {
        case WaveEventType.Data:
          const { page } = e
          handlePage(page)
          on(page.changed, () => handlePage(page))
          break
        case WaveEventType.Message:
          if (e.type === WaveMessageType.Err) {
            if (root) root.innerText = e.message === 'not_found' ? 'Page Not Found' : e.message
          }
          break
        case WaveEventType.Reset:
          window.location.reload()
          break
      }
    })
  }

document.addEventListener('DOMContentLoaded', init)
