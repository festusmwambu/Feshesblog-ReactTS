import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';

import Body from '../components/Body';
import Posts from '../components/Posts';
import TimeAgo from '../components/TimeAgo';
import { useAPIProviderContext } from '../contexts/APIProvider';
import { useUserProviderContext } from '../contexts/UserProvider';
import { useFlashProviderContext } from '../contexts/FlashProvider';



interface User {
  id: number;
  username: string;
  avatar_url: string;
  about_me: string;
  first_seen: string;
  last_seen: string;
}

const UserPage = () => {
  const { username } = useParams();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const api = useAPIProviderContext();
  const [isFollower, setIsFollower] = useState<boolean | null>(null);
  const { user: loggedInUser } = useUserProviderContext();
  const flash = useFlashProviderContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get('/users/' + username);

      if (response.ok) {
        setUser(response.body);

        if (response.body.username !== loggedInUser?.username) { // Optional chaining
          const follower = await api.get(
            '/me/following/' + response.body.id);

          if (follower.status === 204) {
            setIsFollower(true);
          }
          else if (follower.status === 404) {
            setIsFollower(false);
          }
        }
        else {
          setIsFollower(null);
        }
      }
      else {
        setUser(null);
      }
    };

    fetchData();
  }, [username, api, loggedInUser]);

  const edit = () => {
    navigate('/edit');
  };

  const follow = async () => {
    const response = await api.post('/me/following/' + user!.id);

    if (response.ok) {
      flash(`You are now following ${user!.username}`, "success");
      setIsFollower(true);
    } else {
      // Handle follow request error here
      console.error('Follow request failed');
    }
  };

  const unfollow = async () => {

      const response = await api.remove('/me/following/' + user!.id);

      if (response.ok) {
        flash(`You have unfollowed ${user!.username}`, "success");
        setIsFollower(false);
      } else {
        // Handle unfollow request error here
        console.error('Unfollow request failed');
      }
  };
  
  return (
    <Body sidebar>
      {user === undefined ? (
        <Spinner animation="border" />
      ) : (
        <>
          {user === null ? (
            <p>User not found.</p>
          ) : (
            <>
              <Stack direction="horizontal" gap={4}>
                <Image src={user.avatar_url + '&s=128'} roundedCircle />
                <div>
                  <h1>{user.username}</h1>
                  {user.about_me && <h5>{user.about_me}</h5>}
                  <p>
                    Member since: <TimeAgo isoDate={user.first_seen} />
                    <br />
                    Last seen: <TimeAgo isoDate={user.last_seen} />
                  </p>
                  {isFollower === null &&
                    <Button variant="primary" onClick={edit}>
                      Edit
                    </Button>
                  }
                  {isFollower === false &&
                    <Button variant="primary" onClick={follow}>
                      Follow
                    </Button>
                  }
                  {isFollower === true &&
                    <Button variant="primary" onClick={unfollow}>
                      Unfollow
                    </Button>
                  }
                </div>
              </Stack>
              <Posts content={user.id.toString()} />
            </>
          )}
        </>
      )}
    </Body>
  );
};

export default UserPage;
