import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import User from '@/models/User'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/components/libs/mongoClient"

export const options = {
    // secret: process.env.NEXTAUTH_SECRET,

    adapter: MongoDBAdapter(clientPromise, {
      collections: {
        Accounts: 'oauth_accounts', // Custom name for the collection to store account data
        // Sessions: 'sessions', // Custom name for the collection to store session data
        Users: 'oauth_users', // Custom name for the collection to store user data
        // VerificationTokens: 'verification_tokens', // Custom name for the collection to store verification tokens
        // Add any other collections you want to customize
      },
    }),

    session: { strategy: "jwt" },

    providers: [
      GoogleProvider({
          profile(profile){
              // console.log('Profile Google: ', profile)

              let isAdmin = false
              if(profile.email === process.env.email_admin) {
                isAdmin = true
              }
              const userType = 'Google'
              return {
                  ...profile,
                  image: profile.picture,
                  id: profile.sub,
                  isAdmin: isAdmin,
                  userType
              }
          },
          clientId: process.env.GOOGLE_ID,
          clientSecret: process.env.GOOGLE_SECRET
      }),
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: { label: "email", type: "email", placeholder: "Your email" },
            password: { label: "password", type: "password", placeholder: "Your password" }
          },
          async authorize(credentials, req) {
            try {
                const user = await User.findOne({email: credentials.email})
                if(user){
                    const match = await user.comparePassword(credentials.password)
                    if(match){
                        delete user.password
                        
                        const userType = 'Credential'
                        let isAdmin = false
                        if(user.admin === true){
                            isAdmin = true
                        }
                        user["isAdmin"] = isAdmin
                        user["userType"] = userType

                       return user
                      } 
                } else {
                  return null
                }
              } catch (error) {
                console.log(error.message)
                throw error; // Throws a previously defined value (e.g. within a catch block)
                // throw new Error(error.message); // Throws a new Error object
                // return null
              } 

            return null
          }
        })
      ],
      callbacks: {
        async jwt({token, user}) {
            if(user){
              token.isAdmin = user.isAdmin
              token.userType = user.userType
              token.image = user.image
            }
            return token
        },
        async session({session, token,}){
           if(session?.user) {
            session.user.isAdmin = token.isAdmin 
            session.user.userType = token.userType 
            session.user.image = token.image
           }
           return session
        },
        async redirect({ url, baseUrl }) {
          // console.log(url, baseUrl)
          // Allows relative callback URLs
          if (url.startsWith("/")) return `${baseUrl}${url}`
          // Allows callback URLs on the same origin
          else if (new URL(url).origin === baseUrl) return url
          return baseUrl
        }
    },
    pages: {
        signIn: '/auth/signIn',
        signOut: '/auth/signOut',
        error: '/auth/authError', // Error code passed in query string as ?error=
      }
}