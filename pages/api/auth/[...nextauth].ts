import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify'
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify'

type Token = {
  accessToken: string
  accessTokenExpires: number
  refreshToken: string
}

async function refreshAccessToken(token: Token) {
  try {
    spotifyApi.setAccessToken(token.accessToken)
    spotifyApi.setRefreshToken(token.refreshToken)

    const { body: refreshedToken } = await spotifyApi.refreshAccessToken()
    console.log('REFRESHED TOKEN IS', refreshedToken)

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000, // = 1 hour as 3600 returns from spotify API
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken, // Replace if new one came back else fall back to old refresh token
    }
  } catch (error) {
    console.error(error)

    return {
      ...token,
      error: 'RefreshAccesstokenError',
    }
  }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET ?? '',
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET ?? '',
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }: any) {
      // initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpires: account.expires_at ?? 1 * 1000, // we are handling expiry times in Miliseconds hence * 1000
        }
      }

      // return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }

      // access token has expired, so we need to refresh it...
      console.log('ACCESS TOKEN HAS EXPIRED, REFRESHING...')
      return await refreshAccessToken(token)
    },

    async session({ session, token }: any) {
      session.user.accessToken = token.accessToken
      session.user.refreshToken = token.refreshToken
      session.user.username = token.username

      return session
    },
  },
})
