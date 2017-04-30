import {Component} from 'react'
import cx from 'classnames'

class Result extends Component {
  render() {
    const {title, url, match} = this.props.tab
    const prefix = url.indexOf('//') === -1 ? 0 : url.indexOf('//') + 2
    const [domain, ...path] = url.substr(prefix).split('/').filter(x => x)
    return (
      <li
        className={cx('result', this.props.active && 'active')}
        onClick={this.props.onClick}
      >
        <span className='title'>{title}</span>
        <span className='domain'>{domain}</span>
        <div className='path-parts'>
          {path.map((p, i) =>
            <span key={i} className='path'>{p}</span>
          )}
        </div>
      </li>
    )
  }
}

export default Result
