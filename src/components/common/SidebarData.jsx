import { IoMdMail, IoMdPeople, IoMdCash } from "react-icons/io";
import {  MdEventBusy, MdGroups, MdWorkHistory } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { SiGooglemeet } from "react-icons/si";
import { FaBusinessTime } from "react-icons/fa6";
import { TbCalendarTime } from "react-icons/tb";
import { FaCalendarTimes } from "react-icons/fa";

let worker = 'admin';
const iconSize = 24; // Adjust the size as needed

const adminData = [
  { title: "Inbox", icon: <IoMdMail size={iconSize} />, url: "inbox" },
  { title: "Advisors", icon: <MdGroups size={iconSize} />, url: "advisors", gap: true },
  { title: "Reviewers", icon: <IoMdPeople size={iconSize} />, url: "reviewers" },
  { title: "Meetings", icon: <SiGooglemeet size={iconSize} />, url: "meeting", gap: true },
  { title: "Add Staff", icon: <IoPersonAdd size={iconSize} />, url: "add-new-staff" },
];

const advisoreData = [
  { title: "Inbox", icon: <IoMdMail size={iconSize} />, url: "inbox" },
  { title: "Meetings", icon: <SiGooglemeet size={iconSize} />, url: "meeting" },
  { title: "Schedule Review", icon: <SiGooglemeet size={iconSize} />, url: "schedule-review" },
];

const reviewersData = [
  { title: "Inbox", icon: <IoMdMail size={iconSize} />, url: "inbox",   },
  { title: "Schedule Time", icon: <FaCalendarTimes size={iconSize} />, url: "schedule-time" ,gap: true},
  { title: "Work Time", icon: <MdWorkHistory  size={iconSize} />, url: "work-time" },
];

export const Datas = worker === 'admin' ? adminData :worker==='advisors'? advisoreData: reviewersData;
