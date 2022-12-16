/* eslint no-unused-expressions: "off" */
import React from 'react';
import { Input, TreeSelect, Table, Alert, Button, message, Upload } from 'antd';
import 'antd/dist/antd.css';
import Axios from 'axios';
import type { ColumnsType } from 'antd/lib/table';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';

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

  // 指定されたURLの中身を取得し，backendにpostする．
  const onLoad = (value: string) => {
    // setBibtexUrl(value);
    fetch(value).then(async (res) => {
      const text = await res.text();
      sendText(text);
    }).catch((err) => {
      console.log(err);
    })
  };

  // 指定されたファイルの中身を取得し，backendにpostする．ファイルアップロードを援用しているのでよろしくない．
  const props: UploadProps = {
    beforeUpload: (file) => {
      console.log(file);
      const allowedExtention = new RegExp('.(xml|ttl|trig)$');
      const isRDF = file.name.search(allowedExtention) !== -1;
      // const isRDF = (file.type === 'application/rdf+xml') || (file.type === 'application/trig') || (file.type === 'text/turtle');
      if (!isRDF) {
        message.error(`${file.name} is not a RDF file`);
      }
      return isRDF || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
    action: async (file) => {
      const contentText = await file.text();
      console.log(contentText);
      // send RDF as text and call dummy post method.
      sendText(contentText);
      return "dummyURL"
    }
  };

  // ファイルそのまま送られるとbackendが困るのでテキストで送る．
  const sendText = async (text: string) => {
    await Axios.post("http://localhost:5000/postRDF", {value: text}).then((res) => {
      console.log("post success.");
    }).catch((err) => {
      console.log("post failed.");
    });
  }

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

  const onLoadData = ({ id }: any) =>
    new Promise((resolve) => {
      setTimeout(async () => {
        let children: TreeDataType[] = [];
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
    setTimeout(async () => {
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
        <div>↓Please upload RDF file OR select the RDF URL↑</div>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Upload RDF only</Button>
        </Upload>
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
          loadData={onLoadData}
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
