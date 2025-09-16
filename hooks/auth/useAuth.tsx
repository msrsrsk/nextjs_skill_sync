import { useSession, signIn, signOut } from "next-auth/react"

const useAuth = () => {
    const { data: session, status } = useSession();

    return {
        user: session?.user || null,
        session,
        loading: status === "loading",
        isAuthenticated: status === "authenticated",
        signIn,
        signOut
    }
}

export default useAuth