import {compose, isEmpty} from 'lodash/fp'
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
    bg.onTab(this.props.setTabs)

    document.addEventListener('keydown', this.onKey, false)
    document.addEventListener('click', () => {
      this._search && this._search.focus()
    }, false)
  }

  onKey = evt => {
    const cmd = evt.metaKey || evt.ctrlKey
    if (evt.keyCode in KEYS) {
      const key = KEYS[evt.keyCode]
      let met = true
      if (key === 'UP') this.props.setIndex(x => x - 1)
      else if (key === 'DOWN') this.props.setIndex(x => x + 1)
      else if (key === 'ENTER') this.selectTab(this.props.tabs[this.props.index])
      else if (cmd && key === 'BACKSPACE') this.closeTab(this.props.tabs[this.props.index])
      else met = false
      if (met) evt.preventDefault()
    }
  }

  closeTab = tab => {
    var bg = chrome.extension.getBackgroundPage()
    bg.closeTab(tab.id)
  }

  selectTab = tab => {
    var bg = chrome.extension.getBackgroundPage()
    bg.setActive(tab.id)
    window.close()
  }

  copyLinks = () => {
    var textField = document.createElement('textarea')
    textField.value = this.props.tabs.map(tab => tab.url).join('\n')
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
  }

  render() {
    return (
      <div id='container'>
        <div className='row'>
          <h1>command-t</h1>
          <div className='link' onClick={() => this.copyLinks()}>
            {!isEmpty(this.props.tabs) &&
              <span>{`Copy Links (${this.props.tabs.length})`}</span>
            }
          </div>
        </div>
        <input
          id='search'
          placeholder='search'
          type='text'
          onChange={evt => this.props.setQuery(evt.target.value)}
          ref={x => {this._search = x}}
        />
        <ul id='results'>
          {this.props.tabs.map((tab, i) =>
            <Result tab={tab} active={i === this.props.index} />
          )}
        </ul>
      </div>
    )
  }
}

export default compose(
  withState('tabs', 'setTabs', []),
  withState('query', 'setQuery', ''),
  withState('index', 'setIndex', 0),
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
