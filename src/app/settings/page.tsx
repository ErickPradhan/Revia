import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your Revia preferences.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Settings functionality is coming in a later phase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
            <p className="text-sm text-muted-foreground">
              Settings functionality is coming in a later phase.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
