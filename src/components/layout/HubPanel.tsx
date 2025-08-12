"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GoHomeFill, GoHome } from "react-icons/go";
import {
   IoChatbubbleEllipsesOutline,
   IoChatbubbleEllipsesSharp,
   IoSettings,
   IoSettingsOutline,
} from "react-icons/io5";
import HomeTabPanel from "./HomeTabPanel";
import ChatTabPanel from "./ChatTabPanel";
import SettingTabPanel from "./SettingsTabPanel";

export default function HubPanel() {
   const [activeTab, setActiveTab] = useState<"home" | "chat" | "settings">(
      "chat",
   );

   return (
      <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0, y: 20 }}
         transition={{ duration: 0.25 }}
         className="shadow-global fixed right-6 bottom-22 z-40 flex w-[90%] flex-col overflow-hidden rounded-2xl bg-white md:w-100 lg:bottom-24"
      >
         <section className="p-4 lg:p-5">
            {activeTab === "home" && <HomeTabPanel />}
            {activeTab === "chat" && <ChatTabPanel />}
            {activeTab === "settings" && <SettingTabPanel />}
         </section>

         <nav className="bg-bg-600 [&_button]:bg-bg-600 flex w-full p-1.5 [&_button]:flex [&_button]:flex-1 [&_button]:flex-col [&_button]:items-center [&_button]:gap-0.5 [&_button]:transition-colors [&_button]:duration-200 [&_svg]:size-6">
            <button
               onClick={() => setActiveTab("home")}
               className={`${
                  activeTab === "home"
                     ? "text-black-400"
                     : "hover:text-black-400 text-gray-900"
               }`}
            >
               {activeTab === "home" ? <GoHomeFill /> : <GoHome />}
               <span className="text-12-medium">홈</span>
            </button>

            <button
               onClick={() => setActiveTab("chat")}
               className={`${
                  activeTab === "chat"
                     ? "text-black-400"
                     : "hover:text-black-400 text-gray-900"
               }`}
            >
               {activeTab === "chat" ? (
                  <IoChatbubbleEllipsesSharp />
               ) : (
                  <IoChatbubbleEllipsesOutline />
               )}
               <span className="text-12-medium">대화</span>
            </button>

            <button
               onClick={() => setActiveTab("settings")}
               className={`${
                  activeTab === "settings"
                     ? "text-black-400"
                     : "hover:text-black-400 text-gray-900"
               }`}
            >
               {activeTab === "settings" ? (
                  <IoSettings />
               ) : (
                  <IoSettingsOutline />
               )}
               <span className="text-12-medium">설정</span>
            </button>
         </nav>
      </motion.div>
   );
}
