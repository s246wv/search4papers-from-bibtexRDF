import React from 'react';
import { Input, Space, TreeSelect } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

//import './App.css';

const { Search } = Input
const { TreeNode } = TreeSelect

const onLoad = (value: string) => {
  console.log(value);
  Axios.post("http://localhost:5000/onLoad", {
    url: value
  }).then((res: any) => {
    //alert(res)
  })
}

const loadTree = () => {
  let tree;
  let response;
  async () => {
    await Axios.get("http://localhost:5000/getTree").then((res: any) => {
      response = res.json();
    })
    function TreeNodeMaker(props: any) {
      return (
        <TreeNode value={props.parentValue} title={props.parentLabel}>
          {props.children}
        </TreeNode>
      )
    }
    function LeafNodeMaker(props: any) {
      return (
        <TreeNode value={props.childValue} title={props.childLabel} />
      )
    }
    /*ここでtreeを作ります */
    let leaves = [];
    
    for (let i = 0; i < response.length; i++) {
      /**
       * leafを先に見つけないといけないのかな．
       * leafからparentをたどっていく．(゜-゜)．元のresponseの形を変えたほうが良いなあ．
       * child valueをキーにして他の三つの情報を持たせると作りよいかしら．
       * rootからたどらないかんか．parentをキーにして情報をとってくるのか．
       * だめか．タグを閉じられない．．一筆書きをすればよいのか？？
       * jsonをtree構造で返すのか．．↓こんな感じ？
       * {rootvalue: {
       *    parentlabel: "fafdsa",
       *    childvalue: {
       *      parentlabel: "fdsaf",
       *      leafvalue: {
       *        parentvalue: "gagasdas"
       *      }
       *    }
       *    childvalue: {
       *      parentlabel: "fdsaf",
       *      leafvalue: {
       *        parentvalue: "gagasdas"
       *      }
       *  }
       * }
       */
    }
  }

  return tree;
}

function App() {
  return (
    <div className="App" style={{ margin: 100, width: 500 }}>
      <header className="App-header">
        <Search placeholder="RDFファイルのURLを入力してください" enterButton="Load" onSearch={onLoad} />
        <br />
        <br />
        <Space direction="vertical" style={{ textAlign: 'center' }}>
          <TreeSelect treeLine={true} style={{ width: 500 }}>
            <TreeNode value="parent 1" title="parent 1">
              <TreeNode value="parent 1-0" title="parent 1-0">
                <TreeNode value="leaf1" title="my leaf" />
                <TreeNode value="leaf2" title="your leaf" />
              </TreeNode>
              <TreeNode value="parent 1-1" title="parent 1-1">
                <TreeNode value="sss" title="sss" />
              </TreeNode>
            </TreeNode>
          </TreeSelect>
        </Space>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
