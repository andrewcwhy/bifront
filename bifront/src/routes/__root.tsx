import { createRootRoute, Outlet } from "@tanstack/react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const Route = createRootRoute({
	component: Root,
});

// This route is the root of the application and will be used to wrap all other routes.
function Root() {
	return (
        <>
        <NavBar />
        <Outlet />
        <Footer />
        </>
	);
}
