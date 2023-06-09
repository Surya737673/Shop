import React, { useEffect, useState } from 'react'
import { backend_url, server } from '../../server';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DashboardMessages = () => {
  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      <h1 className="text-center text-[30px] py-3 font-Poppins">
        All Messages
      </h1>
      {/* All messages list */}
      <MessageList />
    </div>
  )
}

const MessageList = ({ }) => {



  return (
    <div className={`w-full flex p-3 px-3 `}>
      <div className="relative">
        <img // src={`${backend_url}${user?.avatar}`}
         alt="" className="w-[50px] h-[50px] rounded-full" />
        {/* {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
        )} */}
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{'Shahriar'}</h1>
        <p className="text-[16px] text-[#000c]">
          this is a paragraph
          {/* {data?.lastMessageId !== user?._id
            ? "You:"
            : user?.name.split(" ")[0] + ": "}{" "}
          {data?.lastMessage} */}
        </p>
      </div>
    </div>
  );
};

export default DashboardMessages