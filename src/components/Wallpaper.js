import {pick} from 'lodash/fp'
import {Component} from 'react'
import cx from 'classnames'

const RECT = ['top', 'left', 'height', 'width']

class Wallpaper extends Component {
  componentWillMount() {
    const img = new Image()
    img.addEventListener('load', () => {
      this.drawRect(img)
    })
    img.src = 'sierra.jpg'
  }

  drawRect = img => {
    if (this._ctx) {
      const screenToWallpaper = (x, y) => [
          x / screen.width * 5120,
          y / screen.height * 2880,
      ]
      const s = [
        ...screenToWallpaper(screenX + (outerWidth - innerWidth), screenY + (outerHeight - innerHeight)),
        ...screenToWallpaper(
          innerWidth,
          innerHeight,
        ),
      ]
      this._ctx.drawImage(img, ...s, 0, 0, 5120, 2880)
    }
    requestAnimationFrame(() => this.drawRect(img))
  }

  getContext = cvs => {
    if (!cvs) return
    this._ctx = cvs.getContext('2d')
  }

  render() {
    return (
      <canvas
        ref={this.getContext}
        id='background'
        width='5120px'
        height='2880px'
      />
    )
  }
}

export default Wallpaper
