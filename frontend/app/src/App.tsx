/* eslint no-unused-expressions: "off" */
import React from 'react';
import { Input, TreeSelect, Table, Alert, TreeSelectProps } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';
import type { ColumnsType } from 'antd/lib/table';

//import './App.css';

interface TableDataType {
  key: React.Key;
  title: string;
  keyword: string;
  ACM_keyword: string;
  doi: string;
  topN: string;
}

interface TreeDataType {
  id: string,
  pId: string,
  value: string,
  title: string,
  isLeaf: boolean
}

const columns: ColumnsType<TableDataType> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "doi",
    filtered: true,
    render: (text, record) => {
      return <a href={record.doi}>{text}</a>
    }
  },
  {
    title: "Keywords",
    dataIndex: "keyword",
    filtered: true,
  },
  {
    title: "ACM Keyword",
    dataIndex: "ACM_keyword",
  },
  {
    title: "Top N",
    dataIndex: "topN",
  }
]

function App() {
  const { Search } = Input
  const [value, setValue] = React.useState();
  const [treeData, setTreeData] = React.useState<TreeDataType[]>([]);
  const [bibtexUrl, setBibtexUrl] = React.useState<string>();
  const [tableData, setTableData] = React.useState<TableDataType[]>([]);
  const [treeExpandedKeys, setTreeExpandedKeys] = React.useState<React.Key[]>([]);

  React.useEffect(() => {
    Axios.get("http://localhost:5000/getRoot").then((res) => {
      const response = res.data;
      let ret: TreeDataType[] = [];
      response.forEach((element: any) => {
        ret.push(
          {
            id: Object.keys(element)[0],
            pId: "0",
            value: Object.keys(element)[0],
            title: element[Object.keys(element)[0]],
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
    setBibtexUrl(value);
  };

  const getChildrenNodes = async (parent: string) => {
    let ret: TreeDataType[] = [];
    await Axios.post("http://localhost:5000/getChildren", { parent: parent }).then((res) => {
      const response = res.data;
      response.forEach((element: any) => {
        ret.push(
          {
            id: Object.keys(element)[0],
            pId: parent,
            value: Object.keys(element)[0],
            title: element[Object.keys(element)[0]],
            isLeaf: false
          }
        )
      });
    }).catch((err) => {
      alert(err);
    });
    return ret;
  };

  const onLoadData: any = (treeExpandedKeysValue: any) =>
    new Promise(resolve => {
      setTimeout( async () => {
        console.log(treeExpandedKeysValue);
        const id = treeExpandedKeysValue[treeExpandedKeysValue.length - 1];
        console.log(id);
        setTreeExpandedKeys(treeExpandedKeysValue);
        let children: TreeDataType[] = [];
        await getChildrenNodes(id).then(value => children = value);
        console.log(children)
        // 展開しようとして葉っぱだったときの処理．葉っぱのノードのisLeadをtrueに変える．
        if (children.length === 0) {
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
      }, 300);
    });

  const getKeywords = async (value: string) => {
    let ret: Object[] = [];
    await Axios.post("http://localhost:5000/getKeywords", { value: value, url: bibtexUrl }).then((res) => {
      const response = res.data;
      ret = response;
    }).catch((err) => {
      alert(err);
    });
    return ret;
  }

  const onChange = (newValue: any) => {
    let response: Object[] = [];
    setTimeout( async () => {
      await getKeywords(newValue).then(value => response = value);
      let table: TableDataType[] = [];
      response.forEach((element: any) => {
        table.push(
          {
            key: element.paper + element.keyword,
            title: element.title,
            keyword: element.keyword,
            ACM_keyword: treeData.find((element: any) => element.id == newValue)!.title,
            doi: element.paper,
            topN: element.topN.split('#')[1],
          }
        )
      });
      setTableData(table);
    }, 300);
    setValue(newValue);
  };

  return (
    <div className="App" style={{ margin: 100, width: 800 }}>
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
            maxHeight: 500,
            overflow: 'auto',
          }}
          placeholder="Please select"
          onChange={onChange}
//          loadData={onLoadData}
//          onTreeLoad={onLoadData}
          treeExpandedKeys={treeExpandedKeys}
          onTreeExpand={onLoadData}
          treeData={treeData}
        />
        {tableData.length > 0 ?
          <Table
            columns={columns}
            dataSource={tableData}
          /> :
          <Alert message="表示するデータがありません😫" />
        }
      </header>
    </div>
  );
}

export default App;
