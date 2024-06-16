'use client'

import { AsideContext } from "@/libs/contexts/AsideContext";
import { useContext, useEffect } from "react";

export default function Home() {
  const { asideDispatch } = useContext(AsideContext)

  useEffect(() => {
    asideDispatch({
      type: 'SET_NAVIGATION',
      payload: []
    });
  }, [asideDispatch]);
  
  return (
    <div>s</div>
  );
}
