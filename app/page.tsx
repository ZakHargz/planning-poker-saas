import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">SprintSync</span>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <main className="pt-20">
        <div className="relative isolate">
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Plan Sprints Together, <span className="text-blue-600">In Real-Time</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Streamline your agile planning sessions with collaborative tools designed for modern teams.
                Create or join a room to start planning your next sprint.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button className="rounded-md w-[350px]" size={"lg"} asChild>
                  <Link href={"/create"}>Create Room</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-50 static bottom-0">
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 flex justify-between mb-2">
          <p className="text-gray-500">© {new Date().getFullYear()} SprintSync. All rights reserved.</p>
          <p className="text-gray-500">Streamline your agile planning sessions with real-time collaboration.</p>
        </div>
      </footer>
    </div>
  );
}
