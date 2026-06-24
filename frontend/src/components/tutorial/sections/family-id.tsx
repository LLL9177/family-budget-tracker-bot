import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { ChartLine, Users } from "lucide-react";

export default function FindFamilyId() {
  return (
    <Card className="backdrop-blur-2xl w-[80vw] rounded-3xl border dark:bg-card/80 p-8">
      <Badge className="bg-transparent text-primary">Step 2</Badge>
      <CardTitle className="mt-2 text-3xl font-bold">Find Family ID</CardTitle>
      <CardDescription className="text-[16px]">
        You can find your Family ID in either the Family page or the Dashboard.
      </CardDescription>
      <div className="grid gap-4 md:grid-cols-2 mt-2">
        <Card className="bg-transparent p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Family page</h3>
          <p className="text-sm text-muted-foreground">In the family data section, click the Family ID to copy it.</p>
        </Card>
        <Card className="bg-transparent p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <ChartLine className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-semibold">Family page</h3>
          <p className="text-sm text-muted-foreground">In the family data section, click the Family ID to copy it.</p>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button asChild>
            <a href="#user-id">Next: Find your User ID</a>
        </Button>
      </div>
    </Card>
  );
}
