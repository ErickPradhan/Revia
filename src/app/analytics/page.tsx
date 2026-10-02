import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your study progress and performance.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
          <CardDescription>
            Analytics functionality is coming in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">
              Analytics functionality is coming in a later phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
