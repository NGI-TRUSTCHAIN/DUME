'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';

import { paths } from '@/src/paths';
import {signIn} from "next-auth/react";

const schema = zod.object({
    email: zod.string().min(1, { message: 'Email is required' }).email(),
    password: zod.string().min(1, { message: 'Password is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { email: 'andre@logimade.io', password: 'Secret1' } satisfies Values;

export function SignInForm(): React.JSX.Element {
    const router = useRouter();

    const [showPassword, setShowPassword] = React.useState<boolean>();

    const [isPending, setIsPending] = React.useState<boolean>(false);

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/admin/packageReport'

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = React.useCallback(
        async (values: Values): Promise<void> => {
            setIsPending(true);

            const res = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl
            })

            if (res?.error) {
                setError('root', { type: 'server', message: res?.error });
                setIsPending(false);
                return;
            }

            // UserProvider, for this case, will not refresh the router
            // After refresh, GuestGuard will handle the redirect
            router.refresh();
        },
        [router, setError]
    );

    return (
        <Stack spacing={4}>
            <Stack spacing={1}>
                <Typography variant="h4">Sign in</Typography>
                <Typography color="text.secondary" variant="body2">
                    Don&apos;t have an account?{' '}
                    <Link component={RouterLink} href={paths.auth.signUp} underline="hover" variant="subtitle2">
                        Sign up
                    </Link>
                </Typography>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.email)}>
                                <InputLabel>Email address</InputLabel>
                                <OutlinedInput {...field} label="Email address" type="email" />
                                {errors.email ? <FormHelperText>{errors.email.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field }) => (
                            <FormControl error={Boolean(errors.password)}>
                                <InputLabel>Password</InputLabel>
                                <OutlinedInput
                                    {...field}
                                    endAdornment={
                                        showPassword ? (
                                            <VisibilityOutlinedIcon
                                                cursor="pointer"
                                                fontSize="medium"
                                                onClick={(): void => {
                                                    setShowPassword(false);
                                                }}
                                            />
                                        ) : (
                                            <VisibilityOffOutlinedIcon
                                                cursor="pointer"
                                                fontSize="medium"
                                                onClick={(): void => {
                                                    setShowPassword(true);
                                                }}
                                            />
                                        )
                                    }
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                />
                                {errors.password ? <FormHelperText>{errors.password.message}</FormHelperText> : null}
                            </FormControl>
                        )}
                    />
                    <div>
                        <Link component={RouterLink} href={paths.auth.forgotPassword} variant="subtitle2">
                            Forgot password?
                        </Link>
                    </div>
                    {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
                    <Button disabled={isPending} type="submit" variant="contained">
                        Sign in
                    </Button>
                </Stack>
            </form>
            {/*<Alert color="warning">*/}
            {/*    Use{' '}*/}
            {/*    <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">*/}
            {/*        sofia@devias.io*/}
            {/*    </Typography>{' '}*/}
            {/*    with password{' '}*/}
            {/*    <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">*/}
            {/*        Secret1*/}
            {/*    </Typography>*/}
            {/*</Alert>*/}
        </Stack>
    );
}