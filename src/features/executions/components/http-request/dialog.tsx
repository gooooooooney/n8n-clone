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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { useEffect } from "react";


const formSchema = z.object({
  endpoint: z.url({ message: "Please enter a valid URL" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body:
    z.string()
      .optional()
  // .refine()
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  defaultEndpoint?: string;
  defaultMethod?: "GET" | "POST" | "PUT" | "DELETE";
  defaultBody?: string;
}

export type HttpRequestFormValues = z.infer<typeof formSchema>;

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultEndpoint = "",
  defaultMethod = "GET",
  defaultBody = "",
}: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultEndpoint,
      method: defaultMethod,
      body: defaultBody,
    },
  });


  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultEndpoint,
        method: defaultMethod,
        body: defaultBody,
      });
    }
  }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

  const watchMethod = form.watch("method");

  const showBodyField = ["POST", "PUT", "PUT"].includes(watchMethod);

  const handleSubmit = (values: HttpRequestFormValues) => {
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
            HTTP Request Settings
          </DialogTitle>
          <DialogDescription>
            Configure Settings for the HTTP Request Node here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input placeholder={`https://api.example.com/data/{{httpResponse.data.id}}`} {...field} />
                  </FormControl>
                  <FormDescription>
                    Static URL or use {"{{Variables}}"} for simple values or {"{{json variable}}"} to stringify objects
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HTTP Method</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    The HTTP method to use for the request.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {
              showBodyField && (
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Body</FormLabel>
                      <FormControl>
                        <Textarea className="min-h-[120px] font-mono text-sm" placeholder={
                          `{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": {{httpResponse.data.items}}\n}`
                        } {...field} />
                      </FormControl>
                      <FormDescription>
                        JSON with template variables. Use {"{{Variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            }

            <DialogFooter className="mt-4">
              <Button type="submit">save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}