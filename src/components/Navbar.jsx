import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Piano, Headphones, Menu, X } from "lucide-react";

const navItems = [
  { path: "/", label: "Piano", icon: <Piano className="w-4 h-4 mr-1" /> },
  { path: "/comparador", label: "Comparador", icon: <Headphones className="w-4 h-4 mr-1" /> },
];

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="w-full bg-white shadow-sm p-4 mb-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo o título si lo necesitas */}
        <div className="text-xl font-bold text-blue-600">🎵 Piano Frecuencia</div>

        {/* Botón hamburguesa en móvil */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-blue-600">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Enlaces en escritorio */}
        <div className="hidden md:flex gap-6 relative">
          {navItems.map(({ path, label, icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={path}
                to={path}
                className={`relative px-4 py-2 rounded flex items-center gap-1 font-semibold transition-all duration-200
                  ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg"
                      : "text-blue-600 hover:bg-blue-100"
                  }
                `}
              >
                {icon}
                {label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavUnderline"
                    className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 rounded shadow-md"
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  />
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Menú desplegable móvil */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 flex flex-col gap-2"
          >
            {navItems.map(({ path, label, icon }) => {
              const isActive = location.pathname === path;
              return (
                <NavLink
                  key={path}
                  to={path}
                  onClick={closeMenu}
                  className={`px-4 py-2 rounded flex items-center gap-2 font-semibold transition-all duration-200
                    ${
                      isActive
                        ? "text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow"
                        : "text-blue-600 hover:bg-blue-100"
                    }
                  `}
                >
                  {icon}
                  {label}
                </NavLink>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
