import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Sprint Planning</CardTitle>
          <CardDescription>Estimate your user stories with your team.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Create a new room to start a planning session with your team. Share the room link for team-collaboration in real-time.</p>
        </CardContent>
        <CardFooter>
          <Link href={"/create-room"} className="w-full">
            <Button className="w-full">Create a new room</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
