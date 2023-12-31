import { Button } from "@mui/material";
import { signIn, signOut, useSession } from "next-auth/react";

export function ButtonSign() {
    const { data: session }: any = useSession();

    if (session && session.user) {
        return (
            <>
                <div className="user-login">{session.user?.username}</div>
                <div>
                    <Button variant="outlined" color="inherit" type="button" onClick={() => signOut()}>
                        Sing Out
                    </Button>
                </div>
            </>
        );
    } else {
        return (
            <Button variant="outlined" color="inherit" type="button" onClick={() => signIn()}>
                Sing In
            </Button>
        );
    }
}