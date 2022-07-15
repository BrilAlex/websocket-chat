import React, {ChangeEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import {useAppDispatch, useAppSelector} from "./bll/store";
import {
  createSocketConnection,
  destroySocketConnection,
  sendMessage,
  sendUserName, typeMessage
} from "./bll/chatReducer";
import {MessageType, UserType} from "./api/api";

function App() {
  // const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [isAutoScrollActive, setIsAutoScrollActive] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);

  const messages = useAppSelector<Array<MessageType>>(state => state.chat.messages);
  const typingUsers = useAppSelector<Array<UserType>>(state => state.chat.typingUsers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(createSocketConnection());

    return () => {
      dispatch(destroySocketConnection());
    };
  }, []);

  useEffect(() => {
    if (isAutoScrollActive) {
      messagesAnchorRef.current?.scrollIntoView({behavior: "smooth"});
    }
  }, [isAutoScrollActive, messages]);

  const messagesAnchorRef = useRef<HTMLDivElement>(null);

  const onNameChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const addUserHandler = () => {
    dispatch(sendUserName(name));
  };

  const onMessageChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value);
  };

  const sendMessageHandler = () => {
    dispatch(sendMessage(message));
    setMessage("");
  };

  const onKeyPressHandler = () => {
    dispatch(typeMessage());
  };

  return (
    <div className={"App"}>
      <div>
        <div
          style={{
            width: "300px",
            height: "300px",
            padding: "10px",
            border: "1px solid black",
            overflowY: "scroll"
          }}
          onScroll={(e) => {
            let element = e.currentTarget;

            let maxScrollPosition = element.scrollHeight - element.clientHeight;

            if (element.scrollTop > lastScrollTop && Math.abs(maxScrollPosition - element.scrollTop) < 10) {
              setIsAutoScrollActive(true);
            } else {
              setIsAutoScrollActive(false);
            }
            setLastScrollTop(element.scrollTop);
          }}
        >
          {messages.map(m => {
            return (
              <div key={m.id}>
                <b>{m.user.name}</b> {m.message}
                <hr/>
              </div>
            );
          })}
          <div>
            {typingUsers.map(u => {
              return (
                <span key={u.id}>
                <b>{u.name}</b> ...
              </span>
              );
            })}
          </div>
          <div ref={messagesAnchorRef}/>
        </div>
        <div>
          <div>
            <input value={name} onChange={onNameChangeHandler}/>
            <button onClick={addUserHandler}>Add user</button>
          </div>
          <div>
            <textarea
              value={message}
              onChange={onMessageChangeHandler}
              onKeyPress={onKeyPressHandler}
            />
            <br/>
            <button onClick={sendMessageHandler}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
