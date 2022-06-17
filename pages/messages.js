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
import Banner from "../components/Messages/Banner";
import Message from "../components/Messages/Message";
import MessageInputField from "../components/Messages/MessageInputField";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";

function Messages({ chatsData, user }) {
  const [chats, setChats] = useState(chatsData);
  const router = useRouter();
  const [connectedUsers, setConnectedUsers] = useState([]);

  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [bannerData, setBannerData] = useState({ name: "", profilePicUrl: "" });
  const openChatId = useRef("");
  // ref is for persisting the state of query string in url through re-renders
  // this ref is jsut query string inside url

  //connection
  useEffect(() => {
    // if (user.unreadMessage) setMessageToUnread();
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
    // return () => {
    //   if (socket.current) {
    //     socket.current.emit("disconnect");
    //     socket.current.off();
    //   }
    // };
  }, []);

  // load messages
  useEffect(() => {
    const loadMessages = () => {
      socket.current.emit("loadMessages", {
        userId: user._id,
        messagesWith: router.query.message,
      });

      socket.current.on("messagesLoaded", async ({ chat }) => {
        setMessages(chat.messages);
        setBannerData({
          name: chat.messagesWith.name,
          profilePicUrl: chat.messagesWith.profilePicUrl,
        });

        openChatId.current = chat.messagesWith._id;
        //   divRef.current && scrollDivToBottom(divRef);
      });

      socket.current.on("noChatFound", async () => {
        const { name, profilePicUrl } = await getUserInfo(router.query.message);

        setBannerData({ name, profilePicUrl });
        setMessages([]);

        openChatId.current = router.query.message;
      });
    };

    if (socket.current && router.query.message) loadMessages();
  }, [router.query.message]);

  const sendMsg = (msg) => {
    if (socket.current) {
      socket.current.emit("sendNewMsg", {
        userId: user._id,
        msgSendToUserId: openChatId.current,
        msg,
      });
    }
  };

  // Confirming msg is sent and receving the messages
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msgSent", ({ newMsg }) => {
        if (newMsg.receiver === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.receiver
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            return [...prev];
          });
        }
      });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        //when chat with sender is currently open inside your browser
        let senderName;
        if (newMsg.sender === openChatId.current) {
          setMessages((prev) => [...prev, newMsg]);

          setChats((prev) => {
            const previousChat = prev.find(
              (chat) => chat.messagesWith === newMsg.sender
            );
            previousChat.lastMessage = newMsg.msg;
            previousChat.date = newMsg.date;

            senderName = previousChat.name;

            return [...prev];
          });
        }
        //
        else {
          const ifPreviouslyMessages =
            chats.filter((chat) => chat.messagesWith === newMsg.send).length >
            0;

          if (ifPreviouslyMessages) {
            setChats((prev) => {
              const previousChat = prev.find(
                (chat) => chat.messagesWith === newMsg.sender
              );
              previousChat.lastMessage = newMsg.msg;
              previousChat.date = newMsg.date;
              senderName = previousChat.name;

              return [...prev];
            });
          } else {
            const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
            senderName = name;

            const newChat = {
              messagesWith: newMsg.sender,
              name,
              profilePicUrl,
              lastMessage: newMsg.msg,
              date: newMsg.date,
            };
            setChat((perv) => [newChat, ...prev]);
          }
          //    const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
          //    senderName = name;

          //    const newChat = {
          //      messagesWith: newMsg.sender,
          //      name,
          //      profilePicUrl,
          //      lastMessage: newMsg.msg,
          //      date: newMsg.date,
          //    };

          //    setChats((prev) => {
          //      const previousChat = Boolean(
          //        prev.find((chat) => chat.messagesWith === newMsg.sender)
          //      );

          //      if (previousChat) {
          //        return [
          //          newChat,
          //          ...prev.filter((chat) => chat.messagesWith !== newMsg.sender),
          //        ];
          //      } else {
          //        return [newChat, ...prev];
          //      }
          //    });
        }

        newMsgSound(senderName);
      });
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
                        connectedUsers={connectedUsers}
                        // deleteChat={deleteChat}
                      />
                    ))}
                  </Segment>
                </Comment.Group>
              </Grid.Column>

              <Grid.Column width={12}>
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
                            // divRef={divRef}
                            key={message._id}
                            bannerProfilePic={bannerData.profilePicUrl}
                            message={message}
                            setMessages={setMessages}
                            messagesWith={openChatId.current}
                            user={user}
                            // deleteMsg={deleteMsg}
                          />
                        ))}
                    </div>

                    <MessageInputField sendMsg={sendMsg} />
                  </>
                )}
              </Grid.Column>
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
