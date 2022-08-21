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

  return tree;
}

function App() {
  return (
    <div className="App" style={{margin: 100}}>
      <header className="App-header">
        <Search placeholder="RDFファイルのURLを入力してください" enterButton="Load" onSearch={onLoad} />
        <br />
        <br />
        <Space direction="vertical" style={{textAlign: 'center'}}>
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
