import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";

function Message({ message, user, bannerProfilePic }) {
  const [deleteIcon, showDeleteIcon] = useState(false);

  const ifYouSender = message.send === user._id
  return (
    <div className="bubbleWrapper">
      <div
        className={ifYouSender ? "inlineContainer own" : "inlineContainer"}
        onClick={() => ifYouSender && showDeleteIcon(!deleteIcon)}
      >
        <img
          className="inlineIcon"
          src={ifYouSender ? user.profilePicUrl : bannerProfilePic}
        />

        <div className={ifYouSender ? "ownBubble own" : "otherBubble other"}>
          {message.msg}
        </div>

        {deleteIcon && (
          <Popup
            trigger={
              <Icon
                name="trash"
                color="red"
                style={{ cursor: "pointer" }}
                // onClick={() => deleteMsg(message._id)}
              />
            }
            content="This will only delete the message from your inbox!"
            position="top right"
          />
        )}
      </div>

      <span className={ifYouSender ? "own" : "other"}>
        {calculateTime(message.date)}
      </span>
    </div>
  );
}

export default Message;
