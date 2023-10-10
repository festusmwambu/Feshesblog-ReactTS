import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";

import Post from './Post';
import { useAPIProviderContext } from "../contexts/APIProvider";
import More from "./More";
import Write from './Write';



interface PostsProps {
  content?: string;
  write?: boolean;
}

export interface PostData {
  id: number;
  author: {
        avatar_url: string;
        username: string;
    };
    text: string;
    timestamp: string;
  // Add other properties for posts
}

interface PaginationData {
  // Define your pagination properties here
  offset: number;
  count: number;
  total: number;
}

const Posts = ({ content, write }: PostsProps) => {
  const [posts, setPosts] = useState<PostData[] | null | undefined>(undefined);
  const [pagination, setPagination] = useState<PaginationData>({ offset: 0, count: 0, total: 0 }); // Provide a default value.
  const api = useAPIProviderContext();
  const url = '/feed';

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(url);

      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      } else {
        setPosts(null);
      }
    };

    fetchData(); // Call fetchData here to fetch data when the component mounts.
  }, [api, url]);

  const loadNextPage = async () => {
    if (posts && posts.length > 0) {
      const response = await api.get(url, {
        after: posts[posts.length - 1].timestamp
      });

      if (response.ok) {
        setPosts([...(posts || []), ...response.body.data]);
        setPagination(response.body.pagination);
      }
    }
  };

  const showPost = (newPost: PostData) => {
    setPosts([newPost, ...(posts || [])]);
  };
  
  return (
    <>
      {write && <Write showPost={showPost} />}
      {posts === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          {posts === null ? (
            <p>Could not retrieve blog posts</p>
          ) : (
            <>
              {posts.length === 0 ? (
                <p>There are no blog posts.</p>
              ) : (
                posts.map((post) => 
                  <Post key={post.id} post={post} />
                )
              )}
              <More pagination={pagination} loadNextPage={loadNextPage} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default Posts;