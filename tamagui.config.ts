import { createTamagui } from 'tamagui'
import { shorthands } from '@tamagui/shorthands'
import { themes, tokens } from '@tamagui/themes'
import { createMedia } from '@tamagui/react-native-media-driver'
import { createFont } from 'tamagui'

const poppins = createFont({
  family: 'Poppins',
  size: {
    1: 12,
    2: 14,
    3: 15,
    4: 16,
    5: 18,
    6: 20,
    7: 24,
    8: 28,
    9: 32,
    10: 36,
  },
  lineHeight: {
    1: 17,
    2: 19,
    3: 20,
    4: 21,
    5: 23,
    6: 25,
    7: 29,
    8: 33,
    9: 37,
    10: 41,
  },
  weight: {
    4: '400',
    6: '500',
    8: '600',
    9: '700',
  },
})

const config = createTamagui({
  themes: {
    light: {
      ...themes.light,
      primary: '#007AFF',  // iOS Blau
      secondary: '#5856D6', // Custom Lila
      background: '#ffffff',
      foreground: '#000000',
    },
    dark: {
      ...themes.dark,
      primary: '#0A84FF',  // iOS Dunkel-Blau
      secondary: '#5E5CE6', // Custom Dunkel-Lila
      background: '#000000',
      foreground: '#ffffff',
    }
  },
  tokens,
  shorthands,
  fonts: {
    heading: poppins,
    body: poppins,
  },
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
  }),
})

type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config 