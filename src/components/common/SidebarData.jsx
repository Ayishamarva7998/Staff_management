import { IoMdMail, IoMdPeople, IoMdCash } from "react-icons/io";
import {  MdGroups } from "react-icons/md";
import { IoPersonAdd } from "react-icons/io5";
import { SiGooglemeet } from "react-icons/si";

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
  { title: "Meetings", icon: <SiGooglemeet size={iconSize} />, url: "meeting" },
  { title: "Add New Staff", icon: <IoPersonAdd size={iconSize} />, url: "add-new-staff" },
];

export const Datas = worker === 'admin' ? adminData :worker==='advisors'? advisoreData: reviewersData;
