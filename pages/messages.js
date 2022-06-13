import React, { useState } from "react";
import axios from "axios";
import { parseCookies } from "nookies";

function Messages({ chatsData }) {
  const [chats, setChats] = useState(chatsData);
  return <div>messages</div>;
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
