"use client";

import { logoutAction } from "@/actions";
import { Button } from "../ui/button";

function Logout() {
  const handleLogout = async () => {
    await logoutAction();
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}

export default Logout;
