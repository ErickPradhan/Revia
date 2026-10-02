"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, ClipboardList, Sparkles } from "lucide-react";
import Link from "next/link";

import { useMaterials } from "@/lib/materials/store";

export function DashboardClient() {
  const { materials } = useMaterials();
  const recentMaterials = [...materials].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Good afternoon
        </h1>
        <p className="text-muted-foreground">Ready to study?</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-base font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-colors hover:bg-surface-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Upload Material</CardTitle>
              </div>
              <CardDescription>Add study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/materials">
                <Button className="w-full">Upload Material</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border-strong transition-colors hover:bg-surface-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Brain className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Start Practice</CardTitle>
              </div>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                Start Practice
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border-strong transition-colors hover:bg-surface-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ClipboardList className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Take Exam</CardTitle>
              </div>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                Take Exam
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-border-strong transition-colors hover:bg-surface-muted/50">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-muted-foreground" />
                <CardTitle className="text-sm">Ask AI</CardTitle>
              </div>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full" disabled>
                Ask AI
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{materials.length}</p>
            <p className="text-xs text-muted-foreground">
              {materials.length === 0 ? "No materials yet" : "Total materials"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Questions Practiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No study data yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Exams Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No study data yet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Current Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No study data yet</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Continue Studying</CardTitle>
            <CardDescription>Your recent study materials will appear here.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMaterials.length === 0 ? (
              <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                <p className="text-sm text-muted-foreground">
                  Your recent study materials will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentMaterials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between rounded-md border border-border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{material.displayName}</p>
                      <p className="text-xs text-muted-foreground">
                        {material.type.toUpperCase()} • {new Date(material.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak Topics</CardTitle>
            <CardDescription>
              Complete some practice sessions to identify weak topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[120px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
              <p className="text-sm text-muted-foreground">
                Complete some practice sessions to identify weak topics.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
