// app/code/page.tsx
"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import Heading from "@/components/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Code } from "lucide-react";

// Schema for form validation
const formSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

const CodeGenerationPage = () => {
  const [generatedCode, setGeneratedCode] = useState<string>("");

  // React Hook Form for handling input
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Call your API route
      const response = await axios.post("/api/code", {
        prompt: values.prompt,
      });

      // Extract and set the generated code
      setGeneratedCode(response.data.generatedCode);
      form.reset();
    } catch (error: any) {
      console.error("Error generating code:", error);
    }
  };

  return (
    <div>
      <Heading
        title="Code Generation"
        description="Generate code snippets with AI."
        icon={Code}
        iconColor="text-green-500"
        bgColor="bg-green-500/10"
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        {...field}
                        placeholder="Describe the code you want to generate..."
                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                        disabled={isLoading}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {generatedCode && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <pre className="whitespace-pre-wrap break-words">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeGenerationPage;