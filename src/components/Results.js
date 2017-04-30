import {compose, isEmpty, pull} from 'lodash/fp'
import {withState, withProps} from 'recompose'
import {Component} from 'react'
import cx from 'classnames'

import Result from './Result'

const KEYS = {
  38: 'UP',
  13: 'ENTER',
  40: 'DOWN',
  37: 'LEFT',
  37: 'RIGHT',
  8: 'BACKSPACE',
}

class Results extends Component {
  componentWillMount() {
    var bg = chrome.extension.getBackgroundPage()
    bg.getWindow(id => {
      if (!this.props.windowId) this.props.setWindowId(id)
    })
    bg.subscribe((windowId, tabs) => {
      if (windowId === this.props.windowId) this.props.setTabs(tabs)
    })

    document.addEventListener('keydown', this.onKey, false)
  }

  onKey = evt => {
    const cmd = evt.metaKey || evt.ctrlKey
    const {tabs, index} = this.props
    if (evt.keyCode in KEYS) {
      const key = KEYS[evt.keyCode]
      let met = true
      if (key === 'UP') this.props.setIndex(x => x - 1)
      else if (key === 'DOWN') this.props.setIndex(x => x + 1)
      else if (key === 'ENTER') this.selectTab(tabs[index], cmd)
      else if (cmd && key === 'BACKSPACE') this.closeTab(this.props.tabs[this.props.index])
      else met = false
      if (met) evt.preventDefault()
    }
  }

  closeTab = tab => {
    var bg = chrome.extension.getBackgroundPage()
    bg.closeTab(tab.id)
    this.props.setTabs(pull(tab))
  }

  selectTab = (tab, openInBackground) => {
    var bg = chrome.extension.getBackgroundPage()
    bg.setActive(tab.id)
    if (!openInBackground) window.close()
  }

  copyLinks = () => {
    var textField = document.createElement('textarea')
    textField.value = this.props.tabs.map(tab => tab.url).join('\n')
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  openLinks = links => {
    var bg = chrome.extension.getBackgroundPage()
    links.forEach(link => bg.openLink(link))
  }

  render() {
    return (
      <div id='container'>
        <div className='row'>
          <img src='icon.png' />
        </div>
        <div className='row'>
          <h1 tabIndex={-1} contentEditable>command-t</h1>
          <div className='info'>&#8984; + &#x232B; to delete</div>
          <div className='info'>&#x23CE; to open and exit</div>
          <div className='info'>&#8984; + &#x23CE; to open</div>
          <div className='link' onClick={() => this.copyLinks()}>
            {!isEmpty(this.props.tabs) &&
              <span>{`Copy Links (${this.props.tabs.length})`}</span>
            }
          </div>
        </div>
        <input
          tabIndex={0}
          id='search'
          placeholder='search or paste links'
          type='text'
          onChange={evt => {
            const query = evt.target.value
            if (query.match(/^[^:]+:\/\//)) {
              this.openLinks(query.split(/\s+/))
            } else {
              this.props.setQuery(evt.target.value)
            }
          }}
          ref={x => {this._search = x}}
        />
        <ul id='results'>
          {this.props.tabs.map((tab, i) =>
            <Result
              tab={tab}
              active={i === this.props.index}
              onClick={evt => {
                const cmd = evt.metaKey || evt.ctrlKey
                this.selectTab(this.props.tabs[i], cmd)
              }}
            />
          )}
        </ul>
      </div>
    )
  }
}

export default compose(
  withState('query', 'setQuery', ''),
  withState('index', 'setIndex', 0),
  withState('windowId', 'setWindowId', null),
  withProps(props => {
    const {query} = props
    const tabs = props.tabs.filter(tab => {
      if (query) {
        var escapeRgx = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        var regex = new RegExp(query.split('').map(escapeRgx).join('.*'), 'i')
        const titleMatch = tab.title.match(regex)
        const urlMatch = tab.url.match(regex)
        return titleMatch || urlMatch
      }
      return true
    })
    return {tabs}
  }),
)(Results)
