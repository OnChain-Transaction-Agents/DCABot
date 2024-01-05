import { redirect } from 'next/navigation'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Beep DCA Bot',
}

const Home = () => {
  redirect('/beep')
}

export default Home
