import './globals.css'

export const metadata = {
  title: 'Uniconnect-NG',
  description: 'Uniconnect Application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
  }
