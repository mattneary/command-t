import {withState} from 'recompose'
import {Component} from 'react'
import {render} from 'react-dom'
import Results from './components/Results'

import cs from './styles.css'

class View extends Component {
  render () {
    return <Results tabs={this.props.tabs} setTabs={this.props.setTabs}/>
  }
}
const App = withState('tabs', 'setTabs', [])(View)

render(<App/>, document.getElementById('app'))
