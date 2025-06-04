"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const Logout = () => {
  const route = useRouter();
    // const handleClick= async ()=>{
    //     const res = await axios.post("/api/user/logout");
    //     console.log(res);
    //     route.push("/");
    // }


    const handleClick = async () => {
      try {
        const res = await axios.post(
          "/api/user/logout",
          {},
          {
            withCredentials: true, // ✅ Send the token cookie
          }
        );
        console.log("Logout response:", res.data);
        route.push("/");
      } catch (err) {
        console.error("Logout error:", err);
      }
    };
  return (
    <Button onClick={handleClick} variant="danger" className='bg-red-500 text-white rounded-[4px]' >Logout</Button>
    // <button onClick={handleClick}>Logout</button>
  )
}

export default Logout;