import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import io from "socket.io-client";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";
import { PostDeleteToastr } from "../components/Layout/Toastr";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  PlaceHolderPosts,
  EndMessage,
} from "../components/Layout/PlaceHolderGroup";
import getUserInfo from "../utils/getUserInfo";
import newMsgSound from "../utils/newMsgSound";
import MessageNotificationModal from "../components/Home/MessageNotificationModal";
import cookie from "js-cookie";
import SocketHoc from "../components/SocketHoc";

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();

  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      socket.current.emit("join", { userId: user._id });

      socket.current.on("newMsgReceived", async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);

        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
        }
        newMsgSound(name);
      });
    }

    document.title = `Welcome, ${user.name.split(" "[0])}`;
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = async () => {
    try {
      // const res = await Axios.get("/", { params: { pageNumber } });
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get("token") },
        params: { pageNumber },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      alert("Error fetching Posts");
    }
  };

  return (
    <>
      <SocketHoc user={user} socket={socket}>
        {showToastr && <PostDeleteToastr />}
        {newMessageModal && newMessageReceived !== null && (
          <MessageNotificationModal
            socket={socket}
            showNewMessageModal={showNewMessageModal}
            newMessageModal={newMessageModal}
            newMessageReceived={newMessageReceived}
            user={user}
          />
        )}
        <Segment>
          <CreatePost user={user} setPosts={setPosts} />
          {posts.length === 0 || errorLoading ? (
            <NoPosts />
          ) : (
            <InfiniteScroll
              hasMore={hasMore}
              next={fetchDataOnScroll}
              loader={<PlaceHolderPosts />}
              endMessage={<EndMessage />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  socket={socket}
                  key={post._id}
                  post={post}
                  user={user}
                  setPosts={setPosts}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          )}
        </Segment>
      </SocketHoc>
    </>
  );
}

//  Index.getInitialProps = async (ctx) => {
//   try {
//     const { token } = parseCookies(ctx);
//     const res = await axios.get("http://localhost:3000/api/posts", {
//       headers: { Authorization: token },
//        params: { pageNumber: 1 },
//     });
//     return { postsData: res.data };
//   } catch (error) {
//     return { errorLoading: true };
//   }
// };

export const getServerSideProps = async (ctx) => {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { props: { postsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Index;
