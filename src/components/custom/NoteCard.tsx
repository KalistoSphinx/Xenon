import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

export function NoteCard() {
  return (
    <Card size="sm" className="transition-all duration-200 ease-in-out hover:-translate-y-0.5">
      <CardContent className="flex items-center gap-2 text-amber-600">
        <span className="size-1.5 rounded-full bg-amber-600" />
        <p className="text-xs">Research</p>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-sm">
          Reading list - distributed systems
        </CardTitle>
        <CardDescription className="text-xs">
          Papers to read: Dynamo (Amazon), Raft Consensus, Spanner, Bigtable,
          MapReduce, Chord DHT.
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      <Separator />
      <CardFooter>
        <CardDescription className="text-xs">2m ago</CardDescription>
      </CardFooter>
    </Card>
  );
}
