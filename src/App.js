import { useState } from 'react';
import './App.css';

// import { eventWrapper } from '@testing-library/user-event/dist/utils';

function Header(props) {
  return (
    <header>
      <h1><a href='/' onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode();
      }}>{props.title}</a></h1>
    </header>
  );
}

function Nav(props) {
  const lis = [];
  for (let i = 0; i < props.topics.length; i++)
  {
    let tmp = props.topics[i];
    lis.push(
      <li key={tmp.id}>
      <a href={'/read/'+tmp.id} onClick={(event)=>{
        event.preventDefault();
        props.onChangeMode(i);}}>
        {tmp.title}
      </a></li>
      );
  }
  return ( 
    <nav>
      <ol>{lis}</ol>
    </nav>
  );
}

function Article(props) {
  return (
    <article className='content'>
      <h2>
        {props.title}
      </h2>
      {props.body}
    </article>
  );
}

function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" value={title} onChange={(event)=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" value={body} onChange={(event)=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function App() {
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [topics, setTopics] = useState([
    {id:1, title: 'html', body:'html is ...'},
    {id:2, title: 'css', body:'css is ...'},
    {id:3, title: 'js', body:'js is ...'},
  ]);
  let content = null;
  let contentControl = null;

  if (mode==='WELCOME'){
    content = <Article title='Welcome' body="HELLO, REACT"></Article>;
  } else if (mode === 'READ'){
    content = <Article title={topics[id].title} body={topics[id].body}></Article>;
    contentControl = <><li><a href={'/update/' + id} onClick={(event)=>{
      event.preventDefault();
      setMode('UPDATE');
    }}>UPDATE</a></li>
    <li><input type="button" value="Delete" onClick={()=>{
      const newTopics = [];
      for (let i = 0; i < topics.length; i++)
      {
        if (i !== id)
          newTopics.push(topics[i]);
      }
      setTopics(newTopics);
      setMode('WELCOME');
    }}></input></li>
    </>;
  } else if (mode === 'CREATE'){
    content = <Create onCreate={(title, body)=>{
      const tmpTopics = topics.slice();
      const newTopic = {id: topics.length + 1,title:title, body:body};
      tmpTopics.push(newTopic);
      setTopics(tmpTopics);
      setMode('READ');
      setId(topics.length);
    }}></Create>
  } else if (mode === 'UPDATE'){
    content = <Update title={topics[id].title} body={topics[id].body} onUpdate={(title, body)=>{
      const tmpTopics = topics.slice();
      const newTopic = {id, title:title, body:body};
      tmpTopics[id] = newTopic;
      setTopics(tmpTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header 
        title="HELLO REACT WORLD" 
        onChangeMode={()=>{setMode('WELCOME');}}>
      </Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id)
      }}></Nav>
      {content}
      <p></p>
      <ul>
        <li><a href='/create' onClick={(event)=>{
            event.preventDefault();
            setMode('CREATE');
          }}>CREATE</a></li>
        {contentControl}
      </ul>
    </div>
  );
}

export default App;
