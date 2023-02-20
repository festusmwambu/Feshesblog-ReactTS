import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Post from './Post';
import { useApi } from "../contexts/ApiProvider";
import More from "./More";
import Write from './Write';



export default function Posts({ content, write }) {
  const [posts, setPosts] = useState();
  const [pagination, setPagination] = useState(); 
  const api = useApi();
  const url = '/feed';

  useEffect(() => {
    (async () => {
      const response = await api.get(url);
      if (response.ok) {
        setPosts(response.body.data);
        setPagination(response.body.pagination);
      }
      else {
        setPosts(null);
      }
    })();
  }, [api, url]);

  const loadNextPage = async () => {
    const response = await api.get(url, {
      after: posts[posts.length - 1].timestamp
    });
    if (response.ok) {
      setPosts([...posts, ...response.body.data]);
      setPagination(response.body.pagination);
    }
  };

  const showPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };
  
  return (
    <>
      {write && <Write showPost={showPost} />}
      {posts === undefined ?
        <Spinner animation="border" />
      :
        <>
          {posts === null ? 
            <p>Could not retrieve blog posts</p>
          :
            <>
              {posts.length === 0 ?
                <p>There are no blog posts.</p>
              :
                posts.map(post => 
                  <Post key={post.id} post={post} />
                )
              }
              <More pagination={pagination} loadNextPage={loadNextPage} />
            </>
          }
        </>
      }
    </>
  );
}