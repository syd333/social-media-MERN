import React from "react";
import {
  Placeholder,
  Divider,
  List,
  Button,
  Card,
  Container,
  Icon,
} from "semantic-ui-react";

const genArray = (length) => {
  const newArr = new Array(length);

  for (let i = 0; i < newArr.length; i++) {
    newArr[i] = i;
  }
  return newArr;
};

export const PlaceHolderPosts = () =>
  genArray(3).map((item) => (
    <div key={item}>
      <Placeholder fluid>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Divider hidden />
    </div>
  ));

export const PlaceHolderSuggestions = () => (
  <List.Item>
    <Card color="red">
      <Placeholder>
        <Placeholder.Image square />
      </Placeholder>
      <Card.Content>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line length="medium" />
          </Placeholder.Header>
        </Placeholder>
      </Card.Content>

      <Card.Content extra>
        <Button
          disabled
          circular
          size="small"
          icon="add user"
          content="Follow"
          color="twitter"
        />
      </Card.Content>
    </Card>
  </List.Item>
);

export const PlaceHolderNotifications = () =>
  genArray(10).map((item) => (
    <>
      <Placeholder key={item}>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
      <Divider hidden />
    </>
  ));

export const EndMessage = () => (
  <Container textAlign="center">
    <Icon name="refresh" size="large" />
    <Divider hidden />
  </Container>
);

export const LikesPlaceHolder = () =>
  genArray(6).map((item) => (
    <Placeholder key={item} style={{ minWidth: "200px" }}>
      <Placeholder.Header image>
        <Placeholder.Line length="full" />
      </Placeholder.Header>
    </Placeholder>
  ));
