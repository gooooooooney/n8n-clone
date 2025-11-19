"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";



const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: " Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores"
    })
  ,
  content: z.string()
    .min(1, { error: "Message is required" }),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackFormValues>
}

export type SlackFormValues = z.infer<typeof formSchema>;

export const SlackDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {

  const form = useForm<SlackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      content: defaultValues?.content || "",
      webhookUrl: defaultValues?.webhookUrl || "",
    },
  });


  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        content: defaultValues?.content || "",
        webhookUrl: defaultValues?.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "slack"



  const handleSubmit = (values: SlackFormValues) => {
    onSubmit?.(values);
    onOpenChange(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Slack Configure
          </DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >

            <FormField
              control={form.control}
              name="variableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input placeholder="slack" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes: {" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="webhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook URL</FormLabel>
                  <FormControl>
                    <Input className=" font-mono text-sm" placeholder="https://slack.com/api/webhooks/..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Get this from slack: Channel Settings {"->"} Integrations {"->"} Webhooks
                  </FormDescription>
                  <FormDescription>
                    Make sure the "key" is "content"
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content </FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] font-mono text-sm" placeholder="Summary: {{slack.text}}" {...field} />
                  </FormControl>
                  <FormDescription>
                    The message to send. Use {"{{Variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit">save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}