import { API } from "../common/constants";
import { getToken } from "../common/getToken";
import jwt from "jsonwebtoken";

export const login = async (loginData) => {
  try {
    const response = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    return (await response.json()).token || "";
  } catch (err) {
    console.error(err?.message);
    return "";
  }
};

export const logout = async () => {
  try {
    const response = await fetch(`${API}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.status;
  } catch (err) {
    console.error(err?.message);
    return 400;
  }
};

export const register = async (loginData) => {
  try {
    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    if (response.status === 201) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const updateUser = async (updateData) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/users`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    if (response.status === 201) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const deleteUser = async (id) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const banUser = async (id) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/users/${id}/ban`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const getFeedPopular = async () => {
  try {
    const response = await fetch(`${API}/feed/popular`);

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};

export const getFeed = async () => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API}/feed`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};

export const createPost = async (postData) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/posts`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: postData,
    });

    if (response.status === 201) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const updatePost = async (id, updateData) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/posts/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: updateData,
    });

    if (response.status === 200) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const deletePost = async (id) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.json();
    }

    return { status: response.status };
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const getUserPosts = async (id) => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API}/users/${id}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};

export const postsReactions = async (postID, reaction) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/posts/${postID}/react`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction,
      }),
    });

    if (response.status === 200) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const getUserComments = async () => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(
      `${API}/users/${jwt.decode(token).id}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};

export const getUsers = async (searchQuery = "") => {
  try {
    const response = await fetch(
      `${API}/users${
        searchQuery ? "?" + searchQuery + "&count=100" : "?count=100"
      }`
    );

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};

export const getUser = async () => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/users/${jwt.decode(token).id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const getUserDetails = async (id) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const deleteFriend = async (friendID) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${API}/users/${jwt.decode(token).id}/friends/${friendID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const addFriend = async (friendID) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${API}/users/${jwt.decode(token).id}/friends/${friendID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const acceptFriend = async (friendID) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${API}/users/${jwt.decode(token).id}/friends/${friendID}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      return await response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const createComment = async (id, postData) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/posts/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.status === 201) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const updateComment = async (id, postData) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/comments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(postData),
    });

    if (response.status === 200) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};
export const deleteComment = async (id) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/comments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const commentReactions = async (commentID, reaction) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${API}/comments/${commentID}/react`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        reaction,
      }),
    });

    if (response.status === 200) {
      return response.json();
    }

    return null;
  } catch (err) {
    console.error(err?.message);
    return null;
  }
};

export const getSinglePost = async (id) => {
  const token = getToken();
  if (!token) {
    return [];
  }

  try {
    const response = await fetch(`${API}/posts/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return await response.json();
    }

    return [];
  } catch (err) {
    console.error(err?.message);
    return [];
  }
};
