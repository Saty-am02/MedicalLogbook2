// Library Imports
import React, { useState } from "react";

// Local Imports
import Navbar from "../../Components/Admin/Navbar";
import Announcement from "./Announcement";
import Createannouncement from "./CreateAnnouncement";
import EditAnnouncement from "./EditAnnouncement";
import LogoNav from "../../Components/Admin/LogoNav";

const Announcementhomepage = () => {
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showcreateAnnouncement, setShowcreateAnnouncement] = useState(false);
  const [showeditAnnouncement, setShoweditAnnouncement] = useState(false);

  const handleOptions = (component) => {
    if (component === "Announcement") {
      setShowAnnouncement(true);
      setShowcreateAnnouncement(false);
      setShoweditAnnouncement(false);
    } else if (component === "Createannouncement") {
      setShowAnnouncement(false);
      setShowcreateAnnouncement(true);
      setShoweditAnnouncement(false);
    } else if (component === "Home") {
      setShowAnnouncement(false);
      setShowcreateAnnouncement(false);
      setShoweditAnnouncement(false);
    }
  };

  return (
    <section className="oveflow-hidden">
      <LogoNav />
      <Navbar />
   
      
        <div className="absolute h-full">
      
        
          <nav className="sideb h-full flex flex-col bg-blue-950">

            <button onClick={() => handleOptions("Home")} className="w-100 rounded-md h-10 flex justify-center items-center px-4 text-white bg-blue-600 ">
              <i class="fa-solid fa-house pr-2" style={{ color: "#ffffff" }} />
              <p className="relative top-2 text-base">Home</p>
            </button>

            <button onClick={() => handleOptions("Announcement")} className="w-100 rounded-md h-10 flex justify-center items-center px-4 text-white bg-blue-600 ">
              <i class="fa-solid fa-bullhorn p-2" style={{ color: "#ffffff" }} />
              <p className="relative top-2 text-base">Announcement</p>
            </button>

            <button onClick={() => handleOptions("Createannouncement")} className="w-100 rounded-md h-10 flex justify-center items-center px-4 text-white bg-blue-600 ">
              <i class="fa-solid fa-scroll p-2" style={{ color: "#ffffff" }} />
              <p className="relative top-3 text-base mr-2">Create <span className="w-40 relative -top-2 break-words">Announcement</span></p>
            </button>
          </nav>
        </div>
        {showAnnouncement && <Announcement />}
        {showeditAnnouncement && <EditAnnouncement />}
        {showcreateAnnouncement && <Createannouncement />}
 
    </section>
  );
};

export default Announcementhomepage;