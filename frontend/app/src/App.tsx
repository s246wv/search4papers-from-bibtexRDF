import React from 'react';
import { Input } from 'antd';
import Axios from 'axios';

import logo from './logo.svg';
import './App.css';

const { Search } = Input

const onLoad = (value: string) => {
  console.log(value);
  Axios.post("http://localhost:5000/onLoad", {
    url: value
  }).then((res: any)=>{
    alert(res)
  })
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Search placeholder="RDFファイルのURLを入力してください" enterButton="Load" onSearch={onLoad} />
        <img src={logo} className="App-logo" alt="logo" />
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
