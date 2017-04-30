import {compose} from 'lodash/fp'
import {withState} from 'recompose'
import {Component} from 'react'
import cx from 'classnames'

const KEYS = {
  38: 'UP',
  13: 'ENTER',
  40: 'DOWN',
  37: 'LEFT',
  37: 'RIGHT',
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
    if (evt.keyCode in KEYS) {
      const key = KEYS[evt.keyCode]
      if (key === 'UP') this.props.setIndex(x => x - 1)
      if (key === 'DOWN') this.props.setIndex(x => x + 1)
      if (key === 'ENTER') this.selectTabIndex(this.props.index)
      evt.preventDefault()
    }
  }

  selectTabIndex = index => {
    var bg = chrome.extension.getBackgroundPage()
    bg.setActive(index)
    window.close()
  }

  render() {
    const {query} = this.props
    const tabs = this.props.tabs.filter(tab => {
      if (query) {
        var escapeRgx = s => s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
        var regex = new RegExp(query.split('').map(escapeRgx).join('.*'), 'i')
        return tab.title.match(regex) || tab.url.match(regex)
      }
      return true
    })
    return (
      <div id='container'>
        <h1>command-t</h1>
        <input
          id='search'
          placeholder='search'
          type='text'
          onChange={evt => this.props.setQuery(evt.target.value)}
          ref={x => { this._search = x }}
        />
        <ul id='results'>
          {tabs.map((tab, i) =>
            <li key={i} className={cx('result', i === this.props.index && 'active')}>
              <span>{tab.title}</span>
            </li>
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
)(Results)
