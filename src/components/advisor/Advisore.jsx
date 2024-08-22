import { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import Header from "../common/Header";
import { FaBusinessTime } from "react-icons/fa";
import { FaCalendarCheck } from "react-icons/fa";
import Inbox from "./pages/Inbox";
import ReviewsTime from "./pages/ReviewsTime";
import ReviewsTaken from "./pages/ReviewsTaken";



const Advisor = () => {
  const [open, setOpen] = useState(true);
  const iconSize = 24;
  const { rout } = useParams();
  const Data = [
    { title: "Inbox", icon: <IoMdMail size={iconSize} />, url: "inbox" },
    { title: "Review Time", icon: <FaBusinessTime size={iconSize} />, url: "review-time",gap:true },
    { title: "Review Booked", icon: <FaCalendarCheck size={iconSize} />, url: "review-booked",gap:true },
  ];
  


  return (
    <div className="flex">
      <div
        className={`${
          open ? "w-52" : "w-20"
        } bg-white h-screen p-5 pt-8 relative duration-300 border-r border-gray-200`}
      >
        <div
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-300 border-2 rounded-full ${
            !open && "rotate-180"
          }`}
          onClick={() => setOpen(!open)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="size-5"
          >
            <g clipPath="url(#a)">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.25-7.25a.75.75 0 0 0 0-1.5H8.66l2.1-1.95a.75.75 0 1 0-1.02-1.1l-3.5 3.25a.75.75 0 0 0 0 1.1l3.5 3.25a.75.75 0 0 0 1.02-1.1l-2.1-1.95h4.59Z"
                clipRule="evenodd"
              />
            </g>
            <defs>
              <clipPath id="a">
                <path d="M0 0h20v20H0z" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="flex gap-x-4 items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUsj969OxAXIdz0f33l_yF02ZyMY5aLHclIA&s"
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            } w-auto h-auto rounded-full border-2 border-gray-200`}
            alt="Profile"
          />
        </div>
        <ul className="pt-6">
          {Data.map((data, index) => (
            <Link key={index} to={`/advisor/${data.url}`}>
              {" "}
              <li
                key={index}
                className={`flex rounded-md p-2 cursor-pointer hover:bg-gray-100 text-dark-gray text-sm items-center gap-x-4 ${
                  data.gap ? "mt-9" : "mt-2"
                } ${data.url === rout && "bg-gray-100"}`}
              >
                {data.icon}
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {data.title}
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <div className="h-screen flex-1 w-100 overflow-auto">
      <Header rout={rout} />
      
     
        {rout === "inbox" ? (
          <Inbox/>
        ) : rout === "review-time" ? (
        <ReviewsTime/>
        ) : rout === "review-booked" ? (
          <ReviewsTaken/>
        ) :rout === 'meeting'? (
          <h1>Not found the Page </h1>
        ): rout=== '' ?(
          <h1>Not found the Page </h1>
        ):''}
      </div>
    </div>
  );
};

export default Advisor;
