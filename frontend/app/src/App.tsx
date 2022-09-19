/* eslint no-unused-expressions: "off" */
import React from 'react';
import { Input, Space, TreeSelect, TreeSelectProps } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';

//import './App.css';



function App() {
  const { Search } = Input
  const [value, setValue] = React.useState();
  const [treeData, setTreeData] = React.useState<Object[]>([]);
  const [bibtexData, setBibtexData] = React.useState<Object[]>([]);

  React.useEffect(() => {
    Axios.get("http://localhost:5000/getRoot").then((res) => {
      const response = res.data;
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
    }).catch((err) => {
      alert(err);
    })
  }, []);

  const onLoad = (value: string) => {
    console.log(value);
    Axios.post("http://localhost:5000/onLoad", {
      url: value
    }).then((res: any) => {
      //alert(res)
    })
  };

  const getChildrenNodes = async (parent: string) => {
    let ret: Object[] = [];
    await Axios.post("http://localhost:5000/getChildren", { parent: parent }).then((res) => {
      const response = res.data;
      console.log(response);
      response.forEach((element: any) => {
        ret.push(
          {
            id: Object.keys(element)[0],
            pId: parent,
            value: Object.keys(element)[0],
            title: Object.values(element)[0],
            isLeaf: false
          }
        )
      });
    }).catch((err) => {
      alert(err);
    });
    console.log(ret);
    return ret;
  };

  const onLoadData = ({ id }: any) =>
    new Promise((resolve) => {
      console.log(id);
      setTimeout(async () => {
        let children: Object[] = [];
        await getChildrenNodes(id).then(value => children = value);
        // 展開しようとして葉っぱだったときの処理．葉っぱのノードのisLeadをtrueに変える．
        if (children.length == 0) {
          const remainedList = treeData.filter((element: any) => {
            return element.id !== id;
          });
          const changingElement = treeData.filter((element: any) => {
            return element.id === id;
          })[0];
          const changedElement = {...changingElement, isLeaf: true};
          // 並び順が変わってしまう．．
          setTreeData([...remainedList, changedElement]);
        // 展開して子があったときの処理．単にtreeDataに足す．
        } else {
          setTreeData(
            treeData.concat(children),
          );
        }
        resolve(undefined);
        console.log(treeData)
      }, 300);
    });


  const onChange = (newValue: any) => {
    // embeddingをもらって比較するのか？
    // いったんSPARQLだけにしましょう．
    // getKeywordsして，setする．setされてたらTreeSelectの下にTableを出して，getKeywordsの結果を表示する．
    console.log(newValue);
    console.log(treeData);
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
