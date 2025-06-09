import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 to-blue-700 text-white">
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold">Task Manager App</h1>
        <nav className="flex space-x-4">
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-blue-600 rounded px-3 py-1 font-medium hover:bg-blue-100 transition"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex flex-1 flex-col justify-center items-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Organize Your Tasks Effortlessly
        </h2>
        <p className="text-lg md:text-xl max-w-md mb-8">
          Collaborate, manage, and track your tasks efficiently with our powerful task manager app.
        </p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-100 transition"
        >
          Get Started
        </Link>
      </main>

      <footer className="text-center py-4 text-sm bg-blue-800">
        &copy; {new Date().getFullYear()} Task Manager App. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
