import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TabPane extends Component {
  static defaultProps = {
    prefixCls: 'hi-tabs-legacy-pane',
    disabled: false,
    closeable: true
  }

  static propTypes = {
    tabName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tabDesc: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    tabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    closeable: PropTypes.bool,
    disabled: PropTypes.bool
  }

  render () {
    const { prefixCls, children, show } = this.props
    const style = show ? {} : { display: 'none' }

    return (
      <div className={`${prefixCls}`} style={style}>
        {children}
      </div>
    )
  }
}

export default TabPane
