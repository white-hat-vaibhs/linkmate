import React, { useEffect, useState } from "react";
import { supabase } from "../lib/helper/supabaseClient";

export default function Homepage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.refreshSession();
      const { user } = data;
      setUser(user);

      const { data: authListner } = supabase.auth.onAuthStateChange(
        (event, session) => {
          switch (event) {
            case "SIGNED_IN":
              setUser(session.user);
              break;
            case "SIGNED_OUT":
              setUser(null);
              break;
            default:
          }
          console.log(user);
        }
      );
      return () => {
        authListner.unsubscribe();
      };
    };

    fetchSession();
  }, []);

  return (
    <div>
      {user ? <>User is logged in as {user.email}</> : <>Please log in</>}
    </div>
  );
}
