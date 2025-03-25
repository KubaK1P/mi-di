import Navbar from "../components/Navbar/Navbar";

export default function MainLayout({ children }) {
    return (
        <div className="pt-[96px]">
            <Navbar></Navbar>
            {children}
        </div>
    );
  }