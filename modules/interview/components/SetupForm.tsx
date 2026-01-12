"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  interviewSetupSchema,
  type InterviewSetupFormData,
  JOB_ROLES,
  EXPERIENCE_LEVELS,
  FOCUS_AREAS,
  LANGUAGES,
} from "@/modules/interview/schemas";
import { useCreateInterviewSetup } from "../hooks/use-interview-setup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function SetupForm() {
  const router = useRouter();
  const { mutate: createSetup, isPending, error } = useCreateInterviewSetup();

  const form = useForm<InterviewSetupFormData>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: {
      jobRole: "",
      experienceLevel: "",
      focusAreas: [],
      language: "",
    },
  });

  const onSubmit = (data: InterviewSetupFormData) => {
    createSetup(data);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <Card className="glass shadow-xl border-border/50 scale-in">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl gradient-text fade-in">
            Create Interview Setup
          </CardTitle>
          <CardDescription
            className="fade-in text-base"
            style={{ animationDelay: "100ms" }}
          >
            Configure your interview parameters to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive fade-in">
                  {error.message}
                </div>
              )}

              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="border-b border-border/50 pb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Tell us about the role and your experience level
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="jobRole"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base">Job Role</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Select a job role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-base">
                          Experience Level
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11 w-full">
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EXPERIENCE_LEVELS.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Focus Areas Section */}
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-2">
                  <FormLabel className="text-lg font-semibold">
                    Focus Areas
                  </FormLabel>
                  <FormDescription className="text-sm mt-1">
                    Select at least one focus area for the interview
                  </FormDescription>
                </div>
                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={() => (
                    <FormItem>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {FOCUS_AREAS.map((area) => (
                          <FormField
                            key={area}
                            control={form.control}
                            name="focusAreas"
                            render={({ field }) => {
                              const isChecked = field.value?.includes(area);
                              return (
                                <FormItem
                                  key={area}
                                  className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border border-border/50 p-3 hover:bg-accent/50 transition-colors cursor-pointer"
                                  onClick={() => {
                                    const newValue = isChecked
                                      ? field.value?.filter(
                                          (value) => value !== area
                                        )
                                      : [...(field.value || []), area];
                                    field.onChange(newValue);
                                  }}
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...(field.value || []),
                                              area,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== area
                                              )
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal cursor-pointer flex-1">
                                    {area}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage className="mt-2" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Language Section */}
              <div className="space-y-4">
                <div className="border-b border-border/50 pb-2">
                  <FormLabel className="text-lg font-semibold">
                    Language Settings
                  </FormLabel>
                  <FormDescription className="text-sm mt-1">
                    This will determine which STT model is loaded
                  </FormDescription>
                </div>
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.value} value={lang.value}>
                              {lang.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="sm:flex-1 border-2 hover:bg-accent/50 transition-all h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="sm:flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 transition-all hover:scale-105 h-11 text-base font-semibold"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Creating...
                    </span>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
