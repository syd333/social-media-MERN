import React, { useEffect, useState } from "react";
import axios from "axios";
import CreatePost from "../components/Post/CreatePost";
import CardPost from "../components/Post/CardPost";
import { Segment } from "semantic-ui-react";
import { parseCookies } from "nookies";
import { NoPosts } from "../components/Layout/NoData";

function Index({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData);
  const [showToastr, setShowToastr] = useState(false);

  useEffect(() => {
    document.title = `Welcome, ${user.name.split(" "[0])}`;
  }, []);


  return (
    <>
      <Segment>
        <CreatePost user={user} setPosts={setPosts} />
        {posts.map((post) => (
          <CardPost
            key={post._id}
            post={post}
            user={user}
            setPosts={setPosts}
            setShowToastr={setShowToastr}
          />
        ))}
      </Segment>
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

    const res = await axios.get("http://localhost:3000/api/posts", {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { props: { postsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
};

export default Index;
