// app/conversation/page.tsx
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
import { MessageSquare } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty"),
});

const ConversationPage = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage = { role: "user", content: values.prompt };
      const newMessages = [...messages, userMessage];

      // Call your API route
      const response = await axios.post("/api/conversation", {
        prompt: values.prompt,
      });

      const botMessage = response.data;

      setMessages((current) => [...current, userMessage, botMessage]);
      form.reset();
    } catch (error: any) {
      console.error("Error generating response:", error);
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced AI conversation model."
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="Start typing here..."
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
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user" ? "text-blue-500" : "text-gray-800"
                }
              >
                {message.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;