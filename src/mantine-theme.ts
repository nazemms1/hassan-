import {
  createTheme,
  rem,
  type MantineColorsTuple,
  Card,
  Paper,
  Button,
  ActionIcon,
  TextInput,
  PasswordInput,
  Textarea,
  TagsInput,
  Badge,
  ThemeIcon,
  Modal,
  Drawer,
  Tooltip,
  Checkbox,
} from '@mantine/core'

// A light, professional blue — the site's single accent (--accent in index.css),
// reused as Mantine's primary scale so the admin speaks the same visual language
// as the public site rather than Mantine's stock indigo.
const accent: MantineColorsTuple = [
  '#e7f4ff',
  '#cde5ff',
  '#9cc8ff',
  '#67aaff',
  '#3da3ff',
  '#2b8ff0',
  '#1f7ddc',
  '#106bc4',
  '#005dad',
  '#004d94',
]

// Mirrors the site's --ink/--muted/--faint/--rule/--band/--ground tokens so
// Mantine's dark surfaces sit on the same slate ground, not its default charcoal.
// Index roles in Mantine: 0 = body text, 2 = dimmed text, 4 = borders,
// 6 = raised surface, 7 = body background.
const dark: MantineColorsTuple = [
  '#f2f5fa', // ink
  '#c8d0e0',
  '#9da9c1', // muted / dimmed
  '#687794', // faint
  '#25314a', // rule / borders
  '#1a2338',
  '#0d1526', // raised surface
  '#060c1b', // band / body
  '#030712', // ground
  '#020509',
]

export const theme = createTheme({
  primaryColor: 'accent',
  primaryShade: { light: 4, dark: 4 },
  colors: { accent, dark },
  autoContrast: true,

  fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
  fontFamilyMonospace: '"DM Mono", ui-monospace, monospace',
  headings: {
    fontFamily: 'Sora, ui-sans-serif, system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: rem(30), lineHeight: '1.2' },
      h2: { fontSize: rem(24), lineHeight: '1.25' },
      h3: { fontSize: rem(20), lineHeight: '1.3' },
      h4: { fontSize: rem(17), lineHeight: '1.35' },
      h5: { fontSize: rem(15), lineHeight: '1.4' },
    },
  },

  defaultRadius: 'md',
  radius: { md: rem(12), lg: rem(16), xl: rem(22) },

  shadows: {
    sm: '0 8px 20px -14px rgba(0, 0, 0, 0.9)',
    md: '0 18px 44px -28px rgba(0, 0, 0, 0.95)',
    lg: '0 26px 60px -32px rgba(0, 0, 0, 0.95)',
    xl: '0 34px 80px -36px rgba(0, 0, 0, 0.98)',
  },

  // Semantic defaults live here so JSX stays declarative instead of carrying
  // repeated styling props on every instance.
  components: {
    Card: Card.extend({ defaultProps: { radius: 'lg', padding: 'lg', withBorder: true } }),
    Paper: Paper.extend({ defaultProps: { radius: 'lg' } }),
    Button: Button.extend({ defaultProps: { radius: 'md' } }),
    ActionIcon: ActionIcon.extend({ defaultProps: { radius: 'md', variant: 'default', size: 'lg' } }),
    TextInput: TextInput.extend({ defaultProps: { radius: 'md' } }),
    PasswordInput: PasswordInput.extend({ defaultProps: { radius: 'md' } }),
    Textarea: Textarea.extend({ defaultProps: { radius: 'md', autosize: true, minRows: 3 } }),
    TagsInput: TagsInput.extend({ defaultProps: { radius: 'md' } }),
    Badge: Badge.extend({ defaultProps: { radius: 'sm' } }),
    ThemeIcon: ThemeIcon.extend({ defaultProps: { radius: 'lg', variant: 'light' } }),
    Checkbox: Checkbox.extend({ defaultProps: { radius: 'sm' } }),
    Tooltip: Tooltip.extend({ defaultProps: { withArrow: true, radius: 'md', openDelay: 250 } }),
    Modal: Modal.extend({
      defaultProps: { centered: true, radius: 'lg', overlayProps: { backgroundOpacity: 0.6, blur: 6 } },
    }),
    Drawer: Drawer.extend({
      defaultProps: { position: 'right', overlayProps: { backgroundOpacity: 0.6, blur: 6 } },
    }),
  },
})
