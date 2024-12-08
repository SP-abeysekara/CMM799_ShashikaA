import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowForward, Visibility, VisibilityOff } from "@mui/icons-material"
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

// Validation schema using Zod
const schema = z
  .object({
    firstName: z.string().nonempty({ message: "First name is required" }),
    lastName: z.string().nonempty({ message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const RegisterHome = ({ setRegisterStep, setUserDetails }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data) => {
    console.log(data)
    setUserDetails((prev) => ({ ...prev, ...data }))
    setRegisterStep((prev) => prev + 1)
  }

  return (
    <>
      <Typography variant='h4'>Your Details</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} width={300}>
          <TextField
            label='First Name'
            variant='outlined'
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName ? errors.firstName.message : ""}
          />
          <TextField
            label='Last Name'
            variant='outlined'
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName ? errors.lastName.message : ""}
          />
          <TextField
            label='Email'
            variant='outlined'
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email ? errors.email.message : ""}
          />
          <TextField
            label='Password'
            variant='outlined'
            type={showPassword ? "text" : "password"}
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password ? errors.password.message : ""}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label='Confirm Password'
            variant='outlined'
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={
              errors.confirmPassword ? errors.confirmPassword.message : ""
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type='submit'
            variant='contained'
            color='primary'
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default RegisterHome
