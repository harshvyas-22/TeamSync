import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import { UserContext } from "../context/user.context";

const Project = () => {
  const location = useLocation();
  console.log(location.state.project);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);

  const handleUserClick = (id) => {
    setSelectedUserIds((prevSelectedUserIds) => {
      const newSelectedUserIds = new Set(prevSelectedUserIds);
      if (newSelectedUserIds.has(id)) {
        newSelectedUserIds.delete(id);
      } else {
        newSelectedUserIds.add(id);
      }
      return newSelectedUserIds;
    });
  };

  function addCollaborators() {
    axios
      .put(`/projects/addUser`, {
        projectId: location.state.project._id,
        users: Array.from(selectedUserIds),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((error) => console.log(error));
  }

  function send() {
    sendMessage("project-message", {
      message,
      sender: user,
    });
    appendOutgoingMessage({ message, sender: user });
    setMessage("");
  }

  useEffect(() => {
    initializeSocket(project._id);

    const handleMessage = (data) => {
      appendIncomingMessage(data);
    };

    receiveMessage("project-message", handleMessage);

    return () => {
      receiveMessage("project-message", handleMessage);
    };
  }, [project._id]);

  useEffect(() => {
    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.log(err));

    axios
      .get("/users/all")
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, [location.state.project._id]);

  function appendIncomingMessage(messageObject) {
    const messageBoxElement = messageBox.current;
    const newMessage = document.createElement("div");
    newMessage.classList.add(
      "message",
      "max-w-56",
      "flex",
      "flex-col",
      "p-3",
      "bg-gray-100",
      "w-fit",
      "rounded-md"
    );
    newMessage.innerHTML = `
      <small class="opacity-75 text-sm">${messageObject.sender.email}</small>
      <p class="text-sm text-gray-800">${messageObject.message}</p>
    `;
    messageBoxElement.appendChild(newMessage);
    messageBoxElement.scrollTop = messageBoxElement.scrollHeight;
 scrollToBottom();
  }

  function appendOutgoingMessage(messageObject) {
    const messageBoxElement = messageBox.current;
    const newMessage = document.createElement("div");
    newMessage.classList.add(
      "message",
      "max-w-56",
      "ml-auto",
      "flex",
      "flex-col",
      "p-3",
      "bg-blue-100",
      "w-fit",
      "rounded-md"
    );
    newMessage.innerHTML = `
      <small class="opacity-75 text-sm">${messageObject.sender.email}</small>
      <p class="text-sm text-gray-800">${messageObject.message}</p>
    `;
    messageBoxElement.appendChild(newMessage);
    messageBoxElement.scrollTop = messageBoxElement.scrollHeight;
  scrollToBottom();
  }
function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight
}
  return (
    <main className="h-screen w-screen flex bg-gray-100">
      <section className="left h-screen flex flex-col bg-white shadow-md min-w-[300px]">
        <header className="flex justify-between items-center p-4 bg-gray-200 shadow-sm">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill text-lg"></i>
            <span className="font-medium">Add Collaborator</span>
          </button>

          <button
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            className="p-2 rounded-md hover:bg-gray-300 transition"
          >
            <i className="ri-group-fill text-xl text-gray-700"></i>
          </button>
        </header>
        <div className="conversation-area flex-grow flex flex-col overflow-hidden">
          <div
            ref={messageBox}
            className="message-box p-4 flex-grow overflow-auto space-y-4 bg-gray-50"
          ></div>
          <div className="inputField flex items-center p-4 bg-white shadow-md">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 w-full border rounded-lg outline-none"
              type="text"
              placeholder="Type a message"
            />
            <button
              onClick={send}
              className="ml-3 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>
      </section>

      {isSidePanelOpen && (
        <aside className="sidePanel bg-gray-50 shadow-lg flex flex-col p-4 w-[300px] h-full fixed right-0 top-0">
          <header className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Collaborators</h2>
            <button
              onClick={() => setIsSidePanelOpen(false)}
              className="p-2 rounded-full hover:bg-gray-200"
            >
              <i className="ri-close-line"></i>
            </button>
          </header>
          <div className="users-list flex flex-col gap-2 overflow-auto">
            {project.users.map((user) => (
              <div
                key={user._id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-200"
              >
                <div className="bg-gray-400 text-white p-3 rounded-full">
                  <i className="ri-user-fill"></i>
                </div>
                <span className="ml-3 text-gray-800">{user.email}</span>
              </div>
            ))}
          </div>
        </aside>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[400px] p-6">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select Users</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                <i className="ri-close-line"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 max-h-[300px] overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserClick(user._id)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    selectedUserIds.has(user._id)
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <div className="bg-gray-400 text-white p-3 rounded-full">
                    <i className="ri-user-fill"></i>
                  </div>
                  <span className="ml-3">{user.email}</span>
                </div>
              ))}
            </div>
            <button
              onClick={addCollaborators}
              className="w-full mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;
