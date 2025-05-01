"use client"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

const Logout = () => {
  const route = useRouter();
    const handleClick= async ()=>{
        const res = await axios.post("/api/user/logout");
        console.log(res);
        route.push("/");
    }
  return (
    <Button onClick={handleClick} variant="danger" >Logout</Button>
    // <button onClick={handleClick}>Logout</button>
  )
}

export default Logout;