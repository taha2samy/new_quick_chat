# Gemini Chat: A Discord-Inspired Real-Time Chat Application

![Gemini Chat Screenshot](https://storage.googleapis.com/aistudio-project-assets/project-template-previews/discord_clone_preview.png)

## Overview

Gemini Chat is a feature-rich, modern, and fully responsive frontend application for a real-time chat service, heavily inspired by the user interface and experience of Discord. Built with **React** and **TypeScript**, this project serves as a comprehensive blueprint for a complex chat platform.

The application is designed to be **backend-agnostic**. While it currently uses the **Google Gemini API** to simulate real-time, intelligent conversations, it includes a detailed, in-app **API Portal** that provides a complete technical specification for a backend developer to build the required services.

---

## ✨ Key Features

- **Modern & Responsive UI**: A sleek, dark-themed, Discord-inspired interface that works seamlessly on both desktop and mobile devices.
- **Mocked Authentication**: A complete login/logout flow with a UI for both username/password and guest modes, including logout confirmation.
- **Comprehensive Server (Group) Management**:
  - **Create Servers**: An advanced form to create new servers with a name, icon, category, and multiple initial channels with specific permissions.
  - **Edit Server Settings**: A dedicated settings panel to modify a server's name and icon.
  - **Full Member Management**:
    - Invite users to a server with a specific role.
    - Remove members from a server (with confirmation).
    - Assign and modify member roles (`Admin` or `User`).
- **Advanced Channel Management**:
  - Create new channels within a server with a name, topic, and a unique icon.
  - **Channel Permissions**: Set channels as `Read-Write` (all members can post) or `Read-Only` (only Admins and the owner can post).
- **Role-Based Permissions System**:
  - **Owner**: Full control over the server.
  - **Admin**: Can manage the server and post in `Read-Only` channels.
  - **User**: Standard member permissions.
- **Intelligent Chat Simulation**:
  - Real-time conversations powered by the **Google Gemini API**.
  - Persistent, per-channel conversation history and context.
  - "User is typing..." indicator for bot responses.
- **User Profiles**:
  - View and edit your personal profile, including username, role, and avatar.
- **In-App Developer API Portal**:
  - A built-in, interactive modal that serves as a **complete backend specification**. It details all required data models, REST endpoints, error handling formats, and WebSocket events.

---

## 🛠️ Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **AI Backend (for simulation)**: Google Gemini API (`@google/genai`)
- **Dependencies**: No build step or package manager needed. Dependencies are loaded directly in the browser via `importmap`.

---

## 🚀 Getting Started

This project is designed to run directly in the browser without any build steps.

### Prerequisites

1.  A modern web browser (e.g., Chrome, Firefox, Edge).
2.  A valid Google Gemini **API Key**.

### Running the Application

1.  **Set up the API Key**: The application expects the API key to be available in the environment as `process.env.API_KEY`. In a local development environment, you can achieve this by running a simple server that injects this variable or by setting it manually in your browser's developer console for testing purposes:
    ```javascript
    // In the browser console, before the app loads:
    window.process = { env: { API_KEY: 'YOUR_API_KEY_HERE' } };
    ```
2.  **Serve the Files**: Open the `index.html` file using a local web server (like VS Code's "Live Server" extension). Directly opening the HTML file from the filesystem may not work due to browser security policies.

---

## 📁 Project Structure

The project is organized into a modular and maintainable structure:

```
.
├── components/         # Reusable React components
│   ├── ApiPortalModal.tsx
│   ├── ChannelList.tsx
│   ├── ChatView.tsx
│   ├── ConfirmationModal.tsx
│   ├── CreateChannelModal.tsx
│   ├── CreateGroupModal.tsx
│   ├── LoginPage.tsx
│   ├── ManageGroupModal.tsx
│   ├── MessageInput.tsx
│   ├── ServerList.tsx
│   ├── Sidebar.tsx
│   └── UserProfileModal.tsx
├── services/           # Modules for external services (e.g., Gemini API)
│   └── geminiService.ts
├── types.ts            # Centralized TypeScript type and interface definitions
├── App.tsx             # Main application component, manages state and logic
├── index.html          # The main HTML entry point
├── index.tsx           # React DOM entry point
└── README.md           # You are here!
```

---

## 🤝 Backend API Specification

A key feature of this project is the **in-app API Portal**. To view the complete backend specification:

1.  Run the application and log in.
2.  In the user panel at the bottom-left, click the **API icon**.

This portal provides your backend team with a detailed, interactive guide to building the necessary API, including data models, REST endpoints with error handling, and the WebSocket event architecture.

---

## 🔮 Future Development

This frontend provides a solid foundation. Future work could include:

-   **Backend Integration**: Connecting the frontend to a live backend built from the API specification.
-   **Real-time WebSockets**: Replacing the Gemini API calls with a real WebSocket connection for multi-user communication.
-   **User Presence**: Adding indicators for user status (Online, Idle, Offline).
-   **Direct Messaging**: Implementing one-on-one private conversations.
-   **Voice & Video Channels**: Adding support for real-time voice and video communication.
