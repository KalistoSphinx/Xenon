import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import {Ellipsis} from "@hugeicons/core-free-icons";
import {StarIcon} from "lucide-react"

export function NoteCard() {
  return (
    <Card size="sm" className="group transition-all duration-200 ease-in-out hover:-translate-y-0.5">
      <CardContent className="flex justify-between -mb-2">
        <div className="flex items-center gap-1.5 text-amber-600">
            <span className="size-1.5 rounded-full bg-amber-600" />
            <p className="text-xs">Research</p>
        </div>
        <CardAction className="flex items-center gap-2 text-muted-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <StarIcon size={14} strokeWidth={2} className="pointer transition-all duration-200 hover:scale-120"></StarIcon>
            <span className="p-1">
              <HugeiconsIcon size={18} icon={Ellipsis} strokeWidth={2} />
            </span>
        </CardAction>
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
        <CardDescription className="text-[11px]">2m ago</CardDescription>
      </CardFooter>
    </Card>
  );
}
