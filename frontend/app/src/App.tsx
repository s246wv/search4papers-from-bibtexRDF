import React from 'react';
import { Input, Space, TreeSelect } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

//import './App.css';



function App() {
  const { Search } = Input

  const onLoad = (value: string) => {
    console.log(value);
    Axios.post("http://localhost:5000/onLoad", {
      url: value
    }).then((res: any) => {
      //alert(res)
    })
  }

  const [value, setValue] = React.useState();
  const [treeData, setTreeData] = React.useState([
    {
      id: '1',
      pId: '0',
      value: '1',
      title: 'Expand to load',
    },
    {
      id: '2',
      pId: '0',
      value: '2',
      title: 'Expand to load',
    },
    {
      id: '3',
      pId: '0',
      value: '3',
      title: 'Tree Node',
      isLeaf: true,
    },
  ]);

  const genTreeNode = (parentId: any, isLeaf = false) => {
    const random = Math.random().toString(36).substring(2, 6);
    return {
      id: random,
      pId: parentId,
      value: random,
      title: isLeaf ? 'Tree Node' : 'Expand to load',
      isLeaf,
    };
  };

  const onLoadData = (id: any) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setTreeData(
          treeData.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]),
        );
        resolve(undefined);
      }, 300);
    });


  const onChange = (newValue: any) => {
    console.log(newValue);
    setValue(newValue);
  };
  return (
    <div className="App" style={{ margin: 100, width: 500 }}>
      <header className="App-header">
        <Search placeholder="RDFファイルのURLを入力してください" enterButton="Load" onSearch={onLoad} />
        <br />
        <br />
        <TreeSelect
          treeDataSimpleMode
          style={{
            width: '100%',
          }}
          value={value}
          dropdownStyle={{
            maxHeight: 400,
            overflow: 'auto',
          }}
          placeholder="Please select"
          onChange={onChange}
          loadData={onLoadData}
          treeData={treeData}
        />
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
