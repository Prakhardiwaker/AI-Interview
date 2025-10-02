import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from "@clerk/clerk-react";
import { Menu, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../common/ThemeToggle";
import { APP_NAME, ROUTES } from "../../lib/constants";
import { cn } from "../../lib/utils";

export const Navbar = ({ onMenuClick }) => {
  const location = useLocation();

  const navLinks = [
    { name: "Dashboard", path: ROUTES.DASHBOARD },
    { name: "Interviews", path: ROUTES.INTERVIEWS },
    { name: "My Profile", path: ROUTES.MYPROFILE },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left section - Logo and Nav Links */}
        <div className="flex items-center gap-6">
          {/* Mobile menu button */}
          <SignedIn>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SignedIn>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline-block font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {APP_NAME}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <SignedIn>
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "font-medium",
                      location.pathname === link.path && "bg-accent"
                    )}
                  >
                    {link.name}
                  </Button>
                </Link>
              ))}
            </div>
          </SignedIn>
        </div>

        {/* Right section - Theme toggle and User menu */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <SignedIn>
            <UserButton
              userProfileMode="navigation" // ✅ optional: can use Clerk profile menu
              userProfileUrl={ROUTES.PROFILE}
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button className="gradient-primary text-white">Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};
