import React from 'react'
import DocViewer from '../../../libs/doc-viewer'
import Tree from '../../../components/tree'
const prefix = 'tree-multiple'
const desc = '用于一次性选中同级多个节点或全选同级节点，可与其它组件搭配使用'
const code = `import React from 'react'
import Tree from '@hi-ui/hiui/es/tree'\n
class Demo extends React.Component {
  constructor(props) {
    super(props)
    this.treeData = [
      { id: 1, title: '小米人',
        children: [
          { id: 2, title: '技术',
            children: [
              { id: 3, title: '后端',disabled:true },
              { id: 4, title: '运维' },
              { id: 5, title: '前端' }
            ]
          },
          { id: 6, title: '产品' }
        ]
      },
      { id: 11, title: '小米2',
        children: [
          { id: 22, title: '技术2', expand: true,
            children: [
              { id: 33, title: '后端2' },
              { id: 44, title: '运维2' },
              { id: 55, title: '前端2' }
            ]
          },
          { id: 66, title: '产品2' }
        ]
      },
    ]
    this.state = {
      checkedKeys: [5]
    }
  }

  render() {
    return (
      <div style={{width:300}}>
        <Tree
          checkable
          editable={true}
          data={this.treeData}
          checkedIds={this.state.checkedKeys}
          onChange={(checkedKeys, title, bool, semi) => {
            console.log('Tree data:', checkedKeys, title, bool ,semi)
            this.setState({
              checkedKeys
            })
          }}
          highlightable
          onClick={data=>{console.log('tree node click',data)}}
        />
      </div>
    )
  }
}`

const DemoMultiple = () => <DocViewer desc={desc} code={code} scope={{ Tree }} prefix={prefix} />
export default DemoMultiple
