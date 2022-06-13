import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { parseCookies } from "nookies";
import {
  Segment,
  Header,
  Divider,
  Comment,
  Grid,
  Icon,
} from "semantic-ui-react";
import Chat from "../components/Chats/Chat";
import ChatListSearch from "../components/Chats/ChatListSearch";
import { useRouter } from "next/router";
import { NoMessages } from "../components/Layout/NoData";
import cookie from "js-cookie";

function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const [connectedUsers, setConnectedUsers] = useState([]);

  const router = useRouter();
  const socket = useRef();

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://localhost:3000");
    }

    if (socket.current) {
      socket.current.emit("join", { userId: user._id });
      //   socket.current.emit("helloworld", { name: "babyred", age: "22" });

      socket.current.on("connectedUsers", ({ users }) => {
        users.length > 0 && setConnectedUsers(users);
      });

      // socket.current.on("dataReceived", ({ msg }) => {
      //   console.log(msg)
      // });

      if (chats.length > 0 && !router.query.message) {
        router.push(`/messages?message=${chats[0].messagesWith}`, undefined, {
          shallow: true,
        });
      }
    }
  }, []);

  return (
    <>
      <Segment padded basic size="large" style={{ marginTop: "5px" }}>
        <Header
          icon="home"
          content="Go Back!"
          onClick={() => router.push("/")}
          style={{ cursor: "pointer" }}
        />
        <Divider hidden />

        <div style={{ marginBottom: "10px" }}>
          <ChatListSearch chats={chats} setChats={setChats} />
        </div>
        {chats.length > 0 ? (
          <>
            <Grid stackable>
              <Grid.Column width={4}>
                <Comment.Group size="big">
                  <Segment
                    raised
                    style={{ overflow: "auto", maxHeight: "32rem" }}
                  >
                    {chats.map((chat) => (
                      <Chat
                        key={chat.messagesWith}
                        chat={chat}
                        setChats={setChats}
                        // connectedUsers={connectedUsers}
                        // deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>

              {/* <Grid.Column width={12}>
                {router.query.message && (
                  <>
                    <div
                      style={{
                        overflow: "auto",
                        overflowX: "hidden",
                        maxHeight: "35rem",
                        height: "35rem",
                        backgroundColor: "whitesmoke",
                      }}
                    >
                      <div style={{ position: "sticky", top: "0" }}>
                        <Banner bannerData={bannerData} />
                      </div>

                      {messages.length > 0 &&
                        messages.map((message) => (
                          <Message
                            divRef={divRef}
                            key={message._id}
                            bannerProfilePic={bannerData.profilePicUrl}
                            message={message}
                            user={user}
                            deleteMsg={deleteMsg}
                          />
                        ))}
                    </div>

                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
              </Grid.Column> */}
            </Grid>
          </>
        ) : (
          <NoMessages />
        )}
      </Segment>
    </>
  );
}

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`http://localhost:3000/api/chats`, {
      headers: { Authorization: token },
    });

    return { props: { chatsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Messages;
