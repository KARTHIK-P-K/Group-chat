import React, { useState, useEffect } from "react";
import client, {
  databases,
  DATABASE_ID,
  COLLECTION_ID,
} from "../appwriteConfig";
import { ID, Query, Role, Permission } from "appwrite";
import useSound from "use-sound";
import messageSound from "../sounds/announcement-sound-4-21464.mp3";
import trashSound from "../sounds/20131118_trashcan-smashed_zoomh2nxy-105310.mp3";
import { Trash2, SkipBack } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../utils/AuthContext";
import Dark from "../images/dark.png";
import Light from "../images/light.png";

const Room = (props) => {
  const COLLECTION_ID = props.COLLECTION_ID;
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { user } = useAuth();
  const [playSound1] = useSound(messageSound);
  const [playSound2] = useSound(trashSound);

  useEffect(() => {
    getMessages();

    const arrayString = localStorage.getItem("itemsSelected");
    if (arrayString !== null) {
      const retrievedArray = JSON.parse(arrayString);
      console.log("1", retrievedArray);
      setSelectedItems(retrievedArray);
    }
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
  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    playSound1();
    console.log("CREATED!!!", response);

    // setMessages((prevState) => [response, ...messages]);
    setMessageBody("");
  };
  const deleteMessage = async (id) => {
    const element = messages.find((mess) => mess.$id === id);

    databases.deleteDocument(DATABASE_ID, COLLECTION_ID, element.$id);
    playSound2();
    // setMessages((prevState) =>
    //   messages.filter((message) => message.$id !== id)
    // );
  };
  const handleDoubleClick = (index) => {
    if (index.user_id === user.$id) {
      console.log("hig");
      return;
    }
    let index2 = index.$id;
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(index2)) {
        // If the item is already selected, remove it from the array
        localStorage.setItem(
          "itemsSelected",
          JSON.stringify(prevSelectedItems.filter((item2) => item2 !== index2))
        );
        return prevSelectedItems.filter((item2) => item2 !== index2);
      } else {
        // If the item is not selected, add it to the array
        console.log("2", selectedItems);
        localStorage.setItem(
          "itemsSelected",
          JSON.stringify([...prevSelectedItems, index2])
        );
        return [...prevSelectedItems, index2];
      }
    });
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
        <p
          style={{
            color: isDarkMode ? "white" : "black",
          }}
        >
          {message?.username ? (
            <span> {message?.username}</span>
          ) : (
            "Anonymous user"
          )}
          <small
            className="message-timestamp"
            style={{
              color: isDarkMode ? "white" : "black",
            }}
          >
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
        cursor: "pointer",
        marginLeft: message.user_id === user.$id ? "none" : "auto",
        backgroundColor: message.user_id === user.$id ? "darkgreen" : "#253b2d",
        color: selectedItems.includes(message.$id) ? "red" : "white",
      },
    };
    return (
      <div className="message--body" style={styles.container}>
        <span onDoubleClick={() => handleDoubleClick(message)}>
          {message.body}
        </span>
      </div>
    );
  };

  return (
    <main className="container">
      <Header />

      <div
        className="room--container"
        style={{
          backgroundColor: isDarkMode
            ? "rgba(27, 27, 39, 1)"
            : "rgb(245,245,245)",
        }}
      >
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 my-4 rounded-full border-2 ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-gray-300 text-gray-800 border-gray-300"
            }`}
            onClick={toggleMode}
          >
            {isDarkMode ? (
              <img className="w-6 h-6" src={Dark} alt="dark" />
            ) : (
              <img className="w-6 h-6" src={Light} alt="light" />
            )}
          </button>
        </div>
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
