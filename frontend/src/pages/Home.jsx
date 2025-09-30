import { useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Button } from "../components/ui/button";
import { ArrowRight, Sparkles, Target, TrendingUp, Clock } from "lucide-react";
import { ROUTES } from "../lib/constants";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Questions",
      description:
        "Get personalized interview questions tailored to your role and experience",
    },
    {
      icon: Target,
      title: "Real-time Feedback",
      description:
        "Receive instant feedback on your answers to improve your performance",
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your improvement over time with detailed analytics",
    },
    {
      icon: Clock,
      title: "Practice Anytime",
      description: "Practice at your own pace, whenever and wherever you want",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-purple-950/20 dark:via-blue-950/20 dark:to-cyan-950/20" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 animate-fade-in">
                <Sparkles className="h-4 w-4" />
                AI-Powered Interview Platform
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-slide-in">
                Ace Your Next Interview
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground animate-slide-in">
                Practice with AI-powered mock interviews, get real-time
                feedback, and land your dream job with confidence.
              </p>

              <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 animate-slide-in">
                <SignedIn>
                  <Button
                    size="lg"
                    className="gradient-primary text-white"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignedIn>

                <SignedOut>
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </SignedOut>
              </div>

              {/* Stats */}
              <SignedOut>
                <div className="mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                  <div>
                    <div className="text-2xl font-bold text-primary">10k+</div>
                    <div className="text-sm text-muted-foreground">
                      Active Users
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">50k+</div>
                    <div className="text-sm text-muted-foreground">
                      Interviews
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                </div>
              </SignedOut>
            </div>

            {/* Right Content - Login Card */}
            <SignedOut>
              <div className="relative animate-fade-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25"></div>
                <div className="relative bg-card border rounded-2xl p-8 shadow-xl">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">Get Started Today</h2>
                    <p className="text-muted-foreground mt-2">
                      Join thousands preparing for their dream job
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Sign Up Button */}
                    <SignInButton
                      mode="modal"
                      forceRedirectUrl={ROUTES.DASHBOARD}
                    >
                      <Button
                        size="lg"
                        className="w-full gradient-primary text-white"
                      >
                        <Sparkles className="mr-2 h-5 w-5" />
                        Create Free Account
                      </Button>
                    </SignInButton>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          Already have an account?
                        </span>
                      </div>
                    </div>

                    {/* Login Button for Returning Users */}
                    <SignInButton
                      mode="modal"
                      forceRedirectUrl={ROUTES.DASHBOARD}
                    >
                      <Button size="lg" variant="outline" className="w-full">
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </SignInButton>
                  </div>

                  <div className="mt-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="flex flex-col items-center">
                        <div className="text-primary font-bold text-xl">1</div>
                        <div className="text-xs text-muted-foreground">
                          Sign Up
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-primary font-bold text-xl">2</div>
                        <div className="text-xs text-muted-foreground">
                          Practice
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-primary font-bold text-xl">3</div>
                        <div className="text-xs text-muted-foreground">
                          Excel
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      By signing in, you agree to our Terms of Service and
                      Privacy Policy
                    </p>
                  </div>
                </div>
              </div>
            </SignedOut>

            {/* Alternative for signed in users */}
            <SignedIn>
              <div className="relative animate-fade-in">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25"></div>
                <div className="relative bg-card border rounded-2xl p-8 shadow-xl">
                  <div className="text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                      <Sparkles className="h-10 w-10" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
                    <p className="text-muted-foreground mb-6">
                      Ready to start your interview practice journey?
                    </p>
                    <Button
                      size="lg"
                      className="w-full gradient-primary text-white"
                      onClick={() => navigate(ROUTES.DASHBOARD)}
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive tools to help you prepare and excel in your
              interviews
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-16 text-center shadow-2xl sm:px-16">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Start Practicing?
              </h2>
              <p className="mt-4 text-lg text-purple-100">
                Join thousands of candidates who have improved their interview
                skills
              </p>
              <div className="mt-8">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="font-semibold"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="font-semibold"
                    onClick={() => navigate(ROUTES.INTERVIEWS)}
                  >
                    Start Your First Interview
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
