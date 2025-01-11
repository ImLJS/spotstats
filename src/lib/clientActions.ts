'use client'

import { ROUTES } from '@/constants/routes'
import { signIn, signOut } from 'next-auth/react'

export const handleClientLogIn = () => {
  signIn('spotify', { redirectTo: ROUTES.HOME })
}

export const handleClientLogOut = () => {
  signOut({ redirectTo: ROUTES.BASE })
}
