/* eslint no-unused-expressions: "off" */
import React from 'react';
import { Input, TreeSelect, Table } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';
import type { ColumnsType } from 'antd/lib/table';

//import './App.css';

interface TableDataType {
  key: React.Key;
  title: string;
  keyword: number;
  ACM_keyword: string;
  doi: string;
}

const columns: ColumnsType<TableDataType> = [
  {
    title: "Title",
    dataIndex: "title",
    filtered: true,
  },
  {
    title: "Keywords",
    dataIndex: "keyword",
    filtered: true,
  },
  {
    title: "ACM Keyword",
    dataIndex: "ACM_keyword",
  }
]

function App() {
  const { Search } = Input
  const [value, setValue] = React.useState();
  const [treeData, setTreeData] = React.useState<Object[]>([]);
  const [bibtexUrl, setBibtexUrl] = React.useState<string>();
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);

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
    // こっちをURL保持にとどめるか．先に処理出来るものは裏で処理したいのだけれど．．
    console.log(value);
    setBibtexUrl(value);
    // Axios.post("http://localhost:5000/onLoad", {
    //   url: value
    // }).then((res: any) => {
    //   //alert(res)
    // })
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
          const changedElement = { ...changingElement, isLeaf: true };
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

  const getKeywords = async (value: string) => {
    await Axios.post("http://localhost:5000/getKeywords", { value: value, url: bibtexUrl }).then((res) => {
      const response = res.data;
      console.log(response);

    }).catch((err) => {
      alert(err);
    });
  }

  const onChange = (newValue: any) => {
    // embeddingをもらって比較するのか？
    // いったんSPARQLだけにしましょう．->bibtexDataにもらっているのか．
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
        {tableData.length > 0 &&
          <Table
            columns={columns}
            dataSource={tableData}
          />
        }
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
