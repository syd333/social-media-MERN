import React, { useState } from "react";
import { List, Popup, Image } from "semantic-ui-react";
import catchErrors from "../../utils/catchErrors";
import Router from "next/router";
import Link from "next/link";
import { LikesPlaceHolder } from "../Layout/PlaceHolderGroup";
import cookie from "js-cookie";
import { Axios } from "../../utils/postActions";
import baseUrl from "../../utils/baseUrl";

function LikesList({ postId, trigger }) {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getLikesList = async () => {
    setLoading(true);
    try {
      const res = await Axios.get(
        `${baseUrl}/api/posts/like/${postId}`,
        { headers: { Authorization: cookie.get("token") } }
      );
      setLikesList(res.data);
    } catch (error) {
      alert(catchErrors(error));
    }
    setLoading(false);
  };

  return (
    <Popup
      on="click"
      onClose={() => setLikesList([])}
      onOpen={getLikesList}
      popperDependencies={[likesList]}
      trigger={trigger}
      wide
    >
      {loading ? (
        <LikesPlaceHolder />
      ) : (
        <>
          {likesList.length > 0 && (
            <div
              style={{
                overflow: "auto",
                maxHeight: "15rem",
                height: "15rem",
                minWidth: "210px",
              }}
            >
              <List selection size="large">
                {likesList.map((like) => (
                  <List.Item key={like._id}>
                    <Image avatar src={like.user.profilePicUrl} />

                    <List.Content>
                      <Link href={`/${like.user.username}`}>
                        <List.Header
                          //   onClick={() => Router.push(`/${like.user.username}`)}
                          as="a"
                          content={like.user.name}
                        />
                      </Link>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </div>
          )}
        </>
      )}
    </Popup>
  );
}

export default LikesList;
