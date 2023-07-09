import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";

const Room = (props) => {
  const COLLECTION_ID = props.COLLECTION_ID;
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${COLLECTION_ID}.documents`,
      (response) => {
        // Callback will be executed on changes for documents A and all files.
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.orderDesc("$createdAt"),
      Query.limit(100),
    ]);
    console.log("Responses", response);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };
    //Permisssion for the user to read , write and delete
    let permissions = [Permission.write(Role.user(user.$id))];

    const response = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      payload,
      permissions
    );
    console.log("CREATED!!!", response);
    // setMessages((prevState) => [response, ...messages]);
    setMessageBody("");
  };
  const deleteMessage = async (id) => {
    const element = messages.find((mess) => mess.$id === id);

    databases.deleteDocument(DATABASE_ID, COLLECTION_ID, element.$id);

    // setMessages((prevState) =>
    //   messages.filter((message) => message.$id !== id)
    // );
  };
  const messageHeader = (message) => {
    const styles = {
      container: {
        display: "flex",
        justifyContent:
          message.user_id === user.$id ? "space-between" : "flex-end",
        alignItems: "center",
      },
    };
    return (
      <div className="message--header1 " style={styles.container}>
        <p>
          {message?.username ? (
            <span> {message?.username}</span>
          ) : (
            "Anonymous user"
          )}
          <small className="message-timestamp">
            {new Date(message.$createdAt).toLocaleString()}
          </small>
        </p>
        {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
          <Trash2
            className="delete--btn"
            onClick={() => {
              deleteMessage(message.$id);
            }}
          />
        )}
      </div>
    );
  };

  const messageContainer = (message) => {
    const styles = {
      container: {
        marginLeft: message.user_id === user.$id ? "none" : "auto",
        backgroundColor: message.user_id === user.$id ? "darkgreen" : "#253b2d",
      },
    };
    return (
      <div className="message--body" style={styles.container}>
        <span>{message.body}</span>
      </div>
    );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="250"
              placeholder="Say Something..."
              onChange={(e) => setMessageBody(e.target.value)}
              value={messageBody}
            ></textarea>
          </div>
          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="Send" />
          </div>
        </form>
        <div>
          {messages.map((message) => (
            <div key={message.$id} className="message--wrapper">
              {messageHeader(message)}

              {messageContainer(message)}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Room;
