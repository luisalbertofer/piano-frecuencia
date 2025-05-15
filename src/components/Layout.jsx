import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/animationVariants";

const Layout = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <motion.main
        className="flex-grow max-w-6xl mx-auto p-4 w-full"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
