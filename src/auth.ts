import NextAuth, {
  type DefaultSession,
  type NextAuthConfig,
  type Session,
} from 'next-auth';
import { type JWT } from 'next-auth/jwt';
import SpotifyProvider from 'next-auth/providers/spotify';

// Extend the built-in session types
interface SpotifySession extends DefaultSession {
  accessToken?: string;
  error?: string;
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
  } & DefaultSession['user'];
}

// Define token types
interface SpotifyToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
  user?: SpotifySession['user'];
}

// Spotify scopes
export const spotifyScopes = [
  'user-read-recently-played',
  'user-top-read',
  'user-read-playback-position',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'playlist-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-library-modify',
  'user-read-email',
  'user-read-private',
  'user-follow-read',
  'user-follow-modify',
].join(' ');

// Spotify authorization URL
const SPOTIFY_AUTHORIZATION_URL =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    scope: spotifyScopes,
  });

// NextAuth configuration
const config: NextAuthConfig = {
  providers: [
    SpotifyProvider({
      clientId: process.env.AUTH_SPOTIFY_ID ?? '',
      clientSecret: process.env.AUTH_SPOTIFY_SECRET ?? '',
      authorization: SPOTIFY_AUTHORIZATION_URL,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === '/dashboard') return !!auth;
      return true;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: SpotifyToken;
    }): Promise<SpotifySession> {
      // Cast the session to our custom type
      const spotifySession = session as SpotifySession;
      spotifySession.accessToken = token.accessToken;
      spotifySession.error = token.error;
      spotifySession.user = token.user as SpotifySession['user'];
      return spotifySession;
    },
    async jwt({ token, account, user }) {
      // Initial sign in
      if (account && user) {
        return {
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: (account.expires_at ?? 0) * 1000,
          user,
        };
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
