import React, { useState, useEffect } from "react";
import { supabase } from "../lib/helper/supabaseClient";

const Manage = () => {
  const [linkName, setLinkName] = useState("");
  const [linkURL, setLinkURL] = useState("");
  const [links, setLinks] = useState([]);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editLinkId, setEditLinkId] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.refreshSession();
        if (error) {
          throw error;
        }
        const { user } = data;
        setUser(user);
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const { data, error } = await supabase
          .from("links")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        setLinks(data);
      } catch (error) {
        console.error("Error fetching links:", error);
      }
    };

    if (user) {
      fetchLinks();
    }
  }, [user]);

  const handleSave = async (linkId) => {
    const currentUser = user;
    if (!currentUser) {
      // User is not logged in
      return;
    }

    try {
      if (linkId) {
        // Updating an existing link
        await supabase.from("links").update({ name: linkName, link: linkURL }).eq("id", linkId);
      } else {
        // Adding a new link
        await supabase.from("links").insert([{ name: linkName, link: linkURL, user_id: currentUser.id }]);
      }

      await fetchAndUpdateLinks(currentUser.id);

      resetForm();
    } catch (error) {
      console.error("Error saving link:", error);
    }
  };

  const fetchAndUpdateLinks = async (userId) => {
    try {
      const { data, error } = await supabase.from("links").select("*").eq("user_id", userId);

      if (error) {
        throw error;
      }

      setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from("links").delete().eq("id", id);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleEdit = async (id) => {
    setEditLinkId(id);
    setEditMode(true);

    const selectedLink = links.find((link) => link.id === id);
    if (selectedLink) {
      setLinkName(selectedLink.name);
      setLinkURL(selectedLink.link);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditLinkId(null);
    resetForm();
  };

  const resetForm = () => {
    setLinkName("");
    setLinkURL("");
    setEditMode(false);
    setEditLinkId(null);
  };

  return (
    <div>
      <div className="mx-auto lg:py-56 bg-white py-24 lg:w-1/2 sm:py-32 max-w-7xl px-6 lg:px-8 ">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Welcome User{" "}
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
            Create new Link below
          </h1>
          <div className="mt-10 admin-page__create-event space-y-">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Please enter name"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                className="mt-1 mb-2 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Link Url
              </label>
              <input
                type="text"
                name="Link Url"
                id="title"
                placeholder="Please enter URL"
                value={linkURL}
                onChange={(e) => setLinkURL(e.target.value)}
                className="mt-1 mb-2 border focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <button
                type="submit"
                onClick={() => handleSave(editLinkId)}
                className="block mt-5 mb-2 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        aria-hidden="true"
      ></div>

      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-7">
              Links List
            </h2>
            <div className="relative py-1 text-sm text-gray-600">
                Instruction
            </div>
          </div>

          <div className="mx-auto mt-10 ">
            {links.map((link) => (
              <div
                key={link.id}
                className="grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
              >
                {editMode && editLinkId === link.id ? (
                  <div className="flex items-left mb-4">
                    <input
                      type="text"
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                      className="text-xs mr-4 px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={linkURL}
                      onChange={(e) => setLinkURL(e.target.value)}
                      className="text-xs mr-4 px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleSave(link.id)}
                      className="text-xs rounded-full bg-blue-500 hover:bg-blue-700 px-3 py-1.5 mr-2 font-medium text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-xs rounded-full bg-red-500 hover:bg-red-700 px-3 py-1.5 font-medium text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-bold tracking-tight text-gray-900">
                      {link.name}
                    </h3>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                      {link.link}
                    </p>
                    <div>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="mr-5 mt-2 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => handleEdit(link.id)}
                        className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Edit
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
