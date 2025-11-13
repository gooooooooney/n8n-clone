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
import { useEffect } from "react";

// export const AVAILABLE_MODEL = [
//   "gemini-1.5-flash",
//   "gemini-1.5-flash-8b",
//   "gemini-1.5-pro",
//   "gemini-1.0-pro",
//   "gemini-pro",
// ] as const


const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { error: " Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      error: "Variable name must start with a letter or underscore and container only letters, numbers, and underscores"
    })
  ,
  // model: z.enum(AVAILABLE_MODEL),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { error: "User prompt is required" })
});

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  onSubmit?: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<OpenAIFormValues>
}

export type OpenAIFormValues = z.infer<typeof formSchema>;

export const OpenAIDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}: Props) => {
  const form = useForm<OpenAIFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues?.variableName || "",
      // model: defaultValues?.model || AVAILABLE_MODEL[0],
      systemPrompt: defaultValues?.systemPrompt || "",
      userPrompt: defaultValues?.userPrompt || "",
    },
  });


  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues?.variableName || "",
        // model: defaultValues?.model || AVAILABLE_MODEL[0],
        systemPrompt: defaultValues?.systemPrompt || "",
        userPrompt: defaultValues?.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "openai"



  const handleSubmit = (values: OpenAIFormValues) => {
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
            OpenAI Configure
          </DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
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
                    <Input placeholder="openai" {...field} />
                  </FormControl>
                  <FormDescription>
                    Use this name to reference the result in other nodes: {" "}
                    {`{{${watchVariableName}.text}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {
                        AVAILABLE_MODEL.map(model => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The Google Openai model to use for completion
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}



            <FormField
              control={form.control}
              name="systemPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Prompt (Optional)</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] font-mono text-sm" placeholder="You are a helpful assistant." {...field} />
                  </FormControl>
                  <FormDescription>
                    Sets the behavior of the assistant. Use {"{{Variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="userPrompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Prompt</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px] font-mono text-sm" placeholder="Summarize this text: {{json httpResponse.data}}" {...field} />
                  </FormControl>
                  <FormDescription>
                    The prompt to send to the AI. Use {"{{Variables}}"} for simple values or {"{{json variable}}"} to stringify objects.
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