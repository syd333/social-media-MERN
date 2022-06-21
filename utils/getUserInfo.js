import axios from "axios";
import cookie from "js-cookie";
import baseUrl from "../utils/baseUrl";

const getUserInfo = async (userToFindId) => {
  try {
    const res = await axios.get(
      `${baseUrl}/api/chats/user/${userToFindId}`,
      {
        headers: { Authorization: cookie.get("token") },
      }
    );
    return { name: res.data.name, profilePicUrl: res.data.profilePicUrl };
  } catch (error) {
    console.error(error);
  }
};

export default getUserInfo;
