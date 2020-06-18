import React, { Component, cloneElement } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Icon from '../icon'
import Tooltip from '../tooltip'
import ItemDropdown from './ItemDropdown'
import Provider from '../context'
const noop = () => { }

class Tabs extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['desc', 'card', 'button', 'editable']),
    placement: PropTypes.oneOf(['horizontal', 'vertical']),
    activeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultActiveId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.number,
    editable: PropTypes.bool,
    className: PropTypes.string,
    renderTabBar: PropTypes.func,
    onTabClick: PropTypes.func,
    onEdit: PropTypes.func,
    draggable: PropTypes.bool
  }

  static defaultProps = {
    prefixCls: 'hi-tabs',
    type: 'card',
    placement: 'horizontal',
    className: '',
    max: 6,
    editable: true,
    onTabClick: noop,
    onEdit: noop,
    draggable: false
  }

  deletetabId = null

  constructor (props) {
    super(props)

    const { defaultActiveId, activeId } = props
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(this.props)

    this.state = {
      activeId: activeId !== undefined ? activeId : (defaultActiveId || (showTabItems && showTabItems[0] && showTabItems[0].tabId)),
      showTabItems,
      hiddenTabItems,
      defaultActiveId,
      dragged: null
    }
  }

  componentWillReceiveProps (nextProps) {
    const {
      showTabItems,
      hiddenTabItems
    } = this.getTabItems(nextProps)
    this.setState({
      showTabItems,
      hiddenTabItems
    })
    if (this.props.activeId !== nextProps.activeId) {
      this.setState({
        activeId: nextProps.activeId
      })
    }
    // 考虑 tab 删完又新增一个的情况
    if (this.props.children.length === 0 && nextProps.children.length > 0) {
      this.setState({ activeId: nextProps.children[0] && nextProps.children[0].props.tabId })
    }

    if (this.props.children.length > nextProps.children.length && this.deletetabId && this.deletetabId === this.state.activeId) { // 删除的是当前激活的tab，需重置激活tab
      this.setState({
        activeId: (nextProps.children[0] && nextProps.children[0].props.tabId) || undefined
      }, () => {
        this.deletetabId = null
      })
    }
  }

  getTabItems (props) {
    const {
      children,
      type,
      placement,
      max
    } = props
    const showTabItems = []
    const hiddenTabItems = []

    React.Children.map(children, (child, index) => {
      console.log(type)

      if (child) {
        const { tabTitle, tabId, tabDesc, disabled, closeable } = child.props
        const item = { tabTitle, tabId, tabDesc, disabled, closeable }

        if (type === 'card' && placement === 'horizontal' && showTabItems.length >= max) { // 卡片式标签超过max时，其余标签的隐藏
          hiddenTabItems.push(item)
        } else {
          showTabItems.push(item)
        }
      }
    })
    return { showTabItems, hiddenTabItems }
  }

  handleClick (tab, e) {
    if (tab.disabled) {
      return false
    }

    const { onTabClick } = this.props

    onTabClick(tab.tabId, e)
    const activeId = this.props.activeId
    activeId !== undefined || this.setState({
      activeId: tab.tabId
    })
  }

  addTab () {
    const {
      onEdit,
      editable,
      children
    } = this.props

    if (editable) {
      onEdit('add', (children.length + 1))
    }
  }

  deleteTab (e, tabId, index) {
    e.stopPropagation()
    this.deletetabId = tabId

    const {
      onEdit,
      editable
    } = this.props

    if (editable) {
      onEdit('delete', index, tabId)
    }
  }

  checkEditable () {
    const {
      editable,
      type
    } = this.props

    return editable && type === 'editable'
  }

  renderTabContent (child) {
    const { tabId } = child.props
    const { activeId } = this.state

    return cloneElement(child, {
      show: tabId === activeId
    })
  }
  dragStart (e) {
    this.setState({
      dragged: e.currentTarget
    })
  }
  dragEnd (e) {
    if (!this.over) {
      return
    }
    const { type, placement } = this.props
    this.state.dragged.style.display = type === 'desc' ? 'flex' : 'block'
    if (placement === 'horizontal') {
      e.target.classList.remove('drag-left')
      this.over.classList.remove('drag-left')

      e.target.classList.remove('drag-right')
      this.over.classList.remove('drag-right')
    } else {
      e.target.classList.remove('drag-up')
      this.over.classList.remove('drag-up')

      e.target.classList.remove('drag-down')
      this.over.classList.remove('drag-down')
    }

    var data = this.state.showTabItems
    var from = Number(this.state.dragged.dataset.id)

    var to = Number(this.over.dataset.id)
    console.log(from, to)
    data.splice(to, 0, data.splice(from, 1)[0])

    data = data.map((doc, index) => {
      doc.newIndex = index + 1
      return doc
    })

    this.setState({ data: data })
  }

  dragOver (e) {
    e.preventDefault()
    this.state.dragged.style.display = 'none'
    const { placement } = this.props
    if (e.target.tagName === 'DIV' && e.target.classList.contains('hi-tabs__item')) {
      const dgIndex = JSON.parse(this.state.dragged.dataset.item).newIndex
      const taIndex = JSON.parse(e.target.dataset.item).newIndex

      if (dgIndex === undefined && taIndex === undefined) {
        return
      }
      let animateName

      if (placement === 'horizontal') {
        animateName = dgIndex > taIndex ? 'drag-left' : 'drag-right'
      } else {
        animateName = dgIndex > taIndex ? 'drag-up' : 'drag-down'
      }

      if (this.over && e.target.dataset.item !== this.over.dataset.item) {
        this.over.classList.remove('drag-up', 'drag-down', 'drag-right', 'drag-left')
      }

      if (!e.target.classList.contains(animateName)) {
        e.target.classList.add(animateName)
        this.over = e.target
      }
    }
  }
  render () {
    const { activeId, showTabItems, hiddenTabItems, defaultActiveId } = this.state
    const { prefixCls, type, placement, children, className, theme, draggable } = this.props
    const editable = this.checkEditable()
    const tabsClasses = classNames(prefixCls, className, `${prefixCls}--${type}`, `theme__${theme}`, {
      [`${prefixCls}--${placement}`]: type === 'card'
    })
    let activeTabInHiddenItems = true

    return (
      <div className={tabsClasses}>
        <div className={`${prefixCls}__header`}>
          <div className={`${prefixCls}__nav contain`} onDragOver={(e) => this.dragOver(e)}>
            {showTabItems.map((item, index) => {
              const { tabTitle, tabId, tabDesc, disabled, closeable } = item
              const itemClasses = classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: tabId === activeId,
                [`${prefixCls}__item--disabled`]: disabled
              })

              activeTabInHiddenItems = activeTabInHiddenItems && tabId !== activeId
              const Tag = type === 'editable' && tabId !== activeId ? Tooltip : 'div'
              return <div data-id={index}
                key={`${prefixCls}__item-${index}`}
                onClick={e => this.handleClick(item, e)}
                className={itemClasses}
                draggable={draggable}
                data-item={JSON.stringify({ ...item, newIndex: index })}
                onDragEnd={(e) => this.dragEnd(e)}
                onDragStart={(e) => this.dragStart(e)}>

                <Tag title={tabTitle} key={`${prefixCls}__item-${index}`}>
                  <span className={`${prefixCls}__item-name`}>{tabTitle}</span>
                  {
                    type === 'desc' &&
                    <span className={`${prefixCls}__item-desc`}>{tabDesc}</span>
                  }
                  {
                    editable && closeable &&
                    <span className={`${prefixCls}__item-close`}>
                      <Icon onClick={e => this.deleteTab(e, tabId, index)} name='close' />
                    </span>
                  }
                </Tag>
              </div>
            })}
            {
              hiddenTabItems.length > 0 &&
              <div className={classNames(`${prefixCls}__item`, {
                [`${prefixCls}__item--active`]: activeTabInHiddenItems
              })}
              >
                <ItemDropdown
                  active={activeTabInHiddenItems}
                  activeId={activeId}
                  theme={theme}
                  defaultActiveId={defaultActiveId}
                  items={hiddenTabItems}
                  onChoose={(item, e) => {
                    this.handleClick(item, e)
                  }}
                />
              </div>
            }
          </div>
          {
            editable &&
            <div className={`${prefixCls}__add`}>
              <Icon onClick={this.addTab.bind(this)} name='plus' />
            </div>
          }
        </div>
        <div className={`${prefixCls}__content`}>
          {React.Children.map(children, item => {
            return item && this.renderTabContent(item)
          })}
        </div>
      </div>
    )
  }
}

export default Provider(Tabs)
