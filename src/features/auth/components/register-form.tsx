"use client"

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.email("Please enter a valid email"),
  password: z.string().min(1, "Password is required").max(18),
  confirmPassword: z.string().min(1, "Confirm Password is required").max(18),
})
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const router = useRouter()
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {

      await authClient.signUp.email(
        {
          name: data.email,
          email: data.email,
          password: data.password,
          callbackURL: "/"
        },
        {
          onSuccess: () => {
            router.push('/')
          },
          onError: (ctx) => {
            toast.error(ctx.error.message);
          }
        })
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const signInGithub = async () => {
    await authClient.signIn.social({
      provider: "github"
    }, {
      onSuccess: () => {
        router.push('/')
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      }
    })
  }
  const signInGoogle = async () => {
    await authClient.signIn.social({
      provider: "google"
    }, {
      onSuccess: () => {
        router.push('/')
      },
      onError: (ctx) => {
        toast.error(ctx.error.message);
      }
    })
  }

  const isPending = form.formState.isSubmitting;

  return (
    <div>
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>
            Get Started
          </CardTitle>
          <CardDescription>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} >
              <div className='grid gap-6'>
                <div className='flex flex-col gap-4'>
                  <Button variant="outline"
                    className='w-full'
                    onClick={signInGithub}
                    type="button"
                    disabled={isPending}
                  >
                    <Image src="/logos/github.svg" alt="Github Logo" width={20} height={20} />

                    Continue with Github
                  </Button>
                  <Button variant="outline"
                    className='w-full'
                    type="button"
                    onClick={signInGoogle}
                    disabled={isPending}
                  >
                    <Image src="/logos/google.svg" alt="Google Logo" width={20} height={20} />

                    Continue with Google
                  </Button>
                </div>
                <div className='grid gap-6'>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="********" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className='w-full' disabled={isPending}>Sign up</Button>
                </div>
                <div className='text-center text-sm'>
                  Already have an account? {" "}
                  <Link href="/login" className='underline underline-offset-4'>
                    Login
                  </Link>

                </div>
              </div>


            </form>
          </Form>
        </CardContent>
      </Card>

    </div>
  );
}
