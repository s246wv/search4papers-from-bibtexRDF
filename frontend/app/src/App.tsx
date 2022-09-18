import React from 'react';
import { Input, Space, TreeSelect, TreeSelectProps } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

//import './App.css';



function App() {
  const { Search } = Input
  const [value, setValue] = React.useState();
  const [treeData, setTreeData] = React.useState<Object[]>([]);

  React.useEffect(() => {
    Axios.get("http://localhost:5000/getRootNodes").then((res) => {
      const response = res.data;
      console.log(response);
      let ret: Object[] = [];
      response.forEach((element: any) => {
        ret.push(
          {
            id: Object.keys(element)[0],
            pId: "0",
            value: Object.keys(element)[0],
            title: Object.values(element)[0],
            isLeaf: false
          }
        )
      });
      setTreeData(ret);
      console.log(treeData);
    }).catch((err) => {
      alert(err)
    })
  }, []);

  const onLoad = (value: string) => {
    console.log(value);
    Axios.post("http://localhost:5000/onLoad", {
      url: value
    }).then((res: any) => {
      //alert(res)
    })
  }

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

  const onLoadData = ({ id }: any) =>
    new Promise((resolve) => {
      setTimeout(() => {
        setTreeData(
          treeData.concat([genTreeNode(id, false), genTreeNode(id, true), genTreeNode(id, true)]),
        );
        resolve(undefined);
        console.log(treeData)
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
            maxHeight: 1000,
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
