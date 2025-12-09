'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

export default function LoginClient() {
  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Card className="w-[360px] p-6 shadow-lg">
      <CardHeader className="flex flex-col items-center gap-4">

        <img
          className="w-20 h-20 object-contain"
          src="/images/6681204.png"
          alt="Login"
        />

        <div className="text-center space-y-1">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Login with Google to continue
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <Button className="w-full mt-4" onClick={loginWithGoogle}>
          Continue with Google
        </Button>
      </CardContent>
    </Card>
  )
}
