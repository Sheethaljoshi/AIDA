import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import '@/styles/globals.css'
import Layout from '../components/Layout'

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider>
      {/* signedout: show SignInButton when user is not signed in */}
      <SignedOut>
        <div className="flex justify-center items-center h-screen">
          <SignInButton mode="modal" />
        </div>
      </SignedOut>

      {/* signedin: show UserButton when user is signed in */}
      <SignedIn>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <div className="fixed top-4 right-4">
          <UserButton />
        </div>
      </SignedIn>
    </ClerkProvider>
  )
}

export default MyApp
