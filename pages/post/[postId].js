import React from "react";
import { useRouter } from "next/router";

function PostPage() {
  const router = useRouter();

  return <div>{router.query.postId}</div>;
}

export default PostPage;
