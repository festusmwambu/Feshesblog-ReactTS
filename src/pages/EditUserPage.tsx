import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Image, Spinner, Stack } from "react-bootstrap";

import { useAPIProviderContext } from "../contexts/APIProvider";
import { useUserProviderContext } from "../contexts/UserProvider";
import { useFlashProviderContext } from "../contexts/FlashProvider";
import Body from "../components/Body";
import TimeAgo from "../components/TimeAgo";




interface User {
    id: number;
    username: string;
    avatar_url: string;
    about_me: string;
    first_seen: string;
    last_seen: string;
}

const EditUserPage = () => {
    const { username } = useParams();
    const [user, setUser] = useState<User | null | undefined>(undefined);
    const [editedUser, setEditedUser] = useState<User | null | undefined>(undefined);
    const api = useAPIProviderContext();
    const [isFollower, setIsFollower] = useState<boolean | null>(null);
    const { user: loggedInUser } = useUserProviderContext();
    const flash = useFlashProviderContext();

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/users/" + username);

            if (response.ok) {
                setUser(response.body);

                if (response.body.username !== loggedInUser?.username) {
                    const follower = await api.get("/me/following/" + response.body.id);

                    if (follower.status === 204) {
                        setIsFollower(true);
                    } else if (follower.status === 404) {
                        setIsFollower(false);
                    } 
                } else {
                    setUser(null);
                }
            }
        };

        fetchData();
    }, [api, loggedInUser, username]);

    useEffect(() => {
        // Initialize the editedUser state with the current user 
        if (user) {
            setEditedUser({ ...user });
        }
    }, [user]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target

        // Update the editedUser state when form fields are changed
        setEditedUser((prevUser) => ({
            ...(prevUser as User), // Type assertion here
            [name]: value
        }));
    };

    const saveChanges = async (event: FormEvent) => {
        event.preventDefault();

        // Implement the logic to save changes here
        try {
            if (!editedUser) return;

            // Example: Update user data with API call
            const response = await api.put(`/users/${editedUser.id}`, editedUser);

            if (response.ok) {
                // Update the user state with the edited data
                setUser(editedUser);
                flash("Changes saved successfully", "success");
            } else {
                // Handle save changes error here
                console.error("Save changes failed");
            }
        } catch (err) {
            // Handle API request error here
            console.error(err);
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
                                <Image src={user.avatar_url + "&s=128"} roundedCircle />
                                <div>
                                    <h1>{user.username}</h1>
                                    {user.about_me && <h5>{user.about_me}</h5>}
                                    <p>
                                        Member since: <TimeAgo isoDate={user.first_seen} />
                                        <br />
                                        last seen: <TimeAgo isoDate={user.last_seen} />
                                    </p>
                                    {isFollower == null && (
                                        <Button variant="primary" onClick={saveChanges}>
                                            Save Changes
                                        </Button>
                                    )}
                                </div>
                            </Stack>

                            {/* Add form fields for editing user information here */}
                            <Form onSubmit={saveChanges}>
                                <Form.Group controlId="about_me">
                                    <Form.Label>About Me</Form.Label>
                                    <Form.Control type="text" name="about_me" value={editedUser?.about_me || ""} onChange={handleInputChange} />
                                </Form.Group>

                                {/* Form field for editing avatar URL */}
                                <Form.Group controlId="avatar_url">
                                    <Form.Label>Avatar URL</Form.Label>
                                    <Form.Control type="text" name="avatar_url" value={editedUser?.avatar_url || ""} onChange={handleInputChange} />
                                </Form.Group>

                                {/*Add more form fields for editing user information*/}
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                            </Form>
                        </>
                    )}
                </>
            )}
        </Body>
    );
};

export default EditUserPage;