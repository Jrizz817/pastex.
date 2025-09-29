import { useRouter } from "next/router";

export default function Header({ user }) {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-lg">
      <h1 className="text-2xl font-bold animate-pulse">Pastex</h1>
      <div>
        <span className="mr-4">{user}</span>
        <button className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-200" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
