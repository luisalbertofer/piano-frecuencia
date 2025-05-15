import React from "react";
import { Github, Linkedin } from "lucide-react";

const version = window.appVersion || "desconocida";

const Footer = () => {
  return (
    <footer className="w-full border-t mt-8 pt-6 pb-6 text-center text-sm text-gray-600 bg-white">
      <p>
        © {new Date().getFullYear()} Piano Frecuencia Visual · Desarrollado por Luis Alberto Fernández Álvarez
      </p>
      <p className="mt-1">
        Proyecto educativo y de entrenamiento auditivo · React + Tone.js
      </p>
      <p className="mt-2 text-xs text-gray-400">
        Versión: {version}
      </p>
      <div className="mt-4 flex justify-center gap-6">
        <a
          href="https://github.com/luisalbertofer/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-black transition"
          title="GitHub"
        >
          <Github className="w-5 h-5 inline" />
        </a>

        <a
          href="https://www.linkedin.com/in/luis-alberto-fern%C3%A1ndez-4a49565/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 hover:text-blue-900 transition"
          title="LinkedIn"
        >
          <Linkedin className="w-5 h-5 inline" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
