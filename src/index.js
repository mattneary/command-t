import {Component} from 'react'
import {render} from 'react-dom'
import Results from './components/Results'

import cs from './styles.css'

class App extends Component {
  render () {
    return <Results />
  }
}

render(<App/>, document.getElementById('app'))
