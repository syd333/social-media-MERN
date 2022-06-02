import React from "react";
import { Form, Segment, Image, Icon, Header } from "semantic-ui-react";

function ImageDropDiv({
  highlighted,
  setHighlighted,
  inputRef,
  handleChange,
  mediaPreview,
  setMediaPreview,
  setMedia,
}) {
  return (
    <>
      <Form.Field>
        <Segment placeholder basic secondary>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleChange}
            name="media"
            ref={inputRef}
          />

          <div>
            {mediaPreview === null ? (
              <>
                <Segment
                color={highlighted ? "green": "" }
                  placeholder
                  basic
                >
                 <Header icon>
                     <Icon name="file image outline" style={{cursor:"pointer"}} onClick={}/>
                     </Header>
                </Segment>
              </>
            ) : (
              <Segment color="green" placeholder basic>
                <Image
                  src={mediaPreview}
                  size="medium"
                  centered
                  style={{ cursor: "pointer" }}
                  onClick={() => inputRef.current.click()}
                />
              </Segment>
            )}
          </div>
        </Segment>
      </Form.Field>
    </>
  );
}

export default ImageDropDiv;
