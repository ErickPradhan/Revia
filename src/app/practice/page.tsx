import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PracticePage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Practice
        </h1>
        <p className="text-muted-foreground">
          Practice with questions from your materials.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Practice</CardTitle>
          <CardDescription>
            Practice functionality is coming in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">
              Practice functionality is coming in a later phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
